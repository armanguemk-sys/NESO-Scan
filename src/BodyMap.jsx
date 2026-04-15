import { useState } from "react";

const PAIN_COLORS = {
  pain_high:   { color: "#ef4444", label: "Très mal",          emoji: "🔴" },
  pain_mid:    { color: "#f97316", label: "Mal",               emoji: "🟠" },
  pain_low:    { color: "#22c55e", label: "Gêne quotidienne",  emoji: "🟢" },
  tingle_high: { color: "#a855f7", label: "Fourmil. intenses", emoji: "🟣" },
  tingle_mid:  { color: "#3b82f6", label: "Fourmil. modérés",  emoji: "🔵" },
  tingle_low:  { color: "#eab308", label: "Fourmil. légers",   emoji: "🟡" },
};

// Real SVG path from SVGRepo (viewBox 206.326 x 206.326)
const BODY_PATH = `M104.265,117.959c-0.304,3.58,2.126,22.529,3.38,29.959c0.597,3.52,2.234,9.255,1.645,12.3
  c-0.841,4.244-1.084,9.736-0.621,12.934c0.292,1.942,1.211,10.899-0.104,14.175c-0.688,1.718-1.949,10.522-1.949,10.522
  c-3.285,8.294-1.431,7.886-1.431,7.886c1.017,1.248,2.759,0.098,2.759,0.098c1.327,0.846,2.246-0.201,2.246-0.201
  c1.139,0.943,2.467-0.116,2.467-0.116c1.431,0.743,2.758-0.627,2.758-0.627c0.822,0.414,1.023-0.109,1.023-0.109
  c2.466-0.158-1.376-8.05-1.376-8.05c-0.92-7.088,0.913-11.033,0.913-11.033c6.004-17.805,6.309-22.53,3.909-29.24
  c-0.676-1.937-0.847-2.704-0.536-3.545c0.719-1.941,0.195-9.748,1.072-12.848c1.692-5.979,3.361-21.142,4.231-28.217
  c1.169-9.53-4.141-22.308-4.141-22.308c-1.163-5.2,0.542-23.727,0.542-23.727c2.381,3.705,2.29,10.245,2.29,10.245
  c-0.378,6.859,5.541,17.342,5.541,17.342c2.844,4.332,3.921,8.442,3.921,8.747c0,1.248-0.273,4.269-0.273,4.269l0.109,2.631
  c0.049,0.67,0.426,2.977,0.365,4.092c-0.444,6.862,0.646,5.571,0.646,5.571c0.92,0,1.931-5.522,1.931-5.522
  c0,1.424-0.348,5.687,0.42,7.295c0.919,1.918,1.595-0.329,1.607-0.78c0.243-8.737,0.768-6.448,0.768-6.448
  c0.511,7.088,1.139,8.689,2.265,8.135c0.853-0.407,0.073-8.506,0.073-8.506c1.461,4.811,2.569,5.577,2.569,5.577
  c2.411,1.693,0.92-2.983,0.585-3.909c-1.784-4.92-1.839-6.625-1.839-6.625c2.229,4.421,3.909,4.257,3.909,4.257
  c2.174-0.694-1.9-6.954-4.287-9.953c-1.218-1.528-2.789-3.574-3.245-4.789c-0.743-2.058-1.304-8.674-1.304-8.674
  c-0.225-7.807-2.155-11.198-2.155-11.198c-3.3-5.282-3.921-15.135-3.921-15.135l-0.146-16.635
  c-1.157-11.347-9.518-11.429-9.518-11.429c-8.451-1.258-9.627-3.988-9.627-3.988c-1.79-2.576-0.767-7.514-0.767-7.514
  c1.485-1.208,2.058-4.415,2.058-4.415c2.466-1.891,2.345-4.658,1.206-4.628c-0.914,0.024-0.707-0.733-0.707-0.733
  C115.068,0.636,104.01,0,104.01,0h-1.688c0,0-11.063,0.636-9.523,13.089c0,0,0.207,0.758-0.715,0.733
  c-1.136-0.03-1.242,2.737,1.215,4.628c0,0,0.572,3.206,2.058,4.415c0,0,1.023,4.938-0.767,7.514c0,0-1.172,2.73-9.627,3.988
  c0,0-8.375,0.082-9.514,11.429l-0.158,16.635c0,0-0.609,9.853-3.922,15.135c0,0-1.921,3.392-2.143,11.198
  c0,0-0.563,6.616-1.303,8.674c-0.451,1.209-2.021,3.255-3.249,4.789c-2.408,2.993-6.455,9.24-4.29,9.953
  c0,0,1.689,0.164,3.909-4.257c0,0-0.046,1.693-1.827,6.625c-0.35,0.914-1.839,5.59,0.573,3.909c0,0,1.117-0.767,2.569-5.577
  c0,0-0.779,8.099,0.088,8.506c1.133,0.555,1.751-1.047,2.262-8.135c0,0,0.524-2.289,0.767,6.448
  c0.012,0.451,0.673,2.698,1.596,0.78c0.779-1.608,0.429-5.864,0.429-7.295c0,0,0.999,5.522,1.933,5.522
  c0,0,1.099,1.291,0.648-5.571c-0.073-1.121,0.32-3.422,0.369-4.092l0.106-2.631c0,0-0.274-3.014-0.274-4.269
  c0-0.311,1.078-4.415,3.921-8.747c0,0,5.913-10.488,5.532-17.342c0,0-0.082-6.54,2.299-10.245c0,0,1.69,18.526,0.545,23.727
  c0,0-5.319,12.778-4.146,22.308c0.864,7.094,2.53,22.237,4.226,28.217c0.886,3.094,0.362,10.899,1.072,12.848
  c0.32,0.847,0.152,1.627-0.536,3.545c-2.387,6.71-2.083,11.436,3.921,29.24c0,0,1.848,3.945,0.914,11.033
  c0,0-3.836,7.892-1.379,8.05c0,0,0.192,0.523,1.023,0.109c0,0,1.327,1.37,2.761,0.627c0,0,1.328,1.06,2.463,0.116
  c0,0,0.91,1.047,2.237,0.201c0,0,1.742,1.175,2.777-0.098c0,0,1.839,0.408-1.435-7.886c0,0-1.254-8.793-1.945-10.522
  c-1.318-3.275-0.387-12.251-0.106-14.175c0.453-3.216,0.21-8.695-0.618-12.934c-0.606-3.038,1.035-8.774,1.641-12.3
  c1.245-7.423,3.685-26.373,3.38-29.959l1.008,0.354C103.809,118.312,104.265,117.959,104.265,117.959z`;

