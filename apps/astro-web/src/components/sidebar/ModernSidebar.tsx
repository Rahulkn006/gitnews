import {
  BookmarkSimple,
  Brain,
  Buildings,
  CaretDown,
  ChartBar,
  Gear,
  GraduationCap,
  Lightbulb,
  Lightning,
  LinkSimple,
  List,
  Monitor,
  Moon,
  RocketLaunch,
  Scales,
  Storefront,
  Sun,
  Target,
  TrendUp,
  User,
  X,
} from "@phosphor-icons/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  active?: boolean;
}

function SidebarItem({
  icon: Icon,
  label,
  href = "#",
  active = false,
}: SidebarItemProps) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
        active
          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 font-bold border border-emerald-100 dark:border-transparent"
          : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50 border border-transparent"
      }`}
    >
      <Icon weight={active ? "fill" : "duotone"} className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}

function SidebarSection({
  title,
  icon: TitleIcon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2 border-b border-stone-200 dark:border-stone-800/50 pb-2 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors group"
      >
        <div className="flex items-center gap-2">
          {TitleIcon && (
            <TitleIcon weight="duotone" className="w-4 h-4 text-emerald-500" />
          )}
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
            {title}
          </span>
        </div>
        <CaretDown
          weight="bold"
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-1"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 px-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ModernSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Close on escape key and click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent immediate close from click outside
          setIsOpen(true);
        }}
        className="p-2 -ml-2 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        aria-label="Open sidebar"
      >
        <List weight="bold" className="w-6 h-6" />
      </button>

      {/* Sidebar Drawer - Solid Background, No Blur Overlay */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-[100vh] z-[9999] w-[320px] bg-white dark:bg-[#050505] border-r border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-[120px] flex flex-col justify-center px-6 border-b border-stone-200 dark:border-stone-800 shrink-0 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-1.5 rounded-md text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
          <div>
            <div className="font-serif font-black text-2xl text-stone-900 dark:text-white tracking-tighter flex items-center gap-2">
              <svg
                className="w-6 h-6 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4h-2m2 0h-3m3 0V9m-3 3h3m-3 3h3m-3 3h3M9 17h1m-1-3h1m-1-3h1m-1-3h1"
                />
              </svg>
              GitNews.
            </div>
            <div className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-500 mt-2">
              Developer Intelligence
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <SidebarSection title="Olla AI" icon={Brain} defaultOpen={true}>
            <SidebarItem
              icon={Scales}
              label="Compare Repositories"
              href="/olla/compare"
              active={currentPath === "/olla/compare"}
            />
            <SidebarItem
              icon={BookmarkSimple}
              label="Saved Repositories"
              href="/olla/saved"
              active={currentPath === "/olla/saved"}
            />
            <SidebarItem
              icon={Buildings}
              label="Top Company Repos"
              href="/olla/company-repos"
              active={currentPath === "/olla/company-repos"}
            />
          </SidebarSection>

          <SidebarSection
            title="Learning Hub"
            icon={GraduationCap}
            defaultOpen={true}
          >
            <SidebarItem
              icon={Target}
              label="Interview Prep"
              href="/learning/interview"
              active={currentPath === "/learning/interview"}
            />
            <SidebarItem
              icon={Lightbulb}
              label="Project Ideas"
              href="/learning/projects"
              active={currentPath === "/learning/projects"}
            />
            <SidebarItem
              icon={LinkSimple}
              label="Similar Repositories"
              href="/learning/similar"
              active={currentPath === "/learning/similar"}
            />
          </SidebarSection>

          <SidebarSection
            title="Developer Market"
            icon={ChartBar}
            defaultOpen={false}
          >
            <SidebarItem
              icon={Storefront}
              label="Open Source Market"
              href="/market/open-source"
              active={currentPath === "/market/open-source"}
            />
            <SidebarItem
              icon={TrendUp}
              label="GitHub Market Index"
              href="/market/index"
              active={currentPath === "/market/index"}
            />
            <SidebarItem
              icon={RocketLaunch}
              label="New Releases"
              href="/market/releases"
              active={currentPath === "/market/releases"}
            />
            <SidebarItem
              icon={Lightning}
              label="Signals"
              href="/market/signals"
              active={currentPath === "/market/signals"}
            />
          </SidebarSection>

          <SidebarSection title="My Space" icon={User} defaultOpen={false}>
            <SidebarItem
              icon={User}
              label="Profile"
              href="/space/profile"
              active={currentPath === "/space/profile"}
            />
            <SidebarItem
              icon={Gear}
              label="Settings"
              href="/space/settings"
              active={currentPath === "/space/settings"}
            />
          </SidebarSection>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 shrink-0">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
              <button
                className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
                title="Light Theme"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
                title="Dark Theme"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
                title="System Theme"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            <a
              href="https://github.com/gitnews"
              className="text-[10px] font-mono font-bold tracking-widest uppercase text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              v3.0.0
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
