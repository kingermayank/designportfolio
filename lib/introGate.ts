// Runs inline in <head> (app/layout.tsx) before first paint and marks
// <html data-intro="play|skip"> for the home load intro (IntroWireframe).
// Plays once per session on a direct landing on "/". Query overrides:
// ?intro=1 replays it, ?intro=0 skips it, ?intro=hold keeps it on screen so
// the CSS animations can be scrubbed in devtools (Animations panel).
export const INTRO_GATE = `(function(){try{if(location.pathname!=="/")return;var d=document.documentElement;var q=new URLSearchParams(location.search).get("intro");var rm=matchMedia("(prefers-reduced-motion: reduce)").matches;if(q==="hold"){d.dataset.introHold="1"}else if(q==="0"||rm||(q!=="1"&&sessionStorage.getItem("intro-seen"))){d.dataset.intro="skip";return}sessionStorage.setItem("intro-seen","1");d.dataset.intro="play"}catch(e){}})();`;
