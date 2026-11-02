import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  ME_ID,
  type ActivityDraft,
  type DayFilter,
  type Lens,
  type MeProfile,
  type ResolvedActivity,
  type SportId,
  type Thread,
  applyJoins,
  defaultMe,
  greetFor,
  INTEREST,
  nowDate,
  pickBuddy,
  resolveAll,
  spotsLeft,
  starterThreads,
  isPast,
} from "@/lib/dalian/model";

export type Tab = "discover" | "people" | "inbox" | "me";
export type JoinResult = "joined" | "left" | "full" | "past" | "missing";

type State = {
  me: MeProfile;
  joins: string[];
  saves: string[];
  created: ResolvedActivity[];
  threads: Thread[];
  tab: Tab;
  sport: SportId | "all";
  day: DayFilter;
  lens: Lens;
  query: string;
  selectedActivityId: string | null;
  selectedPersonId: string | null;
  detailOpen: boolean;
  composeOpen: boolean;
  invitePersonId: string | null;
  activeThreadId: string | null;
  threadOpen: boolean;
  setTab: (tab: Tab) => void;
  setSport: (sport: SportId | "all") => void;
  setDay: (day: DayFilter) => void;
  setLens: (lens: Lens) => void;
  setQuery: (query: string) => void;
  selectActivity: (id: string) => void;
  selectPerson: (id: string) => void;
  closeDetail: () => void;
  openCompose: (personId?: string | null) => void;
  closeCompose: () => void;
  toggleJoin: (id: string) => JoinResult;
  toggleSave: (id: string) => void;
  createActivity: (draft: ActivityDraft) => { buddy: string | null };
  cancelActivity: (id: string) => void;
  openChat: (personId: string) => void;
  openThread: (id: string) => void;
  closeThread: () => void;
  sendMessage: (personId: string, text: string) => void;
  markRead: (id: string) => void;
  updateMe: (me: MeProfile) => void;
  openActivity: (id: string) => void;
  reset: () => void;
};

function uid() {
  return crypto.randomUUID();
}

function withHostGreeting(threads: Thread[], activity: ResolvedActivity) {
  if (activity.hostId === ME_ID) return threads;
  const existing = threads.find((thread) => thread.personId === activity.hostId);
  if (existing?.messages.some((message) => message.activityId === activity.id && message.from === activity.hostId)) {
    return threads;
  }
  const message = {
    id: uid(),
    from: activity.hostId,
    text: greetFor(activity.hostId, activity.title),
    at: Date.now(),
    activityId: activity.id,
  };
  if (!existing) {
    return [{ id: uid(), personId: activity.hostId, unread: true, messages: [message] }, ...threads];
  }
  return threads.map((thread) =>
    thread.id === existing.id ? { ...thread, unread: true, messages: [...thread.messages, message] } : thread,
  );
}

function withBuddyNote(threads: Thread[], personId: string, text: string, activityId: string) {
  const message = { id: uid(), from: personId, text, at: Date.now(), activityId };
  const existing = threads.find((thread) => thread.personId === personId);
  if (!existing) return [{ id: uid(), personId, unread: true, messages: [message] }, ...threads];
  return threads.map((thread) =>
    thread.id === existing.id ? { ...thread, unread: true, messages: [...thread.messages, message] } : thread,
  );
}

const initial = {
  me: defaultMe,
  joins: ["a-run"],
  saves: [] as string[],
  created: [] as ResolvedActivity[],
  threads: starterThreads(),
  tab: "discover" as Tab,
  sport: "all" as const,
  day: "all" as DayFilter,
  lens: "soon" as Lens,
  query: "",
  selectedActivityId: null as string | null,
  selectedPersonId: null as string | null,
  detailOpen: false,
  composeOpen: false,
  invitePersonId: null as string | null,
  activeThreadId: null as string | null,
  threadOpen: false,
};

