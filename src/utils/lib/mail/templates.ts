const codeTemplate = (code: number) => {
    return `
        <html>
            <head>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    padding: 20px;
                    color: #333;
                }

                .container {
                    max-width: 500px;
                    margin: 0 auto;
                    background-color: #fff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                h1 {
                    color: #2c3e50;
                }

                .code {
                    font-size: 24px;
                    font-weight: bold;
                    color: #1abc9c;
                    margin: 20px 0;
                }

                .expiration {
                    color: #888;
                    font-size: 14px;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <h1>Tu código de verificación</h1>
                <p>Tu código de verificación es:</p>
                <div class="code">${code}</div>
                <p class="expiration">Este código expira en 5 minutos.</p>
                </div>
            </body>
        </html>
    `;
}

const changePasswordTemplate = () => {
    return `
        <html>
            <head>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    padding: 20px;
                    color: #333;
                }
                .container {
                    max-width: 500px;
                    margin: 0 auto;
                    background-color: #fff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                h1 {
                    color: #2c3e50;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Cambio de contraseña exitoso</h1>
                    <p>Tu contraseña ha sido cambiada correctamente. Si no realizaste esta acción, por favor contacta con el soporte.</p>
                </div>
            </body>
        </html>`
}

const credentialsTemplate = (username: string, email: string, password: string) => {
    return `
          <html>
            <head>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #fff;
                    text-align: center;
                    padding: 40px 30px;
                }
                .logo {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 20px;
                    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .logo-text {
                    color: #fff;
                    font-size: 32px;
                    font-weight: bold;
                }
                .wifi-icon {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 24px;
                    height: 24px;
                    background-color: #fbbf24;
                    border-radius: 50%;
                }
                .car-icon {
                    position: absolute;
                    bottom: 8px;
                    right: 8px;
                    color: #fbbf24;
                    font-size: 16px;
                }
                h1 {
                    color: #333;
                    font-size: 18px;
                    margin: 0;
                    line-height: 1.4;
                }
                .content {
                    padding: 0 30px 30px;
                    text-align: center;
                }
                .credentials-box {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: left;
                }
                .credential-item {
                    margin: 10px 0;
                    font-size: 14px;
                }
                .credential-label {
                    font-weight: bold;
                    color: #555;
                }
                .credential-value {
                    color: #333;
                    font-family: monospace;
                    background-color: #fff;
                    padding: 4px 8px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                    display: inline-block;
                    margin-left: 10px;
                }
                .warning {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 20px 0;
                    font-size: 14px;
                    text-align: left;
                }
                .warning-icon {
                    color: #f39c12;
                    margin-right: 8px;
                }
                .link {
                    color: #3b82f6;
                    text-decoration: none;
                    font-weight: bold;
                }
                .link:hover {
                    text-decoration: underline;
                }
                .footer {
                    background-color: #1f2937;
                    color: #fff;
                    text-align: center;
                    padding: 40px 30px;
                }
                .footer-logo {
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 20px;
                    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .footer-logo-text {
                    color: #fff;
                    font-size: 24px;
                    font-weight: bold;
                }
                .footer-brand {
                    color: #fbbf24;
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                .footer-links {
                    display: flex;
                    justify-content: space-between;
                    gap: 40px;
                    flex-wrap: wrap;
                }
                p {
                    font-size: 14px;
                    line-height: 1.6;
                    margin: 15px 0;
                }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">
                            <div class="logo-text">P</div>
                            <div class="wifi-icon"></div>
                            <div class="car-icon">🚗</div>
                        </div>
                        <h1>Hola ${username},<br>¡Bienvenido a Vision Parking!</h1>
                    </div>
                    
                    <div class="content">
                        <p>Hemos creado tu cuenta y a continuación te compartimos tus credenciales de acceso:</p>
                        
                        <div class="credentials-box">
                            <div class="credential-item">
                                <span class="credential-label">Usuario:</span>
                                <span class="credential-value">${email}</span>
                            </div>
                            <div class="credential-item">
                                <span class="credential-label">Contraseña temporal:</span>
                                <span class="credential-value">${password}</span>
                            </div>
                        </div>
                        
                        <div class="warning">
                            <span class="warning-icon">⚠️</span>
                            <strong>Importante:</strong> Por seguridad, te recomendamos cambiar tu contraseña la primera vez que inicies sesión.
                            Puedes acceder al sistema desde el siguiente enlace:
                        </div>
                        
                        <p>
                            👉 <a href="https://visionparking.com/login" class="link">https://visionparking.com/login</a>
                        </p>
                        
                        <p>Si tienes alguna duda o necesitas asistencia, no dudes en contactarnos.<br>
                        ¡Nos alegra tenerte con nosotros!</p>
                        
                        <p><strong>Saludos cordiales</strong></p>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="footer-logo">
                        <div class="footer-logo-text">P</div>
                    </div>
                    <div class="footer-brand">Vision Parking</div>
                    <div class="footer-links">
                        <span>Política de privacidad</span>
                        <span>Contáctanos</span>
                        <span>Términos y Condiciones</span>
                    </div>
                </div>
            </body>
        </html>
    `
}

export const mailTemplates = {
    codeTemplate,
    changePasswordTemplate,
    credentialsTemplate
}