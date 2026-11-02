export const ME_ID = "me";

export const SPORTS = [
  { id: "run", name: "跑步", family: "ink" },
  { id: "ride", name: "骑行", family: "ink" },
  { id: "swim", name: "游泳", family: "ink" },
  { id: "hike", name: "徒步", family: "ink" },
  { id: "basketball", name: "篮球", family: "clay" },
  { id: "badminton", name: "羽毛球", family: "clay" },
  { id: "tennis", name: "网球", family: "clay" },
  { id: "soccer", name: "足球", family: "clay" },
  { id: "frisbee", name: "飞盘", family: "clay" },
  { id: "yoga", name: "瑜伽", family: "court" },
  { id: "gym", name: "健身", family: "court" },
  { id: "climb", name: "攀岩", family: "court" },
] as const;

export type SportId = (typeof SPORTS)[number]["id"];
export type Family = (typeof SPORTS)[number]["family"];
export type Level = "轻松" | "进阶" | "强度";
export type Fee = "免费" | "AA";
export type Vibe = "晨型" | "夜猫" | "周末党";
export type DayFilter = "all" | "today" | "tomorrow" | "weekend";
export type Lens = "soon" | "open" | "saved";

export type MeProfile = {
  name: string;
  area: string;
  bio: string;
  sports: SportId[];
  level: Level;
};

export type Person = {
  id: string;
  name: string;
  area: string;
  bio: string;
  sports: SportId[];
  level: Level;
  vibe: Vibe;
};

export type ResolvedActivity = {
  id: string;
  hostId: string;
  sport: SportId;
  title: string;
  area: string;
  place: string;
  startsAt: number;
  durationMin: number;
  level: Level;
  capacity: number;
  fee: Fee;
  note: string;
  joinedIds: string[];
};

export type ChatMessage = {
  id: string;
  from: string;
  text: string;
  at: number;
  activityId?: string;
};

export type Thread = {
  id: string;
  personId: string;
  unread: boolean;
  messages: ChatMessage[];
};

export type ActivityDraft = {
  sport: SportId;
  title: string;
  area: string;
  place: string;
  startsAt: number;
  durationMin: number;
  level: Level;
  capacity: number;
  fee: Fee;
  note: string;
  invitePersonId: string | null;
};

type Seed = {
  id: string;
  hostId: string;
  sport: SportId;
  title: string;
  area: string;
  place: string;
  dayOffset: number;
  hour: number;
  minute: number;
  durationMin: number;
  level: Level;
  capacity: number;
  fee: Fee;
  note: string;
  joinedIds: string[];
};

export const defaultMe: MeProfile = {
  name: "浩",
  area: "东京",
  bio: "刚来东京，想找固定的出汗搭子。节奏随和，不鸽就行。",
  sports: ["run", "gym"],
  level: "轻松",
};

export const PEOPLE: Person[] = [
  {
    id: "lin",
    name: "林夏",
    area: "代代木",
    bio: "皇居两圈是我的早饭。想找不掉速、也不闲聊整路的人。",
    sports: ["run"],
    level: "轻松",
    vibe: "晨型",
  },
  {
    id: "zhou",
    name: "周予安",
    area: "中目黑",
    bio: "目黑区内球馆常客。双打缺个网前，飞盘也能凑。",
    sports: ["badminton", "frisbee"],
    level: "进阶",
    vibe: "夜猫",
  },
  {
    id: "aoi",
    name: "高桥葵",
    area: "惠比寿",
    bio: "流动瑜伽，中文日语都行。不追求柔韧，把肩打开就好。",
    sports: ["yoga"],
    level: "轻松",
    vibe: "晨型",
  },
  {
    id: "chen",
    name: "陈屿",
    area: "丰洲",
    bio: "半场三对三，不骂人，但会认真防。周末也踢五人制。",
    sports: ["basketball", "soccer"],
    level: "进阶",
    vibe: "夜猫",
  },
  {
    id: "su",
    name: "苏晚",
    area: "吉祥寺",
    bio: "井之头到高尾，速度以拍照为准。风大就加外套。",
    sports: ["hike", "yoga"],
    level: "轻松",
    vibe: "周末党",
  },
  {
    id: "ren",
    name: "山本莲",
    area: "涩谷",
    bio: "初段抱石。可以带第一次的人，但要听指挥。",
    sports: ["climb"],
    level: "进阶",
    vibe: "夜猫",
  },
  {
    id: "he",
    name: "何清",
    area: "台场",
    bio: "临海四十公里，平均二十六。有灯有盔再来。",
    sports: ["ride", "run"],
    level: "进阶",
    vibe: "晨型",
  },
  {
    id: "zhao",
    name: "赵一诺",
    area: "新宿",
    bio: "外苑的公开放球场，AA 场地费。能对拉二十拍就很开心。",
    sports: ["tennis", "badminton"],
    level: "进阶",
    vibe: "周末党",
  },
  {
    id: "wu",
    name: "吴桐",
    area: "上野",
    bio: "自由泳两千，也可以晚上去健身房互相看动作。",
    sports: ["swim", "gym", "run"],
    level: "轻松",
    vibe: "晨型",
  },
  {
    id: "hayato",
    name: "小林隼",
    area: "驹泽",
    bio: "飞盘新手局，规则我讲。跑得动就行，不用有基础。",
    sports: ["frisbee", "soccer", "basketball"],
    level: "轻松",
    vibe: "周末党",
  },
];

