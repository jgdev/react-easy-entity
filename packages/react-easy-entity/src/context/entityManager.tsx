import React, {
  createContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from "react";
import debug from "debug";

import { EntityOptions } from "../";

export type EntityObject = EntityOptions<any> & {
  data: any[];
  ready?: boolean;
  initialLoad?: boolean;
};

export type Context = {
  entities: EntityObject[];
  addEntity: (options: EntityOptions<any>) => void;
  getEntity: (entityName: string) => EntityObject | undefined;
  getEntityRowById: (entityName: string, id: string) => any;
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
                  name: entity.name,
                  data: result,
                });
                break;
            }

            return result;
          })
          .catch((err: any) => {
            // handleError(entity, method, err);
          });
      },
    };
  }, {} as any);
};

export const EntityProvider = ({ children }) => {
  const currentState = useRef(null);
  const [state, dispatch] = useReducer(
    (
      prevState: EntityManagerState,
      action: { type: string; [key: string]: any }
    ) => {
      switch (action.type) {
        case "addEntity":
          return {
            ...prevState,
            entities: [...prevState.entities, action.entity],
          };
        case "updateRows":
          const entityIndex = prevState.entities.findIndex(
            (e) => e.name === action.name
          );
          if (entityIndex > -1) {
            prevState.entities[entityIndex].data = action.data;
          }
          return {
            ...prevState,
            entities: prevState.entities,
          };
        default: {
          console.error(`action: ${action.type} not implemented`);
          return prevState;
        }
      }
    },
    {
      entities: [],
    }
  );

  useEffect(() => {
    currentState.current = state;
  }, [state]);

  const addEntity = (entityObject: EntityObject) => {
    const entity = {
      ...entityObject,
      data: [],
      api: wrapApiMethods(entityObject, dispatch),
    };
    dispatch({ type: "addEntity", entity });
    entity.api.findAll && entity.api.findAll();
  };

  const getEntity = (name: string) =>
    currentState.current?.entities.find(
      (entity: EntityObject) => entity.name === name
    );

  const getEntityRowById = (name: string, rowId: string) =>
    getEntity(name)?.data.find((row) => row.id === rowId);

  log("render");

  return (
    <EntityContext.Provider
      value={{
        addEntity,
        getEntity,
        getEntityRowById,
        entities: state.entities,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};
