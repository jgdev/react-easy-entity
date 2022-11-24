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

export type EntityOptions<T> = {
  name: string;
  fields: EntityField<T>[];
  api: Partial<{
    create: (data: any) => Promise<T>;
    update: (id: any, data: any) => Promise<T>;
    del: (id: any) => Promise<void>;
    list: () => Promise<T[]>;
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

export { default as Table } from "./components/Table/index.mjs";
export { default as TableRow } from "./components/TableRow/index.mjs";