// ─── FRONT ZONES — calibrated to the real silhouette ──────────────────────
const ZONES_FRONT = [
  // Head & neck
  { id: "head",       label: "Tête",              cx: 103,  cy: 9,   rx: 11, ry: 10 },
  { id: "neck",       label: "Cou",               cx: 103,  cy: 22,  rx: 5,  ry: 5  },
  // Shoulders
  { id: "shoul_r",    label: "Épaule droite",     cx: 78,   cy: 34,  rx: 9,  ry: 5  },
  { id: "shoul_l",    label: "Épaule gauche",     cx: 128,  cy: 34,  rx: 9,  ry: 5  },
  // Chest & belly
  { id: "chest",      label: "Poitrine",          cx: 103,  cy: 50,  rx: 13, ry: 9  },
  { id: "belly",      label: "Ventre",            cx: 103,  cy: 70,  rx: 12, ry: 8  },
  // Arms
  { id: "arm_r",      label: "Bras droit",        cx: 67,   cy: 52,  rx: 7,  ry: 11 },
  { id: "arm_l",      label: "Bras gauche",       cx: 139,  cy: 52,  rx: 7,  ry: 11 },
  { id: "elbow_r",    label: "Coude droit",       cx: 62,   cy: 68,  rx: 6,  ry: 5  },
  { id: "elbow_l",    label: "Coude gauche",      cx: 144,  cy: 68,  rx: 6,  ry: 5  },
  { id: "forarm_r",   label: "Avant-bras droit",  cx: 58,   cy: 82,  rx: 6,  ry: 9  },
  { id: "forarm_l",   label: "Avant-bras gauche", cx: 148,  cy: 82,  rx: 6,  ry: 9  },
  { id: "wrist_r",    label: "Poignet droit",     cx: 55,   cy: 96,  rx: 5,  ry: 4  },
  { id: "wrist_l",    label: "Poignet gauche",    cx: 151,  cy: 96,  rx: 5,  ry: 4  },
  { id: "hand_r",     label: "Main droite",       cx: 53,   cy: 108, rx: 6,  ry: 7  },
  { id: "hand_l",     label: "Main gauche",       cx: 153,  cy: 108, rx: 6,  ry: 7  },
  // Hips & legs
  { id: "hip_r",      label: "Hanche droite",     cx: 91,   cy: 124, rx: 9,  ry: 9  },
  { id: "hip_l",      label: "Hanche gauche",     cx: 115,  cy: 124, rx: 9,  ry: 9  },
  { id: "thigh_r",    label: "Cuisse droite",     cx: 91,   cy: 135, rx: 8,  ry: 11 },
  { id: "thigh_l",    label: "Cuisse gauche",     cx: 115,  cy: 135, rx: 8,  ry: 11 },
  { id: "knee_r",     label: "Genou droit",       cx: 91,   cy: 166, rx: 8,  ry: 6  },
  { id: "knee_l",     label: "Genou gauche",      cx: 115,  cy: 166, rx: 8,  ry: 6  },
  { id: "shin_r",     label: "Tibia droit",       cx: 90,   cy: 179, rx: 7,  ry: 8  },
  { id: "shin_l",     label: "Tibia gauche",      cx: 116,  cy: 179, rx: 7,  ry: 8  },
  { id: "ankle_r",    label: "Cheville droite",   cx: 89,   cy: 191, rx: 6,  ry: 4  },
  { id: "ankle_l",    label: "Cheville gauche",   cx: 117,  cy: 191, rx: 6,  ry: 4  },
  { id: "foot_r",     label: "Pied droit",        cx: 87,   cy: 200, rx: 9,  ry: 5  },
  { id: "foot_l",     label: "Pied gauche",       cx: 119,  cy: 200, rx: 9,  ry: 5  },
];

