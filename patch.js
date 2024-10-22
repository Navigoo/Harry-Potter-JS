const id = prompt(),
  name_ = prompt(),
  population = prompt(),
  body = {}

if (name_ !== null) {
  body.name = name_
}

if (population !== null) {
  body.population = Number(population)
}

fetch(`https://avancera.app/cities/${id}`, {
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json'
  },
  method: 'PATCH'
})
