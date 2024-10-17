const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

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
  const contacts = ["628987654321@c.us"];
  const text = `Hello World!`;

  let index = 0;

  // Fungsi untuk mengirim pesan ke kontak satu per satu
  const sendMessageWithDelay = () => {
    if (index < contacts.length) {
      const contact = contacts[index];
      client
        .sendMessage(contact, text)
        .then((response) => {
          console.log(`Pesan berhasil dikirim ke ${contact}`);
        })
        .catch((err) => {
          console.error(`Gagal mengirim pesan ke ${contact}:`, err);
        });

      index++; // Increment index untuk kontak berikutnya

      // Panggil fungsi ini lagi setelah 15 detik
      setTimeout(sendMessageWithDelay, 15000); // 15000 ms = 15 detik
    } else {
      console.log("Semua pesan telah dikirim.");
    }
  };

  // Mulai pengiriman pesan dengan jeda 15 detik
  sendMessageWithDelay();
});

// Log out on disconnect
client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

client.initialize();
