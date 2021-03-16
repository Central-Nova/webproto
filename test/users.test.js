const { getUsersByCompany, registerUser } = require('../routes/api/controllers/users');
const expect = require('chai').expect;
const sinon = require('sinon');
const passport = require('passport');
const User = require('../models/User');



describe('API: User Route', () => {
  describe('Get request to /', () => {
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

    // beforeEach(function() {
    //   let res = mockResponse();
    //   const sandbox = sinon.createSandbox();
    //   sandbox.spy(res);
    // })

    // afterEach(function() {
    //   sandbox.restore();
    // })

    it('should call res.send with users', async () => {
      const mockRequest = () => {
        const req = {};
        req.user = {
           isVerified: false,
           _id: '604f7c8d31c4ab00aaca213d',
           firstName: 'John',
           lastName: 'Davis',
           email: 'john@mail.com',
           company: '604f7d979c71a600c675a3ce',
           date: '2021-03-15T15:26:05.171Z',
           __v: 0
         }
         return req;
      }
      
      const mockUsers = () => {
        return [
          {
            name: 'Jack',
            company: 'Fake Company'
          },
          {
            name: 'Jack',
            company: 'Fake Company'
          },
        ]
      }

      let users = mockUsers();
      let req = mockRequest();
      let res = mockResponse();
      let next = sinon.stub();

      const sandbox = sinon.createSandbox();
      sandbox.spy(res);
      let stub = sinon.stub(User, 'find').returns({select:sinon.stub().returns(users)})


      await getUsersByCompany(req,res,next)
      expect(res.send.calledOnce).to.be.true;
      stub.restore();
      sandbox.restore();
    })
    it('should handle error if user does not have company ID', async () => {
      const mockRequest = () => {
        const req = {};
        req.user = {
           isVerified: false,
           _id: '604f7c8d31c4ab00aaca213d',
           firstName: 'John',
           lastName: 'Davis',
           email: 'john@mail.com',
           date: '2021-03-15T15:26:05.171Z',
           __v: 0
         }
         return req;
      }
      
      let req = mockRequest();
      let res = mockResponse();
      let next = sinon.stub();
      let expectedStatusCode = 400

      const sandbox = sinon.createSandbox();
      sandbox.spy(res);

      let stub = sinon.stub(User, 'find').returns({select:sinon.stub().returns(undefined)})
      
      await getUsersByCompany(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(expectedStatusCode)).to.be.true
      stub.restore();
      sandbox.restore();
    })
    it('should handle error when db call throws error', async () => {
      const mockRequest = () => {
        const req = {};
        req.user = {
           isVerified: false,
           _id: '604f7c8d31c4ab00aaca213d',
           firstName: 'John',
           lastName: 'Davis',
           email: 'john@mail.com',
           date: '2021-03-15T15:26:05.171Z',
           __v: 0
         }
         return req;
      }
      
      let req = mockRequest();
      let res = mockResponse();
      let next = sinon.stub();
      let expectedStatusCode = 500

      const sandbox = sinon.createSandbox();
      sandbox.spy(res);

      let stub = sinon.stub(User, 'find').returns({select:sinon.stub()}).throws()
      
      await getUsersByCompany(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(expectedStatusCode)).to.be.true
      stub.restore();
      sandbox.restore();
    })
  })
})