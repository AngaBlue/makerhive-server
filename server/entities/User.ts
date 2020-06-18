import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index, BeforeInsert, OneToMany, getRepository } from "typeorm";
import { Rank } from "./Rank";
import { Loan } from "./Loan";
import { Notification } from "./Notification";
import { Reservation } from "./Reservation";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 64 })
    name: string;

    @Index({ unique: true })
    @Column({
        unique: true,
        length: 255
    })
    email: string;

    @ManyToOne(type => Rank, rank => rank.users)
    rank: Rank;
    @BeforeInsert()
    async defaultRank() {
        if (!this.rank)
            this.rank = await getRepository(Rank).findOne({ where: { name: "User" }, cache: 60000 })
    }

    @CreateDateColumn()
    joined: Date;

    @Column({ nullable: true, length: 1024 })
    image?: string;

    @OneToMany(type => Loan, loan => loan.user)
    loans: Loan[];

    @OneToMany(type => Reservation, reservation => reservation.user)
    reservations: Reservation[];

    @OneToMany(type => Notification, notification => notification.user)
    notifications: Notification[];
}
