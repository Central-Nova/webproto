const sinon = require('sinon');
const expect = require('chai').expect;
const companyAuth = require('../middleware/companyAuth');
const Company = require('../models/companies/Company');

describe('Middleware: companyAuth', () => {
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

  const mockRequest = () => {
    const req = {};
    req.user = {
      _id: 'fake190382013',
      company: 'fakecompany492384902'
    }
    return req;
  }

  const mockRequestUndefined = () => {
    const req = {};
    req.user = {
      _id: 'fake190382013',
      company: undefined
    }
    return req;
  }

  const mockRequestNull = () => {
    const req = {};
    req.user = {
      _id: 'fake190382013',
      company: null
    }
    return req;
  }
  const mockCompany = () => {
    return {
      name: 'fakecompany129038'
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

  it('should call next if company exists', async () => {
    let req = mockRequest();
    let next = sandbox.stub();
    let fakeCompany = mockCompany();
    let dbCompanyCall = sandbox.stub(Company, 'findById').returns(fakeCompany);
    
    await companyAuth(req,res,next);
    expect(dbCompanyCall.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.true;
  })
  
  it('should handle error if req.user.company is undefined', async () => {
    let req = mockRequestUndefined();
    let next = sandbox.stub();
    let dbCompanyCall = sandbox.stub(Company, 'findById').returns(undefined);

    await companyAuth(req,res,next);
    expect(next.callCount).to.be.equal(0);
    expect(dbCompanyCall.callCount).to.be.equal(0);
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(badCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  })
  it('should handle error if req.user.company is null', async () => {
    let req = mockRequestNull();
    let next = sandbox.stub();
    let dbCompanyCall = sandbox.stub(Company, 'findById').returns(undefined);

    await companyAuth(req,res,next);
    expect(next.callCount).to.be.equal(0);
    expect(dbCompanyCall.callCount).to.be.equal(0);
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(badCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  })
  it('should handle error if db company call returns undefined', async () => {
    let req = mockRequest();
    let next = sandbox.stub();
    let dbCompanyCall = sandbox.stub(Company, 'findById').returns(undefined);

    await companyAuth(req,res,next);
    expect(next.callCount).to.be.equal(0);
    expect(dbCompanyCall.calledOnce).to.be.true;
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(badCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  })
  it('should handle error if db company call throws error', async () => {
    let req = mockRequest();
    let next = sandbox.stub();
    let dbCompanyCall = sandbox.stub(Company, 'findById').throws();

    await companyAuth(req,res,next);
    expect(next.callCount).to.be.equal(0);
    expect(dbCompanyCall.calledOnce).to.be.true;
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(errorCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  })
})