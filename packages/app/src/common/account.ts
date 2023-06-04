import { JwtPayload } from "./jwt"

/**
 * The account object
 */
export declare type Account = {
  /**
   * The accouunt unique identifier
   */
  id: string
}

/**
 * Build an account object from a jwt payload
 * 
 * @param payload the payload to build the account from
 * @returns the built account object
 */
export const accountFrom = (payload: JwtPayload): Account => {
  return {
    id: payload.sub
  } as Account
}