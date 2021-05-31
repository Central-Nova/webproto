const expect = require('chai').expect;
const sinon = require('sinon');
const Product = require('../models/products/Product');
const { getProducts, getProductById, createProduct, editProduct } = require('../routes/api/controllers/products');

describe('API Product Route', () => {
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
      req.query = {
        page: '',
        limit: '',
        sort: '',
        search: ''
      }
      req.user = {
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockProducts = () => {
      return [
        {name: 'fake'},
        {name: 'sofake'}
      ]
    }
    
    it('should call res.send with all products by company ID and meta data', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let dbProductCall = sandbox.stub(Product, 'find').returns({sort: sandbox.stub().returns({skip: sandbox.stub().returns({limit: sandbox.stub().returns(fakeProducts)})})});
      let dbProductCount = sandbox.stub(Product, 'countDocuments').returns({sort: sandbox.stub().returns(fakeProducts.length)})
  
      await getProducts(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbProductCount.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith({
        total: fakeProducts.length,
        page: 0,
        limit: 0,
        products: fakeProducts
      })).to.be.true;

    })

    it('should handle error when db product call returns undefined', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let dbProductCall = sandbox.stub(Product, 'find').returns({sort: sandbox.stub().returns({skip: sandbox.stub().returns({limit: sandbox.stub().returns(undefined)})})});
      let dbProductCount = sandbox.stub(Product, 'countDocuments').returns({sort: sandbox.stub().returns(fakeProducts.length)})
  
      await getProducts(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbProductCount.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error when db product countDocument returns undefined', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let dbProductCall = sandbox.stub(Product, 'find').returns({sort: sandbox.stub().returns({skip: sandbox.stub().returns({limit: sandbox.stub().returns(fakeProducts)})})});
      let dbProductCount = sandbox.stub(Product, 'countDocuments').returns({sort: sandbox.stub().returns(undefined)})
  
      await getProducts(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbProductCount.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error when db product call throws error', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let dbProductCall = sandbox.stub(Product, 'find').returns({sort: sandbox.stub().returns({skip: sandbox.stub().returns({limit: sandbox.stub().throws()})})});
      let dbProductCount = sandbox.stub(Product, 'countDocuments').returns({sort: sandbox.stub().returns(fakeProducts.length)})
  
      await getProducts(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbProductCount.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle error when db product countDocument throws error', async () => {
      let req = mockRequest();
      let fakeProducts = mockProducts();
      let dbProductCall = sandbox.stub(Product, 'find').returns({sort: sandbox.stub().returns({skip: sandbox.stub().returns({limit: sandbox.stub().returns(fakeProducts)})})});
      let dbProductCount = sandbox.stub(Product, 'countDocuments').returns({sort: sandbox.stub().throws()})
  
      await getProducts(req, res);

      expect(dbProductCall.calledOnce).to.be.true;
      expect(dbProductCount.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

  })
  describe('Get request to /product/:productId', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        productId: 'fakeproduct1912312'
      }
      req.user = {
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockProduct = () => {
      return {name: 'fake'}
      
    }
    
    it('should call res.send with product data', async () => {
      let req = mockRequest();
      let fakeProduct = mockProduct();
      let dbProductCall = sandbox.stub(Product, 'findOne').returns(fakeProduct);
 
      await getProductById(req, res);
      expect(dbProductCall.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(fakeProduct)).to.be.true;
    })
    it('should handle error when db product call returns undefined', async () => {
      let req = mockRequest();
      let dbProductCall = sandbox.stub(Product, 'findOne').returns(undefined);
 
      await getProductById(req, res);
      expect(dbProductCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })
    it('should handle error when db product call throws error', async () => {
      let req = mockRequest();
      let dbProductCall = sandbox.stub(Product, 'findOne').throws();
 
      await getProductById(req, res);
      expect(dbProductCall.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
  describe('Post request to /', () => {
    const mockRequest = () => {
      const req = {};
      req.body = {
        products: [
          {
            sku: 'skue0218940',
            name: 'fake name',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, nostrum!',
            basePrice: {
              unit: 'Pallet',
              subUnit: 'Boxes',
              contains: 20,
              price: 99999,
            },
            priceRules: [
              {
                unit: 'Pallet',
                quantity: 10,
                price: 499999
              }
            ]
          },
          {
            sku: 'sku201381',
            name: 'fake name',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, nostrum!',
            basePrice: {
              unit: 'Pallet',
              subUnit: 'Boxes',
              contains: 20,
              price: 99999,
            },
            priceRules: [
              {
                unit: 'Pallet',
                quantity: 10,
                price: 499999
              }
            ]
          },
        ]
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }

    const mockRequestWithBadProduct = () => {
      const req = {};
      req.body = {
        products: [
          {
            sku: 'skue0218940',
            name: 'fake name',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, nostrum!',
            basePrice: {
              unit: 'Pallet',
              subUnit: 'Boxes',
              contains: 20,
              price: 99999,
            },
            priceRules: [
              {
                unit: 'Wrong',
                quantity: 10,
                price: 499999
              }
            ]
          },
          {
            sku: 'sku201381',
            name: 'fake name',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, nostrum!',
            basePrice: {
              unit: 'Pallet',
              subUnit: 'Boxes',
              contains: 20,
              price: 99999,
            },
            priceRules: [
              {
                unit: 'Pallet',
                quantity: 10,
                price: 499999
              }
            ]
          },
        ]
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }
 
    const mockDbReturn = () => {
      return {
        lastErrorObject: {
          updatedExisting: false
        }
      }
    }
      
    it('should create a product for each product object in req.body.products', async () => {
      let req = mockRequest();
      let fakeDbReturn = mockDbReturn();
      let dbProductCall = sandbox.stub(Product, 'findOneAndUpdate').returns(fakeDbReturn);

      await createProduct(req,res);
      expect(dbProductCall.callCount).to.equal(req.body.products.length);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
    })
    it("should handle error when a product's price rule unit does not match its base price unit", async () => {
      let req = mockRequestWithBadProduct();
      let fakeDbReturn = mockDbReturn();
      let dbProductCall = sandbox.stub(Product, 'findOneAndUpdate').returns(fakeDbReturn);

      await createProduct(req,res);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(dbProductCall.callCount).to.equal(0);
      // expect(res.status.calledOnce).to.be.true;
      // expect(res.status.calledWith(goodCode)).to.be.true;
    })
    it('should handle error when db product call throws error', async () => {
      let req = mockRequest();
      let fakeDbReturn = mockDbReturn();
      let dbProductCall = sandbox.stub(Product, 'findOneAndUpdate')
      dbProductCall.onCall(0).returns(fakeDbReturn);
      dbProductCall.onCall(1).throws();
      await createProduct(req,res);

      expect(dbProductCall.callCount).to.equal(req.body.products.length);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
  describe('Put request to /product/:productId', () => {
    const mockRequest = () => {
      const req = {};
      req.params = {
        productId:'fake0198123'
      }
      req.body = {
        sku: 'skue0218940',
        name: 'fake name',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, nostrum!',
        basePrice: {
          unit: 'Pallet',
          subUnit: 'Boxes',
          contains: 20,
          price: 99999,
        },
        priceRules: [
          {
            unit: 'Pallet',
            quantity: 10,
            price: 499999
          }
        ]
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }

    const mockRequestWithBadProduct = () => {
      const req = {};
      req.body = {
        sku: 'skue0218940',
        name: 'fake name',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, nostrum!',
        basePrice: {
          unit: 'Pallet',
          subUnit: 'Boxes',
          contains: 20,
          price: 99999,
        },
        priceRules: [
          {
            unit: 'Wrong',
            quantity: 10,
            price: 499999
          }
        ]
      }
      req.user = {
        _id: 'fake1908239021',
        company: 'fakecompany492384902'
      }
      return req;
    }

    let mockProduct = () => {
      return {name: 'fake'}
      
    }

    it('should update the product', async () => {
      let req = mockRequest();
      let fakeProduct = mockProduct();
      let dbProductFind = sandbox.stub(Product, 'findOne').returns(fakeProduct);
      let dbProductUpdate = sandbox.stub(Product, 'findOneAndUpdate')

      await editProduct(req,res)
      expect(dbProductFind.calledOnce).to.be.true;
      expect(dbProductUpdate.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(goodCode)).to.be.true;
    })

    it("should handle error if a product's price rule unit does not match base price unit", async () => {
      let req = mockRequestWithBadProduct();
      let fakeProduct = mockProduct();
      let dbProductFind = sandbox.stub(Product, 'findOne').returns(fakeProduct);
      let dbProductUpdate = sandbox.stub(Product, 'findOneAndUpdate')

      await editProduct(req,res)
      expect(dbProductFind.calledOnce).to.be.false;
      expect(dbProductUpdate.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

    })

    it('should handle error if wrong object id is given', async () => {
      let req = mockRequestWithBadProduct();
      let dbProductFind = sandbox.stub(Product, 'findOne').throws({kind: 'ObjectId'})
      let dbProductUpdate = sandbox.stub(Product, 'findOneAndUpdate')

      await editProduct(req,res)
      expect(dbProductFind.calledOnce).to.be.false;
      expect(dbProductUpdate.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;    
    })

    it('should handle error if db product find call returns undefined', async () => {
      let req = mockRequest();
      let dbProductFind = sandbox.stub(Product, 'findOne').returns(undefined);
      let dbProductUpdate = sandbox.stub(Product, 'findOneAndUpdate')

      await editProduct(req,res)
      expect(dbProductFind.calledOnce).to.be.true;
      expect(dbProductUpdate.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(badCode)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    })

    it('should handle error if db product call throws', async () => {
      let req = mockRequest();
      let fakeProduct = mockProduct();
      let dbProductFind = sandbox.stub(Product, 'findOne').throws();
      let dbProductUpdate = sandbox.stub(Product, 'findOneAndUpdate');

      await editProduct(req,res)
      expect(dbProductFind.calledOnce).to.be.true;
      expect(dbProductUpdate.calledOnce).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })

    it('should handle error if db product update call throws', async () => {
      let req = mockRequest();
      let fakeProduct = mockProduct();
      let dbProductFind = sandbox.stub(Product, 'findOne').returns(fakeProduct);
      let dbProductUpdate = sandbox.stub(Product, 'findOneAndUpdate').throws();

      await editProduct(req,res)
      expect(dbProductFind.calledOnce).to.be.true;
      expect(dbProductUpdate.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(errorCode)).to.be.true;
    })
  })
})