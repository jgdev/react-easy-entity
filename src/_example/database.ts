import { v4 as uuid } from "uuid";

const delay = (n = 1500) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, n);
  });

export const getDatabase = (entity: string) => {
  const storageKey = "data-" + entity;
  const getData = (): any[] => {
    const savedData = localStorage.getItem(storageKey);
    return (savedData && JSON.parse(savedData!)) || [];
  };
  const saveData = (data: any[]) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  return {
    create: async (row: any) => {
      await delay();
      const toCreate = {
        id: uuid(),
        ...row,
        createdAt: new Date().toISOString(),
      };
      const newData = getData().concat(toCreate);
      saveData(newData);
      return toCreate;
    },
    list: async () => getData(),
    update: async (id: string, row: any) => {
      await delay();
      const data = getData();
      const index = data.findIndex((row) => row.id === id);
      if (index < 0) return;
      data[index] = { ...row, id, updatedAt: new Date().toISOString() };
      saveData(data);
      return data[index];
    },
    remove: async (id: string) => {
      await delay();
      const data = getData();
      saveData(data.filter((row) => row.id !== id));
    },
    getOneById: async (id: string) => {
      await delay();
      return getData().find((row) => row.id === id);
    },
  };
};
