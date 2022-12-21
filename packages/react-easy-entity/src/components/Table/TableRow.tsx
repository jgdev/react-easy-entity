import React from "react";

import { EntityField } from "@root";

export type Props = React.DetailedHTMLProps<
  React.TdHTMLAttributes<HTMLTableDataCellElement>,
  HTMLTableDataCellElement
> & {
  entity: any;
  field: EntityField<any>;
};

export const TableData = () => {};

export const TableRow = ({ entity, field, ...props }: Props) => (
  <td {...props}>
    {(field.render && field.render(entity)) || entity[field.property]}
  </td>
);

export default TableRow;
