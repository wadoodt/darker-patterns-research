import { useEffect, useState } from 'react';

const SignupPage = () => {
  const [plan, setPlan] = useState('basic');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planFromUrl = urlParams.get('plan');
    if (planFromUrl) {
      setPlan(planFromUrl);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, plan }),
    });

    if (response.ok) {
      const { stripeUrl } = await response.json();
      window.location.href = stripeUrl;
    } else {
      // Handle error
      console.error('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div>
        <label htmlFor="plan">Plan</label>
        <select id="plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="premium">Premium</option>
        </select>
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupPage;
