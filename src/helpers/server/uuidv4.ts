import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';


const secretKey = process.env.SECRET_KEY || 'mySuperSecretKey123';

export function generateSignature(uuid:string) {
  const hash = CryptoJS.HmacSHA256(uuid, secretKey);
  return hash.toString(CryptoJS.enc.Base64).substring(0, 8);
}

export function generateCustomUuid() {
  const id = uuidv4();
  const signature = generateSignature(id); 
  return id + '-' + signature; 
}


