import { ChevronLeft, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ME_ID,
  formatDuration,
  formatWhen,
  getPerson,
  isPast,
  nowDate,
  spotsLeft,
} from "@/lib/dalian/model";
import { useDalian } from "@/lib/dalian/store";
import { useAllActivities, useFilteredActivities, joinActivity } from "@/components/dalian/discover";
import { Avatar, Button, MetaPills, SaveButton, SportBand } from "@/components/dalian/bits";

export function ActivityPanel({ onBack }: { onBack?: () => void }) {
  const me = useDalian((s) => s.me);
  const joins = useDalian((s) => s.joins);
  const selectedId = useDalian((s) => s.selectedActivityId);
  const all = useAllActivities();
  const filtered = useFilteredActivities();
  const cancel = useDalian((s) => s.cancelActivity);
  const openChat = useDalian((s) => s.openChat);
  const selectPerson = useDalian((s) => s.selectPerson);
  const activity = all.find((item) => item.id === selectedId) ?? filtered[0] ?? null;
  const [arm, setArm] = useState(false);

  useEffect(() => {
    setArm(false);
  }, [activity?.id]);

  if (!activity) {
    return (
      <div className="grid h-full place-items-center px-6 text-center">
        <p className="font-serif text-2xl text-ink">选一场，或者发一场</p>
      </div>
    );
  }

  const host = getPerson(activity.hostId, me);
  const when = formatWhen(new Date(activity.startsAt), nowDate());
  const joined = joins.includes(activity.id);
  const past = isPast(activity, nowDate());
  const mine = activity.hostId === ME_ID;
  const full = spotsLeft(activity) <= 0 && !joined;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-sheet">
      {onBack && (
        <button type="button" onClick={onBack} className="tap flex min-h-11 items-center gap-1 px-3 text-sm text-ink">
          <ChevronLeft className="size-4" />
          返回
        </button>
      )}
      <div className="scroll-y min-h-0 flex-1">
        <SportBand sport={activity.sport} when={when} tall />
        <div className="space-y-5 px-4 py-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-3xl leading-tight text-ink">{activity.title}</h2>
            <SaveButton id={activity.id} />
          </div>
          <MetaPills activity={activity} />
          <div className="space-y-2 text-sm text-ink-soft">
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-muted" aria-hidden />
              {activity.area} · {activity.place}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-muted" aria-hidden />
              {when.full} · {formatDuration(activity.durationMin)}
            </p>
          </div>
          <p className="text-base leading-normal text-ink-soft">{activity.note}</p>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3 py-2">
            <button
              type="button"
              onClick={() => {
                if (!mine) selectPerson(host.id);
              }}
              className="flex min-h-11 min-w-0 flex-1 items-center gap-3 text-left"
            >
              <Avatar person={host} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-muted">{mine ? "你发起的" : "发起人"}</span>
                <span className="block font-medium text-ink">{host.name}</span>
              </span>
            </button>
            {!mine && (
              <button type="button" className="min-h-11 px-2 text-sm text-clay" onClick={() => openChat(host.id)}>
                私信
              </button>
            )}
          </div>
          <div>
            <h3 className="text-sm text-muted">要去的人 · {activity.joinedIds.length}/{activity.capacity}</h3>
            <ul className="mt-2 divide-y divide-line">
              {activity.joinedIds.map((id) => {
                const person = getPerson(id, me);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => (id === ME_ID ? useDalian.getState().setTab("me") : selectPerson(id))}
                      className="flex min-h-12 w-full items-center gap-3 py-2 text-left"
                    >
                      <Avatar person={person} size="sm" />
                      <span className="flex-1 text-ink">{person.name}</span>
                      {id === activity.hostId && <span className="text-sm text-muted">发起</span>}
                      {id === ME_ID && <span className="text-sm text-court">你</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-line bg-sheet p-4">
        {mine ? (
          <Button
            variant={arm ? "primary" : "ghost"}
            className="w-full"
            onClick={() => {
              if (!arm) {
                setArm(true);
                return;
              }
              cancel(activity.id);
              toast("这场已取消");
            }}
          >
            {arm ? "再点一次，确认取消" : "取消这场"}
          </Button>
        ) : (
          <Button
            variant={joined ? "ghost" : "primary"}
            className="w-full"
            disabled={past || full}
            onClick={() => joinActivity(activity.id, activity.title)}
          >
            {past ? "已结束" : joined ? "去不了了" : full ? "满员" : "算我一个"}
          </Button>
        )}
      </div>
    </div>
  );
}
