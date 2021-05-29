const expect = require('chai').expect;
const sinon = require('sinon');
const Inventory = require('../models/Inventory');
const { getInventory, getInventoryById, createInventory, editInventory } = require('../routes/api/controllers/inventory');

describe('API Inventory Route', () => {
  const mockResponse = () => {
    const res = {};
    res.statusCode = '';
    res.data = {}
    res.status = ()=> {
      return res
    };
    res.send = () => {
      return res
    };
    res.json = () => {
      return res
    };
    return res
  }

  const sandbox = sinon.createSandbox();
  let res = mockResponse();
  const goodCode = 200;
  const badCode = 400
  const errorCode = 500

  beforeEach(function() {
    sandbox.spy(res);
  })

  afterEach(function() {
    sandbox.restore();
  })


  describe('Get request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.query = {
        page: '',
        limit: '',
        sort: '',
        search: ''
      }
      req.user = {
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockInventory = () => {
      return [
        {
            serial: "serial102931",
            lot: "60ab917b18dac4006dacd9dc",
            product: "60858de105a244cd7564abd7",
            status: "sellable",
            },           
            {
            serial: "serial102932",
            lot: "60ab917b18dac4006dacd9dc",
            product: "60858de105a244cd7564abd8",
            status: "sellable",
            },            
            {
            serial: "serial102932",
            lot: "60ab917b18dac4006dacd9dc",
            product: "60858de105a244cd7564abd9",
            status: "sellable",
            },
      ]
    }

    let mockProducts = () => {
        return [
            {_id: '60858de105a244cd7564abd7', sku: 'sku-1234-1'},
            {_id: '60858de105a244cd7564abd8', sku: 'sku-1234-2'},
            {_id: '60858de105a244cd7564abd9', sku: 'sku-1234-3'},
        ]
    }

    let returnedInventory = () => {
        return [
            {_id: '60858de105a244cd7564abd7', sku: 'sku-1234-1', sellable: 1},
            {_id: '60858de105a244cd7564abd8', sku: 'sku-1234-2', sellable: 1},
            {_id: '60858de105a244cd7564abd9', sku: 'sku-1234-3', sellable: 1},
        ]
    }
    
    it('should call res.send with all inventory by company ID and meta data', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let formattedInventory = returnedInventory();
      let dbProductCall = sandbox.stub(Product, 'find').returns(fakeProducts)
      let dbProductCount = sandbox.stub(Product, 'countDocuments').returns(3);
      let dbInventoryCount = sandbox.stub(Inventory, 'countDocuments').returns(1);
  
      await getInventory(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCount.callCount).to.equal(fakeProducts.length);
      expect(dbProductCount.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith({
        total: fakeProducts.length,
        page: 0,
        limit: 0,
        inventory: formattedInventory
      })).to.be.true;
    })

    it('should handle error when db products call returns 0 products', async () => {
        let req = mockRequest();
        let dbProductCall = sandbox.stub(Product, 'find').returns([])
        let dbProductCount = sandbox.stub(Product, 'countDocuments').returns(3);
        let dbInventoryCount = sandbox.stub(Inventory, 'countDocuments').returns(undefined);
    
        await getInventory(req, res);
  
        expect(dbProductCall.calledOnce).to.be.true;
        expect(dbInventoryCount.callCount).to.equal(0);
        expect(dbProductCount.callCount).to.equal(0);
        expect(res.status.calledOnce).to.be.true;
        expect(res.status.calledWith(badCode)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
      })


    it('should handle error when db products call throws error', async () => {
      let req = mockRequest();
      let fakeInventory = mockInventory();
      let dbProductCall = sandbox.stub(Product, 'find').throws()
      let dbProductCount = sandbox.stub(Product, 'countDocuments').returns(3);
      let dbInventoryCount = sandbox.stub(Inventory, 'countDocuments').returns(fakeInventory.length)
  
      await getInventory(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCount.callCount).to.equal(0);
      expect(dbProductCount.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle error when db inventory countDocuments throws error', async () => {
      let req = mockRequest();
      let fakeInventory = mockInventory();
      let dbProductCall = sandbox.stub(Product, 'find').throws()
      let dbProductCount = sandbox.stub(Product, 'countDocuments').returns(3);
      let dbInventoryCount = sandbox.stub(Inventory, 'countDocuments').throws();
  
      await getInventory(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCount.callCount).to.equal(0);
      expect(dbProductCount.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

  })
  describe('Get request to /lot/:lotId', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        lotId: 'fakelot1912312'
      }
      req.user = {
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockLot = () => {
      return {name: 'fake'}
      
    }
    
    it('should call res.send with lot data', async () => {
      let req = mockRequest();
      let fakeLot = mockLot();
      let dbLotCall = sandbox.stub(Lot, 'findOne').returns(fakeLot);
 
      await getInventoryById(req, res);
      expect(dbLotCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(fakeLot)).to.be.true;
    })
    it('should handle error when db inventory call returns undefined', async () => {
      let req = mockRequest();
      let dbLotCall = sandbox.stub(Lot, 'findOne').returns(undefined);
 
      await getInventoryById(req, res);
      expect(dbLotCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })
    it('should handle error when db inventory call throws error', async () => {
      let req = mockRequest();
      let dbLotCall = sandbox.stub(Lot, 'findOne').throws();
 
      await getInventoryById(req, res);
      expect(dbLotCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
  describe('Post request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.body = {
        inventory: [
            {
                serial: 'serial1903214',
                product: 'product12093801',
                lot: 'lot1903214',
                status: 'sellable'
            },            
            {
                serial: 'serial1903215',
                product: 'product12093812',
                lot: 'lot1903214',
                status: 'sellable'
            },
        ]
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }

      
    it('should create a unit for each inventory object in req.body.inventory', async () => {
      let req = mockRequest();
      let dbInventoryCall = sandbox.stub(Inventory, 'findOne').returns(undefined);
      let save = sandbox.stub(Inventory.prototype, 'save').callsFake(()=> Promise.resolve(this));


      await createInventory(req,res);
      expect(dbInventoryCall.callCount).to.equal(req.body.inventory.length);
      expect(save.callCount).to.equal(req.body.inventory.length)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
    })
    it('should handle error when db inventory call throws error', async () => {
      let req = mockRequest();
      let dbInventoryCall = sandbox.stub(Inventory, 'findOne')
      dbInventoryCall.onCall(0).throws();
      let save = sandbox.stub(Inventory.prototype, 'save').callsFake(()=> Promise.resolve(this));
      await createInventory(req,res);

      expect(dbInventoryCall.callCount).to.equal(1);
      expect(save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
  describe('Put request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        lotId:'fake0198123'
      }
      req.body = {
        lots: [
          {
            currentLotCode: "lot1093812",
            newLotCode: "lot1093812",
            cost: "9999",
            dateExpiration: "2021-05-07T16:20:35.984Z",
            dateManufacture: "2021-05-07T16:20:35.984Z",
          },
          {
            currentLotCode: "lot1093813",
            newLotCode: "lot1093813",
            cost: "9999",
            dateExpiration: "2021-05-07T16:20:35.984Z",
            dateManufacture: "2021-05-07T16:20:35.984Z",
          },
        ]
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockLot = () => {
      return {
        _id: 'fake1908239041',
        lotCode: "lot1093812",
        cost: "9999",
        dateExpiration: "2021-05-07T16:20:35.984Z",
        dateManufacture: "2021-05-07T16:20:35.984Z",
        save: sandbox.stub()
      }
    }

    let secondMockLot = () => {
      return {
        _id: 'fake1908239051',
        name: 'fake',
        save: sandbox.stub()
      }
    }

    it('should update the lots', async () => {
      let req = mockRequest();
      let fakeLot = mockLot();
      let dbLotFind = sandbox.stub(Lot, 'findOne').returns(fakeLot);

      await editInventory(req,res)
      expect(dbLotFind.callCount).to.equal(req.body.lots.length * 2);
      expect(fakeLot.save.callCount).to.equal(req.body.lots.length);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
    })

    it('should handle error if new lot code is already in use', async () => {
      let req = mockRequest();
      let fakeLot = mockLot();
      let secondLot = secondMockLot();
      let dbLotFind = sandbox.stub(Lot, 'findOne')
      dbLotFind.onFirstCall().returns(fakeLot);
      dbLotFind.onSecondCall().returns(secondLot)


      await editInventory(req,res)
      expect(dbLotFind.calledTwice).to.be.true;
      expect(fakeLot.save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
    })

    it('should handle error if wrong object id is given', async () => {
      let req = mockRequest();
      let dbLotFind = sandbox.stub(Lot, 'findOne').throws({kind: 'ObjectId'})

      await editInventory(req,res)
      expect(dbLotFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;    
    })

    it('should handle error if db lot find call returns undefined', async () => {
      let req = mockRequest();
      let dbLotFind = sandbox.stub(Lot, 'findOne').returns(undefined);

      await editInventory(req,res)
      expect(dbLotFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error if db inventory call throws', async () => {
      let req = mockRequest();
      let dbLotFind = sandbox.stub(Lot, 'findOne').throws();

      await editInventory(req,res)
      expect(dbLotFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle error if lot save call throws', async () => {
      let req = mockRequest();
      let fakeLot = mockLot();
      let dbLotFind = sandbox.stub(Lot, 'findOne').returns(fakeLot);
      fakeLot.save = sandbox.stub().throws();

      await editInventory(req,res)
      expect(dbLotFind.calledTwice).to.be.true;
      expect(fakeLot.save.callCount).to.equal(1);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
})