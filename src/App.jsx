import { useEffect, useRef, useState, useCallback } from 'react'

const LETTER = `My Dearest Chaitu ❤️,

Today is one of the most beautiful days because it is your birthday.
You are an amazing person with a beautiful heart.
I wish every dream in your life comes true.
May your smile never fade.
May happiness always stay with you.
Thank you for being such a wonderful person.

Happy Birthday ❤️`

const BALLOON_COLORS = ['#ff4d6d', '#ffb703', '#90e0ef', '#06d6a0', '#c77dff', '#ffffff']
const FIREWORK_EMOJIS = ['🎆', '✨', '🎇', '💖', '🎉', '❤️']
const CONFETTI_COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff']

/** Generic "spawn a floating element every N ms, remove after lifespan" hook */
function useSpawner(active, { every, lifespan, make, max = 40 }) {
  const [items, setItems] = useState([])
  const idRef = useRef(0)

  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      idRef.current += 1
      const id = idRef.current
      setItems((prev) => {
        const next = [...prev, { id, ...make() }]
        return next.length > max ? next.slice(next.length - max) : next
      })
      setTimeout(() => {
        setItems((prev) => prev.filter((it) => it.id !== id))
      }, lifespan)
    }, every)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return items
}

function FloatingHearts({ active }) {
  const hearts = useSpawner(active, {
    every: 500,
    lifespan: 9000,
    max: 30,
    make: () => ({
      left: Math.random() * 100,
      fontSize: 20 + Math.random() * 40,
      duration: 5 + Math.random() * 5,
    }),
  })
  return (
    <>
      {hearts.map((h) => (
        <div
          key={h.id}
          className="floating-heart"
          style={{ left: `${h.left}vw`, fontSize: h.fontSize, animationDuration: `${h.duration}s` }}
        >
          ❤️
        </div>
      ))}
    </>
  )
}

function Balloons({ active }) {
  const balloons = useSpawner(active, {
    every: 1000,
    lifespan: 15000,
    max: 20,
    make: () => ({
      left: Math.random() * 100,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      duration: 8 + Math.random() * 5,
    }),
  })
  return (
    <>
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon"
          style={{ left: `${b.left}vw`, background: b.color, animationDuration: `${b.duration}s` }}
        />
      ))}
    </>
  )
}

function Sparkles({ active }) {
  const sparkles = useSpawner(active, {
    every: 250,
    lifespan: 2500,
    max: 40,
    make: () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      fontSize: 15 + Math.random() * 20,
    }),
  })
  return (
    <>
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="sparkle"
          style={{ left: `${s.left}vw`, top: `${s.top}vh`, fontSize: s.fontSize }}
        >
          ✨
        </div>
      ))}
    </>
  )
}

function RosePetals({ active }) {
  const roses = useSpawner(active, {
    every: 300,
    lifespan: 9000,
    max: 25,
    make: () => ({
      left: Math.random() * 100,
      duration: 4 + Math.random() * 4,
    }),
  })
  return (
    <>
      {roses.map((r) => (
        <div key={r.id} className="rose" style={{ left: `${r.left}vw`, animationDuration: `${r.duration}s` }}>
          🌹
        </div>
      ))}
    </>
  )
}

function Fireworks({ active }) {
  const fireworks = useSpawner(active, {
    every: 200,
    lifespan: 2000,
    max: 25,
    make: () => ({
      left: Math.random() * 100,
      top: Math.random() * 70,
      fontSize: 25 + Math.random() * 40,
      emoji: FIREWORK_EMOJIS[Math.floor(Math.random() * FIREWORK_EMOJIS.length)],
    }),
  })
  return (
    <>
      {fireworks.map((f) => (
        <div
          key={f.id}
          className="firework"
          style={{ left: `${f.left}vw`, top: `${f.top}vh`, fontSize: f.fontSize }}
        >
          {f.emoji}
        </div>
      ))}
    </>
  )
}

function Confetti({ active }) {
  const pieces = useSpawner(active, {
    every: 100,
    lifespan: 5000,
    max: 60,
    make: () => ({
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotate: Math.random() * 360,
    }),
  })
  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{ left: `${p.left}vw`, background: p.color, transform: `rotate(${p.rotate}deg)` }}
        />
      ))}
    </>
  )
}

/** Extra one-shot heart burst that fires a few seconds after load */
function HeartBurst() {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      const burst = Array.from({ length: 24 }).map((_, i) => ({
        id: `burst-${i}`,
        left: Math.random() * 100,
        top: Math.random() * 100,
        fontSize: 20 + Math.random() * 30,
      }))
      setHearts(burst)
      setTimeout(() => setHearts([]), 2200)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {hearts.map((h) => (
        <div
          key={h.id}
          className="heart-burst"
          style={{ left: `${h.left}vw`, top: `${h.top}vh`, fontSize: h.fontSize }}
        >
          ❤️
        </div>
      ))}
    </>
  )
}

