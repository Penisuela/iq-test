"use client";

import { useEffect } from "react";

// Когда страница долистана до футера, красит область «пружины» под ним в цвет футера,
// чтобы при оттягивании вниз не было светлой полосы. Наверху страницы фон остаётся светлым.
export function OverscrollTint() {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const nearBottom =
        window.scrollY > 0 && window.scrollY + window.innerHeight >= root.scrollHeight - 200;
      root.style.backgroundColor = nearBottom ? "var(--color-foreground)" : "";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.style.backgroundColor = "";
    };
  }, []);

  return null;
}
