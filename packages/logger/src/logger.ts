import path from "node:path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

function resolveLogDir(): string {
  const configured = process.env.LOG_DIRECTORY?.trim();
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.resolve(process.cwd(), configured);
  }
  return path.join(process.cwd(), "logs");
}

const LOG_DIR = resolveLogDir();

const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

winston.addColors({
  error: "bold red",
  warn: "bold yellow",
  info: "bold green",
  http: "bold magenta",
  debug: "bold blue",
});

const ANSI = {
  reset: "\x1b[0m",
  dim: "\x1b[38;5;245m",
  red: "\x1b[31m",
  redBold: "\x1b[1;31m",
  yellow: "\x1b[33m",
  yellowBold: "\x1b[1;33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
} as const;

const parseHttpStatus = (msg: string): number | null => {
  const statusMatch = msg.match(/\s(\d{3})\s/);
  return statusMatch ? Number.parseInt(statusMatch[1]!, 10) : null;
};

const colorByStatus = (msg: string): string => {
  const status = parseHttpStatus(msg);
  if (status === null) return msg;

  if (status >= 500) return `${ANSI.redBold}${msg}${ANSI.reset}`;
  if (status >= 400) return `${ANSI.yellowBold}${msg}${ANSI.reset}`;
  if (status >= 300) return `${ANSI.cyan}${msg}${ANSI.reset}`;
  if (status >= 200) return `${ANSI.green}${msg}${ANSI.reset}`;
  return `${ANSI.gray}${msg}${ANSI.reset}`;
};

const colorByMethod = (msg: string): string => {
  if (msg.includes("GET ")) return `${ANSI.green}${msg}${ANSI.reset}`;
  if (msg.includes("POST ")) return `${ANSI.blue}${msg}${ANSI.reset}`;
  if (msg.includes("PUT ")) return `${ANSI.yellow}${msg}${ANSI.reset}`;
  if (msg.includes("PATCH ")) return `${ANSI.yellow}${msg}${ANSI.reset}`;
  if (msg.includes("DELETE ")) return `${ANSI.red}${msg}${ANSI.reset}`;
  if (msg.includes("OPTIONS ")) return `${ANSI.gray}${msg}${ANSI.reset}`;
  return msg;
};

const formatLogMessage = (level: string, message: unknown): string => {
  const msg = String(message);
  const status = parseHttpStatus(msg);

  if (level === "http" || status !== null) {
    return colorByStatus(msg);
  }

  return colorByMethod(msg);
};

const buildLogLine = (
  info: winston.Logform.TransformableInfo,
): string => {
  const { timestamp, level, message, stack, service, ...meta } = info;

  const coloredLevel = winston.format
    .colorize()
    .colorize(level, level.toUpperCase().padEnd(5));

  const coloredTimestamp = `${ANSI.dim}${timestamp}${ANSI.reset}`;

  const svcTag = service
    ? `${ANSI.magenta}${String(service).padEnd(10)} |${ANSI.reset}  `
    : " ".padEnd(13);

  const metaStr =
    Object.keys(meta).length > 0 ? "\n" + JSON.stringify(meta, null, 2) : "";

  const formattedMsg = formatLogMessage(level, message);
  const base = `${coloredTimestamp}  ${coloredLevel}  ${svcTag}${formattedMsg}${metaStr}`;

  return stack ? `${base}\n${stack}` : base;
};

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "DD-MM-YYYY hh:mm:ss A" }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => buildLogLine(info)),
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "DD-MM-YYYY - hh:mm:ss A" }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => buildLogLine(info)),
);

const rotationOptions = {
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxFiles: "30d",
  maxSize: "50m",
  createSymlink: true,
};

const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  format: consoleFormat,
});

const combinedTransport = new DailyRotateFile({
  ...rotationOptions,
  dirname: path.join(LOG_DIR, "combined"),
  filename: "combined-%DATE%.log",
  symlinkName: "combined-latest.log",
  level: "debug",
  format: fileFormat,
});

const errorTransport = new DailyRotateFile({
  ...rotationOptions,
  dirname: path.join(LOG_DIR, "errors"),
  filename: "error-%DATE%.log",
  symlinkName: "error-latest.log",
  level: "error",
  format: fileFormat,
});

const requestTransport = new DailyRotateFile({
  ...rotationOptions,
  dirname: path.join(LOG_DIR, "requests"),
  filename: "request-%DATE%.log",
  symlinkName: "request-latest.log",
  level: "http",
  format: fileFormat,
});

export const winstonLogger = winston.createLogger({
  levels: customLevels,
  level: "debug",
  transports: [consoleTransport, combinedTransport, errorTransport],
});

export const httpLogger = winston.createLogger({
  levels: customLevels,
  level: "http",
  transports: [consoleTransport, requestTransport, combinedTransport],
});

combinedTransport.on("rotate", (oldFile, newFile) => {
  winstonLogger.info(`Log rotated: ${oldFile} → ${newFile}`);
});

export type ServiceLogger = {
  info: (msg: string, meta?: object) => void;
  warn: (msg: string, meta?: object) => void;
  error: (msg: string, meta?: object) => void;
  debug: (msg: string, meta?: object) => void;
  http: (msg: string, meta?: object) => void;
};

export const createLogger = (service: string): ServiceLogger => ({
  info: (msg, meta) => winstonLogger.info(msg, { service, ...meta }),
  warn: (msg, meta) => winstonLogger.warn(msg, { service, ...meta }),
  error: (msg, meta) => winstonLogger.error(msg, { service, ...meta }),
  debug: (msg, meta) => winstonLogger.debug(msg, { service, ...meta }),
  http: (msg, meta) => httpLogger.http(msg, { service, ...meta }),
});

export const logHttpRequest = (message: string, meta?: object): void => {
  const status = parseHttpStatus(message);

  if (status !== null && status >= 500) {
    httpLogger.error(message, meta);
    return;
  }

  if (status !== null && status >= 400) {
    httpLogger.warn(message, meta);
    return;
  }

  httpLogger.http(message, meta);
};

export const logger = createLogger("backend");
export type Logger = ServiceLogger;
