import { getModelForClass, modelOptions, pre, prop, Severity, DocumentType } from "@typegoose/typegoose";
import { v4 as uuidv4 } from 'uuid';
import argon2 from 'argon2'
import log from "../utils/logger";

export enum UserRole {
    DOCTOR = "doctor",
    PARENT = "parent",
}

@pre<User>("save", async function() {
    if (!this.isModified('password')){
        return;
    }

    const hash = await argon2.hash(this.password);
    this.password = hash;
    return;
})

@modelOptions({ 
    schemaOptions: {
        timestamps: true
    },
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class User{
    @prop({required: true})
    name: string;

    @prop({lowercase: true, required: true, unique: true })
    email: string;

    @prop({required: true})
    password: string;

    @prop({required: true})
    phoneNumber: number;

    @prop({required: true, enum: UserRole})
    role: UserRole;

    @prop({required: true, default: () => uuidv4() })
    verificationCode: string;

    @prop()
    passwordResetCode: string | null;

    @prop({default: false})
    verified: boolean;

    async validatePassword(this: DocumentType<User>, candidatePassword: string) {
        try {
            return await argon2.verify(this.password, candidatePassword);
        } catch(err) {
            log.error(err, "Could not validate password");
            return false;
        }

    }
}

const UserModel = getModelForClass(User);

export default UserModel;