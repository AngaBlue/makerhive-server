import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User"

@Entity()
export class Rank {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ type: "int" })
    permissions: number
    
    @OneToMany(type => User, user => user.rank)
    users: User[]
}
