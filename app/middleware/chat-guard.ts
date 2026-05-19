// Protects /message (Ari chat) — requires an active session query param OR
// the user must be registered in the game store (isPcUnlocked).
// Runs only on this route, not globally.
export default defineNuxtRouteMiddleware((to) => {
    // On the client side, verify session validity and active status in Pinia store
    if (import.meta.client) {
        const store = useGameStore()
        
        const isSessionValid = store.session.valid
        const isGameActive = store.status.sessionActive || store.status.isPcUnlocked

        if (isSessionValid && isGameActive) return
    }

    // Fallback: Allow if a session query param is present (e.g. on initial loading/SSR)
    if (to.query.session) return

    // Otherwise, block access
    return navigateTo({
        path: '/forbidden',
        query: { from: to.path }
    })
})
