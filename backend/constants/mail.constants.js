const getRecoverCodeMail = (recoverCode, expiresAt) => {
    const currentDate = new Date(Date.now());
    const minutesRemaining = (expiresAt - currentDate) / 60000;

    return `<section>
        <p>Se ha enviado una petición de cambio de contraseña en tu cuenta.</p>
        <p>Para cambiar la contraseña, introduce el siguiente codigo en el formulario indicado en la pagina web:</p>
        
        <h2>${recoverCode}</h2>
        
        <p>El codigo caducará en <b>${Math.round(minutesRemaining)} minutos</b>.</p>
    </section>`;

}

module.exports = {
    getRecoverCodeMail
}