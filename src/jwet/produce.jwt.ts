import { JWTPayload} from 'did-jwt'
import isObject from '../utils/isObject.js'
import cycle from '../utils/cycle.js';
import secs from '../utils/time.js';

export class ProduceJWT {
    protected _payload!: Partial<JWTPayload>;

    constructor(payload: Partial<JWTPayload>) {
        if(!isObject(payload)) {
            throw new TypeError(`JWT Set is not object but got ${typeof payload}`)
        }
        this._payload = payload;
    }

    setIssuer(issuer: string) {
        this._payload = { ...this._payload, iss: issuer }
        return this
    }

    setSubject(subject: string) {
        this._payload = { ...this._payload, sub: subject }
        return this
    }

    setAudience(audience: string | string[]) {
        this._payload = { ...this._payload, aud: audience }
        return this
    }
    
    setNotBefore(input: number | string) {
        if (typeof input === 'number') {
          this._payload = { ...this._payload, nbf: input }
        } else {
          this._payload = { ...this._payload, nbf: cycle(new Date()) + secs(input) }
        }
        return this
    }


    setExpirationTime(input: number | string) {
        if (typeof input === 'number') {
          this._payload = { ...this._payload, exp: input }
        } else {
          this._payload = { ...this._payload, exp: cycle(new Date()) + secs(input) }
        }
        return this
    }


    setIssuedAt(input?: number) {
        if (typeof input === 'undefined') {
          this._payload = { ...this._payload, iat: cycle(new Date()) }
        } else {
          this._payload = { ...this._payload, iat: input }
        }
        return this
    }
}
