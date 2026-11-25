export default defineNitroPlugin((nitroApp) => {
  if (import.meta.dev) return

  const { apiBase } = useRuntimeConfig()
  const policy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: ${new URL(apiBase).origin}`,
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')

  nitroApp.hooks.hook('render:response', (response) => {
    response.headers = { ...response.headers, 'Content-Security-Policy': policy }
  })
})
