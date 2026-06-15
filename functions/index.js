const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const { Resend } = require('resend');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Resend client
// Resend requires an API key at construction time.
// Put the key into your functions environment as RESEND_API_KEY.
const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.resend_api_key || process.env.RESEND_APIKEY;

const hasValidResendKey = typeof RESEND_API_KEY === 'string' && RESEND_API_KEY.trim().length > 10;
const resend = hasValidResendKey ? new Resend(RESEND_API_KEY) : null;

if (!resend) {
  logger.warn(
    '[functions] Resend is not configured. Missing/invalid RESEND_API_KEY in Functions env vars. '
    + 'Email sending will fail with an explicit error.'
  );
}

function requireResendClient() {
  if (!resend) {
    const message = '[functions] RESEND_API_KEY is missing or invalid. Set RESEND_API_KEY in Firebase Functions env vars.';
    logger.error(message);
    throw new Error('missing_resend_api_key');
  }
  return resend;
}





/**
 * Cloud Function: Send approval email when entry status changes to 'approved'
 * Triggered on Firestore document write in the 'entries' collection
 */
/**********************
 * Auto-approval email
 *
 * Trigger:
 *  - Fire when a document in `users/{userId}` changes
 *  - Specifically when status transitions from anything -> "approved"
 *
 * Email provider:
 *  - Resend
 *
 * Notes:
 *  - Requires RESEND_API_KEY in your Firebase Functions env vars
 *  - Uses user fields:
 *      { name, email, status }
 **********************/
