import React from "react";
import { EntityFilter, FilterType, FilterProps } from "@root";
import FilterInputSearch from "./FilterInputSearch";

const filtersByType: {
  [key: string]: any;
} = {
  [FilterType.Search]: (props: any) => <FilterInputSearch {...props} />,
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
