import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Item } from "./Item";

@Entity()
export class Loan {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => User, user => user.loans, { nullable: false })
    @JoinColumn({ name: "user" })
    user: User

    @ManyToOne(type => Item, item => item.loans, { nullable: false })
    @JoinColumn({ name: "item" })
    item: Item

    @Column("int", { default: 1, width: 3 })
    quantity: number;

    @Index()
    @CreateDateColumn(({ precision: 0, default: () => "CURRENT_TIMESTAMP" }))
    borrowed: Date;

    @Index()
    @Column({ nullable: true })
    returned?: Date;

    @Column({ nullable: true, length: 1024 })
    note?: string
}
