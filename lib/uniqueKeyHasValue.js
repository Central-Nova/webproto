module.exports = uniqueKeyHasValue = (data, matchKey, matchValue) => {
  let problemMatch;
  let objectKeys = Object.keys(data);

  for (let i in objectKeys) {
    let curKey = objectKeys[i]
    if (typeof data[curKey] === 'object') {
      return uniqueKeyHasValue(data[curKey], matchKey, matchValue)
    } else {
      if (curKey === matchKey && data[curKey] !== matchValue) {
        problemMatch = data[curKey];
        return problemMatch
      }
    }
  }
  return
}