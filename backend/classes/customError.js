// Se ha creado esta clase para distinguir los errores
// que lanza Node con los que se lanzan a proposito en un throw.
// Este tipo de errores suelen tener que ver con validaciones.
class CustomError {
    constructor(message) {
        this.message = message;
    }
}

module.exports = CustomError