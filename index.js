//Configuração de .env
require('dotenv').config();

// Configuração de dependencias
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
    res.json({responsavel: "Miguel Gabriel B. Dos Santos",EmailDoResponsavel: "gabrielogabriel10@gmail.com",statusApi: "Inicializada com sucesso",dataHoraAtual: new Date().toISOString()});
});

//conectar com o banco de dados
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.tytdwc2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
    // fornecer uma porta para acesso
    app.listen(3000);
}).catch((err) => console.log(err));