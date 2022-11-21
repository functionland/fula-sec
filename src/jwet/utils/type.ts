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
  
    /** Time when token was created, defaults to `new Date()`. */
    currentDate?: Date
  }