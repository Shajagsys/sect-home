// Prints a random 64-char hex secret, used by setup-local-db.bat / .sh to
// populate AUTH_SECRET. Kept in its own file rather than an inline `node -e`
// one-liner because the parentheses in `randomBytes(32)` broke cmd.exe's
// parser when nested inside the setup script's `if (...)` block.
console.log(require('crypto').randomBytes(32).toString('hex'));
