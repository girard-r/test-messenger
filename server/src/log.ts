import debug from "debug";

export enum LogLevel {
  DEBUG = "DEBUG",
  ERROR = "ERROR",
}

export default (scope: string, level: LogLevel = LogLevel.DEBUG) => {
  const logger = debug(scope);
  if (level === LogLevel.DEBUG) {
    logger.log = console.log.bind(console);
  }
  return logger;
};
