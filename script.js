
const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const mainPage = document.getElementById("mainPage");
const blockedPage = document.getElementById("blockedPage");

function showLogin() {
  loginPage.innerHTML = `
    <div class="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
      <h1 class="text-2xl font-bold mb-4">FLUXODRIVER</h1>
      <input id="username" type="text" placeholder="Usuário" class="w-full p-2 border mb-2 rounded" />
      <input id="password" type="password" placeholder="Senha" class="w-full p-2 border mb-4 rounded" />
      <button onclick="login()" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Entrar</button>
      <button onclick="showRegister()" class="w-full mt-2 bg-gray-300 py-2 rounded">Cadastrar</button>
      <p id="loginError" class="text-red-500 text-sm mt-2 hidden">Usuário ou senha inválidos.</p>
    </div>
  `;
}

function showRegister() {
  loginPage.classList.add("hidden");
  registerPage.classList.remove("hidden");
  registerPage.innerHTML = `
    <div class="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
      <h1 class="text-2xl font-bold mb-4">Cadastro</h1>
      <input id="newUsername" type="text" placeholder="Novo usuário" class="w-full p-2 border mb-2 rounded" />
      <input id="newPassword" type="password" placeholder="Nova senha" class="w-full p-2 border mb-4 rounded" />
      <button onclick="register()" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Cadastrar</button>
      <button onclick="showLoginBack()" class="w-full mt-2 bg-gray-300 py-2 rounded">Voltar</button>
      <p id="registerError" class="text-red-500 text-sm mt-2 hidden">Usuário já existe ou inválido.</p>
    </div>
  `;
}

function showLoginBack() {
  registerPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
  showLogin();
}

function register() {
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;
  if (!username || !password) {
    document.getElementById("registerError").classList.remove("hidden");
    return;
  }
  localStorage.setItem("user", JSON.stringify({ username, password, startTime: new Date().toISOString() }));
  localStorage.setItem("isAuthenticated", "true");
  showMainPage();
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.username === username && user.password === password) {
    localStorage.setItem("isAuthenticated", "true");
    showMainPage();
  } else {
    document.getElementById("loginError").classList.remove("hidden");
  }
}

function showMainPage() {
  if (isExpired()) {
    loginPage.classList.add("hidden");
    blockedPage.classList.remove("hidden");
    blockedPage.innerHTML = `
      <div class="bg-white p-6 rounded shadow-md text-center max-w-md">
        <h2 class="text-xl font-bold text-red-600 mb-4">⏳ Período de Teste Expirado</h2>
        <p class="mb-4">Faça o pagamento único de R$19,90 para acesso vitalício:</p>
        <a href="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c938084970fb5df019732118be90d5b" target="_blank" class="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Liberar Acesso Vitalício
        </a>
      </div>
    `;
    return;
  }

  loginPage.classList.add("hidden");
  registerPage.classList.add("hidden");
  blockedPage.classList.add("hidden");
  mainPage.classList.remove("hidden");

  const registros = JSON.parse(localStorage.getItem("registros") || "[]");
  const tabela = registros.map(r => 
    `<tr><td>${r.data}</td><td>${r.km}</td><td>R$${r.ganhos}</td><td>R$${r.gastos}</td><td>R$${r.lucro}</td></tr>`
  ).join('');

  mainPage.innerHTML = `
    <h2 class="text-2xl font-bold text-center mb-4">FLUXODRIVER - Registro</h2>
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
      <input id="km" type="number" placeholder="KM Rodados" class="p-2 border rounded" />
      <input id="ganhos" type="number" placeholder="Ganhos Brutos (R$)" class="p-2 border rounded" />
      <input id="gorjetas" type="number" placeholder="Gorjetas (R$)" class="p-2 border rounded" />
      <input id="gastos" type="number" placeholder="Gastos Totais (R$)" class="p-2 border rounded" />
    </div>
    <button onclick="adicionar()" class="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700">Adicionar</button>
    <button onclick="logout()" class="w-full bg-red-500 text-white py-2 rounded mt-2 hover:bg-red-600">Sair</button>
    <div class="mt-6 bg-white p-4 rounded shadow">
      <h3 class="text-lg font-semibold mb-2">Registros</h3>
      <table class="w-full text-sm">
        <thead><tr><th>Data</th><th>KM</th><th>Ganhos</th><th>Gastos</th><th>Lucro</th></tr></thead>
        <tbody>${tabela}</tbody>
      </table>
    </div>
  `;
}

function adicionar() {
  const data = new Date().toLocaleDateString();
  const km = parseFloat(document.getElementById("km").value) || 0;
  const ganhos = parseFloat(document.getElementById("ganhos").value) || 0;
  const gorjetas = parseFloat(document.getElementById("gorjetas").value) || 0;
  const gastos = parseFloat(document.getElementById("gastos").value) || 0;
  const totalGanhos = ganhos + gorjetas;
  const lucro = totalGanhos - gastos;

  const registros = JSON.parse(localStorage.getItem("registros") || "[]");
  registros.push({ data, km, ganhos: totalGanhos.toFixed(2), gastos: gastos.toFixed(2), lucro: lucro.toFixed(2) });
  localStorage.setItem("registros", JSON.stringify(registros));
  showMainPage();
}

function logout() {
  localStorage.setItem("isAuthenticated", "false");
  location.reload();
}

function isExpired() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.startTime) return false;
  const start = new Date(user.startTime).getTime();
  const now = new Date().getTime();
  const diff = (now - start) / (1000 * 60 * 60);
  return diff >= 24;
}

if (localStorage.getItem("isAuthenticated") === "true") {
  showMainPage();
} else {
  showLogin();
}
