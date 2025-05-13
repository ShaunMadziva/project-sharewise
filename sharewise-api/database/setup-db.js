const fs = require('fs')
require('dotenv').config()

const sql = fs.readFileSync('./database/setup.sql').toString()

const db = require('./db')

db.query(sql)
    .then(() => {
        console.log('Database setup complete')
        db.end()
    })
    .catch((err) => {
        console.error('Error setting up database:', err)
        db.end()
    })