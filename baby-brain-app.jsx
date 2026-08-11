import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Sparkles, Brain, Sun, Hand, Ear, Eye, MessageCircle, Moon, ChevronDown, Pencil, Check } from "lucide-react";

/* ---------- content ---------- */

const STAGES = [
  { id: "newborn", label: "Newborn", range: "0–6 weeks", minDay: 0, maxDay: 42 },
  { id: "settling", label: "Settling In", range: "6–12 weeks", minDay: 42, maxDay: 84 },
  { id: "reaching", label: "Reaching Out", range: "3–4 months", minDay: 84, maxDay: 120 },
  { id: "exploring", label: "Exploring", range: "4–6 months", minDay: 120, maxDay: 183 },
];

const ACTIVITIES = {
  newborn: [
    { id: "n1", title: "Face-to-face gazing", minutes: 5, why: "Newborns focus best 8–12 inches away — right about where your face is during a hold. Locking eyes helps the visual cortex learn to track and recognize faces." },
    { id: "n2", title: "High-contrast cards", minutes: 5, why: "Bold black-and-white patterns are easier for a brand-new visual system to resolve than soft colors, giving those early neurons something clear to fire at." },
    { id: "n3", title: "Narrate the routine", minutes: 10, why: "Talking through diaper changes and feeds — even one-sided — builds the sound patterns that later become language." },
    { id: "n4", title: "Skin-to-skin time", minutes: 15, why: "Close contact steadies heart rate and breathing, which keeps stress hormones low so the brain can spend its energy on growing rather than coping." },
  ],
  settling: [
    { id: "s1", title: "Supervised tummy time", minutes: 10, why: "Pushing up to look around strengthens the neck and shoulders while wiring up the motor cortex for every skill that follows." },
    { id: "s2", title: "Follow-the-toy tracking", minutes: 5, why: "Slowly moving a toy side to side gives growing eye muscles and the visual brain practice working as a team." },
    { id: "s3", title: "Call and response babble", minutes: 10, why: "Repeating sounds back and pausing for a reply is an early rehearsal of conversation — turn-taking is a brain skill, not just a language one." },
    { id: "s4", title: "Texture basket", minutes: 10, why: "Letting tiny hands touch soft, bumpy, and smooth fabrics feeds the somatosensory map that's rapidly filling in this month." },
  ],
  reaching: [
    { id: "r1", title: "Reach-and-grasp play", minutes: 10, why: "Batting at a dangling toy links what the eyes see to what the hands do — one of the brain's first real coordination projects." },
    { id: "r2", title: "Mirror time", minutes: 5, why: "The reflection is fascinating well before self-recognition develops, and it's rich visual and social stimulation either way." },
    { id: "r3", title: "Sing simple songs", minutes: 5, why: "Melody and rhythm light up broad networks across both hemispheres, more than speech alone." },
    { id: "r4", title: "Supported sitting practice", minutes: 10, why: "Working on balance recruits the cerebellum, laying groundwork for the crawling and walking to come." },
  ],
  exploring: [
    { id: "e1", title: "Object permanence peekaboo", minutes: 5, why: "Realizing you still exist when hidden is a genuine cognitive leap — one of the first times a baby reasons about the unseen." },
    { id: "e2", title: "Safe taste-and-texture exploring", minutes: 10, why: "Mouthing toys is how this age gathers data; texture, weight, and temperature all get mapped through touch and taste together." },
    { id: "e3", title: "Narrate cause and effect", minutes: 10, why: "\"You shook it and it rattled\" — naming the link between action and result builds early reasoning, even before words are understood." },
    { id: "e4", title: "Outdoor sound walk", minutes: 15, why: "New sounds, light, and moving air outdoors give the brain a richer stream of input than any single room can." },
  ],
};

const MILESTONE_DOMAINS = [
  {
    id: "motor",
    label: "Moving",
    icon: "hand",
    items: [
      { id: "m1", label: "Lifts head briefly during tummy time" },
      { id: "m2", label: "Opens and closes hands" },
      { id: "m3", label: "Holds head steady when upright" },
      { id: "m4", label: "Pushes up onto forearms" },
      { id: "m5", label: "Rolls from tummy to back" },
      { id: "m6", label: "Reaches for and grasps a toy" },
    ],
  },
  {
    id: "senses",
    label: "Seeing & Hearing",
    icon: "eye",
    items: [
      { id: "se1", label: "Focuses on a face nearby" },
      { id: "se2", label: "Turns toward a familiar voice" },
      { id: "se3", label: "Follows a moving object with eyes" },
      { id: "se4", label: "Notices hands as objects to watch" },
      { id: "se5", label: "Startles less at sudden sounds" },
    ],
  },
  {
    id: "talking",
    label: "Talking & Connecting",
    icon: "message",
    items: [
      { id: "t1", label: "Calms at a caregiver's voice" },
      { id: "t2", label: "First social smile" },
      { id: "t3", label: "Coos and makes vowel sounds" },
      { id: "t4", label: "Laughs out loud" },
      { id: "t5", label: "Babbles strings of sounds" },
    ],
  },
  {
    id: "thinking",
    label: "Thinking",
    icon: "sparkles",
    items: [
      { id: "th1", label: "Shows interest in new faces" },
      { id: "th2", label: "Anticipates feeding when picked up" },
      { id: "th3", label: "Studies own hands with interest" },
      { id: "th4", label: "Searches briefly for a dropped toy" },
    ],
  },
];

