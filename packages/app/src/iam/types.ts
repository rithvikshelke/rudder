import { App } from 'vue'

export declare type PrincipalIdentity = {
  id: string | null
  given_name: string | null
  family_name: string | null
  email: string | null
}

export type AuthenticationClientOptions = {
  audience?: string
  client_id?: string
  org_code?: string
  redirect_uri?: string
  domain: string
  is_dangerously_use_local_storage?: boolean
  logout_uri?: string
  on_redirect_callback?: (user: PrincipalIdentity, appState?: any) => void
  scope?: string
}

export interface AuthenticationContext {
  /**
   * Send the user to the login page.
   */
  redirectToLogin(options?: any): Promise<void>

  /**
   * Send the user to the logout flow.
   */
  logout(): Promise<void>

  /**
   * Get the user information
   * @returns the KindeUser
   */
  getUser(): PrincipalIdentity

  /**
   * Get the user auth token.
   * @returns the auth token.
   */
  getToken(): Promise<string | undefined>

  /**
   * Vue app install
   * @param app
   */
  install(app: App): void
}
