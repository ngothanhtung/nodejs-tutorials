import { EntitySchema } from 'typeorm';

export interface CategoryInterface {
  id: string;
  name: string;
  description?: string;
}

export const SeparatingCategory = new EntitySchema<CategoryInterface>({
  tableName: 'SeparatingCategories',
  name: 'separatingCategories',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
      name: 'Id',
    },
    name: {
      type: String,
      name: 'Name',
      unique: true,
      length: 100,
    },
    description: {
      type: String,
      name: 'Description',
      nullable: true,
      length: 500,
    },
  },
});
