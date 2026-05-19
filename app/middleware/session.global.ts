export default defineNuxtRouteMiddleware((to, from) => {
  // 1. Maintain the session query parameter across navigations
  if (from.query.session && !to.query.session) {
    return navigateTo({
      path: to.path,
      query: {
        ...to.query,
        session: from.query.session,
      },
    });
  }

  // 2. Enforce student identity (fullName) on client-side (except for index, professor, and forbidden)
  if (import.meta.client) {
    const store = useGameStore();
    const isExcludedRoute = ['/', '/professor', '/forbidden'].includes(to.path);
    
    if (!isExcludedRoute && !store.user.fullName?.trim()) {
      return navigateTo({
        path: '/',
        query: to.query // Maintain active session query param
      });
    }
  }
});
