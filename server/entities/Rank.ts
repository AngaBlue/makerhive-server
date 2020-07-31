import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Rank {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 32, collation: "utf8mb4_unicode_ci", charset: "utf8mb4" })
    name: string;

    @Column("int", { width: 3 })
    permissions: number;

    @OneToMany((type) => User, (user) => user.rank)
    users: User[];
}
