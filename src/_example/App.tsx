import React, { useEffect } from "react";
import { withEntityContext } from "../context/entityManager";
import useEntity from "../hooks/useEntity";
import { FieldType } from "../index.mjs";
import debug from "debug";
import { getDatabase } from "./database";

const log = debug("component:App");
const userDatabase = getDatabase("users");

// userDatabase.list().then(data => {
//   if (!data.length) {
//     userDatabase.create({
//       fullName: "Joan Peralta",
//       email: "joanperalta13@gmail.com",
//       age: 26,
//       profileImageUrl: "https://avatars.githubusercontent.com/u/3039328"
//     })
//     userDatabase.create({
//       fullName: "Garen de Demacia",
//       email: "garen@demacia.lol",
//       age: 28,
//       profileImageUrl: "https://cdn.lolalytics.com/generated/champion280px/garen.jpg"
//     })
//   }
// })

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
  const {
    Components: { Container, Modal, Table, Filters, Pagination },
  } = useEntity<User>({
    name: "users",
    fields: [
      {
        type: FieldType.Element,
        render: (row) => <AvatarImage {...row} />,
        modalEdit: true,
        property: "profileImageUrl",
        label: "Profile Image",
      },
      { type: FieldType.String, property: "fullName", label: "Full Name" },
      { type: FieldType.String, property: "email", label: "Email" },
      { type: FieldType.String, property: "age", label: "Age" },
    ],
    api: {
      list: userDatabase.list,
      create: userDatabase.create,
      del: userDatabase.remove,
      findOne: userDatabase.getOneById,
      update: userDatabase.update,
    },
  });

  useEntity({
    name: "todos",
    fields: [],
    api: {},
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
