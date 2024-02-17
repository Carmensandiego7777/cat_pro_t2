const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const {Client}= require('@elastic/elasticsearch');
require('dotenv').config();
const esClient = new Client({ node: `http://localhost:9200` });

const app = express();
const port = 5500;

// Middleware
app.use(bodyParser.json());
app.use(cors());


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// // Database connection
// const db = mysql.createConnection({
//   host: "sql6.freesqldatabase.com",
//   user: "sql6684568",
//   password: "QaUnlRWwiQ",
//   database: "sql6684568",
// });

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

// Routes

app.get('/api/product/search', async (req, res) => {
  var query = req.query.query.trim()
  console.log("query",query);
  var down=["under","below","less","within","down","lesser","in","@"];
  var eq=["=","@"]
  var up=["over","above","greater","up",];
  var extra=[",",".","/",":","[","]","rs","Rs","amt","Amt","+","-","than"];

  var string=query.split(" ")
  var cur,sort;

  extra.forEach(val=>{
    if(query.includes(val)){
      query=query.replace(val,"");
    }
  })

  string.forEach(val => {
    if(down.includes(val)){
      cur=val;
      sort="lte";
      return;
    }
    else if(up.includes(val)){
      cur=val;
      sort="gte";
      return;
    }
    
  });

  if(cur){
       [data,price] = query.split(cur);
    var value=parseFloat(price);
  }
  else{
    var data=query;
    var value=10000000;
    sort="lte";
  }
  try {
    let body  = await esClient.search({
        index: "categoryname_idx",
        body: {
          query: {
            bool: {
              must: [
                {
                  exists: {
                    field: "DiscountPrice"
                  }
                },
                {
                  range: {
                    DiscountPrice: {
                      [sort]: value
                    }
                  }
                }
              ],
              should: [
                {
                  multi_match: {
                    query: data,
                    fields: ["Brand", "CategoryName", "ProductName"],
                      fuzziness: 'auto'
                  }
                }
              ],
              minimum_should_match: 0
            }
          },
        _source:['ProductID','ProductName','CategoryName','CategoryId','Brand','MRP','DiscountPrice'],
      }
    });
    if (body && body.hits) {
      let data=body.hits.hits;
      const results = data.map(hit => hit._source);
      console.log(results)
      res.json(results);
    } else {
      console.error('Invalid Elasticsearch response:', body);
      res.status(500).send('Invalid Elasticsearch response');
    }
    } catch (error) {
      console.error("Error searching data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});


 




app.get("/api/categories", (req, res) => {
  const sql = "SELECT * FROM CategoryTable";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(result);
  });
});


app.get("/api/products/:id?", (req, res) => {
  const {id} = req.params;
  const sql = "SELECT * FROM ProductTable" + (id ? " WHERE CategoryId= " + id : "");
  console.log(sql)
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(result);
  });
});


app.post('/elastic', async (req,res) => {
  const query = req.body.query;
  console.log(query)
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
