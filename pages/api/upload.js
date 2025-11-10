import { initializeApp, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

if (!getApps().length) {
  initializeApp({
    databaseURL: "https://humbletreasuretech-default-rtdb.firebaseio.com"
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send({ error: "Method not allowed" });

  try {
    const { name, phone } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "Missing fields" });

    const db = getDatabase();
    const contactsRef = db.ref("contacts");

    // Duplicate check
    const snapshot = await contactsRef.orderByChild("phone").equalTo(phone).once("value");
    if (snapshot.exists()) return res.status(400).json({ error: "Contact already exists" });

    await contactsRef.push({ name, phone, timestamp: Date.now() });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}