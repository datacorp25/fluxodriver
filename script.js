
document.getElementById("app").innerHTML = `
  <div class='grid gap-4'>
    <input type='number' id='km' placeholder='KM Rodados' class='input'>
    <input type='number' id='ganho' placeholder='Ganhos Brutos (R$)' class='input'>
    <input type='number' id='gastos' placeholder='Gastos Totais (R$)' class='input'>
    <button onclick='adicionar()' class='btn'>Adicionar</button>
    <div id='resultado' class='mt-4 text-gray-700'></div>
    <a href='https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c938084970fb5df019732118be90d5b' target='_blank' class='btn bg-green-600 hover:bg-green-700'>Liberar Acesso Vitalício</a>
  </div>
`;

function adicionar() {
  const km = parseFloat(document.getElementById("km").value) || 0;
  const ganho = parseFloat(document.getElementById("ganho").value) || 0;
  const gastos = parseFloat(document.getElementById("gastos").value) || 0;
  const lucro = ganho - gastos;

  document.getElementById("resultado").innerHTML = \`
    <p><strong>KM:</strong> \${km}</p>
    <p><strong>Ganhos:</strong> R$ \${ganho.toFixed(2)}</p>
    <p><strong>Gastos:</strong> R$ \${gastos.toFixed(2)}</p>
    <p><strong>Lucro:</strong> R$ \${lucro.toFixed(2)}</p>
  \`;
}
