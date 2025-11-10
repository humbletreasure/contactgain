import { initializeApp, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

if (!getApps().length) {
  initializeApp({
    databaseURL: "https://humbletreasuretech-default-rtdb.firebaseio.com"
  });
}

export default async function handler(req, res) {
  try {
    const db = getDatabase();
    const snapshot = await db.ref("contacts").once("value");
    const data = snapshot.exists() ? snapshot.val() : {};

    let vcf = "";
    Object.values(data).forEach(contact => {
      vcf += `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.name}\nTEL;TYPE=CELL:${contact.phone}\nEND:VCARD\n`;
    });

    res.setHeader("Content-Disposition", "attachment; filename=contacts.vcf");
    res.setHeader("Content-Type", "text/vcard");
    res.status(200).send(vcf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}