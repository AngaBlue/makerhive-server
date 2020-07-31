import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm";
import { Loan } from "./Loan";
import { Reservation } from "./Reservation";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 128, collation: "utf8mb4_unicode_ci", charset: "utf8mb4" })
    name: string;

    @Column({ length: 1024, nullable: true, collation: "utf8mb4_unicode_ci", charset: "utf8mb4" })
    description?: string;

    @Column("int", { default: 1, width: 3 })
    quantity: number;

    @Column({ length: 16, nullable: true })
    image?: string;

    @Index()
    @Column("boolean")
    hidden: boolean;

    @Column({ length: 64, nullable: true })
    location?: string;

    @OneToMany((type) => Loan, (loan) => loan.item)
    loans: Loan[];

    @OneToMany((type) => Reservation, (reservation) => reservation.item)
    reservations: Reservation[];
}
