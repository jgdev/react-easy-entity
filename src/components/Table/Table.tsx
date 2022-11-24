import React from "react";
import { EntityField } from "../../index.mjs";

export type Props = {
  rows: any[];
  fields: EntityField<any>[];
};

export const Table = (props: Props) => {
  const { columns, rows } = props.fields.reduce(
    (result, current) => {
      return {
        columns: [...result.columns, current],
        rows: [],
      };
    },
    {
      columns: [] as EntityField<any>[],
      rows: [],
    }
  );
  return (
    <table>
      <thead>
        <tr>
          {columns.map((field) => (
            <th key={field.property}>{field.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map(() => (
          <tr></tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
