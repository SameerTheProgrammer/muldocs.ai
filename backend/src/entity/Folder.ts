import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { File } from "./File";
import { ChunkEmbedding } from "./ChunkEmbedding";

@Entity()
export class Folder {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    status: string;

    @ManyToOne(() => User, (user) => user.folders)
    user: User;

    @OneToMany(() => File, (file) => file.user)
    files: File[];

    @OneToMany(() => ChunkEmbedding, (chunkEmbedding) => chunkEmbedding.file)
    chunkEmbeddings: ChunkEmbedding[];
}
