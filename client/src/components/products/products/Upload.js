import React, { Fragment, useState } from 'react'
import { CSVReader, CSVDownloader } from 'react-papaparse';
import Modal from '../../layout/modals/Modal';
import { clearProductSubmission, createProduct } from '../../../actions/products'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const initialState = {
  errors: [],
  data: {},
  productRecords: 0
}


const Upload = ({ createProduct, setModalState, modalState, submitSuccess, clearProductSubmission }) => {
  const [ fileState, setFileState ] = useState(initialState)

  const createObject = (data) => {
    // Get headers
    let headers = data[0].data
    let formattedData = [];

    // Loop through rows of uploaded file starting after headers
    for (let i = 1; i < data.length; i++) {
      let row = data[i].data;
      let product = {
        dimensions: {},
        basePrice: {},
        priceRules: []
      }
      // Build one product object; Loop through each column/value. 
      // *Header index and value index is aligned
      for (let j in row) {
        let value = row[j]
        let key = headers[j]
  
        // If priceRules; build priceRules Array 
        if (key.includes('priceRules')) {
          let priceRuleSplit = key.split('.')
          let prKey = priceRuleSplit[1]
          let index = priceRuleSplit[2];
          product.priceRules[index] = {
            ...product.priceRules[index],
            [prKey]: value
          }
          // If dimensions; build dimensions object
        } else if (key.includes('dimensions') || key.includes('basePrice')){
          let dataSplit = key.split('.');
          let objectName = dataSplit[0]
          let objectKey = dataSplit[1];
          product[objectName][objectKey] = value;
  
        } else {
          // else key:value
          product[key] = value;
        }
      }
      formattedData.push(product);
    }
    console.log('formattedData: ', formattedData);
    return formattedData;
    // Loop through each row and create key with header and value from data
  }  

  const validate = (data) => {
    let errorMessages = [['field', 'value', 'reason', 'row']]

    const config = [
      {
        name: 'notEmpty',
        fields: [/sku/i, /name/i, /description/i, /basePrice.unit/i, /basePrice.subUnit/i, /basePrice.contains/i, /basePrice.price/i],
        validate: value => value !== '',
        errorMessage: (header => (`${header} is missing/empty.`))
      },
      {
        name: 'isNumber',
        fields: [/length/i, /width/i, /height/i, /contains/i, /quantity/i, /basePrice.price/i, /priceRules.price/i, /weight/i],
        validate: value => {
          if (value === '') {
            return true
          } else {
            return !isNaN(value)}
          },
        errorMessage: (header => (`${header} is not a number.`))
      },
      {
        name: 'notZero',
        fields: [/length/i, /width/i, /height/i, /contains/i, /quantity/i, /basePrice.price/i, /priceRules.price/i, /weight/i],
        validate: value => {
          if (value === '') {
            return true
          } else {
            return parseInt(value) > 0}
          },
        errorMessage: (header => (`${header} should be greater than 0.`))
      },
      {
        name: 'minLength',
        fields: [/sku/i],
        validate: value => {
          if (value === '') {
            return true
          } else {
            return value.length > 4 }
          },
        errorMessage: (header => (`${header} should be at least 4 characters.`))
      },
      {
        name: 'maxlength',
        fields: [/sku/i],
        validate: value => {
          if (value === '') {
            return true
          } else {
            return value.length <= 20 }
          },
        errorMessage: (header => (`${header} should be less than 20 characters.`))
      },
      {
        name: 'maxLength',
        fields: [/name/i],
        validate: value => {
          if (value === '') {
            return true
          } else {
            return value.length <= 80 }
          },
        errorMessage: (header => (`${header} should be less than 80 characters.`))
      },
      {
        name: 'maxLength',
        fields: [/description/i],
        validate: value => {
          if (value === '') {
            return true
          } else { return value.length <= 200 }
          },
        errorMessage: (header => (`${header} should be less than 200 characters.`))
      },
    ]
    let headers = data[0].data;
    console.log('headers: ', headers);

    console.log('data: ', data);


    // Loop through each row
    for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
      console.log('rowIndex: ', rowIndex);
      let rowData = data[rowIndex].data;
      // Loop through row values
      rowData.forEach((rowValue, columnIndex) => {
        // Loop through rule and check RegExp match
        config.forEach(rule => {
          rule.fields.forEach(regexp => {
            if (headers[columnIndex].match(regexp)) {
              // Validate and return error message if false
              if (!rule.validate(rowValue)) {
                // console.log('failed: ', rule.name);
                // errorMessages.push(rule.errorMessage(headers[columnIndex], rowIndex, columnIndex + 1))
                errorMessages.push([`${headers[columnIndex]}`, rowValue, rule.errorMessage(headers[columnIndex]), rowIndex +1]);
              }
            } else return
          })
        } )
      })
    }

    return errorMessages;
  }

  const handleOnDrop = data => {
    let errors = validate(data);
    console.log('validate: ', validate(data));
    let formattedData = createObject(data);
    setFileState({productRecords: data.length, errors, data: formattedData});
  }


  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  const handleOnRemoveFile = () => {
    console.log('removed');
    setFileState(initialState)
  }

  const handleSubmit = () => {
    createProduct({products: fileState.data});
  }

  const handleModalClose = () => {
    setFileState(initialState);
    setModalState(!modalState);
    clearProductSubmission();
  }

 
      return (
        <Modal open={modalState} setModalState={setModalState}>
        <Fragment>
          <CSVReader
            onDrop={(data) => handleOnDrop(data)}
            onError={()=>handleOnError()}
            noClick
            addRemoveButton
            onRemoveFile={()=>handleOnRemoveFile()}
            config={{skipEmptyLines:true}}
            style={{
              dropArea: {
              marginBottom: '2rem'
              }
            }}
          > Drop file here to upload.
          </CSVReader>
          {fileState.productRecords > 0 && fileState.errors.length <= 2 && !submitSuccess &&
          <Fragment>
          <div className='text-primary text-small my-1'>
            {fileState.productRecords -1 } product records detected.
          </div>
          <button onClick={(data)=>handleSubmit(data)} style={{justifySelf: 'center'}} className="btn btn-small btn-primary">Upload</button>
          </Fragment>}
          {fileState.productRecords > 0 && fileState.errors.length <= 2 && submitSuccess &&
          <Fragment>
          <div className='text-primary text-small my-1'>
            {fileState.productRecords -1 } product records uploaded.
          </div>
          <button onClick={()=>handleModalClose()} style={{justifySelf: 'center'}} className="btn btn-small btn-light">Close</button>
          </Fragment>}
          {fileState.errors.length > 2 && 
            <Fragment>
              <div className='text-primary text-small my-1'>
                {fileState.errors.length} errors detected. A summary of the errors has been generated
              </div>
              <CSVDownloader 
                data={fileState.errors}
                type='button'
                fileName={'uploadsummary.csv'}
                bom={true}
                className='my-1 btn btn-small btn-primary'
                style={{alignSelf: 'center', justifySelf: 'center'}}
              >
                Download
              </CSVDownloader>
            </Fragment>}
        </Fragment>
        </Modal>
      )
}

Upload.propTypes = {
  createProduct: PropTypes.func.isRequired,
  clearProductSubmission: PropTypes.func.isRequired,
  submitSuccess: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  submitSuccess: state.products.submitSuccess
})

export default connect(mapStateToProps, {createProduct, clearProductSubmission})(Upload)
