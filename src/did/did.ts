import { decryptJWE, createJWE, JWE,
    x25519Encrypter,
    x25519Decrypter,
    Encrypter,
} from 'did-jwt'
import {prepareCleartext, decodeCleartext } from 'dag-jose-utils'
import * as u8a from 'uint8arrays'
import * as crypto from 'libp2p-crypto';
import * as PeerId from 'peer-id'
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
  
export type keyPair = {
  publicKey: string,
  secretKey: string
}
export class DID {
    publicKey: Uint8Array;
    private _privateKey: Uint8Array;
    
    constructor(_keyPair: keyPair) {
      this.publicKey = u8a.fromString(_keyPair.publicKey, 'base64pad');
      this._privateKey = u8a.fromString(_keyPair.secretKey, 'base64pad');
    }

    private _didToBytes(did: string, prefix: Uint8Array): Uint8Array {
      if(!did.startsWith(BASE58_DID_PREFIX)) {
        throw new Error('DID encoding format must be base58btc or should include did:key:xyz... ')
      }
      const cutDIDBase58Key = did.slice(BASE58_DID_PREFIX.length)
      const extractBaytes = u8a.fromString(cutDIDBase58Key, 'base58btc');
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
     * This function makes PeerId KeyPair from DID KeyPair
     * @function pid(privateKey)
     * @property privateKey?: Uint8Array
     * @returns  PeerId KeyPair: json object
    */

    async pid (privateKey?: Uint8Array): Promise<PeerId.JSONPeerId> {
      const key = await this._keyPair(privateKey || this._privateKey);
      return this._generatePeerId(key);
    }

     /**
     * This private helper function for generate key pair
     * @function _keyPair()
     * @property parentKey: Uin8Array
     * @returns  Public and PrivateKeys for peerId
     */
 
    private async _keyPair (privateKey: Uint8Array):Promise<crypto.keys.supportedKeys.ed25519.Ed25519PrivateKey> {
      return await crypto.keys.generateKeyPairFromSeed('Ed25519', privateKey.slice(0, 32), 512) 
    };

    /**
     * This private helper function for generate DID
     * @function _generateDID()
     * @property key: crypto.PrivateKey
     * @returns  { PeerId.JSONPeerId }
     */

    private async _generatePeerId (key: crypto.PrivateKey): Promise<PeerId.JSONPeerId> {
      const identifier = await this._createPeerId(key);
      return identifier.toJSON()
    };
     
    /**
     * This private helper function for generate peer-id
     * @function _createPeerId()
     * @property key: crypto.PrivateKey
     * @returns  PeerId
     */

    private async _createPeerId (key: crypto.PrivateKey): Promise<PeerId> {
      let _privateKey = crypto.keys.marshalPrivateKey(key, 'ed25519')
      const peerId = await PeerId.createFromPrivKey(_privateKey);
      return peerId;
    };

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
      cleartext: Record<string, any>,
      recipients: Encrypter[] | Array<Uint8Array>,
      options: CreateJWEOptions = {}
    ): Promise<JWE> {
      if(!recipients.map((key:any)=>  { return key.alg }).includes('ECDH-ES+XC20PKW')) {
      recipients = this._encrypter(recipients as Array<Uint8Array>);
      }
      const preparedCleartext = await prepareCleartext(cleartext);
      return await createJWE(preparedCleartext, recipients as Encrypter[], options.protectedHeader, options.aad)
    }

   /**
   * Try to decrypt the given JWE with the currently authenticated user.
   *
   * @property jwe                 The JWE to decrypt
   */

    async decryptJWE(jwe: JWE): Promise<Record<string, any>> {
      let decrypter = this._decrypter();
      const bytes = await decryptJWE(jwe, decrypter)
      return decodeCleartext(bytes)
    }
}