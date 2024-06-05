// Configuração inicial
const express = require('express');
const app = express();

// Forma de ler JSON / middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

// Rota inicial/endpoint
app.get('/', (req,res) => {
    res.json({message: "Olá mundo"});
});

// fornecer uma porta para acesso
app.listen(3000);