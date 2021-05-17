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
  describe.only('Post request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.body = {
        lots: [
            {
                lotCode: 'lot1903214',
                sku: 'sku12093801',
                cost: '9999',
                dateManufacture: new Date(),
                dateExpiration: new Date()
            },            {
                lotCode: 'lot1903212',
                sku: 'sku12093812',
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

    const mockRequestWithBadLot = () => {
      const req = {};
      req.body = {
        lots: [
          {
            sku: 'skue0218940',
            name: 'fake name',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, nostrum!',
            basePrice: {
              unit: 'Pallet',
              subUnit: 'Boxes',
              contains: 20,
              price: 99999,
            },
            priceRules: [
              {
                unit: 'Wrong',
                quantity: 10,
                price: 499999
              }
            ]
          },
          {
            sku: 'sku201381',
            name: 'fake name',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, nostrum!',
            basePrice: {
              unit: 'Pallet',
              subUnit: 'Boxes',
              contains: 20,
              price: 99999,
            },
            priceRules: [
              {
                unit: 'Pallet',
                quantity: 10,
                price: 499999
              }
            ]
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
      let dbLotCall = sandbox.stub(Lot, 'findOneAndUpdate').returns(fakeDbReturn);

      await createLot(req,res);
      expect(dbLotCall.callCount).to.equal(req.body.lots.length);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
    })
    it('should handle error when db lot call throws error', async () => {
      let req = mockRequest();
      let fakeDbReturn = mockDbReturn();
      let dbLotCall = sandbox.stub(Lot, 'findOneAndUpdate')
      dbLotCall.onCall(0).returns(fakeDbReturn);
      dbLotCall.onCall(1).throws();
      await createLot(req,res);

      expect(dbLotCall.callCount).to.equal(req.body.lots.length);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
  describe('Put request to /lot/:lotId', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        lotId:'fake0198123'
      }
      req.body = {
        sku: 'skue0218940',
        name: 'fake name',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, nostrum!',
        basePrice: {
          unit: 'Pallet',
          subUnit: 'Boxes',
          contains: 20,
          price: 99999,
        },
        priceRules: [
          {
            unit: 'Pallet',
            quantity: 10,
            price: 499999
          }
        ]
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }

    const mockRequestWithBadLot = () => {
      const req = {};
      req.body = {
        sku: 'skue0218940',
        name: 'fake name',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, nostrum!',
        basePrice: {
          unit: 'Pallet',
          subUnit: 'Boxes',
          contains: 20,
          price: 99999,
        },
        priceRules: [
          {
            unit: 'Wrong',
            quantity: 10,
            price: 499999
          }
        ]
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockLot = () => {
      return {name: 'fake'}
      
    }

    it('should update the lot', async () => {
      let req = mockRequest();
      let fakeLot = mockLot();
      let dbLotFind = sandbox.stub(Lot, 'findOne').returns(fakeLot);
      let dbLotUpdate = sandbox.stub(Lot, 'findOneAndUpdate')

      await editLot(req,res)
      expect(dbLotFind.calledOnce).to.be.true;
      expect(dbLotUpdate.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
    })

    it("should handle error if a product's price rule unit does not match base price unit", async () => {
      let req = mockRequestWithBadLot();
      let fakeLot = mockLot();
      let dbLotFind = sandbox.stub(Lot, 'findOne').returns(fakeLot);
      let dbLotUpdate = sandbox.stub(Lot, 'findOneAndUpdate')

      await editLot(req,res)
      expect(dbLotFind.calledOnce).to.be.false;
      expect(dbLotUpdate.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })

    it('should handle error if wrong object id is given', async () => {
      let req = mockRequestWithBadLot();
      let dbLotFind = sandbox.stub(Lot, 'findOne').throws({kind: 'ObjectId'})
      let dbLotUpdate = sandbox.stub(Lot, 'findOneAndUpdate')

      await editLot(req,res)
      expect(dbLotFind.calledOnce).to.be.false;
      expect(dbLotUpdate.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;    
    })

    it('should handle error if db lot find call returns undefined', async () => {
      let req = mockRequest();
      let dbLotFind = sandbox.stub(Lot, 'findOne').returns(undefined);
      let dbLotUpdate = sandbox.stub(Lot, 'findOneAndUpdate')

      await editLot(req,res)
      expect(dbLotFind.calledOnce).to.be.true;
      expect(dbLotUpdate.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error if db lot call throws', async () => {
      let req = mockRequest();
      let fakeLot = mockLot();
      let dbLotFind = sandbox.stub(Lot, 'findOne').throws();
      let dbLotUpdate = sandbox.stub(Lot, 'findOneAndUpdate');

      await editLot(req,res)
      expect(dbLotFind.calledOnce).to.be.true;
      expect(dbLotUpdate.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle error if db lot update call throws', async () => {
      let req = mockRequest();
      let fakeLot = mockLot();
      let dbLotFind = sandbox.stub(Lot, 'findOne').returns(fakeLot);
      let dbLotUpdate = sandbox.stub(Lot, 'findOneAndUpdate').throws();

      await editLot(req,res)
      expect(dbLotFind.calledOnce).to.be.true;
      expect(dbLotUpdate.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
})