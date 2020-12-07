interface MyConditions {
  [key: string]: string | boolean | number | Date;
}
interface IExtensions {
  find: (
    table: string,
    query?: MyConditions,
    columns?: string[]
  ) => Promise<any>;
  findCar: (query?: MyConditions) => Promise<any>;
  findCarById: (id: string) => Promise<any>;
  findById: (table: string, id: string, columns?: string[]) => Promise<any>;
  create: (table: string, data: any, columns?: string[]) => Promise<any>;
  update: (table: string, data: any, id: string) => Promise<any>;
  isValid: (item: { key: string; value: string }) => Promise<any>;
}

export { IExtensions, MyConditions };
