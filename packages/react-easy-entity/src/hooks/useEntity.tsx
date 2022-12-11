import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import debug from "debug";

import { useEntityManagerContext } from "./useEntityManagerContext";
import Table, { Props as TableProps } from "@components/Table";
import Modal from "@components/Modal";
import Filters, { renderFilter } from "@components/Filters";
import Fields from "@components/Fields";
import { EntityOptions } from "@root";

export type State<T> = {
  modalOpen: boolean;
  entity: Partial<T & any>;
};

export const useEntity = <T extends {}>(entityOptions: EntityOptions<T>) => {
  const log = debug("hook:useEntity:" + entityOptions.name);
  const formRef = useRef<HTMLFormElement>(null);
  const { addEntity, addEntityRow, updateEntityRow, getEntity, getEntityRowById } = useEntityManagerContext();
  const [state, _setState] = useState<State<T>>({
    modalOpen: false,
    entity: null,
  });

  const setState = (newState: Partial<State<T>>) =>
    _setState((prevState) => ({
      ...prevState,
      ...newState,
    }));

  useEffect(() => {
    log(`registering entity ${entityOptions.name}`);
    addEntity(entityOptions);
  }, []);

  const onChangeField = (property: string, value: any) => {
    const entity = state.entity || {};
    setState({
      entity: {
        ...(state.entity || {}),
        ...entity,
        [property]: value,
      },
    });
  };

  const onCloseModal = () => setState({ entity: null, modalOpen: false });

  const onFormSubmit = (e: any) => {
    e.preventDefault();
    if (state.entity?.id) {
      log(`Update entity ${JSON.stringify(state.entity, null, 2)}`);
      updateEntityRow(entityOptions.name, state.entity.id, state.entity);
      return;
    }
    log(`Create entity ${JSON.stringify(state.entity, null, 2)}`);
    addEntityRow(entityOptions.name, state.entity);
  };

  const entityManager = getEntity(entityOptions.name);

  const filters = entityOptions.filters || [];

  const Pagination = () => (entityManager && <div id="pagination" />) || <></>;

  return {
    actions: {
      createEntity: () => {
        log("create entity");
        setState({
          entity: null,
          modalOpen: true,
        });
      },
      editEntity: ({ id }, _: any) => {
        const entity = getEntityRowById<T>(entityOptions.name, id);
        log(`edit entity ${JSON.stringify(entity, null, 2)}`);
        setState({
          entity,
          modalOpen: true,
        });
      },
    },
    components: {
      Table: (
        <Table
          loading={entityManager?.loading.includes("list") || false}
          rows={entityManager?.data || []}
          fields={entityManager?.fields || []}
          {...(entityManager?.table || {})}
        />
      ),
      Filters: <Filters filters={filters} name={entityOptions.name} />,
      filters:
        entityManager?.filters.reduce((result, filter) => {
          return {
            ...result,
            [filter.name]: renderFilter(filter.name)(filter),
          };
        }, {} as any) || ({} as any),
      Pagination,
      Modal: (
        <Modal
          entity={state.entity}
          onSubmit={() => formRef.current.requestSubmit()}
          onClose={onCloseModal}
          className={classnames(
            `modal ${entityOptions.name}-modal`,
            state.modalOpen && "modal-backdrop"
          )}
          open={state.modalOpen}
        >
          {state.modalOpen && (
            <Fields
              formRef={formRef}
              onSubmit={onFormSubmit}
              name={entityOptions.name}
              fields={entityOptions.fields}
              entityManager={entityManager}
              entity={state.entity}
              onChangeField={onChangeField}
            />
          )}
        </Modal>
      ),
    },
  };
};

export default useEntity;
