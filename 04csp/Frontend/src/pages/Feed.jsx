import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Feed = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
       axios.get('http://localhost:3000/post')
       .then(response => {
           setPosts(response.data)
           setLoading(false)
       })
       .catch(err => {
           console.error("Fetch posts failed:", err)
           setError("Unable to load the feed. Make sure the backend server is running.")
           setLoading(false)
       })
    }, [])

    const getInitials = (index) => {
        const names = ['AS', 'JD', 'KP', 'ML', 'OB', 'RT', 'XG']
        return names[index % names.length]
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading posts...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="empty-state" style={{ borderColor: '#ef4444' }}>
                <h3 style={{ color: '#ef4444' }}>Network Error</h3>
                <p>{error}</p>
                <button className="btn-primary" onClick={() => window.location.reload()}>Retry</button>
            </div>
        )
    }

    return (
        <section className="feed-section">
            <header className="feed-header">
                <h1>Feed</h1>
            </header>

            {posts.length === 0 ? (
                <div className="empty-state">
                    <h3>No posts yet</h3>
                    <p>Be the first to share an image with a caption!</p>
                    <Link to="/create" className="btn-primary">
                        Create a Post
                    </Link>
                </div>
            ) : (
                <div className="feed-container">
                    {posts.map((post, index) => (
                        <article className="feed-card" key={post._id || index}>
                            <div className="card-header">
                                <div className="card-avatar">
                                    {getInitials(index)}
                                </div>
                                <div className="card-user-info">
                                    <span className="card-username">Anonymous Creator</span>
                                    <span className="card-time">Just now</span>
                                </div>
                            </div>
                            <div className="card-image-container">
                                <img className="card-image" src={post.image} alt={post.caption || "Post Image"} />
                            </div>
                            <div className="card-body">
                                <p className="card-caption">
                                    <strong>Creator </strong> {post.caption}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default Feed