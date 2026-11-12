import { useRef } from 'react'
import { img } from '../api.js'

export function Card({ item, card = 'poster', rank, onSelect }) {
  const wide = card === 'wide'
  const src = wide ? img(item.backdrop_path, 'w780') : img(item.poster_path, 'w342')
  return (
    <button className={`card card--${card}`} onClick={() => onSelect(item)}>
      {rank && <span className="card__rank">{rank}</span>}
      <div className="card__thumb">
        {src ? <img src={src} alt={item.title} loading="lazy" /> : <div className="card__noimg">{item.title}</div>}
        {item.vote_average >= 8 && <span className="card__tag">평점 {item.vote_average}</span>}
        {wide && <span className="card__wide-title">{item.title}</span>}
      </div>
      {!wide && <p className="card__title">{item.title}</p>}
    </button>
  )
}

export default function ContentRow({ title, card = 'poster', items, onSelect }) {
  const ref = useRef(null)
  const scroll = (dir) => {
    const el = ref.current
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  return (
    <section className="row">
      <h3 className="row__title">{title}</h3>
      <div className="row__wrap">
        <button className="row__arrow row__arrow--prev" onClick={() => scroll(-1)} aria-label="이전">‹</button>
        <div className={`row__track row__track--${card}`} ref={ref}>
          {items.map((it, i) => (
            <Card
              key={`${it.media_type}-${it.id}`}
              item={it}
              card={card}
              rank={card === 'rank' ? i + 1 : null}
              onSelect={onSelect}
            />
          ))}
        </div>
        <button className="row__arrow row__arrow--next" onClick={() => scroll(1)} aria-label="다음">›</button>
      </div>
    </section>
  )
}
