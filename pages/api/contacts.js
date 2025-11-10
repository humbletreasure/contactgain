import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// Only initialize admin once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "humbletreasuretech",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: "https://humbletreasuretech-default-rtdb.firebaseio.com",
  });
}

const db = getDatabase();

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { fullName, phoneNumber } = req.body;
      if (!fullName || !phoneNumber) {
        return res.status(400).json({ success: false, message: "Missing fields" });
      }

      // Check duplicates
      const snapshot = await db.ref("contacts").orderByChild("phoneNumber").equalTo(phoneNumber).get();
      if (snapshot.exists()) {
        return res.json({ success: false, message: "Duplicate number" });
      }

      // Save
      await db.ref("contacts").push({ fullName, phoneNumber, createdAt: Date.now() });
      return res.json({ success: true });
    }

    // GET mode for total count
    if (req.method === "GET" && req.query.mode === "count") {
      const snapshot = await db.ref("contacts").get();
      const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
      return res.json({ count });
    }

    res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}