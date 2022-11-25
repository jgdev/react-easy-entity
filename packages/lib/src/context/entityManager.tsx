import React, { createContext, useState } from "react";
import { useEffect } from "react";
import debug from "debug";

import { EntityOptions } from "../";

export type EntityObject = EntityOptions<any> & {
  data: any[];
  ready?: boolean;
  initialLoad?: boolean;
};

export type Context = {
  entities: EntityObject[];
  registerEntity: (options: EntityOptions<any>) => void;
  getEntity: (entityName: string) => EntityObject | undefined;
  getEntityRowById: (entityName: string, id: string) => any;
};

export const EntityContext = createContext<Context>({} as any);

const log = debug("entity:context");

export const withEntityContext =
  (value: Partial<Context> = {}) =>
  (Component: React.FunctionComponent) => {
    return ({ children, ...props }: any) => {
      const [entities, setEntities] = useState<EntityObject[]>([]);

      useEffect(() => {
        const initialLoadEntities = entities.filter(
          (entity) => !entity.initialLoad && !entity.ready
        );
        initialLoadEntities.forEach((entity) => {
          entity.api.findAll && entity.api.findAll();
        });
      }, [Object.keys(entities).length]);

      const getEntity = (name: string) =>
        entities.find((entity) => entity.name === name);

      const getEntityRowById = (name: string, id: string) =>
        getEntity(name)?.data.find((row) => row.id === id);

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
                    case "findAll":
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

      log("rendering");

      return (
        <EntityContext.Provider
          value={{
            ...value,
            entities,
            getEntity,
            getEntityRowById,
            registerEntity,
          }}
        >
          <Component {...props} />
        </EntityContext.Provider>
      );
    };
  };
