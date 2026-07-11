"use client";

import { useState } from "react";

interface MobileMenuProps {
  navLinks: Array<{ name: string; href: string }>;
  currentPath: string;
}

export function MobileMenu({ navLinks, currentPath }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        <div className="w-5 h-5 flex flex-col justify-center gap-1">
          <span
            className={`block h-0.5 w-full bg-current transition-transform ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}
          />
          <span
            className={`block h-0.5 w-full bg-current transition-opacity ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-full bg-current transition-transform ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={toggleMenu}
        >
          <div
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-[#0a0a0a] border-l border-stone-200 dark:border-stone-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between mb-6">
                <span className="font-serif font-black text-2xl text-slate-900 dark:text-white">
                  GitNews.
                </span>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isActive =
                    currentPath === link.href ||
                    (currentPath.startsWith(link.href) && link.href !== "/");
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={toggleMenu}
                      className={`py-3 px-4 rounded-lg transition-colors ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-500/20"
                          : "text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                      }`}
                    >
                      {link.name}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Additional Mobile Menu Items */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                  Quick Actions
                </h3>
                <button className="w-full py-3 px-4 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-stone-800 transition-all text-sm font-bold">
                  ⌘K Search
                </button>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                <p className="mb-2">Developer Technology Intelligence</p>
                <p>Free & Open Source</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
