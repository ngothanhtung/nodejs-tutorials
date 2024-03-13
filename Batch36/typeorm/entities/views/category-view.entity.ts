import { BaseEntity, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `SELECT C.*, (SELECT COUNT(*) FROM Products AS P WHERE P.categoryId = C.Id) AS Count FROM Categories AS C`,
})
export class CategoryView extends BaseEntity {
  @ViewColumn({ name: 'Id' })
  id: number;

  // ----------------------------------------------------------------------------------------------
  // NAME
  // ----------------------------------------------------------------------------------------------
  @ViewColumn({ name: 'Name' })
  name: string;

  // ----------------------------------------------------------------------------------------------
  // DESCRIPTION
  // ----------------------------------------------------------------------------------------------
  @ViewColumn({ name: 'Description' })
  description?: string;

  // ----------------------------------------------------------------------------------------------
  // COUNT
  // ----------------------------------------------------------------------------------------------
  @ViewColumn({ name: 'Count' })
  count: number;
}
