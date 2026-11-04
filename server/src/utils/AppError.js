//Error controlado: lleva estado HTTP y un código en snake_case
export class AppError extends Error {
    constructor(estado, codigo, datos = {}) {
      super(codigo);
      this.estado = estado;
      this.codigo = codigo;
      this.datos = datos;
    }
  }