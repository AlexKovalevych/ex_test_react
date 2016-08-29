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
            for (let user of permissions) {
                titles.push(user.email);
            }
            break;
        case 'user':
            for (let project of projects) {
                titles.push(project.title);
            }
            break;
        case 'role':
            for (let project of projects) {
                titles.push(project.title);
            }
            break;
        }
        return titles;
    }

    getLeftRowTitleIds(type, permissions, projects, users) {
        let ids = [];
        switch(type) {
        case 'project':
            for (let user of users) {
                ids.push({id: user.id, title: user.email});
            }
            break;
        case 'user':
            for (let project of projects) {
                ids.push({id: project.id, title: project.title});
            }
            break;
        case 'role':
            for (let project of projects) {
                ids.push({id: project.id, title: project.title});
            }
            break;
        }
        return ids;
    }

    getRightRowTitles(type, permissions, roles) {
        let titles = [];
        switch(type) {
        case 'project':
            for (let role of roles) {
                titles.push(role.title);
            }
            break;
        case 'user':
            for (let role of roles) {
                titles.push(role.title);
            }
            break;
        case 'role':
            for (let user of permissions) {
                titles.push(user.email);
            }
            break;
        }
        return titles;
    }

    getRightRowTitleIds(type, permissions, roles, users) {
        let ids = [];
        switch(type) {
        case 'project':
            for (let role of roles) {
                ids.push({id: role.id, title: role.title});
            }
            break;
        case 'user':
            for (let role of roles) {
                ids.push({id: role.id, title: role.title});
            }
            break;
        case 'role':
            for (let user of users) {
                ids.push({id: user.id, title: user.email});
            }
            break;
        }
        return ids;
    }

    getPermissions(permissions, projects, roles, type, id) {
        switch(type) {
        case 'project':
            return this.getProjectPermissions(permissions, roles, id);
        case 'user':
            return this.getUserPermissions(permissions, projects, roles, id);
        case 'role':
            return this.getRolePermissions(permissions, projects, id);
        }
    }

    getProjectPermissions(permissions, roles, projectId) {
        let projectPermissions = {};
        for (let user of permissions) {
            projectPermissions[user.id] = {};
            for (let role of roles) {
                projectPermissions[user.id][role.id] = false;
            }
        }

        for (let userPermission of permissions) {
            for (let group of Object.keys(userPermission.permissions)) {
                for (let role of Object.keys(userPermission.permissions[group])) {
                    for (let project of userPermission.permissions[group][role]) {
                        if (project != projectId) {
                            continue;
                        }
                        projectPermissions[userPermission.id][role] = true;
                    }
                }
            }
        }

        return projectPermissions;
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

    getRolePermissions(permissions, projects, roleId) {
        let rolePermissions = {};
        for (let project of projects) {
            rolePermissions[project.id] = {};
            for (let user of permissions) {
                rolePermissions[project.id][user.id] = false;
            }
        }

        for (let userPermission of permissions) {
            for (let group of Object.keys(userPermission.permissions)) {
                for (let role of Object.keys(userPermission.permissions[group])) {
                    if (role != roleId) {
                        continue;
                    }
                    for (let projectId of userPermission.permissions[group][role]) {
                        rolePermissions[projectId][userPermission.id] = true;
                    }
                }
            }
        }

        return rolePermissions;
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
        case 'project':
            for (let userPermissions of permissions) {
                if (selectedLeftRows.indexOf(userPermissions.id) === -1) {
                    continue;
                }
                for (let group of Object.keys(userPermissions.permissions)) {
                    for (let role of Object.keys(userPermissions.permissions[group])) {
                        if (role == id) {
                            let index = userPermissions.permissions[group][role].indexOf(typeValueId);
                            if (value && index == -1) {
                                userPermissions.permissions[group][role].push(typeValueId);
                            } else if (!value && index > -1) {
                                userPermissions.permissions[group][role].splice(index, 1);
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
