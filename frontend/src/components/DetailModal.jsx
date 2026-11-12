import { useEffect, useState } from 'react'
import { api, img } from '../api.js'
import { Card } from './ContentRow.jsx'

export default function DetailModal({ item, onClose, onSelect }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setData(null)
    setError('')
    setPlaying(false)
    api.detail(item.media_type, item.id).then(setData).catch((e) => setError(e.message))
  }, [item.media_type, item.id])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const d = data || item
  const year = d.release_date?.slice(0, 4)
  const isTv = d.media_type === 'tv'

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__box" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="닫기">✕</button>

        <div className="modal__visual">
          {playing && data?.trailer_key ? (
            <iframe
              src={`https://www.youtube.com/embed/${data.trailer_key}?autoplay=1&rel=0`}
              title="trailer"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <>
              {d.backdrop_path && <img src={img(d.backdrop_path, 'w1280')} alt="" />}
              <div className="modal__shade" />
              <div className="modal__head">
                <h2>{d.title}</h2>
                {data?.tagline && <p className="modal__tagline">{data.tagline}</p>}
                <div className="hero__btns">
                  <button
                    className="btn btn--primary"
                    disabled={!data?.trailer_key}
                    onClick={() => setPlaying(true)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
                    {data && !data.trailer_key ? '예고편 없음' : '예고편 재생'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal__body">
          {error && <p className="error">{error}</p>}
          <div className="meta">
            {data?.rating && <span className="meta__age">{data.rating}</span>}
            {year && <span>{year}</span>}
            {d.vote_average > 0 && <span className="meta__score">★ {d.vote_average}</span>}
            {data?.runtime && <span>{data.runtime}분</span>}
            {data?.seasons && <span>시즌 {data.seasons}개 · {data.episodes}화</span>}
            {data?.genres?.length > 0 && <span>{data.genres.join(' · ')}</span>}
          </div>
          <p className="modal__overview">{d.overview || '줄거리 정보가 없습니다.'}</p>

          {data && (
            <dl className="credits">
              {data.directors.length > 0 && (
                <>
                  <dt>{isTv ? '크리에이터' : '감독'}</dt>
                  <dd>{data.directors.join(', ')}</dd>
                </>
              )}
              {data.cast.length > 0 && (
                <>
                  <dt>출연</dt>
                  <dd>{data.cast.map((c) => c.name).join(', ')}</dd>
                </>
              )}
            </dl>
          )}

          {data?.similar?.length > 0 && (
            <>
              <h3 className="modal__sub">비슷한 콘텐츠</h3>
              <div className="grid grid--sm">
                {data.similar.map((s) => (
                  <Card key={s.id} item={s} onSelect={onSelect} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
