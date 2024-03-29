const Company = require('../../../models/Company');
const apiLogger = require('../../../config/loggers');
const httpContext = require('express-http-context');

const getCompany = async (req, res) => {
  apiLogger.debug('Requesting company data', {
    body: req.body,
    params: req.params,
    query: req.query
  })


  try {

    // Check for existing company
    let queryStartTime = new Date();
    apiLogger.info('Searching DB for company', {collection: 'companies',operation: 'read'})

    let company = await Company.findById(req.user.company);
    
    if (!company) {
      apiLogger.warn('Company record not found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
      
      return res
      .status(400)
      .json({ errors: [{ msg: {title: 'Error', description: 'Company not found.'}  }] });
    }
    apiLogger.info('Company record found', {responseTime: `${new Date() - queryStartTime}ms`})

    httpContext.set('resDocs', 1);
    apiLogger.debug('Sending company data')
    return res.send(company)


  } catch (err) {
    apiLogger.error('Caught error')
    return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
  }
}

const createCompany = async (req, res) => {

  apiLogger.debug('User requesting to create company', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })


  const {
    businessName,
    ein,
  } = req.body;

  try {

    // Check for existing company by owner
    let queryStartTime = new Date();
    apiLogger.debug('Searching DB for existing company owner', {collection: 'companies',operation: 'read'})

    let companyOwner = await Company.findOne({owner: req.user._id})
    
    if (companyOwner) {
      apiLogger.debug('Existing company record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({errors: [{ msg: {title: 'Error', description: 'You already have a company.'}}]})
    }

    // Check for existing company by EIN
    queryStartTime = new Date();
    apiLogger.debug('Searching DB for existing company ein', {collection: 'companies',operation: 'read'})

    let companyEin = await Company.findOne({ ein });

    if (companyEin) {
      apiLogger.debug('Existing company record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

      return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'Company already exists.'}  }] });
    }

    company = new Company({
      name: businessName,
      owner: req.user.id,
      ein,
      users: [{
        user: req.user.id
      }]
    });

    queryStartTime = new Date();
    apiLogger.info('Creating new company record in DB', {collection: 'companies',operation: 'create'})
    await company.save();
    apiLogger.info('New company created', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    // Send company ID with response object (ised for adding company to user record)
    httpContext.set('resDocs', 1);
    apiLogger.debug('Sending company id')
    return res.status(200).json(company._id);

  } catch (err) {
    apiLogger.error('Caught error')

    return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
  }
}

const editCompany = async (req, res) => {
  apiLogger.debug('User requesting to update company with account information', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })

  const {
    email,
    phone,
    businessAddress,
    warehouseAddress,
    account,
  } = req.body;

  
  try {
    console.log('made it');
    // Check if company already has account setup
    let queryStartTime = new Date()
  
    apiLogger.debug('Searching DB for company data', {collection: 'companies', operation: 'read'})
  
    let company = await Company.findById(req.params.companyId)
  
    apiLogger.debug('Found company record', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
  
    if (company.operation !== null && company.operation!== undefined) {
      return res.status(400).json({ errors: [{ msg: {title: 'Error', description: 'Account already exists.'} }] })
    }

    company.operation = account;
    company.addressBusiness = businessAddress;
    company.addressWarehouse = warehouseAddress;
    company.email = email;
    company.phoneWork = phone;

    queryStartTime = new Date()
    apiLogger.info('Updating company record in DB with account data', {collection: 'companies', operation: 'read'})
    await company.save();
    apiLogger.info('Company record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})


    // Send company ID with response object (used for adding company to user record)
    httpContext.set('resDocs', 1);
    apiLogger.debug('Sending company id')
    return res.send(company);

  } catch (err) {
    apiLogger.error('Caught error')

    return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
  }
}

const addUserToCompany = async (req, res) => {
  console.log(req.user._id);
  apiLogger.debug('User requesting to update company with user data', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })

  
  try {
    // Check if user is already added to company
    let queryStartTime = new Date()
    apiLogger.debug('Searching DB for company data', {collection: 'companies', operation: 'read'})
  
    let company = await Company.findById(req.user.company);
    apiLogger.debug('Company record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
  
    let foundUser = [];
  
    company.users.forEach((record) => {
      if (record.user.toString() === req.user._id.toString()) {
        foundUser.push(record);
      }
    });
  
    if (foundUser.length >0) {
      apiLogger.warn('User already exists in company record')
      return res
      .status(400)
      .json({ errors: [{ msg: {title: 'Error', description: 'User is already part of company.'} }] });
    }

    // Add user to company
    newUser = {
      user: req.user._id
    }

    company.users.push(newUser);

    queryStartTime = new Date()
    apiLogger.debug('Updating company record with user data in DB', {collection: 'companies', operation: 'update'})

    await company.save();

    apiLogger.debug('Company record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    return res.status(200).json({ msg: {title: 'Success', description: 'User added to company!'} })
    ;

  } catch (err) {
    apiLogger.error('Caught error');
    return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
  }
}

module.exports = {
  getCompany,
  createCompany,
  editCompany,
  addUserToCompany
}