const { getAuthUser, loginUser, passportUtils } = require('../../routes/api/controllers/auth');
const expect = require('chai').expect;
const sinon = require('sinon');
const passport = require('passport');



describe('API: Auth Route', () => {
  describe('Get request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.user = {
         isVerified: false,
         _id: '604f7c8d31c4ab00aaca213d',
         firstName: 'John',
         lastName: 'Davis',
         email: 'john@mail.com',
         roles: [
           {
             manager: false,
             worker: true,
             _id: '604f7c8d31c4ab00aaca213e',
             department: 'Sales'
           },
           {
             manager: false,
             worker: true,
             _id: '604f7c8d31c4ab00aaca213f',
             department: 'Inventory'
           },
           {
             manager: false,
             worker: true,
             _id: '604f7c8d31c4ab00aaca2140',
             department: 'Products'
           },
           {
             manager: false,
             worker: true,
             _id: '604f7c8d31c4ab00aaca2141',
             department: 'Warehouse'
           },
           {
             manager: false,
             worker: true,
             _id: '604f7c8d31c4ab00aaca2142',
             department: 'Fleet'
           },
           {
             manager: false,
             worker: true,
             _id: '604f7c8d31c4ab00aaca2143',
             department: 'Payments'
           },
           {
             manager: false,
             worker: true,
             _id: '604f7c8d31c4ab00aaca2144',
             department: 'Admin'
           }
         ],
         company: '604f7d979c71a600c675a3ce',
         date: '2021-03-15T15:26:05.171Z',
         __v: 0
       }
       return req;
    }
    
    const mockResponse = () => {
      const res = {};
      res.status;
      res.data = {}
      res.status = (statusCode) => res.status = statusCode
      res.send = (data) => res.data = data;
      res.json = (data) => res.data = data;
      return res
    }
    
    it('should return user', async () => {
      let req = mockRequest();
      let res = mockResponse();

      await getAuthUser(req,res);

      expect(res.data._id).to.be.equal('604f7c8d31c4ab00aaca213d');
    })
  })

  describe('Post request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.body = {
        email: 'john@mail.com',
        password: '123456'
      }
       return req;
    }
    
    const mockResponse = () => {
      const res = {};
      res.statusCode = '';
      res.data = {}
      res.status = sinon.stub();
      res.send = sinon.spy();
      res.json = sinon.spy();
      return res
    }

    
    let sandbox = sinon.createSandbox();
    let res = mockResponse();
    const goodCode = 200
    const badCode = 400
    const errorCode = 500

    beforeEach =(function(){
      sandbox.spy(res);
    })

    afterEach(function(){
      sandbox.restore();
    })

    // stub passport callback
    // stub passport authenticate to return callback
    // stub session util to return true (deleted session)
    
    it('should login user', async () => {
      let sessionUtilStub = sandbox.stub(passportUtils, 'deleteExistingSessions').returns(true);
      let callbackStub = sandbox.stub(passportUtils, 'passportCallback').returns(this);
      let passportStub = sandbox.stub(passport, 'authenticate').returns(callbackStub);

      let req = mockRequest();
      let next = sandbox.stub();

      await loginUser(req,res,next)
      expect(passportStub.calledOnce).to.be.true;
    })
  })
})