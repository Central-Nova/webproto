import React from 'react'

const EditProduct = () => {
  return (
    <div className="container-dashboard">
    <div className="container-headline">
      <p className="text-primary text-medium">Create Product</p>
      <p className="text-primary-light text-small">
        Enter the details of your new product.
      </p>
    </div>
    <div className="container-product-fields">
      <div className="container-text">
        <p className="text-regular text-primary">General</p>
        <p className="text-small text-primary-light">
          This information will be display in your product catalog and on
          customer-facing records.
        </p>
      </div>
      <div className="form container-form-general-product-grid">
        <div className="form-item sku">
          <input type="text" placeholder="SKU" />
        </div>
        <div className="form-item name">
          <input type="text" placeholder="Name" />
        </div>
        <div className="form-item description">
          <p className="text-primary-light">Description</p>
          <textarea type="text" placeholder="Description"> </textarea>
        </div>
      </div>
    </div>
    <div className="container-product-fields">
      <div className="container-text">
        <p className="text-regular text-primary">Specifications</p>
      </div>
      <div className="form container-form-product-grid">
        <div className="container-dimensions-grid">
          <div className="form-item">
            <input type="text" placeholder="L" />
          </div>
          <div className="form-item">
            <input type="text" placeholder="W" />
          </div>
          <div className="form-item">
            <input type="text" placeholder="H" />
          </div>
          <p className="text-primary-light">
            Dimensions in inches (L" x W" x H")
          </p>
        </div>

        <div className="form-item">
          <input type="text" placeholder="Weight" />
          <p className="text-primary-light">Weight in pounds</p>
        </div>
        <div className="form-item">
          <input type="text" placeholder="Color" />
        </div>
        <div className="form-item">
          <input type="text" placeholder="Primary Material" />
        </div>
      </div>
    </div>
    <div className="container-product-fields">
      <div className="container-text">
        <p className="text-regular text-primary">Configure Price</p>
      </div>
      <div className="form container-form-product-grid">
        <div className="form-item">
          <input type="text" placeholder="Unit Name" />
          <p className="text-hint text-primary-light">
            Smallest sellable unit ex. Pallet
          </p>
        </div>
        <div className="form-item">
          <input type="text" placeholder="Sub Unit Name" />
          <p className="text-hint text-primary-light">
            Sub units contained within a unit ex. Boxes
          </p>
        </div>
        <div className="form-item">
          <input type="text" placeholder="# of Sub Units" />
          <p className="text-hint text-primary-light">
            # of "Sub Units" contained in a "Unit" ex. "40"
          </p>
        </div>
        <div className="form-item">
          <input type="text" placeholder="Unit Price" />
          <p className="text-hint text-primary-light">Price of 1 unit.</p>
        </div>
      </div>
    </div>

    <div className="container-product-fields">
      <div className="container-text">
        <p className="text-regular text-primary">Price Rules</p>
        <p className="text-small text-primary-light">
          Configire pricing rules to offer volume discounts. Price rules can
          be applied on a per Sales Order basis.
        </p>
      </div>
      <div className="form container-form-price-grid">
        <div className="container-price-field-grid">
          <div className="form-item">
            <select type="text" placeholder="Unit">
              <option value="">Pallet</option>
            </select>
          </div>
          <div className="form-item">
            <input type="text" placeholder="Qty" />
          </div>
          <div className="form-item">
            <input type="text" placeholder="Price" />
          </div>
          <div className="btn-remove">
            <button className="btn btn-minus">
              <div className="circle"><i className="fas fa-minus"></i></div>
            </button>
          </div>
        </div>
        <div className="container-price-field-grid">
          <div className="form-item">
            <select type="text" placeholder="Unit">
              <option value="">Pallet</option>
            </select>
          </div>
          <div className="form-item">
            <input type="text" placeholder="Qty" />
          </div>
          <div className="form-item">
            <input type="text" placeholder="Price" />
          </div>
          <div className="btn-remove">
            <button className="btn btn-minus">
              <div className="circle"><i className="fas fa-minus"></i></div>
            </button>
          </div>
        </div>
        <button className="btn btn-plus" type="submit">
          <div className="circle"><i className="fas fa-plus"></i></div>
        </button>
      </div>
    </div>
    <button className="btn btn-primary btn-small">Save</button>
    <button className="btn btn-light btn-back btn-small mx-2">
      <i className="fas fa-arrow-left"></i>Back
    </button>
  </div>

  )
}

export default EditProduct
