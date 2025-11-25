import { jwtDecode } from "jwt-decode";
import { AUTH_STORAGE_KEY } from "../config/apiConfig";

const EMAIL_CLAIMS = [
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  "email",
];

const ROLE_CLAIMS = [
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  "role",
];

const USER_ID_CLAIMS = ["userId", "sub"];

export function getStoredToken() {
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

export function saveToken(token) {
  localStorage.setItem(AUTH_STORAGE_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function decodeClaims(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function extractUserFromClaims(claims, token) {
  if (!claims) return null;

  const email = EMAIL_CLAIMS.map((key) => claims[key]).find(Boolean) || null;
  const role = ROLE_CLAIMS.map((key) => claims[key]).find(Boolean) || null;
  const userId = USER_ID_CLAIMS.map((key) => claims[key]).find(Boolean) || null;
  const expMs = claims.exp ? claims.exp * 1000 : null;

  return { email, role, userId, token, exp: expMs };
}

export function isExpired(expMs) {
  if (!expMs) return false;
  return expMs <= Date.now();
}

export function parseUserFromToken(token) {
  const claims = decodeClaims(token);
  if (!claims) return null;

  const user = extractUserFromClaims(claims, token);
  if (!user || isExpired(user.exp)) {
    return null;
  }

  return user;
}

export function getMsUntilExpiration(expMs) {
  if (!expMs) return null;
  return Math.max(expMs - Date.now(), 0);
}
