const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');


let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');
//Check what is this.
// app.set("view engine","hbs");

// require in handlebars and their helpers
const helpers = require('handlebars-helpers');
// tell handlebars-helpers where to find handlebars
helpers({
    'handlebars': hbs.handlebars
})

let connection;

async function main() {
    connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })

app.get("/students", async function(req,res){

    let [students] = await connection.execute(`SELECT student_id, DATE_FORMAT(start_date, "%d %b %Y") AS enroll_date , first_name,last_name,programmes.programme_name,students.contact_email AS student_email FROM students JOIN programmes ON students.programme_id = programmes.programme_id ORDER BY student_id ASC`)

    //this is to render the page and to pass the res. 
    res.render("students",{'students':students});
})

app.get("/student/enroll", async function(req,res){
    let [programmes] = await connection.execute("SELECT programme_id,programme_name FROM programmes");

    //this is to render the page and to pass the res. 
    res.render("student/enroll",{'programmes':programmes});
})

app.get("/student/enroll", async function(req,res){
    let [programmes] = await connection.execute("SELECT programme_id,programme_name FROM programmes");

    //this is to render the page and to pass the res. 
    res.render("student/enroll",{'programmes':programmes});
})

  //when using forms, this is to post the form
  app.post('/student/enroll', async function (req, res) {

    let [currentStudent] = await connection.execute("SELECT student_id FROM students ORDER BY student_id DESC LIMIT 1");

    const currentNum = currentStudent[0]?.student_id || "SN1000";
    const updateNum = parseInt(currentNum.replace("S",""))+1;
    const latestId = "S" + updateNum;

    // res.send(req.body)
    // we are using prepared statment. 
    const sql = `INSERT INTO students (student_id,first_name,last_name,start_date,programme_id) VALUES
    (?,?,?,?,?);` //(?,?,?,?) is syntax from mysql2.

    const bindings = [latestId,req.body.first_name, req.body.last_name, req.body.start_date, req.body.programme_id]

    //First parameter = the SQL statement;
    // Second para,eter is the values from the res. make use that the array is in order. 
    await connection.execute(sql, bindings);

    //redirects tell the client (Often the browser) to go to different url. 
    res.redirect('/students');
})



app.listen(3000, ()=>{
    console.log('Server is running')
});

}


main();