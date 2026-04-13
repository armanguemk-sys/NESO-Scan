import { useState } from "react";

// ─── Localisation par zone ───────────────────────────────────────────────────
function getLocationOptions(zone) {
  switch (zone) {
    case "Dos":          return { options: ["En haut","Au milieu","En bas","Côté droit","Côté gauche"], optionEmojis: ["⬆️","↔️","⬇️","➡️","⬅️"], multi: true };
    case "Fourmillements": return { options: ["Bras","Épaules","Fesses","Jambe","Pied"], optionEmojis: ["💪","🦾","🍑","🦵","🦶"], multi: true };
    case "Ventre":       return { options: ["Côté droit","Côté gauche","Les deux","Au centre"], optionEmojis: ["➡️","⬅️","↔️","🎯"], multi: false };
    case "Épaule":       return { options: ["Épaule droite","Épaule gauche","Les deux"], optionEmojis: ["➡️","⬅️","↔️"], multi: false };
    case "Coude":        return { options: ["Coude droit","Coude gauche","Les deux"], optionEmojis: ["➡️","⬅️","↔️"], multi: false };
    case "Poignet":      return { options: ["Poignet droit","Poignet gauche","Les deux"], optionEmojis: ["➡️","⬅️","↔️"], multi: false };
    case "Hanche":       return { options: ["Hanche droite","Hanche gauche","Les deux"], optionEmojis: ["➡️","⬅️","↔️"], multi: false };
    case "Genou":        return { options: ["Genou droit","Genou gauche","Les deux"], optionEmojis: ["➡️","⬅️","↔️"], multi: false };
    case "Pied / cheville": return { options: ["Droit(e)","Gauche","Les deux"], optionEmojis: ["➡️","⬅️","↔️"], multi: false };
    case "Tête / vertiges": return { options: ["Côté droit","Côté gauche","Les deux","Au centre"], optionEmojis: ["➡️","⬅️","↔️","🎯"], multi: false };
    default:             return { options: ["Côté droit","Côté gauche","Les deux"], optionEmojis: ["➡️","⬅️","↔️"], multi: false };
  }
}

// ─── Sous-étapes par zone: localisation → sensation → douleur → évolution ───
const PER_ZONE_SUB_STEPS = [
  { type: "location",  key: "location" },
  {
    type: "choice", key: "sensation",
    question: (z) => `Sensation pour ${z} ?`,
    emoji: "💭",
    options: ["Brûlure","Décharge","Raideur","Douleur vive","Ça va et ça vient"],
    optionEmojis: ["🔥","⚡","🧱","🔪","🌊"],
    multi: true,
  },
  {
    type: "scale", key: "pain",
    question: (z) => `Douleur pour ${z} ? (0 → 10)`,
    emoji: "📊",
  },
  {
    type: "choice", key: "painTiming",
    question: (z) => `La douleur de ${z}, c'est quand ?`,
    emoji: "🕐",
    options: ["Le matin au réveil", "Dans la journée", "Le soir", "La nuit", "Tout le temps"],
    optionEmojis: ["🌅", "☀️", "🌆", "🌙", "🔄"],
    multi: true,
  },
  {
    type: "choice", key: "evolution",
    question: (z) => `Évolution pour ${z} ?`,
    emoji: "📈",
    options: ["Ça va mieux","Pareil","Ça empire"],
    optionEmojis: ["✅","➡️","📉"],
    multi: false,
  },
];

// ─── Étapes communes (après toutes les zones) ────────────────────────────────
const COMMON_STEPS = [
  {
    type: "choice", key: "duration",
    question: "Depuis quand ?", emoji: "📅",
    options: ["Aujourd'hui","Quelques jours","Quelques semaines","Depuis longtemps"],
    optionEmojis: ["🌅","📆","🗓️","⏳"],
  },
  {
    type: "choice", key: "cause",
    question: "C'est arrivé comment ?", emoji: "💥",
    options: ["Sport","Faux mouvement","Chute","Progressif","Je ne sais pas"],
    optionEmojis: ["🏃","🌀","😱","🐌","🤷"],
  },
  {
    type: "choice", key: "impact",
    question: "Qu'est-ce qui te gêne le plus ?", emoji: "🚧",
    options: ["Marcher","Courir","Dormir","Travailler","Sport","Bouger"],
    optionEmojis: ["🚶","🏃","😴","💻","⚽","🙆"],
    multi: true,
  },
  {
    type: "choice", key: "unusual",
    question: "As-tu remarqué quelque chose d'inhabituel ?", emoji: "🔍",
    options: ["Fièvre","Douleur la nuit","Perte de poids","Rien","Autre"],
    optionEmojis: ["🤒","🌙","⚖️","✌️","❓"],
    multi: true, hasOther: true,
  },
  {
    type: "text", key: "name",
    question: "Ton prénom ?", emoji: "👋",
  },
];

