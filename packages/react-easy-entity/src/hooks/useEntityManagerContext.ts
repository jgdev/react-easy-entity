import { useContext } from "react";
import { EntityContext } from "@context/entityManager";

export const useEntityManagerContext = () => useContext(EntityContext);

export default useEntityManagerContext;
