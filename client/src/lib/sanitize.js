export const removeEmptyFields = (data) => {
  Object.keys(data).forEach(key=> {
    if (typeof data[key] === 'object') {
      Object.keys(data[key]).forEach(nestkey => {
        if (data[key][nestkey] === '') {
          delete data[key][nestkey]
        }
      })
    } else {
      if (data[key] === '') {
        delete data[key]
      }
    }
  })
}

export const removeEmptyObjects = (data) => {
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'object' && Object.keys(data[key]).length === 0) {
      delete data[key]
    }
  })
}