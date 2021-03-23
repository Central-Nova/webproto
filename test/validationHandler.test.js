const validationHandler = require('../middleware/validationHandler');
const expect = require('chai').expect;
const sinon = require('sinon');
const { Result } = require('express-validator');

describe('Middleware: validationHandler', () => {
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

  const mockRequestWithError = () => {
    const req = {};
    req.user = {
      _id: 'fake190382013',
      company: 'fakecompany492384902'
    }
    req['express-validator#contexts'] = [
      {
        fields: ['email'],
        locations: ['body'],
        optional: false,
        message: {
          title: 'Error', description: 'Valid email is required'
        },
        errors: [{
          value: 'davemail',
          msg: {title: 'Error', description: 'Valid email is required'},
          param: 'email',
          location: 'body'
        }]
      }
    ]
    return req;
  }

  const mockRequestNoError = () => {
    const req = {};
    req.user = {
      id: 'fake190382013',
      company: 'fakecompany492384902'
    }
    req['express-validator#contexts'] = [
      {
        fields: ['email'],
        locations: ['body'],
        optional: false,
        message: {
          title: 'Error', description: 'Valid email is required'
        },
        errors: []
      }
    ]
    return req;
  }
  
  const sandbox = sinon.createSandbox();
  let res = mockResponse();
  const badCode = 400

  beforeEach(function() {
    sandbox.spy(res);
  })

  afterEach(function() {
    sandbox.restore();
  })

  it('should call res.json with error messages from validation errors', async () => {
    let req = mockRequestWithError();
    let next = sandbox.stub();

    await validationHandler(req,res,next)
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(badCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.calledWith({errors: [req['express-validator#contexts'][0].errors[0].msg]}))
  })
  it('should call next if there are no validation errors', async () => {
    let req = mockRequestNoError();
    let next = sandbox.stub();

    await validationHandler(req,res,next)
    expect(next.calledOnce).to.be.true;
  })
})
