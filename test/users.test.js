const { getUsersByCompany, getUsersByDepartment, getUsersByRole, getUsersByDepartmentandRole, registerUser } = require('../routes/api/controllers/users');
const expect = require('chai').expect;
const sinon = require('sinon');
const passport = require('passport');
const User = require('../models/User');



describe('API: User Route', () => {
  describe('Get request to /', () => {
    const mockRequestWithCompany = () => {
      const req = {};
      req.user = {
         _id: '604f7c8d31c4ab00aaca213d',
         company: '604f7d979c71a600c675a3ce',
       }
       return req;
    }

    const mockRequestNoCompany = () => {
      const req = {};
      req.user = {
         _id: '604f7c8d31c4ab00aaca213d',
       }
       return req;
    }

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

    let res = mockResponse();
    let next = sinon.stub();
    const sandbox = sinon.createSandbox();
    const badCode = 400
    const errorCode = 500


    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })

    it('should call res.send with users', async () => {
      let users = mockUsers();
      let req = mockRequestWithCompany();
      // Stub db call to return user
      let stub = sinon.stub(User, 'find').returns({select:sinon.stub().returns(users)})

      await getUsersByCompany(req,res,next)
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(users)).to.be.true;
      stub.restore();
    })

    it('should handle error if db does not return any users', async () => {
      let req = mockRequestNoCompany();
      // Stub db call to return undefined
      let stub = sinon.stub(User, 'find').returns({select:sinon.stub().returns(undefined)})
      
      await getUsersByCompany(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      stub.restore();
    })

    it('should handle error when db call throws error', async () => {
      let req = mockRequestNoCompany();
      // Stub db call to throw error
      let stub = sinon.stub(User, 'find').returns({select:sinon.stub()}).throws()
      
      await getUsersByCompany(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true
      stub.restore();
    })
  })
  describe('Get request to /department/:department', () => {
    const mockRequestWithCompany = () => {
      const req = {};
      req.params = {
        department: 'Sales'
      }
      req.user = {
         _id: '604f7c8d31c4ab00aaca213d',
         company: '604f7d979c71a600c675a3ce',
       }
       return req;
    }

    const mockRequestNoCompany = () => {
      const req = {};
      req.params = {
        department: 'Sales'
      }
      req.user = {
         _id: '604f7c8d31c4ab00aaca213d',
       }
       return req;
    }

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

    const mockUsers = () => {
      return [
        {
          name: 'Jack',
          company: 'Fake Company',
          roles: [
            {
            department: "Sales",
            manager: true,
            worker: true 
            },
            {
            department: "Products",
            manager: true,
            worker: true 
            },
            {
            department: "Inventory",
            manager: true,
            worker: true 
            },
            {
            department: "Warehouse",
            manager: true,
            worker: true 
            },
            {
            department: "Fleet",
            manager: true,
            worker: true 
            },
            {
            department: "Payments",
            manager: true,
            worker: true 
            },
            {
            department: "Admin",
            manager: true,
            worker: true 
            },
          ],
        },
        {
          name: 'Michael',
          company: 'Fake Company',
          roles: [
            {
            department: "Sales",
            manager: false,
            worker: true 
            },
            {
            department: "Products",
            manager: false,
            worker: true 
            },
            {
            department: "Inventory",
            manager: false,
            worker: true 
            },
            {
            department: "Warehouse",
            manager: false,
            worker: true 
            },
            {
            department: "Fleet",
            manager: false,
            worker: true 
            },
            {
            department: "Payments",
            manager: false,
            worker: true 
            },
            {
            department: "Admin",
            manager: false,
            worker: true 
            },
          ],
        },
      ]
    }

    let res = mockResponse();
    let next = sinon.stub();
    const sandbox = sinon.createSandbox();
    const badCode = 400
    const errorCode = 500


    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })

    it('should call res.send with users', async () => {
      let users = mockUsers();
      let req = mockRequestWithCompany();
      // Stub db call to return user
      let stub = sinon.stub(User, 'find').returns({select:sinon.stub().returns(users)})

      await getUsersByDepartment(req,res,next)
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(users)).to.be.true;
      stub.restore();
    })

    it('should handle error if user does not return any users', async () => {
      let req = mockRequestWithCompany();
      // Stub db call to return undefined
      let stub = sinon.stub(User, 'find').returns({select:sinon.stub().returns(undefined)})
      
      await getUsersByDepartment(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      stub.restore();
    })

    it('should handle error when db call throws error', async () => {
      let req = mockRequestNoCompany();
      // Stub db call to throw error
      let stub = sinon.stub(User, 'find').returns({select:sinon.stub()}).throws()
      
      await getUsersByDepartment(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true
      stub.restore();
    })
  })
  describe('Get request to /role/:role', () => {
    const mockRequestWithCompany = () => {
      const req = {};
      req.params = {
        role: 'manager'
      }
      req.user = {
         _id: '604f7c8d31c4ab00aaca213d',
         company: '604f7d979c71a600c675a3ce',
       }
       return req;
    }

    const mockRequestNoCompany = () => {
      const req = {};
      req.params = {
        role: 'manager'
      }
      req.user = {
         _id: '604f7c8d31c4ab00aaca213d',
       }
       return req;
    }

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

    const mockUsers = () => {
      return [
        {
          name: 'Jack',
          company: 'Fake Company',
          roles: [
            {
            department: "Sales",
            manager: true,
            worker: true 
            },
            {
            department: "Products",
            manager: true,
            worker: true 
            },
            {
            department: "Inventory",
            manager: true,
            worker: true 
            },
            {
            department: "Warehouse",
            manager: true,
            worker: true 
            },
            {
            department: "Fleet",
            manager: true,
            worker: true 
            },
            {
            department: "Payments",
            manager: true,
            worker: true 
            },
            {
            department: "Admin",
            manager: true,
            worker: true 
            },
          ],
        },
        {
          name: 'Michael',
          company: 'Fake Company',
          roles: [
            {
            department: "Sales",
            manager: false,
            worker: true 
            },
            {
            department: "Products",
            manager: false,
            worker: true 
            },
            {
            department: "Inventory",
            manager: false,
            worker: true 
            },
            {
            department: "Warehouse",
            manager: false,
            worker: true 
            },
            {
            department: "Fleet",
            manager: false,
            worker: true 
            },
            {
            department: "Payments",
            manager: false,
            worker: true 
            },
            {
            department: "Admin",
            manager: false,
            worker: true 
            },
          ],
        },
      ]
    }

    const mockFilteredUsers = () => {
      return [
        {
          name: 'Jack',
          company: 'Fake Company',
          roles: [
            {
            department: "Sales",
            manager: true,
            worker: true 
            },
            {
            department: "Products",
            manager: true,
            worker: true 
            },
            {
            department: "Inventory",
            manager: true,
            worker: true 
            },
            {
            department: "Warehouse",
            manager: true,
            worker: true 
            },
            {
            department: "Fleet",
            manager: true,
            worker: true 
            },
            {
            department: "Payments",
            manager: true,
            worker: true 
            },
            {
            department: "Admin",
            manager: true,
            worker: true 
            },
          ],
        },
      ]
    }

    let res = mockResponse();
    let next = sinon.stub();
    const sandbox = sinon.createSandbox();
    const badCode = 400
    const errorCode = 500


    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })

    it('should call res.send with users', async () => {
      let users = mockUsers();
      let filteredUsers = mockFilteredUsers();
      let req = mockRequestWithCompany();
      // Stub db call to return user
      let stub = sinon.stub(User, 'find').returns({select:sinon.stub().returns(users)})

      await getUsersByRole(req,res,next)
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(filteredUsers)).to.be.true;
      stub.restore();
    })

    it('should handle error if user does not return any users', async () => {
      let req = mockRequestWithCompany();
      // Stub db call to return undefined
      let stub = sinon.stub(User, 'find').returns({select:sinon.stub().returns(undefined)})
      
      await getUsersByRole(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      stub.restore();
    })

    it('should handle error when db call throws error', async () => {
      let req = mockRequestNoCompany();
      // Stub db call to throw error
      let stub = sinon.stub(User, 'find').returns({select:sinon.stub()}).throws()
      
      await getUsersByRole(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true
      stub.restore();
    })
  })
})