import { createFileRoute } from "@tanstack/react-router";
import { App, Boot, useHydratedClub } from "@/components/dalian/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const ready = useHydratedClub();
  if (!ready) return <Boot />;
  return <App />;
}