const SEEDS: Seed[] = [
  {
    id: "a-ball",
    hostId: "chen",
    sport: "basketball",
    title: "丰洲半场，还差一个后卫",
    area: "丰洲",
    place: "丰洲球馆",
    dayOffset: 0,
    hour: 19,
    minute: 30,
    durationMin: 90,
    level: "进阶",
    capacity: 6,
    fee: "AA",
    note: "已经三人，再来就能轮换。室内场，鞋底不要带室外灰。不喷人，但会认真防。",
    joinedIds: ["chen", "zhou", "hayato"],
  },
  {
    id: "a-night",
    hostId: "lin",
    sport: "run",
    title: "目黑川夜跑，沿河往下",
    area: "中目黑",
    place: "中目黑站东口",
    dayOffset: 0,
    hour: 20,
    minute: 15,
    durationMin: 50,
    level: "轻松",
    capacity: 5,
    fee: "免费",
    note: "配速随最慢的人，大概六分半。灯够亮。耳机别开太大，要能听见打招呼。",
    joinedIds: ["lin", "he"],
  },
  {
    id: "a-run",
    hostId: "lin",
    sport: "run",
    title: "皇居晨跑六个公里",
    area: "皇居",
    place: "外苑喷泉",
    dayOffset: 1,
    hour: 6,
    minute: 40,
    durationMin: 60,
    level: "轻松",
    capacity: 6,
    fee: "免费",
    note: "逆时针。配速六分左右，可以掉队，坂下集合。带水，天凉加一件能系腰上的。",
    joinedIds: ["lin", "wu"],
  },
  {
    id: "a-swim",
    hostId: "wu",
    sport: "swim",
    title: "东京体育馆晨泳",
    area: "千驮谷",
    place: "东京体育馆泳池",
    dayOffset: 1,
    hour: 7,
    minute: 0,
    durationMin: 60,
    level: "轻松",
    capacity: 4,
    fee: "AA",
    note: "自由泳为主，中间可以休息。泳帽泳镜自备。我住上野，会早点到热身。",
    joinedIds: ["wu"],
  },
  {
    id: "a-badminton",
    hostId: "zhou",
    sport: "badminton",
    title: "中目黑双打，球馆已订",
    area: "中目黑",
    place: "中目黑羽毛球场",
    dayOffset: 1,
    hour: 20,
    minute: 0,
    durationMin: 90,
    level: "进阶",
    capacity: 4,
    fee: "AA",
    note: "八点到九点半，AA 大约 1500 日元。能连续对拉就行，网前缺人。",
    joinedIds: ["zhou", "zhao"],
  },
  {
    id: "a-gym",
    hostId: "wu",
    sport: "gym",
    title: "深夜力量，互相看动作",
    area: "上野",
    place: "上野 24 小时健身房",
    dayOffset: 1,
    hour: 21,
    minute: 30,
    durationMin: 75,
    level: "进阶",
    capacity: 3,
    fee: "AA",
    note: "不办卡的话日券到了再分。主要练推和拉，新手我可以看两组动作。",
    joinedIds: ["wu"],
  },
  {
    id: "a-ride",
    hostId: "he",
    sport: "ride",
    title: "台场日出骑行四十公里",
    area: "台场",
    place: "台场海滨公园",
    dayOffset: 2,
    hour: 7,
    minute: 0,
    durationMin: 120,
    level: "进阶",
    capacity: 8,
    fee: "免费",
    note: "到葛西临海再折返，平均二十六左右。灯、盔、备胎，三样齐了再来。掉队有集合点。",
    joinedIds: ["he"],
  },
  {
    id: "a-tennis",
    hostId: "zhao",
    sport: "tennis",
    title: "外苑公开放对拉",
    area: "外苑",
    place: "明治神宫外苑网球场",
    dayOffset: 2,
    hour: 19,
    minute: 0,
    durationMin: 90,
    level: "进阶",
    capacity: 4,
    fee: "AA",
    note: "场地费到了再 AA。带一筒球。水平大概能对拉二十拍，不考核，但别全程捡球。",
    joinedIds: ["zhao", "lin"],
  },
  {
    id: "a-yoga",
    hostId: "aoi",
    sport: "yoga",
    title: "惠比寿晨间流动瑜伽",
    area: "惠比寿",
    place: "惠比寿工作室",
    dayOffset: 3,
    hour: 7,
    minute: 30,
    durationMin: 60,
    level: "轻松",
    capacity: 8,
    fee: "免费",
    note: "不追求柔韧，把肩和髋打开。垫子自带。口令很慢，中文日语都可以。",
    joinedIds: ["aoi", "su"],
  },
  {
    id: "a-climb",
    hostId: "ren",
    sport: "climb",
    title: "涩谷抱石，第一次也行",
    area: "涩谷",
    place: "涩谷抱石馆",
    dayOffset: 4,
    hour: 18,
    minute: 30,
    durationMin: 120,
    level: "轻松",
    capacity: 4,
    fee: "AA",
    note: "我可以带。租鞋馆里有，岩鞋会更舒服。听指挥，别在别人头顶下穿行。",
    joinedIds: ["ren"],
  },
  {
    id: "a-hike",
    hostId: "su",
    sport: "hike",
    title: "高尾山慢爬，拍照算配速",
    area: "高尾",
    place: "京王线高尾山口",
    dayOffset: 5,
    hour: 8,
    minute: 30,
    durationMin: 240,
    level: "轻松",
    capacity: 6,
    fee: "免费",
    note: "一号路上去，缆车下来。午饭自己带。风大就加外套。不竞速，掉队就等等。",
    joinedIds: ["su", "aoi", "he"],
  },
  {
    id: "a-frisbee",
    hostId: "hayato",
    sport: "frisbee",
    title: "驹泽飞盘新手局",
    area: "驹泽",
    place: "驹泽奥林匹克公园草坪",
    dayOffset: 5,
    hour: 16,
    minute: 0,
    durationMin: 90,
    level: "轻松",
    capacity: 10,
    fee: "免费",
    note: "规则我讲。跑得动就行，不用有基础。风太大就改成丢接练习。",
    joinedIds: ["hayato", "chen", "zhou"],
  },
  {
    id: "a-soccer",
    hostId: "chen",
    sport: "soccer",
    title: "五人制，还差两双鞋",
    area: "驹泽",
    place: "驹泽人工草球场",
    dayOffset: 6,
    hour: 9,
    minute: 30,
    durationMin: 90,
    level: "进阶",
    capacity: 10,
    fee: "AA",
    note: "周末小场。没钉鞋可以穿室内鞋，别穿金属钉。打完可以一起喝水，不强制聚餐。",
    joinedIds: ["chen", "hayato"],
  },
];

