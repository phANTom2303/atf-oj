const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req,res) =>{
    console.log(req.body);
    fs.writeFileSync("./log.txt",req.body.code);
    return res.json("yay");
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
