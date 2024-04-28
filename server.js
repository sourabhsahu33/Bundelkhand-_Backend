const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { connectToMongoDB } = require('./MongoConfig.js'); 


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// User Feedback Queries handling
app.post('/Submit_Query_Data', async (req, res) => {
    try{
        const database = await connectToMongoDB();
        const collection = database.collection('user_queries'); 
        const query_data = req.body;
        await collection.insertOne(query_data);
        res.status(200).send('Thanks, We have received your query and will get back to you soon!');
    }catch(error){
        console.error('Error handling Submit_Query_Data:', error);
    }
});


// User Registration handing
app.post('/user_reg', async (req, res) => {
    try{
        const database = await connectToMongoDB();
        const collection = database.collection('registered_users');
        const users_info = req.body;
        const existingUsername = await collection.findOne({ username: req.body.username });
        const existingEmail = await collection.findOne({ email: req.body.email });
        if(req.body.username == "" || existingEmail == ""){
            return res.status(400).send('Username or Email can not be empty!');
        }
        if (existingUsername) {
            return res.status(400).send('Username already exists. Please choose another username.');
        }
        if (existingEmail) {
            return res.status(400).send('Email already registered. Please login instead.');
        }
        await collection.insertOne(users_info);
        res.status(200).send('User Registered Successfully!');
    }catch(error){
        console.error('Error creating a new user account:', error);
    }
});


// user Login handling
app.post('/user_login', async (req, res) => {
    try{
        const database = await connectToMongoDB();
        const collection = database.collection('registered_users');
        const existingUser = await collection.findOne({ username: req.body.username, password: req.body.password });
        if(existingUser){
            res.status(200).send('User Exists and LoggedIn successfully!');
        }else{
            res.status(400).send('User not found!');
        }
    }catch(error){
         console.error('Internal Server Error:', error);
    }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});