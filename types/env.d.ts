declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly NODE_ENV: 'production' | 'development';
        readonly MONGO_URI: string;
        readonly MONGO_DATABASE: string;
        readonly MONGO_TARGETS_COLLECTION: string;
      }
    }
  }
}