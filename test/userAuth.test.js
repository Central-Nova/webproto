const sinon = require('sinon');
const expect = require('chai').expect;
const userAuth = require('../middleware/userAuth');

describe('Middleware: userAuth', () => {
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

  const mockRequestNoUser = () => {
    const req = {};
    return req;
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

  it('should call next if req.user exists', async () => {
    let req = mockRequest();
    let next = sandbox.stub();
    
    await userAuth(req,res,next);
    expect(next.calledOnce).to.be.true;
  })
  it('should handle error if req.user does not exist', async () => {
    let req = mockRequestNoUser();
    let next = sandbox.stub();

    await userAuth(req,res,next);
    expect(next.callCount).to.be.equal(0);
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(badCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  })
})