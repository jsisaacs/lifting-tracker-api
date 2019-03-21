import 'dotenv/config'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import models, { sequelize } from './models'
import routes from './routes'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
    req.context = {
        models,
        me: models.users[1]
    }
    next()
})

app.use('/session', routes.session)
app.use('/users', routes.user)
app.use('/messages', routes.message)

const eraseDatabaseOnSync = true

sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
    if (eraseDatabaseOnSync) {
        createUsersWithMessages()
    }
    
    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`)
    })
})

const createUsersWithMessages = async () => {
    await models.User.create(
        {
            username: 'rwieruch',
            messages: [
                {
                    text: 'Published the Roat to learn React'
                }
            ]
        },
        {
            include: [models.Message]
        }
    )

    await models.User.create(
        {
            username: 'ddavids',
            messages: [
                {
                    text: 'Happy to release ...'
                },
                {
                    text: 'Published a complete ...'
                }
            ]
        },
        {
            include: [models.Message]
        }
    )
}