exports.sendUserApprovalEmail = onDocumentWritten('users/{userId}', async (event) => {
  const userId = event.params.userId;
  const beforeData = event.data.before.data();
  const afterData = event.data.after.data();

  // If the doc was deleted or missing email/status, skip.
  if (!afterData) return;

  const prevStatus = beforeData?.status;
  const nextStatus = afterData?.status;

  // Only send when status becomes approved.
  if (nextStatus !== 'approved' || prevStatus === 'approved') {
    logger.info(`User ${userId} status not changed to approved. prev=${prevStatus} next=${nextStatus}`);
    return;
  }

  const email = afterData?.email;
  const name = afterData?.name || 'there';

  if (!email) {
    logger.warn(`User ${userId} has no email. Skipping approval email.`);
    return;
  }

  try {
    // Fetch approval email template dynamically from Firestore
    // Collection: emailTemplates
    // Doc: approvalEmail
    const tplSnap = await db.collection('emailTemplates').doc('approvalEmail').get();
    const tplData = tplSnap.exists ? tplSnap.data() : null;

    const subject = tplData?.subject || 'Your FanPrizeHub giveaway request is approved 🎉';
    const htmlTemplate = tplData?.body || tplData?.bodyHtml || '';

    const appApprovalUrl = process.env.APP_APPROVAL_URL || 'https://your-site-url.com/account-details';

    // If template is missing, fall back to previous HTML body
    const html = htmlTemplate
      ? String(htmlTemplate)
        .replaceAll('{{name}}', escapeHtml(name))
        .replaceAll('{{email}}', escapeHtml(email))
        .replaceAll('{{approvalUrl}}', appApprovalUrl)
      : `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background:#0b0b12;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;">
    <div style="max-width:680px;margin:0 auto;padding:20px;">
      <div style="background:#11111a;border:1px solid rgba(139,92,246,0.25);border-radius:18px;overflow:hidden;">
        <div style="padding:26px 22px;background:linear-gradient(180deg, rgba(139,92,246,0.20), rgba(236,72,153,0.06));">
          <div style="display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
            <span style="display:inline-block;padding:10px 18px;border-radius:999px;background:linear-gradient(90deg,#8B5CF6,#EC4899);color:#fff;font-weight:800;">
              FanPrizeHub
            </span>
          </div>
          <h1 style="margin:0;text-align:center;font-size:30px;letter-spacing:-0.2px;color:#ffffff;">Approved! 🎉</h1>
          <p style="margin:10px 0 0;text-align:center;color:#cbd5e1;font-size:14px;line-height:1.5;">
            Hi ${escapeHtml(name)},
            <br />
            your giveaway request has been approved successfully.
          </p>
        </div>

        <div style="padding:20px 22px;">
          <div style="background:linear-gradient(135deg, rgba(34,197,94,0.18), rgba(34,197,94,0.06));border-left:6px solid #22c55e;border-radius:14px;padding:16px 16px;">
            <p style="margin:0;color:#22c55e;font-weight:700;font-size:16px;">Your status is now: <span style="color:#16a34a;">Approved</span></p>
            <p style="margin:8px 0 0;color:#e5e7eb;font-size:14px;line-height:1.6;">
              Next, you can review your details and complete any required steps to receive your reward.
            </p>
          </div>

          <div style="margin:18px 0;text-align:center;">
            <a href="${appApprovalUrl}"
               style="display:inline-block;width:100%;max-width:420px;background:linear-gradient(135deg,#8B5CF6,#EC4899);color:#fff;text-decoration:none;padding:14px 18px;border-radius:12px;font-weight:800;box-shadow:0 8px 22px rgba(139,92,246,0.25);">
              Open your account details
            </a>
            <p style="margin:10px 0 0;color:#94a3b8;font-size:12px;">
              If the button doesn’t work, copy and open the link in your browser.
            </p>
          </div>

          <div style="padding:14px 16px;border:1px solid rgba(255,255,255,0.06);border-radius:14px; background:rgba(255,255,255,0.02);">
            <p style="margin:0;color:#e5e7eb;font-weight:700;">What to do next</p>
            <ol style="margin:10px 0 0;padding-left:18px;color:#cbd5e1;font-size:13px;line-height:1.7;">
              <li>Sign in to your FanPrizeHub account.</li>
              <li>Review and complete your details.</li>
              <li>We’ll process your reward after verification.</li>
            </ol>
          </div>
        </div>

        <div style="padding:16px 22px;border-top:1px solid rgba(255,255,255,0.06);color:#94a3b8;font-size:12px;line-height:1.6;">
          Need help? Contact us at <span style="color:#E9D5FF;font-weight:700;">support@fanprizehub.com</span>
          <br />
          <span style="color:#6b7280;">© ${new Date().getFullYear()} FanPrizeHub. All rights reserved.</span>
        </div>
      </div>
    </div>
  </body>
</html>`;

    const resendClient = requireResendClient();

    const result = await resendClient.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'FanPrizeHub <no-reply@fanprizehub.com>',
      to: email,
      subject,
      html,
    });

    logger.info(`Approval email sent to ${email} for user ${userId}. messageId=${result?.data?.id || 'unknown'}`);
  } catch (error) {
    logger.error(`Failed to send approval email for user ${userId} (${email}):`, error);
  }

});

// Small helper to avoid breaking HTML with user-provided names
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');



}




/**
 * TEST FUNCTION: Send a test email to verify Gmail is working
 * Visit: https://your-project-id.firebaseapp.com/testEmail
 */
exports.testEmail = onRequest(async (req, res) => {
  try {
    const to = req.query.to || process.env.TEST_EMAIL_TO;
    if (!to) {
      res.status(400).send('Missing ?to=recipient@example.com or set TEST_EMAIL_TO');
      return;
    }

    const subject = 'FanPrizeHub - Resend Test Email';
    const html = '<h2>Test Successful!</h2><p>Your Resend configuration is working correctly.</p>';

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'FanPrizeHub <no-reply@fanprizehub.com>',
      to,
      subject,
      html,
    });

    res.status(200).send(`✅ Test email sent. messageId=${result?.data?.id || 'unknown'}`);
  } catch (error) {
    logger.error('Test email failed:', error);
    res.status(500).send('❌ Error: ' + error.message);
  }
});
