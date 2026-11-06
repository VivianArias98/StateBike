const API_BASE = 'https://nfc.multimediaudeb.com/api/v1';

const getApiKey = () => localStorage.getItem('stationbike_api_key') || 'tk_demo_12345';
const getAuthToken = () => localStorage.getItem('stationbike_token') || '';

export async function fetchWallet() {
  const response = await fetch(`${API_BASE}/wallet`, {
    headers: {
      'X-API-Key': getApiKey(),
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  if (!response.ok) throw new Error('Error al consultar la billetera');
  return await response.json();
}

export async function fetchMovements(limite = 50, desde = 0) {
  const response = await fetch(`${API_BASE}/wallet/movements?limite=${limite}&desde=${desde}`, {
    headers: {
      'X-API-Key': getApiKey(),
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  if (!response.ok) throw new Error('Error al consultar los movimientos');
  return await response.json();
}

export async function topupWallet(monto, canal = 'PSE') {
  const response = await fetch(`${API_BASE}/wallet/topup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': getApiKey(),
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ monto, canal })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al procesar la recarga');
  return data;
}

export async function chargeWallet(monto, concepto, viajeId) {
  const response = await fetch(`${API_BASE}/wallet/charge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': getApiKey(),
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ monto, concepto, viajeId })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al procesar el pago del cobro');
  return data;
}