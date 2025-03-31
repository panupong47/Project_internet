const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

const port = 4720; // พอร์ตที่เซิร์ฟเวอร์จะทำงาน

app.use(bodyParser.json());
app.use(cors());
const moment = require('moment');

let conn = null;

// เชื่อมต่อฐานข้อมูล MySQL
const initMySQL = async () => {
    try {
        conn = await mysql.createConnection({
            host: 'localhost',           // เปลี่ยนเป็นชื่อ service ใน docker-compose
            user: 'root',
            password: 'root',
            database: 'webdb',
            port: 4719 // เปลี่ยนเป็นพอร์ตที่ MySQL ทำงาน
        });
        console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
    } catch (error) {
        console.error('ไม่สามารถเชื่อมต่อฐานข้อมูลได้:', error);
        // ลองเชื่อมต่อใหม่ในอีก 5 วินาที
        setTimeout(initMySQL, 5000);
    }
};


// **1. ดึงรายการข้อมูลทั้งหมด**
app.get('/tb_data', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT * FROM tb_data');
        res.json(results);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

app.get('/tb_login', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT * FROM tb_login');
        res.json(results);
    } catch (error) {
        console.error('Error fetching login data:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});


// **2. เพิ่มข้อมูล**
app.post('/tb_data', async (req, res) => {
    try {
        let data = req.body;
        
        // ตรวจสอบข้อมูล
        if (!data.id || !data.name || !data.tle || !data.Email || !data.service_date || !data.address || !data.service ) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
        }
        
        // บันทึกข้อมูลลงฐานข้อมูล
        const [results] = await conn.query(
            'INSERT INTO tb_data (name, tle, Email,service_data ,address,service) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.name, data.tle, data.Email, data.address]
        );

        res.json({ message: 'เพิ่มข้อมูลสำเร็จ', data: results });
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

app.post('/tb_login', async (req, res) => {
    try {
        let data = req.body;
        
        // ตรวจสอบข้อมูล
        if (!data.name || !data.password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
        }
        
        // บันทึกข้อมูลลงฐานข้อมูล
        const [results] = await conn.query(
            'INSERT INTO tb_login (name, password) VALUES (?, ?)',
            [data.name, data.password]
        );

        res.json({ message: 'เพิ่มข้อมูลสำเร็จ', data: results });
    } catch (error) {
        console.error("Error adding login data:", error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
}); 


// **3. ดึงข้อมูลตาม ID**
app.get('/tb_data/:ID', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('SELECT * FROM tb_data WHERE id = ?', [id]);
        if (results.length == 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูล' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching data by ID:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

app.get('/tb_login/:ID', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('SELECT * FROM tb_login WHERE id = ?', [id]);
        if (results.length == 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูล' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching login data by ID:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});


// **4. อัปเดตข้อมูลตาม ID**
app.put('/tb_data/:ID', async (req, res) => {
    try {
        let id = req.params.id;
        let updateData = req.body;

        // ตรวจสอบข้อมูล
        if (!updateData.name || !updateData.tle || !updateData.Email || !updateData.address) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
        }

        const [results] = await conn.query('UPDATE tb_data SET ? WHERE id = ?', [updateData, id]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการอัปเดต' });
        }
        
        res.json({ message: 'อัปเดตข้อมูลสำเร็จ', data: results });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

app.put('/tb_login/:ID', async (req, res) => {
    try {
        let id = req.params.id;
        let updateData = req.body;
        
        // ตรวจสอบข้อมูล
        if (!updateData.name || !updateData.password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
        }
        
        const [results] = await conn.query('UPDATE tb_login SET ? WHERE id = ?', [updateData, id]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการอัปเดต' });
        }
        
        res.json({ message: 'อัปเดตข้อมูลสำเร็จ', data: results });
    } catch (error) {
        console.error('Error updating login data:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

// **5. ลบข้อมูลตาม ID**
app.delete('/tb_data/:ID', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('DELETE FROM tb_data WHERE id = ?', [id]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
        }
        
        res.json({ message: 'ลบข้อมูลสำเร็จ', data: results });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

app.delete('/tb_login/:ID', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('DELETE FROM tb_login WHERE id = ?', [id]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
        }
        
        res.json({ message: 'ลบข้อมูลสำเร็จ', data: results });
    } catch (error) {
        console.error('Error deleting login data:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

// เมื่อเซิร์ฟเวอร์เริ่มทำงาน
app.listen(port, async () => {
    await initMySQL();
    console.log(`เซิร์ฟเวอร์ทำงานที่พอร์ต ${port}`);
});