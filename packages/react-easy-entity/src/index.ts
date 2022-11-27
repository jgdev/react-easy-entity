import React from "react";

export type EntityField<T> = {
  label?: string;
  type: FieldType;
  render?: (row: T) => React.ReactElement;
  modalEdit?: boolean;
  tableEdit?: boolean;
  property: string;
  required?: boolean;
  defaultValue?: any;
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
  filters?: any;
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

export enum FieldType {
  Element,
  FullName,
  Email,
  Number,
  String,
}

export enum FilterType {
  Search,
  Select,
  Custom,
}

export { default as Table } from "./components/Table";
export { default as TableRow } from "./components/TableRow";
export { useEntity } from "./hooks/useEntity";
export { withEntityContext } from "./context/entityManager";
