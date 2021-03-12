const { genPassword, validPassword} = require('../lib/passwordUtils');
const expect = require('chai').expect;

const passwordFromForm = '123456';
const sampleUser = {
    salt: 'a562718936901fb75a4880e0268481c4b9e272de7f319605fc255c41001fe0f4', 
    hash: '7d2891633b9df7efb3329cacacef21d4bbf136b450315f652b89dc76f99885e5de5bcb163f2b062317be5aa7672135569f6f4fc9448599b1481519996e835943'
}

describe('passwordUtils', () => {
  describe('genPassword', () => {
    it('should return an object', () => {
      let result = genPassword(passwordFromForm);
      expect(typeof result).to.equal('object');
    })
    it('should return an object with a salt value', () => {
      let result = genPassword(passwordFromForm);
      expect(result).to.be.ownProperty('salt');
    })
    it('should return an object with a hash value', () => {
      let result = genPassword(passwordFromForm);
      expect(result).to.be.ownProperty('hash');
    })
    it('should return a different salt and hash with the same password', ()=> {
      expect(genPassword(passwordFromForm)).to.not.equal(genPassword(passwordFromForm))
    });
  })
  describe('validPassword', ()=> {
    it('should return a Boolean value', ()=> {
      let result = validPassword('1','1','1');
      expect(typeof result).to.equal('boolean');
    })
    it('should return true for a valid password', ()=> {
      let result = validPassword(passwordFromForm,sampleUser.hash,sampleUser.salt);
      expect(result).to.true;
    })
    it('should return false for an invalid password', ()=> {
      let result = validPassword('1',sampleUser.hash,sampleUser.salt);
      expect(result).to.false;
    })
  })
})
