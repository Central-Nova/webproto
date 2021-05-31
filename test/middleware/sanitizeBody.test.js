const sinon = require('sinon');
const expect = require('chai').expect
const sanitizeBody = require('../../middleware/sanitizeBody');

describe('Middleware: sanitizeBody', () => {
  const mockResponse = () => {
    const res = {};
    return res
  }

  const mockRequest = () => {
    const req = {};
    req.body = {
      comment: {$hello: 'test'},
      okay: 'good'
    }
    return req;
  }

  
  const sandbox = sinon.createSandbox();
  let res = mockResponse();
  let req = mockRequest();
  let next = sandbox.stub();

  afterEach(function() {
    sandbox.restore();
  })
  it('should sanitize req.body and call next', async () => {
    await sanitizeBody(req, res, next);
    expect(req.body.comment).to.not.include.keys('$hello')
    expect(req.body).to.include.keys('okay')
    expect(next.calledOnce).to.be.true;
  });
})