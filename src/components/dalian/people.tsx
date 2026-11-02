import { ChevronLeft } from "lucide-react";
import { PEOPLE, nowDate, sportById } from "@/lib/dalian/model";
import { useDalian } from "@/lib/dalian/store";
import { useAllActivities } from "@/components/dalian/discover";
import { ActivityRow, Avatar, Button, SportMark } from "@/components/dalian/bits";

function usePeople() {
  const sport = useDalian((s) => s.sport);
  const query = useDalian((s) => s.query);
  const q = query.trim();
  return PEOPLE.filter((person) => {
    if (sport !== "all" && !person.sports.includes(sport)) return false;
    if (!q) return true;
    const blob = `${person.name} ${person.area} ${person.bio} ${person.sports.map((id) => sportById(id).name).join(" ")}`;
    return blob.includes(q);
  });
}

export function People() {
  const people = usePeople();
  const selectedId = useDalian((s) => s.selectedPersonId);
  const select = useDalian((s) => s.selectPerson);
  const me = useDalian((s) => s.me);
  const openChat = useDalian((s) => s.openChat);
  const openCompose = useDalian((s) => s.openCompose);

  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-court">搭子</p>
        <h1 className="mt-1 font-serif text-4xl leading-none tracking-tight">先认识人，再约场</h1>
      </header>
      {people.length === 0 ? (
        <p className="rounded-card border border-dashed border-line bg-sheet px-5 py-10 text-center text-muted">
          这个项目暂时没有人。换一个，或者自己发一场。
        </p>
      ) : (
        <div className="space-y-3">
          {people.map((person) => {
            const shared = person.sports.filter((id) => me.sports.includes(id));
            const selected = selectedId === person.id;
            return (
              <article
                key={person.id}
                className={`rounded-card border bg-sheet ${selected ? "border-ink" : "border-line"}`}
              >
                <button type="button" onClick={() => select(person.id)} className="flex w-full gap-3 px-4 pt-4 text-left">
                  <Avatar person={person} size="lg" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-serif text-2xl leading-none">{person.name}</span>
                      <span className="text-sm text-muted">
                        {person.area} · {person.vibe}
                      </span>
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {person.sports.map((id) => (
                        <span key={id} className="rounded-full bg-paper px-2 py-0.5 text-sm text-ink-soft">
                          {sportById(id).name}
                        </span>
                      ))}
                      <span className="rounded-full bg-paper px-2 py-0.5 text-sm text-ink-soft">{person.level}</span>
                    </span>
                    <span className="mt-2 block text-sm leading-normal text-ink-soft">{person.bio}</span>
                    {shared.length > 0 && (
                      <span className="mt-2 block text-sm text-court">
                        你们都练{shared.map((id) => sportById(id).name).join("、")}
                      </span>
                    )}
                  </span>
                </button>
                <div className="flex gap-2 px-4 py-3">
                  <Button variant="ghost" className="flex-1" onClick={() => openChat(person.id)}>
                    私信
                  </Button>
                  <Button className="flex-1" onClick={() => openCompose(person.id)}>
                    约一场
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PersonPanel({ onBack }: { onBack?: () => void }) {
  const me = useDalian((s) => s.me);
  const selectedId = useDalian((s) => s.selectedPersonId);
  const people = usePeople();
  const person = people.find((item) => item.id === selectedId) ?? people[0];
  const activities = useAllActivities().filter(
    (activity) => person && (activity.hostId === person.id || activity.joinedIds.includes(person.id)),
  );
  const openChat = useDalian((s) => s.openChat);
  const openCompose = useDalian((s) => s.openCompose);

  if (!person) {
    return (
      <div className="grid h-full place-items-center px-6 text-center text-muted">换个筛选再看看。</div>
    );
  }

  const shared = person.sports.filter((id) => me.sports.includes(id));

  return (
    <div className="scroll-y h-full min-h-0 bg-sheet">
      {onBack && (
        <button type="button" onClick={onBack} className="tap flex min-h-11 items-center gap-1 px-3 text-sm">
          <ChevronLeft className="size-4" />
          返回
        </button>
      )}
      <div className="space-y-5 px-4 py-5">
        <div className="flex items-center gap-3">
          <Avatar person={person} size="lg" />
          <div>
            <h2 className="font-serif text-3xl leading-none">{person.name}</h2>
            <p className="mt-2 text-sm text-muted">
              {person.area} · {person.vibe} · {person.level}
            </p>
          </div>
        </div>
        <p className="text-base leading-normal text-ink-soft">{person.bio}</p>
        <div className="flex flex-wrap gap-2">
          {person.sports.map((id) => (
            <span key={id} className="inline-flex items-center gap-2 rounded-full border border-line bg-paper py-1 pr-3 pl-1">
              <SportMark sport={id} className="size-8 rounded-full" />
              <span className="text-sm">{sportById(id).name}</span>
            </span>
          ))}
        </div>
        {shared.length > 0 && (
          <p className="rounded-2xl bg-court-soft px-3 py-2 text-sm text-court">
            你们都练{shared.map((id) => sportById(id).name).join("、")}
          </p>
        )}
        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={() => openChat(person.id)}>
            私信
          </Button>
          <Button className="flex-1" onClick={() => openCompose(person.id)}>
            约一场
          </Button>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm text-muted">最近出现在</h3>
          {activities.slice(0, 4).map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
          {activities.length === 0 && <p className="text-sm text-muted">还没挂在某一场上。</p>}
        </div>
        <p className="text-sm text-muted">{formatQuiet(nowDate())}</p>
      </div>
    </div>
  );
}

function formatQuiet(now: Date) {
  const h = now.getHours();
  if (h < 11) return "早场的人已经在路上";
  if (h < 18) return "下午的场次还约得动";
  return "晚上的馆，灯还亮着";
}
