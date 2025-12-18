import { Resend } from "resend";
import config from "@/config";
import { createModuleLogger } from "@/lib/logger";

const emailLogger = createModuleLogger("Email-Resend");

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string | string[];
}) => {
  const { data, error } = await resend.emails.send({
    from: config.resend.fromAdmin,
    to,
    subject,
    text,
    html,
    ...(replyTo && { replyTo }),
  });

  if (error) {
    emailLogger.error("Email sending failed", error.message, { to });
    throw error;
  }

  emailLogger.info("Email sent successfully", { to, subject });
  return data;
};
