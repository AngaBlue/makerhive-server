import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => User, user => user.notifications)
    user: User

    @Column()
    message: string

    @CreateDateColumn()
    timestamp: Date;

    @Index()
    @Column()
    read: boolean;
}
