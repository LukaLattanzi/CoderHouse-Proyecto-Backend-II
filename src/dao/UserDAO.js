import { UserModel } from '../models/user.model.js';

export class UserDAO {
    async create(userData) {
        try {
            const user = new UserModel(userData);
            return await user.save();
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await UserModel.findById(id).populate('cart');
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
    }

    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email }).populate('cart');
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    async findAll() {
        try {
            return await UserModel.find().populate('cart');
        } catch (error) {
            throw new Error(`Error finding all users: ${error.message}`);
        }
    }

    async update(id, userData) {
        try {
            return await UserModel.findByIdAndUpdate(id, userData, { new: true }).populate('cart');
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await UserModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    async updatePassword(id, hashedPassword) {
        try {
            return await UserModel.findByIdAndUpdate(
                id,
                { password: hashedPassword },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error updating password: ${error.message}`);
        }
    }

    async findByRole(role) {
        try {
            return await UserModel.find({ role }).populate('cart');
        } catch (error) {
            throw new Error(`Error finding users by role: ${error.message}`);
        }
    }
}