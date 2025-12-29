import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FolderArchive, AlertCircle, Download, Loader } from "lucide-react";
import JSZip from "jszip";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import "../styles/Merge.css";

async function sha256(blob) {
  const buffer = await blob.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(hash)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

const Merge = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [zipFile, setZipFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const mergeFile = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const zip = await JSZip.loadAsync(zipFile);
      const manifest = JSON.parse(
        await zip.file("manifest.json").async("text")
      );

      const blobs = [];

      for (let i = 0; i < manifest.chunks.length; i++) {
        const { name, hash } = manifest.chunks[i];
        const chunkFile = zip.file(name);
        if (!chunkFile) throw new Error("Missing chunk");

        const blob = await chunkFile.async("blob");
        const computed = await sha256(blob);

        if (computed !== hash) {
          throw new Error(`Integrity check failed: ${name}`);
        }

        blobs.push(blob);
        setProgress(Math.round(((i + 1) / manifest.chunks.length) * 80));
      }

      const finalBlob = new Blob(blobs);
      const url = URL.createObjectURL(finalBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = manifest.originalFileName;
      a.click();
    } catch (e) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="merge-container">
      <div className="merge-content">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {!zipFile ? (
          <div
            className="upload-zone"
            onClick={() => inputRef.current.click()}
          >
            <FolderArchive size={64} />
            <h3>Upload ZIP</h3>
            <input
              ref={inputRef}
              type="file"
              accept=".zip"
              hidden
              onChange={e => setZipFile(e.target.files[0])}
            />
          </div>
        ) : (
          <Button className="merge-button" onClick={mergeFile}>
            Merge Now
          </Button>
        )}

        {isProcessing && (
          <div className="progress-section">
            <div className="progress-header">
              <Loader className="spinner" />
              <span>Verifying & merging…</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Merge;
