const uniqueKeyHasValue = require('../../lib/uniqueKeyHasValue');
const expect = require('chai').expect;


const flatRoundObject = {
  name: 'apple',
  shape: 'round',
  quantity: '10'
}

const flatSquareObject = {
  name: 'box',
  shape: 'cube',
  quantity: '10'
}  

const nestedRoundObject = {
  name: 'apple',
  description: {
    shape: 'round',
  },
quantity: '10'
}

const nestSquareObject = {
  name: 'box',
  description: {
    shape: 'cube',
  },
quantity: '10'
} 

const doubleRoundObject = {
  name: 'apple',
  description: {
    shape: 'round',
  },
  shape: 'square',
quantity: '10'
}

const deeplyNestedObject = {
  name: 'box',
  nest1: {
    nest2: {
      nest3: {
        nest4: {
          nest5: {
            nest6: {
              next7: {
                shape: 'round'
              }
            }
          }
        }
      }
    }
  },
quantity: '10'
}

const targetKey = 'shape'
const targetValue = 'round'

describe('uniqueKeyHasValue', ()=> {
  it('should traverse flat objects', () => {
    expect(uniqueKeyHasValue(flatRoundObject,targetKey,targetValue)).to.equal(undefined);
  })
  it('should traverse nested objects', () => {
    expect(uniqueKeyHasValue(nestedRoundObject,targetKey,targetValue)).to.equal(undefined);
  })
  it('should traverse deeply nested objects', () => {
    expect(uniqueKeyHasValue(deeplyNestedObject,targetKey,targetValue)).to.equal(undefined);
  })
  it('should stop at the first matching key and value', () => {
    expect(uniqueKeyHasValue(doubleRoundObject,targetKey,targetValue)).to.equal(undefined);
  })
  it('should return value of key that failed match', () => {
    expect(uniqueKeyHasValue(flatSquareObject,targetKey,targetValue)).to.equal(flatSquareObject[targetKey]);
  })
  it('should return undefined if object passes match', () => {
    expect(uniqueKeyHasValue(flatRoundObject,targetKey,targetValue)).to.equal(undefined);

  })
})