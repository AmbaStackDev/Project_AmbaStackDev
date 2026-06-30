const db = require('../config/db');

class NotificationController {
    static initTable() {
        db.query(`CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NULL,
            target_role VARCHAR(20) DEFAULT 'user',
            title VARCHAR(255),
            message TEXT,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => { if(err) console.error("Error creating notifs table:", err); });
    }

    static getNotifs(req, res) {
        const role = req.user.role; 
        const userId = req.user.id;
        const query = role === 'admin' 
            ? "SELECT * FROM notifications WHERE target_role = 'admin' ORDER BY created_at DESC"
            : "SELECT * FROM notifications WHERE target_role = 'user' AND user_id = ? ORDER BY created_at DESC";
        
        db.query(query, role === 'admin' ? [] : [userId], (err, results) => {
            if(err) return res.status(500).json({success: false, error: err.message});
            res.json({success: true, data: results});
        });
    }

    static getUnreadCount(req, res) {
        const role = req.user.role; 
        const userId = req.user.id;
        const query = role === 'admin' 
            ? "SELECT COUNT(*) as count FROM notifications WHERE target_role = 'admin' AND is_read = FALSE"
            : "SELECT COUNT(*) as count FROM notifications WHERE target_role = 'user' AND user_id = ? AND is_read = FALSE";
            
        db.query(query, role === 'admin' ? [] : [userId], (err, results) => {
            if(err) return res.status(500).json({success: false, error: err.message});
            res.json({success: true, count: results[0].count});
        });
    }

    static createNotif(req, res) {
        const { target_role, user_id, title, message } = req.body;
        db.query('INSERT INTO notifications (user_id, target_role, title, message) VALUES (?, ?, ?, ?)', 
        [user_id || null, target_role, title, message], (err) => {
            if(err) return res.status(500).json({success: false, error: err.message});
            res.json({success: true});
        });
    }

    static markAllAsRead(req, res) {
        const role = req.user.role; 
        const userId = req.user.id;
        const query = role === 'admin' 
            ? "UPDATE notifications SET is_read = TRUE WHERE target_role = 'admin'"
            : "UPDATE notifications SET is_read = TRUE WHERE target_role = 'user' AND user_id = ?";
        
        db.query(query, role === 'admin' ? [] : [userId], (err) => {
            if(err) return res.status(500).json({success: false, error: err.message});
            res.json({success: true});
        });
    }

    static clearAll(req, res) {
        const role = req.user.role; 
        const userId = req.user.id;
        const query = role === 'admin' 
            ? "DELETE FROM notifications WHERE target_role = 'admin'"
            : "DELETE FROM notifications WHERE target_role = 'user' AND user_id = ?";
        
        db.query(query, role === 'admin' ? [] : [userId], (err) => {
            if(err) return res.status(500).json({success: false, error: err.message});
            res.json({success: true});
        });
    }
}
NotificationController.initTable();
module.exports = NotificationController;