const ZONES_BACK = [
  { id: "head_b",      label: "Tête",              cx: 103,  cy: 9,   rx: 11, ry: 10 },
  { id: "neck_b",      label: "Nuque",             cx: 103,  cy: 22,  rx: 5,  ry: 5  },
  // Shoulders
  { id: "shoul_r_b",   label: "Épaule droite",     cx: 78,   cy: 34,  rx: 9,  ry: 5  },
  { id: "shoul_l_b",   label: "Épaule gauche",     cx: 128,  cy: 34,  rx: 9,  ry: 5  },
  { id: "upback",      label: "Dos haut",          cx: 103,  cy: 50,  rx: 13, ry: 9  },
  { id: "lowback",     label: "Dos bas",           cx: 103,  cy: 88,  rx: 12, ry: 8  },
  // Arms
  { id: "arm_r_b",     label: "Bras droit",        cx: 67,   cy: 52,  rx: 7,  ry: 11 },
  { id: "arm_l_b",     label: "Bras gauche",       cx: 139,  cy: 52,  rx: 7,  ry: 11 },
  { id: "elbow_r_b",   label: "Coude droit",       cx: 62,   cy: 68,  rx: 6,  ry: 5  },
  { id: "elbow_l_b",   label: "Coude gauche",      cx: 144,  cy: 68,  rx: 6,  ry: 5  },
  { id: "forarm_r_b",  label: "Avant-bras droit",  cx: 58,   cy: 82,  rx: 6,  ry: 9  },
  { id: "forarm_l_b",  label: "Avant-bras gauche", cx: 148,  cy: 82,  rx: 6,  ry: 9  },
  { id: "wrist_r_b",   label: "Poignet droit",     cx: 55,   cy: 96,  rx: 5,  ry: 4  },
  { id: "wrist_l_b",   label: "Poignet gauche",    cx: 151,  cy: 96,  rx: 5,  ry: 4  },
  { id: "buttocks",    label: "Fesses",            cx: 103,  cy: 104, rx: 14, ry: 7  },
  { id: "ischio_r",    label: "Arrière cuisse droite",  cx: 91,   cy: 136, rx: 9,  ry: 10 },
  { id: "ischio_l",    label: "Arrière cuisse gauche", cx: 115,  cy: 136, rx: 9,  ry: 10 },
  { id: "knee_r_b",    label: "Genou droit",       cx: 91,   cy: 148, rx: 8,  ry: 8  },
  { id: "knee_l_b",    label: "Genou gauche",      cx: 115,  cy: 148, rx: 8,  ry: 8  },
  { id: "calf_r",      label: "Mollet droit",      cx: 90,   cy: 168, rx: 7,  ry: 10 },
  { id: "calf_l",      label: "Mollet gauche",     cx: 116,  cy: 168, rx: 7,  ry: 10 },
  { id: "ankle_r_b",   label: "Cheville droite",   cx: 89,   cy: 184, rx: 6,  ry: 4  },
  { id: "ankle_l_b",   label: "Cheville gauche",   cx: 117,  cy: 184, rx: 6,  ry: 4  },
  { id: "heel_r",      label: "Talon droit",       cx: 87,   cy: 196, rx: 8,  ry: 5  },
  { id: "heel_l",      label: "Talon gauche",      cx: 119,  cy: 196, rx: 8,  ry: 5  },
];

