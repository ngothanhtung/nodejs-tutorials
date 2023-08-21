import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'Categories' })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  // ----------------------------------------------------------------------------------------------
  // NAME
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'Name', unique: true, length: 100 })
  name: string;

  // ----------------------------------------------------------------------------------------------
  // DESCRIPTION
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'Description', length: 500, nullable: true })
  description: string;

  // ----------------------------------------------------------------------------------------------
  // RELATIONS
  // ----------------------------------------------------------------------------------------------
  @OneToMany(() => Product, (p) => p.category)
  products: Product[];
}