const LIBRARY = [
  { id: "l1", tag: "Motor", title: "Why tummy time matters so much", body: "Every push-up your baby attempts is strength training for the motor cortex, the strip of brain tissue that plans and fires off movement. Time on the belly is one of the few settings where a young baby has to fight gravity, and that effort builds the neck, shoulder, and core control that rolling, sitting, and crawling all depend on later." },
  { id: "l2", tag: "Vision", title: "How a blurry world comes into focus", body: "A newborn's vision is soft and low-contrast, closer to 20/400 than 20/20. High-contrast patterns and close-up faces give the visual cortex something strong to practice on. Over the first six months, the connections between eye and brain sharpen fast, and color vision, depth perception, and tracking all come online in stages." },
  { id: "l3", tag: "Language", title: "Serve and return: talking before talking", body: "Long before a baby says a word, cooing, babbling, and the pauses in between are doing real work. When a caregiver responds to a baby's sound, it's called a serve-and-return exchange, and each round strengthens the neural circuits for language and social understanding. The content matters less than the responsiveness." },
  { id: "l4", tag: "Touch", title: "Touch is the brain's first language", body: "The sense of touch develops earlier than sight or hearing and stays central to how a young baby understands the world. Skin-to-skin contact and varied textures both feed the somatosensory cortex, and touch is also one of the fastest ways to calm a stressed nervous system — which matters, because a calm brain learns better than an overwhelmed one." },
  { id: "l5", tag: "Sleep", title: "What happens during all that sleeping", body: "A young baby's sleep isn't downtime for the brain — it's when a lot of the day's input gets sorted and stored. Sleep supports the pruning and strengthening of neural connections formed while awake, which is part of why irregular sleep in the early months is normal even as it's exhausting for everyone else." },
  { id: "l6", tag: "Emotion", title: "Why calm caregiving is brain food", body: "Consistent, responsive care keeps a baby's stress system from firing too often. Brief, resolved stress is a normal part of life, but frequent unrelieved stress can shift how the brain's threat-response circuitry develops. Picking up a crying baby isn't spoiling — it's telling a developing nervous system that the world is safe to explore." },
];

const ICONS = { hand: Hand, eye: Eye, message: MessageCircle, sparkles: Sparkles };

/* ---------- helpers ---------- */

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function ageInDays(birthISO) {
  const ms = Date.now() - new Date(birthISO + "T00:00:00").getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

function ageLabel(days) {
  if (days < 14) return `${days} day${days === 1 ? "" : "s"} old`;
  if (days < 60) return `${Math.floor(days / 7)} weeks old`;
  const months = days / 30.44;
  const whole = Math.floor(months);
  const remWeeks = Math.round((months - whole) * 4.35);
  if (remWeeks <= 0) return `${whole} month${whole === 1 ? "" : "s"} old`;
  return `${whole} mo, ${remWeeks} wk old`;
}

function stageForDays(days) {
  return STAGES.find((s) => days >= s.minDay && days < s.maxDay) || STAGES[STAGES.length - 1];
}

function goldenPoints(n, cx, cy, scale) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pts = [];
  for (let i = 0; i < n; i++) {
    const r = scale * Math.sqrt(i + 1);
    const theta = i * golden;
    pts.push({ x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) });
  }
  return pts;
}

async function loadJSON(key, fallback) {
  try {
    const res = await window.storage.get(key, false);
    if (!res) return fallback;
    return JSON.parse(res.value);
  } catch (e) {
    return fallback;
  }
}

async function saveJSON(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), false);
  } catch (e) {
    /* ignore */
  }
}

/* ---------- bloom visual ---------- */

