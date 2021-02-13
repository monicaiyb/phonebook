const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const path = require('path');
require('dotenv').config();

// Invoking sequelize object and passing in database connection string

const sequelize = new Sequelize("postgres:reallybig@localhost:5432/ufarm");
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const User = sequelize.define('user', {
    // attributes
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING
        // allowNull defaults to true
    }
}, {
    // options
});
// Note: using `force: true` will drop the table if it already exists
User.sync({ force: true }) // Now the `users` table in the database corresponds to the model definition

// Intialising 
const app = express()
const port = 3000
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "pug");
//  All middleware 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, }))

// Routes to display form
app.get('/', (req, res) => {
    res.render("index");
})
app.post('/user', async (req, res) => {
    try {
        const newUser = new User(req.body)
        await newUser.save()
        // Returns the new user that is created in the database
        res.json({ user: newUser }) 
    } catch (error) {
        console.error(error)
    }
})
app.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const user = await User.findAll({
            where: {
                id: userId
            }
        }
        )
        res.json({ user })
    } catch (error) {
        console.error(error)
    }
})
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})