const ZONES      = ["Dos","Épaule","Coude","Poignet","Hanche","Genou","Pied / cheville","Tête / vertiges","Fourmillements","Ventre","Autre"];
const ZONE_EMOJIS = ["🔙","💪","🦾","🤚","🦴","🦵","🦶","🤯","⚡","🫃","❓"];

const PAIN_SCALE = [
  { value:1,  emoji:"😊", label:"Rien"     },
  { value:2,  emoji:"🙂", label:"Très peu" },
  { value:3,  emoji:"🙂", label:"Léger"    },
  { value:4,  emoji:"😐", label:"Léger+"   },
  { value:5,  emoji:"😐", label:"Modéré"   },
  { value:6,  emoji:"😕", label:"Modéré+"  },
  { value:7,  emoji:"😣", label:"Fort"     },
  { value:8,  emoji:"😣", label:"Fort+"    },
  { value:9,  emoji:"😫", label:"Intense"  },
  { value:10, emoji:"🤯", label:"Max"      },
];

// ─── Styles ──────────────────────────────────────────────────────────────────
const card = (sel) => ({
  display:"flex", flexDirection:"column", alignItems:"center", gap:4,
  padding:"13px 10px", fontSize:14, cursor:"pointer", fontFamily:"inherit",
  textAlign:"center", borderRadius:14, transition:"all 0.18s ease",
  background:   sel ? "linear-gradient(135deg,#4a9fd4,#2d7baa)" : "rgba(255,255,255,0.85)",
  color:        sel ? "white" : "#2a6a8a",
  border:       sel ? "2px solid #2d7baa" : "2px solid rgba(74,159,212,0.3)",
  boxShadow:    sel ? "0 4px 16px rgba(45,123,170,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
});

const confirmBtn = (enabled) => ({
  marginTop:16, width:"100%",
  background: enabled ? "linear-gradient(135deg,#4a9fd4,#2d7baa)" : "rgba(200,220,235,0.6)",
  color: enabled ? "white" : "#a0b8c8",
  border:"none", borderRadius:50, padding:"14px", fontSize:16, fontWeight:"bold",
  cursor: enabled ? "pointer" : "not-allowed", fontFamily:"inherit", transition:"all 0.18s",
});

