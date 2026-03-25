import type { ReactNode } from "react";
import { Header } from "../common/Header";

type AppLayoutProps = {
  isAuthenticated: boolean;
  onAuthClick: () => void;
  children: ReactNode;
};

export function AppLayout({ isAuthenticated, onAuthClick, children }: AppLayoutProps) {
  return (
    <div className="page">
      <Header isAuthenticated={isAuthenticated} onAuthClick={onAuthClick} />
      <main className="app">{children}</main>
    </div>
  );
}
