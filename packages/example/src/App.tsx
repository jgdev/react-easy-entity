import { useEffect } from "react";
import { useEntity, FieldType, FilterType } from "react-easy-entity";

import { getDatabase } from "./database";
import logo from "./logo.svg";
import "./App.scss";

const userDatabase = getDatabase("user");

userDatabase.list().then((data) => {
  if (!data.length) {
    userDatabase.create({
      fullName: "Joan Peralta",
      email: "joan@test.com",
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

export const App = () => {
  const {
    components: { Table, Modal, Pagination, getFilters },
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
      onRowClick: (e) => editEntity(e),
      tableRowProps: {
        style: {
          cursor: "pointer",
        },
      },
    },
    fields: [
      { property: "fullName", type: FieldType.FullName, label: "Full Name" },
      { type: FieldType.String, property: "email", label: "Email" },
      { type: FieldType.String, property: "age", label: "Age" },
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
  });

  const { userSearch: FilterUserSearch } = getFilters();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <FilterUserSearch />
        <div id="entity-container">
          <div className="actions">
            <button onClick={createEntity}>Create user</button>
          </div>
          <div className="clearfix" />
          <Table />
          <Pagination />
          <Modal />
        </div>
      </header>
    </div>
  );
};

export default App;
