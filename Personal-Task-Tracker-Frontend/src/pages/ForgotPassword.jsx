import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post('http://localhost:8080/api/v1/auth/reset-password', {
        email: email,
        newPassword: newPassword
      })

      alert('Password updated successfully. Please login with your new password.')
      navigate('/login')

    } catch (error) {
      console.error('Password reset failed:', error)
      alert('Password reset failed. Check that the email is correct.')
    }
  }

  return (
    <div className="auth-card">
      <h2>Reset Password</h2>
      <p style={{ marginBottom: '20px', fontSize: '13px' }}>
        Enter your account email and a new password.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">Reset Password</button>
      </form>
      <p style={{ marginTop: '16px', fontSize: '13px', color: '#a8acbd', textAlign: 'center' }}>
        Remembered it? <Link to="/login" style={{ color: '#5b7fff' }}>Back to Login</Link>
      </p>
    </div>
  )
}

export default ForgotPassword