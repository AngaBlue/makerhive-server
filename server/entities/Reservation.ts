import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Item } from "./Item";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => User, user => user.reservations)
    user: User

    @ManyToOne(type => Item, item => item.reservations)
    item: Item

    @Column({ type: "int" })
    quantity: number;

    @Index()
    @CreateDateColumn()
    reserved: Date;

    @Column({ nullable: true, length: 1024 })
    note: string
}
