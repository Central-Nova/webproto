const Invitation = require('../../../models/companies/Invitation');
const { generateCode } = require('../../../lib/generateCode');

const createInvitations = async (req,res) => {

  const { emails } = req.body;

    apiLogger.debug('User requesting create new invitation record', {
      params: req.params || '',
      query: req.query || '',
      body: req.body || ''
    })
  
  try {

    for (let email in emails) {
    // Create invitation expiration
    let expires = new Date();
    expires.setHours(expires.getHours() + 24);

    const code = generateCode(5);
    let invitation = new Invitation({
      company: req.user.company,
      code,
      expires,
      email: emails[email],
      })
      
      // Create url link
      const link = `http://localhost:3000/register/invite/${invitation.company}/${invitation._id}`
      invitation.url = link;

      let queryStartTime = new Date();
      apiLogger.info('Creating new invitation record in db', {collection: 'products',operation: 'update'})
      
      await invitation.save();
      apiLogger.info('Invitation record created', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    }

    return res.status(200).json({msg: { title: 'Success', description: 'Invitation email sent to users.'} })
    
  } catch (err) {
    apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
   
  }

}

module.exports = { createInvitations } 