export const useDalian = create<State>()(
  persist(
    (set, get) => ({
      ...initial,
      setTab: (tab) => set({ tab, detailOpen: false, threadOpen: false, query: "" }),
      setSport: (sport) => set({ sport }),
      setDay: (day) => set({ day }),
      setLens: (lens) => set({ lens }),
      setQuery: (query) => set({ query }),
      selectActivity: (id) => set({ selectedActivityId: id, detailOpen: true, tab: "discover" }),
      selectPerson: (id) => set({ selectedPersonId: id, detailOpen: true, tab: "people" }),
      closeDetail: () => set({ detailOpen: false }),
      openCompose: (personId) => set({ composeOpen: true, invitePersonId: personId ?? null }),
      closeCompose: () => set({ composeOpen: false, invitePersonId: null }),
      toggleJoin: (id) => {
        const state = get();
        const all = applyJoins(resolveAll(state.created, nowDate()), state.joins);
        const activity = all.find((item) => item.id === id);
        if (!activity || activity.hostId === ME_ID) return "missing";
        if (state.joins.includes(id)) {
          set({ joins: state.joins.filter((item) => item !== id) });
          return "left";
        }
        if (isPast(activity, nowDate())) return "past";
        if (spotsLeft(activity) <= 0) return "full";
        set({ joins: [...state.joins, id], threads: withHostGreeting(state.threads, activity) });
        return "joined";
      },
      toggleSave: (id) => {
        const saves = get().saves;
        set({ saves: saves.includes(id) ? saves.filter((item) => item !== id) : [...saves, id] });
      },
      createActivity: (draft) => {
        const id = uid();
        const buddy = pickBuddy(draft.sport, draft.invitePersonId);
        const joinedIds = buddy ? [ME_ID, buddy.id] : [ME_ID];
        const activity: ResolvedActivity = {
          id,
          hostId: ME_ID,
          sport: draft.sport,
          title: draft.title.trim(),
          area: draft.area.trim() || "东京",
          place: draft.place.trim(),
          startsAt: draft.startsAt,
          durationMin: draft.durationMin,
          level: draft.level,
          capacity: draft.capacity,
          fee: draft.fee,
          note: draft.note.trim(),
          joinedIds,
        };
        let threads = get().threads;
        if (buddy) {
          const line = draft.invitePersonId
            ? `想约你：「${activity.title}」，${activity.place}。`
            : (INTEREST[buddy.id] ?? "算我一个。");
          const from = draft.invitePersonId ? ME_ID : buddy.id;
          if (draft.invitePersonId) {
            threads = withBuddyNote(threads, buddy.id, line, id).map((thread) =>
              thread.personId === buddy.id
                ? {
                    ...thread,
                    unread: false,
                    messages: thread.messages.map((message) =>
                      message.activityId === id ? { ...message, from } : message,
                    ),
                  }
                : thread,
            );
            const reply = {
              id: uid(),
              from: buddy.id,
              text: INTEREST[buddy.id] ?? "可以，算我一个。",
              at: Date.now() + 1,
              activityId: id,
            };
            threads = threads.map((thread) =>
              thread.personId === buddy.id ? { ...thread, unread: true, messages: [...thread.messages, reply] } : thread,
            );
          } else {
            threads = withBuddyNote(threads, buddy.id, line, id);
          }
        }
        set({
          created: [activity, ...get().created],
          joins: [...get().joins, id],
          threads,
          selectedActivityId: id,
          tab: "discover",
          detailOpen: true,
          composeOpen: false,
          invitePersonId: null,
          sport: "all",
          day: "all",
          lens: "soon",
          query: "",
        });
        return { buddy: buddy?.name ?? null };
      },
      cancelActivity: (id) => {
        set({
          created: get().created.filter((item) => item.id !== id),
          joins: get().joins.filter((item) => item !== id),
          saves: get().saves.filter((item) => item !== id),
          selectedActivityId: get().selectedActivityId === id ? null : get().selectedActivityId,
        });
      },
      openChat: (personId) => {
        const threads = get().threads;
        const existing = threads.find((thread) => thread.personId === personId);
        if (!existing) {
          const thread: Thread = { id: uid(), personId, unread: false, messages: [] };
          set({
            threads: [thread, ...threads],
            activeThreadId: thread.id,
            threadOpen: true,
            tab: "inbox",
            detailOpen: false,
          });
          return;
        }
        set({ activeThreadId: existing.id, threadOpen: true, tab: "inbox", detailOpen: false });
      },
      openThread: (id) => set({ activeThreadId: id, threadOpen: true, tab: "inbox" }),
      closeThread: () => set({ threadOpen: false }),
      sendMessage: (personId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const message = { id: uid(), from: ME_ID, text: trimmed, at: Date.now() };
        const threads = get().threads;
        const existing = threads.find((thread) => thread.personId === personId);
        if (!existing) {
          const thread: Thread = { id: uid(), personId, unread: false, messages: [message] };
          set({ threads: [thread, ...threads], activeThreadId: thread.id });
          return;
        }
        set({
          activeThreadId: existing.id,
          threads: threads.map((thread) =>
            thread.personId === personId
              ? { ...thread, unread: false, messages: [...thread.messages, message] }
              : thread,
          ),
        });
      },
      markRead: (id) => {
        if (!get().threads.some((thread) => thread.id === id && thread.unread)) return;
        set({
          threads: get().threads.map((thread) => (thread.id === id ? { ...thread, unread: false } : thread)),
        });
      },
      updateMe: (me) => set({ me }),
      openActivity: (id) =>
        set({
          tab: "discover",
          sport: "all",
          day: "all",
          lens: "soon",
          query: "",
          selectedActivityId: id,
          detailOpen: true,
        }),
      reset: () => set({ ...initial, threads: starterThreads() }),
    }),
    {
      name: "dalian-club",
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        me: state.me,
        joins: state.joins,
        saves: state.saves,
        created: state.created,
        threads: state.threads,
      }),
    },
  ),
);
