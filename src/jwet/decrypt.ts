import { JWTVerifyOptions, JWTVerified, 
    verifyJWT, decodeJWT }from 'did-jwt'
import { JWTDecoded } from 'did-jwt/lib/JWT';
import * as u8a from 'uint8arrays'
import {ProduceJWT} from './produce.jwt.js'
import {DID, keyPair} from '../did/did.js'

// export  
//     async function verify(
//         jwt: string,
//         options?: JWTVerifyOptions
//     ): Promise<JWTVerified> {
//         let verifyed = await verifyJWT(jwt, options);
//         return verifyed    
//     }


// export 
//     async function decode(jwt: string): Promise<JWTDecoded> {
//         return decodeJWT(jwt)
//     }

export class DecryptJWT {
    _keyPair: keyPair
    constructor (keyPair: keyPair) {
        this._keyPair = keyPair;
    }
    
    async verify (jwet: string) {
       const did = new DID(this._keyPair);
       const _jwet = JSON.parse(u8a.toString(u8a.fromString(jwet, 'base64pad'))); 
       const ciphertext = await did.decryptJWE(_jwet) 
       return ciphertext;
    }
}