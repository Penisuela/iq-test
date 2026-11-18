"use client";

import { useEffect } from "react";

// Когда страница долистана до футера, красит область «пружины» под ним в цвет футера,
// чтобы при оттягивании вниз не было светлой полосы. Наверху страницы фон остаётся светлым.
// Safari берёт цвет «пружины» из фона body, поэтому меняем именно его;
// сама страница от этого не темнеет: её светлый фон лежит на обёртке в layout.
export function OverscrollTint() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const update = () => {
      const nearBottom =
        window.scrollY > 0 && window.scrollY + window.innerHeight >= root.scrollHeight - 200;
      body.style.backgroundColor = nearBottom ? "var(--color-foreground)" : "";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      body.style.backgroundColor = "";
    };
  }, []);

  return null;
}
