const EXTENSION_PREFIX = "[Hasura-SSO-Bridge]";

export const logger = {
  info: (message: string, data?: any) => {
    if (data) {
      console.log(`${EXTENSION_PREFIX} ℹ️  ${message}`, data);
    } else {
      console.log(`${EXTENSION_PREFIX} ℹ️  ${message}`);
    }
  },

  success: (message: string, data?: any) => {
    if (data) {
      console.log(`${EXTENSION_PREFIX} ✅ ${message}`, data);
    } else {
      console.log(`${EXTENSION_PREFIX} ✅ ${message}`);
    }
  },

  warning: (message: string, data?: any) => {
    if (data) {
      console.warn(`${EXTENSION_PREFIX} ⚠️  ${message}`, data);
    } else {
      console.warn(`${EXTENSION_PREFIX} ⚠️  ${message}`);
    }
  },

  error: (message: string, error?: any) => {
    if (error) {
      console.error(`${EXTENSION_PREFIX} ❌ ${message}`, error);
    } else {
      console.error(`${EXTENSION_PREFIX} ❌ ${message}`);
    }
  },

  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      if (data) {
        console.debug(`${EXTENSION_PREFIX} 🐛 ${message}`, data);
      } else {
        console.debug(`${EXTENSION_PREFIX} 🐛 ${message}`);
      }
    }
  },
};
