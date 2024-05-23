# IT Member Management System

ระบบจัดการข้อมูลนักศึกษาสาขาเทคโนโลยีสารสนเทศ

## ผู้พัฒนา

- นายสุขสวัสดิ์ แซ่ลิ่ม            
- นางสาวอุษณีย์ ภักดีตระกูลวงศ์    

## หน่วยงาน
-  มหาวิทยาลัยราชภัฏนครปฐม

## คุณสมบัติ

- แสดงข้อมูลนักศึกษา
- เพิ่มข้อมูลนักศึกษา
- แก้ไขข้อมูลนักศึกษา
- ลบข้อมูลนักศึกษา พร้อมยืนยันการลบ
- ใช้ DataTables สำหรับการจัดการตารางข้อมูล
- ใช้ CSS และ ฺBootstrap 5 สำหรับการจัดการหน้าเว็บให้สวยงาม

## การติดตั้ง

1. Clone โปรเจคจาก GitHub:
    ```bash
    git clone https://github.com/aoaae/gosoft-project.git
    cd gosoft-project
    ```

2. ติดตั้ง dependencies:
    ```bash
    npm install
    ```

3. สร้างฐานข้อมูลและตารางใน MySQL:
    ```sql
    CREATE DATABASE itmember_db;
    USE itmember_db;

    CREATE TABLE students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stdID VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone_no VARCHAR(255),
        email VARCHAR(255),
        room VARCHAR(255)
    );
    ```

4. แก้ไขการตั้งค่าการเชื่อมต่อฐานข้อมูลในไฟล์ `database.js`:
    ```javascript
    const dbConn = mysql.createConnection({
        host: 'localhost',
        user: 'root', // <== ระบุให้ถูกต้อง
        password: '',  // <== ระบุให้ถูกต้อง
        database: 'itmember_db',
        port: 3306  // <== ใส่ port ให้ถูกต้อง (default 3306, MAMP ใช้ 8889)
    });
    ```

## การใช้งาน

1. รันเซิร์ฟเวอร์:
    ```bash
    node database.js
    ```

2. เปิดเว็บบราวเซอร์และเข้าไปที่ `http://localhost:3000`

## API Endpoints

### GET /

แสดงข้อมูลนักศึกษาทั้งหมด

### GET /students/:id

แสดงข้อมูลนักศึกษาตาม `id`

### POST /students

เพิ่มข้อมูลนักศึกษาใหม่

ตัวอย่างข้อมูลที่ส่งในรูปแบบ JSON:
```json
{
    "stdID": "12345678",
    "name": "John Doe",
    "phone_no": "0812345678",
    "email": "john@example.com",
    "room": "A1"
}
```

### PUT /students/:id

แก้ไขข้อมูลนักศึกษาตาม id

ตัวอย่างข้อมูลที่ส่งในรูปแบบ JSON:
```json
{
    "stdID": "12345678",
    "name": "John Doe",
    "phone_no": "0812345678",
    "email": "john@example.com",
    "room": "A1"
}
```

### DELETE /students/:id

ลบข้อมูลนักศึกษาตาม id

### Dependencies
- Express
- Body-parser
- EJS
- MySQL2
- Method-override
- Bootstrap
- DataTables

### การติดตั้ง Dependencies
ติดตั้ง dependencies โดยใช้คำสั่ง:

```
npm install express body-parser ejs mysql2 method-override

```

### โครงสร้างโปรเจค
```
├── public/
│   ├── styles.css
├── views/
│   ├── student.ejs
│   ├── edit-student.ejs
├── database.js
├── student.html
├── README.md

```
