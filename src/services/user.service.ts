import { AuthError, InternalServerError } from "../middleware/error/error"
import { ERROR_CATALOG } from "../utils/error-catalog"
import { generateRandomEmail, generateRandomUsername, sendEmail } from "../utils/functions"
import { prisma } from "../utils/lib/prisma"
import argon2 from "argon2"
import jwt from "jsonwebtoken"
import { mailTemplates } from "../utils/lib/mail/templates"
import { companyService } from "./company.service"
import { Plataforma } from "@prisma/client"
import { clientService } from "./client.service"

const
  {
    AUTH001,
    AUTH002,
    AUTH007,
    AUTH008,
    AUTH009,
    AUTH010,
    AUTH011,
    AUTH012,
    AUTH013,
    AUTH014,
    AUTH016,
    AUTH017,
    AUTH019
  } = ERROR_CATALOG.autentication

const {
  LNG084,
  LNG085,
  LNG086
} = ERROR_CATALOG.businessLogic

const signup = async (body: any) => {
  const {
    usr_name,
    usr_email,
    usr_password,
    pry_name,
    cmp_id,
  } = body

  const hashedPassword = await argon2.hash(usr_password)

  const existUsers = await prisma.users.findFirst({
    where: {
      OR: [
        {
          usr_email,
        },
        {
          usr_name,
        },
      ],
    },
  });

  if (existUsers && existUsers.usr_name === usr_name) {
    throw new AuthError(AUTH008)
  } else if (existUsers && existUsers.usr_email === usr_email) {
    throw new AuthError(AUTH002)
  }

  const userData = {
    usr_name,
    usr_email,
    usr_password: hashedPassword,
    pry_name,
  }

  const newUser = await createUser(userData)

  if (newUser.pry_name === "VISION_PARKING_DESKTOP") {
    const userCompany = await companyService.addUserToCompany(newUser.usr_id, cmp_id)
    await sendCredentialsEmail({
      username: newUser.usr_name,
      email: newUser.usr_email,
      password: usr_password,
      emailTo: userCompany.company.clients[0].cte_email
    })
  } else if (newUser.pry_name === "VISION_PARKING_WEB") {
    await sendCredentialsEmail(
      {
        username: newUser.usr_name,
        email: newUser.usr_email,
        password: usr_password,
        emailTo: newUser.usr_email
      }
    )
  }

  return newUser
}

const signin = async (body: any) => {
  const { usr_email, usr_password, pry_name } = body;

  const isRegister = await userExists(usr_email, usr_password, pry_name)

  try {
    const userCode = await generateCode(isRegister)
    await sendCodeEmail(userCode.usr_email, userCode.cod_code)
    return {
      usr_id: isRegister.usr_id,
      usr_email: isRegister.usr_email
    }
  } catch (error) {
    console.log("signinError", error);
    throw new InternalServerError(AUTH009);
  }
};

const logout = async (userId: string) => {
  const user = await getUserById(userId)

  try {
    const activeToken = user.tokens.find(tok => tok.tok_active)

    await prisma.tokens.update({
      where: {
        tok_id: activeToken?.tok_id
      },
      data: {
        tok_active: false
      }
    })
  } catch (error) {
    throw new InternalServerError(AUTH017)
  }
}

const userExists = async (usr_email: string, usr_password: string, pry_name: Plataforma) => {
  try {
    const isRegister = await prisma.users.findUnique({
      where: {
        usr_email,
      },
    });

    if (!isRegister || !(await argon2.verify(isRegister.usr_password, usr_password))) {
      throw new AuthError(AUTH001);
    }

    if (pry_name !== isRegister?.pry_name) {
      throw new AuthError(AUTH016);
    }

    return isRegister
  } catch (error) {
    throw error
  }
}

const generateCode = async (isRegister: any) => {
  try {
    await prisma.user_codes.updateMany({
      where: {
        usr_id: isRegister.usr_id,
        cod_active: true,
      },
      data: {
        cod_active: false,
      },
    })

    const code = Math.floor(100000 + Math.random() * 900000)

    await prisma.user_codes.create({
      data: {
        usr_id: isRegister.usr_id,
        cod_code: await argon2.hash(code.toString()),
        cod_expiration_date: new Date(Date.now() + 1000 * 60 * 5),
        cod_active: true,
      }
    })

    return {
      usr_id: isRegister.usr_id,
      usr_email: isRegister.usr_email,
      cod_code: code
    }
  } catch (error) {
    console.log("generateCodeError", error);
    throw new InternalServerError(AUTH010)
  }
}

const sendCodeEmail = async (email: string, code: number) => {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Código de Verificación",
    html: mailTemplates.codeTemplate(code),
  };

  await sendEmail(mailOptions)
}

const verifyCode = async (body: any) => {
  const { usr_id, cod_code } = body;

  const userCode = await prisma.user_codes.findFirst({
    where: {
      usr_id,
      cod_active: true,
    },
  });

  if (!userCode) {
    throw new AuthError(AUTH011);
  }

  const isValid = await argon2.verify(userCode.cod_code, String(cod_code));

  if (!isValid) {
    throw new AuthError(AUTH012);
  }

  const isExpired = new Date() > userCode.cod_expiration_date;

  if (isExpired) {
    throw new AuthError(AUTH013);
  }

  await prisma.user_codes.update({
    where: {
      cod_id: userCode.cod_id,
    },
    data: {
      cod_active: false,
    },
  });

  return await generateToken(usr_id)
}

