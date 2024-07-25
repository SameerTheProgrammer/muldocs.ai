import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { File } from "./File";

@Entity()
export class QuestionAnswer {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    question: string;

    @Column()
    answer: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => File, (file) => file.chunkEmbeddings)
    file: File;

    @CreateDateColumn()
    createdAt: number;

    @UpdateDateColumn()
    updatedAt: number;
}
