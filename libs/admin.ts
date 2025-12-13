const ADMIN_EMAILS = [
  "dropposting40@gmail.com",
];

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export { ADMIN_EMAILS };
