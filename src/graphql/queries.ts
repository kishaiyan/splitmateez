/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getProperty = /* GraphQL */ `query GetProperty($id: ID!) {
  getProperty(id: $id) {
    id
    address
    rooms
    maximum
    bathroom
    parking
    photo
    Tenants {
      nextToken
      startedAt
      __typename
    }
    ownerID
    Notifications {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPropertyQueryVariables,
  APITypes.GetPropertyQuery
>;
export const listProperties = /* GraphQL */ `query ListProperties(
  $filter: ModelPropertyFilterInput
  $limit: Int
  $nextToken: String
) {
  listProperties(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      address
      rooms
      maximum
      bathroom
      parking
      photo
      ownerID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPropertiesQueryVariables,
  APITypes.ListPropertiesQuery
>;
export const syncProperties = /* GraphQL */ `query SyncProperties(
  $filter: ModelPropertyFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncProperties(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      address
      rooms
      maximum
      bathroom
      parking
      photo
      ownerID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncPropertiesQueryVariables,
  APITypes.SyncPropertiesQuery
>;
export const getTenant = /* GraphQL */ `query GetTenant($id: ID!) {
  getTenant(id: $id) {
    id
    firstName
    lastName
    email
    phNo
    useElectricity
    useInternet
    useWater
    useGas
    propertyID
    photo
    Notifications {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTenantQueryVariables, APITypes.GetTenantQuery>;
export const listTenants = /* GraphQL */ `query ListTenants(
  $filter: ModelTenantFilterInput
  $limit: Int
  $nextToken: String
) {
  listTenants(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      firstName
      lastName
      email
      phNo
      useElectricity
      useInternet
      useWater
      useGas
      propertyID
      photo
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTenantsQueryVariables,
  APITypes.ListTenantsQuery
>;
export const syncTenants = /* GraphQL */ `query SyncTenants(
  $filter: ModelTenantFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncTenants(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      firstName
      lastName
      email
      phNo
      useElectricity
      useInternet
      useWater
      useGas
      propertyID
      photo
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncTenantsQueryVariables,
  APITypes.SyncTenantsQuery
>;
export const propertiesByOwnerID = /* GraphQL */ `query PropertiesByOwnerID(
  $ownerID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelPropertyFilterInput
  $limit: Int
  $nextToken: String
) {
  propertiesByOwnerID(
    ownerID: $ownerID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      address
      rooms
      maximum
      bathroom
      parking
      photo
      ownerID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PropertiesByOwnerIDQueryVariables,
  APITypes.PropertiesByOwnerIDQuery
>;
export const tenantsByPropertyID = /* GraphQL */ `query TenantsByPropertyID(
  $propertyID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelTenantFilterInput
  $limit: Int
  $nextToken: String
) {
  tenantsByPropertyID(
    propertyID: $propertyID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      firstName
      lastName
      email
      phNo
      useElectricity
      useInternet
      useWater
      useGas
      propertyID
      photo
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.TenantsByPropertyIDQueryVariables,
  APITypes.TenantsByPropertyIDQuery
>;
export const getNotification = /* GraphQL */ `query GetNotification($id: ID!) {
  getNotification(id: $id) {
    id
    message
    timestamp
    isRead
    recipientID
    type
    ownerID
    tenantID
    propertyID
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetNotificationQueryVariables,
  APITypes.GetNotificationQuery
>;
export const listNotifications = /* GraphQL */ `query ListNotifications(
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      message
      timestamp
      isRead
      recipientID
      type
      ownerID
      tenantID
      propertyID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNotificationsQueryVariables,
  APITypes.ListNotificationsQuery
>;
export const syncNotifications = /* GraphQL */ `query SyncNotifications(
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncNotifications(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      message
      timestamp
      isRead
      recipientID
      type
      ownerID
      tenantID
      propertyID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncNotificationsQueryVariables,
  APITypes.SyncNotificationsQuery
>;
export const notificationsByRecipientID = /* GraphQL */ `query NotificationsByRecipientID(
  $recipientID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  notificationsByRecipientID(
    recipientID: $recipientID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      message
      timestamp
      isRead
      recipientID
      type
      ownerID
      tenantID
      propertyID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.NotificationsByRecipientIDQueryVariables,
  APITypes.NotificationsByRecipientIDQuery
>;
export const notificationsByOwnerID = /* GraphQL */ `query NotificationsByOwnerID(
  $ownerID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  notificationsByOwnerID(
    ownerID: $ownerID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      message
      timestamp
      isRead
      recipientID
      type
      ownerID
      tenantID
      propertyID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.NotificationsByOwnerIDQueryVariables,
  APITypes.NotificationsByOwnerIDQuery
>;
export const notificationsByTenantID = /* GraphQL */ `query NotificationsByTenantID(
  $tenantID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  notificationsByTenantID(
    tenantID: $tenantID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      message
      timestamp
      isRead
      recipientID
      type
      ownerID
      tenantID
      propertyID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.NotificationsByTenantIDQueryVariables,
  APITypes.NotificationsByTenantIDQuery
>;
export const notificationsByPropertyID = /* GraphQL */ `query NotificationsByPropertyID(
  $propertyID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  notificationsByPropertyID(
    propertyID: $propertyID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      message
      timestamp
      isRead
      recipientID
      type
      ownerID
      tenantID
      propertyID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.NotificationsByPropertyIDQueryVariables,
  APITypes.NotificationsByPropertyIDQuery
>;
export const getOwner = /* GraphQL */ `query GetOwner($id: ID!) {
  getOwner(id: $id) {
    id
    firstName
    lastName
    phNo
    email
    Properties {
      nextToken
      startedAt
      __typename
    }
    photo
    Notifications {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetOwnerQueryVariables, APITypes.GetOwnerQuery>;
export const listOwners = /* GraphQL */ `query ListOwners(
  $filter: ModelOwnerFilterInput
  $limit: Int
  $nextToken: String
) {
  listOwners(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      firstName
      lastName
      phNo
      email
      photo
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOwnersQueryVariables,
  APITypes.ListOwnersQuery
>;
export const syncOwners = /* GraphQL */ `query SyncOwners(
  $filter: ModelOwnerFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncOwners(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      firstName
      lastName
      phNo
      email
      photo
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncOwnersQueryVariables,
  APITypes.SyncOwnersQuery
>;
