"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./ResumeOverlay.css";

const ResumeContext = createContext<() => void>(() => {});
export const useResume = () => useContext(ResumeContext);
const PDF = "/resume/mayank-kinger.pdf";
const ease = [0.16, 1, 0.3, 1] as const;
const letterEntrance = { y: "100vh", rotateX: 24, rotateZ: -7, scale: 0.8, opacity: 0 };

export default function ResumeProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const paper = useRef<HTMLDivElement>(null);
  const paperBounds = useRef<DOMRect | null>(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reader, setReader] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [settled, setSettled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [open]);

  function resetTilt() {
    paperBounds.current = null;
    const sheet = paper.current;
    if (!sheet) return;
    delete sheet.dataset.hover;
    sheet.style.setProperty("--paper-rx", "0deg");
    sheet.style.setProperty("--paper-ry", "0deg");
  }

  function tiltPaper(event: PointerEvent<HTMLDivElement>) {
    if (!settled || reduce || event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const sheet = paper.current;
    if (!sheet) return;
    // Measure the flat wrapper, never the rotating sheet, to avoid edge jitter.
    const bounds = paperBounds.current ?? event.currentTarget.getBoundingClientRect();
    paperBounds.current = bounds;
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    sheet.dataset.hover = "true";
    sheet.style.setProperty("--paper-rx", `${(0.5 - y) * 3}deg`);
    sheet.style.setProperty("--paper-ry", `${(x - 0.5) * 3}deg`);
    sheet.style.setProperty("--paper-light-x", `${x * 100}%`);
    sheet.style.setProperty("--paper-light-y", `${y * 100}%`);
  }

  function show() {
    resetTilt();
    const active = document.activeElement as HTMLElement | null;
    opener.current = active?.closest(".socialMenu")?.querySelector<HTMLButtonElement>(".socialMenuBtn") ?? active;
    setReader(false);
    setSettled(false);
    setOpen(true);
    setVisible(true);
  }

  return <ResumeContext.Provider value={show}>
    {children}
    <dialog ref={dialog} className="resumeDialog" data-visible={visible} aria-label="Mayank Kinger’s résumé"
      onCancel={event => { event.preventDefault(); setVisible(false); }}>
      <AnimatePresence onExitComplete={() => setOpen(false)}>
        {visible && <motion.div className="resumeOverlay" key="overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduce ? 0.1 : 0.15, delay: reduce ? 0 : 0.1 } }}
          transition={{ duration: reduce ? 0.1 : 0.25 }}>
          <div className="resumeScrim" aria-hidden="true" />
          <div className="resumeControls">
            <button className="workFitBtn workFitBtnGhost" type="button" aria-label="Close résumé" onClick={() => setVisible(false)}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              Close
            </button>
            <a className="workFitBtn workFitBtnSolid" href={PDF} download="Mayank Kinger.pdf">
              Download PDF
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 15v5h16v-5" /></svg>
            </a>
          </div>
          <motion.div className="resumeStage" onScroll={resetTilt}
            exit={reduce ? { opacity: 0 } : { y: "100vh" }}
            transition={{ duration: reduce ? 0.1 : 0.25, ease: [0.4, 0, 1, 1] }}
            onClick={event => {
            if (event.target === event.currentTarget) setVisible(false);
          }}>
            {reader ? <iframe className="resumeReader" src={PDF} title="Mayank Kinger résumé — selectable PDF" /> :
              <div className="resumePaperSpace" data-entering={!settled && !reduce}
                onPointerMove={tiltPaper} onPointerLeave={resetTilt} onPointerCancel={resetTilt}>
                <motion.div className="resumePaperEntrance"
                  initial={reduce ? { opacity: 0 } : letterEntrance}
                  animate={imageReady ? { y: 0, rotateX: 0, rotateZ: 0, scale: 1, opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: reduce ? 0.1 : 0.85, ease }}
                  onAnimationComplete={() => { if (imageReady) setSettled(true); }}>
                  <div className="resumePaper" ref={paper}>
                  {/* An exact PDF render preserves the letter layout throughout the entrance. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/resume/mayank-kinger.webp" width={1563} height={2200}
                    onLoad={() => setImageReady(true)} onError={() => setReader(true)}
                    alt="Mayank Kinger’s résumé. Download PDF to read the original with selectable text and document links." />
                  <div className="resumePaperLight" aria-hidden="true" />
                  </div>
                </motion.div>
              </div>}
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </dialog>
  </ResumeContext.Provider>;
}