export const PLACE_PRESETS: { area: string; place: string }[] = [
  { area: "皇居", place: "外苑喷泉" },
  { area: "代代木", place: "代代木公园" },
  { area: "中目黑", place: "中目黑站东口" },
  { area: "丰洲", place: "丰洲球馆" },
  { area: "涩谷", place: "涩谷宫下公园" },
  { area: "惠比寿", place: "惠比寿花园" },
  { area: "台场", place: "台场海滨公园" },
  { area: "千驮谷", place: "东京体育馆" },
  { area: "驹泽", place: "驹泽奥林匹克公园" },
  { area: "新宿", place: "新宿中央公园" },
  { area: "高尾", place: "高尾山口" },
  { area: "上野", place: "上野公园" },
];

const GREET: Record<string, (title: string) => string> = {
  lin: (t) => `收到「${t}」。我穿深色，你穿亮一点好认。迟到超过五分钟就自己热身，别干站着。`,
  zhou: (t) => `「${t}」记下了。提前十分钟到馆门口等，别进错场地。`,
  aoi: (t) => `欢迎来「${t}」。空腹别硬撑，垫子我有多的。`,
  chen: (t) => `好，「${t}」算你一个。到了一楼大厅找黑背心。鞋底干净。`,
  su: (t) => `「${t}」太好了。出门看一眼天气，午饭自己带，我在闸机外等。`,
  ren: (t) => `「${t}」收到。第一次也没关系，进门先找我，别自己开爬。`,
  he: (t) => `「${t}」见。灯和盔拍张照发我，齐了再出门。`,
  zhao: (t) => `「${t}」OK。场地费到了再 AA，先把拍子和弦带上。`,
  wu: (t) => `「${t}」一起。装备自备，我节奏很稳，你可以跟着。`,
  hayato: (t) => `「${t}」来就对了。规则现场讲，不用预习。`,
};

