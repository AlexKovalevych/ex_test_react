class Permissions {
    static config = {
        role: {
            leftTitle: 'form.projects',
            rightTitle: 'form.users'
        },
        user: {
            leftTitle: 'form.projects',
            rightTitle: 'form.roles'
        },
        project: {
            leftTitle: 'form.users',
            rightTitle: 'form.roles'
        }
    };

    getConfigLeftTitle(type) {
        return Permissions.config[type].leftTitle;
    }

    getConfigRightTitle(type) {
        return Permissions.config[type].rightTitle;
    }

    // constructor(userPermissions, projects, roles) {
    //     this._permissions = userPermissions;
    //     this._roleTitles = {};
    //     this._projectTitles = {};
    //     this._userTitles = {};
    //     this._selectedLeftBlock = [];

    //     this._users = [];
    //     for (let user of userPermissions) {
    //         this._users.push(user.id);
    //         this._userTitles[user.id] = user.title;
    //     }
    //     this._projects = [];
    //     for (let project of projects) {
    //         this._projects.push(project.id);
    //         this._projectTitles[project.id] = project.title;
    //     }
    //     this._roles = [];
    //     for (let role of roles) {
    //         this._roles.push(role.id);
    //         this._roleTitles[role.id] = role.title;
    //     }
    // }

    get selectedLeftBlock() {
        return this._selectedLeftBlock;
    }

    set selectedLeftBlock(values) {
        this._selectedLeftBlock = values;
    }

    getLeftBlockValue(permissions) {
        let values = [];
        for (let k of Object.keys(permissions)) {
            values.push(permissions[k]);
        }
        if (values.indexOf(true) > -1 && values.indexOf(false) > -1) {
            return null;
        }
        if (values.indexOf(true) > -1) {
            return true;
        }

        return false;
    }

    getRightBlockValue(permissions, selectedLeftRows, id) {
        let values = [];
        for (let leftRowId of selectedLeftRows) {
            values.push(permissions[leftRowId][id]);
        }
        if (values.indexOf(true) > -1 && values.indexOf(false) > -1) {
            return null;
        }
        if (values.indexOf(true) > -1) {
            return true;
        }

        return false;
    }

    getLeftRowTitles(type, permissions, projects) {
        let titles = [];
        let values;
        switch(type) {
        case 'project':
            values = permissions;
            break;
        case 'user':
            values = projects;
            break;
        case 'role':
            values = projects;
            break;
        }
        for (let value of values) {
            titles.push(value.title);
        }
        return titles;
    }

    getLeftRowTitleIds(type, permissions, projects) {
        let ids = [];
        let values;
        switch(type) {
        case 'project':
            values = permissions;
            break;
        case 'user':
            values = projects;
            break;
        case 'role':
            values = projects;
            break;
        }
        for (let value of values) {
            ids.push({id: value.id, title: value.title});
        }
        return ids;
    }

    getRightRowTitles(type, permissions, roles) {
        let titles = [];
        let values;
        switch(type) {
        case 'project':
            values = roles;
            break;
        case 'user':
            values = roles;
            break;
        case 'role':
            values = permissions;
            break;
        }
        for (let value of values) {
            titles.push(value.title);
        }
        return titles;
    }

    getRightRowTitleIds(type, permissions, roles) {
        let ids = [];
        let values;
        switch(type) {
        case 'project':
            values = roles;
            break;
        case 'user':
            values = roles;
            break;
        case 'role':
            values = permissions;
            break;
        }
        for (let value of values) {
            ids.push({id: value.id, title: value.title});
        }
        return ids;
    }

    getPermissions(permissions, projects, roles, type, id) {
        switch(type) {
        case 'project':
            return this.getProjectPermissions(id);
        case 'user':
            return this.getUserPermissions(permissions, projects, roles, id);
        case 'role':
            return this.getRolePermissions(id);
        }
    }

    getProjectPermissions(project) {
        // if (!project) {
        //     return false;
        // }

        // let permissions = {};
        // for (let user of this._users) {
        //     permissions[user] = {};
        //     for (let role of this._roles) {
        //         permissions[user][role] = false;
        //     }
        // }

        // for (let user of this.permissions) {
        //     for (let projectRoles of user.permissions) {
        //         if (projectRoles.project.id != project) {
        //             continue;
        //         }
        //         for (let role of projectRoles.roles) {
        //             permissions[user.id][role] = true;
        //         }
        //         break;
        //     }
        // }

        // return permissions;
    }

    getUserPermissions(permissions, projects, roles, userId) {
        let userPermissions = {};
        for (let project of projects) {
            userPermissions[project.id] = {};
            for (let role of roles) {
                userPermissions[project.id][role.id] = false;
            }
        }

        for (let userPermission of permissions) {
            if (userPermission.id != userId) {
                continue;
            }
            for (let group of Object.keys(userPermission.permissions)) {
                for (let role of Object.keys(userPermission.permissions[group])) {
                    for (let projectId of userPermission.permissions[group][role]) {
                        userPermissions[projectId][role] = true;
                    }
                }
            }
        }

        return userPermissions;
    }

    getRolePermissions(role) {
        // if (!role) {
        //     return false;
        // }

        // let permissions = {};
        // for (let project of this._projects) {
        //     permissions[project] = {};
        //     for (let user of this._users) {
        //         permissions[project][user] = false;
        //     }
        // }

        // for (let userPermission of this.permissions) {
        //     for (let projectPermission of userPermission.permissions) {
        //         for (let permissionRole of projectPermission.roles) {
        //             if (permissionRole != role) {
        //                 continue;
        //             }
        //             permissions[projectPermission.project.id][userPermission.id] = true;
        //             break;
        //         }
        //     }
        // }

        // return permissions;
    }

    checkLeftRow(permissions, projects, roles, type, typeValueId, id, value) {
        switch(type) {
        case 'project':
            for (let userPermissions of this.permissions) {
                if (userPermissions.id == id) {
                    for (let projectPermission of userPermissions.permissions) {
                        if (projectPermission.project.id == typeValueId) {
                            for (let role of this.roles) {
                                let roleIndex = projectPermission.roles.indexOf(role);
                                if (value && roleIndex == -1) {
                                    projectPermission.roles.push(role);
                                } else if (!value && roleIndex > -1) {
                                    projectPermission.roles.splice(roleIndex, 1);
                                }
                            }
                        }
                    }
                }
            }
            break;
        case 'user':
            for (let userPermissions of permissions) {
                if (userPermissions.id == typeValueId) {
                    for (let group of Object.keys(userPermissions.permissions)) {
                        for (let role of Object.keys(userPermissions.permissions[group])) {
                            for (let projectId of projects) {
                                if (projectId == id) {
                                    let index = userPermissions.permissions[group][role].indexOf(projectId);
                                    if (value && index == -1) {
                                        userPermissions.permissions[group][role].push(projectId);
                                    } else if (!value && index > -1) {
                                        userPermissions.permissions[group][role].splice(index, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            break;
        case 'role':
            for (let userPermissions of this.permissions) {
                for (let projectPermission of userPermissions.permissions) {
                    if (projectPermission.project.id == id) {
                        let roleIndex = projectPermission.roles.indexOf(typeValueId);
                        if (value && roleIndex == -1) {
                            projectPermission.roles.push(typeValueId);
                        } else if (!value && roleIndex > -1) {
                            projectPermission.roles.splice(roleIndex, 1);
                        }
                    }
                }
            }
            break;
        }
        return permissions;
    }

    checkRightRow(permissions, type, typeValueId, selectedLeftRows, id, value) {
        switch(type) {
        // case 'project':
        //     for (let userPermissions of this.permissions) {
        //         if (selectedLeftRows.indexOf(userPermissions.id) > -1) {
        //             for (let projectPermission of userPermissions.permissions) {
        //                 if (projectPermission.project.id == typeValueId) {
        //                     let roleIndex = projectPermission.roles.indexOf(id);
        //                     if (value && roleIndex == -1) {
        //                         projectPermission.roles.push(id);
        //                     } else if (!value && roleIndex > -1) {
        //                         projectPermission.roles.splice(roleIndex, 1);
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     break;
        case 'user':
            for (let userPermissions of permissions) {
                if (userPermissions.id == typeValueId) {
                    for (let group of Object.keys(userPermissions.permissions)) {
                        for (let role of Object.keys(userPermissions.permissions[group])) {
                            if (role == id) {
                                if (value) {
                                    for (let projectId of selectedLeftRows) {
                                        let index = userPermissions.permissions[group][role].indexOf(projectId);
                                        if (index == -1) {
                                            userPermissions.permissions[group][role].push(projectId);
                                        }
                                    }
                                } else {
                                    for (let projectId of selectedLeftRows) {
                                        let index = userPermissions.permissions[group][role].indexOf(projectId);
                                        if (index > -1) {
                                            userPermissions.permissions[group][role].splice(index, 1);
                                        }
                                    }
                                }
                                return permissions;
                            }
                        }
                    }
                }
            }
            break;
        // case 'role':
        //     for (let userPermissions of this.permissions) {
        //         if (userPermissions.id == id) {
        //             for (let projectPermission of userPermissions.permissions) {
        //                 if (selectedLeftRows.indexOf(projectPermission.project.id) > -1) {
        //                     let roleIndex = projectPermission.roles.indexOf(typeValueId);
        //                     if (value && roleIndex == -1) {
        //                         projectPermission.roles.push(typeValueId);
        //                     } else if (!value && roleIndex > -1) {
        //                         projectPermission.roles.splice(roleIndex, 1);
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     break;
        }
        return permissions;
    }

    get projectTitles() {
        return this._projectTitles;
    }

    get projectOptions() {
        return Object.keys(this._projectTitles).map((projectId) => {
            return {
                value: projectId,
                label: this._projectTitles[projectId]
            };
        });
    }

    get userTitles() {
        return this._userTitles;
    }

    get userOptions() {
        return Object.keys(this._userTitles).map((userId) => {
            return {
                value: userId,
                label: this._userTitles[userId]
            };
        });
    }

    get roleTitles() {
        return this._roleTitles;
    }

    get roleOptions() {
        return Object.keys(this._roleTitles).map((role) => {
            return {
                value: role,
                label: role
            };
        });
    }

    get roles() {
        return this._roles;
    }

    get users() {
        return this._users;
    }

    get projects() {
        return this._projects;
    }

    get permissions() {
        return this._permissions;
    }
}

export default new Permissions();
