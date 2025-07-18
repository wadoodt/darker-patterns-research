import { useEffect, useState } from 'react';

const SignupPage = () => {
  const [signupAction, setSignupAction] = useState<'create' | 'join'>('create');
  const [plan, setPlan] = useState('Free');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planFromUrl = urlParams.get('plan');
    if (planFromUrl) {
      setPlan(planFromUrl);
      setSignupAction('create'); // Assume selecting a plan means creating a company
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = 
      signupAction === 'create'
        ? { action: 'create', username, email, password, plan, companyName }
        : { action: 'join', username, email, password, companyId };

    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      if (signupAction === 'create') {
        const { stripeUrl } = await response.json();
        if (stripeUrl) {
          window.location.href = stripeUrl; // Redirect to Stripe for paid plans
        } else {
          window.location.href = '/login?status=signup_success'; // Redirect for free plans
        }
      } else {
        // For joining, maybe the user needs approval or is logged in directly.
        // For now, redirect to login with a status message.
        window.location.href = '/login?status=join_request_sent';
      }
    } else {
      // Handle error
      console.error('Signup failed');
      alert('Signup failed. Please check the details and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          <input
            type="radio"
            value="create"
            checked={signupAction === 'create'}
            onChange={() => setSignupAction('create')}
          />
          Create a new company
        </label>
        <label>
          <input
            type="radio"
            value="join"
            checked={signupAction === 'join'}
            onChange={() => setSignupAction('join')}
          />
          Join an existing company
        </label>
      </div>

      {signupAction === 'create' ? (
        <>
          <div>
            <label htmlFor="plan">Plan</label>
            <select id="plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
          <div>
            <label htmlFor="companyName">Company Name</label>
            <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="companyId">Company ID</label>
          <input id="companyId" type="text" value={companyId} onChange={(e) => setCompanyId(e.target.value)} required />
        </div>
      )}

      <div>
        <label htmlFor="username">Your Name</label>
        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupPage;
