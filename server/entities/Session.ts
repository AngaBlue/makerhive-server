import { SessionEntity } from "typeorm-store";
import { Column, Entity, PrimaryColumn, BaseEntity } from "typeorm";

@Entity()
export class Session extends BaseEntity implements SessionEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    expiresAt: number;

    @Column({ length: 1024 })
    data: string;
}
