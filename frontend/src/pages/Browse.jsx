import { useEffect, useState } from 'react'
import { api } from '../api.js'
import HeroBanner from '../components/HeroBanner.jsx'
import ContentRow from '../components/ContentRow.jsx'

// type: 'home' | 'tv' | 'movie'
export default function Browse({ type, onSelect }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    const req = type === 'home' ? api.home() : api.category(type)
    req.then(setData).catch((e) => setError(e.message))
  }, [type])

  if (error) {
    return (
      <main className="page page--center">
        <div className="notice">
          <h2>데이터를 불러오지 못했습니다</h2>
          <p>{error}</p>
          <p className="notice__hint">
            backend/.env 의 TMDB 키와 FastAPI 서버(포트 8000) 실행 여부를 확인하세요.
          </p>
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="page">
        <div className="hero hero--empty skeleton" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="row">
            <div className="skeleton skeleton--title" />
            <div className="row__track">
              {Array.from({ length: 7 }).map((_, j) => <div key={j} className="skeleton skeleton--card" />)}
            </div>
          </div>
        ))}
      </main>
    )
  }

  return (
    <main className="page">
      <HeroBanner items={data.hero} onSelect={onSelect} />
      <div className="rows">
        {data.sections.map((s) => (
          <ContentRow key={s.key} title={s.title} card={s.card} items={s.items} onSelect={onSelect} />
        ))}
      </div>
    </main>
  )
}