export const INTEREST: Record<string, string> = {
  lin: "这个点我能到。算我一个。",
  zhou: "时间可以，先占个名额。",
  aoi: "我想来，人齐了跟我说一声。",
  chen: "算我一个。别临时改地方。",
  su: "可以呀，我会早点到。",
  ren: "我来。进门好认，深色衣服。",
  he: "路线和时间都没问题。",
  zhao: "先占名额，费用到了再 AA。",
  wu: "这个点有空，一起。",
  hayato: "算我一个，我可以带新人。",
};

let cachedNow: Date | null = null;

export function nowDate() {
  if (!cachedNow) cachedNow = new Date();
  return cachedNow;
}

export function sportById(id: SportId) {
  return SPORTS.find((s) => s.id === id) ?? SPORTS[0];
}

export function getPerson(id: string, me: MeProfile): Person {
  if (id === ME_ID) {
    return {
      id,
      name: me.name.trim() || "浩",
      area: me.area.trim() || "东京",
      bio: me.bio,
      sports: me.sports,
      level: me.level,
      vibe: "周末党",
    };
  }
  return (
    PEOPLE.find((p) => p.id === id) ?? {
      id,
      name: "搭子",
      area: "东京",
      bio: "",
      sports: [],
      level: "轻松",
      vibe: "周末党",
    }
  );
}

export function toneOf(id: string): Family {
  let n = 0;
  for (let i = 0; i < id.length; i++) n = (n + id.charCodeAt(i) * (i + 1)) % 3;
  return (["ink", "clay", "court"] as const)[n];
}

function materialize(seed: Seed, now: Date): ResolvedActivity {
  const starts = new Date(now);
  starts.setDate(starts.getDate() + seed.dayOffset);
  starts.setHours(seed.hour, seed.minute, 0, 0);
  const { dayOffset: _day, hour: _hour, minute: _minute, ...rest } = seed;
  return { ...rest, startsAt: starts.getTime() };
}

export function resolveAll(created: ResolvedActivity[], now: Date) {
  return [...created, ...SEEDS.map((seed) => materialize(seed, now))];
}

export function applyJoins(list: ResolvedActivity[], joins: string[]) {
  return list.map((activity) => {
    const others = activity.joinedIds.filter((id) => id !== ME_ID);
    const joinedIds = joins.includes(activity.id) ? [...others, ME_ID] : others;
    return { ...activity, joinedIds };
  });
}

export function spotsLeft(activity: ResolvedActivity) {
  return activity.capacity - activity.joinedIds.length;
}

