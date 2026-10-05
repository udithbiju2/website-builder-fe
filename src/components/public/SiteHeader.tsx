import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/auth-context.ts";
import { homeForRole } from "../../auth/home-for-role.ts";
import BrandLogo from "../BrandLogo.tsx";
import { headerNav } from "./navigation.ts";

export default function SiteHeader() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <BrandLogo />

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {headerNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-ink-body transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          {user ? (
            <Link to={homeForRole(user)} className={buttonVariants({ size: "sm" })}>
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink hover:text-brand">
                Log in
              </Link>
              <Link to="/signup" className={buttonVariants({ size: "sm" })}>
                Sign up free
              </Link>
            </>
          )}
        </nav>

        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          className="md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onPress={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-line bg-surface px-5 pb-5 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {headerNav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-[15px] text-ink-body hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {user ? (
            <Link to={homeForRole(user)} className={`${buttonVariants({ fullWidth: true })} mt-3`}>
              Go to dashboard
            </Link>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link to="/login" className={buttonVariants({ variant: "outline", fullWidth: true })}>
                Log in
              </Link>
              <Link to="/signup" className={buttonVariants({ fullWidth: true })}>
                Sign up free
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
