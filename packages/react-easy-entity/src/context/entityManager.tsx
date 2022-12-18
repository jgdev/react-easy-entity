import React, { createContext } from "react";
import debug from "debug";

import { EntityOptions } from "@root";

export type EntityObject<T = any> = EntityOptions<T> & {
  data: any[];
  loading: string[];
};

export type Context = {
  addEntity: (options: EntityOptions<any>) => void;
  getEntity: <T>(entityName: string) => EntityObject<T>;
  getEntityRowById: <T>(entityName: string, rowId: string) => T;
  addEntityRow: <T>(entityName: string, entity: Partial<T>) => Promise<T>;
  updateEntityRow: <T>(
    entityName: string,
    entityId: string,
    entity: Partial<T>
  ) => Promise<T>;
};

export const EntityContext = createContext<Context>({} as any);

export type EntityManagerState = {
  entities: EntityObject[];
};

const log = debug("entity:context");

const wrapApiMethods = (entity: EntityObject, dispatch: any) => {
  return Object.keys(entity.api).reduce((result, method) => {
    return {
      ...result,
      [method]: async (...args: any[]) => {
        log(`calling ${entity.name}.api.${method}`);

        return entity.api[method](...args)
          .then((result: any) => {
            log(`finished ${entity.name}.api.${method}`);

            switch (method) {
              case "findAll":
                dispatch({
                  type: "updateRows",
                  entityName: entity.name,
                  data: result,
                });
                dispatch({
                  type: "loading",
                  entityName: entity.name,
                  loading: "list",
                  value: false,
                });
                break;
            }

            return result;
          })
          .catch((err: any) => {
            console.error(err);
          });
      },
    };
  }, {} as any);
};

const setLoadingValue = (
  entityName: string,
  loading: string,
  value: boolean
) => {};

export type Props = {
  children: any;
};

export type State = {
  entities: EntityObject[];
};

export enum Actions {
  AddEntity = "addEntity",
  UpdateRows = "updateRows",
  Loading = "loading",
  UpdateEntityRow = "updateEntityRow",
  AddEntityRow = "addEntityRow",
}

export type Action = {
  type: Actions;
  [key: string]: any;
};

export class EntityProvider extends React.Component<Props> {
  state: State = {
    entities: [],
  };

  dispatch(action: Action) {
    log(`dispatch ${JSON.stringify(action, null, 2)}`);
    this.setState(this.reducer(this.state, action));
  }

  reducer(prevState: State, action: Action): State {
    const entities: EntityObject[] = prevState.entities;
    const entityIndex: number = entities.findIndex(
      (e) => e.name === action.entityName
    );

    switch (action.type) {
      case Actions.AddEntity:
        return {
          ...prevState,
          entities: prevState.entities.concat(action.entity),
        };
      case Actions.UpdateRows:
        if (entityIndex > -1) {
          entities[entityIndex].data = [...action.data];
        }
        return {
          ...prevState,
          entities,
        };
      case Actions.Loading:
        if (entityIndex > -1) {
          const isLoading =
            entities[entityIndex].loading.indexOf(action.loading) > -1;

          if (!isLoading && action.value) {
            entities[entityIndex].loading.push(action.loading);
          } else if (isLoading && !action.value) {
            entities[entityIndex].loading = entities[
              entityIndex
            ].loading.filter((l) => l !== action.loading);
          }
        }

        return {
          ...prevState,
          entities,
        };
      case Actions.UpdateEntityRow:
        const rowIndex = entities[entityIndex].data.findIndex(
          (row) => row.id === action.rowId
        );
        if (rowIndex < 0) return prevState;
        entities[entityIndex].data[rowIndex] = {
          ...entities[entityIndex].data[rowIndex],
          ...action.data,
        };
        return {
          ...prevState,
          entities,
        };
      case Actions.AddEntityRow:
        entities[entityIndex].data = entities[entityIndex].data.concat(action.data);
        return {
          ...prevState,
          entities,
        };
      default:
        throw new Error(`Unhandled action "${action.type}"`);
    }
  }

  getEntity(entityName: string) {
    return this.state.entities.find((entity) => entity.name === entityName);
  }

  addEntity(entityObject: EntityObject) {
    if (this.getEntity(entityObject.name)) return;
    const entity = {
      ...entityObject,
      data: [],
      loading: ["list"],
      api: wrapApiMethods(entityObject, this.dispatch.bind(this)),
    };
    this.dispatch({
      type: Actions.AddEntity,
      entity,
    });
    entity.api.findAll();
  }

  getEntityRowById(entityName: string, rowId: string) {
    return this.getEntity(entityName)?.data.find((row) => row.id === rowId);
  }

  async addEntityRow(entityName: string, data: any) {
    const entity = this.getEntity(entityName);
    this.dispatch({
      type: Actions.Loading,
      loading: 'create',
      entityName,
      value: true,
    });
    try {
      const result = await entity.api.create(data);
      this.dispatch({
        type: Actions.AddEntityRow,
        entityName,
        data: result,
      })
    } catch (err) {
      entity.onError && entity.onError(err)
    } finally {
      this.dispatch({
        type: Actions.Loading,
        loading: 'create',
        entityName,
        value: false,
      });
    }
  }

  async updateEntityRow(entityName: string, rowId: string, data: any) {
    const entity = this.getEntity(entityName);

    this.dispatch({
      type: Actions.Loading,
      loading: rowId,
      entityName,
      value: true,
    });

    try {
      const result = await entity.api.update(rowId, data);
      this.dispatch({
        type: Actions.UpdateEntityRow,
        entityName,
        rowId,
        data: result,
      });
    } catch (err) {
      entity.onError && entity.onError(err)
    } finally {
      this.dispatch({
        type: Actions.Loading,
        loading: rowId,
        entityName,
        value: false,
      });
    }
  }

  componentDidMount(): void {
    log("Render context");
  }

  render() {
    return (
      <EntityContext.Provider
        value={{
          addEntity: this.addEntity.bind(this),
          addEntityRow: this.addEntityRow.bind(this),
          updateEntityRow: this.updateEntityRow.bind(this),
          getEntity: this.getEntity.bind(this),
          getEntityRowById: this.getEntityRowById.bind(this),
        }}
      >
        {this.props.children}
      </EntityContext.Provider>
    );
  }
}
