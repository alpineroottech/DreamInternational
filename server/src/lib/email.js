import { Resend } from "resend";

const SITE_NAME = "Dream International Travel and Tours";
/** Official inbox for all inquiry notifications (Resend-verified). */
const DEFAULT_ADMIN_EMAIL = "resend@flywithdream.com";

let resendClient = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

function fromAddress() {
  // Sender can be any verified Resend address; onboarding works without a custom domain.
  return process.env.RESEND_FROM_EMAIL || "Dream International <onboarding@resend.dev>";
}

function adminRecipient() {
  const configured = (process.env.RESEND_ADMIN_EMAIL || "").trim();
  return configured || DEFAULT_ADMIN_EMAIL;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fieldRows(fields) {
  return fields
    .filter(([, value]) => value != null && String(value).trim() !== "")
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e8eef0;font-weight:600;width:140px;">${escapeHtml(label)}</td>` +
        `<td style="padding:8px 12px;border:1px solid #e8eef0;">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");
}

function plainFields(fields) {
  return fields
    .filter(([, value]) => value != null && String(value).trim() !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

async function sendMail({ to, subject, html, text, replyTo }) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured — email not sent");
    return { ok: false, skipped: true };
  }
  if (!to) {
    console.warn("[email] No recipient — email not sent");
    return { ok: false, skipped: true };
  }

  try {
    const payload = {
      from: fromAddress(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    };
    if (replyTo) payload.reply_to = replyTo;

    const { data, error } = await resend.emails.send(payload);
    if (error) {
      console.error("[email] Resend API error:", { to, subject, error });
      return { ok: false, error };
    }
    console.log("[email] Sent:", { to, subject, id: data?.id });
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("[email] Send failed:", err);
    return { ok: false, error: err.message };
  }
}

function adminTemplate(title, fields, referenceId) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#113d48;">
      <h2 style="color:#0a074f;">${escapeHtml(title)}</h2>
      <p style="color:#5d7279;">A new submission was received on your website.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0;">${fieldRows(fields)}</table>
      ${referenceId ? `<p style="font-size:12px;color:#888;">Reference: ${escapeHtml(referenceId)}</p>` : ""}
    </div>
  `;
}

function userConfirmationHtml(name, detailText = "your message") {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#113d48;">
      <h2 style="color:#0a074f;">Thank you, ${escapeHtml(name)}!</h2>
      <p>We've received ${detailText} and our team will get back to you shortly.</p>
      <p style="color:#5d7279;">— ${SITE_NAME}</p>
    </div>
  `;
}

/** Fire-and-forget wrapper — never throws; logs failures only. */
export function deliverInquiryEmails(inquiry) {
  void sendInquiryEmails(inquiry).catch((err) => console.error("[email] inquiry delivery failed:", err));
}

async function sendInquiryEmails(inquiry) {
  const details = inquiry.customDetails && typeof inquiry.customDetails === "object"
    ? inquiry.customDetails
    : {};

  const fields = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Nationality", inquiry.nationality],
    ["Travel dates", inquiry.travelDates],
    ["Group size", inquiry.groupSize],
    ["Inquiry type", inquiry.type || "STANDARD"],
    ["Subject category", details.subjectCategoryLabel || details.subjectCategory],
    ["Selected item", details.subjectLabel],
    ["Message", inquiry.message],
  ];

  const admin = adminRecipient();
  const tasks = [
    // Primary: always notify the official inbox.
    sendMail({
      to: admin,
      replyTo: inquiry.email,
      subject: `New contact inquiry — ${inquiry.name}`,
      html: adminTemplate("New Contact Inquiry", fields, inquiry.id),
      text: `New contact inquiry\n\n${plainFields(fields)}\n\nReference: ${inquiry.id}`,
    }),
  ];

  // Best-effort confirmation to the visitor (may fail on free-tier / unverified domains).
  if (inquiry.email && inquiry.email.toLowerCase() !== admin.toLowerCase()) {
    tasks.push(
      sendMail({
        to: inquiry.email,
        subject: `We received your message — ${SITE_NAME}`,
        html: userConfirmationHtml(inquiry.name),
        text: `Thank you, ${inquiry.name}! We've received your message and will be in touch shortly.\n\n— ${SITE_NAME}`,
      })
    );
  }

  await Promise.allSettled(tasks);
}

/** Fire-and-forget wrapper — never throws; logs failures only. */
export function deliverFlightInquiryEmails(inquiry) {
  void sendFlightInquiryEmails(inquiry).catch((err) =>
    console.error("[email] flight inquiry delivery failed:", err)
  );
}

async function sendFlightInquiryEmails(inquiry) {
  const fields = [
    ["Ticket type", inquiry.ticketType === "international" ? "International" : "Domestic"],
    ["From", inquiry.fromCity],
    ["To", inquiry.toCity],
    ["Departure", inquiry.travelDate],
    ["Return", inquiry.returnDate],
    ["Passengers", inquiry.passengers],
    ["Cabin class", inquiry.cabinClass],
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Nationality", inquiry.nationality],
    ["Notes", inquiry.message],
  ];

  const admin = adminRecipient();
  const routeLabel = `${inquiry.fromCity} → ${inquiry.toCity}`;

  const tasks = [
    sendMail({
      to: admin,
      replyTo: inquiry.email,
      subject: `New flight enquiry — ${routeLabel} (${inquiry.name})`,
      html: adminTemplate("New Flight Ticketing Inquiry", fields, inquiry.id),
      text: `New flight inquiry\n\n${plainFields(fields)}\n\nReference: ${inquiry.id}`,
    }),
  ];

  if (inquiry.email && inquiry.email.toLowerCase() !== admin.toLowerCase()) {
    tasks.push(
      sendMail({
        to: inquiry.email,
        subject: `Flight enquiry received — ${SITE_NAME}`,
        html: userConfirmationHtml(
          inquiry.name,
          "your flight enquiry for <strong>" + escapeHtml(routeLabel) + "</strong>"
        ),
        text: `Thank you, ${inquiry.name}! We've received your flight enquiry for ${routeLabel} and will be in touch shortly.\n\n— ${SITE_NAME}`,
      })
    );
  }

  await Promise.allSettled(tasks);
}
