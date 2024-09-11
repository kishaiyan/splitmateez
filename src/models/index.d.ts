import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





type EagerProperty = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Property, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly address?: string | null;
  readonly rooms?: string | null;
  readonly maximum?: string | null;
  readonly bathroom?: string | null;
  readonly parking?: string | null;
  readonly ownerID: string;
  readonly Tenants?: (Tenant | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProperty = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Property, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly address?: string | null;
  readonly rooms?: string | null;
  readonly maximum?: string | null;
  readonly bathroom?: string | null;
  readonly parking?: string | null;
  readonly ownerID: string;
  readonly Tenants: AsyncCollection<Tenant>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Property = LazyLoading extends LazyLoadingDisabled ? EagerProperty : LazyProperty

export declare const Property: (new (init: ModelInit<Property>) => Property) & {
  copyOf(source: Property, mutator: (draft: MutableModel<Property>) => MutableModel<Property> | void): Property;
}

type EagerTenant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Tenant, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly email?: string | null;
  readonly phNo?: string | null;
  readonly useElectricity?: boolean | null;
  readonly useInternet?: boolean | null;
  readonly useWater?: boolean | null;
  readonly useGas?: boolean | null;
  readonly propertyID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTenant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Tenant, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly email?: string | null;
  readonly phNo?: string | null;
  readonly useElectricity?: boolean | null;
  readonly useInternet?: boolean | null;
  readonly useWater?: boolean | null;
  readonly useGas?: boolean | null;
  readonly propertyID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Tenant = LazyLoading extends LazyLoadingDisabled ? EagerTenant : LazyTenant

export declare const Tenant: (new (init: ModelInit<Tenant>) => Tenant) & {
  copyOf(source: Tenant, mutator: (draft: MutableModel<Tenant>) => MutableModel<Tenant> | void): Tenant;
}

type EagerOwner = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Owner, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly phNo?: string | null;
  readonly email?: string | null;
  readonly Properties?: (Property | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyOwner = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Owner, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly phNo?: string | null;
  readonly email?: string | null;
  readonly Properties: AsyncCollection<Property>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Owner = LazyLoading extends LazyLoadingDisabled ? EagerOwner : LazyOwner

export declare const Owner: (new (init: ModelInit<Owner>) => Owner) & {
  copyOf(source: Owner, mutator: (draft: MutableModel<Owner>) => MutableModel<Owner> | void): Owner;
}