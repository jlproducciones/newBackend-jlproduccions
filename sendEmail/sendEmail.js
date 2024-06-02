import { Resend } from "resend";

const serverResend = new Resend("re_BBqbLVjN_7QjJ7J9nopq8jdbqPwctZQsM");

export const sendMailFunction = async (email, motive, message, callback) => {
    
    try {
        // Enviar el correo electrónico de manera asíncrona
        await serverResend.emails.send({
            from: `${email}`,
            to: 'jlproducciones96@gmail.com',
            subject: `${motive}`,
            html: `${message}`
        });

        // Si el correo se envía correctamente, llamar a la función de devolución de llamada con un código 200 y un mensaje
        callback(null, "Correo electrónico enviado correctamente");
    } catch (error) {
        // Si ocurre algún error, llamar a la función de devolución de llamada con un código 500 y un mensaje de error
        console.error("Error al enviar correo electrónico:", error);
        callback(error, "Error del servidor para envío de correo electrónico: " + error.message);
    }
}