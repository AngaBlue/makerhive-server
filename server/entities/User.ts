import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Rank } from "./Rank";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string;
    @Column()
    email: string;
    @ManyToOne(type => Rank, rank => rank.id)
    rank: Rank;
    @CreateDateColumn()
    joined: number; 
    @Column({ nullable: true })
    image?: string;
}
