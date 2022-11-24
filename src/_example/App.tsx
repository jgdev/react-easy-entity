import React, { useEffect } from "react";
import { withEntityContext } from "../context/entityManager";
import useEntity from "../hooks/useEntity";
import { FieldType } from "../index.mjs";
import debug from "debug";
import { getDatabase } from "./database";

const log = debug("component:App");
const userDatabase = getDatabase("users");
const todosDatabase = getDatabase("todos");

userDatabase.list().then((data) => {
  if (!data.length) {
    userDatabase.create({
      fullName: "Joan Peralta",
      email: "joanperalta13@gmail.com",
      age: 26,
      profileImageUrl: "https://avatars.githubusercontent.com/u/3039328",
    });
    userDatabase.create({
      fullName: "Garen de Demacia",
      email: "garen@demacia.lol",
      age: 28,
      profileImageUrl:
        "https://cdn.lolalytics.com/generated/champion280px/garen.jpg",
    });
  }
});

const AvatarImage = (props: any) => {
  return (
    <img
      src={props.profileImageUrl}
      alt={`${props.fullName} profile image`}
      className={props.className}
    />
  );
};

type User = {
  fullName: string;
  email: string;
  age: number;
  profileImageUrl: string;
};

export const App = () => {
  const {
    components: { Container, Modal, Table, Filters, Pagination },
    actions: { createEntity, editEntity },
  } = useEntity<User>({
    name: "users",
    fields: [
      {
        type: FieldType.Element,
        render: (row) => (
          <AvatarImage
            {...row}
            className="avatar-image"
            imageUrl={row.profileImageUrl}
          />
        ),
        modalEdit: true,
        property: "profileImageUrl",
        label: "Profile Image",
      },
      { type: FieldType.String, property: "fullName", label: "Full Name" },
      { type: FieldType.String, property: "email", label: "Email" },
      { type: FieldType.String, property: "age", label: "Age" },
    ],
    table: {
      className: "customTable",
      onRowClick: (entity: User) => {
        editEntity(entity);
      },
    },
    api: {
      create: userDatabase.create,
      del: userDatabase.remove,
      findAll: userDatabase.list,
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
      <div className="button-actions">
        <button onClick={createEntity}>Create User</button>
        <button>Select Users</button>
      </div>
      <Modal />
      <Filters />
      <Table />
      <Pagination />
    </Container>
  );
};

export default withEntityContext()(App);