function SynapseBloom({ count, total }) {
  const nodes = useMemo(() => goldenPoints(total, 150, 150, 15.5), [total]);
  const active = Math.min(count, total);

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" role="img" aria-label="Brain connection bloom">
      <defs>
        <radialGradient id="bloomGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="140" fill="url(#bloomGlow)" />
      {nodes.slice(0, active).map((p, i) => {
        if (i === 0) return null;
        const prev = nodes[i - 1];
        return (
          <line
            key={"l" + i}
            x1={prev.x}
            y1={prev.y}
            x2={p.x}
            y2={p.y}
            stroke="var(--accent)"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        );
      })}
      {nodes.map((p, i) => {
        const isActive = i < active;
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={isActive ? 4 : 2.5}
            fill={isActive ? "var(--accent)" : "var(--muted)"}
            fillOpacity={isActive ? 0.9 : 0.35}
            style={{ transition: "all 0.5s ease" }}
          />
        );
      })}
      <circle cx="150" cy="150" r="5.5" fill="var(--accent-2)" />
    </svg>
  );
}

/* ---------- setup form ---------- */

function SetupForm({ onSave }) {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] px-6 text-center">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: "var(--accent)" }}>
        <Brain className="w-7 h-7" color="white" />
      </div>
      <h1 className="font-display text-3xl mb-2" style={{ color: "var(--ink)" }}>Little Sparks</h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--muted-text)" }}>
        Daily activities, milestones, and the science behind them — tuned to your baby's first six months.
      </p>
      <div className="w-full max-w-xs space-y-4 text-left">
        <div>
          <label className="text-xs uppercase tracking-wide font-mono" style={{ color: "var(--muted-text)" }}>Baby's name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Amara"
            className="mt-1 w-full rounded-lg px-3 py-2 border outline-none font-body"
            style={{ borderColor: "var(--line)", background: "var(--card)" }}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide font-mono" style={{ color: "var(--muted-text)" }}>Birth date</label>
          <input
            type="date"
            value={birth}
            max={todayKey()}
            onChange={(e) => setBirth(e.target.value)}
            className="mt-1 w-full rounded-lg px-3 py-2 border outline-none font-body"
            style={{ borderColor: "var(--line)", background: "var(--card)" }}
          />
        </div>
        <button
          disabled={!name || !birth}
          onClick={() => onSave({ name, birth })}
          className="w-full rounded-lg py-2.5 font-medium text-white disabled:opacity-40 transition-opacity"
          style={{ background: "var(--accent)" }}
        >
          Start tracking
        </button>
      </div>
    </div>
  );
}

/* ---------- main app ---------- */

