const expect = require('chai').expect;
const sinon = require('sinon');
const Invitation = require('../models/companies/Invitation');
const { createInvitations } = require('../routes/api/controllers/invitations');

describe('API Invitation Route', () => {
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

  describe('Post request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.body = {
        emails: [
          'user1@mail.com',
          'user2@mail.com',
          'user3@mail.com'
        ]
      }
      req.user = {
        company: '5ff381df835db43a6c05b715'
      }
      return req;
    }
    it('should create invitations for each email in req.body', async () => {
      let req = mockRequest();
      let save = sandbox.stub(Invitation.prototype, 'save').callsFake(() => Promise.resolve(this));

      await createInvitations(req,res)
      expect(save.callCount).to.be.equal(req.body.emails.length);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
    it('should handle error when save throws error', async () => {
      let req = mockRequest();
      let save = sandbox.stub(Invitation.prototype, 'save').throws();

      await createInvitations(req,res)
      expect(save.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
      expect(res.send.calledOnce).to.be.true;
    })
  })
})
