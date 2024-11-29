const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3001

morgan.token('body', function (req, res) { 
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(cors())
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('dist'))

let list = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/info', (req, res) => {
    const amount = list.length;
    const date = new Date();
    res.send(`<p>Phonebook has info for ${amount} people</p><p>${date}</p>`);
});

app.get('/api/persons', (req, res) => {
    res.json(list);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = list.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    list = list.filter(p => p.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Name or number missing'
        });
    }

    const nameExists = list.some(person => person.name === body.name);
    if (nameExists) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        id: Math.floor(Math.random() * 1000000).toString(),
        name: body.name,
        number: body.number
    }

    list = list.concat(person);
    res.json(person);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});