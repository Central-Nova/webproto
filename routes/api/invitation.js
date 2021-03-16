const express = require('express');
const router = express.Router();

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const authorize = require('../../middleware/authorize');
const validationHandler = require('../../middleware/validationHandler')
const sanitizeBody = require('../../middleware/sanitizeBody');

// Models
const Company = require('../../models/Company');
const Invitation = require('../../models/Invitation');

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


// @route   POST api/invitation
// @desc    Create invitations
// @access  Has company, has 'Invitations':'Create' permission

router.post('/',
[userAuth, companyAuth, authorize('Admin', 'Invitations', 'Create'), sanitizeBody, [
  check('emails.*', { title: 'Error', description: 'Please enter a valid email address' }).isEmail()
], validationHandler], async (req,res) => {

  const { emails } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
      .status(400)
      .json({ errors: errors.array() })
    }

    apiLogger.debug('User requesting create new invitation record', {
      params: req.params || '',
      query: req.query || '',
      body: req.body || ''
    })

  
  try {

    emails.forEach(async (email) => {

        // Create invitation expiration
      let expires = new Date();
      expires.setHours(expires.getHours() + 24);
      expires = expires.getTime();
      
      const code = makeid(5);

      let invitation = new Invitation({
        company: req.user.company,
        code,
        expires,
        email,
        })
  
        
        // Create url link
        const link = `http://localhost:3000/register/invite/${invitation.company}/${invitation._id}`
        
        invitation.url = link;

        let queryStartTime = new Date();
        apiLogger.info('Creating new invitation record in db', {collection: 'products',operation: 'update'})
        await invitation.save();
        apiLogger.info('Invitation record created', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    })

    return res.status(200).json({msg: { title: 'Success', description: 'Invitation email sent to users.'} })
    
  } catch (err) {
    console.log(err);
    apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
   
  }

})

module.exports = router;