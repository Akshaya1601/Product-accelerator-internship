const express = require('express');
const app = express();
var bodyParser=require('body-parser');
var sgMail = require('@sendgrid/mail');
const pa_db = require('./config/mysqlDB');
const PORT = process.env.PORT || 5000
const API_KEY ='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';
sgMail.setApiKey(API_KEY)

app.use(bodyParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/assets'));

app.use(bodyParser.urlencoded({extended: true})); //Body parser for 

// API URL end points

app.get("/",(req,res)=>{
    res.json({message: "Product Accelerator API region - admission restricted!"})
});

app.post("/insert-new-user", async (req, res) => {
    let username = req.body.username;
    let email = req.body.email_address;
    let password = req.body.passwd;
    let insert = await pa_db.insertNewUser(email, username, password)
    
    const msg = {
        to: email, // Change to your recipient
        from: 'akshaya.nadathur@gmail.com', // Change to your verified sender
        subject: 'Confirmation email - ABC Movies',
        text: 'This is a confirmation email for signing up to ABC Movies',
        html: 'Thank you for signing up to ABC Movies! We hope you enjoy browsing movies on our site. Please reply to this email for any issues/complaints.',
    }

sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
  })
  .catch((error) => {
    console.error(error)
  })
    res.json(insert)
})
// app.get("/get-all-users", async (req, res) => {
//     let users=await pa_db.getAllUsers();
//     console.log(users);
//     res.json(users)
// })

app.listen(PORT);