import type { ReactNode } from "react";
import {
  Bike,
  Bookmark,
  Circle,
  CircleDot,
  Disc,
  Dumbbell,
  Feather,
  Flower2,
  Footprints,
  Goal,
  Mountain,
  MountainSnow,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  ME_ID,
  type Family,
  type Person,
  type ResolvedActivity,
  type SportId,
  formatWhen,
  getPerson,
  nowDate,
  sportById,
  spotCopy,
  toneOf,
} from "@/lib/dalian/model";
import { useDalian } from "@/lib/dalian/store";

const ICONS: Record<SportId, LucideIcon> = {
  run: Footprints,
  ride: Bike,
  swim: Waves,
  hike: Mountain,
  basketball: CircleDot,
  badminton: Feather,
  tennis: Circle,
  soccer: Goal,
  frisbee: Disc,
  yoga: Flower2,
  gym: Dumbbell,
  climb: MountainSnow,
};

const FAMILY_BG: Record<Family, string> = {
  ink: "bg-ink",
  clay: "bg-clay-hot",
  court: "bg-court",
};

const TONE_BG: Record<Family, string> = {
  ink: "bg-ink text-sheet",
  clay: "bg-clay text-sheet",
  court: "bg-court text-sheet",
};

export function sportIcon(id: SportId) {
  return ICONS[id];
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ink" | "ghost" | "soft";
}) {
  return (
    <button
      type={type}
      className={cn(
        "tap inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        "disabled:opacity-40",
        variant === "primary" && "bg-clay text-sheet hover:bg-clay-deep",
        variant === "ink" && "bg-ink text-sheet hover:bg-ink-soft",
        variant === "ghost" && "border border-line bg-sheet text-ink hover:border-ink",
        variant === "soft" && "bg-clay-soft text-clay hover:bg-clay-soft",
        className,
      )}
      {...props}
    />
  );
}

export function Chip({
  on,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { on?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      className={cn(
        "tap shrink-0 min-h-11 rounded-full border px-3 text-sm",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        on ? "border-ink bg-ink text-sheet" : "border-line bg-sheet text-ink hover:border-ink-soft",
        className,
      )}
      {...props}
    />
  );
}

export function Avatar({
  person,
  size = "md",
}: {
  person: Pick<Person, "id" | "name">;
  size?: "sm" | "md" | "lg";
}) {
  const tone = toneOf(person.id);
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full font-medium",
        TONE_BG[tone],
        size === "sm" && "size-8 text-xs",
        size === "md" && "size-10 text-sm",
        size === "lg" && "size-16 text-xl font-serif",
      )}
      aria-hidden
    >
      {person.name.slice(0, 1)}
    </span>
  );
}

export function AvatarStack({ ids, me }: { ids: string[]; me: Parameters<typeof getPerson>[1] }) {
  const shown = ids.slice(0, 4);
  const extra = ids.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((id, index) => (
        <span key={id} className={cn("rounded-full ring-2 ring-sheet", index > 0 && "-ml-2")}>
          <Avatar person={getPerson(id, me)} size="sm" />
        </span>
      ))}
      {extra > 0 && <span className="ml-2 text-sm text-muted tabular-nums">+{extra}</span>}
    </div>
  );
}

export function SportMark({ sport, className }: { sport: SportId; className?: string }) {
  const meta = sportById(sport);
  const Icon = ICONS[sport];
  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-2xl text-sheet",
        FAMILY_BG[meta.family],
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
    </span>
  );
}

export function SportBand({
  sport,
  when,
  tall,
}: {
  sport: SportId;
  when?: { day: string; hm: string };
  tall?: boolean;
}) {
  const meta = sportById(sport);
  const Icon = ICONS[sport];
  return (
    <div className={cn("relative overflow-hidden px-4 text-sheet", FAMILY_BG[meta.family], tall ? "py-6" : "py-4")}>
      <span
        aria-hidden
        className="pointer-events-none absolute -right-1 bottom-[-0.85rem] font-serif text-7xl leading-none text-sheet/15"
      >
        {meta.name}
      </span>
      <div className="relative flex items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="size-5" strokeWidth={1.75} aria-hidden />
          <span className="font-serif text-xl leading-none">{meta.name}</span>
        </div>
        {when && (
          <div className="text-right">
            <p className="font-serif text-4xl leading-none tabular-nums">{when.hm}</p>
            <p className="mt-1 text-sm text-sheet/85">{when.day}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SpotPill({ activity }: { activity: ResolvedActivity }) {
  const spot = spotCopy(activity, nowDate());
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-sm",
        spot.hot ? "bg-clay-soft text-clay" : "bg-paper text-ink-soft",
      )}
    >
      {spot.label}
    </span>
  );
}

export function MetaPills({ activity }: { activity: ResolvedActivity }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="rounded-full bg-paper px-2.5 py-1 text-sm text-ink-soft">{activity.level}</span>
      <span className="rounded-full bg-paper px-2.5 py-1 text-sm text-ink-soft">{activity.fee}</span>
      <SpotPill activity={activity} />
    </div>
  );
}

export function ActivityRow({ activity }: { activity: ResolvedActivity }) {
  const me = useDalian((s) => s.me);
  const selectedId = useDalian((s) => s.selectedActivityId);
  const select = useDalian((s) => s.selectActivity);
  const joined = useDalian((s) => s.joins.includes(activity.id));
  const host = getPerson(activity.hostId, me);
  const when = formatWhen(new Date(activity.startsAt), nowDate());
  const spot = spotCopy(activity, nowDate());
  const selected = selectedId === activity.id;
  return (
    <button
      type="button"
      onClick={() => select(activity.id)}
      className={cn(
        "tap flex w-full items-center gap-3 rounded-2xl border bg-sheet px-3 py-3 text-left",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        selected ? "border-ink" : "border-line hover:border-ink-soft",
      )}
    >
      <SportMark sport={activity.sport} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-muted tabular-nums">
            {when.full}
            {activity.hostId === ME_ID ? " · 我发起" : ` · ${host.name}`}
          </span>
          <span className={cn("shrink-0 text-sm", joined ? "text-court" : spot.hot ? "text-clay" : "text-muted")}>
            {joined ? "已加入" : spot.label}
          </span>
        </span>
        <span className="mt-0.5 block truncate font-serif text-lg leading-snug text-ink">{activity.title}</span>
        <span className="mt-0.5 block truncate text-sm text-muted">
          {activity.area} · {activity.place}
        </span>
      </span>
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}

export const fieldClass =
  "min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-base text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function SaveButton({ id }: { id: string }) {
  const on = useDalian((s) => s.saves.includes(id));
  const toggle = useDalian((s) => s.toggleSave);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "取消收藏" : "收藏这场"}
      onClick={() => toggle(id)}
      className={cn(
        "tap grid size-11 place-items-center rounded-full border border-line bg-sheet",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        on ? "border-clay text-clay" : "text-ink",
      )}
    >
      <Bookmark className={cn("size-5", on && "fill-current")} />
    </button>
  );
}
