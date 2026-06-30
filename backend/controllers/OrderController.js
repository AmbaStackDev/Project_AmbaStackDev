const db = require('../config/db');

class OrderController {
    // GANTI FUNGSI CHECKOUT LAMA DENGAN INI
    static checkout(req, res) {
        const userId = req.user.id; 
        const { items, total_price, shipping_address } = req.body;

        if (!items || items.length === 0) return res.status(400).json({ message: 'Keranjang kosong!' });

        const queryOrder = 'INSERT INTO orders (user_id, total_price, status, shipping_address) VALUES (?, ?, ?, ?)';
        db.query(queryOrder, [userId, total_price, 'PENDING', shipping_address], (err, orderResult) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const orderId = orderResult.insertId;
            const orderItemsData = items.map(item => [orderId, item.id, item.quantity, item.price]);
            
            const queryItems = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
            db.query(queryItems, [orderItemsData], (err, itemResult) => {
                if (err) return res.status(500).json({ error: err.message });
                
                // Potong stok barang
                items.forEach(item => {
                    db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.id]);
                });

                // FIXED BUG: Tembakkan Notifikasi Real-Time ke Lonceng Admin! 🚀
                const notifQuery = "INSERT INTO notifications (target_role, title, message) VALUES ('admin', 'Pesanan Baru! 🎉', ?)";
                const notifMessage = `Hore! Ada pesanan baru senilai Rp ${Number(total_price).toLocaleString('id-ID')}. Segera proses pesanannya!`;
                db.query(notifQuery, [notifMessage], (errNotif) => {
                    if(errNotif) console.error("Gagal mengirim notif admin:", errNotif);
                });

                res.status(201).json({ success: true, message: 'Checkout Berhasil!', order_id: orderId });
            });
        });
    }

    // UPDATE UNTUK ADMIN
    static updateOrderStatus(req, res) {
        const { order_id } = req.params;
        const { status, tracking_number } = req.body;
        
        let query = 'UPDATE orders SET status = ?';
        let params = [status];
        if (tracking_number !== undefined && tracking_number !== '') {
            query += ', tracking_number = ?';
            params.push(tracking_number);
        }
        query += ' WHERE id = ?';
        params.push(order_id);

        db.query(query, params, (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: 'Status updated' });
        });
    }

    // UPDATE UNTUK PEMBELI (FIX REFUND & ALASAN)
    static updateUserOrderStatus(req, res) {
        const { order_id } = req.params;
        const { status, cancel_reason, refund_proof } = req.body;
        
        let query = 'UPDATE orders SET status = ?';
        let params = [status];
        
        if (cancel_reason !== undefined && cancel_reason !== '') {
            query += ', cancel_reason = ?';
            params.push(cancel_reason);
        }
        if (refund_proof !== undefined && refund_proof !== null) {
            query += ', refund_proof = ?';
            params.push(refund_proof);
        }
        
        query += ' WHERE id = ?';
        params.push(order_id);

        db.query(query, params, (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: 'User order status updated' });
        });
    }

    // AMBIL SEMUA ORDER (ADMIN)
    static getAllAdminOrders(req, res) {
        db.query('SELECT * FROM orders ORDER BY created_at DESC', (err, orders) => {
            if (err) return res.status(500).json({ error: err.message });
            if (orders.length === 0) return res.json({ success: true, data: [] });

            const orderIds = orders.map(o => o.id);
            const queryItems = `
                SELECT oi.order_id, oi.quantity, oi.price, p.name, p.image, p.image_url 
                FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id 
                WHERE oi.order_id IN (?)
            `;
            db.query(queryItems, [orderIds], (err, items) => {
                if (err) return res.status(500).json({ error: err.message });
                const ordersWithItems = orders.map(order => ({
                    ...order,
                    items: items.filter(i => i.order_id === order.id)
                }));
                res.json({ success: true, data: ordersWithItems });
            });
        });
    }

    // AMBIL ORDER PEMBELI (USER)
    static getUserOrders(req, res) {
        const userId = req.user.id;
        db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, orders) => {
            if (err) return res.status(500).json({ error: err.message });
            if (orders.length === 0) return res.json({ success: true, data: [] });

            const orderIds = orders.map(o => o.id);
            const queryItems = `
                SELECT oi.order_id, oi.quantity, oi.price, p.name, p.image, p.image_url 
                FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id 
                WHERE oi.order_id IN (?)
            `;
            db.query(queryItems, [orderIds], (err, items) => {
                if (err) return res.status(500).json({ error: err.message });
                const ordersWithItems = orders.map(order => ({
                    ...order,
                    items: items.filter(i => i.order_id === order.id)
                }));
                res.json({ success: true, data: ordersWithItems });
            });
        });
    }

    // ================= FITUR RATING (BARU) =================
    static submitRating(req, res) {
        const userId = req.user.id;
        const { order_id, item_name, stars, review, photo } = req.body;
        
        const query = 'INSERT INTO ratings (order_id, user_id, item_name, stars, review, photo) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [order_id, userId, item_name, stars, review, photo], (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: 'Rating saved' });
        });
    }

    static getAllRatings(req, res) {
        const query = `
            SELECT r.*, u.name as user_name 
            FROM ratings r 
            LEFT JOIN users u ON r.user_id = u.id 
            ORDER BY r.created_at DESC
        `;
        db.query(query, (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, data: results });
        });
    }
}

module.exports = OrderController;