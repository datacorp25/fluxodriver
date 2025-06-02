
let records = JSON.parse(localStorage.getItem("records")) || [];

function addRecord() {
  const date = new Date().toISOString().split("T")[0];
  const km = parseFloat(document.getElementById("km").value) || 0;
  const gross = parseFloat(document.getElementById("gross").value) || 0;
  const tips = parseFloat(document.getElementById("tips").value) || 0;
  const fuel = parseFloat(document.getElementById("fuel").value) || 0;
  const food = parseFloat(document.getElementById("food").value) || 0;
  const other = parseFloat(document.getElementById("other").value) || 0;

  const income = gross + tips;
  const expenses = fuel + food + other;
  const net = income - expenses;

  const record = { date, km, income, expenses, net };
  records.push(record);
  localStorage.setItem("records", JSON.stringify(records));
  updateTable();
}

function updateTable() {
  const table = document.getElementById("recordsTable");
  table.innerHTML = "";
  records.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2 text-sm">${r.date}</td>
      <td class="p-2 text-sm">${r.km.toFixed(1)} km</td>
      <td class="p-2 text-sm">R$ ${r.income.toFixed(2)}</td>
      <td class="p-2 text-sm">R$ ${r.expenses.toFixed(2)}</td>
      <td class="p-2 text-sm">R$ ${r.net.toFixed(2)}</td>
    `;
    table.appendChild(row);
  });
}

window.onload = updateTable;
