import React from "react";
import { EntityFilter, FilterType } from "../../";
import InputSearch from "./InputSearch";
export { default as InputSearch } from "./InputSearch";

export type FilterProps = {
  name: string;
  filters?: EntityFilter[];
};

const filtersByType: {
  [key: string]: any;
} = {
  [FilterType.Search]: (props: any) => <InputSearch {...props} />,
};

export const renderFilter =
  (entityName: string, props: any = {}) =>
  (filter: EntityFilter) => {
    const FilterComponent = filtersByType[filter.type] || <></>;
    return (
      <div
        key={`${entityName}-${filter.type}`}
        className={`filter-${entityName}-${filter.type}`}
        {...props}
      >
        <FilterComponent {...(filter.props || {})} />
      </div>
    );
  };

export default ({ filters = [], name }: FilterProps) => {
  return <>{filters.map(renderFilter(name))}</>;
};
