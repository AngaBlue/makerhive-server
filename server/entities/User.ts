import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    Index,
    BeforeInsert,
    OneToMany,
    getRepository,
    JoinColumn
} from "typeorm";
import { Rank } from "./Rank";
import { Loan } from "./Loan";
import { Notification } from "./Notification";
import { Reservation } from "./Reservation";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 64 })
    name: string;

    @Index({ unique: true })
    @Column({ length: 255 })
    email: string;

    @ManyToOne((type) => Rank, (rank) => rank.users, { nullable: false })
    @JoinColumn({ name: "rank" })
    rank: Rank;
    //Set Relation Default
    @BeforeInsert()
    async defaultRank() {
        if (!this.rank)
            this.rank = await getRepository(Rank).findOne({
                where: { name: "User" },
                cache: 60000
            });
    }

    @CreateDateColumn({ precision: 0, default: () => "CURRENT_TIMESTAMP" })
    joined: Date;

    @Column({ nullable: true, length: 1024 })
    image?: string;

    @OneToMany((type) => Loan, (loan) => loan.user)
    loans: Loan[];

    @OneToMany((type) => Reservation, (reservation) => reservation.user)
    reservations: Reservation[];

    @OneToMany((type) => Notification, (notification) => notification.user)
    notifications: Notification[];
}
