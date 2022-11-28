import * as u8a from 'uint8arrays'
import {DID} from '../did/did.js'
import jwtPayload from './jwt.set.js'
export class DecryptJWT {
    _secretKey: Uint8Array
    constructor (secretKey: Uint8Array) {
        this._secretKey = secretKey;
    }
    
    async verify (jwet: string) {
       const did = new DID(this._secretKey);
       const _jwet = JSON.parse(u8a.toString(u8a.fromString(jwet, 'base64pad'))); 
       const decrypted = await did.decryptJWE(_jwet)
       const payload = jwtPayload(u8a.fromString(decrypted))
       return payload;
    }
}