// ─── Composant ───────────────────────────────────────────────────────────────
export default function KineQuestionnaire() {
  // phase: "intro" | "zones" | "perzone" | "common" | "end"
  const [phase, setPhase]     = useState("intro");
  const [fading, setFading]   = useState(false);

  // Zone selection
  const [selZones, setSelZones]   = useState([]);
  const [otherZone, setOtherZone] = useState("");
  const [showOtherZone, setShowOtherZone] = useState(false);

  // Per-zone sub-steps
  const [zoneIdx, setZoneIdx]     = useState(0);  // which zone
  const [subIdx, setSubIdx]       = useState(0);  // which sub-step within the zone
  const [perZoneData, setPerZoneData] = useState({}); // { "Genou": { location, sensation, pain, evolution } }
  const [locMultiSel, setLocMultiSel] = useState([]);
  const [subMultiSel, setSubMultiSel] = useState([]);

  // Common steps
  const [commonIdx, setCommonIdx]   = useState(0);
  const [commonAnswers, setCommonAns] = useState({});
  const [commonMultiSel, setCommonMultiSel] = useState([]);
  const [commonTextVal, setCommonTextVal]   = useState("");
  const [showUnusualOther, setShowUnusualOther] = useState(false);
  const [unusualOther, setUnusualOther]         = useState("");

  const fade = (fn) => { setFading(true); setTimeout(() => { fn(); setFading(false); }, 220); };

  // ── Progress ──
  const nZones    = selZones.length || 1;
  const totalSteps = 1 + nZones * PER_ZONE_SUB_STEPS.length + COMMON_STEPS.length;
  const curStep =
    phase === "intro"   ? 0 :
    phase === "zones"   ? 1 :
    phase === "perzone" ? 1 + zoneIdx * PER_ZONE_SUB_STEPS.length + subIdx + 1 :
    phase === "common"  ? 1 + nZones * PER_ZONE_SUB_STEPS.length + commonIdx + 1 :
    totalSteps;
  const progress = Math.round((curStep / totalSteps) * 100);

  // ── Zone handlers ──
  const toggleZone = (z) => {
    if (z === "Autre") { setShowOtherZone(v => !v); return; }
    setSelZones(p => p.includes(z) ? p.filter(x => x !== z) : [...p, z]);
  };

  const confirmZones = () => {
    const zones = [...selZones];
    if (otherZone.trim()) zones.push(otherZone.trim());
    if (!zones.length) return;
    setSelZones(zones);
    fade(() => { setZoneIdx(0); setSubIdx(0); setLocMultiSel([]); setSubMultiSel([]); setPhase("perzone"); });
  };

  // ── Per-zone handlers ──
  const currentZone = selZones[zoneIdx] || "";
  const currentSub  = PER_ZONE_SUB_STEPS[subIdx];
  const locOpts     = getLocationOptions(currentZone);

  const saveZoneAnswer = (key, value) => {
    setPerZoneData(d => ({
      ...d,
      [currentZone]: { ...(d[currentZone] || {}), [key]: value },
    }));
  };

  const advanceSub = () => {
    const nextSub = subIdx + 1;
    if (nextSub < PER_ZONE_SUB_STEPS.length) {
      fade(() => { setSubIdx(nextSub); setLocMultiSel([]); setSubMultiSel([]); });
    } else {
      const nextZone = zoneIdx + 1;
      if (nextZone < selZones.length) {
        fade(() => { setZoneIdx(nextZone); setSubIdx(0); setLocMultiSel([]); setSubMultiSel([]); });
      } else {
        fade(() => { setCommonIdx(0); setPhase("common"); });
      }
    }
  };

  const pickLocation = (opt) => { saveZoneAnswer("location", opt); advanceSub(); };
  const confirmMultiLoc = () => {
    if (!locMultiSel.length) return;
    saveZoneAnswer("location", locMultiSel); advanceSub();
  };
  const pickSubChoice = (opt) => { saveZoneAnswer(currentSub.key, opt); advanceSub(); };
  const confirmMultiSub = () => {
    if (!subMultiSel.length) return;
    saveZoneAnswer(currentSub.key, subMultiSel); advanceSub();
  };
  const pickScale = (val) => { saveZoneAnswer(currentSub.key, val); advanceSub(); };

  // ── Common handlers ──
  const currentCommon = COMMON_STEPS[commonIdx];

  const pickCommon = (opt) => {
    setCommonAns(a => ({ ...a, [currentCommon.key]: opt }));
    advanceCommon();
  };
  const confirmCommonMulti = () => {
    const combined = [...commonMultiSel];
    if (unusualOther.trim()) combined.push(unusualOther.trim());
    if (!combined.length) return;
    setCommonAns(a => ({ ...a, [currentCommon.key]: combined }));
    setCommonMultiSel([]); setUnusualOther(""); setShowUnusualOther(false);
    advanceCommon();
  };
  const confirmCommonText = () => {
    if (!commonTextVal.trim()) return;
    setCommonAns(a => ({ ...a, [currentCommon.key]: commonTextVal.trim() }));
    setCommonTextVal(""); advanceCommon();
  };
  const advanceCommon = () => {
    if (commonIdx + 1 < COMMON_STEPS.length) {
      fade(() => { setCommonIdx(i => i + 1); setCommonMultiSel([]); setCommonTextVal(""); });
    } else {
      fade(() => setPhase("end"));
    }
  };

  // ── Go back ──
  const goBack = () => {
    if (phase === "perzone") {
      if (subIdx > 0) {
        fade(() => { setSubIdx(s => s - 1); setLocMultiSel([]); setSubMultiSel([]); });
      } else if (zoneIdx > 0) {
        fade(() => { setZoneIdx(z => z - 1); setSubIdx(PER_ZONE_SUB_STEPS.length - 1); });
      } else {
        fade(() => setPhase("zones"));
      }
    } else if (phase === "common") {
      if (commonIdx > 0) {
        fade(() => { setCommonIdx(i => i - 1); setCommonMultiSel([]); setCommonTextVal(""); });
      } else {
        fade(() => { setZoneIdx(selZones.length - 1); setSubIdx(PER_ZONE_SUB_STEPS.length - 1); setPhase("perzone"); });
      }
    }
  };

  const showBack = phase === "perzone" || phase === "common";

  // ── Render helpers ──
  const ChoiceGrid = ({ options, emojis, isMulti, multiSel, onToggle, onPick, onConfirm }) => (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {options.map((opt, i) => {
          const sel = isMulti ? multiSel.includes(opt) : false;
          return (
            <button key={opt}
              onClick={() => isMulti ? onToggle(opt) : onPick(opt)}
              style={card(sel)}
              onMouseOver={e => { if (!sel) e.currentTarget.style.background="rgba(255,255,255,1)"; }}
              onMouseOut={e  => { if (!sel) e.currentTarget.style.background="rgba(255,255,255,0.85)"; }}
            >
              <span style={{ fontSize:22 }}>{emojis[i]}</span>
              <span style={{ fontWeight: sel ? "bold" : "normal" }}>{opt}</span>
            </button>
          );
        })}
      </div>
      {isMulti && (
        <button onClick={onConfirm} disabled={!multiSel.length} style={confirmBtn(multiSel.length > 0)}>
          Confirmer →
        </button>
      )}
    </>
  );

  const ScaleGrid = ({ onPick }) => (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
      {PAIN_SCALE.map(({ value, emoji, label }) => (
        <button key={value} onClick={() => onPick(value)} style={{
          background:"rgba(255,255,255,0.85)", border:"2px solid rgba(74,159,212,0.3)",
          borderRadius:16, padding:"12px 6px", cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", gap:4,
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)", transition:"all 0.18s ease", fontFamily:"inherit",
        }}
          onMouseOver={e => { e.currentTarget.style.background="linear-gradient(135deg,#4a9fd4,#2d7baa)"; e.currentTarget.style.transform="translateY(-3px)"; }}
          onMouseOut={e  => { e.currentTarget.style.background="rgba(255,255,255,0.85)"; e.currentTarget.style.transform="translateY(0)"; }}
        >
          <span style={{ fontSize:24 }}>{emoji}</span>
          <span style={{ fontSize:17, fontWeight:"bold", color:"#2d7baa" }}>{value}</span>
          <span style={{ fontSize:10, color:"#5a8fa8" }}>{label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#e8f4f8 0%,#d4eaf7 40%,#c8e0f0 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      fontFamily:"'Georgia','Times New Roman',serif",
      padding:"20px", position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"fixed", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:"rgba(100,180,240,0.15)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:-60, left:-60, width:250, height:250, borderRadius:"50%", background:"rgba(80,160,220,0.12)", pointerEvents:"none" }} />

      {phase !== "intro" && phase !== "end" && (
        <div style={{ position:"fixed", top:0, left:0, right:0, height:5, background:"rgba(255,255,255,0.4)" }}>
          <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#4a9fd4,#2d7baa)", transition:"width 0.4s ease", borderRadius:"0 3px 3px 0" }} />
        </div>
      )}

      <div style={{
        width:"100%", maxWidth:480,
        opacity: fading ? 0 : 1,
        transform: fading ? "translateY(10px)" : "translateY(0)",
        transition:"opacity 0.22s ease, transform 0.22s ease",
      }}>

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:72, marginBottom:16 }}>🏥</div>
            <h1 style={{ fontSize:28, color:"#1a5a82", fontWeight:"bold", marginBottom:12, lineHeight:1.3 }}>
              On va t'aider à préparer<br />ta séance 👍
            </h1>
            <p style={{ fontSize:18, color:"#4a7a9b", marginBottom:32, fontStyle:"italic" }}>2 minutes suffisent ⏱️</p>
            <p style={{ fontSize:15, color:"#5a8fa8", marginBottom:40, lineHeight:1.6 }}>
              Quelques questions simples pour que ton kiné<br />connaisse déjà ton état avant de te voir.
            </p>
            <button onClick={() => fade(() => setPhase("zones"))} style={{
              background:"linear-gradient(135deg,#4a9fd4,#2d7baa)", color:"white", border:"none",
              borderRadius:50, padding:"16px 48px", fontSize:18, fontWeight:"bold", cursor:"pointer",
              boxShadow:"0 6px 20px rgba(45,123,170,0.35)", fontFamily:"inherit",
            }}>C'est parti →</button>
          </div>
        )}

        {/* ── ZONES ── */}
        {phase === "zones" && (
          <div>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:44, marginBottom:10 }}>🤔</div>
              <h2 style={{ fontSize:22, color:"#1a5a82", fontWeight:"bold", margin:0 }}>Qu'est-ce qui te gêne ?</h2>
              <p style={{ fontSize:13, color:"#7aafc8", marginTop:6 }}>Plusieurs choix possibles</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {ZONES.map((z, i) => {
                const sel = selZones.includes(z) || (z === "Autre" && showOtherZone);
                return (
                  <button key={z} onClick={() => toggleZone(z)} style={card(sel)}
                    onMouseOver={e => { if (!sel) e.currentTarget.style.background="rgba(255,255,255,1)"; }}
                    onMouseOut={e  => { if (!sel) e.currentTarget.style.background="rgba(255,255,255,0.85)"; }}
                  >
                    <span style={{ fontSize:22 }}>{ZONE_EMOJIS[i]}</span>
                    <span style={{ fontWeight: sel ? "bold" : "normal" }}>{z}</span>
                  </button>
                );
              })}
            </div>
            {showOtherZone && (
              <input type="text" value={otherZone} onChange={e => setOtherZone(e.target.value)}
                placeholder="Précise la zone…" autoFocus
                style={{
                  width:"100%", padding:"13px 16px", fontSize:15, marginTop:12,
                  border:"2px solid rgba(74,159,212,0.5)", borderRadius:14,
                  background:"rgba(255,255,255,0.9)", color:"#1a5a82",
                  fontFamily:"inherit", outline:"none", boxSizing:"border-box",
                }}
              />
            )}
            <button onClick={confirmZones}
              disabled={!selZones.length && !otherZone.trim()}
              style={confirmBtn(selZones.length > 0 || otherZone.trim().length > 0)}
            >Confirmer →</button>
          </div>
        )}

        {/* ── PER-ZONE SUB-STEPS ── */}
        {phase === "perzone" && currentSub && (
          <div>
            {/* LOCATION */}
            {currentSub.type === "location" && (
              <>
                <div style={{ textAlign:"center", marginBottom:24 }}>
                  <div style={{ fontSize:44, marginBottom:10 }}>📍</div>
                  <h2 style={{ fontSize:22, color:"#1a5a82", fontWeight:"bold", margin:0 }}>
                    {currentZone} — où exactement ?
                  </h2>
                  {locOpts.multi && <p style={{ fontSize:13, color:"#7aafc8", marginTop:6 }}>Plusieurs choix possibles</p>}
                </div>
                <ChoiceGrid
                  options={locOpts.options} emojis={locOpts.optionEmojis}
                  isMulti={locOpts.multi} multiSel={locMultiSel}
                  onToggle={opt => setLocMultiSel(p => p.includes(opt) ? p.filter(x=>x!==opt) : [...p, opt])}
                  onPick={pickLocation}
                  onConfirm={confirmMultiLoc}
                />
              </>
            )}

            {/* CHOICE sub-step (sensation, evolution) */}
            {currentSub.type === "choice" && (
              <>
                <div style={{ textAlign:"center", marginBottom:24 }}>
                  <div style={{ fontSize:44, marginBottom:10 }}>{currentSub.emoji}</div>
                  <h2 style={{ fontSize:22, color:"#1a5a82", fontWeight:"bold", margin:0 }}>
                    {currentSub.question(currentZone)}
                  </h2>
                  {currentSub.multi && <p style={{ fontSize:13, color:"#7aafc8", marginTop:6 }}>Plusieurs choix possibles</p>}
                </div>
                <ChoiceGrid
                  options={currentSub.options} emojis={currentSub.optionEmojis}
                  isMulti={currentSub.multi || false} multiSel={subMultiSel}
                  onToggle={opt => setSubMultiSel(p => p.includes(opt) ? p.filter(x=>x!==opt) : [...p, opt])}
                  onPick={pickSubChoice}
                  onConfirm={confirmMultiSub}
                />
              </>
            )}

            {/* SCALE sub-step (pain) */}
            {currentSub.type === "scale" && (
              <>
                <div style={{ textAlign:"center", marginBottom:32 }}>
                  <div style={{ fontSize:44, marginBottom:10 }}>{currentSub.emoji}</div>
                  <h2 style={{ fontSize:22, color:"#1a5a82", fontWeight:"bold", margin:0 }}>
                    {currentSub.question(currentZone)}
                  </h2>
                </div>
                <ScaleGrid onPick={pickScale} />
              </>
            )}
          </div>
        )}

        {/* ── COMMON STEPS ── */}
        {phase === "common" && currentCommon && (
          <div>
            {currentCommon.type === "choice" && (
              <>
                <div style={{ textAlign:"center", marginBottom:24 }}>
                  <div style={{ fontSize:44, marginBottom:10 }}>{currentCommon.emoji}</div>
                  <h2 style={{ fontSize:22, color:"#1a5a82", fontWeight:"bold", margin:0 }}>{currentCommon.question}</h2>
                  {currentCommon.multi && <p style={{ fontSize:13, color:"#7aafc8", marginTop:6 }}>Plusieurs choix possibles</p>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {currentCommon.options.map((opt, i) => {
                    const isOtherBtn = currentCommon.hasOther && opt === "Autre";
                    const sel = currentCommon.multi
                      ? (isOtherBtn ? showUnusualOther : commonMultiSel.includes(opt))
                      : commonAnswers[currentCommon.key] === opt;
                    return (
                      <button key={opt}
                        onClick={() => {
                          if (isOtherBtn) { setShowUnusualOther(v => !v); return; }
                          if (currentCommon.multi) {
                            setCommonMultiSel(p => p.includes(opt) ? p.filter(x=>x!==opt) : [...p, opt]);
                          } else {
                            pickCommon(opt);
                          }
                        }}
                        style={card(sel)}
                        onMouseOver={e => { if (!sel) e.currentTarget.style.background="rgba(255,255,255,1)"; }}
                        onMouseOut={e  => { if (!sel) e.currentTarget.style.background="rgba(255,255,255,0.85)"; }}
                      >
                        <span style={{ fontSize:22 }}>{currentCommon.optionEmojis[i]}</span>
                        <span style={{ fontWeight: sel ? "bold" : "normal" }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {showUnusualOther && (
                  <input type="text" value={unusualOther} onChange={e => setUnusualOther(e.target.value)}
                    placeholder="Précise ce que tu as remarqué…" autoFocus
                    style={{
                      width:"100%", padding:"13px 16px", fontSize:15, marginTop:12,
                      border:"2px solid rgba(74,159,212,0.5)", borderRadius:14,
                      background:"rgba(255,255,255,0.9)", color:"#1a5a82",
                      fontFamily:"inherit", outline:"none", boxSizing:"border-box",
                    }}
                  />
                )}
                {currentCommon.multi && (
                  <button onClick={confirmCommonMulti}
                    disabled={commonMultiSel.length === 0 && !unusualOther.trim()}
                    style={confirmBtn(commonMultiSel.length > 0 || unusualOther.trim().length > 0)}>
                    Confirmer →
                  </button>
                )}
              </>
            )}

            {currentCommon.type === "text" && (
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:44, marginBottom:10 }}>{currentCommon.emoji}</div>
                <h2 style={{ fontSize:22, color:"#1a5a82", fontWeight:"bold", marginBottom:24 }}>{currentCommon.question}</h2>
                <input type="text" value={commonTextVal} onChange={e => setCommonTextVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && confirmCommonText()}
                  placeholder="Ton prénom…" autoFocus
                  style={{
                    width:"100%", padding:"15px 18px", fontSize:17,
                    border:"2px solid rgba(74,159,212,0.4)", borderRadius:14,
                    background:"rgba(255,255,255,0.85)", color:"#1a5a82",
                    fontFamily:"inherit", outline:"none", boxSizing:"border-box",
                    marginBottom:14, boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                  }}
                />
                <button onClick={confirmCommonText} disabled={!commonTextVal.trim()}
                  style={confirmBtn(commonTextVal.trim().length > 0)}>Terminer →</button>
              </div>
            )}
          </div>
        )}

        {/* ── END ── */}
        {phase === "end" && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:72, marginBottom:20, animation:"bounce 0.6s ease" }}>🎉</div>
            <h1 style={{ fontSize:28, color:"#1a5a82", fontWeight:"bold", marginBottom:12 }}>Parfait 👍</h1>
            <p style={{ fontSize:18, color:"#3d7a9c", marginBottom:8, lineHeight:1.6 }}>
              {commonAnswers.name ? `Merci ${commonAnswers.name} !` : "Merci !"}
            </p>
            <p style={{ fontSize:16, color:"#5a8fa8", marginBottom:36, lineHeight:1.7 }}>
              Ton kiné a déjà une première vision pour t'aider.<br />On se retrouve lors de ta prochaine séance 🙌
            </p>

            <div style={{
              background:"rgba(255,255,255,0.75)", borderRadius:18, padding:"20px 24px",
              textAlign:"left", boxShadow:"0 4px 20px rgba(45,123,170,0.12)", border:"1px solid rgba(74,159,212,0.2)",
            }}>
              <p style={{ fontSize:13, fontWeight:"bold", color:"#4a9fd4", marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Récapitulatif</p>

              {selZones.map(z => {
                const d = perZoneData[z] || {};
                return (
                  <div key={z} style={{ marginBottom:10 }}>
                    <p style={{ fontSize:13, fontWeight:"bold", color:"#2d7baa", margin:"6px 0 4px" }}>📌 {z}</p>
                    {[
                      ["Localisation", d.location ? (Array.isArray(d.location) ? d.location.join(", ") : d.location) : null],
                      ["Sensation",    d.sensation ? (Array.isArray(d.sensation) ? d.sensation.join(", ") : d.sensation) : null],
                      ["Douleur",      d.pain != null ? `${d.pain}/10` : null],
                      ["Douleur présente", d.painTiming ? (Array.isArray(d.painTiming) ? d.painTiming.join(", ") : d.painTiming) : null],
                      ["Évolution",    d.evolution],
                    ].filter(([,v]) => v).map(([label, value]) => (
                      <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid rgba(74,159,212,0.08)", fontSize:13 }}>
                        <span style={{ color:"#7aafc8" }}>{label}</span>
                        <span style={{ color:"#1a5a82", fontWeight:"bold" }}>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                );
              })}

              <div style={{ borderTop:"1.5px solid rgba(74,159,212,0.15)", marginTop:8, paddingTop:8 }}>
                {[
                  ["Depuis",             commonAnswers.duration],
                  ["Cause",              commonAnswers.cause],
                  ["Gêne principale",    Array.isArray(commonAnswers.impact) ? commonAnswers.impact.join(", ") : commonAnswers.impact],
                  ["Signes inhabituels", Array.isArray(commonAnswers.unusual) ? commonAnswers.unusual.join(", ") : commonAnswers.unusual],
                ].filter(([,v]) => v).map(([label, value]) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid rgba(74,159,212,0.08)", fontSize:13 }}>
                    <span style={{ color:"#7aafc8" }}>{label}</span>
                    <span style={{ color:"#1a5a82", fontWeight:"bold" }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => {
              setPhase("intro"); setSelZones([]); setOtherZone(""); setShowOtherZone(false);
              setZoneIdx(0); setSubIdx(0); setPerZoneData({}); setLocMultiSel([]); setSubMultiSel([]);
              setCommonIdx(0); setCommonAns({}); setCommonMultiSel([]); setCommonTextVal("");
              setShowUnusualOther(false); setUnusualOther("");
            }} style={{
              marginTop:24, background:"transparent", color:"#4a9fd4",
              border:"2px solid rgba(74,159,212,0.4)", borderRadius:50,
              padding:"12px 32px", fontSize:15, cursor:"pointer", fontFamily:"inherit",
            }}>Recommencer</button>
          </div>
        )}

        {/* Back + counter */}
        {showBack && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:22 }}>
            <button onClick={goBack} style={{
              background:"transparent", border:"none", color:"#7aafc8",
              fontSize:15, cursor:"pointer", fontFamily:"inherit", padding:"4px 0",
            }}>← Retour</button>
            <p style={{ fontSize:13, color:"#7aafc8", margin:0 }}>{curStep} / {totalSteps}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%   { transform:scale(0.5); opacity:0; }
          70%  { transform:scale(1.1); }
          100% { transform:scale(1);   opacity:1; }
        }
      `}</style>
    </div>
  );
}
