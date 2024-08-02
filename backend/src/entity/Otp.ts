import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Otp {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    otp: string;

    @Column()
    expire: Date;

    @ManyToOne(() => User)
    user: User;
}
