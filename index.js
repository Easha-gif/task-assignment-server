const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()
// middleware
app.use(cors())
app.use(express.json())
// mongodb connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v4o8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const TaskCollection = client.db("Tasks").collection("add-task");
async function run() {
  try {
  // task get
app.get('/tasks',async(req,res)=>{
const tasks= await TaskCollection.find().toArray()
res.send(tasks)
})
//get a single task
app.get('/task/:id',async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const result = await TaskCollection.findOne(query)
  res.send(result)
})
// task add
app.post('/addTask',async(req,res)=>{
const task=req.body
const result=await TaskCollection.insertOne(task)
res.send(result)
})
// update a single task
app.put("/update/:id",async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const updatedData=req.body
  const updatedDoc={
    $set:{
      title : updatedData.title,
      description : updatedData.description,
      userEmail:updatedData.userEmail,
      userName:updatedData.userName,
      date:updatedData.date,
      lastUpdateDate:updatedData.lastUpdateDate,
      taskStatus : updatedData.taskStatus,
      status:updatedData.status,
      dueData:updatedData.dueData,
      priority:updatedData.priority
    }
  }
  const options = { upsert: true };
const result= await TaskCollection.updateOne(query,updatedDoc,options)
res.send(result)
})
// task Delete
app.delete('/delete/:id',async(req,res)=>{
const id=req.params.id
const query = {_id:new ObjectId(id)}
const result= await TaskCollection.deleteOne(query)
res.send(result)
})

  } finally {
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('task is completed.....')
})

app.listen(port,()=>{
    console.log(`task is doing on port ==> ${port}`);
})