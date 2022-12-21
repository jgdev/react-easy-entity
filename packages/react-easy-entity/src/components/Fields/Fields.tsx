import React, { useEffect, useRef } from "react";

import { EntityField, FieldProps, FieldType } from "@root";
import { EntityObject } from "@root/context/EntityContext";
import { FieldInput } from "./FieldInput";

const fieldsByType: {
  [key: string]: any;
} = {
  [FieldType.Email]: (props: any) => <FieldInput {...props} />,
  [FieldType.FullName]: (props: any) => <FieldInput {...props} />,
  [FieldType.String]: (props: any) => <FieldInput {...props} />,
};

export const renderField =
  (params: {
    entityName: string;
    entityManager: EntityObject;
    entity: any;
    onChangeField: (property: string, value: any) => void;
    loading?: boolean;
  }) =>
  ({ props, ...field }: EntityField<any>) => {
    const FieldComponent = fieldsByType[field.type] || <></>;
    return (
      <div
        key={`${params.entityName}-${field.type}-${field.property}`}
        className={`field-container field-${params.entityName}-${field.type}-${field.property}`}
      >
        <FieldComponent
          {...(props || {})}
          entityManager={params.entityManager}
          field={field}
          entity={params.entity}
          loading={params.loading}
          onChange={(e: any) =>
            params.onChangeField(field.property, e.target.value)
          }
        />
      </div>
    );
  };

export default (
  props: FieldProps<any> & {
    formRef: React.RefObject<HTMLFormElement>;
    loading?: boolean;
  }
) => {
  useEffect(() => {
    props.formRef.current?.querySelector("input")?.focus();
  }, []);
  return <>{props.fields.map(renderField(props))}</>;
};
