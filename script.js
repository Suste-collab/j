let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const addBtn = document.getElementById('addBtn');
const transactionList = document.getElementById('transaction-list');
const totalDisplay = document.getElementById('total');
const progressBar = document.getElementById('progress');

function addTransaction(e){
  e.preventDefault();
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;

  if(desc === '' || isNaN(amount)) return;

  const transaction = {desc, amount, type, category, id: Date.now()};
  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();
  updateChart();
  updateBalance();
  updateProgress();

  descInput.value = '';
  amountInput.value = '';
}

function removeTransaction(id){
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  renderTransactions();
  updateChart();
  updateBalance();
  updateProgress();
}

function renderTransactions(){
  transactionList.innerHTML = '';
  transactions.forEach(t => {
    const li = document.createElement('li');
    li.className = t.type;
    li.innerHTML = `
      ${t.desc} - R$ ${t.amount.toFixed(2)}
      <button onclick="removeTransaction(${t.id})">x</button>
    `;
    transactionList.appendChild(li);
  });
}

function updateBalance(){
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  totalDisplay.textContent = `R$ ${(income - expense).toFixed(2)}`;
}

function updateLocalStorage(){
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Chart.js
let chart = null;
function updateChart(){
  const ctx = document.getElementById('myChart').getContext('2d');
  const categories = ['salario','alimentacao','transporte','lazer','outros'];
  const data = categories.map(cat => transactions.filter(t => t.category === cat && t.type==='expense').reduce((acc,t)=>acc+t.amount,0));

  if(chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Salário','Alimentação','Transporte','Lazer','Outros'],
      datasets: [{
        data: data,
        backgroundColor: ['#4caf50','#ff9800','#2196f3','#9c27b0','#607d8b']
      }]
    }
  });
}

// Progress
function updateProgress(){
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const progress = income ? Math.min((income - expense)/income*100, 100) : 0;
  progressBar.style.width = progress + '%';
}

addBtn.addEventListener('click', addTransaction);

// Inicialização
renderTransactions();
updateBalance();
updateChart();
updateProgress();
