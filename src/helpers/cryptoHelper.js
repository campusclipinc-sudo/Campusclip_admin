//   import CryptoJS from 'crypto-js';

// // Fetch your environment variables for encryption key and IV
// const encryptionKey = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_ENCRYPTION_KEY_GDPR);
// const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_IV_KEY_GDPR);

// // Encrypt the text (email in this case)
// export const encryptData = (text) => {
//   const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), encryptionKey, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   // Return Base64 encoded ciphertext
//   return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
// };

// // Decrypt data function
// export const decryptData = (ciphertext) => {
//   const encryptedHexStr = CryptoJS.enc.Base64.parse(ciphertext);
//   const encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
//   const decrypted = CryptoJS.AES.decrypt(encryptedBase64Str, encryptionKey, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   return CryptoJS.enc.Utf8.stringify(decrypted);
// };
