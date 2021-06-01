const expect = require('chai').expect;
const sinon = require('sinon');
const Inventory = require('../../models/inventory/Inventory');
const Count = require('../../models/inventory/Count');
const { getCounts, getCountById, createCount, editCount, editCountInventoryData } = require('../../routes/api/controllers/counts');

describe('API Count Route', () => {
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

    let mockCounts = () => {
        return [
            {_id: '60858de105a244cd7564abd7', name: 'Count-1234-1'},
            {_id: '60858de105a244cd7564abd8', name: 'Count-1234-2'},
            {_id: '60858de105a244cd7564abd9', name: 'Count-1234-3'},
        ]
    }

    
    it('should call res.send with all counts by company ID and meta data', async () => {
      let req = mockRequest();
      let fakeCounts = mockCounts();
      let dbCountCall = sandbox.stub(Count, 'find')
      .returns({sort: sandbox.stub()
        .returns({skip: sandbox.stub()
          .returns({limit: sandbox.stub()
            .returns(fakeCounts)
      })})})

      let dbCountTotalDocuments = sandbox.stub(Count, 'countDocuments').returns(3);
  
      await getCounts(req, res);

      expect(dbCountCall.calledOnce).to.be.true;
      expect(dbCountTotalDocuments.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith({
        total: fakeCounts.length,
        page: 0,
        limit: 0,
        counts: fakeCounts
      })).to.be.true;
    })

    it('should handle error when db counts call returns 0 counts', async () => {
      let req = mockRequest();
      let dbCountCall = sandbox.stub(Count, 'find')
      .returns({sort: sandbox.stub()
        .returns({skip: sandbox.stub()
          .returns({limit: sandbox.stub()
            .returns([])
      })})})

      let dbCountTotalDocuments = sandbox.stub(Count, 'countDocuments').returns(3);
  
      await getCounts(req, res);

      expect(dbCountCall.calledOnce).to.be.true;
      expect(dbCountTotalDocuments.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error when db counts call receives wrong object id', async () => {
      let req = mockRequest();
      let dbCountCall = sandbox.stub(Count, 'find')
      .returns({sort: sandbox.stub()
        .returns({skip: sandbox.stub()
          .returns({limit: sandbox.stub()
            .throws({kind: 'ObjectId'})
      })})})

      let dbCountTotalDocuments = sandbox.stub(Count, 'countDocuments').returns(3);
  
      await getCounts(req, res);

      expect(dbCountCall.calledOnce).to.be.true;
      expect(dbCountTotalDocuments.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error when db count countDocuments throws error', async () => {
      let req = mockRequest();
      let fakeCounts = mockCounts();
      let dbCountCall = sandbox.stub(Count, 'find')
      .returns({sort: sandbox.stub()
        .returns({skip: sandbox.stub()
          .returns({limit: sandbox.stub()
            .returns(fakeCounts)
      })})})
      let dbCountTotalDocuments = sandbox.stub(Count, 'countDocuments').throws();
  
      await getCounts(req, res);

      expect(dbCountCall.calledOnce).to.be.true;
      expect(dbCountTotalDocuments.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
  describe('Get request to /count/:countId', () => {
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
        countId: '60b38f90463513003a794998'
      }
      return req;
    }

    let mockCount = () => {
      return {
        completed: false,
        _id: "60b583b74e0e93008551c179",
        company: "607da9ab78caf50039e60be2",
        name: "Sixth Test Count",
        type: "Cycle",
        method: "Blind",
        scheduled: "2021-05-31T14:36:11.579Z",
        inventoryData: [
            {
              record: {
                  product: {
                      _id: "6081cb3a72f96229a6261d53",
                      sku: "TSH-MED-WHI-COT-6"
                  },
                  serial: "serial102921",
                  lot: "60b38eb03ead17002ccd2ebd",
                  status: "sellable"
              },
              _id: "60b583b74e0e93008551c17a",
              counts: []
            },
            {
              record: {
                  product: {
                      _id: "6081cb3a72f96229a6261d53",
                      sku: "TSH-MED-WHI-COT-6"
                  },
                  serial: "serial102922",
                  lot: "60b38eb03ead17002ccd2ebd",
                  status: "sellable"
              },
              _id: "60b583b74e0e93008551c17b",
              counts: []
            }
        ],
      }
    }
    
    it('should call res.send with count data', async () => {
      let req = mockRequest();
      let fakeCount = mockCount();
      let dbCountCall = sandbox.stub(Count, 'findOne').returns(fakeCount);
 
      await getCountById(req, res);
      expect(dbCountCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(fakeCount)).to.be.true;
    })
    it('should handle error when db count call returns undefined', async () => {
      let req = mockRequest();
      let dbCountCall = sandbox.stub(Count, 'findOne').returns(undefined);
 
      await getCountById(req, res);
      expect(dbCountCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
    it('should handle error when db inventory call throws objectId error', async () => {
      let req = mockRequest();
      let dbCountCall = sandbox.stub(Count, 'findOne').throws({kind: 'ObjectId'});
 
      await getCountById(req, res);
      expect(dbCountCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
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
        name: 'New Test Count', 
        type: 'Cycle', 
        method: 'Blind', 
        scheduled: new Date(),
      }
      req.user = {
        _id: '6081cb3a72f96229a6261d21',
        company: '6081cb3a72f96229a6261d14'
      }
      return req;
    }

    const mockProducts = () => {
      return [
        {_id: '6081cb3a72f96229a6261d53'},
        {_id: '6081cb3a72f96229a6261d55'},
      ]
    }

    const mockInventory = () => {
      return [
        {
          _id: '6081cb3a72f96229a6261d33',
          lot: '321cb3a7123229a6261d33',
          serial: 'serial190238',
          status: 'sellable'
        },
        {
          _id: '6081cb3a72f96229a6261d34',
          lot: '321cb3a7123229a6261d34',
          serial: 'serial190239',
          status: 'sellable'
        },
      ]
    }

      
    it('should create a count record with inventory of products in req.body.products', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts()
      let fakeInventory = mockInventory();
      let dbProductCall = sandbox.stub(Product, 'find').returns({select: sandbox.stub().returns(fakeProducts)});
      let dbInventoryCall = sandbox.stub(Inventory, 'find').returns({populate: sandbox.stub().returns({select: sandbox.stub().returns(fakeInventory)})});
      let save = sandbox.stub(Count.prototype, 'save').callsFake(() => Promise.resolve(this))

      await createCount(req,res);
      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCall.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })
    it('should handle error when db product call gets wrong object id', async () => {
      let req = mockRequest();
      let fakeInventory = mockInventory();
      let dbProductCall = sandbox.stub(Product, 'find').returns({select: sandbox.stub().throws({kind: 'ObjectId'})});
      let dbInventoryCall = sandbox.stub(Inventory, 'find').returns({populate: sandbox.stub().returns({select: sandbox.stub().returns(fakeInventory)})});
      let save = sandbox.stub(Count.prototype, 'save').callsFake(() => Promise.resolve(this))

      await createCount(req,res);
      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCall.callCount).to.equal(0);
      expect(save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;    
    })
    it('should handle error when db inventory call gets wrong object id', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let dbProductCall = sandbox.stub(Product, 'find').returns({select: sandbox.stub().returns(fakeProducts)});
      let dbInventoryCall = sandbox.stub(Inventory, 'find').returns({populate: sandbox.stub().returns({select: sandbox.stub().throws({kind: 'ObjectId'})})});
      let save = sandbox.stub(Count.prototype, 'save').callsFake(() => Promise.resolve(this))

      await createCount(req,res);
      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbInventoryCall.calledOnce).to.be.true;
      expect(save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;    
    })
  })
  describe('Put request to /count/:countId', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        countId: '60b583b74e0e93008551c179'
      }
      req.body = {
        name:'Brand New Name',
        type: 'Cycle',
        method: 'Blind',
        scheduled: "2021-05-31T14:36:11.579Z",
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockCount = () => {
      return {
        completed: false,
        _id: "60b583b74e0e93008551c179",
        company: "607da9ab78caf50039e60be2",
        name: "Sixth Test Count",
        type: "Cycle",
        method: "Blind",
        scheduled: "2021-05-31T14:36:11.579Z",
        inventoryData: [
            {
              record: {
                  product: {
                      _id: "6081cb3a72f96229a6261d53",
                      sku: "TSH-MED-WHI-COT-6"
                  },
                  serial: "serial102921",
                  lot: "60b38eb03ead17002ccd2ebd",
                  status: "sellable"
              },
              _id: "60b583b74e0e93008551c17a",
              counts: []
            },
            {
              record: {
                  product: {
                      _id: "6081cb3a72f96229a6261d53",
                      sku: "TSH-MED-WHI-COT-6"
                  },
                  serial: "serial102922",
                  lot: "60b38eb03ead17002ccd2ebd",
                  status: "sellable"
              },
              _id: "60b583b74e0e93008551c17b",
              counts: []
            }
        ],
        save: sandbox.stub()
      }
    }

    it('should update the count record', async () => {
      let req = mockRequest();
      let fakeCount = mockCount();
      let dbCountFind = sandbox.stub(Count, 'findOne').returns(fakeCount);

      expect(fakeCount.name === req.body.name).to.be.false;
      await editCount(req,res)
      expect(dbCountFind.calledOnce).to.be.true;
      expect(fakeCount.save.calledOnce).to.be.true;
      expect(fakeCount.name).to.equal(req.body.name)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
    })
    it('should handle error if wrong object id is given', async () => {
      let req = mockRequest();
      let fakeCount = mockCount();
      let dbCountFind = sandbox.stub(Count, 'findOne').throws({kind: 'ObjectId'});

      await editCount(req,res)
      expect(dbCountFind.calledOnce).to.be.true;
      expect(fakeCount.save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
    it('should handle error if db count call returns undefined', async () => {
      let req = mockRequest();
      let fakeCount = mockCount();
      let dbCountFind = sandbox.stub(Count, 'findOne').returns(undefined);

      await editCount(req,res)
      expect(dbCountFind.calledOnce).to.be.true;
      expect(fakeCount.save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
    it('should handle error if db count call throws', async () => {
      let req = mockRequest();
      let fakeCount = mockCount();
      let dbCountFind = sandbox.stub(Count, 'findOne').throws({kind: 'ObjectId'});

      await editCount(req,res)
      expect(dbCountFind.calledOnce).to.be.true;
      expect(fakeCount.save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
    it('should handle error if count save call throws', async () => {
      let req = mockRequest();
      let fakeCount = mockCount();
      let dbCountFind = sandbox.stub(Count, 'findOne').returns(fakeCount);
      fakeCount.save = sandbox.stub().throws();


      expect(fakeCount.name === req.body.name).to.be.false;
      await editCount(req,res)
      expect(dbCountFind.calledOnce).to.be.true;
      expect(fakeCount.save.calledOnce).to.be.true;
      expect(fakeCount.name).to.equal(req.body.name)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
  describe.only('Put request to /count/:countId/inventoryData/:inventoryDataId', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        countId: '60b53b1c5a297a0217b4f392',
        inventoryDataId: '60b583b74e0e93008551c17a'
      }
      req.body = {
        result: true
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockCount = () => {
      return {
        completed: false,
        _id: "60b583b74e0e93008551c179",
        company: "607da9ab78caf50039e60be2",
        name: "Sixth Test Count",
        type: "Cycle",
        method: "Blind",
        scheduled: "2021-05-31T14:36:11.579Z",
        inventoryData: [
            {
              record: {
                  product: {
                      _id: "6081cb3a72f96229a6261d53",
                      sku: "TSH-MED-WHI-COT-6"
                  },
                  serial: "serial102921",
                  lot: "60b38eb03ead17002ccd2ebd",
                  status: "sellable"
              },
              _id: "60b583b74e0e93008551c17a",
              counts: []
            },
            {
              record: {
                  product: {
                      _id: "6081cb3a72f96229a6261d53",
                      sku: "TSH-MED-WHI-COT-6"
                  },
                  serial: "serial102922",
                  lot: "60b38eb03ead17002ccd2ebd",
                  status: "sellable"
              },
              _id: "60b583b74e0e93008551c17b",
              counts: []
            }
        ],
        save: sandbox.stub()
      }
    }

    it('should update the count record', async () => {
      let req = mockRequest();
      let fakeCount = mockCount();
      let dbCountFind = sandbox.stub(Count, 'findOne').returns(fakeCount);

      expect(fakeCount.inventoryData[0].counts.length).to.equal(0);
      await editCountInventoryData(req,res)
      expect(dbCountFind.calledOnce).to.be.true;
      expect(fakeCount.save.calledOnce).to.be.true;
      expect(fakeCount.inventoryData[0].counts.length).to.equal(1);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
    })
    it('should handle error if wrong object id is given', async () => {
      let req = mockRequest();
      let fakeCount = mockCount();
      let dbCountFind = sandbox.stub(Count, 'findOne').throws({kind: 'ObjectId'});

      expect(fakeCount.inventoryData[0].counts.length).to.equal(0);
      await editCountInventoryData(req,res)
      expect(dbCountFind.calledOnce).to.be.true;
      expect(fakeCount.save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })
    it('should handle error if db count call returns undefined', async () => {
      let req = mockRequest();
      let fakeCount = mockCount();
      let dbCountFind = sandbox.stub(Count, 'findOne').returns(undefined);

      expect(fakeCount.inventoryData[0].counts.length).to.equal(0);
      await editCountInventoryData(req,res)
      expect(dbCountFind.calledOnce).to.be.true;
      expect(fakeCount.save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
    it('should handle error if count save call throws', async () => {
      let req = mockRequest();
      let fakeCount = mockCount();
      let dbCountFind = sandbox.stub(Count, 'findOne').returns(fakeCount);
      fakeCount.save = sandbox.stub().throws();

      expect(fakeCount.inventoryData[0].counts.length).to.equal(0);
      await editCountInventoryData(req,res)
      expect(dbCountFind.calledOnce).to.be.true;
      expect(fakeCount.save.calledOnce).to.be.true;
      expect(fakeCount.inventoryData[0].counts.length).to.equal(1);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
})