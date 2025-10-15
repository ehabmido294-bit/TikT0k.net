
// Simple demo logic (localStorage)
function $(id){return document.getElementById(id);}

function loadState(){
  const coins = parseInt(localStorage.getItem('demo_coins')||'523000000',10);
  const txs = JSON.parse(localStorage.getItem('demo_txs')||'[]');
  const acct = localStorage.getItem('demo_acct')||'demo_account';
  const card = localStorage.getItem('demo_card')||'**** **** **** 5432';
  return {coins, txs, acct, card};
}
function saveState(s){
  localStorage.setItem('demo_coins', String(s.coins));
  localStorage.setItem('demo_txs', JSON.stringify(s.txs||[]));
  localStorage.setItem('demo_acct', s.acct);
  localStorage.setItem('demo_card', s.card);
}
function render(){
  const s = loadState();
  $('bigBalance').textContent = s.coins.toLocaleString();
  $('acctName').value = s.acct;
  $('acctNameDisplay').textContent = '@' + s.acct;
  $('cardDisplay').textContent = s.card;
  $('cardAnimatedNumber').textContent = s.card;
  renderTxs(s.txs);
}
function renderTxs(txs){
  const ul = $('txList'); ul.innerHTML = '';
  if(!txs.length){ ul.innerHTML = '<li style="color:#999">لا توجد معاملات بعد</li>'; return; }
  txs.slice().reverse().forEach(tx=>{
    const li = document.createElement('li');
    li.style.padding='8px 6px'; li.style.borderBottom='1px solid rgba(255,255,255,0.03)';
    li.innerHTML = `<strong>${tx.amount}</strong> ⟁ → ${tx.to} <br/><small style="color:#aaa">${tx.date} • ${tx.id} • ${tx.method}</small>`;
    ul.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  render();
  const acct = $('acctName');
  const startPay = $('startPay');
  const payModal = $('payModal');
  const cancelPayBtn = $('cancelPay');
  const confirmPayBtn = $('confirmPay');
  const amountInput = $('amount');
  const cardInput = $('cardNumber');
  const successModal = $('successModal');
  const closeSuccess = $('closeSuccess');

  acct.addEventListener('input', (e)=> {
    const v = e.target.value.trim() || 'demo_account';
    const s = loadState(); s.acct = v; saveState(s);
    $('acctNameDisplay').textContent = '@' + v;
  });

  // packages selection
  document.querySelectorAll('.pkg').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.pkg').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      amountInput.value = btn.getAttribute('data-amount');
    });
  });

  // payment method radios
  const payRadios = document.querySelectorAll('input[name="payMethod"]');
  payRadios.forEach(r => {
    r.addEventListener('change', (e) => {
      const val = e.target.value;
      if(val === 'paypal'){
        $('cardSection').style.display = 'none';
        $('paypalSection').style.display = 'block';
      } else {
        $('cardSection').style.display = 'block';
        $('paypalSection').style.display = 'none';
      }
      // set prefill
      if(val === 'visa'){
        localStorage.setItem('demo_card','**** **** **** 5432');
        $('cardMock').classList.remove('master'); $('cardMock').classList.add('visa');
        $('cardBrand').textContent = 'VISA';
      } else if(val === 'master'){
        localStorage.setItem('demo_card','5400 **** **** 1234');
        $('cardMock').classList.remove('visa'); $('cardMock').classList.add('master');
        $('cardBrand').textContent = 'MASTERCARD';
      }
      $('cardNumber').value = localStorage.getItem('demo_card');
      $('cardDisplay').textContent = localStorage.getItem('demo_card');
      $('cardAnimatedNumber').textContent = localStorage.getItem('demo_card');
    });
  });

  // card input listener
  if(cardInput){
    cardInput.addEventListener('input', (e)=>{
      let v = e.target.value.replace(/[^0-9\s]/g,'').slice(0,19);
      v = v.replace(/\s+/g,'').replace(/(.{4})/g,'$1 ').trim();
      e.target.value = v;
      const masked = (v.replace(/\D/g,'').length>4) ? v.replace(/\D/g,'').slice(0,4) + '*'.repeat(Math.max(0,16-v.replace(/\D/g,'').length)) : v;
      localStorage.setItem('demo_card', masked);
      $('cardDisplay').textContent = masked;
      $('cardAnimatedNumber').textContent = masked;
    });
  }

  // PayPal simulated
  const payWithPaypal = $('payWithPaypal');
  if(payWithPaypal){
    payWithPaypal.addEventListener('click', ()=>{
      $('payModal').classList.remove('hidden');
      setTimeout(()=> $('cardAnimated').classList.add('show'), 200);
      setTimeout(()=> {
        $('cardAnimated').classList.remove('show');
        $('payModal').classList.add('hidden');
        simulateSuccessFromMethod('PayPal');
      }, 1200);
    });
  }

  // startPay
  startPay.addEventListener('click', ()=>{
    const selected = document.querySelector('input[name="payMethod"]:checked').value;
    if(selected === 'paypal'){
      payWithPaypal && payWithPaypal.click();
      return;
    }
    // show modal for card pay
    $('payModal').classList.remove('hidden');
    setTimeout(()=> $('cardAnimated').classList.add('show'), 200);
  });

  // confirmPay
  confirmPayBtn.addEventListener('click', ()=> {
    simulateSuccessFromMethod(document.querySelector('input[name="payMethod"]:checked').value);
  });

  cancelPayBtn && cancelPayBtn.addEventListener('click', ()=> {
    $('payModal').classList.add('hidden');
    $('cardAnimated').classList.remove('show');
  });

  closeSuccess && closeSuccess.addEventListener('click', ()=> { successModal.classList.add('hidden'); });
});

function simulateSuccessFromMethod(methodName){
  const amount = parseInt(($('amount')||{value:0}).value || '0', 10);
  if(!amount || amount <= 0){ alert('اختر باقة قبل الشراء'); return; }
  const s = loadState();
  if(amount > s.coins){ alert('الرصيد غير كافٍ'); return; }
  s.coins -= amount;
  const acct = ($('acctName')||{value:'demo_account'}).value.trim() || 'demo_account';
  const tx = {
    id: 'TX-' + Math.floor(Math.random()*900000+100000),
    to: acct,
    amount: amount,
    date: new Date().toLocaleString(),
    method: methodName,
    card: localStorage.getItem('demo_card')||'**** **** **** 5432'
  };
  s.txs = s.txs || [];
  s.txs.push(tx);
  saveState(s);
  render();
  $('succText').textContent = `${ methodName === 'PayPal' ? 'تم الدفع عبر PayPal' : 'تم الدفع' } ${amount} عملة إلى @${acct}`;
  $('successModal').classList.remove('hidden');
}
