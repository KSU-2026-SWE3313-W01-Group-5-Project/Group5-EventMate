import bcrypt from 'bcryptjs';

export async function hashPassword(unhashedPassword) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(unhashedPassword, salt);
}

export async function comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}