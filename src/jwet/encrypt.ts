import * as u8a from 'uint8arrays'
import {ProduceJWT} from './produce.jwt.js'
import {DID, keyPair} from '../did/did.js'

export class EncryptJWT extends ProduceJWT {
    async encrypt (keyPair: keyPair): Promise <string> {
        const did = new DID(keyPair);
        const audience = did.extractDIDKey(this._payload.aud as string)
        const jwet = await did.createJWE(this._payload, [audience]);
        return u8a.toString(u8a.fromString(JSON.stringify(jwet)), 'base64pad');
    }
}