import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
  state: () => ({
    user: {
      nickname: "",
      fullName: "",
      grade: "",
      group: "",
    },

    status: {
      isPcUnlocked: false,
      isWhatsappUnlocked: false,
      isFileUnlocked: false,
      currentStep: "desktop", // login, desktop, whatsapp, excel
      isMaximized: false,
      runningApps: [] as string[], // Apps that are open/minimized (for taskbar dots)
    },



    security: {
      attempts: 0,
      isLocked: false,
      lockTime: 0,
    },

    academic: {
      score: 0,
      completedExercises: 0,
      totalExercises: 5,
    },
  }),

  actions: {
    login(nickname: string) {
      this.user.nickname = nickname;
    },

    resetSecurity() {
      this.security.attempts = 0;
      this.security.isLocked = false;
      this.security.lockTime = 0;
    },

    unlockPC() {
      this.status.isPcUnlocked = true;
      this.status.currentStep = "desktop";
      this.resetSecurity();
    },

    openApp(appName: string) {
      if (!this.runningApps.includes(appName)) {
        this.runningApps.push(appName);
      }
      this.status.currentStep = appName;
      this.status.isMaximized = false;
    },
    
    closeApp() {
      const appName = this.status.currentStep;
      this.runningApps = this.runningApps.filter(app => app !== appName);
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

        const timer = setInterval(() => {
          this.security.lockTime--;
          if (this.security.lockTime <= 0) {
            this.security.isLocked = false;
            clearInterval(timer);
          }
        }, 1000);
      }
    },

    setScore(points: number) {
      this.academic.score = points;
    },
  },

  persist: {
    key: "ova-state",
    storage:
      typeof localStorage !== "undefined"
        ? localStorage
        : {
            getItem: (_: string) => null,
            setItem: (_: string, __: string) => {},
          },
  },
});
