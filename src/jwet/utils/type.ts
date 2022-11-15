 export interface JWK {
    alg?: string
    crv?: string
    d?: string
    dp?: string
    dq?: string
    e?: string
    ext?: boolean
    k?: string
    key_ops?: string[]
    kid?: string
  
    kty?: string
    n?: string
    oth?: Array<{
      d?: string
      r?: string
      t?: string
    }>
    p?: string
    q?: string
    qi?: string

    use?: string
    x?: string
    y?: string
 
    x5c?: string[]

    x5t?: string

    'x5t#S256'?: string

    x5u?: string
  
    [propName: string]: unknown
  }
  

export interface JWTPayload {
    /**
     * JWT Issuer
     */
    iss?: string
  
    /**
     * JWT Subject
     */
    sub?: string
  
    /** JWT Audience*/
    aud?: string | string[]
  
    /**
     * JWT ID
     */
    jti?: string
  
    /**
     * JWT Not Before
     */
    nbf?: number
  
    /**
     * JWT Expiration Time
     */
    exp?: number
  
    /**
     * JWT Issued At
     */
    iat?: number
  
    /** Any other JWT Claim Set member. */
    [propName: string]: unknown
  }



  /** JWT Claims Set verification */
export interface JWTClaimVerificationOptions {
    /** Expected JWT "aud" (Audience) */
    audience?: string | string[]
  
    /**
     * Expected clock tolerance
     */
    clockTolerance?: string | number
  
    /** Expected JWT "iss" (Issuer) */
    issuer?: string | string[]
  
    /**
     * JWT "iat" (Issued At) Claim value.
     */
    maxTokenAge?: string | number
  
    /** Expected JWT "sub" (Subject)*/
    subject?: string
  
    /** Expected JWT "typ" (Type) */
    typ?: string
  
    /** Current date, defaults to `new Date()`. */
    currentDate?: Date
  }