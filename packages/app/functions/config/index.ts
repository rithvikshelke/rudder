export const onRequest = (context: any): Promise<Response> => {
  const { env } = context
  return Promise.resolve(
    new Response(
      JSON.stringify({
        AUTHENTICATION_CLIENT_OPTIONS: {
          client_id: env.KINDE_CLIENT_ID,
          org_code: env.KINDE_ORG_CODE,
          domain: env.AUTH_DOMAIN,
          is_dangerously_use_local_storage: !!env.IS_DANGEROUSLY_USING_LOCAL_STORAGE,
        },
        ALGOLIA: {
          app_id: env.ALGOLIA_APP_ID,
          place_index: env.PLACE_INDEX,
        },
      }),
      {
        status: 200,
      },
    ),
  )
}
