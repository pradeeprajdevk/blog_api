import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from 'typeorm';

@Entity('comments')
export class Comment {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column()
    postId!: string;

    @Column()
    userId!: string;

    @Column()
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;
}