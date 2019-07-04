import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


export interface Rfc2898DeriveResult {
    key: CryptoJS.WordArray;
    iv: any;
}


@Injectable()
export class CryptoService {

    private readonly password = '3Yu+7Kb29O3pNKBpMQi67yY0VC+ohv06EcDSYbrJlSo=';
    private readonly saltHex = '96C97C7F38884E62516F';
    private readonly AES_KEY_SIZE = 256;
    private readonly AES_BLOCK_SIZE = 128;

    constructor() { }

    AESEncrypt(plaintext: string, password: string): string {
        password = password || this.password;
        const pbkResult = this.Rfc2898DeriveBytes(password);
        const aesResult = CryptoJS.AES.encrypt(plaintext, pbkResult.key, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: pbkResult.iv
        });

        const result = aesResult.toString();
        return result;
    }

    AESDecrypt(ciphertext: string, password: string): string {
        password = password || this.password;
        const pbkResult = this.Rfc2898DeriveBytes(password);
        const aesResult = CryptoJS.AES.decrypt(ciphertext, pbkResult.key, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: pbkResult.iv
        });

        const result = aesResult.toString(CryptoJS.enc.Utf8);
        return result;
    }




    private Rfc2898DeriveBytes(password: string): Rfc2898DeriveResult {
        // password bytes
        let passwordWords = CryptoJS.enc.Utf8.parse(password);
        // Hash the password bytes with SHA256
        passwordWords = CryptoJS.SHA256(passwordWords);
        // salt bytes
        const saltWords = CryptoJS.enc.Hex.parse(this.saltHex);

        // 匹配C#的实现:
        // Step 1: (keySize + ivSize);
        // Step 2: 从最终生成的parsedKey中分开key和iv

        const keySize = this.AES_KEY_SIZE;
        const ivSize = this.AES_BLOCK_SIZE;

        const parsedKey = CryptoJS.PBKDF2(passwordWords, saltWords, {
            keySize: (keySize + ivSize) / 32,
            iterations: 1000
        });

        const parsedKeyHex = parsedKey.toString(CryptoJS.enc.Hex);

        const splitIndex = keySize / (32 / 8);
        const keyHex = parsedKeyHex.substring(0, splitIndex);
        const ivHex = parsedKeyHex.substring(splitIndex);

        const key = CryptoJS.enc.Hex.parse(keyHex);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const keyBase64Str = CryptoJS.enc.Base64.stringify(key);
        const ivBase64Str = CryptoJS.enc.Base64.stringify(iv);

        return {
            key: CryptoJS.enc.Base64.parse(keyBase64Str),
            iv: CryptoJS.enc.Base64.parse(ivBase64Str)
        };
    }

}
