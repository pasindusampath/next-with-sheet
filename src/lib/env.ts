const missingEnvVar = (name: string) =>
  new Error(
    `Missing required environment variable: ${name}. Check your deployment settings and server environment.`,
  );

const normalizePrivateKey = (key: string) =>
  key
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .trim();

export const env = {
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  POSTS_SHEET_NAME: process.env.GOOGLE_SHEETS_POSTS_TAB || "Posts",
  ADMINS_SHEET_NAME: process.env.GOOGLE_SHEETS_ADMINS_TAB || "Admins",
  JWT_SECRET: process.env.JWT_SECRET,
};

export function getGoogleServiceAccount() {
  if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw missingEnvVar("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  }

  if (!env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    throw missingEnvVar("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  }

  return {
    clientEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: normalizePrivateKey(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY),
  };
}

export function getGoogleSheetId() {
  if (!env.GOOGLE_SHEET_ID) {
    throw missingEnvVar("GOOGLE_SHEET_ID");
  }

  return env.GOOGLE_SHEET_ID;
}

export function getJwtSecret() {
  if (!env.JWT_SECRET) {
    throw missingEnvVar("JWT_SECRET");
  }

  return env.JWT_SECRET;
}

