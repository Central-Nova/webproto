const { getCompany, createCompany, editCompany, addUserToCompany } = require('../routes/api/controllers/companies');
const expect = require('chai').expect;
const sinon = require('sinon');
const Company = require('../models/Company');

describe('API Company Route', () => {
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
  
  describe('Get request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.user = {
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockCompany = () => {
      return {
        name: 'fake name'
      }
    }

    const sandbox = sinon.createSandbox();
    let res = mockResponse();
    const badCode = 400
    const errorCode = 500

    beforeEach(function() {
      sandbox.spy(res);
    })

    afterEach(function() {
      sandbox.restore();
    })

    it('should return company record', async () => {
      let req = mockRequest();
      let fakeCompany = mockCompany();
      let dbCallCompany = sandbox.stub(Company, 'findById').returns(fakeCompany)

      await getCompany(req,res);
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(fakeCompany)).to.be.true;
    });

    it('should handle error when db company call returns undefined', async () => {
      let req = mockRequest();
      let dbCallCompany = sandbox.stub(Company, 'findById').returns(undefined)

      await getCompany(req,res);
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
    it('should handle error when db company call throws error', async () => {
      let req = mockRequest();
      let dbCallCompany = sandbox.stub(Company, 'findById').throws();

      await getCompany(req,res);
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  })

  describe('Post request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.body = {
        businessName: 'fake name',
        ein: 'fake ein'
      }
      req.user = {
        company: 'fakecompany492384902'
      }
      return req;
    }


    let mockCompany = () => {
      return new Company({
        name: 'Fake Name',
        ein: 10984023894124
      })
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

    it('should create company if no existing company records are found', async () => {
      let req = mockRequest();
      let dbCallCompany = sandbox.stub(Company, 'findOne')
      dbCallCompany.onCall(0).returns(undefined)
      dbCallCompany.onCall(1).returns(undefined)
      let save = sandbox.stub(Company.prototype, 'save').callsFake(()=> Promise.resolve(this));

      await createCompany(req,res);
      expect(dbCallCompany.calledTwice).to.be.true;
      expect(save.calledOnce).to.be.true
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should handle error when existing company is found based on owner id', async () => {
      let req = mockRequest();
      let fakeCompany = mockCompany();
      let dbCallCompany = sandbox.stub(Company, 'findOne')
      dbCallCompany.onCall(0).returns(fakeCompany)
      dbCallCompany.onCall(1).returns(fakeCompany)

      await createCompany(req,res);
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should handle error when existing company is found based on ein', async () => {
      let req = mockRequest();
      let fakeCompany = mockCompany();
      let dbCallCompany = sandbox.stub(Company, 'findOne')
      dbCallCompany.onCall(0).returns(undefined)
      dbCallCompany.onCall(1).returns(fakeCompany)

      await createCompany(req,res);
      expect(dbCallCompany.calledTwice).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should handle error when first db company call throws error', async () => {
      let req = mockRequest();
      let dbCallCompany = sandbox.stub(Company, 'findOne');
      dbCallCompany.onCall(0).throws();
      dbCallCompany.onCall(1).returns(undefined)

      await createCompany(req,res);
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should handle error when second db company call throws error', async () => {
      let req = mockRequest();
      let dbCallCompany = sandbox.stub(Company, 'findOne')
      dbCallCompany.onCall(0).returns(undefined)
      dbCallCompany.onCall(1).throws();
;
      await createCompany(req,res);
      expect(dbCallCompany.calledTwice).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  })
  describe('Put request to /company/:companyId', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        companyId: 'fakecompany492384902'
      }
      req.body = {
        email: 'fakemail',
        phone: 128300480234,
        businessAddress: {},
        warehouseAddress: {},
        account: 'someaccount',
      }
      req.user = {
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockCompany = () => {
      return new Company({
        name: 'Fake Name',
        ein: 10984023894124
      })
    }

    let mockCompanyWithAccount = () => {
      return new Company({
        name: 'Fake Name',
        ein: 10984023894124,
        operation: 'supplier'
      })

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

    it('should update company record and call res.send with company record', async () => {
      let req = mockRequest();
      let fakeCompany = mockCompany();
      let dbCallCompany = sandbox.stub(Company, 'findById').returns(fakeCompany);
      let save = sandbox.stub(Company.prototype, 'save').callsFake(()=> Promise.resolve(this));
      let newValues = ['operation', 'addressBusiness','addressWarehouse', 'email','phoneWork']

      await editCompany(req,res);
      expect(dbCallCompany.calledOnce).to.be.true;
      newValues.forEach(value => {
        expect(fakeCompany[value]).to.exist
      })
      expect(save.calledOnce).to.be.true
      expect(res.send.calledOnce).to.be.true;
    });

    it('should handle error when company already has account data', async () => {
      let req = mockRequest();
      let fakeCompany = mockCompanyWithAccount();
      let dbCallCompany = sandbox.stub(Company, 'findOne').returns(fakeCompany);

      await editCompany(req,res);
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should handle error when db company call throws error', async () => {
      let req = mockRequest();
      let dbCallCompany = sandbox.stub(Company, 'findOne').throws();
      await editCompany(req,res);
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  })
  describe('Put request to /addUser', () => {
    const mockRequest = () => {
      const req = {};
      req.user = {
        _id: '604f7c8d31c4ab00aaca213d',
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockCompany = () => {
      return new Company({
        name: 'Fake Name',
        ein: 10984023894124,
        users: [
          {user: '604f7c8d31c4ab00aaca213c'}
        ]
      })
    }

    let mockCompanyWithExistingUser = () => {
      return new Company({
        name: 'Fake Name',
        ein: 10984023894124,
        operation: 'supplier',
        users: [
          {user: '604f7c8d31c4ab00aaca213d'},

        ]
      })
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

    it('should update company record and call res.send with company record', async () => {
      let req = mockRequest();
      let fakeCompany = mockCompany();
      let dbCallCompany = sandbox.stub(Company, 'findById').returns(fakeCompany);
      let save = sandbox.stub(Company.prototype, 'save').callsFake(()=> Promise.resolve(this));

      await addUserToCompany(req,res);
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.true
      expect(fakeCompany.users.includes({user:req.user._id}))
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should handle error if user is already part of the company', async () => {
      let req = mockRequest();
      let fakeCompany = mockCompanyWithExistingUser();
      let dbCallCompany = sandbox.stub(Company, 'findById').returns(fakeCompany);
      let save = sandbox.stub(Company.prototype, 'save').callsFake(()=> Promise.resolve(this));

      await addUserToCompany(req,res);
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(fakeCompany.users.includes({user:req.user._id}))
      expect(save.calledOnce).to.be.false
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should handle error when db company call throws error', async () => {
      let req = mockRequest();
      let dbCallCompany = sandbox.stub(Company, 'findById').throws();
      await addUserToCompany(req,res);
      expect(dbCallCompany.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  })
})