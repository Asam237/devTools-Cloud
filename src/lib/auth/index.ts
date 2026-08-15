import { firebaseAuthBackend } from "./firebase-backend";
import type { AuthBackend } from "./types";

export const authBackend: AuthBackend = firebaseAuthBackend;

export type { AuthBackend, AuthUser } from "./types";
