const FORMATO_UID = /^[0-9A-F]{4,32}$/; // mismo formato que acepta TunjaAPI

// Deja el UID como lo entrega la ponte: mayúsculas, sin espacios ni separadores
export const normalizarUid = (texto) => String(texto ?? "").replace(/[\s:-]/g, "").toUpperCase();

export const esUidValido = (uid) => FORMATO_UID.test(uid);