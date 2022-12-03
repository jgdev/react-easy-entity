import React, { useEffect, useState, useContext } from "react";
import debug from "debug";

import { useEntityManagerContext } from "./useEntityManagerContext";
import Table from "../components/Table";
import Filters, { renderFilter } from "../components/Filters";
import { EntityOptions } from "../";

export type FiltersRender = {
  [key: string]: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>>;
};

export const useEntity = <T extends {}>(entityOptions: EntityOptions<T>) => {
  const log = debug("hook:useEntity:" + entityOptions.name);

  const { addEntity, getEntity, getEntityRowById } = useEntityManagerContext();

  useEffect(() => {
    addEntity(entityOptions);
    log(`registering entity ${entityOptions.name}`);
  }, []);

  const entityManager = getEntity(entityOptions.name);

  const [state, _setState] = useState<any>({
    modalOpen: false,
    entity: null,
    filters: (entityOptions.filters || []).reduce((result, filter) => {
      return {
        ...result,
        [filter.name]: (props: any) =>
          renderFilter(entityOptions.name, props)(filter),
      };
    }, {}),
  });

  const setState = (newState) => {
    _setState({
      ...state,
      ...newState,
    });
  };

  const filters = entityOptions.filters || [];

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
      <Filters filters={filters} name={entityOptions.name} />
    )) || <></>;
  const Pagination = () => (entityManager && <div id="pagination" />) || <></>;
  const Modal = () => (entityManager && <div id="modal" />) || <></>;

  log("rendering");

  return {
    actions: {
      createEntity: () => {
        log("create entity");
        setState({ modalOpen: true, entity: null });
      },
      editEntity: ({ id, preFetch = false }) => {
        log(`edit entity ${id}`);
        const entityById = getEntityRowById(entityOptions.name, id);
        log(`entity ${JSON.stringify(entityById, null, 2)}`);
        // setState({
        //   modalOpen: true,
        //   entity:
        //     ((preFetch || !entityById) && entityOptions.api.findOne!(id)) ||
        //     entityById,
        // });
      },
    },
    components: {
      Container,
      Table: mTable,
      Filters: mFilters,
      getFilters: (): FiltersRender => state.filters,
      Pagination,
      Modal,
    },
  };
};

export default useEntity;
