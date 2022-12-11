import React from "react";

import { useDebounce } from "@hooks/useDebounce";

export const InputSearch = (props: any) => {
  const onChange = useDebounce(500, (event: any) =>
    console.log(event.target.value)
  );
  return <input {...props} onChange={onChange} />;
};

export default InputSearch;
