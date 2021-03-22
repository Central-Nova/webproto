const expect = require('chai').expect;
const sinon = require('sinon');
const Role = require('../models/Role');
const { getRoles, getRolesByDocument, editRoles } = require('../routes/api/controllers/roles');

describe('API Role Route', () => {
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
  describe('Get request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.user = {
        company: 'fakecompany492384902'
      }
      return req;
    }
    const mockRoles = () => {
      return {
        name: 'fakename19038021'
      }
    }

    const mockRolesUndefined = () => {
      return undefined
    }
    
    
    it('should call res.send with company roles', async () => {
      let req = mockRequest();
      let fakeRoles = mockRoles();
      let dbRoleCall = sandbox.stub(Role, 'findOne').returns(fakeRoles);

      await getRoles(req, res)
      expect(dbRoleCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(fakeRoles)).to.be.true;
    })
    it('should create roles data when company does not have roles data', async () => {
      let req = mockRequest();
      let fakeRoles = mockRolesUndefined();
      let dbRoleCall = sandbox.stub(Role, 'findOne').returns(fakeRoles);
      let save = sandbox.stub(Role.prototype, 'save').callsFake(()=> Promise.resolve(this))

      await getRoles(req, res)
      expect(dbRoleCall.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode));
      expect(res.json.calledOnce).to.be.true;
    })
    it('should handle error when db role call throws error', async () => {
      let req = mockRequest();
      let dbRoleCall = sandbox.stub(Role, 'findOne').throws();

      await getRoles(req, res)
      expect(dbRoleCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode));
      expect(res.json.calledOnce).to.be.true;
    })

  })
  describe('Get request to /document/:document', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        document: 'salesquotes'
      }
      req.user = {
        company: 'fakecompany492384902'
      }
      return req;
    }
    const mockRoles = () => {
      return {
        permissions:[
          {document: 'Sales Quotes'},
          {document: 'Sales Quotes'},
          {document: 'Fake Documents'},
          {document: 'Fake Documents'},
        ]
      }
    }

    const mockFilteredRoles = () => {
      return {
        permissions:[
          {document: 'Sales Quotes'},
          {document: 'Sales Quotes'},
        ]
      }
    }
    const mockRolesUndefined = () => {
      return undefined
    }

    it('should call res.send with filtered roles data', async () => {
      let req = mockRequest();
      let fakeRoles = mockRoles();
      let filteredRoles = mockFilteredRoles();
      let dbRoleCall = sandbox.stub(Role, 'findOne').returns(fakeRoles);

      await getRolesByDocument(req,res);
      expect(dbRoleCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(filteredRoles))
    })
    it('should create roles data when company does not have roles data', async () => {
      const req = mockRequest();
      const fakeRoles = mockRolesUndefined();
      let dbRoleCall = sandbox.stub(Role, 'findOne').returns(fakeRoles);
      let save = sandbox.stub(Role.prototype, 'save').callsFake(()=> Promise.resolve(this))

      await getRolesByDocument(req, res)
      expect(dbRoleCall.calledOnce).to.be.true;
      expect(save.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
    })
    it('should handle error when db role call throws error', async () => {
      let req = mockRequest();
      let dbRoleCall = sandbox.stub(Role, 'findOne').throws();

      await getRolesByDocument(req,res);
      expect(dbRoleCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode))
      expect(res.json.calledOnce).to.be.true;
    });
  })
  describe('Put request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.body = {
        permissions: [
          {
            _id: '123a',
            department: "Sales",
            document: "Sales Quotes",
            action: "View",
            manager: false,
            worker: true
          },
          {
            _id: '123b',
            department: "Sales",
            document: "Sales Quotes",
            action: "Create",
            manager: false,
            worker: true
          },
          {
            _id: '123c',
            department: "Sales",
            document: "Sales Quotes",
            action: "Edit",
            manager: false,
            worker: true
          },
          {
            _id: '123d',
            department: "Sales",
            document: "Sales Quotes",
            action: "Send",
            manager: false,
            worker: true
          },
          {
            _id: '123e',
            department: "Sales",
            document: "Sales Quotes",
            action: "Delete",
            manager: false,
            worker: true
          },
        ]
      }
      req.user = {
        company: 'fakecompany492384902'
      }
      return req;
    }

    const mockRoles = () => {
      return {
        permissions: [
          {
            _id: '123a',
            department: "Sales",
            document: "Sales Quotes",
            action: "View",
            manager: true,
            worker: true
          },
          {
            _id: '123b',
            department: "Sales",
            document: "Sales Quotes",
            action: "Create",
            manager: true,
            worker: true
          },
          {
            _id: '123c',
            department: "Sales",
            document: "Sales Quotes",
            action: "Edit",
            manager: true,
            worker: true
          },
          {
            _id: '123d',
            department: "Sales",
            document: "Sales Quotes",
            action: "Send",
            manager: true,
            worker: true
          },
          {
            _id: '123e',
            department: "Sales",
            document: "Sales Quotes",
            action: "Delete",
            manager: true,
            worker: true
          },
        ],
        save: sandbox.stub()
      }
    }

    it('should update company roles', async () => {
      let req = mockRequest();
      let fakeRoles = mockRoles();
      let dbRoleCall = sandbox.stub(Role, 'findOne').returns(fakeRoles);

      await editRoles(req,res);
      expect(dbRoleCall.calledOnce).to.be.true;
      expect(fakeRoles.save.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
    it('should handle error when db role call returns undefined', async () => {
      let req = mockRequest();
      let dbRoleCall = sandbox.stub(Role, 'findOne').returns(undefined);

      await editRoles(req,res);
      expect(dbRoleCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })
    it('should handle error when db role call throws error', async () => {
      let req = mockRequest();
      let dbRoleCall = sandbox.stub(Role, 'findOne').throws();

      await editRoles(req,res);
      expect(dbRoleCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
      expect(res.send.calledOnce).to.be.true;
    })
  })
})