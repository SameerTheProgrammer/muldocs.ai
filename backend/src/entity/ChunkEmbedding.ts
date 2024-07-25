import { PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { File } from "./File";
import { Folder } from "./Folder";
import { User } from "./User";

export class ChunkEmbedding {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    chunk: string;

    @Column()
    embedding: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Folder, (folder) => folder.chunkEmbeddings)
    folder: Folder;

    @ManyToOne(() => File, (file) => file.chunkEmbeddings)
    file: File;
}
