const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override"); // เพิ่ม method-override
const app = express();

app.set('view engine', 'ejs');


// Middleware - บอกวิธีการที่ client ส่งข้อมูลผ่าน middleware
app.use(bodyParser.urlencoded({extended:false})) // ส่งผ่าน Form
app.use(bodyParser.json()) // ส่งด้วย Data JSON
app.use(methodOverride('_method')); // ใช้ method-override
app.use(express.static('public'));

const mysql = require("mysql2/promise");
const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root', // <== ระบุให้ถูกต้อง
    password: '',  // <== ระบุให้ถูกต้อง
    database: 'itmember_db',
    port: 3306  // <== ใส่ port ให้ถูกต้อง (default 3306, MAMP ใช้ 8889)
});



// ======START=====เอาข้อมูลจาก DB มาโชว์==========================
app.get('/', async (req, res) => {
    // Replace this with your database query
     const connection = await dbConn
     const users = await connection.query('SELECT * from students')
     console.log(users)
     res.render('student', { users:users[0] });
 });
// ======END=====เอาข้อมูลจาก DB มาโชว์==========================


//  GET students

app.get('/students', async (req,res) => {
    const connection = await dbConn
    const [rows] = await connection.query('SELECT * from students')
    res.send(rows)
    // res.json(rows)
})




// START DELETE PROCESS=========================================
    // DELETE student by id
    app.delete('/students/:id', async (req, res) => {
        const connection = await dbConn;
        const [result] = await connection.query('DELETE from students where id = ?', [req.params.id]);

        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(400).send('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    });


    // เมื่อ Delete แล้วควรส่ง status แจ้งให้ผู้ใช้ทราบด้วย เช่น code 204 - from teacher
    // localhost:3000/students/2

    // app.delete('/students/:id', async (req,res)=>{

    //     const connection = await dbConn
    //     await connection.query('Delete from students where id = ' +req.params.id)
    //     res.status(204).send("Deleted id " + req.params.id + " successful" )
    // })

// END DELETE PROCESS=========================================


// START INSERT PROCESS=========================================
    // ====START===เรียกหน้าฟอร์มเพิ่มนักศึกษา=========

    app.get("/addstudents", (req, res)=>{
        res.sendFile(__dirname + '/student.html');
    } );

    // ====END===เรียกหน้าฟอร์มเพิ่มนักศึกษา=========

    // ======START=====สคริปท์เพิ่มข้อมูลนักศึกษาลง DB==========================
    // ทำ POST /students สำหรับข้อมูล student 1 คน
    // JSON Body-Parser 

    app.post("/students", async (req, res) => {
        // ส่งข้อมูลผ่าน body-parser (Middleware)

        const stdID = req.body.stdID;
        const name = req.body.name;
        const phone_no = req.body.phone_no;
        const email = req.body.email;
        const room = req.body.room;

        const connection = await dbConn
        const rows = await connection.query("insert into students (stdID,name,phone_no,email,room) values ('"+stdID+"','"+name+"','"+phone_no+"','"+email+"','"+room+"')")

        // res.status(201).send(rows)  // ส่งผลลัพธ์มา แต่เราอ่านไม่รู้เรื่อง
        // res.status(201).send("<h3 style='color:green;'>เพิ่มข้อมูลสำเร็จ</h3>"); // แสดงผล
        // res.status(201).send(`<h3 style='color:green;'>เพิ่มข้อมูลสำเร็จ จำนวน ${rows[0].affectedRows} แถว</h3>`); // แสดงผล  `

        // แสดงผลและทำการ redirect หลังจาก 5 วินาที
        res.status(201).send(`
            <h3 style='color:green;'>เพิ่มข้อมูลสำเร็จ จำนวน ${rows.affectedRows} แถว</h3>
            <script>
                setTimeout(function() {
                    window.location.href = '/';
                }, 5000);
            </script>
        `);
    })
           
    // =======END====สคริปท์เพิ่มข้อมูลนักศึกษาลง DB==========================
// END INSERT PROCESS=========================================


// START EDIT PROCESS=========================================
    // =======START=====เพิ่ม route ที่จะแสดงหน้าแก้ไขข้อมูลนักศึกษา======

    app.get('/editStudent', (req, res) => {
        res.render('editStudent');
    });

    // =======END=====เพิ่ม route ที่จะแสดงหน้าแก้ไขข้อมูลนักศึกษา======

    // =======START===API สำหรับการดึงข้อมูลนักศึกษาตาม ID ให้ส่งข้อมูลเป็น JSON ที่สามารถใช้งานได้
    app.get('/students/:id', async (req, res) => {
        const connection = await dbConn;
        const [rows] = await connection.query('SELECT * from students where id = ?', [req.params.id]);
        res.json(rows);
    });

    // GET students/:id - FROM TEACHER
    // app.get('/students/:id', async (req,res)=>{
    //     const connection = await dbConn
    //     const rows = await connection.query('SELECT * from students where id = ' +req.params.id)
    //     res.send(rows)
    // })

    // =======END=====API สำหรับการดึงข้อมูลนักศึกษาตาม ID ให้ส่งข้อมูลเป็น JSON ที่สามารถใช้งานได้



    // =======START===API สำหรับการอัพเดตข้อมูลนักศึกษาให้สามารถใช้ JSON body ได้
    app.put("/students/:id", async (req, res) => {
        // รับ id จาก params
        const id = req.params.id;
        // ส่งข้อมูลผ่าน body-parser (Middleware)
        const stdID = req.body.stdID;
        const name = req.body.name;
        const phone_no = req.body.phone_no;
        const email = req.body.email;
        const room = req.body.room;

        const connection = await dbConn
        const rows = await connection.query("Update students set stdID = '"+stdID+"', name = '"+name+"', phone_no = '"+phone_no+"', email = '"+email+"', room = '"+room+"' where id = "+id+" ")
        res.status(201).send(rows)
    })

    // =======END========API สำหรับการอัพเดตข้อมูลนักศึกษาให้สามารถใช้ JSON body ได้
// END EDIT PROCESS=========================================

app.get("/query-1", async (req, res) => {
    const connection = await dbConn
    const rows = await connection.query('SELECT * from students')
    res.send(rows);
})

app.get("/query-2", async (req, res) => {
    const connection = await dbConn
    const rows = await connection.query('SELECT * from students')
    res.send(rows);
})

app.listen(3000, () => {
    console.log("Server is running at port 3000")
})