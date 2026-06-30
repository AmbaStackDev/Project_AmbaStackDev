const db = require('../config/db');

class ChatController {
    static initTable() {
        db.query(`CREATE TABLE IF NOT EXISTS chats (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            sender_role VARCHAR(20) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => { if(err) console.error("Error creating chats table:", err); });
    }

    // FUNGSI BARU: Mengambil Daftar Riwayat Chat (Inbox)
    static getChatList(req, res) {
        const role = req.user.role;
        const userId = req.user.id;

        const queryAdmin = `
            SELECT c.order_id, MAX(c.created_at) as last_time,
                   (SELECT message FROM chats WHERE order_id = c.order_id ORDER BY created_at DESC LIMIT 1) as last_message,
                   o.shipping_address
            FROM chats c
            JOIN orders o ON c.order_id = o.id
            GROUP BY c.order_id
            ORDER BY last_time DESC
        `;

        const queryUser = `
            SELECT c.order_id, MAX(c.created_at) as last_time,
                   (SELECT message FROM chats WHERE order_id = c.order_id ORDER BY created_at DESC LIMIT 1) as last_message,
                   o.shipping_address
            FROM chats c
            JOIN orders o ON c.order_id = o.id
            WHERE o.user_id = ?
            GROUP BY c.order_id
            ORDER BY last_time DESC
        `;

        db.query(role === 'admin' ? queryAdmin : queryUser, role === 'admin' ? [] : [userId], (err, results) => {
            if(err) return res.status(500).json({success: false, error: err.message});
            res.json({success: true, data: results});
        });
    }

    static getChats(req, res) {
        db.query('SELECT * FROM chats WHERE order_id = ? ORDER BY created_at ASC', [req.params.orderId], (err, results) => {
            if(err) return res.status(500).json({success: false, error: err.message});
            res.json({success: true, data: results});
        });
    }

    static sendMessage(req, res) {
        const { order_id, message, sender_role } = req.body;
        db.query('INSERT INTO chats (order_id, sender_role, message) VALUES (?, ?, ?)', 
        [order_id, sender_role, message], (err) => {
            if(err) return res.status(500).json({success: false, error: err.message});
            
            db.query('SELECT user_id FROM orders WHERE id = ?', [order_id], (err, results) => {
                if(!err && results.length > 0) {
                    const userId = results[0].user_id;
                    const targetRole = sender_role === 'admin' ? 'user' : 'admin';
                    const title = sender_role === 'admin' ? 'Balasan Chat Penjual' : 'Pesan Baru Pembeli';
                    const msg = sender_role === 'admin' ? `Penjual membalas pesan Anda (Order #${order_id})` : `Ada pesan baru dari Pembeli (Order #${order_id})`;
                    
                    db.query('INSERT INTO notifications (user_id, target_role, title, message) VALUES (?, ?, ?, ?)', [userId, targetRole, title, msg]);
                }
            });
            res.json({success: true});
        });
    }
}
ChatController.initTable();
module.exports = ChatController;