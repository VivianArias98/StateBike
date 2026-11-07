//eEscapa los comodines de LIKE para que el texto buscado sea literal
export const escaparLike = (texto) => texto.replace(/[\\%_]/g, "\\$&");