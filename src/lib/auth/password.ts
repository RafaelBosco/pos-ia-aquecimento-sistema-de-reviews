import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(plainPassword: string): Promise<{ hash: string; salt: string }> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(plainPassword, salt);
  return { hash, salt };
}

export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash);
}
