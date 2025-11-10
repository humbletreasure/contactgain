
import { useState } from "react";

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // List of country codes example (expand as needed)
  const countryCodes = ["+234", "+1", "+44", "+91", "+86"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!fullName || !phoneNumber) {
      setStatus("Please fill in all fields.");
      return;
    }

    const fullPhone = phoneNumber.startsWith("+") ? phoneNumber : "+234" + phoneNumber;

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phoneNumber: fullPhone })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Contact saved successfully!");
        setFullName("");
        setPhoneNumber("");
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      setStatus("❌ Server error. Try again.");
    }

    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>JUST BETTING 💯</h1>
      <p style={{ textAlign: "center" }}>
        Submit your contact to join our free center. Duplicate numbers are not allowed.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <select
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phoneNumber.startsWith("+") ? phoneNumber.slice(4) : phoneNumber}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="">Select country code</option>
          {countryCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {submitting ? "Submitting..." : "Submit Contact"}
        </button>
      </form>

      {status && <p style={{ marginTop: "15px", textAlign: "center" }}>{status}</p>}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <a
          href="/api/download?key=humble123"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "bold"
          }}
        >
          Download VCF
        </a>
      </div>
    </div>
  );
}
