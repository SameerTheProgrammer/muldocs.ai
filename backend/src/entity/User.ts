import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeUpdate,
    BeforeInsert,
    OneToMany,
} from "typeorm";
import { IsEmail, Length, validate } from "class-validator";
import createHttpError from "http-errors";
import { Folder } from "./Folder";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Length(2, 50, {
        message:
            "The length of $targetName should be between $constraint1 and $constraint2 characters, but actual is $value",
    })
    @Column()
    name: string;

    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Column({ select: false, nullable: true })
    password: string;

    @Column({ type: "boolean", default: false })
    verify: boolean;

    @Column({ nullable: true })
    googleId: string;

    @OneToMany(() => Folder, (folder) => folder.user)
    folders: Folder[];

    @BeforeInsert()
    @BeforeUpdate()
    updateEmail() {
        if (this.email) {
            this.email = this.email.toLowerCase();
        }
    }

    // todo:- show class validator error properly
    @BeforeInsert()
    @BeforeUpdate()
    private async validate() {
        const errors = await validate("userSchma", this);
        if (errors && errors.length >= 1) {
            const transformedErrors = errors.map((error) => ({
                property: error.property,
                value: error.value as unknown,
                constraints: error.constraints,
            }));
            const validationError = createHttpError(400, "Validation Error", {
                details: transformedErrors,
            });

            throw validationError;
        }
    }
}
