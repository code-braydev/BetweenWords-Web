export default defineNuxtRouteMiddleware((to, from) => {
  if (from.query.session && !to.query.session) {
    return navigateTo({
      path: to.path,
      query: {
        ...to.query,
        session: from.query.session,
      },
    });
  }

  if (import.meta.client) {
    const store = useGameStore();
    const isExcludedRoute = ["/", "/professor", "/forbidden"].includes(to.path);

    if (!isExcludedRoute && !store.user.fullName?.trim()) {
      return navigateTo({
        path: "/",
        query: to.query,
      });
    }
  }
});