function Loading() {
  return (
    <div id="loading">
      <h1>Loading Your Surprise ❤️</h1>
      <div className="loader" />
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [page, setPage] = useState(1)
  const [letterText, setLetterText] = useState('')
  const [noBtnPos, setNoBtnPos] = useState(null)
  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const musicStarted = useRef(false)

  // loading screen timeout
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 3000)
    return () => clearTimeout(t)
  }, [])

  // start music on first click anywhere, once
  useEffect(() => {
    const handler = () => {
      if (musicStarted.current) return
      musicStarted.current = true
      audioRef.current?.play().catch(() => {})
    }
    document.addEventListener('click', handler, { once: true })
    return () => document.removeEventListener('click', handler)
  }, [])

  const goToPage = useCallback((n) => setPage(n), [])

  const startLove = () => {
    audioRef.current?.play().catch(() => {})
    goToPage(2)
  }

  const showLetter = () => {
    goToPage(3)
    setLetterText('')
    let i = 0
    const typing = () => {
      if (i < LETTER.length) {
        setLetterText(LETTER.slice(0, i + 1))
        i += 1
        setTimeout(typing, 40)
      }
    }
    typing()
  }

  const showVideo = () => {
    goToPage(4)
    setTimeout(() => {
      const v = videoRef.current
      if (v) {
        v.load()
        setTimeout(() => v.play().catch(() => {}), 300)
      }
    }, 400)
  }

  const dodgeNoBtn = (e) => {
    // works for mouse hover on desktop and touch on mobile
    setNoBtnPos({
      left: `${Math.random() * 70 + 10}%`,
      top: `${Math.random() * 70 + 10}%`,
    })
  }

  return (
    <>
      {!loaded && <Loading />}

      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {loaded && (
        <div id="main">
          <FloatingHearts active={page < 7} />
          <Balloons active={page < 7} />
          <Sparkles active={page < 7} />
          {page === 7 && <Fireworks active />}
          {page === 7 && <Confetti active />}
          {page === 7 && <RosePetals active />}
          <HeartBurst />

          {/* Page 1 */}
          <section className={`page${page === 1 ? ' active' : ''}`}>
            <div className="penguin">🐧</div>
            <h1>Happy Birthday Chaitu ❤️</h1>
            <h2>I have a surprise for you...</h2>
            <button onClick={startLove}>Open Surprise 🎁</button>
          </section>

          {/* Page 2 */}
          <section className={`page${page === 2 ? ' active' : ''}`}>
            <div className="heart">❤️</div>
            <h1>Will You Always Keep Smiling?</h1>
            <div className="btn-row">
              <button onClick={showLetter}>Yes ❤️</button>
              <button
                onMouseOver={dodgeNoBtn}
                onTouchStart={dodgeNoBtn}
                style={noBtnPos ? { position: 'fixed', left: noBtnPos.left, top: noBtnPos.top } : undefined}
              >
                No 😢
              </button>
            </div>
          </section>

          {/* Page 3 */}
          <section className={`page${page === 3 ? ' active' : ''}`}>
            <h1>💌 A Letter For You</h1>
            <div className="letter">
              <p style={{ whiteSpace: 'pre-line' }}>{letterText}</p>
            </div>
            <button onClick={showVideo}>Continue 🎥</button>
          </section>

          {/* Page 4 */}
          <section className={`page${page === 4 ? ' active' : ''}`}>
            <h1>🎥 Our Beautiful Memory ❤️</h1>
            <video
              ref={videoRef}
              controls
              playsInline
              onEnded={() => goToPage(5)}
            >
              <source src="/birthday.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <br />
            <button onClick={() => goToPage(5)}>Next 🎁</button>
          </section>

          {/* Page 5 */}
          <section className={`page${page === 5 ? ' active' : ''}`}>
            <h1>A Special Gift For You</h1>
            <GiftBox onOpened={() => goToPage(6)} />
          </section>

          {/* Page 6 */}
          <section className={`page${page === 6 ? ' active' : ''}`}>
            <div className="cake">🎂</div>
            <h1>Happy Birthday Chaitu ❤️</h1>
            <button onClick={() => goToPage(7)}>Celebrate 🎉</button>
          </section>

          {/* Page 7 */}
          <section className={`page${page === 7 ? ' active' : ''}`}>
            <h1 className="final">✨ HAPPY BIRTHDAY CHAITU ❤️ ✨</h1>
            <h2>May all your dreams come true. I wish you happiness forever. ❤️</h2>
          </section>
        </div>
      )}
    </>
  )
}

function GiftBox({ onOpened }) {
  const [opened, setOpened] = useState(false)

  const open = () => {
    setOpened(true)
    setTimeout(onOpened, 1500)
  }

  return (
    <>
      <div id="giftBox" className={opened ? 'opened' : ''} onClick={open}>
        {opened ? '💖' : '🎁'}
      </div>
      <button onClick={open}>Open Gift</button>
    </>
  )
}
