const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.guqonkt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const usersCollection = client.db('sportsAcademyDB').collection('users')
        const coachCollection = client.db('sportsAcademyDB').collection('coach')
        const sportsCollection = client.db('sportsAcademyDB').collection('sports')
        const admissionsCollection = client.db('sportsAcademyDB').collection('admissions')

        // !!!! USERS
        app.put('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existingUser = await usersCollection.findOne(query);
            console.log(existingUser);
            if (existingUser) {
                return res.send({});
            }
            const result = await usersCollection.insertOne(user)
            res.send(result);
        })

        // !!!! COACH
        app.get('/coach', async (req, res) => {
            const result = await coachCollection.find().toArray();
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your Sports Kings Academy successfully connected!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Sports Kings Academy running ON the server')
})

app.listen(port, () => {
    console.log(`sports Kings Academy CEO Active: ${port}`);
})