const generateToken = async (usr_id: string) => {
  const user = await getUserById(usr_id);
  let company = null

  const tokenIds = user.tokens.map((token: any) => token.tok_id);

  if (tokenIds.length > 0) {
    await prisma.tokens.delete({
      where: {
        tok_id: tokenIds[0],
      },
    });
  }

  const secretKey = process.env.JWT_KEY || "";

  const token = jwt.sign(
    { usr_id: user.usr_id },
    secretKey
  );

  const newToken = await prisma.tokens.create({
    data: {
      tok_token: token,
      usr_id: user.usr_id,
      tok_expiration_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    },
  });

  if (user.pry_name === "VISION_PARKING_DESKTOP") {
    company = await companyService.getCompanyByUserId(user.usr_id)
  } else if (user.pry_name === "VISION_PARKING_WEB") {
    company = await clientService.getClientCompanyByUserId(user.usr_id)
  }

  return {
    tok_token: newToken.tok_token,
    usr_id: newToken.usr_id,
    cmp_id: company ? company.cmp_id : null,
  };
}

const getUserById = async (usr_id: string) => {
  const user = await prisma.users.findUnique({
    where: {
      usr_id,
    },
    include: {
      tokens: true
    }
  });

  if (!user) {
    throw new AuthError(AUTH014);
  }

  return user;
}

const sendChangePasswordEmail = async (body: any) => {
  const { usr_email } = body;

  const user = await prisma.users.findUnique({
    where: {
      usr_email
    }
  })

  if (!user) {
    throw new AuthError(AUTH014)
  }

  const resetToken = await createResetPasswordToken(user.usr_id)

  const resetLink = `http://localhost:5173/reset-password?token=${resetToken.rpt_token}`

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: user?.usr_email,
    subject: "Reestablece tu contraseña",
    html: mailTemplates.changePasswordTemplate(resetLink),
  }

  sendEmail(mailOptions)
}

const createUser = async (body: any) => {
  const { usr_name, usr_email, usr_password, pry_name } = body
  try {
    const newUser = await prisma.users.create({
      data: {
        usr_name,
        usr_email,
        usr_password,
        pry_name
      },
      omit: {
        usr_password: true
      }
    })


    return newUser
  } catch (error) {
    console.log(error)
    throw new InternalServerError(AUTH007);
  }
}

const sendCredentialsEmail = async ({ username, email, password, emailTo }: {
  username: string,
  email: string,
  password: string,
  emailTo: string
}) => {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: emailTo,
    subject: "Tus credenciales de acceso",
    html: mailTemplates.credentialsTemplate(username, email, password),
  };

  await sendEmail(mailOptions)
}

const createDesktopUser = async (cmp_id: string) => {
  const company = await companyService.getCompanyById(cmp_id)

  const companyUsers = await companyService.getUsersByCompanyId(company.cmp_id)

  const existUsers = companyUsers.filter(user => user.pry_name === "VISION_PARKING_DESKTOP")

  const userNumber = existUsers.length === 0 ? 1 : existUsers.length + 1
  const usr_name = generateRandomUsername(company.cmp_name, userNumber)
  const usr_email = generateRandomEmail(company.cmp_name, userNumber)
  const usr_password = `VisionParking!${new Date().getFullYear()}`
  const pry_name = "VISION_PARKING_DESKTOP"

  const userData = {
    usr_name,
    usr_email,
    usr_password,
    cmp_id,
    pry_name,
  }

  const newUser = await signup(userData)
  return newUser
}

const getUserIsConfigurated = async (usr_id: string) => {
  const user = await getUserById(usr_id)

  try {
    const isConfigurated = await prisma.users.findUnique({
      where: {
        usr_id: user.usr_id
      },
      select: {
        usr_is_configured: true
      }
    })

    return isConfigurated?.usr_is_configured
  } catch (error) {
    throw new InternalServerError(LNG085)
  }
}

const movilUserConfigurated = async (usr_id: string) => {
  const user = await getUserById(usr_id)

  try {
    await prisma.users.update({
      where: {
        usr_id: user.usr_id
      },
      data: {
        usr_is_configured: true
      }
    })
  } catch (error) {
    throw new InternalServerError(LNG084)
  }
}

const getUserInfo = async (usr_id: string) => {
  const user = await getUserById(usr_id)

  try {
    const userInfo = await prisma.users.findUnique({
      where: {
        usr_id: user.usr_id
      },
      select: {
        usr_name: true,
        usr_email: true,
        usr_date: true,
      }
    })

    return userInfo
  } catch (error) {
    throw new InternalServerError(LNG086)
  }
}

const createResetPasswordToken = async (usr_id: string) => {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  try {
    const resetToken = prisma.reset_password_tokens.create({
      data: {
        usr_id,
        rpt_token: token,
        rpt_expiration_date: expiresAt,
      }
    })

    return resetToken
  } catch (error) {
    throw new InternalServerError(AUTH019)
  }
}

export const userService = {
  signup,
  signin,
  logout,
  verifyCode,
  getUserById,
  getUserInfo,
  createDesktopUser,
  movilUserConfigurated,
  getUserIsConfigurated,
  sendChangePasswordEmail
}