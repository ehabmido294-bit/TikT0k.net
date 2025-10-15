import React, { useState } from "react";

const PAYMENT_OPTIONS = [
  { id: "visa", label: "VISA", masked: "4365 **** **** ****" },
  { id: "mc", label: "MasterCard", masked: "5454 **** **** ****" },
  { id: "paypal", label: "PayPal", masked: "user@paypal.com" }
];

export default function App() {
  const [selectedAmount, setSelectedAmount] = useState(10000);
  const [showMethods, setShowMethods] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  function handleBuy() {
    setShowMethods(true);
    setShowSuccess(false);
    setSelectedMethod(null);
  }

  function handleChoose(method) {
    setSelectedMethod(method);
    setTimeout(() => {
      setShowSuccess(true);
    }, 300);
  }

  function closeModal() {
    setShowMethods(false);
    setShowSuccess(false);
    setSelectedMethod(null);
  }

  return (
    <div className="page">
      <header className="topbar">
        <img src="/screenshot1.png" alt="logo" className="logo" />
        <h1>Get Coins — Demo</h1>
      </header>

      <main className="content">
        <section className="card-panel">
          <div className="account">
            <div className="avatar">🎮</div>
            <div>
              <div className="nick">TikToker</div>
              <div className="coins">92,538,280</div>
            </div>
          </div>

          <div className="amounts">
            {[10000,20000,40000,60000,80000,100000,200000].map(a => (
              <button
                key={a}
                className={\`amount \${selectedAmount===a ? "active":""}\`}
                onClick={() => setSelectedAmount(a)}
              >
                <div className="amt">{a.toLocaleString()}</div>
                <div className="price">${(a/5000).toFixed(0)}</div>
              </button>
            ))}
          </div>

          <div className="footer-row">
            <div>Payment method</div>
            <div className="brand-row">
              <img src="/screenshot2.png" alt="brands" className="brands" />
            </div>
          </div>

          <div className="total">Total &nbsp; <strong>${(selectedAmount/5000).toFixed(0)}</strong></div>

          <button className="recharge-btn" onClick={handleBuy}>Recharge</button>
        </section>
      </main>

      {showMethods && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Choose payment method</h3>
            <ul className="methods">
              {PAYMENT_OPTIONS.map(o => (
                <li key={o.id} className="method">
                  <div>
                    <div className="method-label">{o.label}</div>
                    <div className="method-sub">{o.masked}</div>
                  </div>
                  <button className="pay-btn" onClick={() => handleChoose(o)}>Pay</button>
                </li>
              ))}
            </ul>
            <button className="close" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}

      {showSuccess && selectedMethod && (
        <div className="overlay" onClick={closeModal}>
          <div className="success-modal" onClick={e => e.stopPropagation()}>
            <div className="success-badge">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <path d="M9 12.5l2.5 2.5 5-5" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Payment Successful!</h3>
            <p>Your recharge of <strong>{selectedAmount.toLocaleString()}</strong> coins has been processed.</p>
            <button className="close" onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
