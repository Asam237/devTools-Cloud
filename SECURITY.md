# Security Policy

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, use GitHub's private reporting:

1. Go to the [Security tab](../../security/advisories/new) of this repository.
2. Click "Report a vulnerability" to open a private advisory.

If that isn't available, email the maintainer directly (see the GitHub profile
linked from the commit history) with details and, if possible, steps to
reproduce.

We'll acknowledge reports as quickly as we can and keep you updated as the
issue is investigated and fixed.

## Scope

DevTools Cloud's free tools are designed to run entirely client-side and
never send your input (tokens, secrets, keys, file contents) to a server.
If you find a tool that leaks data to a server unexpectedly, that's a
security bug — please report it.

Backend-adjacent code (Firebase Auth, Firestore rules, the dashboard) is
also in scope, particularly anything that could let one account read or
write another user's data.
