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
  addEntityRow: <T>(entityName: string, entity: Partial<T>) => void;
  updateEntityRow: <T>(entityName: string, entityId: string, entity: Partial<T>) => void;
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

        dispatch({
          type: "loading",
          entityName: entity.name,
          loading: "list",
          value: true,
        });

        return entity.api[method](...args)
          .then((result: any) => {
            log(`finished ${entity.name}.api.${method}`);

            switch (method) {
              case "findAll":
                dispatch({
                  type: "updateRows",
                  name: entity.name,
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
    this.setState((prevState: State) => this.reducer(prevState, action));
  }

  reducer(prevState: State, action: Action): State {
    let entities: EntityObject[];
    let entityIndex: number;

    switch (action.type) {
      case Actions.AddEntity:
        return {
          ...prevState,
          entities: prevState.entities.concat(action.entity),
        };
      case Actions.UpdateRows:
        entities = prevState.entities;
        entityIndex = entities.findIndex((e) => e.name === action.name);
        if (entityIndex > -1) {
          entities[entityIndex].data = [...action.data];
        }
        return {
          ...prevState,
          entities,
        };
      case Actions.Loading:
        entities = prevState.entities;
        entityIndex = prevState.entities.findIndex(
          (e) => e.name === action.entityName
        );

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
      default:
        console.error(`Unhandled action "${action.type}"`);
        return prevState;
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

  addEntityRow(entityName: string, entity: any) {

  }

  updateEntityRow(entityName: string, rowId: string, entity: any) {

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
