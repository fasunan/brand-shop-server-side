const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
// require('dotenv').config();

// middle were 
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)


const uri = "mongodb+srv://fasunan:klTug7Ls0pcfWwhR@cluster0.2gzcwih.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('product');
    const userCollection = client.db('productDB').collection('user');
    const cartCollection = client.db('productDB').collection('cart');


    app.get('/product', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/productsId/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    })


    app.get('/product/:name', async (req, res) => {
      const name = req.params.name;
      const query = { brandName: name.toLocaleLowerCase() };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);

    })

    app.post('/product', async (req, res) => {
      const allProducts = req.body;
      const result = await productCollection.insertOne(allProducts);
      res.send(result)
    });

    app.post('/details/:id', async (req, res) => {
      const SeeDetails = req.body;
      console.log(SeeDetails)
      const result = await cartCollection.insertOne(SeeDetails);
      res.send(result);
    })


    app.put('/productsId/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          name: updateProduct.name,
          photo: updateProduct.photo,
          brandName: updateProduct.brandName,
          type: updateProduct.type,
          price: updateProduct.price,
          details: updateProduct.details,
          rating: updateProduct.rating,

        }
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);

    });
    


    // user Related API
    app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    })


    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user)
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

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
  res.send('Server is running')
})


app.listen(port, () => {
  console.log(`app in running on port ${port}`)
})