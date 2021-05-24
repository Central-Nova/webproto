const expect = require('chai').expect;
const sinon = require('sinon');
const Lot = require('../models/Lot');
const { getLots, getLotById, createLot, editLot } = require('../routes/api/controllers/lots');

describe('API Lot Route', () => {
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

    let mockLots = () => {
      return [
        {name: 'fake'},
        {name: 'sofake'}
      ]
    }
    
    it('should call res.send with all lots by company ID and meta data', async () => {
      let req = mockRequest();
      let fakeLots = mockLots();
      let dbLotCall = sandbox.stub(Lot, 'find').returns({sort: sandbox.stub().returns({skip: sandbox.stub().returns({limit: sandbox.stub().returns(fakeLots)})})});
      let dbLotCount = sandbox.stub(Lot, 'countDocuments').returns({sort: sandbox.stub().returns(fakeLots.length)})
  
      await getLots(req, res);

      expect(dbLotCall.calledOnce).to.be.true;
      expect(dbLotCount.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith({
        total: fakeLots.length,
        page: 0,
        limit: 0,
        lots: fakeLots
      })).to.be.true;

    })

    it('should handle error when db lot call returns undefined', async () => {
      let req = mockRequest();
      let fakeLots = mockLots();
      let dbLotCall = sandbox.stub(Lot, 'find').returns({sort: sandbox.stub().returns({skip: sandbox.stub().returns({limit: sandbox.stub().returns(undefined)})})});
      let dbLotCount = sandbox.stub(Lot, 'countDocuments').returns({sort: sandbox.stub().returns(fakeLots.length)})
  
      await getLots(req, res);

      expect(dbLotCall.calledOnce).to.be.true;
      expect(dbLotCount.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error when db lot countDocument returns undefined', async () => {
      let req = mockRequest();
      let fakeLots = mockLots();
      let dbLotCall = sandbox.stub(Lot, 'find').returns({sort: sandbox.stub().returns({skip: sandbox.stub().returns({limit: sandbox.stub().returns(fakeLots)})})});
      let dbLotCount = sandbox.stub(Lot, 'countDocuments').returns({sort: sandbox.stub().returns(undefined)})
  
      await getLots(req, res);

      expect(dbLotCall.calledOnce).to.be.true;
      expect(dbLotCount.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error when db lot call throws error', async () => {
      let req = mockRequest();
      let fakeLots = mockLots();
      let dbLotCall = sandbox.stub(Lot, 'find').returns({sort: sandbox.stub().returns({skip: sandbox.stub().returns({limit: sandbox.stub().throws()})})});
      let dbLotCount = sandbox.stub(Lot, 'countDocuments').returns({sort: sandbox.stub().returns(fakeLots.length)})
  
      await getLots(req, res);

      expect(dbLotCall.calledOnce).to.be.true;
      expect(dbLotCount.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle error when db lot countDocument throws error', async () => {
      let req = mockRequest();
      let fakeLots = mockLots();
      let dbLotCall = sandbox.stub(Lot, 'find').returns({sort: sandbox.stub().returns({skip: sandbox.stub().returns({limit: sandbox.stub().returns(fakeLots)})})});
      let dbLotCount = sandbox.stub(Lot, 'countDocuments').returns({sort: sandbox.stub().throws()})
  
      await getLots(req, res);

      expect(dbLotCall.calledOnce).to.be.true;
      expect(dbLotCount.calledOnce).to.be.true;
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
 
      await getLotById(req, res);
      expect(dbLotCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(fakeLot)).to.be.true;
    })
    it('should handle error when db lot call returns undefined', async () => {
      let req = mockRequest();
      let dbLotCall = sandbox.stub(Lot, 'findOne').returns(undefined);
 
      await getLotById(req, res);
      expect(dbLotCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })
    it('should handle error when db lot call throws error', async () => {
      let req = mockRequest();
      let dbLotCall = sandbox.stub(Lot, 'findOne').throws();
 
      await getLotById(req, res);
      expect(dbLotCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
  describe('Post request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.body = {
        lots: [
            {
                lotCode: 'lot1903214',
                product: 'product12093801',
                cost: '9999',
                dateManufacture: new Date(),
                dateExpiration: new Date()
            },            {
                lotCode: 'lot1903212',
                product: 'product12093812',
                cost: '9999',
                dateManufacture: new Date(),
                dateExpiration: new Date()
            },
         
        ]
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }

 
    const mockDbReturn = () => {
      return {
        lastErrorObject: {
          updatedExisting: false
        }
      }
    }
      
    it('should create a lot for each lot object in req.body.lots', async () => {
      let req = mockRequest();
      let fakeDbReturn = mockDbReturn();
      let dbLotCall = sandbox.stub(Lot, 'findOne').returns(undefined);
      let save = sandbox.stub(Lot.prototype, 'save').callsFake(()=> Promise.resolve(this));


      await createLot(req,res);
      expect(dbLotCall.callCount).to.equal(req.body.lots.length);
      expect(save.callCount).to.equal(req.body.lots.length)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
    })
    it('should handle error when db lot call throws error', async () => {
      let req = mockRequest();
      let fakeDbReturn = mockDbReturn();
      let dbLotCall = sandbox.stub(Lot, 'findOne')
      dbLotCall.onCall(0).throws();
      let save = sandbox.stub(Lot.prototype, 'save').callsFake(()=> Promise.resolve(this));
      await createLot(req,res);

      expect(dbLotCall.callCount).to.equal(1);
      expect(save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
  describe.only('Put request to /', () => {
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

      await editLot(req,res)
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


      await editLot(req,res)
      expect(dbLotFind.calledTwice).to.be.true;
      expect(fakeLot.save.callCount).to.equal(0);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
    })

    it('should handle error if wrong object id is given', async () => {
      let req = mockRequest();
      let dbLotFind = sandbox.stub(Lot, 'findOne').throws({kind: 'ObjectId'})

      await editLot(req,res)
      expect(dbLotFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;    
    })

    it('should handle error if db lot find call returns undefined', async () => {
      let req = mockRequest();
      let dbLotFind = sandbox.stub(Lot, 'findOne').returns(undefined);

      await editLot(req,res)
      expect(dbLotFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error if db lot call throws', async () => {
      let req = mockRequest();
      let dbLotFind = sandbox.stub(Lot, 'findOne').throws();

      await editLot(req,res)
      expect(dbLotFind.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle error if lot save call throws', async () => {
      let req = mockRequest();
      let fakeLot = mockLot();
      let dbLotFind = sandbox.stub(Lot, 'findOne').returns(fakeLot);
      fakeLot.save = sandbox.stub().throws();

      await editLot(req,res)
      expect(dbLotFind.calledTwice).to.be.true;
      expect(fakeLot.save.callCount).to.equal(1);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
})