import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { Folder } from "./Folder";
import { ChunkEmbedding } from "./ChunkEmbedding";
import { QuestionAnswer } from "./QuestionAnwser";

@Entity()
export class File extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    status: string;

    @Column()
    s3Key: string;

    @Column()
    s3Url: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Folder, (folder) => folder.files)
    folder: Folder;

    @OneToMany(() => ChunkEmbedding, (chunkEmbedding) => chunkEmbedding.file)
    chunkEmbeddings: ChunkEmbedding[];

    @OneToMany(() => QuestionAnswer, (questionAnswer) => questionAnswer.file)
    questionAnswers: QuestionAnswer[];
}
