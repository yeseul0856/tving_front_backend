import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import DetailModal from './components/DetailModal.jsx'
import Browse from './pages/Browse.jsx'
import Search from './pages/Search.jsx'

export default function App() {
  const [selected, setSelected] = useState(null) // { media_type, id }

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Browse key="home" type="home" onSelect={setSelected} />} />
        <Route path="/series" element={<Browse key="tv" type="tv" onSelect={setSelected} />} />
        <Route path="/movie" element={<Browse key="movie" type="movie" onSelect={setSelected} />} />
        <Route path="/search" element={<Search onSelect={setSelected} />} />
      </Routes>
      <Footer />
      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} onSelect={setSelected} />
      )}
    </div>
  )
}
