import { useState } from "react";
import { toast } from "sonner";
import { ME_ID, SPORTS, type Level, type MeProfile, type SportId, sportById } from "@/lib/dalian/model";
import { useDalian } from "@/lib/dalian/store";
import { useAllActivities } from "@/components/dalian/discover";
import { ActivityRow, Avatar, Button, Chip, fieldClass } from "@/components/dalian/bits";

const LEVELS: Level[] = ["轻松", "进阶", "强度"];

export function Me() {
  const me = useDalian((s) => s.me);
  const update = useDalian((s) => s.updateMe);
  const reset = useDalian((s) => s.reset);
  const openCompose = useDalian((s) => s.openCompose);
  const all = useAllActivities();
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState<MeProfile>(me);

  const going = all.filter((activity) => activity.joinedIds.includes(ME_ID) && activity.hostId !== ME_ID);
  const hosting = all.filter((activity) => activity.hostId === ME_ID);
  const buddies = new Set<string>();
  for (const activity of all) {
    if (!activity.joinedIds.includes(ME_ID)) continue;
    for (const id of activity.joinedIds) if (id !== ME_ID) buddies.add(id);
  }

  function toggleSport(id: SportId) {
    setDraft((current) => ({
      ...current,
      sports: current.sports.includes(id) ? current.sports.filter((item) => item !== id) : [...current.sports, id],
    }));
  }

  function save() {
    update({
      name: draft.name.trim() || me.name,
      area: draft.area.trim() || "东京",
      bio: draft.bio.trim(),
      sports: draft.sports,
      level: draft.level,
    });
    setEdit(false);
    toast("名片已更新");
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-court">我的</p>
          <h1 className="mt-1 font-serif text-4xl leading-none tracking-tight">你的搭练名片</h1>
        </div>
        <Button className="md:hidden" onClick={() => openCompose(null)}>
          发一场
        </Button>
      </header>

      <section className="rounded-card border border-line bg-sheet p-4">
        {edit ? (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted">怎么称呼</span>
              <input
                value={draft.name}
                maxLength={12}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted">常出没</span>
              <input
                value={draft.area}
                maxLength={12}
                onChange={(event) => setDraft({ ...draft, area: event.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted">一句话</span>
              <textarea
                value={draft.bio}
                maxLength={80}
                rows={3}
                onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
                className={`${fieldClass} py-2`}
              />
            </label>
            <div>
              <p className="mb-1.5 text-sm text-muted">会的项目</p>
              <div className="flex flex-wrap gap-2">
                {SPORTS.map((sport) => (
                  <Chip key={sport.id} on={draft.sports.includes(sport.id)} onClick={() => toggleSport(sport.id)}>
                    {sport.name}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-sm text-muted">强度</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((level) => (
                  <Chip key={level} on={draft.level === level} onClick={() => setDraft({ ...draft, level })}>
                    {level}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setEdit(false)}>
                取消
              </Button>
              <Button className="flex-1" onClick={save}>
                完成
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <Avatar person={{ id: ME_ID, name: me.name || "浩" }} size="lg" />
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-3xl leading-none">{me.name}</h2>
              <p className="mt-2 text-sm text-muted">
                {me.area} · {me.level}
              </p>
              <p className="mt-2 text-sm leading-normal text-ink-soft">{me.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {me.sports.map((id) => (
                  <span key={id} className="rounded-full bg-paper px-2.5 py-1 text-sm text-ink-soft">
                    {sportById(id).name}
                  </span>
                ))}
              </div>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setDraft(me);
                  setEdit(true);
                }}
              >
                编辑名片
              </Button>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-3 gap-2">
        <Stat n={going.length + hosting.length} label="要去" />
        <Stat n={buddies.size} label="搭子" />
        <Stat n={hosting.length} label="我发起" />
      </div>

      <section className="space-y-2">
        <h2 className="text-sm text-muted">我要去的</h2>
        {going.length === 0 ? (
          <p className="text-sm text-muted">还没加入。发现页里，差一个人的那场最合适。</p>
        ) : (
          going.map((activity) => <ActivityRow key={activity.id} activity={activity} />)
        )}
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-muted">我发起的</h2>
          <button type="button" className="min-h-11 text-sm text-clay" onClick={() => openCompose(null)}>
            发一场
          </button>
        </div>
        {hosting.length === 0 ? (
          <p className="text-sm text-muted">还没发过。一场邀约就够，不必建群。</p>
        ) : (
          hosting.map((activity) => <ActivityRow key={activity.id} activity={activity} />)
        )}
      </section>

      <div className="border-t border-line pt-4">
        <p className="text-sm text-muted">约练记在这台设备上，换一台不会跟着走。</p>
        <button
          type="button"
          className="mt-2 min-h-11 text-sm text-ink-soft underline decoration-line underline-offset-4"
          onClick={() => {
            reset();
            setEdit(false);
            toast("已回到示例");
          }}
        >
          重置示例
        </button>
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-sheet px-3 py-3">
      <p className="font-serif text-3xl leading-none tabular-nums">{n}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
