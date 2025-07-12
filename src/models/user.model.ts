import { getModelForClass, modelOptions, pre, prop, Severity, DocumentType, index, getDiscriminatorModelForClass } from "@typegoose/typegoose";
import { v4 as uuidv4 } from 'uuid';
import argon2 from 'argon2'
import log from "../utils/logger";
import shortid from 'shortid';
import { generate4DigitCode } from "../utils/generateCode";

export enum UserRole {
    DOCTOR = "doctor",
    PARENT = "parent",
}

export const privateFields = [
    "password",
    "passwordConfirmation",
    "__v",
    "verificationCode",
    "passwordResetCode",
    "verified"
];
@pre<User>("save", async function() {
    if (!this.isModified('password')){
        return;
    }

    const hash = await argon2.hash(this.password);
    this.password = hash;
    return;
})

@index({email : 1}, { unique: true })

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
    
    @prop({required: true, default: () => generate4DigitCode()})
    verificationCode: string;

    @prop()
    passwordResetCode: string | null;

    @prop({ default: null })
    resetPasswordExpires: Date | null;

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
export class Doctor extends User {
    @prop({ required: true, enum: UserRole, default: UserRole.DOCTOR })
    role: UserRole = UserRole.DOCTOR;

    @prop()
    identityVerification: string; // e.g., URL or base64 string

    @prop()
    selfiePhoto: string; // e.g., URL or base64 string

    @prop({ required: true })
    specialization: string; // e.g., "Cardiology"

    @prop()
    description: string; // e.g., bio or services

    @prop()
    clinicLocation: string; // e.g., address

    @prop({ type: () => [Appointment], default: [] })
    appointments: Appointment[];

    @prop({ type: Number, min: 0, max: 5, default: 0 })
    rating: number;
}

export class Appointment {
    @prop({ required: true })
    _id: any; // Use `any` or a specific type (e.g., mongoose.Types.ObjectId)

    @prop({ required: true })
    day: string;

    @prop({ required: true })
    available: string;

    @prop()
    morning: string;
    
    @prop()
    evening: string; 

    @prop({ required: true, enum: ['scheduled', 'completed', 'cancelled'] })
    status: 'scheduled' | 'completed' | 'cancelled';
}

export class Parent extends User {
    @prop({ type: [String], default: [] })
    children: string[]; // Array of child IDs (e.g., references to other User documents)
}

const UserModel = getModelForClass(User);
const DoctorModel = getDiscriminatorModelForClass(UserModel, Doctor, UserRole.DOCTOR);
const ParentModel = getDiscriminatorModelForClass(UserModel, Parent, UserRole.PARENT);

export { UserModel, DoctorModel, ParentModel };