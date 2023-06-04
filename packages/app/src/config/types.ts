import { AuthenticationClientOptions } from '@/iam/types'
import { Plugin } from 'vue'

/**
 * The config type definition
 */

export declare type Config = {
  /**
   * The configured websocket url
   */
  WS_URL: string

  /**
   * Kinde client related configurations
   */
  AUTHENTICATION_CLIENT_OPTIONS: AuthenticationClientOptions

  /**
   * Algolia config setting relevant to the front end. Important: do not include any api keys here.
   */
  ALGOLIA: {
    /**
     * The algolia app id
     */
    app_id: string
    /**
     * The algolia place index
     */
    place_index: string
  }
  /**
   * GROWTHBOOK config for creating a growthbook instance
   * Use the SDK connection since the endpoint has now been deprecated
   */
  GROWTHBOOK: {
    /**
     * Client key used for registration of SDK connection
     */
    clientKey: string
    /**
     * Whether to enable development mode
     */
    enableDevMode: boolean
  }
}

// intersect our main type with a Vue app plugin for using it in the app.
export type AppConfig = Config & Plugin
export const ConfigKey: string = 'config'
