import { createAnonEncrypter } from 'did-jwt'
import * as u8a from 'uint8arrays'
import {ProduceJWT} from './produce.jwt.js'
import {DID} from '../did/did.js'

export class EncryptJWT extends ProduceJWT {
    async encrypt (_secretKey: Uint8Array): Promise <string> {
        const did = new DID(_secretKey);
        const audience = did.extractDIDKey(this._payload.aud as string)
        const _ecdhEncKey = createAnonEncrypter(audience);
        const jwet = await did.createJWE(JSON.stringify(this._payload), [_ecdhEncKey]);
        return u8a.toString(u8a.fromString(JSON.stringify(jwet)), 'base64pad');
    }
}