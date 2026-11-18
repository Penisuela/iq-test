"use client";

import { useEffect, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { StartLink } from "@/components/StartLink";
import { buttonClass } from "@/components/ui";

// Пока на экране есть одна из этих зон, закреплённая кнопка не нужна.
const ZONES = ["#hero-cta", "#final-cta", "footer"];

// Кнопка старта, закреплённая внизу экрана на телефоне.
export function StickyStart() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setVisible(onScreen.size === 0);
    });
    for (const selector of ZONES) {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition duration-300 md:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <StartLink source="sticky" className={buttonClass}>
        Начать тест
        <ArrowIcon />
      </StartLink>
    </div>
  );
}