export default function App() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [activityLog, setActivityLog] = useState({});
  const [milestoneLog, setMilestoneLog] = useState({});
  const [tab, setTab] = useState("today");
  const [openArticle, setOpenArticle] = useState(null);

  useEffect(() => {
    (async () => {
      const p = await loadJSON("baby-profile", null);
      const a = await loadJSON("activity-log", {});
      const m = await loadJSON("milestone-log", {});
      setProfile(p);
      setActivityLog(a);
      setMilestoneLog(m);
      setReady(true);
    })();
  }, []);

  const days = profile ? ageInDays(profile.birth) : 0;
  const stage = stageForDays(days);

  const totalDone = useMemo(() => {
    const actCount = Object.values(activityLog).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    const msCount = Object.keys(milestoneLog).length;
    return actCount + msCount;
  }, [activityLog, milestoneLog]);

  const handleSaveProfile = useCallback(async (p) => {
    setProfile(p);
    setEditingProfile(false);
    await saveJSON("baby-profile", p);
  }, []);

  const toggleActivity = useCallback(
    async (id) => {
      const key = todayKey();
      setActivityLog((prev) => {
        const list = new Set(prev[key] || []);
        list.has(id) ? list.delete(id) : list.add(id);
        const next = { ...prev, [key]: Array.from(list) };
        saveJSON("activity-log", next);
        return next;
      });
    },
    []
  );

  const toggleMilestone = useCallback(async (id) => {
    setMilestoneLog((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = todayKey();
      saveJSON("milestone-log", next);
      return next;
    });
  }, []);

  const todaysDone = activityLog[todayKey()] || [];

  if (!ready) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-[300px]" style={{ color: "var(--muted-text)" }}>Loading…</div>
      </Shell>
    );
  }

  if (!profile || editingProfile) {
    return (
      <Shell>
        <SetupForm onSave={handleSaveProfile} />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wide" style={{ color: "var(--accent-2)" }}>{stage.label} · {stage.range}</p>
            <h1 className="font-display text-2xl mt-0.5" style={{ color: "var(--ink)" }}>{profile.name}</h1>
            <p className="text-sm" style={{ color: "var(--muted-text)" }}>{ageLabel(days)}</p>
          </div>
          <button onClick={() => setEditingProfile(true)} className="p-2 rounded-full" style={{ background: "var(--card)" }} aria-label="Edit profile">
            <Pencil className="w-4 h-4" style={{ color: "var(--muted-text)" }} />
          </button>
        </div>

        <div className="w-40 h-40 mx-auto -mb-2">
          <SynapseBloom count={totalDone} total={40} />
        </div>
        <p className="text-center text-xs font-mono" style={{ color: "var(--muted-text)" }}>{totalDone} connections logged so far</p>
      </div>

      <nav className="flex px-5 border-b" style={{ borderColor: "var(--line)" }}>
        {[
          { id: "today", label: "Today" },
          { id: "milestones", label: "Milestones" },
          { id: "library", label: "Learn" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-3 py-3 text-sm font-medium relative"
            style={{ color: tab === t.id ? "var(--ink)" : "var(--muted-text)" }}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute left-3 right-3 -bottom-px h-0.5 rounded-full" style={{ background: "var(--accent)" }} />
            )}
          </button>
        ))}
      </nav>

      <div className="px-5 py-5">
        {tab === "today" && (
          <div className="space-y-3">
            <p className="text-sm mb-1" style={{ color: "var(--muted-text)" }}>
              {todaysDone.length} of {ACTIVITIES[stage.id].length} done today
            </p>
            {ACTIVITIES[stage.id].map((act) => {
              const done = todaysDone.includes(act.id);
              return (
                <div
                  key={act.id}
                  className="rounded-xl border p-4 flex gap-3"
                  style={{ borderColor: "var(--line)", background: done ? "var(--card-active)" : "var(--card)" }}
                >
                  <button
                    onClick={() => toggleActivity(act.id)}
                    className="mt-0.5 w-5 h-5 shrink-0 rounded-full border flex items-center justify-center"
                    style={{ borderColor: done ? "var(--accent)" : "var(--line)", background: done ? "var(--accent)" : "transparent" }}
                    aria-label={done ? "Mark not done" : "Mark done"}
                  >
                    {done && <Check className="w-3 h-3" color="white" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-medium text-sm" style={{ color: "var(--ink)" }}>{act.title}</h3>
                      <span className="text-xs font-mono shrink-0" style={{ color: "var(--muted-text)" }}>{act.minutes} min</span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted-text)" }}>{act.why}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "milestones" && (
          <div className="space-y-6">
            {MILESTONE_DOMAINS.map((domain) => {
              const Icon = ICONS[domain.icon];
              return (
                <div key={domain.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color: "var(--accent-2)" }} />
                    <h2 className="font-display text-lg" style={{ color: "var(--ink)" }}>{domain.label}</h2>
                  </div>
                  <div className="space-y-1.5">
                    {domain.items.map((item) => {
                      const achieved = milestoneLog[item.id];
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleMilestone(item.id)}
                          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 border text-left"
                          style={{ borderColor: "var(--line)", background: achieved ? "var(--card-active)" : "var(--card)" }}
                        >
                          <span
                            className="w-4 h-4 shrink-0 rounded-full border flex items-center justify-center"
                            style={{ borderColor: achieved ? "var(--accent)" : "var(--line)", background: achieved ? "var(--accent)" : "transparent" }}
                          >
                            {achieved && <Check className="w-2.5 h-2.5" color="white" />}
                          </span>
                          <span className="text-sm flex-1" style={{ color: "var(--ink)" }}>{item.label}</span>
                          {achieved && (
                            <span className="text-[10px] font-mono shrink-0" style={{ color: "var(--muted-text)" }}>{achieved}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "library" && (
          <div className="space-y-2.5">
            {LIBRARY.map((art) => {
              const open = openArticle === art.id;
              return (
                <div key={art.id} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
                  <button
                    onClick={() => setOpenArticle(open ? null : art.id)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                  >
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wide mb-0.5" style={{ color: "var(--accent-2)" }}>{art.tag}</p>
                      <h3 className="font-medium text-sm" style={{ color: "var(--ink)" }}>{art.title}</h3>
                    </div>
                    <ChevronDown className="w-4 h-4 shrink-0 transition-transform" style={{ color: "var(--muted-text)", transform: open ? "rotate(180deg)" : "none" }} />
                  </button>
                  {open && (
                    <p className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "var(--muted-text)" }}>{art.body}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{
        background: "var(--bg)",
        "--bg": "#EFF3EE",
        "--card": "#FBFAF6",
        "--card-active": "#EAF0E7",
        "--ink": "#232840",
        "--muted-text": "#767C93",
        "--muted": "#A8ABBE",
        "--accent": "#5B6EE8",
        "--accent-2": "#C97456",
        "--line": "#DFE4DC",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body, body { font-family: 'Public Sans', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>
      <div className="w-full max-w-sm font-body" style={{ background: "var(--bg)" }}>
        {children}
      </div>
    </div>
  );
}
