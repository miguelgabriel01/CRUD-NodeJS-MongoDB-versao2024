// Configuração inicial
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const Person  = require('./models/Person');

// Forma de ler JSON / middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

// Rotas da API
app.post('/person', async (req,res) =>{
    const {name,salary,approved} = req.body;

    const person = {
        name,
        salary,
        approved
    }

    try{
        await Person.create(person);
        res.status(201).json({message: "Pessoa inserida no sistema com sucesso!"});
    }catch(error){
        res.status(500).json({error: error});
    }


});
// Rota inicial/endpoint
app.get('/', (req,res) => {
    res.json({message: "Olá mundo"});
});

//conectar com o banco de dados
const DB_USER = 'gabrielogabriel10';
const DB_PASSWORD = encodeURIComponent('Bolso22');

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.tytdwc2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
    console.log("Conectado ao MongoDB!");
    // fornecer uma porta para acesso
    app.listen(3000);
}).catch((err) => console.log(err));