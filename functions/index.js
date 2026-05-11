const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const TEMPLATE_COLLECTION = 'emailTemplates';
const WINNER_TEMPLATE_DOC = 'winner';

function getTransport() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error('Missing EMAIL_USER/EMAIL_PASS environment variables');
  }

  // Gmail SMTP with app password
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}

function replaceVars(text, vars) {
  if (!text) return '';
  return String(text).replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const v = vars[key];
    return v === undefined || v === null ? '' : String(v);
  });
}

async function getWinnerTemplate() {
  const snap = await admin.firestore()
    .collection(TEMPLATE_COLLECTION)
    .doc(WINNER_TEMPLATE_DOC)
    .get();

  if (!snap.exists) {
    return {
      subject: 'Congratulations! You Have Been Selected',
      bodyHtml: '',
      headerText: 'Congratulations',
      footerText: 'Need help? Contact our support team.',
      logoUrl: '',
    };
  }

  return snap.data();
}

function buildDefaultWinnerHtml(vars) {
  const name = escapeHtml(vars.name || 'FanPrizeHub Fan');
  const country = escapeHtml(vars.country || '');
  const prize = escapeHtml(vars.prize || '');

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#050507;">
    <div style="max-width:680px;margin:0 auto;padding:24px 16px;font-family:Arial, Helvetica, sans-serif;color:#E5E7EB;">
      <div style="text-align:center;margin-bottom:18px;">
        <div style="display:inline-block;padding:10px 18px;border-radius:999px;background:linear-gradient(90deg,#8B5CF6,#EC4899);color:#fff;font-weight:700;">
          FanPrizeHub
        </div>
      </div>

      <div style="background:#0B0B12;border:1px solid rgba(139,92,246,0.25);border-radius:18px;overflow:hidden;">
        <div style="padding:28px 22px 18px;background:linear-gradient(180deg, rgba(139,92,246,0.18), rgba(236,72,153,0.06));">
          <div style="font-size:44px;line-height:1;text-align:center;margin-bottom:10px;">🏆</div>
          <h1 style="margin:0;font-size:34px;letter-spacing:-0.5px;text-align:center;color:#fff;">
            Congratulations, <span style="color:#FDE68A;">${name}</span>!
          </h1>
          <p style="margin:12px 0 0;text-align:center;color:#CBD5E1;font-size:15px;">
            You have been selected as a winner. ${prize ? `Prize: ${prize}` : ''}${country ? ` (${country})` : ''}
          </p>
        </div>

        <div style="padding:18px 22px 26px;">
          <p style="margin:0;color:#E5E7EB;font-size:14px;line-height:1.6;">
            Your application has been fully reviewed by our admin team. This notification confirms your selection.
          </p>

          <div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;color:#94A3B8;font-size:13px;line-height:1.6;">
              Need help? Contact our support team anytime.
              <br/>
              <span style="color:#FDE68A;">support@fanprizehub.com</span>
            </p>
          </div>
        </div>
      </div>

      <p style="margin:18px 0 0;text-align:center;color:#64748B;font-size:12px;">
        © ${new Date().getFullYear()} FanPrizeHub. All rights reserved.
      </p>
    </div>
  </body>
</html>
`;
}

async function sendWinnerEmail({ toEmail, subject, bodyHtmlFallback, vars }) {
  const transport = getTransport();

  const html =
    bodyHtmlFallback && String(bodyHtmlFallback).trim().length > 0
      ? replaceVars(bodyHtmlFallback, vars)
      : buildDefaultWinnerHtml(vars);

  const finalSubject = replaceVars(subject, vars) || 'Congratulations! You Have Been Selected';

  const msg = {
    from: `"${process.env.EMAIL_FROM_NAME || 'FanPrizeHub'}" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: finalSubject,
    html,
  };

  const info = await transport.sendMail(msg);
  if (!info || !info.messageId) {
    throw new Error('Email send failed: no messageId returned');
  }

  return info;
}

exports.onEntryApproved = functions.firestore
  .document('entries/{entryId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Only when status transitions INTO approved
    const beforeStatus = before?.status;
    const afterStatus = after?.status;

    if (beforeStatus === 'approved') return null;
    if (afterStatus !== 'approved') return null;

    const toEmail = after?.email;
    if (!toEmail) {
      console.warn('[Email] Missing email for approved entry', context.params.entryId);
      return null;
    }

    const entryRef = change.after.ref;
    const alreadySent = after?.winnerEmailSent === true;
    if (alreadySent) return null;

    try {
      const template = await getWinnerTemplate();

      const vars = {
        name: after?.fullName || '',
        email: after?.email || '',
        country: after?.country || '',
        prize: after?.prizeAmount || after?.prize || after?.payoutAmount || '',
      };

      const subject = template?.subject || 'Congratulations! You Have Been Selected';
      const bodyHtml = template?.bodyHtml || '';

      await sendWinnerEmail({
        toEmail,
        subject,
        bodyHtmlFallback: bodyHtml,
        vars,
      });

      await entryRef.set({ winnerEmailSent: true }, { merge: true });
      console.log('[Email] Sent winner notification', context.params.entryId);
      return null;
    } catch (err) {
      console.error('[Email] Failed to send winner notification', err);
      throw err;
    }
  });
