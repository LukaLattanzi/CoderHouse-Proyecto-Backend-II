import mongoose from 'mongoose';

const passwordResetTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
});

export const PasswordResetTokenModel = mongoose.model('PasswordResetToken', passwordResetTokenSchema);