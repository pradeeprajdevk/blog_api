import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class Post {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column()
    userId!: string;

    @Column()
    title!: string;

    @Column()
    content!: string;

    @Column({ type: 'date', default: () => new Date() })
    createdAt!: Date
}