import { cookies } from "next/headers";
import bcrypt from 'bcryptjs';
import jwt, {Secret} from 'jsonwebtoken';

export async function getServerToken() {

    const cookieStore = await cookies();
  
    const hasCookie = cookieStore.has('token');
    let USER_TOKEN = '';
  
    if (hasCookie) {
      const tokenCookie = cookieStore.get('token');
      if (tokenCookie) {
        USER_TOKEN = tokenCookie.value;
      }
    }
  
    return USER_TOKEN;
  }
export function generateOTP(): string {
    const otp: number = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
}


// HashPassword  
const saltRounds = 10;
export async function createHashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch {
    throw new Error('Error hashing password');
  }
}

export async function verifyHashPassword(userpassword: string, hashpassword: string): Promise<boolean> {
  try {
    const match = await bcrypt.compare(userpassword, hashpassword);
    return match;
  } catch  {
    throw new Error('Error verifying password');
  }
}


export function createExpiryTime(hoursToAdd: number, minutesToAdd: number): Date {
  const now = new Date();
  const expiryDate = new Date(now.getTime() + (hoursToAdd * 60 * 60 * 1000) + (minutesToAdd * 60 * 1000)); 
  return expiryDate;
}

// const oneHourThirtyMinutesExpiry = createExpiryTime(1, 30);
// console.log('Expiry Date (1 hour 30 minutes):', oneHourThirtyMinutesExpiry.toISOString());

export function isExpiredTime(expiryDate: Date): boolean {
  const now = new Date();
  return now > expiryDate;
}

// JwtToken
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';

interface Payload {
  email: string;
}

export const generateJwtToken = (payload: Payload, expiresIn: number = 3600): string => {
  return jwt.sign(payload, SECRET_KEY as Secret, { expiresIn });
};