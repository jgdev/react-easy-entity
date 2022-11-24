import React, { useEffect } from "react";
import { useEntityManagerContext } from "./useEntityManagerContext";
import Table from "../components/Table/index.mjs";
import { EntityOptions } from "../index.mjs";

export const useEntity = <T extends {}>(entityOptions: EntityOptions<T>) => {
  const { registerEntity, entities, getEntity } = useEntityManagerContext();
  const entity = getEntity(entityOptions.name);

  useEffect(() => {
    registerEntity(entityOptions);
  }, []);

  const Container = (props) =>
    (entity && <div id="entity-container" {...props} />) || <></>;
  const mTable = () =>
    (entity && <Table rows={entity.data} fields={entity.fields} />) || <></>;
  const Filters = () => (entity && <div id="filters" />) || <></>;
  const Pagination = () => (entity && <div id="pagination" />) || <></>;
  const Modal = () => (entity && <div id="modal" />) || <></>;

  return {
    Components: {
      Container,
      Table: mTable,
      Filters,
      Pagination,
      Modal,
    },
  };
};

export default useEntity;
