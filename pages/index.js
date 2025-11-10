import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  query,
  orderByChild,
  equalTo,
  get,
  onValue
} from "firebase/database";

/**
 * CONFIG - replace these values with your actual Firebase project values if needed.
 * I used the project values you shared earlier. If you changed them, update here.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDN-ScdvciBaT-kiz5vsi0v3cOONXMFLDM",
  authDomain: "humbletreasuretech.firebaseapp.com",
  databaseURL: "https://humbletreasuretech-default-rtdb.firebaseio.com",
  projectId: "humbletreasuretech",
  storageBucket: "humbletreasuretech.firebasestorage.app",
  messagingSenderId: "943679922790",
  appId: "1:943679922790:web:c70a1540268e06038fc3a7",
  measurementId: "G-F28S21HC2R",
};

// Initialize Firebase client (safe init)
let fbApp;
try {
  fbApp = initializeApp(firebaseConfig);
} catch (e) {
  // if already initialized in HMR dev re-load, ignore
  // console.warn("Firebase init:", e.message);
}
const db = getDatabase(fbApp);

// UI constants
const TARGET_QUANTA = 1000; // your target number (1000 by default)
const COUNTRY_CODES = [
  "+234",
  "+1",
  "+44",
  "+91",
  "+86",
  "+234 (Nigeria)",
  "+233 (Ghana)",
  "+250 (Rwanda)",
  "+27 (South Africa)"
]; // extend as you like

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [localNumber, setLocalNumber] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [progressRatio, setProgressRatio] = useState(0);

  // Listen for live total count update
  useEffect(() => {
    const contactsRef = ref(db, "contacts");
    const unsubscribe = onValue(contactsRef, (snap) => {
      const val = snap.val();
      const count = val ? Object.keys(val).length : 0;
      setTotalCount(count);
      setProgressRatio(Math.min(1, count / TARGET_QUANTA));
    });

    return () => unsubscribe();
  }, []);

  function formatPhone(code, num) {
    // basic normalization: remove non-digit except leading +
    const digits = num.replace(/[^\d]/g, "");
    if (code && code.startsWith("+")) {
      // remove + from local if user included
      return code + digits;
    }
    return digits;
  }

  async function checkDuplicate(phone) {
    // Query by child phoneNumber == phone
    try {
      const q = query(ref(db, "contacts"), orderByChild("phoneNumber"), equalTo(phone));
      const snapshot = await get(q);
      return snapshot.exists();
    } catch (err) {
      console.error("Duplicate check error:", err);
      return false; // be permissive if check fails, but we log
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    if (!fullName.trim() || !localNumber.trim()) {
      setStatus("Please enter name and phone number.");
      return;
    }

    const phone = formatPhone(countryCode, localNumber);
    if (phone.length < 7) {
      setStatus("Phone number looks too short. Check digits.");
      return;
    }

    setLoading(true);

    try {
      const isDup = await checkDuplicate(phone);
      if (isDup) {
        setStatus("❌ Duplicate number — this contact already exists.");
        setLoading(false);
        return;
      }

      // Save to Firebase realtime DB under "contacts"
      await push(ref(db, "contacts"), {
        fullName: fullName.trim(),
        phoneNumber: phone,
        createdAt: Date.now()
      });

      setStatus("✅ Contact saved. Thank you!");
      setFullName("");
      setLocalNumber("");
      // UI will update total via onValue listener
    } catch (err) {
      console.error("Save contact error:", err);
      setStatus("❌ Server error while saving. Try again.");
    }

    setLoading(false);
  }

  // Compute numeric display, percent
  const percent = Math.floor(progressRatio * 100);
  const displayTotal = `${totalCount} / ${TARGET_QUANTA}`;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>JUST BETTING 💯 — Contact Gain</h1>
        <p style={styles.subtitle}>
          Join the list. We keep it clean — duplicates not allowed. Your number will be stored in our
          contact center.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            required
          />

          <div style={styles.row}>
            <select
              style={{ ...styles.input, width: "36%" }}
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              style={{ ...styles.input, width: "64%" }}
              value={localNumber}
              onChange={(e) => setLocalNumber(e.target.value)}
              placeholder="Phone number (no spaces)"
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Saving..." : "Submit Contact"}
          </button>
        </form>

        {status && <div style={styles.status}>{status}</div>}

        <div style={{ marginTop: 18 }}>
          <div style={styles.progressHeader}>
            <div style={{ fontWeight: 700 }}>{displayTotal}</div>
            <div style={{ fontSize: 13, color: "#666" }}>{percent}%</div>
          </div>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${Math.max(2, percent)}%` // ensure small fill visible even for 0
              }}
            />
          </div>

          <div style={styles.progressNote}>
            Current rate: <strong>{percent}%</strong> — target <strong>{TARGET_QUANTA}</strong>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <a
            href="/api/download?key=humble123"
            style={styles.downloadLink}
            onClick={() => {
              /* optional: nothing, link triggers download */
            }}
          >
            Download VCF
          </a>
        </div>
      </div>
    </div>
  );
}

// Basic inline styles to keep everything in one file. Replace with your CSS if you like.
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(180deg, rgba(250,250,252,1) 0%, rgba(241,246,255,1) 100%)",
    padding: 20
  },
  card: {
    width: "100%",
    maxWidth: 680,
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 6px 30px rgba(30,40,70,0.08)"
  },
  title: {
    margin: 0,
    fontSize: 22,
    textAlign: "center"
  },
  subtitle: {
    textAlign: "center",
    color: "#556",
    marginTop: 6,
    marginBottom: 18
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  input: {
    padding: 12,
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #e6e9ef",
    outline: "none"
  },
  row: { display: "flex", gap: 10 },
  button: {
    padding: 12,
    background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    cursor: "pointer"
  },
  status: {
    marginTop: 10,
    padding: 10,
    background: "#fff3cd",
    borderRadius: 8,
    color: "#856404",
    border: "1px solid #ffeeba"
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  progressTrack: {
    width: "100%",
    height: 12,
    background: "#eef2ff",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg,#60a5fa,#34d399)",
    borderRadius: 999,
    transition: "width 400ms ease"
  },
  progressNote: {
    marginTop: 8,
    color: "#444",
    fontSize: 13
  },
  downloadLink: {
    display: "inline-block",
    padding: "10px 18px",
    background: "#111827",
    color: "#fff",
    borderRadius: 8,
    textDecoration: "none"
  }
};