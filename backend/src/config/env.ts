export const env = {
  mongoUri: String(process.env.MONGO_URI),
  port: Number(process.env.PORT) || 5000,
  apiKey: String(process.env.API_KEY),
};

if (!env.mongoUri) {
  throw new Error("MONGO_URI is not defined");
}

if (!env.apiKey) {
  throw new Error("API_KEY is not defined");
}
