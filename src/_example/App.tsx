import React, { useEffect } from "react";
import { withEntityContext } from "../context/entityManager";
import useEntity from "../hooks/useEntity";
import { FieldType } from "../index.mjs";
import debug from "debug";

const log = debug("component:App");

const AvatarImage = (props: any) => {
  return <img src={props.imageUrl} alt={`${props.fullName} profile image`} />;
};

type User = {
  fullName: string;
  email: string;
  age: number;
  profileImageUrl: string;
};

export const App = () => {
  const { Container, Modal, Table, Filters, Pagination } = useEntity<User>({
    name: "users",
    fields: [
      {
        type: FieldType.Element,
        render: (row) => <AvatarImage {...row} />,
        modalEdit: true,
        property: "profileImageUrl",
      },
      { type: FieldType.String, property: "fullName" },
      { type: FieldType.String, property: "email" },
      { type: FieldType.String, property: "age" },
    ],
    api: {
      list: async () => {
        throw new Error("test error");
      },
    },
    onError: (error, type) => {
      console.log(error, type);
    },
  });

  useEntity({
    name: "todos",
    fields: [],
  });

  log("rendering");

  return (
    <Container>
      <Modal />
      <Filters />
      <Table />
      <Pagination />
    </Container>
  );
};

export default withEntityContext()(App);
