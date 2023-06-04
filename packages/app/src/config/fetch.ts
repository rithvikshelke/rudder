import { App } from 'vue'
import { AppConfig, Config, ConfigKey } from './types'

/**
 * Loads the App configuration from the backend and provides them via:
 * - inject in components setup scripts
 * - $config in vue template
 * @returns the vue Config plugin
 */
export async function fetchConfig() {
  const result: Config = await fetch('/config', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())

  const appConfig: AppConfig = {
    ...result,
    install: (app: App) => {
      app.config.globalProperties.$config = result
      app.provide(ConfigKey, result)
    },
  }

  return appConfig
}
