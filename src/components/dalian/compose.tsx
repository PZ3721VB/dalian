import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  PLACE_PRESETS,
  SPORTS,
  type Fee,
  type Level,
  type SportId,
  getPerson,
  nowDate,
  toDateInput,
} from "@/lib/dalian/model";
import { useDalian } from "@/lib/dalian/store";
import { Button, Chip, fieldClass } from "@/components/dalian/bits";

const LEVELS: Level[] = ["轻松", "进阶", "强度"];
const FEES: Fee[] = ["免费", "AA"];
const DURATIONS = [45, 60, 90, 120, 180];

export function Compose() {
  const open = useDalian((s) => s.composeOpen);
  const inviteId = useDalian((s) => s.invitePersonId);
  const close = useDalian((s) => s.closeCompose);
  const create = useDalian((s) => s.createActivity);
  const me = useDalian((s) => s.me);
  const invite = inviteId ? getPerson(inviteId, me) : null;

  const [sport, setSport] = useState<SportId>("run");
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("东京");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [duration, setDuration] = useState(60);
  const [level, setLevel] = useState<Level>("轻松");
  const [capacity, setCapacity] = useState(4);
  const [fee, setFee] = useState<Fee>("免费");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [preset, setPreset] = useState("");

  useEffect(() => {
    if (!open) return;
    const person = inviteId ? getPerson(inviteId, useDalian.getState().me) : null;
    const base = new Date(nowDate());
    base.setDate(base.getDate() + 1);
    base.setHours(19, 0, 0, 0);
    setSport(person?.sports[0] ?? "run");
    setTitle("");
    setArea(person?.area ?? "东京");
    setPlace("");
    setPreset("");
    setDate(toDateInput(base));
    setTime("19:00");
    setDuration(60);
    setLevel(person?.level ?? "轻松");
    setCapacity(4);
    setFee("免费");
    setNote(person && person.id !== "me" ? `想跟${person.name}一起。` : "");
    setError("");
  }, [open, inviteId]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanPlace = place.trim();
    if (cleanTitle.length < 2) {
      setError("给这场起个名字");
      return;
    }
    if (!cleanPlace) {
      setError("写上集合地点");
      return;
    }
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
      setError("时间和日期要填全");
      return;
    }
    const startsAt = new Date(year, month - 1, day, hour, minute, 0, 0).getTime();
    if (startsAt <= Date.now()) {
      setError("这个时间已经过了");
      return;
    }
    const { buddy } = create({
      sport,
      title: cleanTitle,
      area,
      place: cleanPlace,
      startsAt,
      durationMin: duration,
      level,
      capacity,
      fee,
      note,
      invitePersonId: invite && invite.id !== "me" ? invite.id : null,
    });
    if (invite && invite.id !== "me") toast(buddy ? `已私信 ${buddy}` : "发出去了");
    else if (buddy) toast(`发出去了。${buddy} 先占了一个名额`);
    else toast("发出去了，等人来");
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content className="compose-panel z-60 p-5 focus:outline-none">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="font-serif text-3xl leading-none">
                {invite && invite.id !== "me" ? `约 ${invite.name}` : "发一场"}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-muted">
                写清楚时间和地点，别人才能来。
              </Dialog.Description>
            </div>
            <Dialog.Close className="tap grid size-11 place-items-center rounded-full border border-line" aria-label="关闭">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {SPORTS.map((item) => (
                <Chip key={item.id} on={sport === item.id} onClick={() => setSport(item.id)} className="px-1">
                  {item.name}
                </Chip>
              ))}
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted">这场叫什么</span>
              <input
                value={title}
                maxLength={32}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="比如：皇居轻松六公里"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted">常去的地方</span>
              <select
                className={fieldClass}
                value={preset}
                onChange={(event) => {
                  const value = event.target.value;
                  setPreset(value);
                  const next = PLACE_PRESETS[Number(value)];
                  if (!next) return;
                  setArea(next.area);
                  setPlace(next.place);
                }}
              >
                <option value="">自己填，或选一个</option>
                {PLACE_PRESETS.map((preset, index) => (
                  <option key={preset.place} value={index}>
                    {preset.area} · {preset.place}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">区域</span>
                <input value={area} maxLength={12} onChange={(event) => setArea(event.target.value)} className={fieldClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">集合点</span>
                <input
                  value={place}
                  maxLength={24}
                  onChange={(event) => setPlace(event.target.value)}
                  placeholder="车站、球场门口"
                  className={fieldClass}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">日期</span>
                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={fieldClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">时间</span>
                <input type="time" value={time} onChange={(event) => setTime(event.target.value)} className={fieldClass} />
              </label>
            </div>
            <div>
              <p className="mb-1.5 text-sm text-muted">时长</p>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((item) => (
                  <Chip key={item} on={duration === item} onClick={() => setDuration(item)}>
                    {item >= 60 && item % 60 === 0 ? `${item / 60} 小时` : `${item} 分`}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {LEVELS.map((item) => (
                <Chip key={item} on={level === item} onClick={() => setLevel(item)}>
                  {item}
                </Chip>
              ))}
              {FEES.map((item) => (
                <Chip key={item} on={fee === item} onClick={() => setFee(item)}>
                  {item}
                </Chip>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">人数上限，含你自己</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="tap grid size-11 place-items-center rounded-full border border-line"
                  onClick={() => setCapacity((value) => Math.max(2, value - 1))}
                  aria-label="减少人数"
                >
                  −
                </button>
                <span className="w-6 text-center font-serif text-2xl tabular-nums">{capacity}</span>
                <button
                  type="button"
                  className="tap grid size-11 place-items-center rounded-full border border-line"
                  onClick={() => setCapacity((value) => Math.min(20, value + 1))}
                  aria-label="增加人数"
                >
                  +
                </button>
              </div>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted">备注</span>
              <textarea
                value={note}
                maxLength={140}
                rows={3}
                onChange={(event) => setNote(event.target.value)}
                placeholder="配速、装备、会不会等迟到的人"
                className={`${fieldClass} py-2`}
              />
            </label>
            {error && <p className="text-sm text-clay">{error}</p>}
            <Button type="submit" className="w-full">
              发出去
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
