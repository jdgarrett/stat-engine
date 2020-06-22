// import app from './';
import mockery from 'mockery';

before(function(done) {
  mockery.enable();
  mockery.registerMock('')
  done();
});

after(function(done) {
  // app.angularFullstack.on('close', () => done());
  // app.angularFullstack.close();
  mockery.disable();
  done();
});
