'use strict';

let _;

export default class DepartmentAdminHomeController {
  /*@ngInject*/
  constructor(currentPrincipal, dataQuality, departmentUsers, User) {
    this.principal = currentPrincipal;
    this.fireDepartment = currentPrincipal.FireDepartment;
    this.departmentUsers = departmentUsers;
    this.dataQuality = dataQuality;
    this.UserService = User;
  }

  async loadModules() {
    _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
  }

  async $onInit() {
    await this.loadModules();

    this.users = _.filter(this.departmentUsers, u => !u.isAdmin);
  }

  refreshUsers() {
    this.UserService.query().$promise
      .then(departmentUsers => {
        this.users = _.filter(departmentUsers, u => !u.isAdmin);
      });
  }

  approveAccess(user) {
    this.UserService.approveAccess({ id: user._id}, {}).$promise
      .finally(() => {
        this.refreshUsers();
      });
  }

  revokeAccess(user) {
    this.UserService.revokeAccess({ id: user._id}, {}).$promise
      .finally(() => {
        this.refreshUsers();
      });
  }
}