export function isPast(activity: ResolvedActivity, now: Date) {
  return activity.startsAt < now.getTime() - 15 * 60 * 1000;
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function dayDiff(date: Date, now: Date) {
  return Math.round((startOfDay(date) - startOfDay(now)) / 86_400_000);
}

const WEEK = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function formatWhen(date: Date, now: Date) {
  const hm = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  const diff = dayDiff(date, now);
  const day = diff === 0 ? "今天" : diff === 1 ? "明天" : diff === 2 ? "后天" : WEEK[date.getDay()];
  return { day, hm, full: `${day} ${hm}` };
}

export function formatDuration(min: number) {
  if (min % 60 === 0) return `${min / 60} 小时`;
  if (min > 60) return `${Math.floor(min / 60)} 小时 ${min % 60} 分`;
  return `${min} 分钟`;
}

export function formatAgo(at: number, now: number) {
  const delta = Math.max(0, now - at);
  if (delta < 60_000) return "刚刚";
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)} 分钟前`;
  if (delta < 86_400_000) return `${Math.floor(delta / 3_600_000)} 小时前`;
  return formatWhen(new Date(at), new Date(now)).full;
}

export function greeting(now: Date) {
  const h = now.getHours();
  let line = "找个人，一起出汗";
  if (h < 5) line = "睡不着的话，先把明早约上";
  else if (h < 11) line = "早场，还来得及";
  else if (h < 17) line = "下午要不要出汗";
  else if (h < 21) line = "今晚还有人缺搭子";
  else line = "太晚了，先约明早";
  return { eyebrow: `${WEEK[now.getDay()]} · 东京`, line };
}

export function spotCopy(activity: ResolvedActivity, now: Date) {
  if (isPast(activity, now)) return { label: "已结束", hot: false };
  const left = spotsLeft(activity);
  if (left <= 0) return { label: "满员", hot: false };
  if (left === 1) return { label: "就差你一个", hot: true };
  return { label: `还差 ${left} 人`, hot: left <= 3 };
}

export function matchDay(activity: ResolvedActivity, day: DayFilter, now: Date) {
  const date = new Date(activity.startsAt);
  if (day === "today") return dayDiff(date, now) === 0;
  if (day === "tomorrow") return dayDiff(date, now) === 1;
  if (day === "weekend") {
    const weekday = date.getDay();
    const diff = dayDiff(date, now);
    return (weekday === 0 || weekday === 6) && diff >= 0 && diff <= 7;
  }
  return true;
}

export function sortActivities(list: ResolvedActivity[], now: Date, lens: Lens) {
  const copy = lens === "open" ? list.filter((a) => !isPast(a, now) && spotsLeft(a) > 0) : [...list];
  copy.sort((a, b) => {
    if (lens === "open") return spotsLeft(a) - spotsLeft(b) || a.startsAt - b.startsAt;
    const ap = isPast(a, now) ? 1 : 0;
    const bp = isPast(b, now) ? 1 : 0;
    if (ap !== bp) return ap - bp;
    return a.startsAt - b.startsAt;
  });
  return copy;
}

export function pickBuddy(sport: SportId, inviteId: string | null) {
  if (inviteId) {
    const invited = PEOPLE.find((p) => p.id === inviteId);
    if (invited) return invited;
  }
  return PEOPLE.find((p) => p.sports.includes(sport)) ?? null;
}

export function greetFor(hostId: string, title: string) {
  return (GREET[hostId] ?? ((t: string) => `收到「${t}」。到了跟我说一声。`))(title);
}

export function starterThreads(now = Date.now()): Thread[] {
  return [
    {
      id: "t-lin",
      personId: "lin",
      unread: false,
      messages: [
        {
          id: "m1",
          from: "lin",
          text: "明早皇居，6:40 外苑喷泉。天凉，带件能系腰上的。",
          at: now - 3 * 3_600_000,
          activityId: "a-run",
        },
        { id: "m2", from: ME_ID, text: "到。我穿亮色外套。", at: now - 2 * 3_600_000 },
        { id: "m3", from: "lin", text: "好认。不见不散。", at: now - 2 * 3_600_000 + 60_000 },
      ],
    },
    {
      id: "t-chen",
      personId: "chen",
      unread: true,
      messages: [
        {
          id: "m4",
          from: "chen",
          text: "今晚丰洲还差人，你防得动吗？黑背心那个就是我。",
          at: now - 25 * 60_000,
          activityId: "a-ball",
        },
      ],
    },
  ];
}

export function toDateInput(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function toTimeInput(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
