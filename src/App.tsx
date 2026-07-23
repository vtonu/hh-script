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
    text: "Close FL Studio, then download the script.",
  },
  {
    title: "Move the file",
    text: "Place the .pyscript file in the folder shown below.",
  },
  {
    title: "Restart",
    text: "Restart your PC, then open a fresh FL Studio session.",
  },
  {
    title: "Open the tool",
    text: "Add a hi-hat, open Piano Roll, then go to Tools → Hi Hat MIDI Generator.",
  },
];

const screenshots = [
  {
    src: "/screenshots/generator.jpg",
    alt: "Hi Hat MIDI Generator inside FL Studio",
    label: "THE GENERATOR",
  },
  {
    src: "/screenshots/piano-roll-menu.jpg",
    alt: "Piano Roll menu with Tools option",
    label: "OPEN PIANO ROLL MENU",
  },
  {
    src: "/screenshots/tools-menu.jpg",
    alt: "Tools menu with Hi Hat MIDI Generator",
    label: "TOOLS → HI HAT MIDI GENERATOR",
  },
];

function App() {
  const [activeShot, setActiveShot] = useState(0);
  const [copied, setCopied] = useState(false);

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

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Hi Hat MIDI Generator home">
          HH<span>/</span>MIDI
        </a>
        <span className="version">FREE FL STUDIO SCRIPT · V1.5.2</span>
      </header>

      <div className="layout">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">
            <span />
            WORK FASTER
          </p>
          <h1 id="page-title">
            HI HAT
            <br />
            MIDI <em>GENERATOR.</em>
          </h1>
          <p className="lede">
            Build quick hi-hat patterns inside FL Studio. Download the script,
            install it once, and open it from your Piano Roll tools.
          </p>
          <Button asChild size="lg" className="download-button">
            <a href="/Hi Hat Midi Generator.pyscript" download>
              <Download aria-hidden="true" />
              DOWNLOAD SCRIPT
            </a>
          </Button>
          <p className="file-note">.PYSCRIPT · FL STUDIO 2026</p>
        </section>

        <section className="steps-panel" aria-labelledby="steps-title">
          <div className="section-heading">
            <p>INSTALL</p>
            <h2 id="steps-title">4 QUICK STEPS</h2>
          </div>

          <ol className="steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="step-number">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="path-box">
            <div>
              <span>INSTALL FOLDER</span>
              <code>{installPath}</code>
            </div>
            <Button
              variant="ghost"
              size="icon"
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
        <span>MADE FOR PRODUCERS</span>
        <a href="#" onClick={(event) => event.preventDefault()}>
          <Coffee aria-hidden="true" />
          BUY ME A COFFEE
          <small>LINK COMING SOON</small>
        </a>
      </footer>
    </main>
  );
}

export default App;
