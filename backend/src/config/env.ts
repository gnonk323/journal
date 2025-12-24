export const env = {
  mongoUri: String(process.env.MONGO_URI),
  port: Number(process.env.PORT) || 5000,
  apiKey: String(process.env.API_KEY),
  jwtSecret: String(process.env.JWT_SECRET),
  passwordHash: String(process.env.PASSWORD_HASH),
};

if (!env.mongoUri) {
  throw new Error("MONGO_URI is not defined");
}
if (!env.apiKey) {
  throw new Error("API_KEY is not defined");
}
if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}
if (!env.passwordHash) {
  throw new Error("PASSWORD_HASH is not defined");
}
