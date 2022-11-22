import React, { createContext, useState } from "react";
import { EntityOptions } from "../index.mjs";
import debug from "debug";
import { useEffect } from "react";

export type EntityObject = {
  data: any[];
  options: EntityOptions<any>;
  ready?: boolean;
  initialLoad?: boolean;
};

export type Context = {
  entities: {
    [key: string]: EntityObject;
  };
  dispatchEntity: (options: EntityOptions<any>) => void;
};

export const EntityContext = createContext<Context>({} as any);

const log = debug("entity:context");

export const withEntityContext =
  (value: Partial<Context> = {}) =>
  (Component: React.FunctionComponent) => {
    return ({ children, ...props }: any) => {
      const [entities, setEntities] = useState<{
        [key: string]: EntityObject;
      }>({});

      const handleError = (entityName: string, type: string, error: any) => {
        log(`error ${entityName}.api.${type}: ${error.message || error}`);
        const callback = entities[entityName]?.options?.onError;
        callback && callback(error, type);
      };

      const wrapApiLogger = (
        api: { [key: string]: (...args: any[]) => Promise<any> },
        name: string
      ) => {
        return Object.keys(api).reduce((result, key) => {
          return {
            ...result,
            [key]: async (...args) => {
              log(`calling ${name}.api.${key}`);
              return api[key](...args)
                .then((result) => {
                  log(`finished ${name}.api.${key}`);
                  return result;
                })
                .catch((err) => {
                  handleError(name, key, err);
                });
            },
          };
        }, {} as any);
      };

      const dispatchEntity = (options: EntityOptions<any>) => {
        log(`creating entity manager for ${options.name}`);

        if (!entities[options.name]) {
          const entity: EntityObject = {
            data: [],
            options: {
              ...options,
              api: wrapApiLogger(options.api || {}, options.name),
            },
            ready: false,
            initialLoad: true,
          };
          setEntities((_entities) => ({
            ..._entities,
            [options.name]: entity,
          }));
        }
      };

      log("rendering");

      useEffect(() => {
        Object.keys(entities)
          .filter(
            (entity) => !entities[entity].ready && entities[entity].initialLoad
          )
          .forEach((entity) => {
            const e = entities[entity];
            e.options.api?.list && e.options.api.list().finally(() => {});
          });
      }, [Object.keys(entities).length]);

      return (
        <EntityContext.Provider
          value={{
            ...value,
            entities,
            dispatchEntity,
          }}
        >
          <Component {...props} />
        </EntityContext.Provider>
      );
    };
  };
