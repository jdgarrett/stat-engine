'use strict';

import { FireDepartment } from '../../sqldb';
import { retrieveSubscription } from '../../subscription/chargebee';

export async function refreshAllSubscriptions(req, res) {
  const departments = await FireDepartment.findAll({
    where: {
      customer_id: {
        $ne: null,
      },
    },
  });

  departments.forEach(async department => {
    console.log(`Updating "${department.name}" subscription...`);
    department.subscription = await retrieveSubscription(department);
    await department.save();
  });

  res.status(204).send();
}
