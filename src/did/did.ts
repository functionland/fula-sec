import { decryptJWE, createJWE, JWE,
    x25519Encrypter,
    x25519Decrypter,
    Encrypter,
} from 'did-jwt'
import { generateKeyPairFromSeed } from '@stablelib/x25519'
import * as u8a from 'uint8arrays'
import { InvalidDid } from '../did/utils/errors.js';
import { BASE58_DID_PREFIX, EDWARDS_DID_PREFIX } from "./utils/encode.prefix.js"
/**
 * @class Decentralized Identity and JWE
 * @description Asymetric Encription
 * Requires public and private key. The user must import the DID`s private key and 
 * share the public key among network participants. 
 */

export type CreateJWEOptions = {
    protectedHeader?: Record<string, any>
    aad?: Uint8Array
}

export type DecryptJWEOptions = {
    did?: string
}

export class DID {
    publicKey: Uint8Array;
    private _privateKey: Uint8Array;
    
    constructor(secretKey: Uint8Array) {
      this._privateKey = secretKey.slice(0, 32),
      this.publicKey = generateKeyPairFromSeed(this._privateKey).publicKey
    }

    private _didToBytes(did: string, prefix: Uint8Array): Uint8Array {
      if(!did.startsWith(BASE58_DID_PREFIX)) {
        throw new Error('DID encoding format must be base58btc or should include did:key:xyz... ')
      }
      const cutDIDBase58Key = did.slice(BASE58_DID_PREFIX.length)
      const extractBaytes = u8a.fromString(cutDIDBase58Key, 'base58btc')
      if( u8a.equals(extractBaytes, prefix.subarray(0, prefix.byteLength))) {
        throw new Error(`We are expected prefix format is ${prefix}`)
      }
      return extractBaytes.slice(prefix.length)
    }

    /**
     * This function extracts Public key from DID - base58btc
     * @function extractDIDKey(did)
     * @property did: string
     * @returns  PublicKey: Uint8Array
    */

    extractDIDKey(did: string): Uint8Array {
      return this._didToBytes(did, EDWARDS_DID_PREFIX);
    }

    private _didFromKeyBytes(publicKeyBytes: Uint8Array, prefix: Uint8Array): string {
      const bytes = u8a.concat([prefix, publicKeyBytes])
      const base58Key = u8a.toString(bytes, "base58btc")
      return BASE58_DID_PREFIX + base58Key
    }

    /**
     * This function makes DID (base58btc) from PublicKey
     * @function extractDIDKey(did)
     * @returns  did: string
    */
    did(): string {
      return this._didFromKeyBytes(this.publicKey, EDWARDS_DID_PREFIX)
    }
     
     /**
     * This function for parseDID
     * @function parseDID()
     * @property did: string
     * @returns  did
     */

    static parseDID(did: string) {
      const match = did.match(/did:(\w+):(\w+).*/);
      if (!match) {
          throw new InvalidDid(did);
      }
      return { method: match[1], identifier: match[2] };
    }


     /**
     * This function for checking if did valid format
     * @function isValidDID()
     * @property did: string
     * @returns  boolen
     */

    static isValidDID(did: string) {
      try {
        this.parseDID(did);
        return true;
      } catch (err) {
        return false;
      }
    }

    /**
     * This private function for encryption
     * @function encrypter() {x25519Encrypter}
     * @property publicKey array
     * @returns  encrypter = publicKey
     */

    private _encrypter(publicKey: Array<Uint8Array>): Encrypter[] {
      let encrypter: Encrypter[] = [];
      publicKey.forEach((_publicKey:any)=> encrypter.push(x25519Encrypter(u8a.fromString(_publicKey))))
      return encrypter
    }

     /**
     * This private function for decryption
     * @function asymDecrypter() {x25519Decrypter}
     * @property _privateKey
     * @returns  asymDecrypter = privateKey
     */

    private _decrypter() {
      return x25519Decrypter(this._privateKey);
    }

  /**
   * Create a JWE encrypted to the given recipients.
   *
   * @property cleartext           The cleartext to be encrypted
   * @property recipients          An array of DIDs
   * @property options             Optional parameters
   */

    async createJWE(
      cleartext: string,
      recipients: Encrypter[] | Array<Uint8Array>,
      options: CreateJWEOptions = {}
    ): Promise<JWE> {
      if(!recipients.map((key:any)=>  { return key.alg }).includes('ECDH-ES+XC20PKW')) {
      recipients = this._encrypter(recipients as Array<Uint8Array>);
      }
      const preparedCleartext = u8a.fromString(cleartext);
      return await createJWE(preparedCleartext, recipients as Encrypter[], options.protectedHeader, options.aad)
    }

   /**
   * Try to decrypt the given JWE with the currently authenticated user.
   *
   * @property jwe                 The JWE to decrypt
   */

    async decryptJWE(jwe: JWE): Promise<string> {
      let decrypter = this._decrypter();
      const bytes = await decryptJWE(jwe, decrypter)
      return u8a.toString(bytes)
    }
}