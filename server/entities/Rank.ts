import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User"

@Entity()
export class Rank {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", { length: 32 })
    name: string

    @Column("int", { width: 3 })
    permissions: number

    @OneToMany(type => User, user => user.rank)
    users: User[]
}
