import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import './App.css'
import CreatePost from './pages/CreatePost'
import Feed from './pages/Feed'

function App() {
  return (
    <BrowserRouter>
      <nav className="app-nav">
        <NavLink to="/" className="nav-logo">
          ✨ AntiGram
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" className="nav-link">
            Feed
          </NavLink>
          <NavLink to="/create" className="nav-link">
            Create Post
          </NavLink>
        </div>
      </nav>
      
      <main className="page-container">
        <Routes>
          <Route path="/create" element={<CreatePost />} />
          <Route path="/" element={<Feed />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
