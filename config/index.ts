// Re-export all configurations
export * from "./env";
export * from "./database";
export * from "./ai";

// Main configuration object
export { config as appConfig } from "./env";
export { databaseConfig } from "./database";
export { aiConfig } from "./ai";

// Type definitions
export type { Config } from "./env";
export type { AIConfig } from "./ai";
