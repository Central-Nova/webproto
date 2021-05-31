const sinon = require('sinon');
const expect = require('chai').expect
const Role = require('../../models/companies/Role');
const User = require('../../models/users/User');
const authorize = require('../../middleware/authorize');

describe('Middleware: authorize', () => {
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

  const mockRoles = () => {
    return new Role({
      company:'5ff381df835db43a6c05b715',
      permissions: [
        {
          department: 'Sales',
          document: 'Sales Quotes',
          action: 'Create',
          manager: true,
          worker: false
        },
      ]
    })
  }

  const mockUserAuthorized = () => {
    return new User({
      firstName: 'first',
      lastName: 'last',
      roles: [
        {
          department: 'Sales',
          manager: true,
          worker: true
        },
        {
          department: 'Payments',
          manager: true,
          worker: true
        },      
      ]
    })
  }

  const mockUserUnauthorized = () => {
    return new User({
      firstName: 'first',
      lastName: 'last',
      roles: [
        {
          department: 'Sales',
          manager: false,
          worker: true
        },
        {
          department: 'Payments',
          manager: true,
          worker: false
        },      
      ]
    })
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

  it('should call next if the user passes the check', async () => {
    let req = mockRequest();
    let next = sandbox.stub();
    let fakeRoles = mockRoles();
    let fakeUser = mockUserAuthorized();
    let dbRoleCall = sandbox.stub(Role,'findOne').returns({select: sandbox.stub().returns(fakeRoles)})
    let dbUserCall = sandbox.stub(User, 'findById').returns({select: sandbox.stub().returns(fakeUser)})

    await authorize('Sales', 'Sales Quotes', 'Create')(req, res, next)
    expect(dbRoleCall.calledOnce).to.be.true;
    expect(dbUserCall.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.true;    
  })
  it('should handle error if the user does not pass the check', async () => {
    let req = mockRequest();
    let next = sandbox.stub();
    let fakeRoles = mockRoles();
    let fakeUser = mockUserUnauthorized();
    let dbRoleCall = sandbox.stub(Role,'findOne').returns({select: sandbox.stub().returns(fakeRoles)})
    let dbUserCall = sandbox.stub(User, 'findById').returns({select: sandbox.stub().returns(fakeUser)})

    await authorize('Sales', 'Sales Quotes', 'Create')(req, res, next)
    expect(dbRoleCall.calledOnce).to.be.true;
    expect(dbUserCall.calledOnce).to.be.true;
    expect(next.callCount).to.equal(0);
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(badCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  })
  it('should handle error if db role call throws error', async () => {
    let req = mockRequest();
    let next = sandbox.stub();
    let dbRoleCall = sandbox.stub(Role,'findOne').returns({select: sandbox.stub().throws()})
    let dbUserCall = sandbox.stub(User, 'findById').returns({select: sandbox.stub().returns(undefined)})

    await authorize('Sales', 'Sales Quotes', 'Create')(req, res, next)
    expect(dbRoleCall.calledOnce).to.be.true;
    expect(dbUserCall.calledOnce).to.be.false;
    expect(next.callCount).to.equal(0);
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(errorCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  })
  it('should handle error if db user call throws error', async () => {
    let req = mockRequest();
    let next = sandbox.stub();
    let fakeRoles = mockRoles();

    let dbRoleCall = sandbox.stub(Role,'findOne').returns({select: sandbox.stub().returns(fakeRoles)})
    let dbUserCall = sandbox.stub(User, 'findById').returns({select: sandbox.stub().throws()})

    await authorize('Sales', 'Sales Quotes', 'Create')(req, res, next)
    expect(dbRoleCall.calledOnce).to.be.true;
    expect(dbUserCall.calledOnce).to.be.true;
    expect(next.callCount).to.equal(0);
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(errorCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  })

})