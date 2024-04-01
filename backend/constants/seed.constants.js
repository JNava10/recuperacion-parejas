const {faker} = require('@faker-js/faker');
const Preference = require("../classes/preference");

// Información sobre los roles del sistema.
const roleNames = {
    admin: {
        name: 'admin', // Sería mejor idea introducir la estructura de estos objetos en una clase... (No estoy seguro)
        displayName: 'Admin'
    },
    noAdmin: {
        name: 'member',
        displayName: 'Miembro'
    }
}

// Tipos de configuración. Cada tipo es equivalente a un tipo de input HTML.
const settingTypes = {
    text: 'text',
    number: 'number',
    check: 'check',
    file: 'file'
};

// Valores que alteran el funcionamiento del sistema, que pueden ser configurados por un Administrador.
const defaultSettings = [
    {
        name: 'Foto de perfil por defecto',
        type: settingTypes.file,
        description: "Establece la foto que se asigna a los usuarios al registrarse, si ellos no suben ninguna.",
        default: faker.image.url({width: 300, height: 300})
    },
    {
        name: 'Limite maximo de amistades',
        description: "Establece un numero maximo de amistades. Si es 0, no existe limite.",
        type: settingTypes.number,
        default: "0"
    },
    {
        name: 'Habilitar usuarios automaticamente',
        description: "Si está activado, los usuarios se activan automaticamente sin necesidad de un administrador.",
        type: settingTypes.check,
        default: false
    },
    {
        name: 'Limite de caracteres por mensaje',
        description: "Establece un limite de caracteres que se pueden mandar por mensaje. En caso de ser 0, no existirá limite. Se recomienda introducir un valor superior a 0.",
        type: settingTypes.number,
        default: 400
    },
];

// Preferencias creadas por defecto al iniciar el sistema. Luego se podrán agregar más si así se quiere.

// Preferencias que podrá elegir el usuario

const defaultPreferences = {
    likeSports: {
        name: 'deportista',
        description: 'Gusto por las personas que hacen deporte.'
    },

    children: {
        name: 'hijos',
        description: 'Preferencia a la hora de querer o tener hijos.',
        options: ['Quiero hijos', 'Tengo hijos', 'No tengo, pero quiero hijos', 'No quiero hijos.']
    },

    likePolitics: {
        name: 'politico',
        description: 'Gusto por los aficionados a la politica.',
    },

    likeArt: {
        name: 'artista',
        description: 'Gusto por las personas que tienen una afición artistica.'
    },

    interestScope: {
        name: 'interés en',
        description: 'Gusto según genero preferido.',
        options: ['Hombre', 'Mujer', 'Ambos']
    },
}

module.exports = {
    roleNames,
    settingTypes,
    defaultSettings,
    defaultPreferences
}