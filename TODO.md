# TODO

- [x] Add image `image/ChatGPT Image May 11, 2026, 04_54_17 AM.png` to the User Home “Active Giveaways” (giveaway section).
- [x] Ensure the image is served correctly by Vite.
- [ ] Update UI layout (image banner/section) and verify build.
- [x] Admin approval email feature analysis: Firestore trigger already exists in `functions/index.js` as `onEntryApproved`.
- [ ] Verify Firestore fields/logic match: `entries` doc uses `status` and `winnerEmailSent` (or adjust to your schema).
- [ ] Ensure Cloud Function environment variables are set: `EMAIL_USER`, `EMAIL_PASS`, and optionally `EMAIL_FROM_NAME`.

