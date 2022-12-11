import React from "react";
import { EntityObject } from "@context/entityManager";
import { EntityField } from "@root";

export type FieldInputProps = React.InsHTMLAttributes<HTMLInputElement> & {
  entityManager: EntityObject;
  entity: any;
  field: EntityField<any>;
};

export const FieldInput = ({
  entityManager,
  entity,
  field,
  ...props
}: FieldInputProps) => {
  return (
    <input
      className="field-input"
      {...props}
      defaultValue={(entity && entity[field.property]) || ""}
      spellCheck={props.spellCheck ?? false}
      placeholder={field.label}
    />
  );
};
