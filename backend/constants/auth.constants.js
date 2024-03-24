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

module.exports = {
    roleNames
}