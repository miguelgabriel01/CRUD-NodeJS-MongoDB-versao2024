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


// Atualizar usuário
router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, salary, approved } = req.body;

    // Verifica se o ID é um ObjectId válido
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "O ID fornecido não corresponde a nenhum usuário cadastrado no sistema." });
    }

    // Verifica se pelo menos um dos campos está presente e tem a tipagem correta
    const isValidString = (value) => typeof value === 'string' && value.trim() !== '';
    const isValidNumber = (value) => typeof value === 'number' && !isNaN(value);
    const isValidBoolean = (value) => typeof value === 'boolean';

    const updates = {};
    if (name !== undefined) {
        if (!isValidString(name)) {
            return res.status(400).json({ message: "O campo 'name' deve ser uma string não vazia." });
        }
        updates.name = name;
    }
    if (salary !== undefined) {
        if (!isValidNumber(salary)) {
            return res.status(400).json({ message: "O campo 'salary' deve ser um número." });
        }
        updates.salary = salary;
    }
    if (approved !== undefined) {
        if (!isValidBoolean(approved)) {
            return res.status(400).json({ message: "O campo 'approved' deve ser um booleano." });
        }
        updates.approved = approved;
    }

    // Verifica se há pelo menos um campo para atualizar
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "Pelo menos um campo (name, salary, approved) deve ser fornecido para atualização." });
    }

    try {
        const updatedPerson = await Person.updateOne({ _id: id }, { $set: updates });

        if (updatedPerson.matchedCount === 0) {
            return res.status(422).json({ message: "Dados do usuário não foram atualizados." });
        }

        res.status(200).json({ updates });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar pessoa
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    // Verifica se o ID é um ObjectId válido
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "O ID fornecido não corresponde a nenhum usuário cadastrado no sistema." });
    }

    try {
        const person = await Person.findOne({ _id: id });

        if (!person) {
            return res.status(404).json({ message: "O ID fornecido não corresponde a nenhum usuário cadastrado no sistema." });
        }

        await Person.deleteOne({ _id: id });
        res.status(200).json({ message: "O usuário foi removido com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;