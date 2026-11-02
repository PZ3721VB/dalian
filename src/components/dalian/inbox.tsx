import { ChevronLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ME_ID, formatAgo, getPerson, nowDate } from "@/lib/dalian/model";
import { useDalian } from "@/lib/dalian/store";
import { Avatar } from "@/components/dalian/bits";
import { cn } from "@/lib/cn";

function useSortedThreads() {
  const threads = useDalian((s) => s.threads);
  return [...threads].sort((a, b) => {
    const at = a.messages[a.messages.length - 1]?.at ?? 0;
    const bt = b.messages[b.messages.length - 1]?.at ?? 0;
    return bt - at;
  });
}

export function Inbox() {
  const threads = useSortedThreads();
  const activeId = useDalian((s) => s.activeThreadId);
  const threadOpen = useDalian((s) => s.threadOpen);
  const openThread = useDalian((s) => s.openThread);
  const closeThread = useDalian((s) => s.closeThread);
  const me = useDalian((s) => s.me);
  const active = threads.find((thread) => thread.id === activeId) ?? threads[0] ?? null;

  return (
    <div className="flex h-full min-h-0 flex-col md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <div className="scroll-y min-h-0 flex-1 px-4 py-5 md:border-r md:border-line md:px-4">
        <header className="mb-4">
          <p className="text-sm text-court">消息</p>
          <h1 className="mt-1 font-serif text-4xl leading-none tracking-tight">说一声就行</h1>
        </header>
        {threads.length === 0 ? (
          <p className="text-sm text-muted">还没有对话。加入一场，或去私信一个搭子。</p>
        ) : (
          <ul className="space-y-1">
            {threads.map((thread) => {
              const person = getPerson(thread.personId, me);
              const last = thread.messages[thread.messages.length - 1];
              const on = active?.id === thread.id;
              return (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => openThread(thread.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left",
                      on ? "bg-sheet" : "hover:bg-sheet",
                    )}
                  >
                    <span className="relative">
                      <Avatar person={person} />
                      {thread.unread && (
                        <span className="absolute top-0 right-0 size-2.5 rounded-full bg-clay ring-2 ring-paper" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="font-medium">{person.name}</span>
                        {last && (
                          <span className="shrink-0 text-sm text-muted tabular-nums">
                            {formatAgo(last.at, nowDate().getTime())}
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-sm text-muted">{last?.text ?? "还没开口"}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="hidden min-h-0 md:flex md:flex-col">
        <Conversation threadId={active?.id ?? null} />
      </div>
      {threadOpen && active && (
        <div className="sheet-full">
          <Conversation threadId={active.id} onBack={closeThread} />
        </div>
      )}
    </div>
  );
}

function Conversation({ threadId, onBack }: { threadId: string | null; onBack?: () => void }) {
  const threads = useDalian((s) => s.threads);
  const me = useDalian((s) => s.me);
  const send = useDalian((s) => s.sendMessage);
  const markRead = useDalian((s) => s.markRead);
  const threadOpen = useDalian((s) => s.threadOpen);
  const thread = threads.find((item) => item.id === threadId) ?? null;
  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!thread) return;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if ((desktop || threadOpen) && thread.unread) markRead(thread.id);
  }, [thread, threadOpen, markRead]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread?.messages.length, threadId]);

  if (!thread) {
    return (
      <div className="grid h-full place-items-center px-6 text-center text-muted">加入一场之后，对话会出现在这里。</div>
    );
  }

  const person = getPerson(thread.personId, me);

  return (
    <div className="flex h-full min-h-0 flex-col bg-sheet">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        {onBack && (
          <button type="button" onClick={onBack} className="tap grid size-11 place-items-center" aria-label="返回">
            <ChevronLeft className="size-5" />
          </button>
        )}
        <Avatar person={person} size="sm" />
        <div>
          <p className="font-medium leading-tight">{person.name}</p>
          <p className="text-sm text-muted">{person.area}</p>
        </div>
      </div>
      <div ref={scroller} className="scroll-y flex min-h-0 flex-1 flex-col gap-2 px-4 py-4">
        {thread.messages.length === 0 && <p className="text-sm text-muted">打个招呼，约时间就行。</p>}
        {thread.messages.map((message) => {
          const mine = message.from === ME_ID;
          return (
            <div
              key={message.id}
              className={cn(
                "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-normal",
                mine ? "ml-auto bg-ink text-sheet" : "mr-auto border border-line bg-paper text-ink",
              )}
            >
              <p className="break-words">{message.text}</p>
              <p className={cn("mt-1 text-sm", mine ? "text-sheet/70" : "text-muted")}>
                {formatAgo(message.at, nowDate().getTime())}
              </p>
            </div>
          );
        })}
      </div>
      <form
        className="flex items-center gap-2 border-t border-line p-3"
        onSubmit={(event) => {
          event.preventDefault();
          send(thread.personId, text);
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={`给${person.name}说一声`}
          aria-label="消息"
          maxLength={200}
          className="min-h-11 flex-1 rounded-full border border-line bg-paper px-4 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="发送"
          className="tap grid size-11 place-items-center rounded-full bg-clay text-sheet disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
