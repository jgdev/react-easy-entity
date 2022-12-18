import React from "react";
import { EntityObject } from "./context/entityManager";

export type EntityField<T> = {
  label?: string;
  type: FieldType;
  render?: (row: T) => React.ReactElement;
  modalEdit?: boolean;
  tableEdit?: boolean;
  property: string;
  required?: boolean;
  defaultValue?: any;
  props?: any;
};

export type EntityFilter = {
  name: string;
  type: FilterType;
  props?: any;
};

export type EntityTableProps = React.HTMLAttributes<HTMLTableElement> & {
  onRowClick?: (
    entity: any,
    event?: React.MouseEvent<HTMLTableRowElement>
  ) => void;
  tableRowProps?: React.HTMLAttributes<HTMLTableRowElement>;
  tableHeaderProps?: React.HTMLAttributes<HTMLTableHeaderCellElement>;
};

export type EntityOptions<T> = {
  name: string;
  fields: EntityField<T>[];
  filters?: EntityFilter[];
  table?: EntityTableProps;
  api: Partial<{
    create: (data: any) => Promise<T>;
    update: (id: any, data: any) => Promise<T>;
    del: (id: any) => Promise<void>;
    findAll: () => Promise<T[]>;
    findOne: (id: any) => Promise<T>;
  }>;
  onError?: (error: any, type?: string) => void;
};

export type FilterProps = {
  name: string;
  filters?: EntityFilter[];
};

export type FieldProps<T> = {
  entity: T;
  entityName: string;
  fields?: EntityField<T>[];
  entityManager: EntityObject<T>;
  onChangeField: (fieldProperty: string, value: any) => void;
};

export enum FieldType {
  Element = "custom-element",
  FullName = "fullName",
  Email = "email",
  Number = "number",
  String = "string",
}

export enum FilterType {
  Search = "search",
  Select = "select",
  Custom = "custom",
}

export { useEntity } from "./hooks/useEntity";
export { EntityProvider } from "./context/entityManager";
