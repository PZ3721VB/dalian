import { Search } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  ME_ID,
  SPORTS,
  applyJoins,
  formatWhen,
  getPerson,
  greeting,
  isPast,
  matchDay,
  nowDate,
  resolveAll,
  sortActivities,
  sportById,
  spotsLeft,
} from "@/lib/dalian/model";
import { useDalian, type JoinResult } from "@/lib/dalian/store";
import {
  ActivityRow,
  AvatarStack,
  Button,
  Chip,
  MetaPills,
  SaveButton,
  SportBand,
  fieldClass,
} from "@/components/dalian/bits";

export function useAllActivities() {
  const created = useDalian((s) => s.created);
  const joins = useDalian((s) => s.joins);
  return useMemo(() => applyJoins(resolveAll(created, nowDate()), joins), [created, joins]);
}

export function useFilteredActivities() {
  const all = useAllActivities();
  const sport = useDalian((s) => s.sport);
  const day = useDalian((s) => s.day);
  const lens = useDalian((s) => s.lens);
  const query = useDalian((s) => s.query);
  const saves = useDalian((s) => s.saves);
  const me = useDalian((s) => s.me);
  return useMemo(() => {
    const now = nowDate();
    let list = all;
    if (sport !== "all") list = list.filter((activity) => activity.sport === sport);
    if (day !== "all") list = list.filter((activity) => matchDay(activity, day, now));
    if (lens === "saved") list = list.filter((activity) => saves.includes(activity.id));
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((activity) => {
        const host = getPerson(activity.hostId, me).name;
        const blob = `${activity.title} ${activity.place} ${activity.area} ${activity.note} ${host} ${sportById(activity.sport).name}`;
        return blob.toLowerCase().includes(q);
      });
    }
    return sortActivities(list, now, lens === "open" ? "open" : "soon");
  }, [all, sport, day, lens, query, saves, me]);
}

function tell(result: JoinResult, title: string) {
  if (result === "joined") toast(`算你一个 · ${title}`);
  if (result === "left") toast("已退出这场");
  if (result === "full") toast("满员了，先收藏着");
  if (result === "past") toast("这场已经开始了");
}

export function joinActivity(id: string, title: string) {
  tell(useDalian.getState().toggleJoin(id), title);
}

function Featured({ activity }: { activity: ReturnType<typeof useFilteredActivities>[number] }) {
  const me = useDalian((s) => s.me);
  const joins = useDalian((s) => s.joins);
  const select = useDalian((s) => s.selectActivity);
  const host = getPerson(activity.hostId, me);
  const when = formatWhen(new Date(activity.startsAt), nowDate());
  const joined = joins.includes(activity.id);
  const past = isPast(activity, nowDate());
  const mine = activity.hostId === ME_ID;
  const full = spotsLeft(activity) <= 0 && !joined;
  return (
    <article className="rise overflow-hidden rounded-card border border-line bg-sheet shadow-card">
      <button type="button" onClick={() => select(activity.id)} className="block w-full text-left">
        <SportBand sport={activity.sport} when={when} tall />
        <div className="space-y-3 px-4 pt-4">
          <div>
            <h2 className="font-serif text-2xl leading-tight text-ink">{activity.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {activity.area} · {activity.place}
              {mine ? " · 我发起" : ` · ${host.name} 发起`}
            </p>
          </div>
          <MetaPills activity={activity} />
        </div>
      </button>
      <div className="flex items-center justify-between gap-3 px-4 py-4">
          <AvatarStack ids={activity.joinedIds} me={me} />
          <div className="flex items-center gap-2">
            <SaveButton id={activity.id} />
            {mine ? null : (
              <Button
                variant={joined ? "ghost" : "primary"}
                disabled={past || full}
                onClick={() => joinActivity(activity.id, activity.title)}
              >
                {past ? "已结束" : joined ? "去不了了" : full ? "满员" : "算我一个"}
              </Button>
            )}
          </div>
        </div>
    </article>
  );
}

export function Discover() {
  const sport = useDalian((s) => s.sport);
  const day = useDalian((s) => s.day);
  const lens = useDalian((s) => s.lens);
  const query = useDalian((s) => s.query);
  const setSport = useDalian((s) => s.setSport);
  const setDay = useDalian((s) => s.setDay);
  const setLens = useDalian((s) => s.setLens);
  const setQuery = useDalian((s) => s.setQuery);
  const openCompose = useDalian((s) => s.openCompose);
  const activities = useFilteredActivities();
  const hello = greeting(nowDate());
  const [featured, ...rest] = activities;

  return (
    <div className="space-y-5">
      <header className="rise flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-court">{hello.eyebrow}</p>
          <h1 className="mt-1 font-serif text-4xl leading-none tracking-tight text-ink md:text-5xl">{hello.line}</h1>
        </div>
        <Button className="md:hidden" onClick={() => openCompose(null)}>
          发一场
        </Button>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜球场、人名、皇居…"
          aria-label="搜索活动"
          className={`${fieldClass} pl-9`}
        />
      </div>

      <div className="scroll-x -mx-4 flex gap-2 px-4 md:mx-0 md:px-0">
        <Chip on={sport === "all"} onClick={() => setSport("all")}>
          全部
        </Chip>
        {SPORTS.map((item) => (
          <Chip key={item.id} on={sport === item.id} onClick={() => setSport(item.id)}>
            {item.name}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "全部日子"],
            ["today", "今天"],
            ["tomorrow", "明天"],
            ["weekend", "周末"],
          ] as const
        ).map(([id, label]) => (
          <Chip key={id} on={day === id} onClick={() => setDay(id)}>
            {label}
          </Chip>
        ))}
        <Chip on={lens === "open"} onClick={() => setLens(lens === "open" ? "soon" : "open")}>
          还缺人
        </Chip>
        <Chip on={lens === "saved"} onClick={() => setLens(lens === "saved" ? "soon" : "saved")}>
          收藏
        </Chip>
      </div>

      {featured ? (
        <div className="space-y-3">
          <Featured activity={featured} />
          {rest.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm text-muted">其他场次 · {rest.length}</h2>
              {rest.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-card border border-dashed border-line bg-sheet px-5 py-10 text-center">
          <p className="font-serif text-2xl text-ink">这会儿没有这场</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted">换个项目，或者你来发一场。缺的人往往就在附近。</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setSport("all");
                setDay("all");
                setLens("soon");
                setQuery("");
              }}
            >
              清除筛选
            </Button>
            <Button onClick={() => openCompose(null)}>发一场</Button>
          </div>
        </div>
      )}
    </div>
  );
}
