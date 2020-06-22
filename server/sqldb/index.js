if(process.env.NODE_ENV === 'test') {
  module.exports = require('./sqldb.mock');
} else {
  module.exports = require('./sqldb');
}
