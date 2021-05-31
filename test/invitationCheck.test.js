const sinon = require('sinon');
const expect = require('chai').expect;
const invitationCheck = require('../middleware/invitationCheck')
const Invitation = require('../models/companies/Invitation');

describe('Middleware: invitationCheck', () => {
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
    req.params = {
      companyId: '5ff381df835db43a6c05b715',
      docId: 'fakedocument019238'
    }
    req.body = {
      email: 'fakeuser@mail.com'
    }
    return req;
  }

  const mockInvitation = () => {
    let expires = new Date();
    expires.setHours(expires.getHours() + 24);

    return {
      company: '5ff381df835db43a6c05b715',
      code: 'code',
      expires,
      email: 'fakeuser@mail.com'
    }
  }

  const mockInvitationExpired = () => {
    let expires = new Date();

    return {
      company: '5ff381df835db43a6c05b715',
      code: 'code',
      expires,
      email: 'fakeuser@mail.com'
    }
  }

  const mockInvitationBadCompany = () => {
    let expires = new Date();
    expires.setHours(expires.getHours() + 24);

    return {
      company: '5ff381df835db43a6c05b711',
      code: 'code',
      expires,
      email: 'fakeuser@mail.com'
    }
  }

  const mockInvitationBadEmail = () => {
    let expires = new Date();
    expires.setHours(expires.getHours() + 24);

    return {
      company: '5ff381df835db43a6c05b711',
      code: 'code',
      expires,
      email: 'notme@mail.com'
    }
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

  it('should call next if the invitation is valid', async () => {
    let req = mockRequest();
    let fakeInvitation = mockInvitation();
    let next = sandbox.stub();
    let dbInvitationCall = sandbox.stub(Invitation, 'findById').returns(fakeInvitation);

    await invitationCheck(req, res, next);
    expect(dbInvitationCall.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.true;
  })
  it('should handle error if the invitation is expired', async () => {
    let req = mockRequest();
    let fakeInvitation = mockInvitationExpired();
    let next = sandbox.stub();
    let dbInvitationCall = sandbox.stub(Invitation, 'findById').returns(fakeInvitation);

    await invitationCheck(req, res, next);
    expect(dbInvitationCall.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.false;
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(badCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  })
  it('should handle error if the invitation is for wrong company', async () => {
    let req = mockRequest();
    let fakeInvitation = mockInvitationBadCompany();
    let next = sandbox.stub();
    let dbInvitationCall = sandbox.stub(Invitation, 'findById').returns(fakeInvitation);

    await invitationCheck(req, res, next);
    expect(dbInvitationCall.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.false;
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(badCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    
  })
  it('should handle error if the invitation is for wrong email', async () => {
    let req = mockRequest();
    let fakeInvitation = mockInvitationBadEmail();
    let next = sandbox.stub();
    let dbInvitationCall = sandbox.stub(Invitation, 'findById').returns(fakeInvitation);

    await invitationCheck(req, res, next);
    expect(dbInvitationCall.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.false;
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(badCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    
  })
  it('should handle error if the invitation is for wrong email', async () => {
    let req = mockRequest();
    let next = sandbox.stub();
    let dbInvitationCall = sandbox.stub(Invitation, 'findById').throws();;

    await invitationCheck(req, res, next);
    expect(dbInvitationCall.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.false;
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(errorCode)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
    
  })
})