import { Resend } from "resend";

const serverResend = new Resend("re_BBqbLVjN_7QjJ7J9nopq8jdbqPwctZQsM");

export const sendMailFunction = async (email, motive, message) => {
    
    try {
        // Enviar el correo electrónico de manera asíncrona
        await serverResend.emails.send({
            from: `${email}`,
            to: 'jlproducciones96@gmail.com',
            subject: `${motive}`,
            html: `${message}`
        });

        // Si el correo se envía correctamente, responder con un código 200 y un mensaje
        res.status(200).send("Correo electrónico enviado correctamente");
    } catch (error) {
        // Si ocurre algún error, responder con un código 500 y un mensaje de error
        console.error("Error al enviar correo electrónico:", error);
        res.status(500).send("Error del servidor para envío de correo electrónico: " + error.message);
    }
}