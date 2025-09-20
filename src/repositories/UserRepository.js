import { UserDAO } from '../dao/UserDAO.js';

export class UserRepository {
    constructor() {
        this.userDAO = new UserDAO();
    }

    async createUser(userData) {
        try {

            if (!userData.email || !userData.password) {
                throw new Error('Email and password are required');
            }

            const existingUser = await this.userDAO.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            return await this.userDAO.create(userData);
        } catch (error) {
            throw new Error(`Repository error creating user: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            const user = await this.userDAO.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(`Repository error finding user: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        try {
            return await this.userDAO.findByEmail(email);
        } catch (error) {
            throw new Error(`Repository error finding user by email: ${error.message}`);
        }
    }

    async getAllUsers() {
        try {
            return await this.userDAO.findAll();
        } catch (error) {
            throw new Error(`Repository error finding all users: ${error.message}`);
        }
    }

    async updateUser(id, userData) {
        try {

            if (userData.email) {
                const existingUser = await this.userDAO.findByEmail(userData.email);
                if (existingUser && existingUser._id.toString() !== id) {
                    throw new Error('Email already in use by another user');
                }
            }

            return await this.userDAO.update(id, userData);
        } catch (error) {
            throw new Error(`Repository error updating user: ${error.message}`);
        }
    }

    async deleteUser(id) {
        try {
            const user = await this.userDAO.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return await this.userDAO.delete(id);
        } catch (error) {
            throw new Error(`Repository error deleting user: ${error.message}`);
        }
    }

    async updatePassword(id, hashedPassword, oldHashedPassword) {
        try {
            const user = await this.userDAO.findById(id);
            if (!user) {
                throw new Error('User not found');
            }

            if (hashedPassword === oldHashedPassword) {
                throw new Error('New password cannot be the same as the current password');
            }

            return await this.userDAO.updatePassword(id, hashedPassword);
        } catch (error) {
            throw new Error(`Repository error updating password: ${error.message}`);
        }
    }

    async getUsersByRole(role) {
        try {
            return await this.userDAO.findByRole(role);
        } catch (error) {
            throw new Error(`Repository error finding users by role: ${error.message}`);
        }
    }

    async authenticateUser(email, password) {
        try {
            const user = await this.userDAO.findByEmail(email);
            if (!user) {
                return null;
            }
            return user;
        } catch (error) {
            throw new Error(`Repository error authenticating user: ${error.message}`);
        }
    }
}