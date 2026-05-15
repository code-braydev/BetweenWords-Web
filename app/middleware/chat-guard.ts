// Protects /message (Ari chat) — requires an active session query param OR
// the user must be registered in the game store (isPcUnlocked).
// Runs only on this route, not globally.
export default defineNuxtRouteMiddleware((to) => {
    // Allow if a session query param is present
    if (to.query.session) return

    // On the client side, also check the Pinia store
    if (import.meta.client) {
        const store = useGameStore()
        if (store.status.isPcUnlocked) return

        // No session and no active game — block access
        return navigateTo({
            path: '/forbidden',
            query: { from: to.path }
        })
    }
})
