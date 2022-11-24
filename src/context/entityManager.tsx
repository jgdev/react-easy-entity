import React, { createContext, useState } from "react";
import useMap from "../hooks/useMap";
import { EntityOptions } from "../index.mjs";
import debug from "debug";
import { useEffect } from "react";

export type EntityObject = EntityOptions<any> & {
  data: any[];
  ready?: boolean;
  initialLoad?: boolean;
};

export type Context = {
  entities: EntityObject[];
  registerEntity: (options: EntityOptions<any>) => void;
  getEntity: (entityName: string) => EntityObject | undefined;
};

export const EntityContext = createContext<Context>({} as any);

const log = debug("entity:context");

export const withEntityContext =
  (value: Partial<Context> = {}) =>
  (Component: React.FunctionComponent) => {
    return ({ children, ...props }: any) => {
      const [entities, setEntities] = useState<EntityObject[]>([]);

      const getEntity = (name: string) =>
        entities.find((entity) => entity.name === name);

      const handleError = (
        entity: EntityOptions<any>,
        methodType: string,
        error: any
      ) => {
        log(`method ${entity.name}.${methodType} error: ${error.message}`);
        entity.onError && entity.onError(error, methodType);
      };

      const wrapApiMethods = (entity: EntityOptions<any>) => {
        return Object.keys(entity.api).reduce((result, method) => {
          return {
            ...result,
            [method]: async (...args: any[]) => {
              log(`calling ${entity.name}.api.${method}`);

              return entity.api[method](...args)
                .then((result: any) => {
                  log(`finished ${entity.name}.api.${method}`);

                  switch (method) {
                    case "list":
                      setEntities((state) => {
                        const index = state.findIndex(
                          (e) => e.name === entity.name
                        );
                        const newState = [...state];
                        newState[index].data = result;
                        return newState;
                      });
                      break;
                  }

                  return result;
                })
                .catch((err: any) => {
                  handleError(entity, method, err);
                });
            },
          };
        }, {} as any);
      };

      const registerEntity = (options: EntityOptions<any>) => {
        setEntities((prevEntities) =>
          prevEntities.concat({
            ...options,
            data: [],
            initialLoad: false,
            ready: false,
            api: wrapApiMethods(options),
          })
        );
      };

      useEffect(() => {
        const initialLoadEntities = entities.filter(
          (entity) => !entity.initialLoad && !entity.ready
        );
        initialLoadEntities.forEach((entity) => {
          entity.api.list && entity.api.list();
        });
      }, [Object.keys(entities).length]);

      log("rendering");

      return (
        <EntityContext.Provider
          value={{
            ...value,
            entities,
            getEntity,
            registerEntity,
          }}
        >
          <Component {...props} />
        </EntityContext.Provider>
      );
    };
  };
