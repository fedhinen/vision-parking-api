export const ERROR_CATALOG = {
    "autentication": {
        "AUTH001": {
            "message": "Credenciales Incorrectas",
            "status": 401
        },
        "AUTH002": {
            "message": "El email que has ingresado ya existe",
            "status": 409
        },
        "AUTH003": {
            "message": "El token de autenticación ha expirado",
            "status": 401
        },
        "AUTH004": {
            "message": "Token invalido o manipulado",
            "status": 401
        },
        "AUTH005": {
            "message": "Cuenta desactivada o bloqueada",
            "status": 403
        },
        "AUTH006": {
            "message": "Demasiadas solicitudes, por favor intente más tarde",
            "status": 429
        },
        "AUTH007": {
            "message": "Error al tratar de registrarte",
            "status": 500
        },
        "AUTH008": {
            "message": "El usuario que has ingresado ya existe",
            "status": 409
        },
        "AUTH009": {
            "message": "Error al tratar de iniciar sesión",
            "status": 500
        },
        "AUTH010": {
            "message": "Error al tratar de generar el código de verificación",
            "status": 500
        },
        "AUTH011": {
            "message": "No existe un codigo de verificación para el usuario",
            "status": 404
        },
        "AUTH012": {
            "message": "El código de verificación es incorrecto",
            "status": 403
        },
        "AUTH013": {
            "message": "El código de verificación ha expirado",
            "status": 403
        },
        "AUTH014": {
            "message": "Usuario no encontrado",
            "status": 404
        },
        "AUTH015": {
            "message": "No contiene la cabecera de autorización",
            "status": 500
        }
    },
    "validation": {
        "VAL001": {
            "message": "Campo obligatorio faltante: {field}",
            "status": 400
        },
        "VAL002": {
            "message": "Formato invalido para el campo: {field}",
            "status": 400
        },
        "VAL003": {
            "message": "El valor del campo {field} debe ser único",
            "status": 400
        },
        "VAL004": {
            "message": "El campo {field} debe ser un valor booleano (true/false)",
            "status": 400
        },
        "VAL005": {
            "message": "El campo {field} debe contener solo letras",
            "status": 400
        },
        "VAL006": {
            "message": "El campo {field} contiene caracteres especiales no permitidos",
            "status": 400
        },
        "VAL007": {
            "message": (min: number) => {
                return `El campo {field} debe tener al menos ${min} caracteres`
            },
            "status": 400
        },
        "VAL008": {
            "message": (max: number) => {
                return `El campo {field} no debe superar los ${max} caracteres`
            },
            "status": 400
        },
        "VAL009": {
            "message": "El campo {field} debe ser una fecha válida en formato YYYY-MM-DD",
            "status": 400
        },
        "VAL010": {
            "message": "El campo {field} debe ser un email valido",
            "status": 400
        },
    },
    "businessLogic": {
        "LNG001": {
            "message": "Empresa no encontrada",
            "status": 404
        },
        "LNG002": {
            "message": "El nombre de la empresa ya existe",
            "status": 409
        },
        "LNG003": {
            "message": "No se pudo crear la empresa",
            "status": 500
        },
        "LNG004": {
            "message": "Estacionamiento no encontrado",
            "status": 404
        },
        "LNG005": {
            "message": "Estacionamiento sin cajones disponibles",
            "status": 409
        },
        "LNG006": {
            "message": "Estacionamiento no disponible",
            "status": 500
        },
        "LNG007": {
            "message": "Cajón no encontrado",
            "status": 404
        },
        "LNG008": {
            "message": "El cajon ya se encuentra asignado",
            "status": 409
        },
        "LNG009": {
            "message": "No hay cajones disponibles",
            "status": 409
        },
        "LNG010": {
            "message": "Vehículo no encontrado",
            "status": 404
        },
        "LNG011": {
            "message": "Placa ya registrada",
            "status": 409
        },
        "LNG012": {
            "message": "Usuario no tiene vehículos registrados",
            "status": 404
        },
        "LNG013": {
            "message": "Reservación no encontrada",
            "status": 404
        },
        "LNG014": {
            "message": "La reservación ya ha sido cancelada",
            "status": 409
        },
        "LNG015": {
            "message": "No se puede reservar el cajón",
            "status": 409
        },
        "LNG016": {
            "message": "No se puede cancelar la reservación",
            "status": 403
        },
        "LNG017": {
            "message": "Cancelación fuera del periodo permitido",
            "status": 403
        },
        "LNG018": {
            "message": "Rol no encontrado",
            "status": 404
        },
        "LNG019": {
            "message": "Tag RFID no encontrado",
            "status": 404
        },
        "LNG020": {
            "message": "Tag RFID ya se encuentra asignado",
            "status": 409
        },
        "LNG021": {
            "message": "El usuario no tiene asignado un tag RFID",
            "status": 403
        },
        "LNG022": {
            "message": "Archivo no encontrado",
            "status": 404
        },
        "LNG023": {
            "message": "Formato de archivo invalido",
            "status": 400
        },
        "LNG024": {
            "message": "Error al subir el archivo",
            "status": 500
        },
        "LNG025": {
            "message": "Ya existe una solicitud pendiente",
            "status": 409
        },
        "LNG026": {
            "message": "Error al registrar la solicitud",
            "status": 500
        },
        "LNG027": {
            "message": "Maximo de vehiculos alcanzado",
            "status": 409
        },
        "LNG028": {
            "message": "Sensor no encontrado",
            "status": 404
        },
        "LNG029": {
            "message": "Cliente no encontrado",
            "status": 404
        },
        "LNG030": {
            "message": "Error al tratar de eliminar la empresa",
            "status": 500
        },
        "LNG031": {
            "message": "Error al tratar de eliminar el vehículo",
            "status": 500
        },
        "LNG032": {
            "message": "Error al tratar de eliminar el estacionamiento",
            "status": 500
        },
        "LNG033": {
            "message": "Error al tratar de eliminar el cajón",
            "status": 500
        },
        "LNG034": {
            "message": "Error al tratar de eliminar la solicitud",
            "status": 500
        },
        "LNG035": {
            "message": "Error al tratar de crear la compania",
            "status": 500
        },
        "LNG036": {
            "message": "Compañia no encontrada",
            "status": 404
        },
        "LNG037": {
            "message": "Error al tratar de actualizar la compañia",
            "status": 500
        },
        "LNG038": {
            "message": "Error al tratar de eliminar la compañia",
            "status": 500
        }
    }
}

export const FIELD_NAMES: Record<string, string> = {
    "usr_name": "Usuario",
    "usr_email": "Correo electrónico",
    "usr_password": "Contraseña",
    "cmp_name": "Nombre de la empresa",
    "veh_plate": "Placa del vehículo",
    "veh_brand": "Marca del vehículo",
    "veh_model": "Modelo del vehículo",
    "veh_color": "Color del vehículo",
    "est_name": "Nombre del estacionamiento",
    "est_address": "Dirección del estacionamiento",
    "est_capacity": "Capacidad del estacionamiento",
    "est_status": "Estado del estacionamiento",
    "rol_name": "Nombre del rol",
    "tag_rfid": "Tag RFID"
}