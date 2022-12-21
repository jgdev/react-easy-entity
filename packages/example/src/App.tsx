import { useEffect } from "react";
import { randFullName, randEmail, randNumber, randAvatar } from "@ngneat/falso";
import { useEntity, FieldType, FilterType } from "react-easy-entity";

import debug from "debug";
import { getDatabase } from "./database";
import logo from "./logo.svg";
import "./App.scss";

const userDatabase = getDatabase("user");

userDatabase.list().then(({ rows }) => {
  if (!rows.length) {
    new Array(150).fill(null).map(() => {
      const [firstName, lastName] = randFullName({ withAccents: false }).split(
        " "
      );
      userDatabase.create({
        fullName: `${firstName} ${lastName}`,
        email: randEmail({ firstName, lastName }),
        age: randNumber({ min: 18, max: 85 }),
        profileImageUrl: randAvatar(),
      });
    });
  }
});

const log = debug("component:App");

export const App = () => {
  useEffect(() => {
    log("render");
  }, []);

  const {
    components: {
      Table,
      Modal,
      filters: { userSearch: FilterUserSearch = <></> },
    },
    actions: { createEntity, editEntity },
  } = useEntity({
    api: {
      findAll: userDatabase.list,
      findOne: userDatabase.getOneById,
      create: userDatabase.create,
      del: userDatabase.remove,
      update: userDatabase.update,
    },
    table: {
      onRowClick: (entity, event) => editEntity(entity, event),
      tableRowProps: {
        style: {
          cursor: "pointer",
        },
      },
    },
    fields: [
      {
        property: "fullName",
        type: FieldType.FullName,
        label: "Full Name",
        props: {
          required: true,
        },
      },
      {
        type: FieldType.String,
        property: "email",
        label: "Email",
        props: {
          required: true,
          type: "email",
        },
      },
      {
        type: FieldType.String,
        property: "age",
        label: "Age",
        props: {
          required: true,
        },
      },
    ],
    filters: [
      {
        name: "userSearch",
        type: FilterType.Search,
        props: {
          id: "input-search",
          placeholder: "Search",
          autoFocus: true,
        },
      },
    ],
    name: "users",
    onError: (err) => alert("Captured custom error handler: " + err.message),
  });

  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {FilterUserSearch}
          <div id="entity-container">
            <div className="actions">
              <button onClick={createEntity}>Create user</button>
            </div>
            <div className="clearfix" />
            {Table}
          </div>
        </header>
      </div>
      {Modal}
    </>
  );
};

export default App;
