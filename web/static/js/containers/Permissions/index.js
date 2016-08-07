// import React, { PropTypes } from 'react';
// import ReactDOM from 'react-dom';
// import PermissionsForm from './PermissionsForm';
// import PermissionsTable from './PermissionsTable';
// import PermissionsModel from '../../models/Permissions';

// export default class Permissions extends React.Component {
//     static propTypes = {
//         roles: PropTypes.array,
//         projects: PropTypes.array,
//         users: PropTypes.array,
//         csrf: PropTypes.string
//     };

//     render() {
//         let permissionsModel = new PermissionsModel(this.props.users, this.props.projects, this.props.roles, this.props.csrf);

//         return (
//             <div>
//                 <PermissionsForm permissionsModel={permissionsModel} />
//                 <PermissionsTable permissionsModel={permissionsModel} />
//             </div>
//         );
//     }
// }

// let element = document.getElementById('permissions');
// ReactDOM.render(
//     <Permissions
//         projects={window.gtApp.projects}
//         users={window.gtApp.users}
//         roles={window.gtApp.roles}
//         csrf={window.gtApp.csrfToken}
//     />,
//     element
// );
