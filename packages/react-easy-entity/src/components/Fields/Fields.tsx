import React, { useEffect, useRef } from "react";

import { EntityField, FieldProps, FieldType } from "@root";
import { EntityObject } from "@context/entityManager";
import { FieldInput } from "./FieldInput";

const fieldsByType: {
  [key: string]: any;
} = {
  [FieldType.Email]: (props: any) => <FieldInput {...props} />,
  [FieldType.FullName]: (props: any) => <FieldInput {...props} />,
  [FieldType.String]: (props: any) => <FieldInput {...props} />,
};

export const renderField =
  (
    entityName: string,
    entityManager: EntityObject,
    entity: any,
    onChangeField: (property: string, value: any) => void = () => {}
  ) =>
  ({ props, ...field }: EntityField<any>) => {
    const FieldComponent = fieldsByType[field.type] || <></>;
    return (
      <div
        key={`${entityName}-${field.type}-${field.property}`}
        className={`field-container field-${entityName}-${field.type}-${field.property}`}
      >
        <FieldComponent
          {...(props || {})}
          entityManager={entityManager}
          field={field}
          entity={entity}
          onChange={(e: any) => onChangeField(field.property, e.target.value)}
        />
      </div>
    );
  };

export default ({
  fields = [],
  name,
  entityManager,
  entity = {},
  onChangeField,
  onSubmit,
  formRef,
}: FieldProps<any> & {
  onSubmit: (e: any) => void;
  formRef?: React.RefObject<HTMLFormElement>;
}) => {
  useEffect(() => {
    formRef?.current.querySelector("input").focus();
  }, []);

  return (
    <form onSubmit={onSubmit} ref={formRef}>
      {fields.map(renderField(name, entityManager, entity, onChangeField))}
    </form>
  );
};
