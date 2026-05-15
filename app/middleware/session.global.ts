export default defineNuxtRouteMiddleware((to, from) => {
  // If the target route doesn't have a session but the previous one did, carry it over
  if (from.query.session && !to.query.session) {
    return navigateTo({
      path: to.path,
      query: {
        ...to.query,
        session: from.query.session
      }
    })
  }
  
  // Also handle the initial entry case if needed, but usually it's already there.
  // This middleware ensures that any navigation within the app preserves the session.
})
