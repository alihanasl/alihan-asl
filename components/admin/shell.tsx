"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Briefcase,
  User,
  Wrench,
  Type,
  X,
} from "lucide-react";
import { logoutAction } from "@/lib/cms/actions";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/content", label: "Content", icon: Type },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-app min-h-svh bg-zinc-100 text-zinc-900">
      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-800 bg-zinc-950 text-zinc-100 lg:relative lg:block",
            open ? "block" : "hidden lg:block",
          )}
        >
          <div className="flex h-14 items-center justify-between px-4">
            <p className="text-sm font-semibold tracking-tight">CMS</p>
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="px-2 py-2">
            {links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "mb-0.5 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute inset-x-0 bottom-0 border-t border-zinc-800 p-3">
            <p className="truncate px-1 text-xs text-zinc-500">{username}</p>
            <form action={logoutAction}>
              <button type="submit" className="mt-2 flex items-center gap-2 px-1 text-sm text-zinc-400 hover:text-white">
                <LogOut className="h-4 w-4" />
                Çıkış
              </button>
            </form>
          </div>
        </aside>

        <div className="min-h-svh">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-4 lg:hidden">
            <button type="button" onClick={() => setOpen(true)} aria-label="Menü">
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-sm font-semibold">Admin</p>
          </header>
          <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
        </div>
      </div>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Menüyü kapat"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
