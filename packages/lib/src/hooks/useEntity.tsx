import React, { useEffect, useState } from "react";
import { useEntityManagerContext } from "./useEntityManagerContext";
import Table from "../components/Table";
import { EntityOptions } from "../";

import debug from "debug";

// export type ÷

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
  const Filters = () => (entityManager && <div id="filters" />) || <></>;
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
      Filters,
      Pagination,
      Modal,
    },
  };
};

export default useEntity;
