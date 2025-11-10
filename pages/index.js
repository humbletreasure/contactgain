import { useEffect, useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get } from "firebase/database";

export default function Home() {
  const [currentContacts, setCurrentContacts] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+234"); // default Nigeria
  const [uploading, setUploading] = useState(false);

  const canvasRef = useRef(null);

  const firebaseConfig = {
    apiKey: "AIzaSyDN-ScdvciBaT-kiz5vsi0v3cOONXMFLDM",
    authDomain: "humbletreasuretech.firebaseapp.com",
    databaseURL: "https://humbletreasuretech-default-rtdb.firebaseio.com",
    projectId: "humbletreasuretech",
    storageBucket: "humbletreasuretech.firebasestorage.app",
    messagingSenderId: "943679922790",
    appId: "1:943679922790:web:c70a1540268e06038fc3a7",
    measurementId: "G-F28S21HC2R"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // Fetch current contacts
  useEffect(() => {
    async function fetchContacts() {
      const snapshot = await get(ref(db, "contacts"));
      if (snapshot.exists()) {
        setCurrentContacts(Object.keys(snapshot.val()).length);
      }
    }
    fetchContacts();
  }, []);

  // Star background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let stars = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speed: Math.random() * 0.5 + 0.2
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) s.y = 0;
      });
      requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleUpload = async () => {
    if (!name || !phone) return alert("Please fill all fields!");
    setUploading(true);
    try {
      await push(ref(db, "contacts"), {
        name,
        phone: countryCode + phone,
        timestamp: Date.now()
      });
      setUploading(false);
      alert("Uploaded ✅ Redirecting...");
      window.location.href =
        "https://chat.whatsapp.com/Lrdun6oXkLt5vogYUhLyaq?mode=wwt";
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert("Error saving contact.");
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(255,255,255,0.05)",
          padding: "2rem",
          borderRadius: "20px",
          boxShadow: "0 0 25px rgba(0, 100, 255, 0.4)",
          maxWidth: "400px",
          width: "90%",
          margin: "auto",
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        <h1 style={{ color: "#3b82f6", fontWeight: "700" }}>Humble Treasure VCF</h1>
        <p>
          Boost your WhatsApp status with <b>Humble Treasure VCF</b>.<br />
          Upload your name and WhatsApp number, then join our community.
        </p>

        <p>
          👥 Current Contacts: {currentContacts} <br />
          🎯 Target Contacts: <b>1000</b>
        </p>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ marginBottom: "1rem", width: "100%", padding: "0.5rem", borderRadius: "5px" }}
        />

        <div style={{ display: "flex", marginBottom: "1rem" }}>
          <select
            value={countryCode}
            onChange={e => setCountryCode(e.target.value)}
            style={{ maxWidth: "100px", marginRight: "0.5rem", borderRadius: "5px" }}
          >
            <option value="+234">🇳🇬 +234 Nigeria</option>
            <option value="+1">🇺🇸 +1 USA</option>
            <option value="+44">🇬🇧 +44 UK</option>
            {/* Add full country list here */}
          </select>
          <input
            type="tel"
            placeholder="WhatsApp number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "5px" }}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            width: "100%",
            backgroundColor: "#3b82f6",
            border: "none",
            padding: "0.7rem",
            marginBottom: "0.5rem",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer"
          }}
        >
          {uploading ? "Uploading..." : "Upload Contact"}
        </button>

        <button
          onClick={() => window.open("https://whatsapp.com/channel/0029VbBP68M9Bb64yG0yfI1H", "_blank")}
          style={{
            width: "100%",
            background: "linear-gradient(90deg, #25D366, #128C7E)",
            border: "none",
            padding: "0.7rem",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Follow Our Channel
        </button>
      </div>

      <div style={{ position: "fixed", bottom: "10px", fontSize: "0.9rem", color: "white", zIndex: 2 }}>
        ⚡ Powered by <b style={{ color: "#3b82f6" }}>Humble Treasure Tech</b>
      </div>
    </div>
  );
}