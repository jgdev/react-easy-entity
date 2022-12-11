import React, { useEffect } from "react";
import debug from "debug";
import { EntityField, EntityTableProps } from "@root";

const log = debug("component:Table");

export type Props = EntityTableProps & {
  rows: any[];
  fields: EntityField<any>[];
  loading?: boolean;
  loadingContainer?: React.ReactElement;
};

export const Table = ({
  tableRowProps,
  tableHeaderProps,
  onRowClick = () => {},
  fields,
  rows,
  loading = false,
  loadingContainer = <>Loading ...</>,
  ...props
}: Props) => {
  useEffect(() => {
    log("render");

    // interval.current = setInterval(() => {
    //   setCount((count) => count + 1);
    // }, 1000);

    // return () => {
    //   clearInterval(interval.current);
    // };
  }, []);

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

  return loading ? (
    <>{loadingContainer}</>
  ) : (
    <>
      <table {...props}>
        <thead>
          <tr>{renderHead()}</tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </>
  );
};

export default Table;
