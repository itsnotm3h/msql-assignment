const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');


let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// this is the name of the handle bar. 
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

hbs.handlebars.registerHelper('stats', function(studentId, lessonId,attendance) {

    console.log(studentId,lessonId,attendance);

    if (attendance && attendance.length) {
        // Look for a matching attendance record for the specific student and lesson
        const record = attendance.find(item => item.student_id === studentId && item.lesson_id === lessonId && item.status=="PRESENT");
        // Return 'checked' if the record exists
        return record ? 'checked' : '';
    }
    return ''; // Return an empty string if no attendance data is available
});


// hbs.handlebars.registerHelper('getIndex', function(array) {
//     if (Array.isArray(array)) {
//         return array.reduce((total, num) => total + num, 0);
//     }
//     return 0; // Return 0 if array is empty or not an array
// });


let connection;

async function main() {
    connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })


    app.get("/", async function (req, res) {

        let [ongoing] = await connection.execute(`SELECT lesson_id, lesson_days.module_id,modules.module_name, DATE_FORMAT(date, "%d %b %Y") AS lesson_date, TIME_FORMAT(start_time,"%H:%i%p") AS start_time, TIME_FORMAT(end_time,"%H:%i%p") AS end_time, lesson_days.lecturer_id, lecturers.first_name, lecturers.last_name, lesson_days.venue_id,venue.venue_name FROM lesson_days JOIN lecturers ON lesson_days.lecturer_id = lecturers.lecturer_id JOIN modules ON modules.module_id = lesson_days.module_id JOIN venue ON venue.venue_id = lesson_days.venue_id WHERE date > CURRENT_DATE() ORDER BY lesson_days.date ASC`);

        let [previous] = await connection.execute(`SELECT lesson_id, lesson_days.module_id,modules.module_name, DATE_FORMAT(date, "%d %b %Y") AS lesson_date, TIME_FORMAT(start_time,"%H:%i%p") AS start_time, TIME_FORMAT(end_time,"%H:%i%p") AS end_time, lesson_days.lecturer_id, lecturers.first_name, lecturers.last_name, lesson_days.venue_id,venue.venue_name FROM lesson_days JOIN lecturers ON lesson_days.lecturer_id = lecturers.lecturer_id JOIN modules ON modules.module_id = lesson_days.module_id JOIN venue ON venue.venue_id = lesson_days.venue_id WHERE date <= CURRENT_DATE() ORDER BY lesson_days.date DESC`)

        //this is to render the page and to pass the res. 
        res.render("lessons", { ongoing, previous });
    })

    app.get("/students", async function (req, res) {

        let [students] = await connection.execute(`SELECT student_id, DATE_FORMAT(start_date, "%d %b %Y") AS enroll_date , first_name,last_name,programmes.programme_name,students.contact_email AS student_email FROM students JOIN programmes ON students.programme_id = programmes.programme_id ORDER BY student_id ASC`)

        //this is to render the page and to pass the res. 
        res.render("students", { 'students': students });
    })


    app.get("/students", async function (req, res) {

        let [students] = await connection.execute(`SELECT student_id, DATE_FORMAT(start_date, "%d %b %Y") AS enroll_date , first_name,last_name,programmes.programme_name,students.contact_email AS student_email FROM students JOIN programmes ON students.programme_id = programmes.programme_id ORDER BY student_id ASC`)

        //this is to render the page and to pass the res. 
        res.render("students", { 'students': students });
    })

    app.get("/student/enroll", async function (req, res) {
        let [programmes] = await connection.execute("SELECT programme_id,programme_name FROM programmes");

        //this is to render the page and to pass the res. 
        res.render("student/enroll", { 'programmes': programmes });
    })

    app.get("/student/enroll", async function (req, res) {
        let [programmes] = await connection.execute("SELECT programme_id,programme_name FROM programmes");

        //this is to render the page and to pass the res. 
        res.render("student/enroll", { 'programmes': programmes });
    })

    //when using forms, this is to post the form
    app.post('/student/enroll', async function (req, res) {

        let [currentStudent] = await connection.execute("SELECT student_id FROM students ORDER BY student_id DESC LIMIT 1");


        const currentNum = currentStudent[0]?.student_id || "SN1000";
        const updateNum = parseInt(currentNum.replace("S", "")) + 1;
        const latestId = "S" + updateNum;

        let generateEmail = req.body.first_name + "_" + req.body.last_name + "@itm.edu.sg";
        let allEmail = await connection.execute("SELECT COUNT(contact_email) FROM students WHERE first_name=? AND last_name=?", [req.body.first_name, req.body.last_name]);

        let count = allEmail[0][0]["COUNT(contact_email)"];

        if (count > 0) {
            count++;
            generateEmail = req.body.first_name + "_" + req.body.last_name + count + "@itm.edu.sg";
        }


        // res.send(req.body)
        // we are using prepared statment. 
        const sql = `INSERT INTO students (student_id,first_name,last_name,start_date,programme_id,contact_email) VALUES
    (?,?,?,?,?,?);` //(?,?,?,?) is syntax from mysql2.

        const bindings = [latestId, req.body.first_name, req.body.last_name, req.body.start_date, req.body.programme_id, generateEmail]

        //First parameter = the SQL statement;
        // Second para,eter is the values from the res. make use that the array is in order. 
        await connection.execute(sql, bindings);

        //redirects tell the client (Often the browser) to go to different url. 
        res.redirect('/students');
    })

    app.get("/student/edit/:student_id", async function (req, res) {
        const [students] = await connection.execute(`SELECT student_id,first_name,last_name,DATE_FORMAT(start_date, "%Y-%m-%d") AS enroll_date,programme_id,contact_email FROM students WHERE student_id=?`, [req.params.student_id]);
        let [programmes] = await connection.execute("SELECT programme_id,programme_name FROM programmes");

        const student = students[0];

        res.render("student/edit", { 'students': student, 'programmes': programmes })

    })


    //when using forms, this is to post the form
    app.post('/student/edit/:student_id', async function (req, res) {


        const { first_name, last_name, start_date, programme_id, contact_email } = req.body;
        const sql = `UPDATE students SET first_name=?,last_name=?,start_date=?,programme_id=?,contact_email=? WHERE student_id = ?`;
        const bindings = [first_name, last_name, start_date, programme_id, contact_email, req.params.student_id];

        await connection.execute(sql, bindings);

        res.redirect("/students");


    });

    app.get('/student/delete/:student_id', async function (req, res) {
        //display customers
        const [students] = await connection.execute("SELECT * FROM students WHERE student_id=?", [req.params.student_id]);

        const student = students[0];

        res.render('student/delete', {
            student
        });

    })



    app.post('/student/delete/:student_id', async function (req, res) {
        //display customers
        await connection.execute("DELETE FROM students WHERE student_id=?", [req.params.student_id]);
        res.redirect("/students");

    })




    app.get('/lesson/attendance/:lesson_id', async function (req, res) {
        //display customers

        const [attendance] = await connection.execute(`SELECT * from attendance WHERE lesson_id=?`, [req.params.lesson_id]);

        const [lessonInfo] = await connection.execute("SELECT * FROM lesson_days JOIN modules ON modules.module_id = lesson_days.module_id JOIN venue ON venue.venue_id = lesson_days.venue_id WHERE lesson_id=?", [req.params.lesson_id]);

        const [students] = await connection.execute("SELECT students.student_id, students.first_name, students.last_name,lesson_days.lesson_id FROM students JOIN programmes ON students.programme_id = programmes.programme_id   JOIN modules ON modules.programme_id = programmes.programme_id JOIN lesson_days ON modules.module_id = lesson_days.module_id WHERE lesson_days.lesson_id=?", [req.params.lesson_id]);




        const lesson = lessonInfo[0];

        res.render('lesson/attendance', { students, lesson,attendance});

        // res.render('lesson/attendance',{lesson,students});

    })



    app.post('/lesson/attendance/:lesson_id', async function (req, res) {
        //display customers
        // await connection.execute("DELETE FROM students WHERE student_id=?",[req.params.student_id]);
        // res.redirect("/students");

        const [allStudent] = await connection.execute("SELECT * FROM students JOIN programmes ON students.programme_id = programmes.programme_id   JOIN modules ON modules.programme_id = programmes.programme_id JOIN lesson_days ON modules.module_id = lesson_days.module_id  WHERE lesson_id=?", [req.params.lesson_id]);



        const markAttendance = req.body.student_id;
        let newAttendance = [];

        if(markAttendance!="" || markAttendance!=null)
        {
        let result = Array.isArray(markAttendance);

        if (!result) {
            newAttendance.push({ student_id: markAttendance })
        }
        else {
            newAttendance = markAttendance.map(item => ({ student_id: item }));
        }

        //How does this work?
        let difference = allStudent.filter(student => !newAttendance.some(student2 => student2.student_id === student.student_id));

        if (newAttendance) {
            for (let eachStudent in newAttendance) {
                // check if the id exist in the attendance table

                let currentStudent = newAttendance[eachStudent].student_id;

                const check = await connection.execute("SELECT * FROM students JOIN programmes ON students.programme_id = programmes.programme_id   JOIN modules ON modules.programme_id = programmes.programme_id JOIN lesson_days ON modules.module_id = lesson_days.module_id JOIN attendance ON attendance.student_id = students.student_id WHERE attendance.lesson_id=? AND attendance.student_id=?", [req.params.lesson_id, currentStudent]);

                // console.log(currentStudent);

                const checkResult = check[0];
                let currentIndex = allStudent.map(function (id) { return id.student_id; }).indexOf(currentStudent);
                let currentResult = allStudent[currentIndex];

                if (checkResult == undefined || checkResult == 0) {

                    await connection.execute(`INSERT INTO attendance (date_time,student_id,module_id,lecturer_id,status,lesson_id)
                                                VALUES (CURRENT_TIMESTAMP(), "${currentStudent}","${currentResult.module_id}","${currentResult.lecturer_id}","PRESENT", "${currentResult.lesson_id}" );`);
                                            }
                else {
                    
                    await connection.execute(`UPDATE attendance SET date_time = CURRENT_TIMESTAMP(), status = "PRESENT" WHERE student_id=?; `, [`${currentStudent}`]);
                }
            }


        }



        if (difference) {
            for (let eachStudent in difference) {
                // check if the id exist in the attendance table

                let currentStudent = difference[eachStudent].student_id;

                const check = await connection.execute("SELECT * FROM students JOIN programmes ON students.programme_id = programmes.programme_id   JOIN modules ON modules.programme_id = programmes.programme_id JOIN lesson_days ON modules.module_id = lesson_days.module_id JOIN attendance ON attendance.student_id = students.student_id WHERE attendance.lesson_id=? AND attendance.student_id=?", [req.params.lesson_id, currentStudent]);

                // console.log(currentStudent);

                const checkResult = check[0];
                let currentIndex = allStudent.map(function (id) { return id.student_id; }).indexOf(currentStudent);
                let currentResult = allStudent[currentIndex];

                if (checkResult == undefined || checkResult == 0) {

                    await connection.execute(`INSERT INTO attendance (date_time,student_id,module_id,lecturer_id,status,lesson_id)
                                                VALUES (CURRENT_TIMESTAMP(), "${currentStudent}","${currentResult.module_id}","${currentResult.lecturer_id}","ABSENT", "${currentResult.lesson_id}" );`);
                                            }
                else {
                    
                    await connection.execute(`UPDATE attendance SET date_time = CURRENT_TIMESTAMP(), status = "ABSENT" WHERE student_id=?; `, [`${currentStudent}`]);
                }
            }


        }
    }

        res.redirect("/lesson/attendance/" + req.params.lesson_id);





    })




    app.listen(3000, () => {
        console.log('Server is running')
    });

}


main();