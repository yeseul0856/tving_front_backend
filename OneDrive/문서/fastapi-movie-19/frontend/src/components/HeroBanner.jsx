import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Keyboard, A11y } from 'swiper/modules'
import 'swiper/css'
import { img } from '../api.js'

const DELAY = 6000

export default function HeroBanner({ items, onSelect }) {
  const swiperRef = useRef(null)
  const pagerRef = useRef(null)
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  if (!items.length) return <div className="hero hero--empty" />

  const loop = items.length > 2

  const togglePause = () => {
    const s = swiperRef.current
    if (!s) return
    if (paused) s.autoplay.start()
    else s.autoplay.stop()
    setPaused(!paused)
  }

  return (
    <section className={`hero ${paused ? 'is-paused' : ''}`}>
      <Swiper
        className="hero__swiper"
        modules={[Autoplay, Keyboard, A11y]}
        loop={loop}
        speed={800}
        grabCursor
        keyboard={{ enabled: true }}
        autoplay={{ delay: DELAY, disableOnInteraction: false, pauseOnMouseEnter: false }}
        onSwiper={(s) => (swiperRef.current = s)}
        onRealIndexChange={(s) => setIdx(s.realIndex)}
        onAutoplayTimeLeft={(_, __, progress) => {
          // progress: 1 → 0 (남은 비율) — 활성 dot 의 진행바로 표시
          pagerRef.current?.style.setProperty('--progress', String(1 - progress))
        }}
      >
        {items.map((it, i) => (
          <SwiperSlide key={it.id} className="hero__slide">
            <img
              className="hero__bg"
              src={img(it.backdrop_path, 'original')}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            <div className="hero__shade" />
            <div className="hero__content">
              <span className="hero__badge">{it.media_type === 'tv' ? '시리즈' : '영화'}</span>
              <h2 className="hero__title">{it.title}</h2>
              <p className="hero__overview">{it.overview}</p>
              <div className="hero__btns">
                <button className="btn btn--primary" onClick={() => onSelect(it)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
                  시청하기
                </button>
                <button className="btn btn--ghost" onClick={() => onSelect(it)}>상세정보</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="hero__arrow hero__arrow--prev" onClick={() => swiperRef.current?.slidePrev()} aria-label="이전">‹</button>
      <button className="hero__arrow hero__arrow--next" onClick={() => swiperRef.current?.slideNext()} aria-label="다음">›</button>

      <div className="hero__pager" ref={pagerRef}>
        <div className="hero__dots">
          {items.map((it, i) => (
            <button
              key={it.id}
              className={i === idx ? 'is-active' : ''}
              onClick={() => (loop ? swiperRef.current?.slideToLoop(i) : swiperRef.current?.slideTo(i))}
              aria-label={`${i + 1}번 배너`}
            >
              <i />
            </button>
          ))}
        </div>
        <span className="hero__count"><b>{idx + 1}</b> / {items.length}</span>
        <button className="hero__pause" onClick={togglePause} aria-label={paused ? '재생' : '일시정지'}>
          {paused ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3v18l15-9z" /></svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h5v18H5zM14 3h5v18h-5z" /></svg>
          )}
        </button>
      </div>
    </section>
  )
}
