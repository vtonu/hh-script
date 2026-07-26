import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Copy,
  Download,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Analytics } from "@vercel/analytics/react";

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
    title: "Open the script",
    text: "Add a hi-hat, open Piano Roll, then go to Tools > Scripts > Hi Hat MIDI Generator.",
  },
];

const slides = [
  {
    type: "image",
    src: "/screenshots/tm88-pattern-spacing.jpg",
    alt: "Hi Hat MIDI Generator v1.5.3 showing TM88 and the new pattern spacing styles",
    label: "V1.5.3 PATTERN SPACING STYLES",
  },
  {
    type: "image",
    src: "/screenshots/wheezy-triplet-pairs.jpg",
    alt: "Wheezy Triplet Pairs pattern with Tight pitch variation in FL Studio",
    label: "WHEEZY + TRIPLET PAIRS + TIGHT",
  },
  {
    type: "image",
    src: "/screenshots/tools-scripts-generator.jpg",
    alt: "FL Studio Piano Roll Tools and Scripts menu with Hi Hat MIDI Generator selected",
    label: "TOOLS > SCRIPTS > HI HAT MIDI GENERATOR",
  },
  {
    type: "video",
    src: "/demo.mp4",
    label: "HI HAT MIDI GENERATOR DEMO",
  },
];

function App() {
  const [activeShot, setActiveShot] = useState(0);
  const [copied, setCopied] = useState(false);
  const [pathHighlighted, setPathHighlighted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const changeShot = (direction: number) => {
    setActiveShot(
      (current) => (current + direction + slides.length) % slides.length,
    );
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = 0;
    video.muted = true;
    setVideoMuted(true);
    void video.play().catch(() => undefined);

    return () => {
      video.pause();
      video.currentTime = 0;
    };
  }, [activeShot]);

  const toggleVideoSound = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setVideoMuted(video.muted);
  };

  const playVideoWhenReady = () => {
    if (activeShot === slides.length - 1) {
      void videoRef.current?.play().catch(() => undefined);
    }
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
          HI HAT MIDI <span>GENERATOR</span>
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
            Create endless hi-hat midi patterns inside FL Studio piano roll.
          </p>
          <Button asChild size="lg" className="download-button">
            <a href="/Hi Hat Midi Generator.pyscript" download>
              <Download aria-hidden="true" />
              DOWNLOAD SCRIPT
            </a>
          </Button>
          <p className="file-note">.PYSCRIPT FILE · V1.5.3</p>
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
            <span>{slides[activeShot].label}</span>
            <span>
              0{activeShot + 1} / 0{slides.length}
            </span>
          </div>
          <div className="preview-image">
            <video
              ref={videoRef}
              className={
                slides[activeShot].type === "video" ? "active" : undefined
              }
              src="/demo.mp4"
              poster="/screenshots/tm88-pattern-spacing.jpg"
              muted
              playsInline
              preload="auto"
              onCanPlay={playVideoWhenReady}
            />
            {slides[activeShot].type === "video" ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sound-button"
                  onClick={toggleVideoSound}
                  aria-label={videoMuted ? "Unmute demo" : "Mute demo"}
                >
                  {videoMuted ? <VolumeX /> : <Volume2 />}
                </Button>
              </>
            ) : (
              <img
                src={slides[activeShot].src}
                alt={slides[activeShot].alt}
              />
            )}
          </div>
          <div className="preview-controls">
            <div className="dots" aria-hidden="true">
              {slides.map((slide, index) => (
                <span
                  key={slide.label}
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
      <Analytics />
    </main>
  );
}

export default App;
