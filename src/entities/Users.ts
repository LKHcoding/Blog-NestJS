import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'nesttest', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;
}
