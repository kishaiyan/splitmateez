/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./src/API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createProperty = /* GraphQL */ `mutation CreateProperty(
  $input: CreatePropertyInput!
  $condition: ModelPropertyConditionInput
) {
  createProperty(input: $input, condition: $condition) {
    id
    address
    rooms
    maximum
    bathroom
    parking
    photo
    Tenants {
      nextToken
      __typename
    }
    ownerID
    Notifications {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePropertyMutationVariables,
  APITypes.CreatePropertyMutation
>;
export const updateProperty = /* GraphQL */ `mutation UpdateProperty(
  $input: UpdatePropertyInput!
  $condition: ModelPropertyConditionInput
) {
  updateProperty(input: $input, condition: $condition) {
    id
    address
    rooms
    maximum
    bathroom
    parking
    photo
    Tenants {
      nextToken
      __typename
    }
    ownerID
    Notifications {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePropertyMutationVariables,
  APITypes.UpdatePropertyMutation
>;
export const deleteProperty = /* GraphQL */ `mutation DeleteProperty(
  $input: DeletePropertyInput!
  $condition: ModelPropertyConditionInput
) {
  deleteProperty(input: $input, condition: $condition) {
    id
    address
    rooms
    maximum
    bathroom
    parking
    photo
    Tenants {
      nextToken
      __typename
    }
    ownerID
    Notifications {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePropertyMutationVariables,
  APITypes.DeletePropertyMutation
>;
export const createTenant = /* GraphQL */ `mutation CreateTenant(
  $input: CreateTenantInput!
  $condition: ModelTenantConditionInput
) {
  createTenant(input: $input, condition: $condition) {
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
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTenantMutationVariables,
  APITypes.CreateTenantMutation
>;
export const updateTenant = /* GraphQL */ `mutation UpdateTenant(
  $input: UpdateTenantInput!
  $condition: ModelTenantConditionInput
) {
  updateTenant(input: $input, condition: $condition) {
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
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTenantMutationVariables,
  APITypes.UpdateTenantMutation
>;
export const deleteTenant = /* GraphQL */ `mutation DeleteTenant(
  $input: DeleteTenantInput!
  $condition: ModelTenantConditionInput
) {
  deleteTenant(input: $input, condition: $condition) {
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
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTenantMutationVariables,
  APITypes.DeleteTenantMutation
>;
export const createNotification = /* GraphQL */ `mutation CreateNotification(
  $input: CreateNotificationInput!
  $condition: ModelNotificationConditionInput
) {
  createNotification(input: $input, condition: $condition) {
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateNotificationMutationVariables,
  APITypes.CreateNotificationMutation
>;
export const updateNotification = /* GraphQL */ `mutation UpdateNotification(
  $input: UpdateNotificationInput!
  $condition: ModelNotificationConditionInput
) {
  updateNotification(input: $input, condition: $condition) {
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateNotificationMutationVariables,
  APITypes.UpdateNotificationMutation
>;
export const deleteNotification = /* GraphQL */ `mutation DeleteNotification(
  $input: DeleteNotificationInput!
  $condition: ModelNotificationConditionInput
) {
  deleteNotification(input: $input, condition: $condition) {
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteNotificationMutationVariables,
  APITypes.DeleteNotificationMutation
>;
export const createOwner = /* GraphQL */ `mutation CreateOwner(
  $input: CreateOwnerInput!
  $condition: ModelOwnerConditionInput
) {
  createOwner(input: $input, condition: $condition) {
    id
    firstName
    lastName
    phNo
    email
    Properties {
      nextToken
      __typename
    }
    photo
    Notifications {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateOwnerMutationVariables,
  APITypes.CreateOwnerMutation
>;
export const updateOwner = /* GraphQL */ `mutation UpdateOwner(
  $input: UpdateOwnerInput!
  $condition: ModelOwnerConditionInput
) {
  updateOwner(input: $input, condition: $condition) {
    id
    firstName
    lastName
    phNo
    email
    Properties {
      nextToken
      __typename
    }
    photo
    Notifications {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateOwnerMutationVariables,
  APITypes.UpdateOwnerMutation
>;
export const deleteOwner = /* GraphQL */ `mutation DeleteOwner(
  $input: DeleteOwnerInput!
  $condition: ModelOwnerConditionInput
) {
  deleteOwner(input: $input, condition: $condition) {
    id
    firstName
    lastName
    phNo
    email
    Properties {
      nextToken
      __typename
    }
    photo
    Notifications {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteOwnerMutationVariables,
  APITypes.DeleteOwnerMutation
>;
