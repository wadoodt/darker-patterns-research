export default function PricingPage() {
  return (
    <div>
      <h1>Pricing Plans</h1>
      <div>
        <h2>Basic</h2>
        <p>$10/month</p>
        <a href="/signup.html?plan=basic">Sign Up</a>
      </div>
      <div>
        <h2>Pro</h2>
        <p>$20/month</p>
        <a href="/signup.html?plan=pro">Sign Up</a>
      </div>
      <div>
        <h2>Premium</h2>
        <p>$30/month</p>
        <a href="/signup.html?plan=premium">Sign Up</a>
      </div>
    </div>
  );
}
