import admin from "firebase-admin";

// 🔐 Set your admin password
const ADMIN_PASSWORD = "humble123";

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://humbletreasuretech-default-rtdb.firebaseio.com"
  });
}

const db = admin.database();

export default async function handler(req, res) {
  try {
    // Check password
    const { key } = req.query;
    if (key !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized. Invalid key." });
    }

    // Fetch all contacts
    const snapshot = await db.ref("contacts").once("value");
    if (!snapshot.exists()) {
      return res.status(404).send("No contacts found.");
    }

    const contactsArray = Object.values(snapshot.val());

    // Generate VCF content
    let vcfData = "";
    contactsArray.forEach(contact => {
      const fullName = contact.fullName || "No Name";
      const phoneNumber = contact.phoneNumber || "NoNumber";
      vcfData += `BEGIN:VCARD\nVERSION:3.0\nFN:${fullName}\nTEL:${phoneNumber}\nEND:VCARD\n`;
    });

    // Set headers for download
    res.setHeader("Content-Disposition", "attachment; filename=HumbleTreasureContacts.vcf");
    res.setHeader("Content-Type", "text/vcard; charset=utf-8");
    res.status(200).send(vcfData);

  } catch (error) {
    console.error("VCF Download Error:", error);
    res.status(500).json({ error: "Server error while generating VCF." });
  }
}