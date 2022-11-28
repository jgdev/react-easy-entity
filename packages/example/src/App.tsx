import {
  useEntity,
  withEntityContext,
  FieldType,
  FilterType,
} from "react-easy-entity";

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

function App() {
  const {
    components: { Table, Modal, Filters, Pagination },
    actions: { createEntity },
  } = useEntity({
    api: {
      findAll: userDatabase.list,
      findOne: userDatabase.getOneById,
      create: userDatabase.create,
      del: userDatabase.remove,
      update: userDatabase.update,
    },
    fields: [
      { property: "fullName", type: FieldType.FullName, label: "Full Name" },
      { type: FieldType.String, property: "email", label: "Email" },
      { type: FieldType.String, property: "age", label: "Age" },
    ],
    filters: [
      {
        type: FilterType.Search,
        props: {
          id: "input-search",
          placeholder: "Search",
        },
      },
    ],
    name: "users",
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div id="entity-container">
          <div className="actions">
            <button onClick={createEntity}>Create user</button>
          </div>
          <div className="filters">
            <Filters />
          </div>
          <div className="clearfix" />
          <Table />
          <Pagination />
          <Modal />
        </div>
      </header>
    </div>
  );
}

export default withEntityContext()(App);
