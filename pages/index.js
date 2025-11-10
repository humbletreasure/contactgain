// pages/index.js
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get } from "firebase/database";

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [currentContacts, setCurrentContacts] = useState(0);
  const [uploading, setUploading] = useState(false);

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

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  useEffect(() => {
    async function fetchContacts() {
      const snapshot = await get(ref(db, 'contacts'));
      if (snapshot.exists()) {
        setCurrentContacts(Object.keys(snapshot.val()).length);
      } else {
        setCurrentContacts(0);
      }
    }
    fetchContacts();
  }, []);

  const handleUpload = async () => {
    if (!name || !phone) {
      alert("Please fill all fields!");
      return;
    }
    setUploading(true);
    try {
      await push(ref(db, 'contacts'), {
        name,
        phone: countryCode + phone,
        timestamp: Date.now()
      });
      setUploading(false);
      alert("Uploaded! Redirecting...");
      window.location.href = "https://chat.whatsapp.com/Lrdun6oXkLt5vogYUhLyaq?mode=wwt";
    } catch (err) {
      console.error(err);
      alert("Error saving contact.");
      setUploading(false);
    }
  };

  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at 50% 50%, #000000 0%, #0a0a0a 100%)",
      color: "white",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <canvas id="stars" style={{
        position: "absolute",
        top:0, left:0, width:"100%", height:"100%", zIndex:0
      }}></canvas>

      <div style={{
        position: "relative",
        zIndex: 2,
        background: "rgba(255,255,255,0.05)",
        padding: "2rem",
        borderRadius: "20px",
        boxShadow: "0 0 25px rgba(0, 100, 255, 0.4)",
        maxWidth: "400px",
        width: "90%",
        textAlign: "center"
      }}>
        <h1 style={{color:"#3b82f6", fontWeight:700}}>Humble Treasure VCF</h1>
        <p>
          Boost your WhatsApp status with <b>Humble Treasure VCF</b>. Upload your name and WhatsApp number, then join our community.
        </p>

        <p>
          👥 Current Contacts: {currentContacts}<br/>
          🎯 Target Contacts: <b>1000</b>
        </p>

        <input 
          type="text" 
          placeholder="Full Name" 
          className="form-control mb-2"
          value={name} 
          onChange={e => setName(e.target.value)}
        />
        <div className="d-flex mb-2">
          <select 
            value={countryCode} 
            onChange={e => setCountryCode(e.target.value)}
            className="form-select" style={{maxWidth:"100px"}}
          >
            <option value="+93">🇦🇫 +93 Afghanistan</option>
            <option value="+355">🇦🇱 +355 Albania</option>
            <option value="+213">🇩🇿 +213 Algeria</option>
            <option value="+376">🇦🇩 +376 Andorra</option>
            <option value="+244">🇦🇴 +244 Angola</option>
            <option value="+1-268">🇦🇬 +1-268 Antigua and Barbuda</option>
            <option value="+54">🇦🇷 +54 Argentina</option>
            <option value="+374">🇦🇲 +374 Armenia</option>
            <option value="+61">🇦🇺 +61 Australia</option>
            <option value="+43">🇦🇹 +43 Austria</option>
            <option value="+994">🇦🇿 +994 Azerbaijan</option>
            <option value="+1-242">🇧🇸 +1-242 Bahamas</option>
            <option value="+973">🇧🇭 +973 Bahrain</option>
            <option value="+880">🇧🇩 +880 Bangladesh</option>
            <option value="+234">🇳🇬 +234 Nigeria</option>
            {/* Add remaining countries exactly like your HTML copy */}
          </select>
          <input 
            type="tel" 
            placeholder="WhatsApp Number" 
            className="form-control ms-2" 
            value={phone} 
            onChange={e => setPhone(e.target.value)}
          />
        </div>

        <button 
          className="btn btn-primary w-100 mb-2" 
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Contact"}
        </button>

        <button 
          className="btn btn-success w-100" 
          onClick={() => window.open("https://whatsapp.com/channel/0029VbBP68M9Bb64yG0yfI1H", "_blank")}
        >
          Follow Our Channel
        </button>
      </div>

      <div style={{
        position: "fixed",
        bottom: "10px",
        fontSize: "0.9rem",
        color: "#fff",
        zIndex:2
      }}>
        ⚡ Powered by <b>Humble Treasure Tech</b>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            const canvas = document.getElementById('stars');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            let stars = [];
            for (let i=0;i<100;i++){
              stars.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, size:Math.random()*2, speed:Math.random()*0.5+0.2});
            }
            function animateStars(){
              ctx.clearRect(0,0,canvas.width,canvas.height);
              ctx.fillStyle="white";
              stars.forEach(s=>{
                ctx.beginPath();
                ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
                ctx.fill();
                s.y += s.speed;
                if(s.y>canvas.height) s.y=0;
              });
              requestAnimationFrame(animateStars);
            }
            animateStars();
            window.addEventListener('resize', ()=>{
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;
            });
          `
        }}
      />
    </div>
  );
}