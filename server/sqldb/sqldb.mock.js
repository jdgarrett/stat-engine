'use strict';

import SequelizeMock from 'sequelize-mock';

const db = {
  Sequelize: SequelizeMock,
  sequelize: new SequelizeMock(),
};

// db.FireDepartment = db.sequelize.import('../api/fire-department/fire-department.model.mock');
db.App = db.sequelize.import('../api/app/app.model.mock');
db.AppInstallation = db.sequelize.import('../api/app/app-installation.model.mock');

db.AppInstallation.belongsTo(db.App);
// db.AppInstallation.belongsTo(db.FireDepartment);

module.exports = db;
