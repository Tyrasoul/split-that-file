import { useNavigate } from 'react-router-dom';
import { Scissors, Layers, Github, Coffee } from 'lucide-react';
import '../styles/Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-header">
          <div className="logo-section">
            <Layers className="logo-icon" size={48} />
            <h1 className="app-title">File Splitter & Merger</h1>
          </div>
          <p className="app-subtitle">
            Privacy-first, browser-only tool for splitting and merging files.
            <br />
            No uploads. No servers. Your data stays with you.
          </p>
        </div>

        <div className="action-cards">
          <button
            className="action-card split-card"
            onClick={() => navigate('/split')}
          >
            <div className="card-icon-wrapper">
              <Scissors size={64} strokeWidth={1.5} />
            </div>
            <h2 className="card-title">Split a File</h2>
            <p className="card-description">
              Break your file into smaller chunks for easier sharing and storage
            </p>
            <div className="card-arrow">→</div>
          </button>

          <button
            className="action-card merge-card"
            onClick={() => navigate('/merge')}
          >
            <div className="card-icon-wrapper">
              <Layers size={64} strokeWidth={1.5} />
            </div>
            <h2 className="card-title">Merge Chunks</h2>
            <p className="card-description">
              Reconstruct the original file from previously split chunks
            </p>
            <div className="card-arrow">→</div>
          </button>
        </div>

        <footer className="landing-footer">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <Coffee size={20} />
            <span>Buy Me a Coffee</span>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
