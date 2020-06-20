import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => User, user => user.notifications, { nullable: false })
    @JoinColumn({ name: "user" })
    user: User

    @Column({ length: 1024 })
    message: string

    @CreateDateColumn(({ precision: 0, default: () => "CURRENT_TIMESTAMP" }))
    timestamp: Date;

    @Index()
    @Column("tinyint", { width: 1 })
    read: boolean;
}
