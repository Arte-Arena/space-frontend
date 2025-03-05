const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]): void => {
    if (isDev) {
      console.log(...args);
    }
  },
  error: (...args: any[]): void => {
    if (isDev) {
      console.error(...args);
    }
  },
  warn: (...args: any[]): void => {
    if (isDev) {
      console.warn(...args);
    }
  },
  info: (...args: any[]): void => {
    if (isDev) {
      console.info(...args);
    }
  },
  debug: (...args: any[]): void => {
    if (isDev) {
      console.debug(...args);
    }
  }
};
