const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('1810','root','senai',{
    host: 'localhost',
    dialect: 'mysql'
})

//sequelize.authenticate().then(()=>{
//    console.log('conectado')
//}).catch((error)=>{
//    console.error('erro d conexão', error)
//})

module.exports = sequelize