// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Notification, Property, Tenant, Owner } = initSchema(schema);

export {
  Notification,
  Property,
  Tenant,
  Owner
};