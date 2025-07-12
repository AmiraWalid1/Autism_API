import { Model } from 'mongoose';
import { User, UserRole, UserModel, DoctorModel, ParentModel } from "../models/user.model";

export function createUser(input: Partial<User>, Model: Model<any> = UserModel) {
    return Model.create(input);
}

export function findUserById(id: string) {
    return UserModel.findById(id);
}

export function findUserByEmail(email: string) {
    return UserModel.findOne({ email });
}

export async function updateUser(userId: string, updateData: Partial<User>) {
    const user = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    return user;
}

export async function deleteUser(userId: string) {
    await UserModel.findByIdAndDelete(userId);
}

export async function getAllUsersById(userIds: string[]) {
    return UserModel.find({ _id: { $in: userIds } });
}

export async function getAllUsers() {
    return UserModel.find({}).select('-password -__v');
}

export async function getUsersByRole(role: UserRole) {
    return UserModel.find({ role }).select('-privateFields');
}
