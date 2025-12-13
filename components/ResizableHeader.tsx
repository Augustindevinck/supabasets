
"use client";

import { useState, useCallback, memo } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import ButtonSignin from "./ButtonSignin";

// ========================================
// Constants
// ========================================

const NAV_ITEMS: Array<{ name: string; link: string }> = [];

// ========================================
// Component
// ========================================

const ResizableHeader = memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        {NAV_ITEMS.length > 0 && <NavItems items={NAV_ITEMS} />}
        <div className="flex items-center gap-4">
          <ButtonSignin text="Login" />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={handleToggleMobileMenu}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={handleCloseMobileMenu}
        >
          {NAV_ITEMS.length > 0 && (
            <nav className="w-full space-y-4" aria-label="Mobile navigation links">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.link}
                  href={item.link}
                  onClick={handleCloseMobileMenu}
                  className="block text-current dark:text-neutral-300 hover:text-primary transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          )}
          <div className="w-full pt-4 border-t border-base-200 dark:border-neutral-700">
            <ButtonSignin text="Login" />
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
});

ResizableHeader.displayName = "ResizableHeader";

export default ResizableHeader;
