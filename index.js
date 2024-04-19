const express = require('express')
const app = express()
app.use(express.static("public"));
var cookieParser = require('cookie-parser')
const cors = require("cors")

const port = process.env.PORT || 5000
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
  'https://fearful-behavior.surge.sh/',
'https://job-task-neutron-limited.vercel.app/'],
  credentials: true,
}))

app.use(cookieParser())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Job-Task:4rwpaO14kuyahzKl@cluster0.dhtqvw7.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const allcontacts = client.db("task").collection("allcontacts");

    app.get('/allcontact', async (req, res) => {
      const cursor = allcontacts.find()
      const result = await cursor.toArray()
      res.send(result)
    })

      app.post('/addcontact', async (req, res) => {
      const document = req.body;
      const result = await allcontacts.insertOne(document)
      res.send(result)
    })

    app.delete('/deletecontact/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allcontacts.deleteOne(query);
      res.send(result)
    })

    app.put('/updatecontact/:id', async(req,res)=>{
      const id=req.params.id
    const document = req.body;
    const options = { upsert: true };
    const filter={_id:new ObjectId(id)}
    const updatedoc = {
      $set:{
        name: document.name,
        email: document.email,
        number: document.number,
        address: document.address,
        image: document.image,
       
      }
    }
    const result=await allcontacts.updateOne(filter,updatedoc,options);
    res.send(result)
     })
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})