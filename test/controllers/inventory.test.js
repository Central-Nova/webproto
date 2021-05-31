const expect = require('chai').expect;
const sinon = require('sinon');
const Inventory = require('../../models/inventory/Inventory');
const { getInventory, getInventoryByProduct, getInventoryById, createInventory, editInventory } = require('../../routes/api/controllers/inventory');

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
      let fakeProducts = mockProducts();
      let formattedInventory = returnedInventory();
      let dbProductCall = sandbox.stub(Product, 'find').returns(fakeProducts)
      let dbInventoryCount = sandbox.stub(Inventory, 'countDocuments').throws();
      let dbProductCount = sandbox.stub(Product, 'countDocuments').returns(3);
  
      await getInventory(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCount.callCount).to.equal(fakeProducts.length);
      expect(dbProductCount.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;

    })

    it('should handle error when db product countDocuments throws error', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let formattedInventory = returnedInventory();
      let dbProductCall = sandbox.stub(Product, 'find').returns(fakeProducts)
      let dbInventoryCount = sandbox.stub(Inventory, 'countDocuments').returns(formattedInventory);
      let dbProductCount = sandbox.stub(Product, 'countDocuments').throws();
  
      await getInventory(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCount.callCount).to.equal(fakeProducts.length);
      expect(dbProductCount.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
  describe('Get request to /product/:productId', () => {
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
      req.params = {
        productId: '60858de105a244cd7564abd7'
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
            product: "60858de105a244cd7564abd7",
            status: "sellable",
            },            
            {
            serial: "serial102933",
            lot: "60ab917b18dac4006dacd9dc",
            product: "60858de105a244cd7564abd7",
            status: "sellable",
            },
      ]
    }
    
    it('should call res.send with all inventory by company ID and productId and meta data', async () => {
      let req = mockRequest();
      let fakeInventory = mockInventory();
      let dbInventoryCall = sandbox.stub(Inventory, 'find')
      .returns({select: sandbox.stub()
      .returns({sort: sandbox.stub()
      .returns({skip: sandbox.stub()
      .returns({limit: sandbox.stub()
      .returns(fakeInventory)})})})});

      let dbInventoryCount = sandbox.stub(Inventory, 'countDocuments').returns(fakeInventory.length);
  
      await getInventoryByProduct(req, res);

      expect(dbInventoryCall.callCount).to.equal(1);
      expect(dbInventoryCount.callCount).to.equal(1);
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith({
        total: fakeInventory.length,
        page: 0,
        limit: 0,
        inventory: fakeInventory
      })).to.be.true;
    })

    it('should handle error when db inventory call returns 0 inventory records', async () => {
      let req = mockRequest();
      let dbInventoryCall = sandbox.stub(Inventory, 'find')
      .returns({select: sandbox.stub()
      .returns({sort: sandbox.stub()
      .returns({skip: sandbox.stub()
      .returns({limit: sandbox.stub()
      .returns([])})})})});
      let dbInventoryCount = sandbox.stub(Inventory, 'countDocuments').returns(0);
  
      await getInventoryByProduct(req, res);

      expect(dbInventoryCall.callCount).to.equal(1);
      expect(dbInventoryCount.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      })

    it('should handle error when db inventory call throws error', async () => {
      let req = mockRequest();
      let dbInventoryCall = sandbox.stub(Inventory, 'find')
      .returns({select: sandbox.stub()
      .returns({sort: sandbox.stub()
      .returns({skip: sandbox.stub()
      .returns({limit: sandbox.stub()
      .throws()})})})});      
      let dbInventoryCount = sandbox.stub(Inventory, 'countDocuments').returns(0);
  
      await getInventoryByProduct(req, res);

      expect(dbInventoryCall.callCount).to.equal(1);
      expect(dbInventoryCount.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
      })

    it('should handle error when db inventory countDocument throws error', async () => {
      let req = mockRequest();
      let dbInventoryCall = sandbox.stub(Inventory, 'find')
      .returns({select: sandbox.stub()
      .returns({sort: sandbox.stub()
      .returns({skip: sandbox.stub()
      .returns({limit: sandbox.stub()
      .throws()})})})});      
      let dbInventoryCount = sandbox.stub(Inventory, 'countDocuments').throws();
  
      await getInventoryByProduct(req, res);

      expect(dbInventoryCall.callCount).to.equal(1);
      expect(dbInventoryCount.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
      })

  })
  describe('Get request to /inventory/:inventoryId', () => {
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
      req.params = {
        productId: '60b38f90463513003a794998'
      }
      return req;
    }

    let mockInventory = () => {
      return {
        _id: "60b38f90463513003a794998",
        company: "607da9ab78caf50039e60be2",
        serial: "serial102921",
        lot: "60b38eb03ead17002ccd2ebd",
        product: "6081cb3a72f96229a6261d53",
        status: "sellable",
      }
    }
    
    it('should call res.send with inventory data', async () => {
      let req = mockRequest();
      let fakeInventory = mockInventory();
      let dbInventoryCall = sandbox.stub(Inventory, 'findOne').returns(fakeInventory);
 
      await getInventoryById(req, res);
      expect(dbInventoryCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(fakeInventory)).to.be.true;
    })
    it('should handle error when db inventory call returns undefined', async () => {
      let req = mockRequest();
      let dbInventoryCall = sandbox.stub(Inventory, 'findOne').returns(undefined);
 
      await getInventoryById(req, res);
      expect(dbInventoryCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })
    it('should handle error when db inventory call throws objectId error', async () => {
      let req = mockRequest();
      let dbInventoryCall = sandbox.stub(Inventory, 'findOne').throws({kind: 'ObjectId'});
 
      await getInventoryById(req, res);
      expect(dbInventoryCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
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
  describe('Put request to /inventory/:inventoryId', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        inventoryId:'60b38f90463513003a794998'
      }
      req.body = {
          lotCode: "lot1093812",
          serial: 'serial90321123',
          status: 'sellable'
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockInventory = () => {
      return {
        _id: 'fake1908239041',
        lot: "lot1093812",
        serial: "serial102938",
        status: 'sellable',
        save: sandbox.stub()
      }
    }

    let secondMockInventory = () => {
      return {
        _id: 'different9012832',
        lot: "lot1093812",
        serial: "serial102938",
        status: 'sellable',
        save: sandbox.stub()
      }
    }

    it('should update the inventory', async () => {
      let req = mockRequest();
      let fakeInventory = mockInventory();
      let dbInventoryFind = sandbox.stub(Inventory, 'findOne').returns(fakeInventory);

      await editInventory(req,res)
      expect(dbInventoryFind.calledTwice).to.be.true;
      expect(fakeInventory.save.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
    })

    it('should handle error if new inventory code is already in use', async () => {
      let req = mockRequest();
      let fakeInventory = mockInventory();
      let secondInventory = secondMockInventory();
      let dbInventoryFind = sandbox.stub(Inventory, 'findOne')
      dbInventoryFind.onFirstCall().returns(fakeInventory);
      dbInventoryFind.onSecondCall().returns(secondInventory)


      await editInventory(req,res)
      expect(dbInventoryFind.calledTwice).to.be.true;
      expect(fakeInventory.save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
    })

    it('should handle error if wrong object id is given', async () => {
      let req = mockRequest();
      let dbInventoryFind = sandbox.stub(Inventory, 'findOne').throws({kind: 'ObjectId'})

      await editInventory(req,res)
      expect(dbInventoryFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;    
    })

    it('should handle error if db lot find call returns undefined', async () => {
      let req = mockRequest();
      let dbInventoryFind = sandbox.stub(Inventory, 'findOne').returns(undefined);

      await editInventory(req,res)
      expect(dbInventoryFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error if db inventory call throws', async () => {
      let req = mockRequest();
      let dbInventoryFind = sandbox.stub(Inventory, 'findOne').throws();

      await editInventory(req,res)
      expect(dbInventoryFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle error if inventory save call throws', async () => {
      let req = mockRequest();
      let fakeInventory = mockInventory();
      let dbInventoryFind = sandbox.stub(Inventory, 'findOne').returns(fakeInventory);
      fakeInventory.save = sandbox.stub().throws();

      await editInventory(req,res)
      expect(dbInventoryFind.calledTwice).to.be.true;
      expect(fakeInventory.save.callCount).to.equal(1);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
})