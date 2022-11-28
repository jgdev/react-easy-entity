import React, { useEffect, useState, useContext } from "react";
import debug from "debug";

import { useEntityManagerContext } from "./useEntityManagerContext";
import Table from "../components/Table";
import Filters from "../components/Filters";
import { EntityOptions } from "../";

const log = debug("hook:useEntity");

export const useEntity = <T extends {}>(entityOptions: EntityOptions<T>) => {
  const { registerEntity, getEntity, getEntityRowById } =
    useEntityManagerContext();
  const entityManager = getEntity(entityOptions.name);
  const [state, setState] = useState({
    modalOpen: false,
    entity: null,
  });

  useEffect(() => {
    registerEntity(entityOptions);
    log(`registering entity ${entityOptions.name}`);
  }, []);

  const Container = (props) =>
    (entityManager && <div id="entity-container" {...props} />) || <></>;
  const mTable = () =>
    (entityManager && (
      <Table
        rows={entityManager.data}
        fields={entityManager.fields}
        {...entityManager.table}
      />
    )) || <></>;
  const mFilters = () =>
    (entityManager && (
      <Filters filters={entityOptions.filters} name={entityOptions.name} />
    )) || <></>;
  const Pagination = () => (entityManager && <div id="pagination" />) || <></>;
  const Modal = () => (entityManager && <div id="modal" />) || <></>;

  log("rendering");

  return {
    actions: {
      createEntity: () => setState({ modalOpen: true, entity: null }),
      editEntity: ({ id, preFetch = false }) => {
        const entityById = getEntityRowById(entityOptions.name, id);
        setState({
          modalOpen: true,
          entity:
            ((preFetch || !entityById) && entityOptions.api.findOne!(id)) ||
            entityById,
        });
      },
    },
    components: {
      Container,
      Table: mTable,
      Filters: mFilters,
      Pagination,
      Modal,
    },
  };
};

export default useEntity;
