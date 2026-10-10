"use client";

import { useRef, useState } from "react";
import { ABOUT_INTRO } from "@/lib/about";
import type { AboutMotion } from "@/lib/aboutTransition";
import "./AboutMotionLab.css";

const choices: { id: AboutMotion; name: string; description: string }[] = [
  { id: "aperture", name: "Aperture reveal", description: "An expanding window and a soft photo fade." },
  { id: "settle", name: "Photo settles", description: "The small portrait travels into its place." },
  { id: "turn", name: "Turn the card", description: "A perspective flip opens into the page." },
];

export default function AboutMotionLab({ selected, onSelect, onPreview, onBack, onAbout, busy }: {
  selected: AboutMotion;
  onSelect: (choice: AboutMotion) => void;
  onPreview: (source: HTMLElement) => void;
  onBack: () => void;
  onAbout: boolean;
  busy: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const source = useRef<HTMLSpanElement>(null);
  return <aside className="aboutMotionLab" aria-label="About transition comparison" hidden={busy}>
    <div className="aboutMotionLabHeader">
      <span>ABOUT MOTION LAB</span>
      <button type="button" aria-expanded={!collapsed} aria-controls="about-motion-options"
        onClick={() => setCollapsed(!collapsed)}>{collapsed ? "Expand" : "Minimize"}</button>
    </div>
    <div id="about-motion-options" hidden={collapsed}>
      <fieldset>
        <legend>Choose an entrance</legend>
        {choices.map((choice, index) => <label key={choice.id} data-selected={choice.id === selected}>
          <input type="radio" name="about-motion" value={choice.id} checked={choice.id === selected}
            onChange={() => onSelect(choice.id)} />
          <span className="aboutMotionLabNumber">0{index + 1}</span>
          <span><strong>{choice.name}</strong><small>{choice.description}</small></span>
        </label>)}
      </fieldset>
      {onAbout ? <button className="aboutMotionLabPlay" type="button" onClick={onBack}>← Back to compare</button>
        : <div className="aboutMotionLabPreview">
          <span ref={source} className="aboutMotionLabPortrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ABOUT_INTRO.hero.src} alt="" width={904} height={1024} />
          </span>
          <div><button className="aboutMotionLabPlay" type="button"
            onClick={() => { if (source.current) onPreview(source.current); }}>Preview entrance →</button>
            <p>Or hover and click About me.</p></div>
        </div>}
    </div>
  </aside>;
}
