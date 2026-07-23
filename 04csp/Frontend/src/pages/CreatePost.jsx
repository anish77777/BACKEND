import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    //   this createObjectURL() is used to create a temporary url for the image
    //   the url is created in the browser's memory and is not stored on the server
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      setError("Please select an image file.")
      return
    }

    setLoading(true)
    setError(null)

    // 1. new FormData() creates a virtual, programmatic HTML form in memory.
    // 2. formData.append() acts like adding inputs to that form:
    //    - 'caption' is like <input name="caption" value="..." /> (Text)
    //    - 'image' is like <input type="file" name="image" /> (Raw binary file)
    // 3. Since normal JSON cannot transmit binary file data, FormData packages this as 
    //    'multipart/form-data' and streams it in chunks over the network.
    const formData = new FormData()
    formData.append('image', image)
    formData.append('caption', caption)

    try {
      await axios.post('http://localhost:3000/createpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Something went wrong while creating the post.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="create-post-container">
      <h1 className="create-post-title">Create New Post</h1>
      
      {error && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label className="form-label">Upload Image</label>
          <div className="file-upload-wrapper">
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              onChange={handleImageChange}
              className="file-upload-input"
              required
            />
            <div className="file-upload-design">
              <div className="upload-icon">📸</div>
              <span className="upload-text-main">
                {image ? image.name : "Choose an image file"}
              </span>
              <span className="upload-text-sub">Supports JPG, PNG, GIF, WebP</span>
            </div>
          </div>
          
          {preview && (
            <div className="file-preview">
              <img src={preview} alt="Upload preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Caption / Description</label>
          <input 
            type="text" 
            placeholder="Write a catchy caption..." 
            name="caption" 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="form-input"
            required 
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Creating..." : "Share Post"}
        </button>
      </form>
    </section>
  )
}

export default CreatePost