import { Buffer } from 'buffer';
import crypto from 'crypto';

type Base64IvEncryptedValue = string;
type EncryptedValue = Buffer;
type Iv = Buffer;

const ENC_ALGO = 'aes-256-cbc';

export function encrypt(
  plainText: string,
  encryptionKey: string | undefined = process.env.BFF_GENERAL_ENCRYPTION_KEY
): [Base64IvEncryptedValue, EncryptedValue, Iv] {
  if (!encryptionKey) {
    throw new Error('Cannot encrypt, Encryption key not found.');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ENC_ALGO, encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(plainText), cipher.final()]);

  return [Buffer.concat([iv, encrypted]).toString('base64url'), encrypted, iv];
}

export function decrypt(
  encryptedValue: string,
  encryptionKey: string | undefined = process.env.BFF_GENERAL_ENCRYPTION_KEY
) {
  if (!encryptionKey) {
    throw new Error('Cannot decrypt, Encryption key not found.');
  }

  const keyBuffer = Buffer.from(encryptionKey);
  const decodedBuffer = Buffer.from(encryptedValue, 'base64');
  const ivBuffer = Uint8Array.prototype.slice.call(decodedBuffer, 0, 16);
  const dataBuffer = Uint8Array.prototype.slice.call(decodedBuffer, 16);

  const decipheriv = crypto.createDecipheriv(ENC_ALGO, keyBuffer, ivBuffer);
  return decipheriv.update(dataBuffer).toString() + decipheriv.final('utf-8');
}
