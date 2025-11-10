import { useEffect, useState } from "react";

export default function Home() {
  const TARGET_CONTACTS = 1000; // you can change this anytime
  const [currentContacts, setCurrentContacts] = useState(0);

  useEffect(() => {
    fetchCurrentContacts();
    window.addEventListener('resize', resizeCanvas);
    createStars();
    animateStars();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const fetchCurrentContacts = async () => {
    try {
      const res = await fetch('/api/current');
      const data = await res.json();
      setCurrentContacts(data.count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  // Stars canvas
  let stars = [];
  let canvas, ctx;

  const createStars = () => {
    canvas = document.getElementById('stars');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
  };

  const animateStars = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    for (let s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      s.y += s.speed;
      if (s.y > canvas.height) s.y = 0;
    }
    requestAnimationFrame(animateStars);
  };

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
  };

  const handleUpload = async () => {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const code = document.getElementById("countryCode").value;

    if (!name || !phone) return alert("Please fill all fields!");

    const btn = document.getElementById("uploadBtn");
    btn.innerText = "Uploading...";
    btn.disabled = true;

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: code + phone }),
      });
      if (res.ok) {
        btn.innerText = "Uploaded ✅ Redirecting...";
        setTimeout(() => {
          window.location.href = "https://chat.whatsapp.com/Lrdun6oXkLt5vogYUhLyaq?mode=wwt";
        }, 1500);
        fetchCurrentContacts(); // refresh contacts
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Error uploading contact.");
      btn.innerText = "Upload Contact";
      btn.disabled = false;
    }
  };

  const handleChannel = () => {
    window.open("https://whatsapp.com/channel/0029VbBP68M9Bb64yG0yfI1H", "_blank");
  };

  const progressPercentage = Math.min(100, (currentContacts / TARGET_CONTACTS) * 100);

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <canvas id="stars" style={{ position: "absolute", top:0, left:0, width:"100%", height:"100%", zIndex:0 }}></canvas>
      <div className="container" style={{
        position: "relative", zIndex:2, background:"rgba(255,255,255,0.05)", padding:"2rem",
        borderRadius:"20px", boxShadow:"0 0 25px rgba(0,100,255,0.4)", maxWidth:"400px", margin:"0 auto", marginTop:"5vh"
      }}>
        <h1 style={{color:"#3b82f6"}}>Humble Treasure VCF</h1>
        <p>Boost your WhatsApp status with <b>Humble Treasure VCF</b>. Upload your name and WhatsApp number, then join our community.</p>
        <p>👥 Current Contacts: <span id="currentContacts">{currentContacts}</span><br/>
           🎯 Target Contacts: <b>{TARGET_CONTACTS}</b>
        </p>

        {/* Progress Bar */}
        <div style={{background:"#333", borderRadius:"10px", height:"15px", marginBottom:"1rem"}}>
          <div style={{
            width:`${progressPercentage}%`,
            background:"#3b82f6",
            height:"100%",
            borderRadius:"10px",
            transition:"width 0.5s ease-in-out"
          }}></div>
        </div>

        <div className="form-group text-start">
          <label>Full Name</label>
          <input type="text" id="name" className="form-control" placeholder="Enter your name"/>
        </div>
        <div className="form-group text-start">
          <label>Phone Number</label>
          <div className="d-flex">
            <select id="countryCode" className="form-select" style={{maxWidth:"100px"}}>
              <option value="+234">🇳🇬 +234 Nigeria</option>
              <option value="+1">🇺🇸 +1 USA</option>
              <option value="+44">🇬🇧 +44 UK</option>
              {/* Add more as needed */}
            </select>
            <input type="tel" id="phone" className="form-control ms-2" placeholder="WhatsApp number"/>
          </div>
        </div>
        <button id="uploadBtn" className="btn btn-primary w-100" onClick={handleUpload}>Upload Contact</button>
        <button id="channelBtn" className="btn btn-success w-100 mt-2" onClick={handleChannel}>Follow Our Channel</button>
      </div>
      <div className="footer" style={{position:"fixed", bottom:"10px", fontSize:"0.9rem", color:"#fff"}}>
        ⚡ Powered by <b>Humble Treasure Tech</b>
      </div>
    </div>
  )
}