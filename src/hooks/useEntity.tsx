import React, { useEffect } from "react";
import { useEntityManagerContext } from "./useEntityManagerContext";
import { EntityOptions } from "../index.mjs";

export const useEntity = <T extends {}>(entityOptions: EntityOptions<T>) => {
  const entityContext = useEntityManagerContext();

  useEffect(() => {
    entityContext.dispatchEntity(entityOptions);
  }, [entityOptions.name]);

  const Container = (props) => <div id="entity-container" {...props} />;
  const Table = () => <table id="table" />;
  const Filters = () => <div id="filters" />;
  const Pagination = () => <div id="pagination" />;
  const Modal = () => <div id="modal" />;

  return {
    Container,
    Table,
    Filters,
    Pagination,
    Modal,
  };
};

export default useEntity;
