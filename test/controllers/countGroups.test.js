const expect = require('chai').expect;
const sinon = require('sinon');
const Inventory = require('../../models/inventory/Inventory');
const CountGroup = require('../../models/inventory/CountGroup');
const { getCountGroups, getCountGroupsByProduct, getCountGroupById, createCountGroup, editCountGroup } = require('../../routes/api/controllers/countGroups');

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
      let dbProductCountGroups = sandbox.stub(Product, 'countGroupsDocuments').returns(3);
      let dbInventoryCountGroups = sandbox.stub(Inventory, 'countGroupsDocuments').returns(1);
  
      await getCountGroups(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCountGroups.callCountGroups).to.equal(fakeProducts.length);
      expect(dbProductCountGroups.calledOnce).to.be.true;
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
        let dbProductCountGroups = sandbox.stub(Product, 'countGroupsDocuments').returns(3);
        let dbInventoryCountGroups = sandbox.stub(Inventory, 'countGroupsDocuments').returns(undefined);
    
        await getCountGroups(req, res);
  
        expect(dbProductCall.calledOnce).to.be.true;
        expect(dbInventoryCountGroups.callCountGroups).to.equal(0);
        expect(dbProductCountGroups.callCountGroups).to.equal(0);
        expect(res.status.calledOnce).to.be.true;
        expect(res.status.calledWith(badCode)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
      })


    it('should handle error when db products call throws error', async () => {
      let req = mockRequest();
      let fakeInventory = mockInventory();
      let dbProductCall = sandbox.stub(Product, 'find').throws()
      let dbProductCountGroups = sandbox.stub(Product, 'countGroupsDocuments').returns(3);
      let dbInventoryCountGroups = sandbox.stub(Inventory, 'countGroupsDocuments').returns(fakeInventory.length)
  
      await getCountGroups(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCountGroups.callCountGroups).to.equal(0);
      expect(dbProductCountGroups.callCountGroups).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle error when db inventory countGroupsDocuments throws error', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let formattedInventory = returnedInventory();
      let dbProductCall = sandbox.stub(Product, 'find').returns(fakeProducts)
      let dbInventoryCountGroups = sandbox.stub(Inventory, 'countGroupsDocuments').throws();
      let dbProductCountGroups = sandbox.stub(Product, 'countGroupsDocuments').returns(3);
  
      await getCountGroups(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCountGroups.callCountGroups).to.equal(fakeProducts.length);
      expect(dbProductCountGroups.callCountGroups).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;

    })

    it('should handle error when db product countGroupsDocuments throws error', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let formattedInventory = returnedInventory();
      let dbProductCall = sandbox.stub(Product, 'find').returns(fakeProducts)
      let dbInventoryCountGroups = sandbox.stub(Inventory, 'countGroupsDocuments').returns(formattedInventory);
      let dbProductCountGroups = sandbox.stub(Product, 'countGroupsDocuments').throws();
  
      await getCountGroups(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCountGroups.callCountGroups).to.equal(fakeProducts.length);
      expect(dbProductCountGroups.calledOnce).to.be.true;
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

      let dbInventoryCountGroups = sandbox.stub(Inventory, 'countGroupsDocuments').returns(fakeInventory.length);
  
      await getCountGroupsByProduct(req, res);

      expect(dbInventoryCall.callCountGroups).to.equal(1);
      expect(dbInventoryCountGroups.callCountGroups).to.equal(1);
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
      let dbInventoryCountGroups = sandbox.stub(Inventory, 'countGroupsDocuments').returns(0);
  
      await getCountGroupsByProduct(req, res);

      expect(dbInventoryCall.callCountGroups).to.equal(1);
      expect(dbInventoryCountGroups.callCountGroups).to.equal(0);
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
      let dbInventoryCountGroups = sandbox.stub(Inventory, 'countGroupsDocuments').returns(0);
  
      await getCountGroupsByProduct(req, res);

      expect(dbInventoryCall.callCountGroups).to.equal(1);
      expect(dbInventoryCountGroups.callCountGroups).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
      })

    it('should handle error when db inventory countGroupsDocument throws error', async () => {
      let req = mockRequest();
      let dbInventoryCall = sandbox.stub(Inventory, 'find')
      .returns({select: sandbox.stub()
      .returns({sort: sandbox.stub()
      .returns({skip: sandbox.stub()
      .returns({limit: sandbox.stub()
      .throws()})})})});      
      let dbInventoryCountGroups = sandbox.stub(Inventory, 'countGroupsDocuments').throws();
  
      await getCountGroupsByProduct(req, res);

      expect(dbInventoryCall.callCountGroups).to.equal(1);
      expect(dbInventoryCountGroups.callCountGroups).to.equal(0);
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
 
      await getCountGroupById(req, res);
      expect(dbInventoryCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(fakeInventory)).to.be.true;
    })
    it('should handle error when db inventory call returns undefined', async () => {
      let req = mockRequest();
      let dbInventoryCall = sandbox.stub(Inventory, 'findOne').returns(undefined);
 
      await getCountGroupById(req, res);
      expect(dbInventoryCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })
    it('should handle error when db inventory call throws objectId error', async () => {
      let req = mockRequest();
      let dbInventoryCall = sandbox.stub(Inventory, 'findOne').throws({kind: 'ObjectId'});
 
      await getCountGroupById(req, res);
      expect(dbInventoryCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
  })
  describe.only('Post request to /', () => {
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