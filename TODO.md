# TODO

## Task: Redirect to t.me/fanprizehub after successful giveaway submission

- [ ] Locate the giveaway application submit handler in `src/pages/user/ClaimForm.jsx`
- [ ] Add `window.location.href = "https://t.me/fanprizehub";` so it runs only after existing success logic (Firestore save + Telegram notification) completes successfully
- [ ] Ensure redirect does **not** run on submission failure (keep existing error handling unchanged)
- [ ] Run build/lint checks (if available) to confirm no syntax errors

