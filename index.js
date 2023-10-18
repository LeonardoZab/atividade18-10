const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
const Usuario = require('./models/Usuario')
const Atividade = require('./models/Atividade')

const PORT = 3000
const hostname = 'localhost'

let log = false

// ------ Express
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
// ------ Handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
// ------

// BANCO DE DADOS

app.post('/apagar', async (req,res)=>{
    const Nome = req.body.Nome
    let msg = 'Atividade não encontrada na base de dados para exclusão!'
    let msg2 = 'Atividade excluída da base de dados!'
    const dado_Nome = await Atividade.findOne({raw:true, where: {Nome:Nome}})
    console.log(dado_Nome)
    console.log(dado_Nome.id)
    if(dado_Nome != null){
        Atividade.destroy({where: {id: dado_Nome.id}})
        res.render('apaga', {msg2})
    }else{
        res.render('apaga', {msg})
    }
})

app.get('/apagar', (req,res)=>{
    res.render('apaga')
})

app.post('/atualizar', async (req,res)=>{
    const Nome = req.body.Nome
    const Descricao = req.body.Descricao
    console.log(Nome,Descricao)
    let msg = 'Tipo de dados inválidos, digite novamente'
    let msg2 = 'Dados cadastrados!'
    let msg3 = 'Atividade não encontrada na base de dados para atualizar'

    const dado_nome = await Atividade.findOne({raw:true, where: {Nome:Nome}})

    if(dado_nome != null){
        const dados = {
            Nome: Nome,
            Descricao: Descricao,
        }
        if((typeof Nome ==='string')&&(typeof Descricao ==='string')){
            await Atividade.update(dados, {where: {Nome:Nome}})
            console.log(msg2)
            res.render('atualiza', {msg2})
        }else{
            console.log(msg)
            res.render('atualiza', {msg})
        }
    }else{
        console.log(msg)
        res.render('atualiza', {msg3})
    }
})

app.get('/atualizar', (req,res)=>{
    res.render('atualiza')
})

app.post('/cadastrar', (req,res)=>{
    const Nome = req.body.Nome
    const Descricao = req.body.Descricao
    console.log(Nome,Descricao)
    let msg = 'Tipo de dados inválidos, digite novamente'
    let msg2 = 'Dados cadastrados!'
    if((typeof Nome ==='string')&&(typeof Descricao ==='string')){
        Atividade.create({Nome,Descricao,})
        console.log(msg2)
        res.render('cadastra', {msg2})
    }else{
        console.log(msg)
        res.render('cadastra', {msg})
    }
})

app.get('/cadastrar', (req,res)=>{
    res.render('cadastra')
})

app.post('/consultar', async (req,res)=>{
    const Nome = req.body.Nome
    // console.log(nome)
    const dados = await Atividade.findOne({raw:true, where: {Nome:Nome}})
    // console.log(dados)
    let msg = 'Digite o nome de uma Atividade'
    let msg2 = 'Atividade não encontrada'
    if(Nome == ''){
        console.log(msg)
        res.render('consulta', {msg})
    }else if(dados === null){
        console.log(msg2) 
        res.render('consulta', {msg2})       
    }else{
        console.log(dados)
        res.render('consulta', {valores: dados})
    } 
})

app.get('/consultar', (req,res)=>{
    res.render('consulta')
})

app.get('/listar', async (req,res)=>{
    const dados = await Atividade.findAll({raw:true})
    console.log(dados)
    res.render('lista', {valores: dados})
})

app.get('/', (req,res)=>{
    res.render('home')
})

// LOGIN

app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    const pesq = await Usuario.findOne(
        {raw: true, where: {email:email, senha:senha}}
        )

    console.log(pesq)
    if(pesq == null){
        console.log('user not found')
        res.status(200).redirect('/')
    }else if(pesq.email == email && pesq.senha == senha){
        console.log('user found')
        log = true
        res.render('home', {log})
    }else{
        res.status(200).redirect('/')
        console.log('user not found')
    }
})

app.get('/login', (req,res)=>{
    res.render('login', {log})
})

app.get('/logout', (req,res)=>{
    log = false
    res.render('home', {log})
})
// ------
conn.sync().then(()=>{
    app.listen(PORT,hostname,()=>{
        console.log(`Servidor rodando ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Erro de conexão com o Banco de dados '+ error)
})