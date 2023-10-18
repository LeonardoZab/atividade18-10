const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Atividade = db.define('atividade', {
    Nome: {
        type: DataTypes.STRING(30)
    },
    Descricao: {
        type: DataTypes.STRING(160)
    }
},{
    createdAt: false,
    updatedAt: false
})

// Atividade.sync({force:true})

module.exports = Atividade