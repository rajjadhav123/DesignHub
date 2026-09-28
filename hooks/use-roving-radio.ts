"use client";

import { useEffect, useRef } from "react";

const RADIO = '[role="radio"]';

function radiosIn(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(RADIO)].filter(
    (radio) => !radio.hasAttribute("disabled") && radio.getAttribute("aria-disabled") !== "true",
  );
}

/**
 * Keyboard behavior for custom radio groups (the ARIA radio group pattern): one tab stop for
 * the whole group, arrow keys move the selection, Home and End jump to the ends. Attach the
 * ref to the element that contains every `role="radio"` button, even when they are split
 * into several labelled `radiogroup` sections.
 */
export function useRovingRadio<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  // Keep exactly one radio tabbable: the checked one, or the first.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const radios = radiosIn(root);
    const current = radios.find((radio) => radio.getAttribute("aria-checked") === "true") ?? radios[0];
    radios.forEach((radio) => (radio.tabIndex = radio === current ? 0 : -1));
  });

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>(RADIO) : null;
      if (!target || !root.contains(target) || event.altKey || event.ctrlKey || event.metaKey) return;
      const radios = radiosIn(root);
      const index = radios.indexOf(target);
      if (index === -1) return;
      let next: number;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % radios.length;
      else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + radios.length) % radios.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = radios.length - 1;
      else return;
      event.preventDefault();
      const radio = radios[next];
      if (!radio) return;
      radio.focus();
      // Moving selects, as in native radio groups.
      radio.click();
    };
    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, []);

  return ref;
}
