import translate from 'counterpart';

export default class Permissions {
    static config = {
        role: {
            leftTitle: translate('form.projects'),
            rightTitle: translate('form.users')
        },
        user: {
            leftTitle: translate('form.projects'),
            rightTitle: translate('form.roles')
        },
        project: {
            leftTitle: translate('form.users'),
            rightTitle: translate('form.roles')
        }
    };

    constructor(userPermissions, projects, roles) {
        this._permissions = userPermissions;
        this._roleTitles = {};
        this._projectTitles = {};
        this._userTitles = {};
        this._selectedLeftBlock = [];

        this._users = [];
        for (let user of userPermissions) {
            this._users.push(user.id);
            this._userTitles[user.id] = user.title;
        }
        this._projects = [];
        for (let project of projects) {
            this._projects.push(project.id);
            this._projectTitles[project.id] = project.title;
        }
        this._roles = [];
        for (let role of roles) {
            this._roles.push(role.id);
            this._roleTitles[role.id] = role.title;
        }
    }

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

    getRightBlockValue(selectedLeftRows, permissions, id) {
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

    getLeftRowTitles(type) {
        switch(type) {
        case 'project':
            return this._userTitles;
        case 'user':
            return this._projectTitles;
        case 'role':
            return this._projectTitles;
        }
    }

    getLeftRowsIds(type) {
        switch(type) {
        case 'project':
            return this._users;
        case 'user':
            return this._projects;
        case 'role':
            return this._projects;
        }
    }

    getRightRowTitles(type) {
        switch(type) {
        case 'project':
            return this._roleTitles;
        case 'user':
            return this._roleTitles;
        case 'role':
            return this._userTitles;
        }
    }

    getUserPermissions(user) {
        let permissions = {};
        for (let project of this._projects) {
            permissions[project] = {};
            for (let role of this._roles) {
                permissions[project][role] = false;
            }
        }

        for (let userPermission of this.permissions) {
            if (userPermission.id != user) {
                continue;
            }
            for (let projectPermission of userPermission.permissions) {
                for (let role of projectPermission.roles) {
                    permissions[projectPermission.project.id][role] = true;
                }
            }
        }

        return permissions;
    }

    getProjectPermissions(project) {
        if (!project) {
            return false;
        }

        let permissions = {};
        for (let user of this._users) {
            permissions[user] = {};
            for (let role of this._roles) {
                permissions[user][role] = false;
            }
        }

        for (let user of this.permissions) {
            for (let projectRoles of user.permissions) {
                if (projectRoles.project.id != project) {
                    continue;
                }
                for (let role of projectRoles.roles) {
                    permissions[user.id][role] = true;
                }
                break;
            }
        }

        return permissions;
    }

    getRolePermissions(role) {
        if (!role) {
            return false;
        }

        let permissions = {};
        for (let project of this._projects) {
            permissions[project] = {};
            for (let user of this._users) {
                permissions[project][user] = false;
            }
        }

        for (let userPermission of this.permissions) {
            for (let projectPermission of userPermission.permissions) {
                for (let permissionRole of projectPermission.roles) {
                    if (permissionRole != role) {
                        continue;
                    }
                    permissions[projectPermission.project.id][userPermission.id] = true;
                    break;
                }
            }
        }

        return permissions;
    }

    getPermissions(type, value) {
        switch(type) {
        case 'project':
            return this.getProjectPermissions(value);
        case 'user':
            return this.getUserPermissions(value);
        case 'role':
            return this.getRolePermissions(value);
        }
    }

    checkLeftRow(type, typeValueId, id, value) {
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
            for (let userPermissions of this.permissions) {
                if (userPermissions.id == typeValueId) {
                    for (let projectPermission of userPermissions.permissions) {
                        if (projectPermission.project.id == id) {
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
    }

    checkRightRow(type, typeValueId, selectedLeftRows, id, value) {
        switch(type) {
        case 'project':
            for (let userPermissions of this.permissions) {
                if (selectedLeftRows.indexOf(userPermissions.id) > -1) {
                    for (let projectPermission of userPermissions.permissions) {
                        if (projectPermission.project.id == typeValueId) {
                            let roleIndex = projectPermission.roles.indexOf(id);
                            if (value && roleIndex == -1) {
                                projectPermission.roles.push(id);
                            } else if (!value && roleIndex > -1) {
                                projectPermission.roles.splice(roleIndex, 1);
                            }
                        }
                    }
                }
            }
            break;
        case 'user':
            for (let userPermissions of this.permissions) {
                if (userPermissions.id == typeValueId) {
                    for (let projectPermission of userPermissions.permissions) {
                        if (selectedLeftRows.indexOf(projectPermission.project.id) > -1) {
                            let roleIndex = projectPermission.roles.indexOf(id);
                            if (value && roleIndex == -1) {
                                projectPermission.roles.push(id);
                            } else if (!value && roleIndex > -1) {
                                projectPermission.roles.splice(roleIndex, 1);
                            }
                        }
                    }
                }
            }
            break;
        case 'role':
            for (let userPermissions of this.permissions) {
                if (userPermissions.id == id) {
                    for (let projectPermission of userPermissions.permissions) {
                        if (selectedLeftRows.indexOf(projectPermission.project.id) > -1) {
                            let roleIndex = projectPermission.roles.indexOf(typeValueId);
                            if (value && roleIndex == -1) {
                                projectPermission.roles.push(typeValueId);
                            } else if (!value && roleIndex > -1) {
                                projectPermission.roles.splice(roleIndex, 1);
                            }
                        }
                    }
                }
            }
            break;
        }
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
