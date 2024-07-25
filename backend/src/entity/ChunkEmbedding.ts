import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";
import { File } from "./File";
import { Folder } from "./Folder";
import { User } from "./User";

@Entity()
export class ChunkEmbedding {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    chunk: string;

    /* 
    embedding should be vector type for vector search but here,
    vector datatype is not supported by typeorm so we change this 
    datatype manully or by using query.
    */
    @Column()
    embedding: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Folder, (folder) => folder.chunkEmbeddings)
    folder: Folder;

    @ManyToOne(() => File, (file) => file.chunkEmbeddings)
    file: File;
}
