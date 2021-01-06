const express = require('express');
const router = express.Router();
const { genLink } = require('../../lib/invitationUtils');

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
// @desc    Create invitation
// @access  public

router.post('/', async (req,res) => {

  const { emails } = req.body;
  const company = req.user.company;

  if (company === null || company === undefined) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'Please set up your company first.'} }] })
  };


  
  try {

    emails.forEach(async (email) => {

        // Create invitation expiration
      let expires = new Date();
      expires.setHours(expires.getHours() + 24);
      expires = expires.getTime();
      
      const code = makeid(5);

      let invitation = new Invitation({
        company,
        code,
        expires,
        email,
        })
  
        
        // Create url link
        const link = `http://localhost:3000/register/invite/${company}/${invitation._id}`
        
        invitation.url = link;

        await invitation.save();
    })

    return res.status(200).json({msg: { title: 'Success', description: 'Invitation email sent to users.'} })
    
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
   
  }

})

module.exports = router;