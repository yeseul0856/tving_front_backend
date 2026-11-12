import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api.js'
import { Card } from '../components/ContentRow.jsx'

export default function Search({ onSelect }) {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [input, setInput] = useState(q)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => inputRef.current?.focus(), [])

  // 입력 디바운스 → URL 쿼리 갱신
  useEffect(() => {
    const t = setTimeout(() => {
      if (input.trim() !== q) setParams(input.trim() ? { q: input.trim() } : {}, { replace: true })
    }, 350)
    return () => clearTimeout(t)
  }, [input]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!q) {
      setResults([])
      return
    }
    let alive = true
    setLoading(true)
    setError('')
    api
      .search(q)
      .then((r) => alive && setResults(r.results))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [q])

  return (
    <main className="page page--search">
      <div className="search-box">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="TV프로그램, 영화 제목 및 출연진으로 검색해보세요"
        />
        {input && (
          <button className="search-box__clear" onClick={() => setInput('')} aria-label="지우기">✕</button>
        )}
      </div>

      {error && <p className="error">{error}</p>}
      {q && !loading && !error && (
        <p className="search-info">
          '<b>{q}</b>' 검색 결과 <span>{results.length}</span>
        </p>
      )}
      {q && !loading && !error && results.length === 0 && (
        <p className="search-empty">검색 결과가 없습니다.</p>
      )}

      <div className="grid">
        {results.map((it) => (
          <Card key={`${it.media_type}-${it.id}`} item={it} onSelect={onSelect} />
        ))}
      </div>
    </main>
  )
}
