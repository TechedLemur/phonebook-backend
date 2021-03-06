const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

morgan.token("content", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);
app.use(cors());
app.use(express.static("build"));

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     <p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  console.log(person);

  if (!person.name)
    return response.status(400).json({
      error: "Name is missing",
    });

  if (!person.number)
    return response.status(400).json({
      error: "Number is missing",
    });

  if (persons.map((p) => p.name).includes(person.name))
    return response.status(400).json({
      error: "A person with this name is already registered",
    });

  if (persons.map((p) => p.number).includes(person.number))
    return response.status(400).json({
      error: "A person with this number is already registered",
    });

  person.id = Math.floor(Math.random() * 3000);
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
