import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import bouquetImg from "@/assets/bouquet.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "For You — A Moonlit Bouquet" },
      {
        name: "description",
        content:
          "A dreamy pink evening under the moon — a cinematic romantic bouquet made with love.",
      },
      { property: "og:title", content: "For You — A Moonlit Bouquet" },
      {
        property: "og:description",
        content: "A cinematic romantic bouquet under a glowing pink moon.",
      },
    ],
  }),
  component: Index,
});

type Sparkle = { id: number; x: number; y: number; size: number; delay: number };
type Heart = { id: number; x: number; size: number; dur: number };

const PUZZLES: { q: string; options: string[]; a: number; hint: string }[] = [
  {
    q: "I have four letters, I grow stronger when shared. What am I?",
    options: ["Hope", "Love", "Wish", "Star"],
    a: 1,
    hint: "It's the reason for this whole page 💗",
  },
  {
    q: "Unscramble these letters: T • H • R • E • A",
    options: ["Earth", "Heart", "Hater", "Rathe"],
    a: 1,
    hint: "It beats a little faster around you.",
  },
  {
    q: "🌙 + 🌹 + 💌 = ?",
    options: ["A grocery list", "A midnight love letter", "A recipe", "A movie"],
    a: 1,
    hint: "It's what you're reading right now.",
  },
];

