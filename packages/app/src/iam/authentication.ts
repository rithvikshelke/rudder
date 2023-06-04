import { App } from 'vue'
import { Router } from 'vue-router'
import createKindeClient from '@kinde-oss/kinde-auth-pkce-js'
import { AuthenticationClientOptions, AuthenticationContext, PrincipalIdentity } from './types'
import { getJwtPayload, JwtPayload } from '@/common/jwt'

/**
 * Create a plugin for the Vue App to use the Kinde authentication client.
 *
 * - Exposes a '$principalIdentity' object in the app globals.
 * - Exposes an '$authenticationContext' object in the app globals.
 * - Exposes the KindeClient as '_kindeClient' in the app globals. (do not use this, please.)
 *
 * @param authenticationClientOptions additional options to supply to the KindeClient creation
 * @param router the router to attach Route Guards to, needs to be functioning in the app context.
 * @returns a plugin to install.
 */
export async function createAuthentication(authenticationClientOptions: AuthenticationClientOptions, router?: Router) {
  /**
   * init the Kinde Client immediately!
   */
  const kindeClient = await createKindeClient({
    // default logout redirect location
    logout_uri: `${window.location.origin}/`,
    redirect_uri: `${window.location.origin}/auth/callback`,
    on_redirect_callback: (_user, appState) => {
      // This function is called:
      //  1. After a login.
      //  2. On a direct page load/refresh (after an kinde oauth token refresh)
      //
      // See their documentation example of the SDK:
      //  https://kinde.com/docs/developer-tools/javascript-sdk/
      //    > Persisting Application State
      // it implictly only redirects when there is a appState.
      // We need to follow that.

      // redirect back based on the app state?
      if (appState?.redirectTo) {
        console.debug('app state redirect detected, using ', appState.redirectTo)

        // replace the route if in a router or use the window to redirect.
        if (router) {
          router.replace({ path: appState.redirectTo })
        } else {
          window.location.pathname = appState.redirectTo
        }
      }
    },
    ...authenticationClientOptions,
  })

  /**
   * Send the user to the login page.
   */
  const redirectToLogin = (options: any = {}): Promise<void> => {
    const loginOptions = {
      app_state: {
        // keep the state (path only, no host) so that the user is redirected back to where they started
        redirectTo: window.location.pathname,
      },
      org_code: authenticationClientOptions.org_code,
      ...options,
    }
    return kindeClient.login(loginOptions)
  }

  /**
   * Send the user to the logout flow.
   */
  const logout = (): Promise<void> => {
    return kindeClient.logout()
  }

  /**
   * Get the user information
   * @returns the KindeUser
   */
  const getUser = (): PrincipalIdentity => {
    const user: PrincipalIdentity = kindeClient.getUser()
    return user
  }

  /**
   * Get the user auth token.
   * @returns the auth token.
   */
  const getToken = (): Promise<string | undefined> => {
    return kindeClient.getToken()
  }

  //
  // create a wrapper to expose
  const _authContext: AuthenticationContext = {
    redirectToLogin,
    logout,
    getUser,
    getToken,
    install: (app: App): void => {
      app.config.globalProperties._kindeClient = kindeClient
      //
      app.config.globalProperties.$principalIdentity = getUser()
      app.config.globalProperties.$authenticationContext = _authContext
      app.provide('authenticationContext', _authContext)
    },
  }

  // init
  if (router) {
    _installNavigationGuards(router, _authContext, authenticationClientOptions)
  }

  return _authContext
}

/**
 * Install the navigation guards.
 */
const _installNavigationGuards = (
  router: Router,
  context: AuthenticationContext,
  authenticationClientOptions: AuthenticationClientOptions,
): void => {
  router.beforeEach(async (to) => {
    // see: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

    // check this route was marked as skip authentication.
    if (to.matched.some((record) => record.meta.skipAuthentication)) {
      console.debug('>>> authentication check skipped.')
      return true
    }

    // we need to verify authentication.
    const token = await context.getToken()
    if (token === undefined) {
      // auth fail -- redirect to authenticate flow.
      context.redirectToLogin()
      return false
    }

    // verify if the token has valid authorization
    // with permission to access plank and is part of the organization
    const jwtPayload: JwtPayload = getJwtPayload(token)
    if (
      jwtPayload.org_code !== authenticationClientOptions.org_code
    ) {
      // permission denied -- route to unauthorized view.
      router.push({ name: 'unauthorized' })
      return false
    }

    // auth ok -- continue with the route.
    return true
  })
}
