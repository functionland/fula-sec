import type {
  JWTPayload,
  JWTClaimVerificationOptions,
} from './utils/type.js'
import { JWTClaimValidationFailed, JWTExpired, JWTInvalid } from './utils/errors.js'
import isObject from '../utils/isObject.js'
import cycle from '../utils/cycle.js';
import secs from '../utils/time.js';
import * as u8a from 'uint8arrays';

const checkAudiencePresence = (audPayload: unknown, audOption: unknown[]) => {
  if (typeof audPayload === 'string') {
    return audOption.includes(audPayload)
  }

  if (Array.isArray(audPayload)) {
    return audOption.some(Set.prototype.has.bind(new Set(audPayload)))
  }

  return false
}

export default (
  encodedPayload: Uint8Array,
  options: JWTClaimVerificationOptions = {},
) => {
  let payload!: { [propName: string]: unknown }
  try {
    payload = JSON.parse(u8a.toString(encodedPayload));
  } catch {
    throw new Error('Wrong payload encoding format'); 
  }

  if (!isObject(payload)) {
    throw new JWTInvalid('JWT Claims Set must be a top-level JSON object')
  }

  const { issuer } = options
  if (issuer && !(<unknown[]>(Array.isArray(issuer) ? issuer : [issuer])).includes(payload.iss!)) {
    throw new JWTClaimValidationFailed('unexpected "iss" claim value', 'iss', 'check_failed')
  }

  const { subject } = options
  if (subject && payload.sub !== subject) {
    throw new JWTClaimValidationFailed('unexpected "sub" claim value', 'sub', 'check_failed')
  }

  const { audience } = options
  if (
    audience &&
    !checkAudiencePresence(payload.aud, typeof audience === 'string' ? [audience] : audience)
  ) {
    throw new JWTClaimValidationFailed('unexpected "aud" claim value', 'aud', 'check_failed')
  }

  let tolerance: number
  switch (typeof options.clockTolerance) {
    case 'string':
      tolerance = secs(options.clockTolerance)
      break
    case 'number':
      tolerance = options.clockTolerance
      break
    case 'undefined':
      tolerance = 0
      break
    default:
      throw new TypeError('Invalid clockTolerance option type')
  }

  const { currentDate } = options
  const now = cycle(currentDate || new Date())

  if ((payload.iat !== undefined || options.maxTokenAge) && typeof payload.iat !== 'number') {
    throw new JWTClaimValidationFailed('"iat" claim must be a number', 'iat', 'invalid')
  }

  if (payload.nbf !== undefined) {
    if (typeof payload.nbf !== 'number') {
      throw new JWTClaimValidationFailed('"nbf" claim must be a number', 'nbf', 'invalid')
    }
    if (payload.nbf > now + tolerance) {
      throw new JWTClaimValidationFailed(
        '"nbf" claim timestamp check failed',
        'nbf',
        'check_failed',
      )
    }
  }

  if (payload.exp !== undefined) {
    if (typeof payload.exp !== 'number') {
      throw new JWTClaimValidationFailed('"exp" claim must be a number', 'exp', 'invalid')
    }
    if (payload.exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', 'exp', 'check_failed')
    }
  }

  if (options.maxTokenAge) {
    const age = now - payload.iat!
    const max =
      typeof options.maxTokenAge === 'number' ? options.maxTokenAge : secs(options.maxTokenAge)

    if (age - tolerance > max) {
      throw new JWTExpired(
        '"iat" claim timestamp check failed (too far in the past)',
        'iat',
        'check_failed',
      )
    }

    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed(
        '"iat" claim timestamp check failed (it should be in the past)',
        'iat',
        'check_failed',
      )
    }
  }

  return <JWTPayload>payload
}