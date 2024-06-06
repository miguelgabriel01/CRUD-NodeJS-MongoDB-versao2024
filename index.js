// Configuração inicial
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Forma de ler JSON / middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

// Rotas da API
const personRoutes = require('./routes/personRoutes');
app.use('/person', personRoutes);

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