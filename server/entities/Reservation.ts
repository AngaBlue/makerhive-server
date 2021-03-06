import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Item } from "./Item";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => User, (user) => user.reservations, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "user" })
    user: User;

    @ManyToOne((type) => Item, (item) => item.reservations, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "item" })
    item: Item;

    @Column("int", { default: 1, width: 3 })
    quantity: number;

    @Index()
    @CreateDateColumn({ precision: 0, default: () => "CURRENT_TIMESTAMP" })
    reserved: Date;

    @Column({ nullable: true, length: 1024, collation: "utf8mb4_unicode_ci", charset: "utf8mb4" })
    note: string;

    @Column({ select: false, readonly: true, nullable: true })
    position: number;
}
