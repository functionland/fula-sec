import * as uint8arrays from "uint8arrays"
import { Keypair, KeyType, Encodings, ExportableKey } from "./types.js"

export default abstract class BaseKeypair implements Keypair, ExportableKey {

  publicKey: Uint8Array
  keyType: KeyType
  exportable: boolean

  constructor(publicKey: Uint8Array, keyType: KeyType, exportable: boolean) {
    this.publicKey = publicKey
    this.keyType = keyType
    this.exportable = exportable
  }

  publicKeyStr(encoding: Encodings = "base64pad"): string {
    return uint8arrays.toString(this.publicKey, encoding)
  }

  abstract sign(msg: Uint8Array): Promise<Uint8Array>
  abstract export(): Promise<string>
}
