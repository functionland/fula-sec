import { SupportedEncodings } from "uint8arrays/util/bases.js"

export type Fact = Record<string, unknown>

// CRYPTOGRAPHY

export interface ExportableKey {
  export: (format?: Encodings) => Promise<string>
}

export interface Keypair {
  publicKey: Uint8Array
  keyType: KeyType
  sign: (msg: Uint8Array) => Promise<Uint8Array>
}

export type KeyType =
  | "rsa"
  | "p256"
  | "p384"
  | "p521"
  | "ed25519"
  | "bls12-381"

// https://developer.mozilla.org/en-US/docs/Web/API/EcKeyGenParams
export type NamedCurve = "P-256" | "P-384" | "P-521"
export type Encodings = SupportedEncodings

