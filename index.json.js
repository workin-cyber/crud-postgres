const
    express = require('express'),
    bodyParser = require('body-parser'),
    server = express(),
    port = 1400,
    fs = require('fs'),
    db = require('db')

server.use(bodyParser.json())

server.get('/', (req, res) => {
    res.send('hello world')
})

/* 
CRUD
========
Create
Read
Update
Delete

REST
=======
create -> post
read -> get
update -> put
delete -> delete

req -> Request
res -> Result
*/

//Read all
server.get('/users', (req, res) => {
    const list = require('./list')
    res.send(list)
})

//Read one (by id)
server.get('/user/:id?', (req, res) => {
    const { params } = req,
        list = require('./list')

    const user = list.find(item => item.id == params.id)

    if (user)
        res.send(user)
    else
        res.status(400).send({ error: 'אין משתמש כזה' })
})

//Create new user
server.post('/user', (req, res) => {
    const { body } = req,
        list = require('./list')

    const sortedList = list.sort((a, b) => a.id > b.id ? 1 : -1),
        newId = sortedList[list.length - 1].id + 1

    const newUser = {
        id: newId,
        name: body.name,
        phone: body.phone
    }

    list.push(newUser)

    fs.writeFileSync('./list.json', JSON.stringify(list, null, 2))

    res.send(newUser)
})

//Update
server.put('/user/:id', (req, res) => {
    const { params, body } = req,
        list = require('./list')

    const index = list.findIndex(u => u.id == params.id),
        user = list[index]

    if (index == -1)
        res.status(400).send({ error: 'אין משתמש כזה' })
    else {
        if (body.name)
            list[index].name = body.name

        if (body.phone)
            list[index].phone = body.phone

        fs.writeFileSync('./list.json', JSON.stringify(list, null, 2))

        res.send(user)
    }

})

//Delete
server.delete('/user/:id', (req, res) => {
    const { params } = req,
        list = require('./list')

    const index = list.findIndex(u => u.id == params.id)

    const deleted = list.splice(index, 1)

    fs.writeFileSync('./list.json', JSON.stringify(list, null, 2))

    res.send(deleted[0])
})
server.listen(port, () => console.log(`Server is running. port: ${port}`))