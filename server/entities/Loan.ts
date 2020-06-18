import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Item } from "./Item";

@Entity()
export class Loan {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => User, user => user.loans)
    user: User

    @ManyToOne(type => Item, item => item.loans)
    item: Item

    @Column({ type: "int" })
    quantity: number;

    @Index()
    @CreateDateColumn()
    borrowed: Date;

    @Index()
    @Column({ nullable: true })
    returned: Date;

    @Column({ nullable: true, length: 1024 })
    note: string
}
