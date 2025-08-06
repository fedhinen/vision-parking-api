import nodemailer from "nodemailer"

export const sendEmail = async (mailOptions: any) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || "587"),
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw error
    }
}

export const generateRandomUsername = (companyName: string, userNumber: number) => {
    const nameParts = companyName.trim().split(/\s+/);
    let companyNamePart = '';

    if (nameParts.length === 1) {
        companyNamePart = nameParts[0].slice(0, 3).toUpperCase();
    } else {
        companyNamePart = nameParts.map(word => word[0].toUpperCase()).join('');
    }

    return `${companyNamePart} - Guardia00${userNumber}`
}

export const generateRandomEmail = (companyName: string, userNumber: number) => {
    const nameParts = companyName.trim().split(/\s+/);
    let companyNamePart = '';

    if (nameParts.length === 1) {
        companyNamePart = nameParts[0].slice(0, 3).toLowerCase();
    } else {
        companyNamePart = nameParts.map(word => word[0].toLowerCase()).join('');
    }

    return `${companyNamePart}.guardia.00${userNumber}@gmail.com`
}