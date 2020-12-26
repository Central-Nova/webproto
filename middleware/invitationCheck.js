const Invitation = require('../models/Invitation');

module.exports = async (req, res, next) => {

  const { companyId, docId } = req.params;
  const { email } = req.body;

  try {
    let invitation = await Invitation.findById(docId);

    console.log('invitation: ',invitation);

    if (invitation !== null) {

      // Check if invitation link is expired
      let now = new Date();
      let isValid = invitation.expires.getTime() > now.getTime();

      if (!isValid) {
        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'Invitation link is expired.'} }] });
      }

      // Check if companyId matches invitation record
      isValid = invitation.company.toString() === companyId;

      if (!isValid) {
        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'Invitation link is invalid.'} }] });
      }
  
      // Check if invitation link is for user
      isValid = invitation.email === email;
 
      if (!isValid) {
        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'Invitation link is for another user.'} }] });
      }
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }

}