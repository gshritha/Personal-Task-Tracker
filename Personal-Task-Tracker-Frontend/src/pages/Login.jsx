import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', {
        email: email,
        password: password
      })

      localStorage.setItem('token', response.data.token)
      navigate('/tasks')

    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Check your email and password.')
    }
  }

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">Login</button>
        <p style={{ marginTop: '8px', fontSize: '13px', textAlign: 'center' }}>
  <Link to="/forgot-password" style={{ color: '#5b7fff' }}>Forgot password?</Link>
</p>
      </form>
      <p style={{ marginTop: '16px', fontSize: '13px', color: '#a8acbd', textAlign: 'center' }}>
        New here? <Link to="/register" style={{ color: '#5b7fff' }}>Create an account</Link>
      </p>
    </div>
  )
}

export default Login