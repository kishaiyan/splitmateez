/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateProperty = /* GraphQL */ `subscription OnCreateProperty($filter: ModelSubscriptionPropertyFilterInput) {
  onCreateProperty(filter: $filter) {
    id
    address
    rooms
    maximum
    bathroom
    parking
    ownerID
    Tenants {
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
` as GeneratedSubscription<
  APITypes.OnCreatePropertySubscriptionVariables,
  APITypes.OnCreatePropertySubscription
>;
export const onUpdateProperty = /* GraphQL */ `subscription OnUpdateProperty($filter: ModelSubscriptionPropertyFilterInput) {
  onUpdateProperty(filter: $filter) {
    id
    address
    rooms
    maximum
    bathroom
    parking
    ownerID
    Tenants {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePropertySubscriptionVariables,
  APITypes.OnUpdatePropertySubscription
>;
export const onDeleteProperty = /* GraphQL */ `subscription OnDeleteProperty($filter: ModelSubscriptionPropertyFilterInput) {
  onDeleteProperty(filter: $filter) {
    id
    address
    rooms
    maximum
    bathroom
    parking
    ownerID
    Tenants {
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
` as GeneratedSubscription<
  APITypes.OnDeletePropertySubscriptionVariables,
  APITypes.OnDeletePropertySubscription
>;
export const onCreateTenant = /* GraphQL */ `subscription OnCreateTenant($filter: ModelSubscriptionTenantFilterInput) {
  onCreateTenant(filter: $filter) {
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
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTenantSubscriptionVariables,
  APITypes.OnCreateTenantSubscription
>;
export const onUpdateTenant = /* GraphQL */ `subscription OnUpdateTenant($filter: ModelSubscriptionTenantFilterInput) {
  onUpdateTenant(filter: $filter) {
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
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTenantSubscriptionVariables,
  APITypes.OnUpdateTenantSubscription
>;
export const onDeleteTenant = /* GraphQL */ `subscription OnDeleteTenant($filter: ModelSubscriptionTenantFilterInput) {
  onDeleteTenant(filter: $filter) {
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
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTenantSubscriptionVariables,
  APITypes.OnDeleteTenantSubscription
>;
export const onCreateOwner = /* GraphQL */ `subscription OnCreateOwner($filter: ModelSubscriptionOwnerFilterInput) {
  onCreateOwner(filter: $filter) {
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
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateOwnerSubscriptionVariables,
  APITypes.OnCreateOwnerSubscription
>;
export const onUpdateOwner = /* GraphQL */ `subscription OnUpdateOwner($filter: ModelSubscriptionOwnerFilterInput) {
  onUpdateOwner(filter: $filter) {
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
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateOwnerSubscriptionVariables,
  APITypes.OnUpdateOwnerSubscription
>;
export const onDeleteOwner = /* GraphQL */ `subscription OnDeleteOwner($filter: ModelSubscriptionOwnerFilterInput) {
  onDeleteOwner(filter: $filter) {
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
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteOwnerSubscriptionVariables,
  APITypes.OnDeleteOwnerSubscription
>;
