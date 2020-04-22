const
    express = require('express'),
    bodyParser = require('body-parser'),
    server = express(),
    port = 1400,
    db = require('./db'),
    table = 'public."users"'

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
    db.query(`SELECT * FROM ${table}
    ORDER BY id
    `, (err, dbRes) => {
        if (err)
            res.status(400).send(err)
        else
            res.send(dbRes.rows)
    })
})

//Read one (by id)
server.get('/user/:id?', (req, res) => {
    const { params } = req

    db.query(`SELECT * FROM ${table} WHERE id=${params.id}`, (err, dbRes) => {
        if (err)
            res.status(400).send(err)
        else {
            const user = dbRes.rows[0]
            if (!user)
                res.status(400).send({ error: 'אין משתמש כזה' })
            else
                res.send(user)
        }
    })

})

//Create new user
server.post('/user', (req, res) => {
    const { body } = req,
        { id, name, phone } = body,
        q = `INSERT INTO public.users(id, name, phone)
    VALUES (${id}, '${name}', '${phone}');`

    db.query(q, err => {
        if (err)
            res.status(400).send(err)
        else
            res.send({ id, name, phone })
    })
})

//Update
server.put('/user/:id', (req, res) => {
    const { params, body } = req,
        { name, phone } = body,
        q = `UPDATE ${table}
	    SET ${name ? `name='${name}',` : ''} ${phone ? `phone='${phone}'` : ''}
        WHERE id = ${params.id};`

    db.query(q, err => {
        if (err)
            res.status(400).send(err)
        else
            res.send({ id: params.id, name, phone })
    })
})

//Delete
server.delete('/user/:id', (req, res) => {
    const { params } = req,
        q = `DELETE FROM ${table} WHERE id = ${params.id}`

    db.query(q, (err) => {
        if (err)
            res.status(400).send(err)
        else
            res.send({ id: params.id })
    })
})
server.listen(port, () => console.log(`Server is running. port: ${port}`))