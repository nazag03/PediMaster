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

// 🔹 helper: normaliza string/array a array de strings
function normalizeRoles(rawRole) {
  if (!rawRole) return [];

  if (Array.isArray(rawRole)) {
    return rawRole
      .map((r) => String(r).trim())
      .filter((r) => r.length > 0);
  }

  if (typeof rawRole === "string") {
    return rawRole
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
  }

  return [String(rawRole).trim()].filter((r) => r.length > 0);
}

// 🔹 helper: mapea código numérico a nombre “humano”
function mapRoleCodeToName(code) {
  // acá definís vos qué significa cada número
  switch (code) {
    case "0":
      return "SuperAdmin";
    case "1":
      return "Admin";
    case "2":
      return "Client";
    default:
      return code; // por si en el futuro viene otra cosa
  }
}

export function extractUserFromClaims(claims, token) {
  if (!claims) return null;

  const email =
    EMAIL_CLAIMS.map((key) => claims[key]).find(Boolean) || null;

  // 👇 rawRole viene como "0", "1", "2" (o lista/coma, etc.)
  const rawRole = ROLE_CLAIMS.map((key) => claims[key]).find(Boolean) || null;
  const roleCodes = normalizeRoles(rawRole);      // ej: ["0"]
  const primaryRoleCode = roleCodes[0] ?? null;   // ej: "0"

  // lo traducimos a nombres
  const mappedRoles = roleCodes.map(mapRoleCodeToName); // ["SuperAdmin"]
  const primaryRoleName = mappedRoles[0] ?? null;        // "SuperAdmin"

  const userId =
    USER_ID_CLAIMS.map((key) => claims[key]).find(Boolean) || null;

  const expMs = claims.exp ? claims.exp * 1000 : null;

  return {
    email,
    // código crudo que viene del back:
    roleCode: primaryRoleCode,   // "0" | "1" | "2"
    roleCodes: roleCodes,        // array de códigos si hubiera más
    // nombres legibles para usar en el front:
    role: primaryRoleName,       // "SuperAdmin" | "Admin" | "Client"
    roles: mappedRoles,          // array de nombres
    userId,
    token,
    exp: expMs,
  };
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
