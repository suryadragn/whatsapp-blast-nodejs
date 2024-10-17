const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const mysql = require("mysql");

// Initialize database connection
const db = mysql.createConnection({
  host: "103.112.163.50",
  user: "alkarima_sekolahKita",
  password: "sekolahKita",
  database: "alkarima_sekolah",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database.");
});

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(), // Automatically save authentication credentials
});

client.on("qr", (qr) => {
  // Generate and scan this QR code with your WhatsApp mobile app
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  // Isikan daftar nomor dengan format nomor@c.us
  db.query("SELECT * FROM contact", (err, results) => {
    if (err) {
      console.error("Error fetching contacts:", err);
      return;
    }
    const contacts = results.map(row => `${row.phone_number}@c.us`);
    const text = results.map(row=>`${row.message}`);
    // Print the contacts array
    // console.log("Contacts:", JSON.stringify(contacts, null, 2)); // Pretty print with 2 spaces for indentation
    // process.exit(0);
    let index = 0;

    // Fungsi untuk mengirim pesan ke kontak satu per satu
    const sendMessageWithDelay = () => {
      if (index < contacts.length) {
        const contact = contacts[index];
        const teks = text[index];
        client
          .sendMessage(contact, teks)
          .then((response) => {
            console.log(`Pesan berhasil dikirim ke ${contact}`);
          })
          .catch((err) => {
            console.error(`Gagal mengirim pesan ke ${contact}:`, err);
          });

        index++; // Increment index untuk kontak berikutnya

        // Panggil fungsi ini lagi setelah 15 detik
        setTimeout(sendMessageWithDelay, 5000); // 15000 ms = 15 detik
      } else {
        console.log("Semua pesan telah dikirim.");
        process.exit(0);
      }
    };


    // Mulai pengiriman pesan dengan jeda 15 detik
    sendMessageWithDelay();
  });
});

// Log out on disconnect
client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

client.initialize();
