import { CircleUser, Compass, MessageCircle, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";
import { ME_ID, isPast, nowDate } from "@/lib/dalian/model";
import { useDalian, type Tab } from "@/lib/dalian/store";
import { cn } from "@/lib/cn";
import { Discover, useAllActivities } from "@/components/dalian/discover";
import { ActivityPanel } from "@/components/dalian/detail";
import { People, PersonPanel } from "@/components/dalian/people";
import { Inbox } from "@/components/dalian/inbox";
import { Me } from "@/components/dalian/me";
import { Compose } from "@/components/dalian/compose";
import { Avatar, Button } from "@/components/dalian/bits";

const NAV: { id: Tab; label: string; icon: typeof Compass }[] = [
  { id: "discover", label: "发现", icon: Compass },
  { id: "people", label: "搭子", icon: Users },
  { id: "inbox", label: "消息", icon: MessageCircle },
  { id: "me", label: "我的", icon: CircleUser },
];

export function Boot() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-6 text-ink">
      <div>
        <p className="font-serif text-5xl tracking-tight">搭练</p>
        <p className="mt-2 text-muted">东京的运动搭子</p>
      </div>
    </main>
  );
}

export function App() {
  const tab = useDalian((s) => s.tab);
  const setTab = useDalian((s) => s.setTab);
  const detailOpen = useDalian((s) => s.detailOpen);
  const closeDetail = useDalian((s) => s.closeDetail);
  const openCompose = useDalian((s) => s.openCompose);
  const me = useDalian((s) => s.me);
  const unread = useDalian((s) => s.threads.reduce((sum, thread) => sum + (thread.unread ? 1 : 0), 0));
  const activities = useAllActivities();
  const upcoming = activities.filter((activity) => !isPast(activity, nowDate())).length;
  const showSide = tab === "discover" || tab === "people";

  return (
    <div className="app-root">
      <div className="app-frame">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-paper px-4 py-6 md:flex">
          <p className="font-serif text-4xl leading-none tracking-tight">搭练</p>
          <p className="mt-2 text-sm text-muted">一场就够，别建群。</p>
          <p className="mt-4 text-sm text-ink-soft">
            <span className="font-medium text-ink tabular-nums">{upcoming}</span> 场正在约
          </p>
          <Button className="mt-6" onClick={() => openCompose(null)}>
            <Plus className="size-4" />
            发一场
          </Button>
          <nav className="mt-6 space-y-1" aria-label="主导航">
            {NAV.map((item) => (
              <NavButton key={item.id} item={item} active={tab === item.id} unread={item.id === "inbox" ? unread : 0} onClick={() => setTab(item.id)} />
            ))}
          </nav>
          <button type="button" onClick={() => setTab("me")} className="mt-auto flex items-center gap-3 rounded-2xl px-2 py-2 text-left">
            <Avatar person={{ id: ME_ID, name: me.name || "浩" }} />
            <span>
              <span className="block font-medium">{me.name}</span>
              <span className="block text-sm text-muted">{me.area}</span>
            </span>
          </button>
        </aside>

        <main
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col",
            tab === "inbox" ? "overflow-hidden" : "scroll-y",
          )}
        >
          {tab === "inbox" ? (
            <Inbox />
          ) : (
            <div className="px-4 pt-5 pb-24 md:px-8 md:py-8 md:pb-10">
              {tab === "discover" && <Discover />}
              {tab === "people" && <People />}
              {tab === "me" && <Me />}
            </div>
          )}
        </main>

        {showSide && (
          <aside className="hidden min-h-0 w-96 shrink-0 border-l border-line bg-sheet md:flex md:flex-col">
            {tab === "people" ? <PersonPanel /> : <ActivityPanel />}
          </aside>
        )}
      </div>

      <nav className="dock" aria-label="主导航">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "relative flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-sm",
              tab === item.id ? "text-ink" : "text-muted",
            )}
          >
            <item.icon className="size-5" strokeWidth={tab === item.id ? 2.25 : 1.75} />
            {item.label}
            {item.id === "inbox" && unread > 0 && (
              <span className="absolute top-1 right-[30%] size-2 rounded-full bg-clay" />
            )}
          </button>
        ))}
      </nav>

      {detailOpen && showSide && (
        <div className="sheet-full">
          {tab === "people" ? <PersonPanel onBack={closeDetail} /> : <ActivityPanel onBack={closeDetail} />}
        </div>
      )}
      <Compose />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2400,
          style: {
            background: "var(--color-ink)",
            color: "var(--color-sheet)",
            border: "none",
            borderRadius: "999px",
            fontFamily: "var(--font-sans)",
          },
        }}
      />
    </div>
  );
}

function NavButton({
  item,
  active,
  unread,
  onClick,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  unread: number;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "tap flex min-h-11 w-full items-center gap-3 rounded-full px-3 text-sm",
        active ? "bg-ink text-sheet" : "text-ink-soft hover:bg-line",
      )}
    >
      <Icon className="size-4" />
      <span className="flex-1 text-left">{item.label}</span>
      {unread > 0 && (
        <span className={cn("tabular-nums text-sm", active ? "text-sheet" : "text-clay")}>{unread}</span>
      )}
    </button>
  );
}

export function useHydratedClub() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    void Promise.resolve(useDalian.persist.rehydrate()).finally(() => {
      if (live) setReady(true);
    });
    return () => {
      live = false;
    };
  }, []);
  return ready;
}
