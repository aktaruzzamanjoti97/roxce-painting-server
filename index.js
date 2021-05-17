const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const { ObjectId } = require('bson');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkoox.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(express.json());
app.use(cors()); 

const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello, It is working')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("roxcePainting").collection("services");
  
  app.post('/addService', (req, res) => {
      const data = req.body;
      serviceCollection.insertOne(data)
      .then(result=>{
        console.log(result);
        res.send(result.insertedCount > 0)
        
      })
  })

  app.get('/service', (req, res) => {
    serviceCollection.find({})
    .toArray((err, items) => {
      console.log(err);
      console.log(items);
      res.send(items)
    })
  })

  app.delete('/delete/:id', (req,res) =>{
    const id = ObjectId(req.params.id);
    serviceCollection.deleteOne({_id: id})
    .then(document =>{
      res.send(document)
    })
  })

  app.get('/oneService/:id', (req, res) =>{
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, document)=>{
      res.send(document)
    })
  })

});

app.listen(process.env.PORT || port)