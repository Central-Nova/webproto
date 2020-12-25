const crypto = require('crypto');

function genLink(company, docId) {

  let companyString = company.toString();
  let docIdString = docId.toString();

  let stringToHash = companyString.concat(docIdString);

  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(stringToHash, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: genHash
  };
}

function validLink(company, docId, hash, salt) {

  let companyString = company.toString();
  let docIdString = docId.toString();

  let stringToHash = companyString.concat(docIdString);

  var hashVerify = crypto.pbkdf2Sync(stringToHash, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

module.exports.validLink = validLink;
module.exports.genLink = genLink;
