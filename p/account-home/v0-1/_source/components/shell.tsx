"use client";

import { StoreProvider } from "@/lib/store";
import { Header, PrototypeBar } from "./top";
import { Sheets } from "./sheets";
import { EveChat, EveFab } from "./eve";
import { Toasts } from "./ui";
import { Footer } from "./footer";

/** App chrome shared by Home and My Plan. The store lives here, so state carries across tabs. */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <PrototypeBar />
      <Header />
      <div className="pb-20">{children}</div>
      <Footer />
      <EveFab />
      <EveChat />
      <Sheets />
      <Toasts />
    </StoreProvider>
  );
}
