import { Signer, createJWT as create }from 'did-jwt'
import {ProduceJWT} from './payload.produce.js'

export class createJWT extends ProduceJWT {
    private _alg?: string;

    setProtector(alg?: string) {
        this._alg = alg;
    }
    
    async create(signer: Signer ): Promise <string> {
        let jwt = await create(this._payload, 
            {issuer: this._payload.iss as string, signer, expiresIn: this._payload.exp }, 
            { alg: this._alg || 'Ed25519' })
        return jwt
    }
}