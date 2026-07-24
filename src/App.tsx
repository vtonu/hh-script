import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Copy,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const installPath =
  "C:\\Program Files\\Image-Line\\FL Studio 2026\\System\\Config\\Piano roll scripts";

const steps = [
  {
    title: "Download",
    text: "Download the script, then close FL Studio.",
  },
  {
    title: "Install",
    text: "Place the .pyscript file in the install folder below.",
  },
  {
    title: "Restart FL",
    text: "Open a fresh FL Studio session after the file is installed.",
  },
  {
    title: "Open the tool",
    text: "Add a hi-hat, open Piano Roll, then go to Tools > Scripts > Hi Hat MIDI Generator.",
  },
];

const screenshots = [
  {
    src: "/screenshots/generator.jpg",
    alt: "Hi Hat MIDI Generator inside FL Studio",
    label: "HI HAT MIDI SCRIPT",
  },
  {
    src: "/screenshots/app-closeup.jpg",
    alt: "Hi Hat MIDI Generator app close-up",
    label: "HI HAT MIDI SCRIPT",
  },
  {
    src: "/screenshots/piano-roll-tools.jpg",
    alt: "Piano Roll menu with Tools option",
    label: "TOP LEFT CORNER > DROPDOWN > TOOLS",
  },
  {
    src: "/screenshots/tools-menu.jpg",
    alt: "Tools menu with Hi Hat MIDI Generator",
    label: "TOOLS > SCRIPTS > HI HAT MIDI GENERATOR",
  },
];

function App() {
  const [activeShot, setActiveShot] = useState(0);
  const [copied, setCopied] = useState(false);
  const [pathHighlighted, setPathHighlighted] = useState(false);

  const changeShot = (direction: number) => {
    setActiveShot(
      (current) => (current + direction + screenshots.length) % screenshots.length,
    );
  };

  const copyPath = async () => {
    await navigator.clipboard.writeText(installPath);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const highlightPath = () => {
    setPathHighlighted(false);
    window.requestAnimationFrame(() => setPathHighlighted(true));
    window.setTimeout(() => setPathHighlighted(false), 1600);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Hi Hat MIDI Generator home">
          HI HAT MIDI GENERATOR
        </a>
        <span className="version">FREE FL STUDIO SCRIPT</span>
      </header>

      <div className="layout">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">
            <img src="/favicon.svg" alt="" aria-hidden="true" />
            WORK SMARTER
          </p>
          <h1 id="page-title">
            HI HAT MIDI
            <br />
            <em>GENERATOR.</em>
          </h1>
          <p className="lede">
            Create endless hi-hat midis inside FL Studio.
          </p>
          <Button asChild size="lg" className="download-button">
            <a href="/Hi Hat Midi Generator.pyscript" download>
              <Download aria-hidden="true" />
              DOWNLOAD SCRIPT
            </a>
          </Button>
          <p className="file-note">.PYSCRIPT FILE · V1.5.2</p>
        </section>

        <section className="steps-panel" aria-label="Install">
          <div className="section-heading">
            <p>INSTALL</p>
          </div>

          <ol className="steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="step-number">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  {index === 1 ? (
                    <p>
                      Place the .pyscript file in the{" "}
                      <button className="path-trigger" onClick={highlightPath}>
                        install folder below
                      </button>
                      .
                    </p>
                  ) : (
                    <p>{step.text}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className={`path-box ${pathHighlighted ? "highlighted" : ""}`}>
            <div>
              <span>INSTALL FOLDER</span>
              <code>{installPath}</code>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="copy-button"
              onClick={copyPath}
              aria-label="Copy install folder"
            >
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
        </section>

        <section className="preview-panel" aria-label="FL Studio install guide">
          <div className="preview-top">
            <span>{screenshots[activeShot].label}</span>
            <span>
              0{activeShot + 1} / 0{screenshots.length}
            </span>
          </div>
          <div className="preview-image">
            <img
              src={screenshots[activeShot].src}
              alt={screenshots[activeShot].alt}
            />
          </div>
          <div className="preview-controls">
            <div className="dots" aria-hidden="true">
              {screenshots.map((shot, index) => (
                <span
                  key={shot.label}
                  className={index === activeShot ? "active" : ""}
                />
              ))}
            </div>
            <div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeShot(-1)}
                aria-label="Previous screenshot"
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeShot(1)}
                aria-label="Next screenshot"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </section>
      </div>

      <footer>
        <span className="credit">
          MADE FOR PRODUCERS BY{" "}
          <a
            href="https://www.instagram.com/prodqualitymusic"
            target="_blank"
            rel="noreferrer"
          >
            QUALITY
          </a>
        </span>
        <a
          href="https://buymeacoffee.com/prodbyquality"
          target="_blank"
          rel="noreferrer"
        >
          <Coffee aria-hidden="true" />
          BUY ME A COFFEE
        </a>
      </footer>
    </main>
  );
}

export default App;