export default function BodyMap({ onComplete }) {
  const [gender, setGender]     = useState("male");
  const [face, setFace]         = useState("front");
  const [painted, setPainted]   = useState({});
  const [selected, setSelected] = useState(null);

  const zones    = face === "front" ? ZONES_FRONT : ZONES_BACK;
  const allZones = [...ZONES_FRONT, ...ZONES_BACK];
  const hasPainted = Object.keys(painted).length > 0;

  const handleColorPick = (colorKey) => {
    setPainted(p => {
      const next = { ...p };
      if (next[selected] === colorKey) delete next[selected];
      else next[selected] = colorKey;
      return next;
    });
    setSelected(null);
  };

  const handleConfirm = () => {
    const result = Object.entries(painted).map(([id, colorKey]) => {
      const zone = allZones.find(z => z.id === id);
      return { zone: zone?.label || id, type: PAIN_COLORS[colorKey]?.label, color: PAIN_COLORS[colorKey]?.color, colorKey };
    });
    onComplete(result);
  };

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", maxWidth: 440, margin: "0 auto", padding: "0 12px 20px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 32, marginBottom: 4 }}>🧍</div>
        <h2 style={{ fontSize: 20, color: "#1a5a82", fontWeight: "bold", margin: 0 }}>Où as-tu mal ?</h2>
        <p style={{ fontSize: 12, color: "#7aafc8", marginTop: 4 }}>Appuie sur une zone puis choisis une couleur</p>
      </div>

      {/* Gender */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 8 }}>
        {[["male","👨 Homme"],["female","👩 Femme"]].map(([g, label]) => (
          <button key={g} onClick={() => setGender(g)} style={{
            padding: "7px 20px", borderRadius: 50, fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", fontWeight: gender===g ? "bold" : "normal",
            border: "2px solid", borderColor: gender===g ? "#2d7baa" : "rgba(74,159,212,0.3)",
            background: gender===g ? "linear-gradient(135deg,#4a9fd4,#2d7baa)" : "rgba(255,255,255,0.85)",
            color: gender===g ? "white" : "#2a6a8a",
          }}>{label}</button>
        ))}
      </div>

      {/* Face toggle */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 8 }}>
        {[["front","Face avant"],["back","Face arrière"]].map(([f, label]) => (
          <button key={f} onClick={() => { setFace(f); setSelected(null); }} style={{
            padding: "6px 18px", borderRadius: 50, fontSize: 12, cursor: "pointer",
            fontFamily: "inherit",
            border: "2px solid", borderColor: face===f ? "#2d7baa" : "rgba(74,159,212,0.3)",
            background: face===f ? "linear-gradient(135deg,#4a9fd4,#2d7baa)" : "rgba(255,255,255,0.85)",
            color: face===f ? "white" : "#2a6a8a",
          }}>{label}</button>
        ))}
      </div>

      {/* SVG Body */}
      <div style={{ position: "relative", background: "white", borderRadius: 20, padding: "12px 8px", boxShadow: "0 4px 20px rgba(45,123,170,0.12)", marginBottom: 12 }}>
        <svg viewBox="0 0 206.326 206.326" style={{ width: "100%", maxHeight: 440, display: "block", margin: "0 auto" }}>

          {/* Silhouette — mirrored for back */}
          <g transform={face === "back" ? `translate(206.326,0) scale(-1,1)` : ""}>
            <path
              d={BODY_PATH}
              fill={gender === "female" ? "#fce4ec" : "#dbedf7"}
              stroke={gender === "female" ? "#d81b60" : "#4a9fd4"}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </g>

          {/* Painted color fills */}
          {zones.map(z => {
            const c = painted[z.id];
            if (!c) return null;
            return (
              <ellipse key={z.id + "_p"}
                cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry}
                fill={PAIN_COLORS[c].color + "cc"}
                stroke={PAIN_COLORS[c].color}
                strokeWidth="1"
              />
            );
          })}

          {/* Zone outlines — always visible */}
          {zones.map(z => {
            const isSelected = selected === z.id;
            const isPainted = !!painted[z.id];
            return (
              <g key={z.id}>
                <ellipse
                  cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry}
                  fill={isSelected ? "rgba(45,123,170,0.12)" : "transparent"}
                  stroke={isSelected ? "#2d7baa" : isPainted ? "transparent" : "rgba(74,159,212,0.4)"}
                  strokeWidth="0.8"
                  strokeDasharray={isSelected ? "0" : "2,1.5"}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelected(isSelected ? null : z.id)}
                />
                {/* Always visible label */}
                {!isPainted && (
                  <text x={z.cx} y={z.cy + 1.5} textAnchor="middle" fontSize="3.5" fill="#1a5a82" style={{ pointerEvents: "none", userSelect: "none" }}>
                    {z.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Selected zone label */}
          {selected && (() => {
            const z = zones.find(z => z.id === selected);
            if (!z) return null;
            return (
              <g>
                <rect x={z.cx - 20} y={z.cy + z.ry + 1} width={40} height={7} rx={3} fill="white" opacity="0.9"/>
                <text x={z.cx} y={z.cy + z.ry + 6.5} textAnchor="middle" fontSize="5" fill="#1a5a82" fontWeight="bold">
                  {z.label}
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Color picker popup */}
        {selected && (() => {
          const z = zones.find(z => z.id === selected);
          if (!z) return null;
          const pct = z.cx / 206.326;
          const isLeft = pct < 0.45;
          const isBottom = z.cy > 145;
          return (
            <div style={{
              position: "absolute",
              ...(isLeft ? { left: "2%" } : { right: "2%" }),
              ...(isBottom ? { bottom: "5%" } : { top: `${Math.max((z.cy / 206.326) * 100 - 5, 2)}%` }),
              background: "white", borderRadius: 16, padding: "12px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
              border: "1px solid rgba(74,159,212,0.2)",
              zIndex: 30, minWidth: 175,
            }}>
              <p style={{ fontSize: 12, fontWeight: "bold", color: "#1a5a82", marginBottom: 8, textAlign: "center" }}>
                📍 {z.label}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {Object.entries(PAIN_COLORS).map(([key, { color, label, emoji }]) => (
                  <button key={key} onClick={() => handleColorPick(key)} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
                    borderRadius: 8,
                    border: painted[selected] === key ? `2px solid ${color}` : "2px solid transparent",
                    background: painted[selected] === key ? color + "18" : "#f5f9fc",
                    cursor: "pointer", fontFamily: "inherit", fontSize: 12,
                    fontWeight: painted[selected] === key ? "bold" : "normal",
                    color: "#1a5a82", borderLeft: `4px solid ${color}`,
                  }}>
                    <span style={{ fontSize: 14 }}>{emoji}</span> {label}
                  </button>
                ))}
                {painted[selected] && (
                  <button onClick={() => {
                    setPainted(p => { const n = { ...p }; delete n[selected]; return n; });
                    setSelected(null);
                  }} style={{
                    marginTop: 4, padding: "5px", borderRadius: 8,
                    border: "1px solid #e2edf5", background: "transparent",
                    cursor: "pointer", fontSize: 11, color: "#7aafc8", fontFamily: "inherit",
                  }}>✕ Effacer</button>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Legend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px", marginBottom: 12, padding: "0 4px" }}>
        {Object.entries(PAIN_COLORS).map(([, { color, label, emoji }]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#4a7a9b" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
            {emoji} {label}
          </div>
        ))}
      </div>

      {/* Summary */}
      {hasPainted && (
        <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 14, padding: "10px 14px", border: "1px solid rgba(74,159,212,0.2)", marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: "bold", color: "#4a9fd4", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Zones marquées
          </p>
          {Object.entries(painted).map(([id, colorKey]) => {
            const zone = allZones.find(z => z.id === id);
            return (
              <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", fontSize: 12 }}>
                <span style={{ color: "#1a5a82" }}>{zone?.label}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: "bold", fontSize: 11 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: PAIN_COLORS[colorKey]?.color }} />
                  <span style={{ color: PAIN_COLORS[colorKey]?.color }}>{PAIN_COLORS[colorKey]?.label}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm */}
      <button onClick={handleConfirm} disabled={!hasPainted} style={{
        width: "100%",
        background: hasPainted ? "linear-gradient(135deg,#4a9fd4,#2d7baa)" : "rgba(200,220,235,0.6)",
        color: hasPainted ? "white" : "#a0b8c8",
        border: "none", borderRadius: 50, padding: "14px", fontSize: 15, fontWeight: "bold",
        cursor: hasPainted ? "pointer" : "not-allowed", fontFamily: "inherit",
      }}>
        Confirmer {hasPainted && `(${Object.keys(painted).length} zone${Object.keys(painted).length > 1 ? "s" : ""})`} →
      </button>
    </div>
  );
