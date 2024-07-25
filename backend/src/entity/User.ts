import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeUpdate,
    BeforeInsert,
} from "typeorm";
import { IsEmail, Length, MinLength, validate } from "class-validator";
import createHttpError from "http-errors";

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

    @IsEmail(
        { allow_ip_domain: true },
        { message: "$targetName should be valid email" },
    )
    @Column({ unique: true })
    email: string;

    @MinLength(10, {
        message:
            "$targetName is too short. Minimal length is $constraint1 characters, but actual is $value",
    })
    @Column({ select: false })
    password: string;

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
