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

export default ({ filters = [], name }: FilterProps) => {
  return (
    <>
      {filters.map((filter) => {
        const FilterComponent = filtersByType[filter.type] || <></>;
        return (
          <div key={`${name}-${filter.type}`} className="filter">
            <FilterComponent {...(filter.props || {})} />
          </div>
        );
      })}
    </>
  );
};
