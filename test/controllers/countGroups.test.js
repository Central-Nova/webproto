const expect = require('chai').expect;
const sinon = require('sinon');
const Inventory = require('../../models/inventory/Inventory');
const CountGroup = require('../../models/inventory/CountGroup');
const { getCountGroups, getCountGroupById, createCountGroup, editCountGroup } = require('../../routes/api/controllers/countGroups');

describe('API CountGroups Route', () => {
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

    let mockCountGroups = () => {
      return [
        {
        name: "fake901283",
        products: ['product1', 'product2'],
        },
        {
        name: "fake901283",
        products: ['product1', 'product2'],
        },             
      ]
    }
    
    it('should call res.send with all count groups by company ID', async () => {
      let req = mockRequest();
      let fakeCountGroups = mockCountGroups();
      let dbCountGroupCall = sandbox.stub(CountGroup, 'find').returns(fakeCountGroups)
  
      await getCountGroups(req, res);

      expect(dbCountGroupCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(fakeCountGroups)).to.be.true;
    })

    it('should handle error when db count groups call returns 0 products', async () => {
      let req = mockRequest();
      let dbCountGroupCall = sandbox.stub(CountGroup, 'find').returns(undefined)
  
      await getCountGroups(req, res);

      expect(dbCountGroupCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error when db count groups call throws error', async () => {
      let req = mockRequest();
      let dbCountGroupCall = sandbox.stub(CountGroup, 'find').throws()
  
      await getCountGroups(req, res);

      expect(dbCountGroupCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
  describe('Get request to /countGroup/:countGroupId', () => {
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

    let mockCountGroup = () => {
      return {
        name: 'fake901823',
        products: ['product1', 'product2']
      }
    }
    
    it('should call res.send with count group', async () => {
      let req = mockRequest();
      let fakeCountGroup = mockCountGroup();
      let dbCountGroupCall = sandbox.stub(CountGroup, 'findOne').returns(fakeCountGroup);
 
      await getCountGroupById(req, res);
      expect(dbCountGroupCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(fakeCountGroup)).to.be.true;
    })
    it('should handle error when db CountGroup call returns undefined', async () => {
      let req = mockRequest();
      let dbCountGroupCall = sandbox.stub(CountGroup, 'findOne').returns(undefined);
 
      await getCountGroupById(req, res);
      expect(dbCountGroupCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })
    it('should handle error when db CountGroup call throws objectId error', async () => {
      let req = mockRequest();
      let dbCountGroupCall = sandbox.stub(CountGroup, 'findOne').throws({kind: 'ObjectId'});
 
      await getCountGroupById(req, res);
      expect(dbCountGroupCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
  })
  describe('Post request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.body = {
        products: [
          '6081cb3a72f96229a6261d53',
          '6081cb3a72f96229a6261d55'
        ],
        name: 'Group 1'
      }
      req.user = {
        _id: '6081cb3a72f96229a6261d53',
        company: '6081cb3a72f96229a6261d55'
      }
      return req;
    }

    const mockProducts = () => {
      return [
        {_id: '6081cb3a72f96229a6261d21'},
        {_id: '6081cb3a72f96229a6261d22'},
      ]
    }
      
    it('should create a count group with each product in req.body.products', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let dbProductCall = sandbox.stub(Product, 'find').returns({select: sandbox.stub().returns(fakeProducts)});
      let save = sandbox.stub(CountGroup.prototype, 'save').callsFake(() => Promise.resolve(this))

      await createCountGroup(req,res);
      expect(dbProductCall.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
    it('should handle error when db product call returns undefined', async () => {
      let req = mockRequest();
      let dbProductCall = sandbox.stub(Product, 'find').returns({select: sandbox.stub().returns(undefined)});
      let save = sandbox.stub(CountGroup.prototype, 'save').callsFake(() => Promise.resolve(this))

      await createCountGroup(req,res);
      expect(dbProductCall.calledOnce).to.be.true;
      expect(save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
    it('should handle error when db product call throws error', async () => {
      let req = mockRequest();
      let dbProductCall = sandbox.stub(Product, 'find').returns({select: sandbox.stub().throws()});
      let save = sandbox.stub(CountGroup.prototype, 'save').callsFake(() => Promise.resolve(this))

      await createCountGroup(req,res);
      expect(dbProductCall.calledOnce).to.be.true;
      expect(save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
    it('should handle error when db product call throws error', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let dbProductCall = sandbox.stub(Product, 'find').returns({select: sandbox.stub().returns(fakeProducts)});
      let save = sandbox.stub(CountGroup.prototype, 'save').throws();

      await createCountGroup(req,res);
      expect(dbProductCall.calledOnce).to.be.true;
      expect(save.callCount).to.equal(1);
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

      await editCountGroup(req,res)
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


      await editCountGroup(req,res)
      expect(dbInventoryFind.calledTwice).to.be.true;
      expect(fakeInventory.save.callCountGroups).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
    })

    it('should handle error if wrong object id is given', async () => {
      let req = mockRequest();
      let dbInventoryFind = sandbox.stub(Inventory, 'findOne').throws({kind: 'ObjectId'})

      await editCountGroup(req,res)
      expect(dbInventoryFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;    
    })

    it('should handle error if db lot find call returns undefined', async () => {
      let req = mockRequest();
      let dbInventoryFind = sandbox.stub(Inventory, 'findOne').returns(undefined);

      await editCountGroup(req,res)
      expect(dbInventoryFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error if db inventory call throws', async () => {
      let req = mockRequest();
      let dbInventoryFind = sandbox.stub(Inventory, 'findOne').throws();

      await editCountGroup(req,res)
      expect(dbInventoryFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle error if inventory save call throws', async () => {
      let req = mockRequest();
      let fakeInventory = mockInventory();
      let dbInventoryFind = sandbox.stub(Inventory, 'findOne').returns(fakeInventory);
      fakeInventory.save = sandbox.stub().throws();

      await editCountGroup(req,res)
      expect(dbInventoryFind.calledTwice).to.be.true;
      expect(fakeInventory.save.callCountGroups).to.equal(1);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
})