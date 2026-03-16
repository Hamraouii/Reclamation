import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CrypteService {
    CRYPTAGE_KEY: any;

    constructor() {
        this.CRYPTAGE_KEY = environment.CRYPTAGE_KEY;
    }

    /* ------------------- Fonction pour crypter une variable ------------------- */

    encryptUsingAES256(data: any) {
        return CryptoJS.AES.encrypt(
            JSON.stringify(data),
            this.CRYPTAGE_KEY.toString()
        );
    }

    /* ------------------- Fonction pour décrypter une variable ------------------- */

    decryptUsingAES256(data: any): any {
        let bytes = CryptoJS.AES.decrypt(data.toString(), this.CRYPTAGE_KEY);
        if (bytes['sigBytes'] > 0) {
            let data = bytes.toString(CryptoJS.enc.Utf8);
            if (
                /^[\],:{}\s]*$/.test(
                    data
                        .replace(/\\["\\\/bfnrtu]/g, '@')
                        .replace(
                            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                            ']'
                        )
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
                )
            ) {
                return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    set_crypteData(data: any, token: any) {
        var ciphertext = CryptoJS.AES.encrypt(
            JSON.stringify(data),
            token.toString()
        );
        return ciphertext;
    }

    get_decrypteData(data: any, token: any) {
        var bytes = CryptoJS.AES.decrypt(data.toString(), token);
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    }
}
