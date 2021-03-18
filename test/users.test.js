const { getUsersByCompany, getUsersByDepartment, getUsersByRole, getUsersByDepartmentAndRole, registerUser ,registerUserWithLink, addCompanyToUser, addCompanyToUserWithCode, editUserRoles } = require('../routes/api/controllers/users');
const expect = require('chai').expect;
const sinon = require('sinon');
const User = require('../models/User');
const Company = require('../models/Company');
const Invitation = require('../models/Invitation');


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

    const sandbox = sinon.createSandbox();
    let res = mockResponse();
    let next = sandbox.stub();
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
      let dbCall = sandbox.stub(User, 'find').returns({select:sandbox.stub().returns(users)})

      await getUsersByCompany(req,res,next)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(users)).to.be.true;
      })

    it('should handle error if db does not return any users', async () => {
      let req = mockRequestNoCompany();
      // Stub db call to return undefined
      let dbCall = sandbox.stub(User, 'find').returns({select:sandbox.stub().returns(undefined)})
      
      await getUsersByCompany(req,res,next)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      })

    it('should handle error when db call throws error', async () => {
      let req = mockRequestNoCompany();
      // Stub db call to throw error
      let dbCall = sandbox.stub(User, 'find').returns({select:sandbox.stub()}).throws()
      
      await getUsersByCompany(req,res,next)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true
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

    const mockRequestWrongDepartment = () => {
      const req = {};
      req.params = {
        department: 'Fake'
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
          ],
        },
        {
          name: 'Michael',
          company: 'Fake Company',
          roles: [
            {
            department: "Sales",
            manager: false,
            worker: false 
            },
            {
            department: "Products",
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
          ],
        },
      ]
    }

    const sandbox = sinon.createSandbox();
    let res = mockResponse();
    let next = sandbox.stub();
    const badCode = 400
    const errorCode = 500


    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })

    it('should call res.send with users filtered by department', async () => {
      let users = mockUsers();
      let filteredUsers = mockFilteredUsers();
      let req = mockRequestWithCompany();
      // Stub db call to return user
      let dbCall = sandbox.stub(User, 'find').returns({select:sandbox.stub().returns(users)})

      await getUsersByDepartment(req,res,next)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(filteredUsers)).to.be.true;
      })

    it('should handle error if user does not return any users', async () => {
      let req = mockRequestWithCompany();
      // Stub db call to return undefined
      let dbCall = sandbox.stub(User, 'find').returns({select:sandbox.stub().returns(undefined)})
      
      await getUsersByDepartment(req,res,next)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      })

    it('should handle error when db call throws error', async () => {
      let req = mockRequestNoCompany();
      // Stub db call to throw error
      let dbCall = sandbox.stub(User, 'find').returns({select:sandbox.stub()}).throws()
      
      await getUsersByDepartment(req,res,next)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true
      })
    it('should handle error when invalid department is used in req.params', async () => {
      let req = mockRequestWrongDepartment();
      
      await getUsersByDepartment(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true
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

    const mockRequestWrongRole = () => {
      const req = {};
      req.params = {
        role: 'Fake'
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
          ],
        },
      ]
    }

    const sandbox = sinon.createSandbox();
    let res = mockResponse();
    let next = sandbox.stub();
    const badCode = 400
    const errorCode = 500


    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })

    it('should call res.send with users filtered by role', async () => {
      let users = mockUsers();
      let filteredUsers = mockFilteredUsers();
      let req = mockRequestWithCompany();
      // Stub db call to return user
      let dbCall = sandbox.stub(User, 'find').returns({select:sandbox.stub().returns(users)})

      await getUsersByRole(req,res,next)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(filteredUsers)).to.be.true;
      })

    it('should handle error if user does not return any users', async () => {
      let req = mockRequestWithCompany();
      // Stub db call to return undefined
      let dbCall = sandbox.stub(User, 'find').returns({select:sandbox.stub().returns(undefined)})
      
      await getUsersByRole(req,res,next)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      })

    it('should handle error when db call throws error', async () => {
      let req = mockRequestNoCompany();
      // Stub db call to throw error
      let dbCall = sandbox.stub(User, 'find').returns({select:sandbox.stub()}).throws()
      
      await getUsersByRole(req,res,next)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true
      })

    it('should handle error when invalid role is used in req.params', async () => {
      let req = mockRequestWrongRole();
     
      await getUsersByRole(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true
    })
  })
  describe('Get request to /department/:department/role/:role', () => {
    const mockRequestWithCompany = () => {
      const req = {};
      req.params = {
        department: 'Sales',
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
        department: 'Sales',
        role: 'manager'
      }
      req.user = {
         _id: '604f7c8d31c4ab00aaca213d',
       }
       return req;
    }

    const mockRequestWrongRole = () => {
      const req = {};
      req.params = {
        department: 'Sales',
        role: 'Fake'
      }
      req.user = {
         _id: '604f7c8d31c4ab00aaca213d',
       }
       return req;
    }

    const mockRequestWrongDepartment = () => {
      const req = {};
      req.params = {
        department: 'Fake',
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
          ],
        },
      ]
    }

    const sandbox = sinon.createSandbox();
    let res = mockResponse();
    let next = sandbox.stub();
    const badCode = 400
    const errorCode = 500


    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })

    it('should call res.send with users filtered by department and role', async () => {
      let users = mockUsers();
      let filteredUsers = mockFilteredUsers();
      let req = mockRequestWithCompany();
      // Stub db call to return user
      let dbCall = sandbox.stub(User, 'find').returns({select:sandbox.stub().returns(users)})

      await getUsersByDepartmentAndRole(req,res,next)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(filteredUsers)).to.be.true;
      })

    it('should handle error if user does not return any users', async () => {
      let req = mockRequestWithCompany();
      // Stub db call to return undefined
      let dbCall = sandbox.stub(User, 'find').returns({select:sandbox.stub().returns(undefined)})
      
      await getUsersByDepartmentAndRole(req,res,next)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      })

    it('should handle error when db call throws error', async () => {
      let req = mockRequestNoCompany();
      // Stub db call to throw error
      sandbox.stub(User, 'find').returns({select:sandbox.stub()}).throws()
      
      await getUsersByDepartmentAndRole(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true
      })

    it('should handle error when invalid role is used in req.params', async () => {
      let req = mockRequestWrongRole();
     
      await getUsersByDepartmentAndRole(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true
    })

    it('should handle error when invalid department is used in req.params', async () => {
      let req = mockRequestWrongDepartment();
     
      await getUsersByDepartmentAndRole(req,res,next)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true
    })
  })
  describe('Post request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.body = {
        firstName: 'fake',
        lastName: 'name',
        email: 'fake@mail.com',
        password: '123456'
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

    const mockUser = () => {
      return {        
        firstName: 'fake',
        lastName: 'name',
        email: 'faketest@mail.com',
       }
      }
    

    const sandbox = sinon.createSandbox();
    let res = mockResponse();
    const goodCode = 200
    const badCode = 400
    const errorCode = 500


    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })

    it('should create user if no existing user is found', async () => {
      let req = mockRequest();
      // Stub db call to return user
      let dbCall = sandbox.stub(User, 'findOne').returns(undefined)
      let save = sandbox.stub(User.prototype, 'save').callsFake(()=> Promise.resolve(this))
      await registerUser(req,res)
      expect(dbCall.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error if existing user is found', async () => {
      let user = mockUser();
      let req = mockRequest();
      // Stub db call to return user
      let dbCall = sandbox.stub(User, 'findOne').returns(user)

      await registerUser(req,res)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      })


    it('should handle error when db call throws error', async () => {
      let req = mockRequest();
      // Stub db call to throw error
      sandbox.stub(User, 'findOne').throws()
      
      await registerUser(req,res)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true
      })
  })
  describe('Post request to /:companyId/:docId', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        company: 'fakecompanyid123098'
      }
      req.body = {
        firstName: 'fake',
        lastName: 'name',
        email: 'fake@mail.com',
        password: '123456'
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

    const mockUser = () => {
      return {        
        firstName: 'fake',
        lastName: 'name',
        email: 'faketest@mail.com',
       }
      }

    const sandbox = sinon.createSandbox();
    let res = mockResponse();
    const goodCode = 200
    const badCode = 400
    const errorCode = 500


    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })

    it('should create user if no existing user is found', async () => {
      let req = mockRequest();
      // Stub db call to return user
      let dbCall = sandbox.stub(User, 'findOne').returns(undefined)
      let save = sandbox.stub(User.prototype, 'save').callsFake(()=> Promise.resolve(this))
      await registerUserWithLink(req,res)
      expect(dbCall.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error if existing user is found', async () => {
      let user = mockUser();
      let req = mockRequest();
      // Stub db call to return user
      let dbCall = sandbox.stub(User, 'findOne').returns(user)

      await registerUserWithLink(req,res)
      expect(dbCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      })

    it('should handle error when db call throws error', async () => {
      let req = mockRequest();
      // Stub db call to throw error
      sandbox.stub(User, 'findOne').throws()
      
      await registerUserWithLink(req,res)
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true
      })
  })
  describe('Put request to /company/:companyId', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        companyId: 'fakecompanyid123098'
      }
      req.body = {
        firstName: 'fake',
        lastName: 'name',
        email: 'fake@mail.com',
        password: '123456'
      }
      req.user = {
        _id: 'fakeid29018302314'
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

    let mockCompany = () => {
      return {
        name: 'fake',
        street: 'fake street'
    }
    }

    let mockUser = () => {
      return new User({firstName: 'fake', lastName: 'name', email: 'faketest@mail.com', role: [{department: 'fake', worker: true, manager: true}]})
    }

    let mockUserWithCompany = () => {
      return new User({firstName: 'fake', lastName: 'name', email: 'faketest@mail.com', company: '5fecbe9e983ade22d093cea7', role: [{department: 'fake', worker: true, manager: true}]})
    }

    const sandbox = sinon.createSandbox();
    let res = mockResponse();
    const goodCode = 200
    const badCode = 400
    const errorCode = 500

    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })
    it('should add company to user', async () => {
      let req = mockRequest();
      let fakeUser = mockUser();
      let fakeCompany = mockCompany();

      let dbCallCompany = sandbox.stub(Company, 'findById').returns(fakeCompany)
      let dbCallUser = sandbox.stub(User, 'findById').returns(fakeUser)
      let save = sandbox.stub(User.prototype, 'save').callsFake(()=> Promise.resolve(this))

      await addCompanyToUser(req,res)
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error when db company call returns undefined', async () => {
      let req = mockRequest();

      let dbCallCompany = sandbox.stub(Company, 'findById').returns(undefined);
      let dbCallUser = sandbox.stub(User, 'findById').returns(undefined)

      await addCompanyToUser(req,res)
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })

    it('should handle error when db user call returns undefined', async () => {
      let req = mockRequest();
      let fakeCompany = mockCompany();

      let dbCallCompany = sandbox.stub(Company, 'findById').returns(fakeCompany);
      let dbCallUser = sandbox.stub(User, 'findById').returns(undefined)

      await addCompanyToUser(req,res)
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })

    it('should handle company db call error', async () => {
      let req = mockRequest();
      let fakeUser = mockUser();

      let dbCallCompany = sandbox.stub(Company, 'findById').throws()
      let dbCallUser = sandbox.stub(User, 'findById').returns(fakeUser);

      await addCompanyToUser(req,res)
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle user db call error', async () => {
      let req = mockRequest();
      let fakeUser = mockUser();
      let fakeCompany = mockCompany();

      let dbCallCompany = sandbox.stub(Company, 'findById').returns(fakeCompany)
      let dbCallUser = sandbox.stub(User, 'findById').throws();

      await addCompanyToUser(req,res)
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should return error if user is already part of company', async () => {
      let req = mockRequest();
      let fakeUser = mockUserWithCompany();
      let fakeCompany = mockCompany();

      let dbCallCompany = sandbox.stub(Company, 'findById').returns(fakeCompany)
      let dbCallUser = sandbox.stub(User, 'findById').returns(fakeUser)
      let save = sandbox.stub(User.prototype, 'save').callsFake(()=> Promise.resolve(this));

      await addCompanyToUser(req,res)
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
    })
  })
  describe('Put request to /companyInvite', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        code: 'fakecode0948'
      }
      req.body = {
        firstName: 'fake',
        lastName: 'name',
        email: 'fake@mail.com',
        password: '123456'
      }
      req.user = {
        _id: 'fakeid29018302314'
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

    let mockInvitation = () => {
      return {
        company: 'fake',
    }
    }

    let mockUser = () => {
      return new User({firstName: 'fake', lastName: 'name', email: 'faketest@mail.com', role: [{department: 'fake', worker: true, manager: true}]})
    }

    let mockUserWithCompany = () => {
      return new User({firstName: 'fake', lastName: 'name', email: 'faketest@mail.com', company: '5fecbe9e983ade22d093cea7', role: [{department: 'fake', worker: true, manager: true}]})
    }

    const sandbox = sinon.createSandbox();
    let res = mockResponse();
    const goodCode = 200
    const badCode = 400
    const errorCode = 500

    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })
    it('should add company to user', async () => {
      let req = mockRequest();
      let fakeUser = mockUser();
      let fakeInvitation = mockInvitation();
      
      let dbCallInvitation = sandbox.stub(Invitation, 'findOne').returns(fakeInvitation);
      let dbCallUser = sandbox.stub(User, 'findById').returns(fakeUser)
      let save = sandbox.stub(User.prototype, 'save').callsFake(()=> Promise.resolve(this))

      await addCompanyToUserWithCode(req,res)
      expect(dbCallInvitation.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error when db invitation call returns undefined', async () => {
      let req = mockRequest();
      
      let dbCallInvitation = sandbox.stub(Invitation, 'findOne').returns(undefined);
      let dbCallUser = sandbox.stub(User, 'findById').returns(undefined)

      await addCompanyToUserWithCode(req,res)
      expect(dbCallInvitation.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error when db user call returns undefined', async () => {
      let req = mockRequest();
      let fakeInvitation = mockInvitation();
      
      let dbCallInvitation = sandbox.stub(Invitation, 'findOne').returns(fakeInvitation);
      let dbCallUser = sandbox.stub(User, 'findById').returns(undefined)

      await addCompanyToUserWithCode(req,res)
      expect(dbCallInvitation.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle company db call error', async () => {
      let req = mockRequest();
      let fakeUser = mockUser();

      let dbCallInvitation = sandbox.stub(Invitation, 'findOne').throws()
      let dbCallUser = sandbox.stub(User, 'findById').returns(fakeUser);

      await addCompanyToUserWithCode(req,res)
      expect(dbCallInvitation.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle user db call error', async () => {
      let req = mockRequest();
      let fakeUser = mockUser();
      
      let dbCallInvitation = sandbox.stub(Invitation, 'findOne').returns(fakeUser);
      let dbCallUser = sandbox.stub(User, 'findById').throws();

      await addCompanyToUserWithCode(req,res)
      expect(dbCallInvitation.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should return error if user is already part of company', async () => {
      let req = mockRequest();
      let fakeUser = mockUserWithCompany();
      
      let dbCallInvitation = sandbox.stub(Invitation, 'findOne').returns(fakeUser);
      let dbCallUser = sandbox.stub(User, 'findById').returns(fakeUser)
      let save = sandbox.stub(User.prototype, 'save').callsFake(()=> Promise.resolve(this));

      await addCompanyToUserWithCode(req,res)
      expect(dbCallInvitation.calledOnce).to.be.true;
      expect(dbCallUser.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
    })
  })
  describe('Put request to /roles/:userId', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        userId: 'fakeid91284901'
      }
      req.body = {
        roles: [
          {
            department: 'fake',
            manager: true,
            worker: true
          },
          {
            department: 'fake',
            manager: true,
            worker: true
          }
        ]
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

    let mockInvitation = () => {
      return {
        company: 'fake',
    }
    }

    let mockUser = () => {
      return new User({firstName: 'fake', lastName: 'name', email: 'faketest@mail.com', role: [{department: 'fake', worker: true, manager: true},{department: 'fake', worker: true, manager: true}]})
    }

    let mockUserWithCompany = () => {
      return new User({firstName: 'fake', lastName: 'name', email: 'faketest@mail.com', company: '5fecbe9e983ade22d093cea7', role: [{department: 'fake', worker: true, manager: true}]})
    }

    const sandbox = sinon.createSandbox();
    let res = mockResponse();
    const goodCode = 200
    const badCode = 400
    const errorCode = 500

    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })
    it('should update user roles and have the same number of user roles', async () => {
      let req = mockRequest();
      let fakeUser = mockUser();

      let userDbCall = sandbox.stub(User, 'findById').returns(fakeUser);
      let save = sandbox.stub(User.prototype, 'save').callsFake(()=> Promise.resolve(this))
      await editUserRoles(req,res);
      expect(userDbCall.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.true;
      if (save.calledOnce) {
        expect(fakeUser.roles.length).to.be.equal(fakeUser.roles.length)
      }
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })
    it('should handle error when db user call returns undefined', async () => {
      let req = mockRequest();

      let userDbCall = sandbox.stub(User, 'findById').returns(undefined);
      let save = sandbox.stub(User.prototype, 'save').callsFake(()=> Promise.resolve(this))
      await editUserRoles(req,res);
      expect(userDbCall.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })
    it('should handle user db call error', async () => {
      let req = mockRequest();

      let userDbCall = sandbox.stub(User, 'findById').throws();
      let save = sandbox.stub(User.prototype, 'save').callsFake(()=> Promise.resolve(this))
      await editUserRoles(req,res);
      expect(userDbCall.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
})