const router = require('express').Router();
const Person  = require('../models/Person');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Cadastrar pessoa no sistema
router.post('/', async (req, res) => {
    const { name, salary, approved } = req.body;

    // Função para validar os dados
    const validatePerson = (name, salary, approved) => {
        if (typeof name !== 'string' || name.trim() === '') {
            return { isValid: false, message: 'Nome é obrigatório e deve ser uma string não vazia.' };
        }
        if (typeof salary !== 'number' || isNaN(salary)) {
            return { isValid: false, message: 'Salário é obrigatório e deve ser um número.' };
        }
        if (typeof approved !== 'boolean') {
            return { isValid: false, message: 'Aprovação é obrigatória e deve ser um booleano.' };
        }
        return { isValid: true };
    };

    // Validação dos dados
    const validation = validatePerson(name, salary, approved);
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.message });
    }

    const person = {
        name,
        salary,
        approved
    };

    try {
        await Person.create(person);
        res.status(201).json({ message: 'Pessoa inserida no sistema com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar pessoas do sistema 
router.get('/', async (req, res) => {
    try{
        const people = await Person.find();
        res.status(200).json(people);
    }catch(error){
        res.status(500).json({error: error});
    }
});

// Listar pessoa especifica
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    // Verifica se o ID é um ObjectId válido
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "O ID fornecido não corresponde a nenhum usuário cadastrado no sistema." });
    }

    try {
        const person = await Person.findOne({ _id: id });

        if (!person) {
            return res.status(422).json({ message: "O usuário não foi encontrado." });
        }

        res.status(200).json(person);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;