import React from "react";
import { EntityField, EntityTableProps } from "../../index.mjs";

export type Props = EntityTableProps & {
  rows: any[];
  fields: EntityField<any>[];
};

export const Table = ({
  tableRowProps,
  tableHeaderProps,
  onRowClick = () => {},
  fields,
  rows,
  ...props
}: Props) => {
  const renderHead = () =>
    fields.map((field) => (
      <th {...tableHeaderProps} key={field.property}>
        {field.label}
      </th>
    ));
  const renderRows = () => {
    return rows.map((entity: any) => {
      const handleClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
        if (tableRowProps?.onClick) tableRowProps.onClick(e);
        if (e.isDefaultPrevented() || e.isPropagationStopped()) return;
        onRowClick(entity, e);
      };
      return (
        <tr {...tableRowProps} key={entity.id} onClick={handleClick}>
          {fields.map((field) => {
            return (
              <td key={`${entity.id}-${field.property}`}>
                {(field.render && field.render(entity)) ||
                  entity[field.property]}
              </td>
            );
          })}
        </tr>
      );
    });
  };
  return (
    <table {...props}>
      <thead>
        <tr>{renderHead()}</tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </table>
  );
};

export default Table;