function Index() {
  const [bloom, setBloom] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [kiss, setKiss] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHearts((h) => [
        ...h.slice(-8),
        {
          id: seq.current++,
          x: Math.random() * 100,
          size: 10 + Math.random() * 16,
          dur: 9 + Math.random() * 5,
        },
      ]);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const cursor = document.getElementById("heart-cursor");
    if (!cursor) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX - 12;
      y = e.clientY - 12;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        frame = 0;
      });
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const spawnRipple = useCallback((x: number, y: number) => {
    const r = document.createElement("span");
    r.className = "touch-ripple";
    r.style.left = `${x}px`;
    r.style.top = `${y}px`;
    document.body.appendChild(r);
    window.setTimeout(() => r.remove(), 900);
  }, []);

  const handleTouch = (e: React.PointerEvent<HTMLButtonElement>) => {
    setBloom(true);
    window.setTimeout(() => setBloom(false), 1400);

    const burst: Sparkle[] = Array.from({ length: 18 }, (_, i) => ({
      id: seq.current++,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.2,
    }));
    setSparkles((s) => [...s, ...burst]);
    window.setTimeout(() => {
      setSparkles((s) => s.filter((sp) => !burst.find((b) => b.id === sp.id)));
    }, 1600);

    const extra = Array.from({ length: 10 }, () => ({
      id: seq.current++,
      x: 30 + Math.random() * 40,
      size: 14 + Math.random() * 18,
      dur: 5 + Math.random() * 4,
    }));
    setHearts((h) => [...h, ...extra]);

    if ("vibrate" in navigator) navigator.vibrate?.(30);

    spawnRipple(e.clientX, e.clientY);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
      setMusicOn(true);
    }
  };

  const stars = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    dur: 2 + Math.random() * 3,
  })), []);

  const petals = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 12,
    dur: 14 + Math.random() * 10,
    size: 10 + Math.random() * 12,
    rot: Math.random() * 360,
  })), []);

  const fireflies = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 20 + Math.random() * 60,
    y: 20 + Math.random() * 60,
    delay: Math.random() * 6,
    dur: 8 + Math.random() * 6,
  })), []);

  const confettiHearts = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 2 + Math.random() * 2,
  })), []);

  return (
    <main className="romantic-root">
      <div id="heart-cursor" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4.5 4.5 8.5C19 16.65 12 21 12 21z"
            fill="#ff8fb8"
          />
        </svg>
      </div>

      {/* Sky gradient background */}
      <div className="sky" />
      <div className="fog" />

      {/* Stars */}
      <div className="layer">
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Clouds */}
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="cloud cloud-4" />
      <div className="cloud cloud-5" />

      {/* Moon */}
      <div className="moon-wrap">
        <button
          className={`moon ${bloom ? "moon-bright" : ""}`}
          type="button"
          onClick={() => {
            setBloom(true);
            window.setTimeout(() => setBloom(false), 1600);
          }}
          aria-label="Make the moon glow"
        >
          <div className="moon-glow" />
          <div className="moon-sparkle s1" />
          <div className="moon-sparkle s2" />
          <div className="moon-sparkle s3" />
        </button>
      </div>

      {/* Light rays behind bouquet */}
      <div className="rays" />

      {/* Fireflies */}
      {fireflies.map((f) => (
        <span
          key={f.id}
          className="firefly"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.dur}s`,
          }}
        />
      ))}

      {/* Falling petals */}
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}

      {/* Rising hearts */}
      <div className="hearts-layer">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="heart"
            style={{
              left: `${h.x}%`,
              width: h.size,
              height: h.size,
              animationDuration: `${h.dur}s`,
            }}
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4.5 4.5 8.5C19 16.65 12 21 12 21z"
                fill="url(#hg)"
              />
              <defs>
                <linearGradient id="hg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ffd1e0" />
                  <stop offset="100%" stopColor="#ff6fa0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        ))}
      </div>

      {/* Content */}
      <section className="content">
        <div className="name-reveal">
          <span className="name-eyebrow">For my beloved</span>
          <h1 className="name-title" data-text="Mummaaaa">Mummaaaa</h1>
          <span className="name-underline" aria-hidden="true" />
        </div>
        <div className={`bouquet-wrap ${bloom ? "bloom" : ""}`}>
          <img
            src={bouquetImg}
            alt="A romantic bouquet of pink and white roses, tulips, cherry blossoms and eucalyptus"
            width={1024}
            height={1280}
            className="bouquet"
            draggable={false}
          />
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="sparkle-burst"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="glass-card">
          <p className="message">
            For the most beautiful soul,
            <br />
            every flower here carries a little piece of my heart.
            <br />
            May your night be as beautiful as your smile,
            <br />
            as peaceful as the moonlight,
            <br />
            and as unforgettable as the love you deserve.
          </p>
          <button className="touch-btn" onPointerDown={handleTouch}>
            <span>Touch the Bouquet</span>
          </button>
        </div>

        {/* Puzzles */}
        {!showReward && (
          <div className="glass-card puzzle-card">
            <div className="puzzle-progress">
              {PUZZLES.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i < puzzleIdx ? "done" : ""} ${i === puzzleIdx ? "active" : ""}`}
                />
              ))}
            </div>
            <p className="puzzle-eyebrow">Little riddle {puzzleIdx + 1} of {PUZZLES.length}</p>
            <h3 className="puzzle-q">{PUZZLES[puzzleIdx].q}</h3>
            <div className="puzzle-options">
              {PUZZLES[puzzleIdx].options.map((opt, i) => {
                const isWrong = wrong === i;
                return (
                  <button
                    key={opt}
                    className={`opt ${isWrong ? "wrong" : ""}`}
                    onClick={() => {
                      if (i === PUZZLES[puzzleIdx].a) {
                        if ("vibrate" in navigator) navigator.vibrate?.(20);
                        if (puzzleIdx + 1 >= PUZZLES.length) {
                          window.setTimeout(() => setShowReward(true), 350);
                        } else {
                          setPuzzleIdx((p) => p + 1);
                          setWrong(null);
                        }
                      } else {
                        setWrong(i);
                        if ("vibrate" in navigator) navigator.vibrate?.([30, 40, 30]);
                        window.setTimeout(() => setWrong(null), 700);
                      }
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <p className="puzzle-hint">💡 {PUZZLES[puzzleIdx].hint}</p>
          </div>
        )}
      </section>

      {/* Reward modal */}
      {showReward && (
        <div className="reward-overlay" role="dialog" aria-modal="true">
          <div className="reward-card">
            {!giftOpen ? (
              <>
                <h2 className="reward-title">You solved them all 💗</h2>
                <p className="reward-sub">A little gift is waiting for you...</p>
                <button
                  className={`gift-box`}
                  onClick={() => {
                    setGiftOpen(true);
                    window.setTimeout(() => setKiss(true), 900);
                    if ("vibrate" in navigator) navigator.vibrate?.(50);
                  }}
                  aria-label="Open gift"
                >
                  <div className="gift-lid" />
                  <div className="gift-base" />
                  <div className="gift-ribbon-v" />
                  <div className="gift-ribbon-h" />
                  <div className="gift-bow" />
                </button>
                <p className="tap-hint">Tap the gift ↑</p>
              </>
            ) : (
              <div className="gift-open-scene">
                <div className="burst-rays" />
                {confettiHearts.map((heart) => (
                  <span
                    key={heart.id}
                    className="confetti-heart"
                    style={{
                      left: `${heart.left}%`,
                      animationDelay: `${heart.delay}s`,
                      animationDuration: `${heart.dur}s`,
                    }}
                  >
                    ♥
                  </span>
                ))}
                <p className="reward-eyebrow">A little something forever yours</p>
                <h2 className="reward-title gold">You are my whole universe 🌙</h2>
                <p className="reward-poem">
                  Every star I count tonight,<br />
                  every petal that falls,<br />
                  every quiet second at midnight —<br />
                  they're all just tiny ways of saying<br />
                  <em>I love you, endlessly.</em>
                </p>

                <div className={`kiss-stage ${kiss ? "kissing" : ""}`}>
                  <svg className="lips-svg lips-left" viewBox="0 0 100 70">
                    <defs>
                      <linearGradient id="lipGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ff9ec0" />
                        <stop offset="50%" stopColor="#ff4d85" />
                        <stop offset="100%" stopColor="#b0245a" />
                      </linearGradient>
                      <radialGradient id="lipShine" cx="0.5" cy="0.2" r="0.5">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </radialGradient>
                    </defs>
                    <path
                      d="M8,32 Q22,8 38,22 Q50,34 62,22 Q78,8 92,32 Q78,60 50,60 Q22,60 8,32 Z"
                      fill="url(#lipGrad)"
                      stroke="#7a0f3a"
                      strokeWidth="1.2"
                    />
                    <ellipse cx="35" cy="24" rx="10" ry="4" fill="url(#lipShine)" />
                    <ellipse cx="65" cy="24" rx="10" ry="4" fill="url(#lipShine)" />
                  </svg>
                  <svg className="lips-svg lips-right" viewBox="0 0 100 70">
                    <path
                      d="M8,32 Q22,8 38,22 Q50,34 62,22 Q78,8 92,32 Q78,60 50,60 Q22,60 8,32 Z"
                      fill="url(#lipGrad)"
                      stroke="#7a0f3a"
                      strokeWidth="1.2"
                    />
                    <ellipse cx="35" cy="24" rx="10" ry="4" fill="url(#lipShine)" />
                    <ellipse cx="65" cy="24" rx="10" ry="4" fill="url(#lipShine)" />
                  </svg>
                  <div className="kiss-heart">
                    <svg viewBox="0 0 24 24">
                      <defs>
                        <radialGradient id="khg" cx="0.5" cy="0.4" r="0.6">
                          <stop offset="0%" stopColor="#fff0f5" />
                          <stop offset="40%" stopColor="#ff8fb8" />
                          <stop offset="100%" stopColor="#e63973" />
                        </radialGradient>
                      </defs>
                      <path
                        d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4.5 4.5 8.5C19 16.65 12 21 12 21z"
                        fill="url(#khg)"
                      />
                    </svg>
                  </div>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className="kiss-spark" style={{ "--i": i } as CSSProperties} />
                  ))}
                  {["💖","🌹","💕","✨","💗","🌸","💘","💝"].map((e, i) => (
                    <span key={`fe-${i}`} className="float-emoji" style={{ "--i": i } as CSSProperties}>{e}</span>
                  ))}
                </div>
                <p className="kiss-caption">— a midnight kiss, just for you 💋</p>

                <button
                  className="touch-btn again"
                  onClick={() => {
                    setShowReward(false);
                    setGiftOpen(false);
                    setKiss(false);
                    setPuzzleIdx(0);
                  }}
                >
                  Play again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Music button */}
      <button
        className={`music-btn ${musicOn ? "on" : ""}`}
        onClick={toggleMusic}
        aria-label={musicOn ? "Pause music" : "Play music"}
      >
        {musicOn ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M9 6v12l2-1V7zM12 5v14l9-7z" />
          </svg>
        )}
      </button>

      <audio
        ref={audioRef}
        loop
        preload="none"
        src="https://cdn.pixabay.com/download/audio/2022/10/18/audio_31c2790cef.mp3?filename=romantic-piano-114259.mp3"
      />
    </main>
  );
}
