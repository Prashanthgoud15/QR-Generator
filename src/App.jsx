import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function App() {
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrSvg, setQrSvg] = useState("");

  useEffect(() => {
    if (!text.trim()) {
      setQrDataUrl("");
      setQrSvg("");
      return;
    }

    const timer = setTimeout(() => {
      generateQR(text);
    }, 150);

    return () => clearTimeout(timer);
  }, [text]);

  async function generateQR(value) {
    try {
      // Generate PNG data URL
      const dataUrl = await QRCode.toDataURL(value, {
        width: 512,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
      setQrDataUrl(dataUrl);

      // Generate SVG string
      const svg = await QRCode.toString(value, {
        type: "svg",
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
      setQrSvg(svg);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  }

  function downloadPNG() {
    if (!qrDataUrl) return;

    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qr-code.png";
    a.click();
  }

  function downloadSVG() {
    if (!qrSvg) return;

    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.svg";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <div className="shell">
        <main className="card">
          <header className="header">
            <h1 className="title">QR Generator</h1>
            <p className="subtitle">Instant, private QR codes for links and text.</p>
            {/* <a
              className="authorBadge"
              href="https://www.linkedin.com/in/prashanth-goud-372485294/"
              target="_blank"
              rel="noreferrer"
              aria-label="Open PrashanthGoud LinkedIn profile"
            >
              
            </a> */}
          </header>

          <div className="inputGroup">
            <label className="label" htmlFor="qr-input">
              Link or Text
            </label>
            <textarea
              id="qr-input"
              className="input"
              placeholder="Enter a URL or text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              aria-label="Enter URL or text for QR code"
            />
          </div>

          <div className="preview">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Generated QR Code" className="qrImage" />
            ) : (
              <div className="empty">Enter text to generate QR</div>
            )}
          </div>

          <div className="actions">
            <button
              className="btnPrimary"
              onClick={downloadPNG}
              disabled={!qrDataUrl}
              aria-label="Download QR code as PNG"
            >
              Download PNG
            </button>
            <button
              className="btnGhost"
              onClick={downloadSVG}
              disabled={!qrSvg}
              aria-label="Download QR code as SVG"
            >
              Download SVG
            </button>
          </div>
        </main>

        <footer className="credit">
          <a
            className="creditLink"
            href="https://www.linkedin.com/in/prashanth-goud-372485294/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open PrashanthGoud LinkedIn profile"
          >
            💼 Coded by PrashanthGoud
          </a>
        </footer>
      </div>
    </div>
  );
}
