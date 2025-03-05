import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class User {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column()
    name!: string;

    @Column({unique: true})
    email!: string;

    @Column()
    password!: string

    @Column({ default: 'user' })
    role!: 'user' | 'admin';
}