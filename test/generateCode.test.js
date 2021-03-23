const expect = require('chai').expect;
const sinon = require('sinon');
const { generateCode } = require('../lib/generateCode');

describe('Lib: generateCode', () => {
  it('should generate a unique code for any given length', () => {
    let lengths = [1,5,10,20]

    lengths.forEach(length => {
      let code = generateCode(length);
      expect(code.length).to.equal(length);
    })
  })
})