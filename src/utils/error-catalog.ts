export const ERROR_CATALOG = {
    "autentication": {
        "AUTH001": {
            "code": "AUTH001",
            "message": "Credenciales Incorrectas",
            "status": 401
        },
        "AUTH002": {
            "code": "AUTH002",
            "message": "El email que has ingresado ya existe",
            "status": 409
        },
        "AUTH003": {
            "code": "AUTH003",
            "message": "El token de autenticación ha expirado",
            "status": 401
        },
        "AUTH004": {
            "code": "AUTH004",
            "message": "Token invalido o manipulado",
            "status": 401
        },
        "AUTH005": {
            "code": "AUTH005",
            "message": "Cuenta desactivada o bloqueada",
            "status": 403
        },
        "AUTH006": {
            "code": "AUTH006",
            "message": "Demasiadas solicitudes, por favor intente más tarde",
            "status": 429
        },
        "AUTH007": {
            "code": "AUTH007",
            "message": "Error al tratar de registrarte",
            "status": 500
        },
        "AUTH008": {
            "code": "AUTH008",
            "message": "El usuario que has ingresado ya existe",
            "status": 409
        },
        "AUTH009": {
            "code": "AUTH009",
            "message": "Error al tratar de iniciar sesión",
            "status": 500
        },
        "AUTH010": {
            "code": "AUTH010",
            "message": "Error al tratar de generar el código de verificación",
            "status": 500
        },
        "AUTH011": {
            "code": "AUTH011",
            "message": "No existe un codigo de verificación para el usuario",
            "status": 404
        },
        "AUTH012": {
            "code": "AUTH012",
            "message": "El código de verificación es incorrecto",
            "status": 403
        },
        "AUTH013": {
            "code": "AUTH013",
            "message": "El código de verificación ha expirado",
            "status": 403
        },
        "AUTH014": {
            "code": "AUTH014",
            "message": "Usuario no encontrado",
            "status": 404
        },
        "AUTH015": {
            "code": "AUTH015",
            "message": "No contiene la cabecera de autorización",
            "status": 500
        },
        "AUTH016": {
            "code": "AUTH016",
            "message": "No tienes permisos para acceder a este sistema",
            "status": 403
        }
    },
    "validation": {
        "VAL001": {
            "code": "VAL001",
            "message": "Campo obligatorio faltante: {field}",
            "status": 400
        },
        "VAL002": {
            "code": "VAL002",
            "message": "Formato invalido para el campo: {field}",
            "status": 400
        },
        "VAL003": {
            "code": "VAL003",
            "message": "El valor del campo {field} debe ser único",
            "status": 400
        },
        "VAL004": {
            "code": "VAL004",
            "message": "El campo {field} debe ser un valor booleano (true/false)",
            "status": 400
        },
        "VAL005": {
            "code": "VAL005",
            "message": "El campo {field} debe contener solo letras",
            "status": 400
        },
        "VAL006": {
            "code": "VAL006",
            "message": "El campo {field} contiene caracteres especiales no permitidos",
            "status": 400
        },
        "VAL007": {
            "code": "VAL007",
            "message": (min: number) => {
                return `El campo {field} debe tener al menos ${min} caracteres`
            },
            "status": 400
        },
        "VAL008": {
            "code": "VAL008",
            "message": (max: number) => {
                return `El campo {field} no debe superar los ${max} caracteres`
            },
            "status": 400
        },
        "VAL009": {
            "code": "VAL009",
            "message": "El campo {field} debe ser una fecha válida en formato YYYY-MM-DD",
            "status": 400
        },
        "VAL010": {
            "code": "VAL010",
            "message": "El campo {field} debe ser un email valido",
            "status": 400
        },
        "VAL011": {
            "code": "VAL011",
            "message": "El campo placa debe tener el formato AAA-000-A",
            "status": 400
        },
        "VAL012": {
            "code": "VAL012",
            "message": "El campo {field} debe de ser VISION_PARKING_WEB, VISION_PARKING_DESKTOP o VISION_PARKING_MOVIL",
            "status": 400
        },
        "VAL013": {
            "code": "VAL013",
            "message": "Si tu proyecto es VISION_PARKING_WEB, debes de enviar el campo cmp_id",
            "status": 400
        },
    },
    "businessLogic": {
        "LNG001": {
            "code": "LNG001",
            "message": "Empresa no encontrada",
            "status": 404
        },
        "LNG002": {
            "code": "LNG002",
            "message": "El nombre de la empresa ya existe",
            "status": 409
        },
        "LNG003": {
            "code": "LNG003",
            "message": "No se pudo crear la empresa",
            "status": 500
        },
        "LNG004": {
            "code": "LNG004",
            "message": "Estacionamiento no encontrado",
            "status": 404
        },
        "LNG005": {
            "code": "LNG005",
            "message": "Estacionamiento sin cajones disponibles",
            "status": 409
        },
        "LNG006": {
            "code": "LNG006",
            "message": "Estacionamiento no disponible",
            "status": 500
        },
        "LNG007": {
            "code": "LNG007",
            "message": "Cajón no encontrado",
            "status": 404
        },
        "LNG008": {
            "code": "LNG008",
            "message": "El cajon ya se encuentra asignado",
            "status": 409
        },
        "LNG009": {
            "code": "LNG009",
            "message": "No hay cajones disponibles",
            "status": 409
        },
        "LNG010": {
            "code": "LNG010",
            "message": "Vehículo no encontrado",
            "status": 404
        },
        "LNG011": {
            "code": "LNG011",
            "message": "Placa ya registrada",
            "status": 409
        },
        "LNG012": {
            "code": "LNG012",
            "message": "Usuario no tiene vehículos registrados",
            "status": 404
        },
        "LNG013": {
            "code": "LNG013",
            "message": "Reservación no encontrada",
            "status": 404
        },
        "LNG014": {
            "code": "LNG014",
            "message": "La reservación ya ha sido cancelada",
            "status": 409
        },
        "LNG015": {
            "code": "LNG015",
            "message": "No se puede reservar el cajón",
            "status": 409
        },
        "LNG016": {
            "code": "LNG016",
            "message": "No se puede cancelar la reservación",
            "status": 403
        },
        "LNG017": {
            "code": "LNG017",
            "message": "Cancelación fuera del periodo permitido",
            "status": 403
        },
        "LNG018": {
            "code": "LNG018",
            "message": "Rol no encontrado",
            "status": 404
        },
        "LNG019": {
            "code": "LNG019",
            "message": "Tag RFID no encontrado",
            "status": 404
        },
        "LNG020": {
            "code": "LNG020",
            "message": "Tag RFID ya se encuentra asignado",
            "status": 409
        },
        "LNG021": {
            "code": "LNG021",
            "message": "El usuario no tiene asignado un tag RFID",
            "status": 403
        },
        "LNG022": {
            "code": "LNG022",
            "message": "Archivo no encontrado",
            "status": 404
        },
        "LNG023": {
            "code": "LNG023",
            "message": "Formato de archivo invalido",
            "status": 400
        },
        "LNG024": {
            "code": "LNG024",
            "message": "Error al subir el archivo",
            "status": 500
        },
        "LNG025": {
            "code": "LNG025",
            "message": "Ya existe una solicitud pendiente",
            "status": 409
        },
        "LNG026": {
            "code": "LNG026",
            "message": "Error al registrar la solicitud",
            "status": 500
        },
        "LNG027": {
            "code": "LNG027",
            "message": "Maximo de vehiculos alcanzado",
            "status": 409
        },
        "LNG028": {
            "code": "LNG028",
            "message": "Sensor no encontrado",
            "status": 404
        },
        "LNG029": {
            "code": "LNG029",
            "message": "Cliente no encontrado",
            "status": 404
        },
        "LNG030": {
            "code": "LNG030",
            "message": "Error al tratar de eliminar la empresa",
            "status": 500
        },
        "LNG031": {
            "code": "LNG031",
            "message": "Error al tratar de eliminar el vehículo",
            "status": 500
        },
        "LNG032": {
            "code": "LNG032",
            "message": "Error al tratar de eliminar el estacionamiento",
            "status": 500
        },
        "LNG033": {
            "code": "LNG033",
            "message": "Error al tratar de eliminar el cajón",
            "status": 500
        },
        "LNG034": {
            "code": "LNG034",
            "message": "Error al tratar de eliminar la solicitud",
            "status": 500
        },
        "LNG035": {
            "code": "LNG035",
            "message": "Error al tratar de crear la compania",
            "status": 500
        },
        "LNG036": {
            "code": "LNG036",
            "message": "Compañia no encontrada",
            "status": 404
        },
        "LNG037": {
            "code": "LNG037",
            "message": "Error al tratar de actualizar la compañia",
            "status": 500
        },
        "LNG038": {
            "code": "LNG038",
            "message": "Error al tratar de eliminar la compañia",
            "status": 500
        },
        "LNG039": {
            "code": "LNG039",
            "message": "Error al tratar de crear el cliente",
            "status": 500
        },
        "LNG040": {
            "code": "LNG040",
            "message": "Error al tratar de actualizar el cliente",
            "status": 500
        },
        "LNG041": {
            "code": "LNG041",
            "message": "Error al tratar de eliminar el cliente",
            "status": 500
        },
        "LNG042": {
            "code": "LNG042",
            "message": "Error al tratar de crear el vehículo",
            "status": 500
        },
        "LNG043": {
            "code": "LNG043",
            "message": "Vehículo no encontrado",
            "status": 404
        },
        "LNG044": {
            "code": "LNG044",
            "message": "Error al tratar de actualizar el vehículo",
            "status": 500
        },
        "LNG045": {
            "code": "LNG045",
            "message": "Error al tratar de crear el estacionamiento",
            "status": 500
        },
        "LNG046": {
            "code": "LNG046",
            "message": "Estacionamiento no encontrado",
            "status": 404
        },
        "LNG047": {
            "code": "LNG047",
            "message": "Error al tratar de actualizar el estacionamiento",
            "status": 500
        },
        "LNG048": {
            "code": "LNG048",
            "message": "Error al tratar de crear el cajón",
            "status": 500
        },
        "LNG049": {
            "code": "LNG049",
            "message": "Cajón no encontrado",
            "status": 404
        },
        "LNG050": {
            "code": "LNG050",
            "message": "Error al tratar de actualizar el cajón",
            "status": 500
        },
        "LNG051": {
            "code": "LNG051",
            "message": "Error al tratar de crear la reserva",
            "status": 500
        },
        "LNG052": {
            "code": "LNG052",
            "message": "Reserva no encontrada",
            "status": 404
        },
        "LNG053": {
            "code": "LNG053",
            "message": "Error al tratar de actualizar la reserva",
            "status": 500
        },
        "LNG054": {
            "code": "LNG054",
            "message": "Error al tratar de eliminar la reserva",
            "status": 500
        },
        "LNG055": {
            "code": "LNG055",
            "message": "Error al tratar de crear la asignación RFID",
            "status": 500
        },
        "LNG056": {
            "code": "LNG056",
            "message": "Asignación RFID no encontrada",
            "status": 404
        },
        "LNG057": {
            "code": "LNG057",
            "message": "Error al tratar de actualizar la asignación RFID",
            "status": 500
        },
        "LNG058": {
            "code": "LNG058",
            "message": "Error al tratar de eliminar la asignación RFID",
            "status": 500
        },
        "LNG059": {
            "code": "LNG059",
            "message": "Error al tratar de crear la asignación de cajón",
            "status": 500
        },
        "LNG060": {
            "code": "LNG060",
            "message": "Asignación de cajón no encontrada",
            "status": 404
        },
        "LNG061": {
            "code": "LNG061",
            "message": "Error al tratar de actualizar la asignación de cajón",
            "status": 500
        },
        "LNG062": {
            "code": "LNG062",
            "message": "Error al tratar de eliminar la asignación de cajón",
            "status": 500
        },
        "LNG063": {
            "code": "LNG063",
            "message": "Solicitud de acceso no encontrada",
            "status": 404
        },
        "LNG064": {
            "code": "LNG064",
            "message": "Error al tratar de actualizar la solicitud de acceso",
            "status": 500
        },
        "LNG065": {
            "code": "LNG065",
            "message": "Error al tratar de consultar los vehiculos",
            "status": 500
        },
        "LNG066": {
            "code": "LNG066",
            "message": "Haz excedido el límite de vehículos permitidos por usuario",
            "status": 409
        },
        "LNG067": {
            "code": "LNG067",
            "message": "Error al tratar de asignar el vehículo al usuario",
            "status": 500
        },
        "LNG068": {
            "code": "LNG068",
            "message": "Cliente ya registrado",
            "status": 409
        },
        "LNG069": {
            "code": "LNG069",
            "message": "Error al tratar de consultar las compañias - empresas",
            "status": 500
        },
        "LNG070": {
            "code": "LNG070",
            "message": "Error al tratar de consultar los estacionamientos",
            "status": 500
        },
        "LNG071": {
            "code": "LNG071",
            "message": "Error al tratar de consultar los cajones",
            "status": 500
        },
        "LNG072": {
            "code": "LNG072",
            "message": "Estatus no encontrado",
            "status": 404
        },
        "LNG073": {
            "code": "LNG073",
            "message": "Error al tratar de aceptar la reservación",
            "status": 500
        },
        "LNG074": {
            "code": "LNG074",
            "message": "Error al tratar de rechazar la reservación",
            "status": 500
        },
        "LNG075": {
            "code": "LNG075",
            "message": "Error al tratar de aceptar la solicitud de acceso",
            "status": 500
        },
        "LNG076": {
            "code": "LNG076",
            "message": "Error al tratar de rechazar la solicitud de acceso",
            "status": 500
        },
        "LNG077": {
            "code": "LNG077",
            "message": "Error al tratar de consultar la compañia del usuario",
            "status": 500
        },
        "LNG078": {
            "code": "LNG078",
            "message": "Error al tratar de asignar el usuario a la compañia",
            "status": 500
        },
        "LNG079": {
            "code": "LNG079",
            "message": "Error al tratar de consultar los usuarios de la compañia",
            "status": 500
        },
        "LNG080": {
            "code": "LNG080",
            "message": "Error al tratar de crear el tag RFID",
            "status": 500
        },
        "LNG081": {
            "code": "LNG081",
            "message": "Error al tratar de consultar los tags RFID de la compañia",
            "status": 500
        },
        "LNG082": {
            "code": "LNG082",
            "message": "Error al tratar de consultar las asignaciones RFID de la compañia",
            "status": 500
        },
        "LNG083": {
            "code": "LNG083",
            "message": "Error al tratar de consultar las solicitudes de acceso pendientes de la compañia",
            "status": 500
        },
        "LNG084": {
            "code": "LNG084",
            "message": "Error al tratar de terminar la configuración inicial",
            "status": 500
        },
    }
}

export const FIELD_NAMES: Record<string, string> = {
    "usr_name": "Usuario",
    "usr_email": "Correo electrónico",
    "usr_password": "Contraseña",
    "cmp_name": "Nombre de la compañia",
    "veh_plate": "Placa del vehículo",
    "veh_brand": "Marca del vehículo",
    "veh_model": "Modelo del vehículo",
    "veh_color": "Color del vehículo",
    "veh_year": "Año del vehículo",
    "rol_name": "Nombre del rol",
    "rft_tag": "Tag RFID",
    "per_name": "Nombre del permiso",
    "per_description": "Descripción del permiso",
    "cte_name": "Nombre del cliente",
    "cte_phone": "Celular del cliente",
    "cte_email": "Email del cliente",
    "cte_address": "Dirección del cliente",
    "cte_zipcode": "Codigo postal del cliente",
    "pkl_name": "Nombre del estacionamiento",
    "rsv_initial_date": "Fecha inicio de la reservación",
    "rsv_final_date": "Fecha fin de la reservación",
    "rsv_reason": "Razon de la reservación",
    "rsc_description": "Razon de la cancelación",
    "cma_description": "Razon de la solicitud de acceso",
    "pry_name": "Nombre del proyecto",
    "cod_code": "Código de verificación",
}