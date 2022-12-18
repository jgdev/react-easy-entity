import React from "react";
import { EntityObject } from "@context/entityManager";
import { EntityField } from "@root";

export type FieldInputProps = React.InsHTMLAttributes<HTMLInputElement> & {
  entityManager: EntityObject;
  entity: any;
  field: EntityField<any>;
  loading?: boolean
  disabled?: boolean
};

export const FieldInput = ({
  entityManager,
  entity,
  field,
  loading,
  ...props
}: FieldInputProps) => {
  return (
    <input
      className="field-input"
      {...props}
      defaultValue={(entity && entity[field.property]) || ""}
      spellCheck={props.spellCheck ?? false}
      placeholder={field.label}
      disabled={props.disabled || loading}
    />
  );
};
