//app.js is the server file
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//needed https module to send the POST request from the form to server.
const https = require("https");

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req, res){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    //console.log(fname +" " +  lname +" " + email);
    //from here to down to line 30 we are going to send the info to mail chimp. We did an arrangement based on mailchimp structure but yet not send.
    //javascript object file
    const data = {
        members: [
            {   email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname, //fetch from the form
                    LNAME: lname,
                }
            }
        ]
};
//js object into JSON format
const jsonData = JSON.stringify(data);
//here
// We can only send it using the https request. Above we just did the mailchip understandable data formation
// last weather lesson we just did the GET response but now we are even going to do post request. So the code is different.
const url = "https://us10.api.mailchimp.com/3.0/lists/4a86e035db";

const options = {
    method: "POST",
    auth: "p:03f08db85501883b7baadbad88e09e41-us10"
    };

const request = https.request(url, options,function(response){ // we will pass url and options and finally we will have the call back function that will be response of server.
    response.on("data", function(data){
        //console.log(JSON.parse(data));
        if (response.statusCode === 200){ //this is the response making after the request from the Mail Chimp server.
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/fail.html");
        }
    })
})

request.write(jsonData);
request.end();
    
});

app.post("/fail",function(req,res){
    res.redirect("/")
})






app.listen(process.env.PORT || 3000, function(){ //here heroku will decide which port to be given or in ourlocal host 3000
    console.log("server is running in port 3000");
})

//API key
//03f08db85501883b7baadbad88e09e41-us10
//audiance ID 4a86e035db  // list ID where we want to keep our audiance at.
