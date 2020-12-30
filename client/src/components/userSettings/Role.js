import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadRoles, updateCompanyRoles } from '../../actions/roles';
import { Link, useParams } from 'react-router-dom'

import Spinner from '../layout/Spinner';
import RoleSection from './RoleSection';


const Role = ({ auth, roles: {loading, rolesData}, loadRoles, updateCompanyRoles}) => {


  let { department } = useParams();

  let permissionsByDocumentType = []

  const [permissionsState, setPermissionsState] = useState([])
  
  
  useEffect( ()=> {
    loadRoles(auth.user.company)
    
    
    if (!loading && rolesData) {

      let selectedPermissions = [];
      let documentTypes = [];

      // filter roles state to only select by department based on url params
      selectedPermissions = rolesData.permissions.filter(permission =>
        permission.department.toLowerCase() === department)

      // Add unique document types to array;
      for (let p in selectedPermissions) {
          if (!documentTypes.includes(selectedPermissions[p].document)) {
            documentTypes.push(selectedPermissions[p].document);
          }
      }
       
        // Loop through each found document type
        documentTypes.map(documentName => {
          
          let filteredPermissions = []
          
          // Loop through each permission and add to the set of permissions 
          // that match the document type. Push that to main permissions array.
          selectedPermissions.map(permission => {

            if (permission.document === documentName) {
              filteredPermissions.push(permission);
            }
          })
          permissionsByDocumentType.push(filteredPermissions);
        })

        setPermissionsState([...permissionsByDocumentType])

    } 
    
    
  }, [loadRoles, auth.user.company, loading]
  
  )

  const handleOnChange = (document, action, e) => {

    console.log('document: ', document);
    console.log('action: ', action);
    console.log('e.target.name: ', e.target.name);

    const newPermissions = [...permissionsState];
    for (let set in newPermissions) {

        for (let p in set ) {
          if (newPermissions[set][p].document === document && newPermissions[set][p].action === action) {
            newPermissions[set][p] = {...newPermissions[set][p], [e.target.name]: !newPermissions[set][p][e.target.name]}
            setPermissionsState([...newPermissions])
          }


        }
    }
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    let permissionsData = [];

    for (let i in permissionsState) {
      permissionsData = [...permissionsData, ...permissionsState[i]]
    }

    updateCompanyRoles(permissionsData, rolesData.company, department);
    console.log('rolesData.company: ', rolesData.company);

  }
  

  return (
    <Fragment>
    {loading ? (
      <Spinner/>
    ): (
      <div className="container-dashboard">
        <div className="container-headline">
          <p className="text-primary text-large">Sales Role</p>
          <p className="text-primary-light text-small">
            Customize permissions for manager and worker roles.
          </p>
        </div>
        { permissionsState.map((permissions, id) => (
          <RoleSection key={id} permissions={permissions} onChange={handleOnChange}/>
        ))
        }
        <button onClick={(e) => handleOnSubmit(e)} className="btn btn-small btn-primary btn-back m-2">
            Save
        </button>
        <Link to="/roles">
          <button className="btn btn-small btn-light btn-back m-2">
            <i className="fas fa-long-arrow-alt-left"></i>Back
          </button>
        </Link>
      </div>
    )}
    </Fragment>
  )
}

Role.propTypes = {
loadRoles: PropTypes.func.isRequired,
updateCompanyRoles: PropTypes.func.isRequired,
auth: PropTypes.object.isRequired,
roles: PropTypes.object.isRequired,

}

const mapStateToProps = state => ({
  auth: state.auth,
  roles: state.roles,
})



export default connect(mapStateToProps, { loadRoles, updateCompanyRoles })(Role);
