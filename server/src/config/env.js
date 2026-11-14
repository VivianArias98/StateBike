//Lee y valida las variables de entorno una sola vez
function requerida(nombre) {
    const valor = process.env[nombre];
    if (!valor) throw new Error(`Falta la variable de entorno ${nombre}`);
    return valor;
  }
  
  export const env = {
    puerto: Number(process.env.PORT ?? 4000),
    entorno: process.env.NODE_ENV ?? "development",
    origenFront: process.env.FRONT_ORIGIN ?? "http://localhost:5173",
    dbArchivo: process.env.DB_FILE ?? "./server/data/stationbike.db",
    tunjaApi: process.env.TUNJA_API ?? "https://nfc.multimediaudeb.com/api/v1",
    tunjaClave: requerida("TUNJA_CLAVE"),
    claveInterna: requerida("CLAVE_INTERNA"),
  };