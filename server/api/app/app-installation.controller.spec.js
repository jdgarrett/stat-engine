import httpMocks from 'node-mocks-http';

import * as controller from './app-installation.controller';
import { AppInstallation } from '../../sqldb';

describe.only('app-installation.controller', function() {
  describe('search', function() {
    let req, res;

    beforeEach(function() {
      req = httpMocks.createRequest({
        user: { client_id: 'clientId' },
      });
      res = httpMocks.createResponse();
    });

    it('succeeds', async function() {
      AppInstallation.$queueResult([
        AppInstallation.build({ _id: 123 }),
      ]);

      await controller.search(req, res);

      expect(res._getJSONData()).to.deep.equal([{
        _id: 123,
      }]);
    });

    it('fails: missing user client_id', async function() {
      req.user.client_id = undefined;

      await expect(controller.search(req, res)).to.be.rejectedWith(Error, 'User client_id is required');
    });
  });
});
