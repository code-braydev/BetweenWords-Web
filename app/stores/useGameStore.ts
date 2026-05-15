import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
  state: () => ({
    user: {
      nickname: "",
      fullName: "",
    },

    status: {
      isPcUnlocked: false,
      isWhatsappUnlocked: false,
      isFileUnlocked: false,
      isMaximized: false,
      currentStep: "login",
      runningApps: [] as string[],
      hasStarted: false,
    },

    security: {
      attempts: 0,
      isLocked: false,
      lockTime: 0,
    },

    academic: {
      score: 0,
      completedExercises: 0,
      totalExercises: 15,
      isExamCompleted: false,
    },

    session: {
      id: "",
      topic: "",
      sheetUrl: "",
      valid: false,
      expiresAt: 0,
    },

    _lockTimer: null as any,
  }),

  actions: {
    login(nickname: string) {
      this.user.nickname = nickname;
    },

    resetSecurity() {
      this.security.attempts = 0;
      this.security.isLocked = false;
      this.security.lockTime = 0;
      if (this._lockTimer) {
        clearInterval(this._lockTimer);
        this._lockTimer = null;
      }
    },

    unlockPC() {
      this.status.isPcUnlocked = true;
      this.status.currentStep = "desktop";
      this.resetSecurity();
    },

    openApp(appName: string) {
      if (!this.status.runningApps.includes(appName)) {
        this.status.runningApps.push(appName);
      }
      this.status.currentStep = appName;
      this.status.isMaximized = false;
    },

    closeApp() {
      const appName = this.status.currentStep;
      this.status.runningApps = this.status.runningApps.filter(
        (app) => app !== appName,
      );
      this.status.currentStep = "desktop";
      this.status.isMaximized = false;
    },

    minimizeApp() {
      this.status.currentStep = "desktop";
    },

    toggleMaximize() {
      this.status.isMaximized = !this.status.isMaximized;
    },

    registerFailure() {
      this.security.attempts++;

      if (this.security.attempts >= 3) {
        this.security.isLocked = true;
        const lockCycle = (this.security.attempts - 3) % 3;
        this.security.lockTime = (lockCycle + 1) * 5;
        this.startLockTimer();
      }
    },

    startLockTimer() {
      if (!this.security.isLocked || this.security.lockTime <= 0) return;

      if (this._lockTimer) clearInterval(this._lockTimer);

      this._lockTimer = setInterval(() => {
        this.security.lockTime--;
        if (this.security.lockTime <= 0) {
          this.security.isLocked = false;
          this.security.attempts = 0;
          if (this._lockTimer) clearInterval(this._lockTimer);
          this._lockTimer = null;
        }
      }, 1000);
    },

    setScore(points: number) {
      this.academic.score = points;
    },

    setSession(session: {
      id: string;
      topic?: string;
      sheetUrl?: string;
      expiresAt?: number;
    }) {
      // If the session ID changed, reset the game state
      if (this.session.id && this.session.id !== session.id) {
        this.resetGame();
      }

      this.session.id = session.id;
      this.session.topic = session.topic ?? "";
      this.session.sheetUrl = session.sheetUrl ?? "";
      this.session.expiresAt = session.expiresAt ?? 0;
      this.session.valid = true;
    },

    clearSession() {
      this.session.id = "";
      this.session.topic = "";
      this.session.sheetUrl = "";
      this.session.valid = false;
      this.session.expiresAt = 0;
    },

    resetGame() {
      // Reset everything except user nickname if desired,
      // but usually for a new session we want a full reset.
      this.status.isPcUnlocked = false;
      this.status.isWhatsappUnlocked = false;
      this.status.isFileUnlocked = false;
      this.status.isMaximized = false;
      this.status.currentStep = "login";
      this.status.runningApps = [];

      this.academic.score = 0;
      this.academic.completedExercises = 0;
      this.academic.isExamCompleted = false;

      this.resetSecurity();
    },
  },

  persist: {
    key: "ova-state",
    pick: ["user", "status", "security", "academic", "session"],
    storage:
      typeof localStorage !== "undefined"
        ? localStorage
        : {
            getItem: (_: string) => null,
            setItem: (_: string, __: string) => {},
          },
  },
});
