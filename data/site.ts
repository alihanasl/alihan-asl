export const site = {
  name: "Alihan Asl",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  year: 2026,
  email: "hello@alihanasl.com",
} as const;

export const socials = [
  { id: "email", href: `mailto:${site.email}` },
  { id: "linkedin", href: "https://www.linkedin.com/in/alihanasl" },
  { id: "github", href: "https://github.com/alihanasl" },
] as const;

export const nav = [
  { id: "work", href: "/#work" },
  { id: "thinking", href: "/#think" },
  { id: "contact", href: "/#contact" },
] as const;
