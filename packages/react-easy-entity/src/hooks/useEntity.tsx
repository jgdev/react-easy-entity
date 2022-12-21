import React, { useEffect, useRef, useState, useContext } from "react";
import classnames from "classnames";
import debug from "debug";

import { EntityContext } from "@context/EntityContext";
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
  useEffect(() => {
    log("Render useEntity");
  }, []);
  const log = debug("hook:useEntity:" + entityOptions.name);
  const formRef = useRef<HTMLFormElement>(null);
  const {
    addEntity,
    addEntityRow,
    updateEntityRow,
    getEntity,
    getEntityRowById,
  } = useContext(EntityContext);
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

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fn = (): Promise<any> =>
      state.entity?.id
        ? updateEntityRow(entityOptions.name, state.entity.id, state.entity)
        : addEntityRow(entityOptions.name, state.entity);

    fn()
      .then((result) => {
        console.log("result", result);
      })
      .catch((err) => {
        console.error("err from submit", err);
      })
      .finally(() => {
        setState({
          modalOpen: false,
          entity: null,
        });
      });
  };

  const entityManager = getEntity(entityOptions.name);

  const filters = entityOptions.filters || [];

  const Pagination = () => (entityManager && <div id="pagination" />) || <></>;

  const loadingModal =
    entityManager?.loading.includes("create") ||
    entityManager?.loading.includes(state.entity?.id);

  return {
    actions: {
      createEntity: () => {
        setState({
          entity: {
            fullName: "Joan Test",
            email: "joan@test.test",
            age: 26,
          },
          modalOpen: true,
        });
      },
      editEntity: ({ id }, _: any) => {
        const entity = getEntityRowById<T>(entityOptions.name, id);
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
          rows={entityManager?.rows || []}
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
          loading={loadingModal}
          entity={state.entity}
          onClose={onCloseModal}
          className={classnames(
            `modal ${entityOptions.name}-modal`,
            state.modalOpen && "modal-backdrop"
          )}
          open={state.modalOpen}
          containerProps={{
            formRef,
            onSubmit: onFormSubmit,
          }}
        >
          {state.modalOpen && (
            <Fields
              loading={loadingModal}
              formRef={formRef}
              entityName={entityOptions.name}
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
