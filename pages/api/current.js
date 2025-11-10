import { initializeApp, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

if (!getApps().length) {
  initializeApp({
    databaseURL: "https://humbletreasuretech-default-rtdb.firebaseio.com"
  });
}

export default async function handler(req, res) {
  const db = getDatabase();
  const snapshot = await db.ref("contacts").once("value");
  const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
  res.status(200).json({ count });
}