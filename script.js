// Interaction for demo v2
const packages = document.querySelectorAll('.package');
const cards = document.querySelectorAll('.card');
const buyBtn = document.getElementById('buyBtn');
const overlay = document.getElementById('overlay');
const modalIcon = document.getElementById('modalIcon');
const closeModal = document.getElementById('closeModal');

// Select package visually
packages.forEach(p=>{
  p.addEventListener('click',()=>{
    packages.forEach(x=>x.classList.remove('selected'));
    p.classList.add('selected');
  });
});

// Select payment card visually
cards.forEach(c=>{
  c.addEventListener('click',()=>{
    cards.forEach(x=>x.classList.remove('selected'));
    c.classList.add('selected');
  });
});

// icons mapping using inline SVG strings
const icons = {
  visa: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40" width="96" height="56"><rect width="64" height="40" rx="6" fill="#ffffff10"/><text x="8" y="26" font-size="16" fill="#fff" font-weight="700" font-family="Arial">VISA</text></svg>`,
  mastercard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40" width="96" height="56"><rect width="64" height="40" rx="6" fill="#ffffff10"/><circle cx="26" cy="20" r="12" fill="#ff5f00"/><circle cx="38" cy="20" r="12" fill="#eb001b" opacity="0.95"/></svg>`,
  paypal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40" width="96" height="56"><rect width="64" height="40" rx="6" fill="#ffffff10"/><text x="8" y="26" font-size="12" fill="#fff" font-weight="700" font-family="Arial">PayPal</text></svg>`,
  generic: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40" width="96" height="56"><rect width="64" height="40" rx="6" fill="#ffffff10"/></svg>`
};

buyBtn.addEventListener('click', ()=>{
  const selCard = document.querySelector('.card.selected');
  const selPkg = document.querySelector('.package.selected');
  // determine icon type
  const type = selCard ? selCard.dataset.type : 'generic';
  modalIcon.innerHTML = icons[type] || icons.generic;
  overlay.classList.remove('hidden');
});

// close modal
if(closeModal){
  closeModal.addEventListener('click', ()=> overlay.classList.add('hidden'));
}
// close on overlay click
overlay.addEventListener('click', (e)=>{ if(e.target === overlay) overlay.classList.add('hidden'); });
