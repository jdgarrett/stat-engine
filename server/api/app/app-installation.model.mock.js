'use strict';

module.exports = function(sequelize) {
  return sequelize.define('AppInstallations', {
    _id: 1,
  }, {
    timestamps: false,
    hasPrimaryKeys: false,
    underscored: true,
  });
};
