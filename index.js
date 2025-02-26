
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(express.json());
// const corsConfig = {
//   origin: '*',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', "PATCH",'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gze7wpc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const volunteerCollection = client
      .db("volunteerDB")
      .collection("management");
    const requestedCollection = client
      .db("volunteerDB")
      .collection("requested");
    app.get("/volunteer", async (req, res) => {
      const curser = volunteerCollection.find();
      const result = await curser.toArray();
      res.send(result);
    });

    //  create data for all
    app.post("/volunteer", async (req, res) => {
      const newItem = req.body;
      // console.log(newItem);
      const result = await volunteerCollection.insertOne(newItem);
      res.send(result);
      // console.log(result);
    });
    //  get id for details
    app.get("/volunteer/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await volunteerCollection.findOne(query);
      res.send(result);
    });
    //   get data by user email
    app.get("/my-volunteer-email", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const result = await volunteerCollection.find(query).toArray();
      res.send(result);
    });
    
    //  get data by sorting
    app.get('/volunteer-upComing-deadline',async(req,res)=>{
    
      const result= await  volunteerCollection.find().sort({deadline:1}).toArray();
      res.send(result)
    })
    //  for search
    app.get("/volunteer-searchBy-title", async (req, res) => {
      const search = req.query.search;
      let query = {
        title: { $regex: search, $options: "i" },
      };
      const result = await volunteerCollection.find(query).toArray();
      res.send(result);
    });

    //  get update data id
    app.get("/single-volunteer-update/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await volunteerCollection.findOne(query);
      res.send(result);
    });
    //  get data update
    app.put("/single-volunteer-update/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateItem = req.body;
      console.log(updateItem);
      const item = {
        $set: {
          img: updateItem.img,
          title: updateItem.title,
          deadline: updateItem.deadline,
          location: updateItem.location,
          category: updateItem.category,
          number: updateItem.number,
          desc: updateItem.desc,
        },
      };
      // console.log(item);
      const result = await volunteerCollection.updateOne(filter, item, options);
      console.log(result);
      res.send(result);
    });

    //  get delete data id

    app.get("/delete-single-volunteer/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = { _id: new ObjectId(id) };
      const result = await volunteerCollection.findOne(query);
      res.send(result);
    });
    // data delete
    app.delete("/delete-single-volunteer/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const quarry = { _id: new ObjectId(id) };
      const result = await volunteerCollection.deleteOne(quarry);
      res.send(result);
      // console.log(result);
    });

    //   create new collection
    app.post("/requested", async (req, res) => {
      const reqItem = req.body;
      console.log(reqItem);
      const result = await requestedCollection.insertOne(reqItem);
      res.send(result);
     
    });
    //  get all requested data by  email
    app.get("/requested-volunteer-email", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const result = await requestedCollection.find(query).toArray();
      res.send(result);
    });
    //   delete form requested collection
    app.get("/requested-volunteer-delete/:id", async (req, res) => {
      const id = req.params.id;
      const quarry = { _id: new ObjectId(id) };
      const result = await requestedCollection.findOne(quarry);
      res.send(result);
    });
    app.delete("/requested-volunteer-delete/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const quarry = { _id: new ObjectId(id) };
      const result = await requestedCollection.deleteOne(quarry);
      res.send(result);
    });
    //  get id for patch
    app.get("/requested-volunteer-inc/:id",async(req,res)=>{
      const id=req.params.id
      const quarry={_id:new ObjectId(id)}
      const result=await requestedCollection.findOne(quarry)
      res.send(result)
    })
    //  increment the quantity
    app.put("/requested-volunteer-inc/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
     
      
      const updateDoc = {
        $inc: { number: -1 } 
        
      };
      
      const result = await volunteerCollection.updateOne(filter, updateDoc);
      res.send(result);
    
    });
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", async (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
