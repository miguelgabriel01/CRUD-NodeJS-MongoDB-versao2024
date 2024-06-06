const router = require('express').Router();
const Person  = require('../models/Person');

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

module.exports = router;