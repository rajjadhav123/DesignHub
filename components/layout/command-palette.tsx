"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { BookOpen, Home, Keyboard, Moon, Sun } from "lucide-react";
import { useRef, type ReactNode } from "react";

import { FontCommands } from "@/components/layout/font-commands";
import { IconCommands } from "@/components/layout/icon-commands";
import { GithubIcon } from "@/components/layout/github-icon";
import { useThemeToggle } from "@/components/layout/theme-toggle";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { useHotkey } from "@/hooks/use-hotkeys";
import { studios } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import { useUiStore } from "@/store/ui-store";

// Brand actions read projects and brand stores; load them only when the palette opens.
const BrandCommands = dynamic(() => import("@/components/layout/brand-commands").then((m) => m.BrandCommands), {
  ssr: false,
});

export function CommandPalette({ children }: { children?: ReactNode }) {
  const router = useRouter();
  const open = useUiStore((state) => state.commandOpen);
  const query = useUiStore((state) => state.commandQuery);
  const setOpen = useUiStore((state) => state.setCommandOpen);
  const setQuery = useUiStore((state) => state.setCommandQuery);
  const setShortcutsOpen = useUiStore((state) => state.setShortcutsOpen);
  const { isDark, toggle } = useThemeToggle();
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkey("mod+k", () => setOpen(!open), { allowInInputs: true });
  useHotkey("/", () => setOpen(true));

  function run(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showClose={false}
        className="top-[15vh] max-w-xl translate-y-0 gap-0 overflow-hidden p-0"
        onOpenAutoFocus={(event) => {
          // Radix selects the input's text on focus, which would swallow a handed-off query.
          event.preventDefault();
          const input = inputRef.current;
          if (!input) return;
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">Search tools, fonts, colors and actions.</DialogDescription>
        <Command loop>
          <CommandInput
            ref={inputRef}
            value={query}
            onValueChange={setQuery}
            placeholder="Search fonts, colors, icons..."
          />
          <CommandList>
            <CommandEmpty>No results for “{query}”.</CommandEmpty>
            {children}
            {open ? <FontCommands query={query} onDone={() => setOpen(false)} /> : null}
            {open ? <BrandCommands onDone={() => setOpen(false)} /> : null}
            <CommandGroup heading="Studios">
              <CommandItem value="home start" onSelect={() => run(() => router.push("/"))}>
                <Home />
                Home
                <CommandShortcut>
                  <Kbd>G</Kbd>
                  <Kbd>H</Kbd>
                </CommandShortcut>
              </CommandItem>
              {studios.map((studio) => {
                const Icon = studio.icon;
                return (
                  <CommandItem
                    key={studio.id}
                    value={`${studio.title} ${studio.description}`}
                    onSelect={() => run(() => router.push(studio.href))}
                  >
                    <Icon />
                    {studio.title}
                    <CommandShortcut>
                      <Kbd>G</Kbd>
                      <Kbd>{studio.shortcut.toUpperCase()}</Kbd>
                    </CommandShortcut>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem value="toggle theme dark light mode" onSelect={() => run(toggle)}>
                {isDark ? <Sun /> : <Moon />}
                Switch to {isDark ? "light" : "dark"} theme
                <CommandShortcut>
                  <Kbd>⌥</Kbd>
                  <Kbd>T</Kbd>
                </CommandShortcut>
              </CommandItem>
              <CommandItem value="keyboard shortcuts help" onSelect={() => run(() => setShortcutsOpen(true))}>
                <Keyboard />
                Keyboard shortcuts
                <CommandShortcut>
                  <Kbd>?</Kbd>
                </CommandShortcut>
              </CommandItem>
              <CommandItem
                value="github source code star"
                onSelect={() => run(() => window.open(siteConfig.github, "_blank"))}
              >
                <GithubIcon />
                View source on GitHub
              </CommandItem>
              <CommandItem
                value="roadmap future plans"
                onSelect={() => run(() => window.open(`${siteConfig.github}/blob/main/ROADMAP.md`, "_blank"))}
              >
                <BookOpen />
                Roadmap
              </CommandItem>
            </CommandGroup>
            {/* Last on purpose: its value always contains the whole query, and cmdk keeps groups in
                source order, so anywhere earlier it would be picked over real matches. */}
            {open ? <IconCommands query={query} onDone={() => setOpen(false)} /> : null}
          </CommandList>
          <footer className="flex h-10 items-center gap-4 border-t px-4 text-[11px] text-subtle-foreground">
            <span className="flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <Kbd>↵</Kbd> select
            </span>
            <span className="flex items-center gap-1">
              <Kbd>esc</Kbd> close
            </span>
          </footer>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
