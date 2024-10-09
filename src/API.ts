/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateNotificationInput = {
  id?: string | null,
  message: string,
  timestamp: string,
  isRead: boolean,
  recipientID: string,
  type: string,
  ownerID?: string | null,
  tenantID?: string | null,
  propertyID?: string | null,
  _version?: number | null,
};

export type ModelNotificationConditionInput = {
  message?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  isRead?: ModelBooleanInput | null,
  recipientID?: ModelIDInput | null,
  type?: ModelStringInput | null,
  ownerID?: ModelIDInput | null,
  tenantID?: ModelIDInput | null,
  propertyID?: ModelIDInput | null,
  and?: Array< ModelNotificationConditionInput | null > | null,
  or?: Array< ModelNotificationConditionInput | null > | null,
  not?: ModelNotificationConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type Notification = {
  __typename: "Notification",
  id: string,
  message: string,
  timestamp: string,
  isRead: boolean,
  recipientID: string,
  type: string,
  ownerID?: string | null,
  tenantID?: string | null,
  propertyID?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdateNotificationInput = {
  id: string,
  message?: string | null,
  timestamp?: string | null,
  isRead?: boolean | null,
  recipientID?: string | null,
  type?: string | null,
  ownerID?: string | null,
  tenantID?: string | null,
  propertyID?: string | null,
  _version?: number | null,
};

export type DeleteNotificationInput = {
  id: string,
  _version?: number | null,
};

export type CreatePropertyInput = {
  id?: string | null,
  address: string,
  rooms: string,
  maximum: string,
  bathroom: string,
  parking: string,
  photo: string,
  ownerID: string,
  _version?: number | null,
};

export type ModelPropertyConditionInput = {
  address?: ModelStringInput | null,
  rooms?: ModelStringInput | null,
  maximum?: ModelStringInput | null,
  bathroom?: ModelStringInput | null,
  parking?: ModelStringInput | null,
  photo?: ModelStringInput | null,
  ownerID?: ModelIDInput | null,
  and?: Array< ModelPropertyConditionInput | null > | null,
  or?: Array< ModelPropertyConditionInput | null > | null,
  not?: ModelPropertyConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type Property = {
  __typename: "Property",
  id: string,
  address: string,
  rooms: string,
  maximum: string,
  bathroom: string,
  parking: string,
  photo: string,
  Tenants?: ModelTenantConnection | null,
  ownerID: string,
  Notifications?: ModelNotificationConnection | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type ModelTenantConnection = {
  __typename: "ModelTenantConnection",
  items:  Array<Tenant | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type Tenant = {
  __typename: "Tenant",
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  phNo: string,
  useElectricity?: boolean | null,
  useInternet?: boolean | null,
  useWater?: boolean | null,
  useGas?: boolean | null,
  propertyID: string,
  photo: string,
  Notifications?: ModelNotificationConnection | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type ModelNotificationConnection = {
  __typename: "ModelNotificationConnection",
  items:  Array<Notification | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type UpdatePropertyInput = {
  id: string,
  address?: string | null,
  rooms?: string | null,
  maximum?: string | null,
  bathroom?: string | null,
  parking?: string | null,
  photo?: string | null,
  ownerID?: string | null,
  _version?: number | null,
};

export type DeletePropertyInput = {
  id: string,
  _version?: number | null,
};

export type CreateTenantInput = {
  id?: string | null,
  firstName: string,
  lastName: string,
  email: string,
  phNo: string,
  useElectricity?: boolean | null,
  useInternet?: boolean | null,
  useWater?: boolean | null,
  useGas?: boolean | null,
  propertyID: string,
  photo: string,
  _version?: number | null,
};

export type ModelTenantConditionInput = {
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phNo?: ModelStringInput | null,
  useElectricity?: ModelBooleanInput | null,
  useInternet?: ModelBooleanInput | null,
  useWater?: ModelBooleanInput | null,
  useGas?: ModelBooleanInput | null,
  propertyID?: ModelIDInput | null,
  photo?: ModelStringInput | null,
  and?: Array< ModelTenantConditionInput | null > | null,
  or?: Array< ModelTenantConditionInput | null > | null,
  not?: ModelTenantConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateTenantInput = {
  id: string,
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
  phNo?: string | null,
  useElectricity?: boolean | null,
  useInternet?: boolean | null,
  useWater?: boolean | null,
  useGas?: boolean | null,
  propertyID?: string | null,
  photo?: string | null,
  _version?: number | null,
};

export type DeleteTenantInput = {
  id: string,
  _version?: number | null,
};

export type CreateOwnerInput = {
  id?: string | null,
  firstName: string,
  lastName: string,
  phNo: string,
  email: string,
  photo: string,
  _version?: number | null,
};

export type ModelOwnerConditionInput = {
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  phNo?: ModelStringInput | null,
  email?: ModelStringInput | null,
  photo?: ModelStringInput | null,
  and?: Array< ModelOwnerConditionInput | null > | null,
  or?: Array< ModelOwnerConditionInput | null > | null,
  not?: ModelOwnerConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type Owner = {
  __typename: "Owner",
  id: string,
  firstName: string,
  lastName: string,
  phNo: string,
  email: string,
  Properties?: ModelPropertyConnection | null,
  photo: string,
  Notifications?: ModelNotificationConnection | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type ModelPropertyConnection = {
  __typename: "ModelPropertyConnection",
  items:  Array<Property | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type UpdateOwnerInput = {
  id: string,
  firstName?: string | null,
  lastName?: string | null,
  phNo?: string | null,
  email?: string | null,
  photo?: string | null,
  _version?: number | null,
};

export type DeleteOwnerInput = {
  id: string,
  _version?: number | null,
};

export type ModelNotificationFilterInput = {
  id?: ModelIDInput | null,
  message?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  isRead?: ModelBooleanInput | null,
  recipientID?: ModelIDInput | null,
  type?: ModelStringInput | null,
  ownerID?: ModelIDInput | null,
  tenantID?: ModelIDInput | null,
  propertyID?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelNotificationFilterInput | null > | null,
  or?: Array< ModelNotificationFilterInput | null > | null,
  not?: ModelNotificationFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelPropertyFilterInput = {
  id?: ModelIDInput | null,
  address?: ModelStringInput | null,
  rooms?: ModelStringInput | null,
  maximum?: ModelStringInput | null,
  bathroom?: ModelStringInput | null,
  parking?: ModelStringInput | null,
  photo?: ModelStringInput | null,
  ownerID?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPropertyFilterInput | null > | null,
  or?: Array< ModelPropertyFilterInput | null > | null,
  not?: ModelPropertyFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelTenantFilterInput = {
  id?: ModelIDInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phNo?: ModelStringInput | null,
  useElectricity?: ModelBooleanInput | null,
  useInternet?: ModelBooleanInput | null,
  useWater?: ModelBooleanInput | null,
  useGas?: ModelBooleanInput | null,
  propertyID?: ModelIDInput | null,
  photo?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelTenantFilterInput | null > | null,
  or?: Array< ModelTenantFilterInput | null > | null,
  not?: ModelTenantFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelOwnerFilterInput = {
  id?: ModelIDInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  phNo?: ModelStringInput | null,
  email?: ModelStringInput | null,
  photo?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelOwnerFilterInput | null > | null,
  or?: Array< ModelOwnerFilterInput | null > | null,
  not?: ModelOwnerFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelOwnerConnection = {
  __typename: "ModelOwnerConnection",
  items:  Array<Owner | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelSubscriptionNotificationFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  message?: ModelSubscriptionStringInput | null,
  timestamp?: ModelSubscriptionStringInput | null,
  isRead?: ModelSubscriptionBooleanInput | null,
  recipientID?: ModelSubscriptionIDInput | null,
  type?: ModelSubscriptionStringInput | null,
  ownerID?: ModelSubscriptionIDInput | null,
  tenantID?: ModelSubscriptionIDInput | null,
  propertyID?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionNotificationFilterInput | null > | null,
  or?: Array< ModelSubscriptionNotificationFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionPropertyFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  address?: ModelSubscriptionStringInput | null,
  rooms?: ModelSubscriptionStringInput | null,
  maximum?: ModelSubscriptionStringInput | null,
  bathroom?: ModelSubscriptionStringInput | null,
  parking?: ModelSubscriptionStringInput | null,
  photo?: ModelSubscriptionStringInput | null,
  ownerID?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPropertyFilterInput | null > | null,
  or?: Array< ModelSubscriptionPropertyFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionTenantFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  phNo?: ModelSubscriptionStringInput | null,
  useElectricity?: ModelSubscriptionBooleanInput | null,
  useInternet?: ModelSubscriptionBooleanInput | null,
  useWater?: ModelSubscriptionBooleanInput | null,
  useGas?: ModelSubscriptionBooleanInput | null,
  propertyID?: ModelSubscriptionIDInput | null,
  photo?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTenantFilterInput | null > | null,
  or?: Array< ModelSubscriptionTenantFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionOwnerFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  phNo?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  photo?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionOwnerFilterInput | null > | null,
  or?: Array< ModelSubscriptionOwnerFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type CreateNotificationMutationVariables = {
  input: CreateNotificationInput,
  condition?: ModelNotificationConditionInput | null,
};

export type CreateNotificationMutation = {
  createNotification?:  {
    __typename: "Notification",
    id: string,
    message: string,
    timestamp: string,
    isRead: boolean,
    recipientID: string,
    type: string,
    ownerID?: string | null,
    tenantID?: string | null,
    propertyID?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateNotificationMutationVariables = {
  input: UpdateNotificationInput,
  condition?: ModelNotificationConditionInput | null,
};

export type UpdateNotificationMutation = {
  updateNotification?:  {
    __typename: "Notification",
    id: string,
    message: string,
    timestamp: string,
    isRead: boolean,
    recipientID: string,
    type: string,
    ownerID?: string | null,
    tenantID?: string | null,
    propertyID?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteNotificationMutationVariables = {
  input: DeleteNotificationInput,
  condition?: ModelNotificationConditionInput | null,
};

export type DeleteNotificationMutation = {
  deleteNotification?:  {
    __typename: "Notification",
    id: string,
    message: string,
    timestamp: string,
    isRead: boolean,
    recipientID: string,
    type: string,
    ownerID?: string | null,
    tenantID?: string | null,
    propertyID?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreatePropertyMutationVariables = {
  input: CreatePropertyInput,
  condition?: ModelPropertyConditionInput | null,
};

export type CreatePropertyMutation = {
  createProperty?:  {
    __typename: "Property",
    id: string,
    address: string,
    rooms: string,
    maximum: string,
    bathroom: string,
    parking: string,
    photo: string,
    Tenants?:  {
      __typename: "ModelTenantConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ownerID: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdatePropertyMutationVariables = {
  input: UpdatePropertyInput,
  condition?: ModelPropertyConditionInput | null,
};

export type UpdatePropertyMutation = {
  updateProperty?:  {
    __typename: "Property",
    id: string,
    address: string,
    rooms: string,
    maximum: string,
    bathroom: string,
    parking: string,
    photo: string,
    Tenants?:  {
      __typename: "ModelTenantConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ownerID: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeletePropertyMutationVariables = {
  input: DeletePropertyInput,
  condition?: ModelPropertyConditionInput | null,
};

export type DeletePropertyMutation = {
  deleteProperty?:  {
    __typename: "Property",
    id: string,
    address: string,
    rooms: string,
    maximum: string,
    bathroom: string,
    parking: string,
    photo: string,
    Tenants?:  {
      __typename: "ModelTenantConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ownerID: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateTenantMutationVariables = {
  input: CreateTenantInput,
  condition?: ModelTenantConditionInput | null,
};

export type CreateTenantMutation = {
  createTenant?:  {
    __typename: "Tenant",
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phNo: string,
    useElectricity?: boolean | null,
    useInternet?: boolean | null,
    useWater?: boolean | null,
    useGas?: boolean | null,
    propertyID: string,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateTenantMutationVariables = {
  input: UpdateTenantInput,
  condition?: ModelTenantConditionInput | null,
};

export type UpdateTenantMutation = {
  updateTenant?:  {
    __typename: "Tenant",
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phNo: string,
    useElectricity?: boolean | null,
    useInternet?: boolean | null,
    useWater?: boolean | null,
    useGas?: boolean | null,
    propertyID: string,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteTenantMutationVariables = {
  input: DeleteTenantInput,
  condition?: ModelTenantConditionInput | null,
};

export type DeleteTenantMutation = {
  deleteTenant?:  {
    __typename: "Tenant",
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phNo: string,
    useElectricity?: boolean | null,
    useInternet?: boolean | null,
    useWater?: boolean | null,
    useGas?: boolean | null,
    propertyID: string,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateOwnerMutationVariables = {
  input: CreateOwnerInput,
  condition?: ModelOwnerConditionInput | null,
};

export type CreateOwnerMutation = {
  createOwner?:  {
    __typename: "Owner",
    id: string,
    firstName: string,
    lastName: string,
    phNo: string,
    email: string,
    Properties?:  {
      __typename: "ModelPropertyConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateOwnerMutationVariables = {
  input: UpdateOwnerInput,
  condition?: ModelOwnerConditionInput | null,
};

export type UpdateOwnerMutation = {
  updateOwner?:  {
    __typename: "Owner",
    id: string,
    firstName: string,
    lastName: string,
    phNo: string,
    email: string,
    Properties?:  {
      __typename: "ModelPropertyConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteOwnerMutationVariables = {
  input: DeleteOwnerInput,
  condition?: ModelOwnerConditionInput | null,
};

export type DeleteOwnerMutation = {
  deleteOwner?:  {
    __typename: "Owner",
    id: string,
    firstName: string,
    lastName: string,
    phNo: string,
    email: string,
    Properties?:  {
      __typename: "ModelPropertyConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type GetNotificationQueryVariables = {
  id: string,
};

export type GetNotificationQuery = {
  getNotification?:  {
    __typename: "Notification",
    id: string,
    message: string,
    timestamp: string,
    isRead: boolean,
    recipientID: string,
    type: string,
    ownerID?: string | null,
    tenantID?: string | null,
    propertyID?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListNotificationsQueryVariables = {
  filter?: ModelNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNotificationsQuery = {
  listNotifications?:  {
    __typename: "ModelNotificationConnection",
    items:  Array< {
      __typename: "Notification",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      recipientID: string,
      type: string,
      ownerID?: string | null,
      tenantID?: string | null,
      propertyID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncNotificationsQueryVariables = {
  filter?: ModelNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncNotificationsQuery = {
  syncNotifications?:  {
    __typename: "ModelNotificationConnection",
    items:  Array< {
      __typename: "Notification",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      recipientID: string,
      type: string,
      ownerID?: string | null,
      tenantID?: string | null,
      propertyID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type NotificationsByRecipientIDQueryVariables = {
  recipientID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type NotificationsByRecipientIDQuery = {
  notificationsByRecipientID?:  {
    __typename: "ModelNotificationConnection",
    items:  Array< {
      __typename: "Notification",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      recipientID: string,
      type: string,
      ownerID?: string | null,
      tenantID?: string | null,
      propertyID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type NotificationsByOwnerIDQueryVariables = {
  ownerID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type NotificationsByOwnerIDQuery = {
  notificationsByOwnerID?:  {
    __typename: "ModelNotificationConnection",
    items:  Array< {
      __typename: "Notification",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      recipientID: string,
      type: string,
      ownerID?: string | null,
      tenantID?: string | null,
      propertyID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type NotificationsByTenantIDQueryVariables = {
  tenantID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type NotificationsByTenantIDQuery = {
  notificationsByTenantID?:  {
    __typename: "ModelNotificationConnection",
    items:  Array< {
      __typename: "Notification",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      recipientID: string,
      type: string,
      ownerID?: string | null,
      tenantID?: string | null,
      propertyID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type NotificationsByPropertyIDQueryVariables = {
  propertyID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type NotificationsByPropertyIDQuery = {
  notificationsByPropertyID?:  {
    __typename: "ModelNotificationConnection",
    items:  Array< {
      __typename: "Notification",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      recipientID: string,
      type: string,
      ownerID?: string | null,
      tenantID?: string | null,
      propertyID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetPropertyQueryVariables = {
  id: string,
};

export type GetPropertyQuery = {
  getProperty?:  {
    __typename: "Property",
    id: string,
    address: string,
    rooms: string,
    maximum: string,
    bathroom: string,
    parking: string,
    photo: string,
    Tenants?:  {
      __typename: "ModelTenantConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ownerID: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListPropertiesQueryVariables = {
  filter?: ModelPropertyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPropertiesQuery = {
  listProperties?:  {
    __typename: "ModelPropertyConnection",
    items:  Array< {
      __typename: "Property",
      id: string,
      address: string,
      rooms: string,
      maximum: string,
      bathroom: string,
      parking: string,
      photo: string,
      ownerID: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncPropertiesQueryVariables = {
  filter?: ModelPropertyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncPropertiesQuery = {
  syncProperties?:  {
    __typename: "ModelPropertyConnection",
    items:  Array< {
      __typename: "Property",
      id: string,
      address: string,
      rooms: string,
      maximum: string,
      bathroom: string,
      parking: string,
      photo: string,
      ownerID: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type PropertiesByOwnerIDQueryVariables = {
  ownerID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPropertyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PropertiesByOwnerIDQuery = {
  propertiesByOwnerID?:  {
    __typename: "ModelPropertyConnection",
    items:  Array< {
      __typename: "Property",
      id: string,
      address: string,
      rooms: string,
      maximum: string,
      bathroom: string,
      parking: string,
      photo: string,
      ownerID: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetTenantQueryVariables = {
  id: string,
};

export type GetTenantQuery = {
  getTenant?:  {
    __typename: "Tenant",
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phNo: string,
    useElectricity?: boolean | null,
    useInternet?: boolean | null,
    useWater?: boolean | null,
    useGas?: boolean | null,
    propertyID: string,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListTenantsQueryVariables = {
  filter?: ModelTenantFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTenantsQuery = {
  listTenants?:  {
    __typename: "ModelTenantConnection",
    items:  Array< {
      __typename: "Tenant",
      id: string,
      firstName: string,
      lastName: string,
      email: string,
      phNo: string,
      useElectricity?: boolean | null,
      useInternet?: boolean | null,
      useWater?: boolean | null,
      useGas?: boolean | null,
      propertyID: string,
      photo: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncTenantsQueryVariables = {
  filter?: ModelTenantFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncTenantsQuery = {
  syncTenants?:  {
    __typename: "ModelTenantConnection",
    items:  Array< {
      __typename: "Tenant",
      id: string,
      firstName: string,
      lastName: string,
      email: string,
      phNo: string,
      useElectricity?: boolean | null,
      useInternet?: boolean | null,
      useWater?: boolean | null,
      useGas?: boolean | null,
      propertyID: string,
      photo: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type TenantsByPropertyIDQueryVariables = {
  propertyID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTenantFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TenantsByPropertyIDQuery = {
  tenantsByPropertyID?:  {
    __typename: "ModelTenantConnection",
    items:  Array< {
      __typename: "Tenant",
      id: string,
      firstName: string,
      lastName: string,
      email: string,
      phNo: string,
      useElectricity?: boolean | null,
      useInternet?: boolean | null,
      useWater?: boolean | null,
      useGas?: boolean | null,
      propertyID: string,
      photo: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetOwnerQueryVariables = {
  id: string,
};

export type GetOwnerQuery = {
  getOwner?:  {
    __typename: "Owner",
    id: string,
    firstName: string,
    lastName: string,
    phNo: string,
    email: string,
    Properties?:  {
      __typename: "ModelPropertyConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListOwnersQueryVariables = {
  filter?: ModelOwnerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOwnersQuery = {
  listOwners?:  {
    __typename: "ModelOwnerConnection",
    items:  Array< {
      __typename: "Owner",
      id: string,
      firstName: string,
      lastName: string,
      phNo: string,
      email: string,
      photo: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncOwnersQueryVariables = {
  filter?: ModelOwnerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncOwnersQuery = {
  syncOwners?:  {
    __typename: "ModelOwnerConnection",
    items:  Array< {
      __typename: "Owner",
      id: string,
      firstName: string,
      lastName: string,
      phNo: string,
      email: string,
      photo: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreateNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionNotificationFilterInput | null,
};

export type OnCreateNotificationSubscription = {
  onCreateNotification?:  {
    __typename: "Notification",
    id: string,
    message: string,
    timestamp: string,
    isRead: boolean,
    recipientID: string,
    type: string,
    ownerID?: string | null,
    tenantID?: string | null,
    propertyID?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionNotificationFilterInput | null,
};

export type OnUpdateNotificationSubscription = {
  onUpdateNotification?:  {
    __typename: "Notification",
    id: string,
    message: string,
    timestamp: string,
    isRead: boolean,
    recipientID: string,
    type: string,
    ownerID?: string | null,
    tenantID?: string | null,
    propertyID?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionNotificationFilterInput | null,
};

export type OnDeleteNotificationSubscription = {
  onDeleteNotification?:  {
    __typename: "Notification",
    id: string,
    message: string,
    timestamp: string,
    isRead: boolean,
    recipientID: string,
    type: string,
    ownerID?: string | null,
    tenantID?: string | null,
    propertyID?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreatePropertySubscriptionVariables = {
  filter?: ModelSubscriptionPropertyFilterInput | null,
};

export type OnCreatePropertySubscription = {
  onCreateProperty?:  {
    __typename: "Property",
    id: string,
    address: string,
    rooms: string,
    maximum: string,
    bathroom: string,
    parking: string,
    photo: string,
    Tenants?:  {
      __typename: "ModelTenantConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ownerID: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdatePropertySubscriptionVariables = {
  filter?: ModelSubscriptionPropertyFilterInput | null,
};

export type OnUpdatePropertySubscription = {
  onUpdateProperty?:  {
    __typename: "Property",
    id: string,
    address: string,
    rooms: string,
    maximum: string,
    bathroom: string,
    parking: string,
    photo: string,
    Tenants?:  {
      __typename: "ModelTenantConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ownerID: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeletePropertySubscriptionVariables = {
  filter?: ModelSubscriptionPropertyFilterInput | null,
};

export type OnDeletePropertySubscription = {
  onDeleteProperty?:  {
    __typename: "Property",
    id: string,
    address: string,
    rooms: string,
    maximum: string,
    bathroom: string,
    parking: string,
    photo: string,
    Tenants?:  {
      __typename: "ModelTenantConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ownerID: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateTenantSubscriptionVariables = {
  filter?: ModelSubscriptionTenantFilterInput | null,
};

export type OnCreateTenantSubscription = {
  onCreateTenant?:  {
    __typename: "Tenant",
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phNo: string,
    useElectricity?: boolean | null,
    useInternet?: boolean | null,
    useWater?: boolean | null,
    useGas?: boolean | null,
    propertyID: string,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateTenantSubscriptionVariables = {
  filter?: ModelSubscriptionTenantFilterInput | null,
};

export type OnUpdateTenantSubscription = {
  onUpdateTenant?:  {
    __typename: "Tenant",
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phNo: string,
    useElectricity?: boolean | null,
    useInternet?: boolean | null,
    useWater?: boolean | null,
    useGas?: boolean | null,
    propertyID: string,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteTenantSubscriptionVariables = {
  filter?: ModelSubscriptionTenantFilterInput | null,
};

export type OnDeleteTenantSubscription = {
  onDeleteTenant?:  {
    __typename: "Tenant",
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phNo: string,
    useElectricity?: boolean | null,
    useInternet?: boolean | null,
    useWater?: boolean | null,
    useGas?: boolean | null,
    propertyID: string,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateOwnerSubscriptionVariables = {
  filter?: ModelSubscriptionOwnerFilterInput | null,
};

export type OnCreateOwnerSubscription = {
  onCreateOwner?:  {
    __typename: "Owner",
    id: string,
    firstName: string,
    lastName: string,
    phNo: string,
    email: string,
    Properties?:  {
      __typename: "ModelPropertyConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateOwnerSubscriptionVariables = {
  filter?: ModelSubscriptionOwnerFilterInput | null,
};

export type OnUpdateOwnerSubscription = {
  onUpdateOwner?:  {
    __typename: "Owner",
    id: string,
    firstName: string,
    lastName: string,
    phNo: string,
    email: string,
    Properties?:  {
      __typename: "ModelPropertyConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteOwnerSubscriptionVariables = {
  filter?: ModelSubscriptionOwnerFilterInput | null,
};

export type OnDeleteOwnerSubscription = {
  onDeleteOwner?:  {
    __typename: "Owner",
    id: string,
    firstName: string,
    lastName: string,
    phNo: string,
    email: string,
    Properties?:  {
      __typename: "ModelPropertyConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    photo: string,
    Notifications?:  {
      __typename: "ModelNotificationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};
