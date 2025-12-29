import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, File, AlertCircle, Download, Loader } from "lucide-react";
import JSZip from "jszip";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import "../styles/Split.css";

async function sha256(blob) {
  const buffer = await blob.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(hash)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

const Split = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [chunkSize, setChunkSize] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const splitFile = async () => {
    setIsProcessing(true);
    setProgress(0);
    setError("");

    try {
      const zip = new JSZip();
      const chunks = [];
      const totalChunks = Math.ceil(file.size / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const blob = file.slice(start, end);
        const hash = await sha256(blob);

        const name = `part${String(i + 1).padStart(3, "0")}`;
        zip.file(name, blob);
        chunks.push({ name, hash });

        setProgress(Math.round(((i + 1) / totalChunks) * 60));
      }

      zip.file(
        "manifest.json",
        JSON.stringify(
          {
            originalFileName: file.name,
            chunkSize,
            totalChunks,
            chunks
          },
          null,
          2
        )
      );

      setProgress(80);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setProgress(100);

      setDownloadUrl(URL.createObjectURL(zipBlob));
      setCompleted(true);
    } catch (e) {
      setError("Failed to split file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="split-container">
      <div className="split-content">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {!file ? (
          <div
            className="upload-zone"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload size={64} />
            <h3>Drop file here or click to browse</h3>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={e => setFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="file-info-card">
            <div className="file-icon-wrapper">
              <File size={48} />
            </div>
            <div className="file-details">
              <h3 className="file-name">{file.name}</h3>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {file && !completed && !isProcessing && (
          <>
            <Button className="split-button" onClick={splitFile}>
              Split Now
            </Button>
          </>
        )}

        {isProcessing && (
          <div className="progress-section">
            <div className="progress-header">
              <Loader className="spinner" />
              <span>Processing…</span>
            </div>
            <Progress value={progress} />
            <p className="progress-text">{progress}%</p>
          </div>
        )}

        {completed && (
          <div className="success-section">
            <div className="success-icon">
              <Download size={48} />
            </div>
            <h3 className="success-title">Split Complete</h3>

            <a
              href={downloadUrl}
              download={`${file.name}.zip`}
              className="split-button"
            >
              Download ZIP
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Split;
