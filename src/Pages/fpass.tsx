import React, { useState } from 'react';
// import { supabase } from '../supabaseClient'; // Uncomment and configure if supabase client is set up

const FPass: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Placeholder for Supabase password reset
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://wander-nest-ad3s.onrender.com/api/auth/password-reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let errorMsg = 'No account found with that email or error sending email.';
        try {
          const errorData = await response.json();
          if (errorData) {
            if (errorData.detail) errorMsg = errorData.detail;
            else if (errorData.error) errorMsg = errorData.error;
            else if (errorData.message) errorMsg = errorData.message;
            else if (typeof errorData === 'string') errorMsg = errorData;
          }
        } catch (e) {
          try {
            const errorText = await response.text();
            if (errorText) errorMsg = errorText;
          } catch {}
        }
        setMessage(errorMsg);
      } else {
        setMessage('If your email is registered, a password reset link has been sent.\n\nCheck your inbox and follow the link. After clicking the link, you will be able to set a new password. The reset link contains a unique code (uidb64 and token) that is handled automatically.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', marginTop: 10, padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #eee', fontFamily: 'inherit', textAlign: 'left' }}>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 12, color: '#19202A', letterSpacing: '-1px' }}>Forgot your password?</h2>
      <p style={{ fontSize: '1.25rem', color: '#222', marginBottom: 24, lineHeight: 1.3 }}>Enter your email address and we'll send you a link to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className={styles.input}
          style={{ width: '100%', padding: 12, marginBottom: 24, borderRadius: 5, border: '1px solid #ccc', fontSize: '1.1rem' }}
        />
        <button type="submit" disabled={loading} className={styles.darkButton} style={{ width: '100%', padding: 16, borderRadius: 8, fontSize: '1.5rem', fontWeight: 400, marginBottom: 8 }}>
          {loading ? 'Checking...' : 'Send reset link'}
        </button>
      </form>
      {message && <div style={{ marginTop: 16, color: message.includes('sent') ? 'green' : 'red', fontSize: '1.1rem' }}>{message}</div>}
    </div>
  );
};

export default FPass;
