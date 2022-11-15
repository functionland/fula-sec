export class JOSEError extends Error {
    static get code(): string {
      return 'ERR_JOSE_GENERIC'
    }
    code: string = 'ERR_JOSE_GENERIC'
  
    constructor(message?: string) {
      super(message)
      this.name = this.constructor.name
      // @ts-ignore
      Error.captureStackTrace?.(this, this.constructor)
    }
  }
  
export class JWTClaimValidationFailed extends JOSEError {
    static get code(): 'ERR_JWT_CLAIM_VALIDATION_FAILED' {
      return 'ERR_JWT_CLAIM_VALIDATION_FAILED'
    }
  
    code = 'ERR_JWT_CLAIM_VALIDATION_FAILED'
    claim: string
    reason: string
  
    constructor(message: string, claim = 'unspecified', reason = 'unspecified') {
      super(message)
      this.claim = claim
      this.reason = reason
    }
  }

export class JWTExpired extends JOSEError implements JWTClaimValidationFailed {
    static get code(): 'ERR_JWT_EXPIRED' {
      return 'ERR_JWT_EXPIRED'
    }
  
    code = 'ERR_JWT_EXPIRED'
    claim: string
    reason: string
  
    constructor(message: string, claim = 'unspecified', reason = 'unspecified') {
      super(message)
      this.claim = claim
      this.reason = reason
    }
  }
export class JWTInvalid extends JOSEError {
    static get code(): 'ERR_JWT_INVALID' {
      return 'ERR_JWT_INVALID'
    }
  
    code = 'ERR_JWT_INVALID'
  }