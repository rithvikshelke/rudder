import { base64url } from 'rfc4648'

/**
 * Decode a json web token into an object including header, payload, signature in their
 * decoded and raw values
 *
 * @param token the jwt to decode
 * @returns a {@link DecodedJWT} as a representation of the decoded json web token
 */
export const decodeJwt = (token: string): DecodedJWT => {
  const [header, payload, signature] = token.split('.')
  const decoder = new TextDecoder()
  return {
    header: JSON.parse(decoder.decode(base64url.parse(header, { loose: true }))),
    payload: JSON.parse(decoder.decode(base64url.parse(payload, { loose: true }))),
    signature: base64url.parse(signature, { loose: true }),
    raw: { header, payload, signature },
  }
}

/**
 *
 * @param jwk the json web key to use to validate the jwt signature
 * @param token the token to validate the signature for
 * @returns a promise with true when the signarue is valid or false when invalid
 */
export const validateSignature = async (jwk: JsonWebKey, token: string): Promise<boolean> => {
  const key: CryptoKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
    false,
    ['verify'],
  )
  const decodedToken: DecodedJWT = decodeJwt(token)
  const data = new TextEncoder().encode(`${decodedToken.raw.header}.${decodedToken.raw.payload}`)
  return await crypto.subtle.verify(
    { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
    key,
    decodedToken.signature,
    data,
  )
}

/**
 * Check whether the token has expired or not
 *
 * @param token the token to check the expiration for
 * @returns true when the token has expired, false otherwise
 */
export const hasExpired = (token: string): boolean => {
  const payload: JwtPayload = getJwtPayload(token)

  const currentTime = new Date().getTime() / 1000

  return currentTime > payload.exp
}

/**
 * Extract the payload from the jwt into a structured object
 *
 * @param token the token to get the payload from
 * @returns {@link JwtPayload}
 */
export const getJwtPayload = (token: string): JwtPayload => {
  const decodedToken = decodeJwt(token)
  return JSON.parse(atob(decodedToken.raw.payload)) as JwtPayload
}

/**
 * Fetches the well known json web keys for the authentication provider.
 * The response is cached for 15 minutes.
 *
 * @param context the request context
 * @param cache the cache storage
 * @returns a promise with a list of Json web keys
 */
export const fetchWellKnownJwks = async (context: EventContext<any, any, any>, cache: Cache): Promise<JsonWebKey[]> => {
  const { env } = context

  if (env.AUTH_DOMAIN === 'https://login.ankor.io') {
    const cacheKey: string = `${env.AUTH_DOMAIN}/.well-known/jwks.json`
    // Check whether the value is already available in the cache
    let response: Response | undefined = await cache.match(cacheKey)

    if (!response) {
      // If not in cache, get it from origin
      response = await fetch(cacheKey)

      // Must use Response constructor to inherit all of response's fields
      response = new Response(response.body, response)

      // Cache API respects Cache-Control headers. Setting s-max-age to 900
      // will limit the response to be in cache for 15 mins max

      // Any changes made to the response here will be reflected in the cached value
      response.headers.append('Cache-Control', 's-maxage=900')

      // Store the fetched response as cacheKey
      // wait for the write to return
      await cache.put(cacheKey, response.clone())
    }

    //well-known/jwks.json must always return an object with a keys filed containing the keys
    return ((await response.json()) as any).keys
  }

  return Promise.resolve([
    {
      e: 'AQAB',
      n: 'vb0-Qi6UzrFLH5xs9Ot2uwBguH7YKCZ8nT1KvxXa-dFYNazGL7EG59ghMnivBRO9CZrdhQzXk3NN-dekNdBYau_ti-EzU4OTitdRhapQL4vFegVvrFbEbgYru_QssrIT6VGSC6h66p1dLnuvk8MoGyRGBqQBinocqmqVC9THnjv835IW3CrZh6mF5-IPv3BrWhillqNBQR-6YsOvjKeah_vKXL3aIBvtxnxuCyXuEvsdZ4UA2_6L_iUiWVxUOD4OomI-6x82AceNbwa2EU-I25EtfZUaWHWZiEsUM2_gQhcptkdDd9SJK5BWEjvwGdLyjfh59y4D8ai9EDOIAG2bCQ',
      alg: 'RS256',
      kid: 'db:ef:1d:5f:2f:40:23:5a:c8:83:aa:c7:6b:3b:0b:94',
      kty: 'RSA',
      use: 'sig',
    },
  ])
}

/**
 * The structure of a decoded Jwt
 */
export declare type DecodedJWT = {
  /**
   * The jwt decoded header
   */
  header: any
  /**
   * The decoded jwt payload
   */
  payload: any
  /**
   * The decoded jwt signature
   */
  signature: any
  /**
   * The raw values
   */
  raw: {
    /**
     * The raw jwt header
     */
    header: any
    /**
     * The raw jwt payload
     */
    payload: any
    /**
     * The raw jwt signature
     */
    signature: any
  }
}

/**
 * The Jwt payload structure. There are more fields available here
 * but those are the ones we are interested in at the moment to
 * check the validity of the token
 */
export declare type JwtPayload = {
  /**
   * Expires at
   */
  exp: number
  /**
   * Issued at
   */
  iat: number
  /**
   * Issuing authority
   */
  iss: string
  /**
   * The subject
   */
  sub: string
  /**
   * Auth provider - The list of permissions
   */
  permissions?: string[]
  /**
   * Auth Provider - The org code that the user belongs to
   */
  org_code?: string
}
