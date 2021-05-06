import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadRoles, updateCompanyRoles } from '../../../actions/roles';
import { Link, useParams } from 'react-router-dom'

// Components
import Spinner from '../../layout/Spinner';
import RoleSection from './RoleSection';
import RoleCheck from '../../layout/auth/RoleCheck';
import HeroHeader from '../../../components/headers/HeroHeader';


const Role = ({ auth, roles: {loading, rolesData}, loadRoles, updateCompanyRoles}) => {

  let { department } = useParams();

  
  const [permissionsState, setPermissionsState] = useState([])
  
  
  useEffect( ()=> {
    loadRoles(auth.user.company)
    
    if (!loading && rolesData) {
      
      let permissionsByDocumentType = []
      
      // filter roles state to only select by department based on url params
      let permissionsByDepartment = rolesData.permissions.filter(permission =>
        permission.department.toLowerCase() === department)
        
      // Build array of unique document types (ex. 'Sales Quotes', 'Sales Orders');
      let documentTypes = [];
      for (let i in permissionsByDepartment) {
        if (!documentTypes.includes(permissionsByDepartment[i].document)) {
          documentTypes.push(permissionsByDepartment[i].document);
        }
      }
       
      // Loop through each unique document type
      documentTypes.forEach(documentName => {
        
        // Loop through each permission and add to the array of permissions that match the document type. Builds an array for each document type
        
        let filteredPermissions = permissionsByDepartment.filter( permission => permission.document === documentName)

        // Builds an array of arrays [[doctype1][doctype2][doctype3]...]
        permissionsByDocumentType.push(filteredPermissions);

        
      })

      setPermissionsState([...permissionsByDocumentType])

    } 
  }, [auth.user.company, loading, department, loadRoles]
  )

  console.log('permissionsState: ', permissionsState);

  const handleOnChange = (document, action, e) => {

    const newPermissions = [...permissionsState];
    for (let i in newPermissions) {
      
      let permissionSet = newPermissions[i]

        for (let j in permissionSet ) {
          if (permissionSet[j].document === document && permissionSet[j].action === action) {
            permissionSet[j] = {...permissionSet[j], [e.target.name]: !permissionSet[j][e.target.name]}
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
    window.scrollTo(0,0);
  }
  

  return (
    <Fragment>
    {loading ? (
      <Spinner/>
    ): (
      <div className="container-dashboard">
        <HeroHeader title={`${department.charAt(0).toUpperCase() + department.slice(1)} Permissions`}
        description='Customize permissions for manager and worker roles'
        /> 
        { permissionsState.map((permissions, id) => (
          <RoleSection key={id} permissions={permissions} onChange={handleOnChange}/>
        ))
        }
        <RoleCheck department='admin' document='rolepermissions' action='edit'
        yes={()=> (
          <button onClick={(e) => handleOnSubmit(e)} className="btn btn-small btn-primary btn-back m-2">
            Save
          </button>
        )}
        no={()=> (null)}/>
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
