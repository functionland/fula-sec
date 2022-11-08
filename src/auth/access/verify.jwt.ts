import { JWTVerifyOptions, JWTVerified, 
    verifyJWT, decodeJWT }from 'did-jwt'
import {ProduceJWT} from './payload.produce.js'
import { JWTDecoded } from 'did-jwt/lib/JWT';

export  
    async function verify(
        jwt: string,
        options?: JWTVerifyOptions
    ): Promise<JWTVerified> {
        let verifyed = await verifyJWT(jwt, options);
        return verifyed    
    }


export 
    async function decode(jwt: string): Promise<JWTDecoded> {
        return decodeJWT(jwt)
    }