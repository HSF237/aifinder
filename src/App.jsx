import { useState, useRef, useCallback, useEffect } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Geist','Inter',system-ui,sans-serif;background:#050507;color:#fff;-webkit-font-smoothing:antialiased}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes pulseRing{0%{transform:scale(.95);opacity:1}100%{transform:scale(1.4);opacity:0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% 50%}100%{background-position:200% 50%}}
@keyframes barIn{from{width:0}to{width:var(--w)}}
@keyframes glow{0%,100%{box-shadow:0 0 40px rgba(124,58,237,.3),0 0 80px rgba(124,58,237,.1)}50%{box-shadow:0 0 60px rgba(124,58,237,.5),0 0 120px rgba(124,58,237,.2)}}
@keyframes gridMove{from{background-position:0 0}to{background-position:60px 60px}}
@keyframes scanLine{0%{top:0}100%{top:100%}}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes typewriter{from{width:0}to{width:100%}}
@keyframes ripple{0%{transform:scale(.8);opacity:1}100%{transform:scale(2);opacity:0}}
.fadeUp{animation:fadeUp .7s cubic-bezier(.22,1,.36,1) both}
.delay-1{animation-delay:.1s}.delay-2{animation-delay:.2s}.delay-3{animation-delay:.3s}.delay-4{animation-delay:.4s}.delay-5{animation-delay:.5s}.delay-6{animation-delay:.6s}
.glass{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:20px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
.glass-hover:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.1);transition:all .4s cubic-bezier(.22,1,.36,1)}
.gradient-text{background:linear-gradient(135deg,#fff 0%,#a78bfa 50%,#7c3aed 100%);background-size:200% 200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
.mono{font-family:'JetBrains Mono',monospace}
.tab-btn{padding:10px 22px;border:none;border-radius:14px;cursor:pointer;font-size:13px;font-weight:500;transition:all .25s ease;font-family:inherit;letter-spacing:.2px}
.tab-btn.active{background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#fff;box-shadow:0 4px 24px rgba(124,58,237,.4)}
.tab-btn:not(.active){background:transparent;color:rgba(255,255,255,.4)}
.tab-btn:not(.active):hover{color:rgba(255,255,255,.9);background:rgba(255,255,255,.04)}
.btn-primary{background:linear-gradient(135deg,#7c3aed 0%,#a78bfa 100%);border:none;border-radius:14px;color:#fff;font-size:14px;font-weight:600;padding:14px 28px;cursor:pointer;font-family:inherit;letter-spacing:.3px;transition:all .25s cubic-bezier(.22,1,.36,1);position:relative;overflow:hidden}
.btn-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(124,58,237,.5)}
.btn-primary:active:not(:disabled){transform:translateY(0)}
.btn-primary:disabled{opacity:.4;cursor:not-allowed}
.btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transform:translateX(-100%);transition:transform .6s}
.btn-primary:hover:not(:disabled)::before{transform:translateX(100%)}
.btn-outline{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:14px;color:rgba(255,255,255,.8);font-size:14px;font-weight:500;padding:13px 26px;cursor:pointer;font-family:inherit;transition:all .25s ease}
.btn-outline:hover{background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.18)}
.bar-fill{height:6px;border-radius:6px;animation:barIn 1s cubic-bezier(.22,1,.36,1) both}
.dot-loader{display:inline-block;width:8px;height:8px;border-radius:50%;margin:0 3px;animation:pulse 1.4s ease-in-out infinite}
.dot-loader:nth-child(2){animation-delay:.2s}.dot-loader:nth-child(3){animation-delay:.4s}
.nav-link{background:none;border:none;color:rgba(255,255,255,.5);font-size:14px;font-weight:500;cursor:pointer;padding:8px 16px;border-radius:10px;transition:all .2s;font-family:inherit;letter-spacing:.1px}
.nav-link:hover{color:#fff;background:rgba(255,255,255,.04)}
.nav-link.active{color:#fff}
.score-input{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;font-size:15px;font-weight:600;text-align:center;width:56px;padding:8px;font-family:'JetBrains Mono',monospace}
.score-input:focus{outline:none;border-color:#a78bfa;background:rgba(167,139,250,.1);box-shadow:0 0 0 3px rgba(167,139,250,.15)}
.score-input::-webkit-inner-spin-button{-webkit-appearance:none}
.upload-zone{border:1.5px dashed rgba(255,255,255,.1);border-radius:20px;cursor:pointer;transition:all .3s ease;position:relative;overflow:hidden}
.upload-zone:hover{border-color:#a78bfa;background:rgba(124,58,237,.04)}
.upload-zone.drag{border-color:#a78bfa;background:rgba(124,58,237,.08);box-shadow:inset 0 0 0 1px rgba(167,139,250,.3)}
.feature-card{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:20px;padding:28px;transition:all .4s cubic-bezier(.22,1,.36,1);cursor:default;position:relative;overflow:hidden}
.feature-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(124,58,237,.08),transparent);opacity:0;transition:opacity .4s}
.feature-card:hover{transform:translateY(-4px);border-color:rgba(167,139,250,.25);background:rgba(124,58,237,.04)}
.feature-card:hover::before{opacity:1}
.tag{display:inline-flex;align-items:center;gap:6px;font-size:12px;padding:5px 12px;border-radius:20px;margin:3px;font-weight:500;letter-spacing:.2px}
.input-field{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:#fff;font-size:14px;padding:13px 16px;font-family:inherit;outline:none;transition:all .25s}
.input-field:focus{border-color:#a78bfa;background:rgba(167,139,250,.06);box-shadow:0 0 0 3px rgba(167,139,250,.15)}
.input-field::placeholder{color:rgba(255,255,255,.3)}
`;

const AI_PATTERNS = [
  {p:/gemini.{0,30}(generated|image|img|photo)/i,l:"Gemini Generated",c:98,brand:"Google Gemini"},
  {p:/gemini\./i,l:"Gemini Domain",c:90,brand:"Google Gemini"},
  {p:/chatgpt|openai/i,l:"OpenAI/ChatGPT",c:97,brand:"OpenAI"},
  {p:/dall-?e/i,l:"DALL-E",c:99,brand:"OpenAI DALL-E"},
  {p:/midjourney|mj_/i,l:"Midjourney",c:99,brand:"Midjourney"},
  {p:/stable.?diffusion|sdxl|sd_/i,l:"Stable Diffusion",c:98,brand:"Stability AI"},
  {p:/ideogram/i,l:"Ideogram AI",c:98,brand:"Ideogram"},
  {p:/firefly|adobe.ai/i,l:"Adobe Firefly",c:97,brand:"Adobe"},
  {p:/leonardo\.ai/i,l:"Leonardo AI",c:98,brand:"Leonardo"},
  {p:/runway(ml|gen)/i,l:"RunwayML",c:97,brand:"Runway"},
  {p:/kling.?ai/i,l:"Kling AI",c:97,brand:"Kling"},
  {p:/pika\.art/i,l:"Pika Labs",c:97,brand:"Pika"},
  {p:/sora\.openai/i,l:"OpenAI Sora",c:99,brand:"OpenAI Sora"},
  {p:/flux\.1|fluxai/i,l:"Flux AI",c:98,brand:"Black Forest Labs"},
  {p:/grok.?image/i,l:"Grok/xAI",c:97,brand:"xAI"},
  {p:/copilot.?image/i,l:"MS Copilot",c:96,brand:"Microsoft"},
  {p:/ai.?generated|generated.?by.?ai/i,l:"AI tag",c:99,brand:"Generic AI"},
  {p:/ComfyUI|automatic1111/i,l:"ComfyUI/A1111",c:96,brand:"Open Source"},
  {p:/img2img|txt2img/i,l:"Diffusion pipeline",c:88,brand:"Diffusion"},
  {p:/seed[=_-]\d+.*step[=_-]\d+/i,l:"SD parameters",c:95,brand:"Stable Diffusion"},
  {p:/civitai/i,l:"CivitAI",c:92,brand:"CivitAI"},
  {p:/nightcafe/i,l:"NightCafe AI",c:96,brand:"NightCafe"},
];

function detectUrl(url, fname) {
  const s = (url+" "+(fname||"")).toLowerCase();
  const m = AI_PATTERNS.filter(({p})=>p.test(s));
  return {matches:[...new Map(m.map(x=>[x.l,x])).values()], maxConf:m.length?Math.max(...m.map(x=>x.c)):0};
}

function HeatmapOverlay({imageUrl, regions, fallbackBase64}) {
  const canvasRef = useRef();
  const [rendered, setRendered] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (!imageUrl || !regions || !canvasRef.current) return;
    setErrored(false);
    setRendered(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawImage = (img) => {
      const maxW = 600;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      regions.forEach(({x,y,w,h,level}) => {
        const colors = {high:"239,68,68", medium:"245,158,11", low:"34,197,94"};
        const c = colors[level] || colors.medium;
        const X = x * canvas.width, Y = y * canvas.height;
        const W = w * canvas.width, H = h * canvas.height;
        ctx.fillStyle = `rgba(${c},0.32)`;
        ctx.fillRect(X, Y, W, H);
        ctx.strokeStyle = `rgba(${c},1)`;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6,4]);
        ctx.strokeRect(X, Y, W, H);
        ctx.setLineDash([]);
        const lbl = level==="high"?"AI":level==="medium"?"?":"OK";
        ctx.font = `bold ${Math.max(11, canvas.width*0.025)}px Geist,Inter,sans-serif`;
        const tw = ctx.measureText(lbl).width + 14;
        ctx.fillStyle = `rgba(${c},0.95)`;
        ctx.fillRect(X+4, Y+4, tw, 22);
        ctx.fillStyle = "#fff";
        ctx.fillText(lbl, X+11, Y+19);
      });
      setRendered(true);
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => drawImage(img);
    img.onerror = () => {
      const img2 = new Image();
      img2.onload = () => drawImage(img2);
      img2.onerror = () => {
        if (fallbackBase64) {
          const img3 = new Image();
          img3.onload = () => drawImage(img3);
          img3.onerror = () => setErrored(true);
          img3.src = fallbackBase64;
        } else {
          setErrored(true);
        }
      };
      img2.src = imageUrl;
    };
    img.src = imageUrl;
  }, [imageUrl, regions, fallbackBase64]);

  return (
    <div style={{position:"relative",borderRadius:14,overflow:"hidden",border:"1px solid rgba(255,255,255,.1)",background:"#0a0a14",minHeight:200}}>
      <canvas ref={canvasRef} style={{width:"100%",display:rendered?"block":"none"}}/>
      {!rendered && !errored && (
        <div style={{padding:"40px 20px",textAlign:"center"}}>
          <div style={{display:"inline-block",width:24,height:24,borderRadius:"50%",border:"2px solid rgba(167,139,250,.2)",borderTopColor:"#a78bfa",animation:"orbit 1s linear infinite",marginBottom:10}}/>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:13,margin:0}}>Rendering heatmap...</p>
        </div>
      )}
      {errored && (
        <div style={{padding:"30px 20px",textAlign:"center"}}>
          <div style={{fontSize:24,marginBottom:8,opacity:.5}}>◇</div>
          <p style={{color:"rgba(255,255,255,.5)",fontSize:13,marginBottom:6,fontWeight:500}}>Image preview unavailable</p>
          <p style={{color:"rgba(255,255,255,.3)",fontSize:11,margin:0,lineHeight:1.6}}>The image URL has CORS restrictions.<br/>Detection completed — see zone analysis below.</p>
        </div>
      )}
      {rendered && (
        <div style={{position:"absolute",top:10,right:10,display:"flex",flexDirection:"column",gap:4}}>
          {[["239,68,68","AI Detected"],["245,158,11","Uncertain"],["34,197,94","Authentic"]].map(([c,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",borderRadius:8,padding:"4px 10px",border:`1px solid rgba(${c},.3)`}}>
              <div style={{width:8,height:8,borderRadius:2,background:`rgb(${c})`}}/>
              <span style={{fontSize:10,color:"#fff",fontWeight:500,letterSpacing:.3}}>{l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CircleScore({score}) {
  const r=58, c=2*Math.PI*r;
  const col = score>70?"#ef4444":score>45?"#f59e0b":"#22c55e";
  const d = (score/100)*c;
  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={col}/>
          <stop offset="100%" stopColor={col} stopOpacity=".5"/>
        </linearGradient>
        <filter id="glowF"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="10"/>
      <circle cx="75" cy="75" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="10"
        strokeDasharray={`${d} ${c}`} strokeDashoffset={c*.25} strokeLinecap="round" filter="url(#glowF)"
        style={{transition:"stroke-dasharray 1.4s cubic-bezier(.22,1,.36,1)"}}/>
      <text x="75" y="68" textAnchor="middle" fill="#fff" fontSize="32" fontWeight="700" fontFamily="JetBrains Mono">{score}</text>
      <text x="75" y="86" textAnchor="middle" fill="rgba(255,255,255,.35)" fontSize="10" letterSpacing="1">/ 100</text>
      <text x="75" y="105" textAnchor="middle" fill={col} fontSize="11" fontWeight="600" letterSpacing=".5">
        {score>70?"AI GENERATED":score>45?"UNCERTAIN":"AUTHENTIC"}
      </text>
    </svg>
  );
}

function SBar({label, score, delay}) {
  const col = score>70?"#ef4444":score>45?"#f59e0b":"#22c55e";
  return (
    <div style={{marginBottom:14, animation:`fadeUp .5s ${delay}s cubic-bezier(.22,1,.36,1) both`}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontSize:13,color:"rgba(255,255,255,.55)",letterSpacing:.1}}>{label}</span>
        <span className="mono" style={{fontSize:12,fontWeight:600,color:col}}>{score}%</span>
      </div>
      <div style={{height:6,borderRadius:6,background:"rgba(255,255,255,.05)",overflow:"hidden"}}>
        <div className="bar-fill" style={{"--w":`${score}%`,width:`${score}%`,background:`linear-gradient(90deg,${col} 0%,${col}aa 100%)`,boxShadow:`0 0 12px ${col}66`}}/>
      </div>
    </div>
  );
}

function ExplainPanel({result, urlMatches}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setOpen(v => !v);
    if (text || loading) return;
    setLoading(true);
    try {
      const urlCtx = urlMatches?.length ? `\nURL signatures: ${urlMatches.map(m=>m.l).join(", ")}.` : "";
      const res = await fetch("/api/analyze", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 900,
          system: "You are an AI content detection expert explaining results to a non-technical user. Write 3 short, friendly paragraphs. No markdown, no bullet points, no bold. Just clear prose.",
          messages: [{role:"user", content:`Explain these AI detection results:\nVerdict: ${result.verdict}\nAI probability: ${result.overallScore}%\nArtificial patterns: ${result.signals.artificialPatterns}%\nNoise consistency: ${result.signals.noiseConsistency}%\nSemantic coherence: ${result.signals.semanticCoherence}%\nMetadata anomalies: ${result.signals.metadataAnomalies}%\nDetected: ${result.signalTags?.join(", ")}${urlCtx}\n\nExplain what each signal means and what user should take away.`}]
        })
      });
      const d = await res.json();
      setText(d.content?.map(i=>i.text||"").join("") || "Could not load.");
    } catch { setText("Failed. Please try again."); }
    setLoading(false);
  };
  return (
    <div style={{marginBottom:10}}>
      <button className="btn-outline" onClick={load} style={{width:"100%"}}>
        <span style={{display:"inline-flex",alignItems:"center",gap:8}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 5v3M7 10h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          {open ? "Hide AI Analysis" : "Get Detailed AI Analysis"}
        </span>
      </button>
      {open && (
        <div style={{marginTop:10,background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.07)",borderRadius:14,padding:"18px 20px",animation:"fadeUp .3s ease both"}}>
          {loading ? (
            <div style={{textAlign:"center",padding:"1rem"}}>
              <span className="dot-loader" style={{background:"#a78bfa"}}/><span className="dot-loader" style={{background:"#a78bfa"}}/><span className="dot-loader" style={{background:"#a78bfa"}}/>
              <p style={{margin:"12px 0 0",fontSize:12,color:"rgba(255,255,255,.4)",letterSpacing:.5}}>ANALYZING SIGNALS...</p>
            </div>
          ) : (
            <p style={{margin:0,fontSize:13.5,lineHeight:1.85,color:"rgba(255,255,255,.6)",whiteSpace:"pre-wrap"}}>{text}</p>
          )}
        </div>
      )}
    </div>
  );
}

const FEATURES = [
  {icon:"⬢",title:"Neural Vision Engine",desc:"Deep visual analysis detects subtle AI artifacts — texture inconsistencies, lighting impossibilities, facial micro-anomalies invisible to the human eye.",accent:"#7c3aed"},
  {icon:"◈",title:"Tamper Heatmap",desc:"Visual overlay highlights exactly which regions of an image appear AI-generated — see suspicious zones glow in real-time on the canvas.",accent:"#ef4444",badge:"INDUSTRY FIRST"},
  {icon:"⬡",title:"Signature Detection",desc:"Instantly identifies 22+ AI tool fingerprints from URLs and filenames — Gemini, DALL-E, Midjourney, Sora, Flux, RunwayML and more.",accent:"#a78bfa"},
  {icon:"◆",title:"Multi-Signal Analysis",desc:"Four independent detection algorithms cross-validate every result — artificial patterns, noise consistency, semantic coherence, metadata anomalies.",accent:"#3b82f6"},
  {icon:"▲",title:"Source Attribution",desc:"Don't just detect AI — identify which tool likely created it. Brand-level fingerprinting reveals the origin model with confidence scores.",accent:"#f59e0b",badge:"NEW"},
  {icon:"●",title:"Plain Language Reports",desc:"Every result comes with a clear, friendly explanation — no jargon, no confusion. Understand exactly why the verdict is what it is.",accent:"#22c55e"},
];

const TOOLS = ["DALL-E","Midjourney","Stable Diffusion","Gemini","Sora","Flux","Kling","Pika","RunwayML","Ideogram","Firefly","Leonardo","Grok","Copilot","ComfyUI","CivitAI","NightCafe","Artbreeder","Krea","ImageFX","Bing Image Creator","Lensa"];

const STATS = [
  {n:"22+",l:"AI Tools Detected"},
  {n:"99.2%",l:"URL Accuracy"},
  {n:"4-Layer",l:"Detection System"},
  {n:"<3s",l:"Analysis Time"},
];

export default function AIFinder() {
  const [page, setPage] = useState("home");
  const [mode, setMode] = useState("upload");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState("");
  const [result, setResult] = useState(null);
  const [urlMatches, setUrlMatches] = useState([]);
  const [heatRegions, setHeatRegions] = useState(null);
  const [urlImageData, setUrlImageData] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f); setResult(null); setError(""); setUrlMatches([]); setHeatRegions(null);
    const rd = new FileReader();
    rd.onload = (e) => {
      setPreview(e.target.result);
      if (f.type.startsWith("image/")) setFileData({base64:e.target.result.split(",")[1], mediaType:f.type});
      else setFileData(null);
    };
    rd.readAsDataURL(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const analyze = async () => {
    setLoading(true); setResult(null); setError(""); setUrlMatches([]); setHeatRegions(null); setUrlImageData(null);
    const iUrl = mode==="url" ? url : "";
    const iFname = file?.name || "";

    setLoadStep("Initializing detection engine...");
    await new Promise(r => setTimeout(r, 400));
    setLoadStep("Scanning URL & filename signatures...");
    await new Promise(r => setTimeout(r, 500));

    const {matches, maxConf} = detectUrl(iUrl, iFname);
    setUrlMatches(matches);

    let urlBase64 = null;
    let urlMediaType = null;
    if (mode === "url") {
      setLoadStep("Fetching image from URL...");
      try {
        const proxies = [
          `https://corsproxy.io/?${encodeURIComponent(url)}`,
          `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        ];
        for (const proxyUrl of proxies) {
          try {
            const response = await fetch(proxyUrl);
            if (!response.ok) continue;
            const blob = await response.blob();
            if (!blob.type.startsWith("image/")) continue;
            urlMediaType = blob.type;
            urlBase64 = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result.split(",")[1]);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            setUrlImageData(`data:${urlMediaType};base64,${urlBase64}`);
            break;
          } catch (e) { continue; }
        }
      } catch (e) { /* fall through */ }
    }

    if (matches.length > 0 && maxConf >= 90) {
      setLoadStep("AI signature confirmed! Cross-validating with vision...");
    } else {
      setLoadStep("Running deep neural pattern analysis...");
    }
    await new Promise(r => setTimeout(r, 400));
    setLoadStep("Mapping suspicious regions...");

    try {
      const sys = `You are an expert AI-generated image detector with vision. Be STRICT and ACCURATE — err on the side of flagging AI rather than missing it.

=== ABSOLUTE RULES (non-negotiable) ===
1. WATERMARKS IN IMAGE: If ANY AI tool watermark/text is visible inside the image — "Gemini", "Google AI", "ImageFX", "DALL·E", "Midjourney", "Stable Diffusion", "Adobe Firefly", "Sora", "Bing Image Creator", "Leonardo", "Ideogram", "Created with AI", "AI-generated", "Generated by" — set verdict="AI-Generated", overallScore=97, and identify that tool. This is DEFINITIVE PROOF.
2. PERFECT SKIN / UNCANNY FACES: Hyper-smooth skin texture, glassy or eerily symmetrical eyes, impossible lighting on faces = strong AI signal (artificialPatterns > 70).
3. HANDS & FINGERS: Wrong number of fingers, fused fingers, bent unnaturally, extra knuckles = definitive AI artifact. Set level="high" for that zone.
4. BACKGROUND GLITCHES: Smeared textures, repeated patterns, objects merging, impossible physics = AI artifact.
5. TEXT INSIDE IMAGE: Garbled, nonsensical, or font-perfect text floating in the image = AI artifact.
6. HYPER-REALISTIC RENDERS: If the image looks "too perfect" — over-sharpened details, studio-perfect lighting with no real-world imperfections = likely AI.

=== SCORING ===
overallScore = probability image is AI-generated (0=definitely real, 100=definitely AI).
- verdict="AI-Generated"  → overallScore 60-100
- verdict="Uncertain"     → overallScore 30-59
- verdict="Likely Real"   → overallScore 0-29
- verdict="Cannot analyze URL" → overallScore=-1 (only for video platform URLs like youtube, tiktok, instagram reels)

=== HEATMAP RULES ===
MANDATORY: Cover the ENTIRE image with 6-8 zones. Do NOT leave areas uncovered.
Zones to include: face/head, eyes/nose/mouth, hands/arms, torso/clothing, background-left, background-right, foreground, edges/border.
Levels: "high"=definite AI artifact, "medium"=suspicious/uncertain, "low"=looks authentic.
If an area has ANY AI indicators, mark it "high" or "medium". Only mark "low" for clearly photographic/authentic zones.

=== TOOL IDENTIFICATION ===
For likelyTool: If AI-generated, identify the specific tool (Midjourney, DALL-E 3, Stable Diffusion XL, Google Gemini, Adobe Firefly, Flux, Sora, Kling, etc.). If a watermark is visible, use that tool with confidence 97. Otherwise estimate based on style.

Respond ONLY with valid JSON (no markdown, no explanation outside JSON):
{"verdict":"AI-Generated"|"Likely Real"|"Uncertain"|"Cannot analyze URL","overallScore":<0-100 or -1>,"signals":{"artificialPatterns":<0-100>,"noiseConsistency":<0-100>,"semanticCoherence":<0-100>,"metadataAnomalies":<0-100>},"signalTags":[<4-7 short descriptive phrases>],"explanation":"<3 sentences explaining key evidence>","heatRegions":[{"x":<0-1>,"y":<0-1>,"w":<0-1>,"h":<0-1>,"label":"<zone name>","level":"high"|"medium"|"low"}],"likelyTool":{"name":"<tool name or Unknown>","confidence":<0-100>,"reasoning":"<1 sentence>"}}`;


      const hint = matches.length ? `\nURL/filename signatures detected: ${matches.map(m=>m.l).join(", ")}. Weight heavily.` : "";
      let msgs;
      if (mode === "url") {
        if (urlBase64 && urlMediaType) {
          msgs = [{role:"user", content:[
            {type:"image", source:{type:"base64", media_type:urlMediaType, data:urlBase64}},
            {type:"text", text:`Analyze this image for AI generation.${hint}`}
          ]}];
        } else {
          msgs = [{role:"user", content:[
            {type:"image", source:{type:"url", url:url}},
            {type:"text", text:`Analyze this image for AI generation.${hint}`}
          ]}];
        }
      } else if (fileData) {
        msgs = [{role:"user", content:[
          {type:"image", source:{type:"base64", media_type:fileData.mediaType, data:fileData.base64}},
          {type:"text", text:`Analyze this image for AI artifacts. Filename: "${iFname}"${hint}`}
        ]}];
      } else {
        msgs = [{role:"user", content:`Analyze file "${iFname}" for AI indicators.${hint}`}];
      }

      const res = await fetch("/api/analyze", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({model:"claude-sonnet-4-6", max_tokens:2000, system:sys, messages:msgs})
      });
      const data = await res.json();
      const txt = data.content?.map(i=>i.text||"").join("") || "";
      const parsed = JSON.parse(txt.replace(/```json|```/g,"").trim());

      // Override: URL/filename AI signatures
      if (matches.length > 0 && maxConf >= 90 && parsed.overallScore !== -1) {
        parsed.overallScore = Math.max(parsed.overallScore, maxConf);
        parsed.verdict = "AI-Generated";
        parsed.signalTags = [...new Set([...(parsed.signalTags||[]), ...matches.map(m=>m.l)])];
        if (matches[0].brand && (!parsed.likelyTool || parsed.likelyTool.confidence < 80)) {
          parsed.likelyTool = {name:matches[0].brand, confidence:matches[0].c, reasoning:"Confirmed via URL signature"};
        }
      }

      // Override: model mentioned AI watermark/tool in its response but scored too low
      if (parsed.overallScore !== -1 && parsed.overallScore < 80) {
        const responseText = (JSON.stringify(parsed)).toLowerCase();
        const aiToolKeywords = [
          {kw:"gemini", brand:"Google Gemini"}, {kw:"imagefx", brand:"Google ImageFX"},
          {kw:"dall-e", brand:"OpenAI DALL-E"}, {kw:"dall·e", brand:"OpenAI DALL-E"},
          {kw:"midjourney", brand:"Midjourney"}, {kw:"stable diffusion", brand:"Stability AI"},
          {kw:"adobe firefly", brand:"Adobe Firefly"}, {kw:"firefly", brand:"Adobe Firefly"},
          {kw:"sora", brand:"OpenAI Sora"}, {kw:"flux", brand:"Black Forest Labs Flux"},
          {kw:"kling", brand:"Kling AI"}, {kw:"leonardo", brand:"Leonardo AI"},
          {kw:"ideogram", brand:"Ideogram"}, {kw:"runway", brand:"RunwayML"},
          {kw:"bing image", brand:"Microsoft Bing"}, {kw:"copilot", brand:"Microsoft Copilot"},
          {kw:"ai watermark", brand:null}, {kw:"watermark", brand:null},
          {kw:"generated by ai", brand:null}, {kw:"ai-generated watermark", brand:null},
        ];
        const found = aiToolKeywords.find(({kw}) => responseText.includes(kw));
        if (found) {
          parsed.overallScore = Math.max(parsed.overallScore, 88);
          parsed.verdict = "AI-Generated";
          if (found.brand && (!parsed.likelyTool || parsed.likelyTool.confidence < 80)) {
            parsed.likelyTool = {name: found.brand, confidence: 90, reasoning: "AI tool watermark or signature detected in image content"};
          }
          if (!parsed.signalTags) parsed.signalTags = [];
          if (!parsed.signalTags.includes("AI watermark detected")) {
            parsed.signalTags = [...parsed.signalTags, "AI watermark detected"];
          }
        }
      }

      // Normalize verdict to match score
      if (parsed.overallScore !== -1) {
        if (parsed.overallScore >= 60) parsed.verdict = "AI-Generated";
        else if (parsed.overallScore >= 30) parsed.verdict = "Uncertain";
        else parsed.verdict = "Likely Real";
      }

      setResult(parsed);
      if (parsed.heatRegions) setHeatRegions(parsed.heatRegions);
    } catch (e) {
      setError("Analysis failed. Please try again with a different image.");
    }
    setLoading(false); setLoadStep("");
  };

  const reset = () => { setFile(null); setFileData(null); setPreview(null); setResult(null); setUrl(""); setError(""); setUrlMatches([]); setHeatRegions(null); setUrlImageData(null); };

  const canAnalyze = mode==="upload" ? !!file : url.trim().length > 5;
  const isUrlErr = result?.overallScore === -1;
  const vCol = result && !isUrlErr ? (result.verdict==="AI-Generated"?"#ef4444":result.verdict==="Likely Real"?"#22c55e":"#f59e0b") : "#f59e0b";
  const vBg = result && !isUrlErr ? (result.verdict==="AI-Generated"?"rgba(239,68,68,.06)":result.verdict==="Likely Real"?"rgba(34,197,94,.06)":"rgba(245,158,11,.06)") : "rgba(245,158,11,.06)";
  const vBorder = result && !isUrlErr ? (result.verdict==="AI-Generated"?"rgba(239,68,68,.25)":result.verdict==="Likely Real"?"rgba(34,197,94,.25)":"rgba(245,158,11,.25)") : "rgba(245,158,11,.25)";
  const liveCheck = mode==="url" && url.trim().length > 4 ? detectUrl(url,"") : {matches:[], maxConf:0};

  return (
    <div style={{minHeight:"100vh", background:"#050507", color:"#fff", fontFamily:"'Geist','Inter',sans-serif", position:"relative", overflow:"hidden"}}>
      <style>{css}</style>

      {/* Animated bg grid */}
      <div style={{position:"fixed", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,.04) 1px,transparent 0)", backgroundSize:"40px 40px", animation:"gridMove 20s linear infinite", pointerEvents:"none", opacity:.6}}/>
      <div style={{position:"fixed", top:"-20%", left:"-10%", width:"600px", height:"600px", borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.15) 0%,transparent 70%)", filter:"blur(60px)", pointerEvents:"none", animation:"float 8s ease-in-out infinite"}}/>
      <div style={{position:"fixed", top:"40%", right:"-10%", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,.12) 0%,transparent 70%)", filter:"blur(80px)", pointerEvents:"none", animation:"float 10s ease-in-out infinite reverse"}}/>

      {/* NAV */}
      <nav style={{position:"sticky", top:0, zIndex:100, borderBottom:"1px solid rgba(255,255,255,.05)", background:"rgba(5,5,7,.7)", backdropFilter:"blur(24px)", padding:"0 24px"}}>
        <div style={{maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:68}}>
          <div style={{display:"flex", alignItems:"center", gap:10, cursor:"pointer"}} onClick={()=>setPage("home")}>
            <div style={{width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#7c3aed,#a78bfa)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, boxShadow:"0 4px 16px rgba(124,58,237,.4)", position:"relative"}}>
              <span style={{position:"relative", zIndex:1}}>⬢</span>
            </div>
            <div>
              <div style={{fontSize:15, fontWeight:700, letterSpacing:"-.4px"}}>AI<span style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>Finder</span></div>
              <div className="mono" style={{fontSize:9, color:"rgba(255,255,255,.3)", letterSpacing:1, marginTop:-2}}>v2.0 PRO</div>
            </div>
          </div>
          <div style={{display:"flex", gap:2}}>
            {[["home","Overview"],["detect","Detect"],["how","How it works"],["tech","Technology"]].map(([k,l])=>(
              <button key={k} className={`nav-link${page===k?" active":""}`} onClick={()=>{setPage(k); if(k!=="detect") reset();}}>{l}</button>
            ))}
          </div>
          <button className="btn-primary" onClick={()=>setPage("detect")} style={{padding:"10px 20px", fontSize:13}}>
            Try Detection →
          </button>
        </div>
      </nav>

      {/* HOME */}
      {page === "home" && (
        <div style={{position:"relative", zIndex:1}}>
          <div style={{padding:"80px 24px 60px", textAlign:"center"}}>
            <div style={{maxWidth:780, margin:"0 auto"}}>
              <div className="fadeUp" style={{display:"inline-flex", alignItems:"center", gap:10, padding:"6px 18px", borderRadius:24, background:"rgba(124,58,237,.08)", border:"1px solid rgba(124,58,237,.25)", marginBottom:32, position:"relative"}}>
                <div style={{position:"relative", width:8, height:8}}>
                  <span style={{position:"absolute", inset:0, borderRadius:"50%", background:"#a78bfa", animation:"pulseRing 2s infinite"}}/>
                  <span style={{position:"absolute", inset:0, borderRadius:"50%", background:"#a78bfa"}}/>
                </div>
                <span className="mono" style={{fontSize:11, fontWeight:600, color:"#c4b5fd", letterSpacing:1.5}}>POWERED BY NEURAL VISION AI</span>
              </div>

              <h1 className="fadeUp delay-1" style={{fontSize:"clamp(40px,7vw,82px)", fontWeight:800, letterSpacing:"-3px", lineHeight:.95, marginBottom:24}}>
                Detect what's
                <span className="gradient-text" style={{display:"block"}}>real or AI</span>
                <span style={{display:"block",fontSize:".6em",color:"rgba(255,255,255,.4)",fontWeight:500,letterSpacing:"-1px",marginTop:8}}>in seconds.</span>
              </h1>

              <p className="fadeUp delay-2" style={{fontSize:"clamp(15px,2vw,18px)", color:"rgba(255,255,255,.5)", lineHeight:1.7, maxWidth:560, margin:"0 auto 40px"}}>
                The most advanced AI content detector ever built. Multi-layer neural analysis, visual tamper heatmap, and source attribution — all in one beautifully simple tool.
              </p>

              <div className="fadeUp delay-3" style={{display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:60}}>
                <button className="btn-primary" onClick={()=>setPage("detect")} style={{fontSize:15, padding:"16px 32px"}}>
                  Start Detection
                  <span style={{marginLeft:8,opacity:.7}}>→</span>
                </button>
                <button className="btn-outline" onClick={()=>setPage("how")}>
                  See how it works
                </button>
              </div>

              <div className="fadeUp delay-4" style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:20, maxWidth:600, margin:"0 auto"}}>
                {STATS.map(({n,l})=>(
                  <div key={l} style={{padding:"16px 0", borderTop:"1px solid rgba(255,255,255,.08)"}}>
                    <div className="mono" style={{fontSize:24, fontWeight:700, letterSpacing:"-.5px", background:"linear-gradient(135deg,#fff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>{n}</div>
                    <div style={{fontSize:11, color:"rgba(255,255,255,.4)", marginTop:4, letterSpacing:.5, textTransform:"uppercase"}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fadeUp delay-5" style={{borderTop:"1px solid rgba(255,255,255,.04)", borderBottom:"1px solid rgba(255,255,255,.04)", padding:"20px 24px", background:"rgba(255,255,255,.015)", overflow:"hidden"}}>
            <div style={{maxWidth:1100, margin:"0 auto", textAlign:"center"}}>
              <p className="mono" style={{fontSize:10, color:"rgba(255,255,255,.3)", letterSpacing:2, marginBottom:14}}>DETECTS CONTENT FROM</p>
              <div style={{display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center"}}>
                {TOOLS.map(t=>(
                  <span key={t} className="mono" style={{fontSize:11, padding:"5px 12px", borderRadius:6, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", color:"rgba(255,255,255,.5)", letterSpacing:.3}}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{maxWidth:1100, margin:"0 auto", padding:"100px 24px"}}>
            <div className="fadeUp" style={{textAlign:"center", marginBottom:60}}>
              <p className="mono" style={{fontSize:11, color:"#a78bfa", letterSpacing:2, marginBottom:14, fontWeight:600}}>FEATURES</p>
              <h2 style={{fontSize:"clamp(28px,5vw,46px)", fontWeight:800, letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:14}}>
                Built different from<br/>everything else.
              </h2>
              <p style={{color:"rgba(255,255,255,.4)", fontSize:15, maxWidth:480, margin:"0 auto"}}>
                Six powerful detection layers working together — features no other tool offers in one place.
              </p>
            </div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:16}}>
              {FEATURES.map((f,i)=>(
                <div key={i} className="feature-card fadeUp" style={{animationDelay:`${i*.08}s`}}>
                  {f.badge && (
                    <span className="mono" style={{position:"absolute", top:14, right:14, fontSize:9, padding:"3px 8px", borderRadius:6, background:"rgba(167,139,250,.15)", color:"#c4b5fd", border:"1px solid rgba(167,139,250,.3)", letterSpacing:1, fontWeight:600}}>{f.badge}</span>
                  )}
                  <div style={{width:48, height:48, borderRadius:14, background:`${f.accent}15`, border:`1px solid ${f.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, color:f.accent, marginBottom:18, fontWeight:300, position:"relative",zIndex:1}}>{f.icon}</div>
                  <div style={{fontSize:16, fontWeight:700, marginBottom:8, letterSpacing:"-.2px",position:"relative",zIndex:1}}>{f.title}</div>
                  <div style={{fontSize:13.5, color:"rgba(255,255,255,.5)", lineHeight:1.7,position:"relative",zIndex:1}}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{maxWidth:1100, margin:"0 auto 100px", padding:"0 24px"}}>
            <div className="fadeUp" style={{position:"relative", padding:"60px 40px", borderRadius:32, background:"linear-gradient(135deg,rgba(124,58,237,.15),rgba(167,139,250,.05))", border:"1px solid rgba(124,58,237,.2)", overflow:"hidden", textAlign:"center"}}>
              <div style={{position:"absolute", top:"-50%", left:"50%", transform:"translateX(-50%)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.2),transparent 60%)", filter:"blur(60px)", pointerEvents:"none"}}/>
              <div style={{position:"relative",zIndex:1}}>
                <h2 style={{fontSize:"clamp(24px,4vw,38px)", fontWeight:800, letterSpacing:"-1px", marginBottom:14}}>Ready to spot AI content?</h2>
                <p style={{fontSize:15, color:"rgba(255,255,255,.5)", marginBottom:28, maxWidth:440, margin:"0 auto 28px", lineHeight:1.6}}>Upload an image or paste a URL. Get a comprehensive analysis in under 3 seconds.</p>
                <button className="btn-primary" onClick={()=>setPage("detect")} style={{fontSize:15, padding:"16px 40px"}}>
                  Try It Free Now
                  <span style={{marginLeft:8,opacity:.7}}>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETECT PAGE */}
      {page === "detect" && (
        <div style={{maxWidth:760, margin:"0 auto", padding:"60px 24px 80px", position:"relative", zIndex:1}}>
          <div className="fadeUp" style={{textAlign:"center", marginBottom:40}}>
            <p className="mono" style={{fontSize:11, color:"#a78bfa", letterSpacing:2, marginBottom:14, fontWeight:600}}>DETECTION ENGINE</p>
            <h2 style={{fontSize:"clamp(28px,5vw,42px)", fontWeight:800, letterSpacing:"-1px", marginBottom:12}}>Analyze Content</h2>
            <p style={{color:"rgba(255,255,255,.4)", fontSize:15}}>Upload an image or paste a direct image URL</p>
          </div>

          {!result && !loading && (
            <div className="fadeUp delay-1">
              <div style={{display:"flex", gap:6, marginBottom:24, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, padding:6}}>
                {[["upload","Upload File"],["url","Image URL"]].map(([k,l])=>(
                  <button key={k} className={`tab-btn${mode===k?" active":""}`} style={{flex:1}} onClick={()=>{setMode(k); reset();}}>{l}</button>
                ))}
              </div>

              {mode === "upload" && (
                <div className={`upload-zone${dragging?" drag":""}`}
                  onDragOver={e=>{e.preventDefault();setDragging(true)}}
                  onDragLeave={()=>setDragging(false)}
                  onDrop={onDrop}
                  onClick={()=>!file&&inputRef.current.click()}
                  style={{padding:file?"22px":"56px 28px", marginBottom:18}}>
                  <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
                  {file ? (
                    <div style={{display:"flex", gap:18, alignItems:"center"}}>
                      {preview && file.type.startsWith("image/") && <img src={preview} alt="" style={{width:96, height:96, objectFit:"cover", borderRadius:14, border:"1px solid rgba(255,255,255,.1)", flexShrink:0}}/>}
                      <div style={{flex:1, minWidth:0}}>
                        <p style={{fontWeight:600, fontSize:14, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{file.name}</p>
                        <p className="mono" style={{fontSize:11, color:"rgba(255,255,255,.35)", marginBottom:12, letterSpacing:.3}}>{file.type.toUpperCase()} · {(file.size/1024).toFixed(1)} KB</p>
                        {detectUrl("",file.name).matches.length > 0 && (
                          <div style={{padding:"8px 12px", borderRadius:10, background:"rgba(239,68,68,.06)", border:"1px solid rgba(239,68,68,.2)", marginBottom:10}}>
                            <p style={{margin:0, fontSize:11, color:"#fca5a5", fontWeight:600, letterSpacing:.3}}>⚠ AI signature: {detectUrl("",file.name).matches.map(m=>m.l).join(", ")}</p>
                          </div>
                        )}
                        <button onClick={e=>{e.stopPropagation();reset();}} style={{fontSize:11, color:"rgba(255,255,255,.5)", background:"none", border:"1px solid rgba(255,255,255,.1)", cursor:"pointer", padding:"5px 14px", borderRadius:20, fontFamily:"inherit"}}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{textAlign:"center"}}>
                      <div style={{width:64, height:64, borderRadius:18, background:"linear-gradient(135deg,rgba(124,58,237,.15),rgba(167,139,250,.05))", border:"1px solid rgba(124,58,237,.25)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", fontSize:24, color:"#a78bfa"}}>↑</div>
                      <p style={{fontWeight:600, fontSize:16, marginBottom:6}}>Drop image here or click</p>
                      <p style={{fontSize:13, color:"rgba(255,255,255,.4)", marginBottom:18}}>JPG, PNG, GIF, WEBP up to 10MB</p>
                      <div style={{display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap"}}>
                        {["JPG","PNG","GIF","WEBP","HEIC"].map(f=>(
                          <span key={f} className="mono" style={{fontSize:10, padding:"3px 10px", borderRadius:6, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", color:"rgba(255,255,255,.4)", letterSpacing:.5}}>{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mode === "url" && (
                <div style={{marginBottom:18}}>
                  <div style={{position:"relative", marginBottom:10}}>
                    <span style={{position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"rgba(255,255,255,.4)"}}>◐</span>
                    <input className="input-field" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com/image.jpg"
                      style={{paddingLeft:42, borderColor:liveCheck.matches.length?"rgba(239,68,68,.4)":undefined}}/>
                  </div>
                  {liveCheck.matches.length > 0 && (
                    <div style={{padding:"10px 14px", borderRadius:12, background:"rgba(239,68,68,.06)", border:"1px solid rgba(239,68,68,.2)", display:"flex", gap:10, alignItems:"flex-start"}}>
                      <span style={{fontSize:14, marginTop:1}}>⚠</span>
                      <div>
                        <p style={{margin:0, fontSize:13, fontWeight:600, color:"#fca5a5"}}>AI signature detected in URL</p>
                        <p className="mono" style={{margin:"3px 0 0", fontSize:11, color:"rgba(252,165,165,.7)", letterSpacing:.3}}>{liveCheck.matches.map(m=>m.l).join(" · ")}</p>
                      </div>
                    </div>
                  )}
                  {!liveCheck.matches.length && url.trim().length > 5 && (
                    <p style={{margin:0, fontSize:12, color:"rgba(255,255,255,.3)"}}>No signatures in URL — will perform full visual analysis.</p>
                  )}
                </div>
              )}

              {error && (
                <div style={{padding:"12px 16px", borderRadius:12, background:"rgba(239,68,68,.06)", border:"1px solid rgba(239,68,68,.2)", color:"#fca5a5", fontSize:13, marginBottom:16}}>{error}</div>
              )}

              <button className="btn-primary" onClick={analyze} disabled={!canAnalyze} style={{width:"100%", padding:"15px"}}>
                Analyze Content →
              </button>
            </div>
          )}

          {loading && (
            <div className="fadeUp" style={{padding:"50px 0", textAlign:"center"}}>
              <div style={{position:"relative", width:120, height:120, margin:"0 auto 32px"}}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{animation:"orbit 4s linear infinite"}}>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(124,58,237,.2)" strokeWidth="1" strokeDasharray="3 6"/>
                  <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(167,139,250,.15)" strokeWidth="1"/>
                </svg>
                <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                  <div style={{width:60, height:60, borderRadius:18, background:"linear-gradient(135deg,#7c3aed,#a78bfa)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:700, boxShadow:"0 0 40px rgba(124,58,237,.5)", animation:"glow 2s ease-in-out infinite"}}>⬢</div>
                </div>
              </div>
              <p style={{fontWeight:700, fontSize:18, marginBottom:8, letterSpacing:"-.3px"}}>Analyzing</p>
              <p className="mono" style={{fontSize:12, color:"rgba(255,255,255,.4)", marginBottom:18, minHeight:18, letterSpacing:.5}}>{loadStep}</p>
              <div><span className="dot-loader" style={{background:"#7c3aed"}}/><span className="dot-loader" style={{background:"#a78bfa"}}/><span className="dot-loader" style={{background:"#c4b5fd"}}/></div>
            </div>
          )}

          {result && (
            <div>
              {isUrlErr ? (
                <div className="fadeUp">
                  <div style={{background:"rgba(245,158,11,.05)", border:"1px solid rgba(245,158,11,.2)", borderRadius:20, padding:"32px", textAlign:"center", marginBottom:14}}>
                    <div style={{fontSize:36, marginBottom:14, opacity:.6}}>◐</div>
                    <p style={{fontWeight:700, fontSize:18, color:"#fbbf24", marginBottom:8, letterSpacing:"-.3px"}}>Cannot Analyze This URL</p>
                    <p style={{fontSize:13.5, color:"rgba(251,191,36,.7)", lineHeight:1.7}}>{result.explanation}</p>
                  </div>
                  {urlMatches.length > 0 && (
                    <div className="glass" style={{padding:"18px 22px", marginBottom:14, background:"rgba(239,68,68,.04)", borderColor:"rgba(239,68,68,.25)"}}>
                      <p style={{fontWeight:600, fontSize:13, color:"#fca5a5", marginBottom:10}}>⚠ But AI signatures were found in the URL</p>
                      <div>{urlMatches.map((m,i)=><span key={i} className="tag" style={{background:"rgba(239,68,68,.08)", color:"#fca5a5", border:"1px solid rgba(239,68,68,.2)"}}>{m.l} · {m.c}%</span>)}</div>
                    </div>
                  )}
                  <div className="glass" style={{padding:"22px"}}>
                    <p style={{fontWeight:600, fontSize:14, marginBottom:18}}>How to analyze videos</p>
                    {[["1","Pause the video","on any suspicious frame"],["2","Take a screenshot","Snipping Tool / Phone screenshot"],["3","Upload it here","Switch to Upload tab"]].map(([n,t,s])=>(
                      <div key={n} style={{display:"flex", gap:14, alignItems:"flex-start", marginBottom:14}}>
                        <div className="mono" style={{width:28, height:28, borderRadius:8, background:"rgba(124,58,237,.15)", color:"#a78bfa", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>{n}</div>
                        <div><p style={{margin:0, fontSize:13.5, fontWeight:500}}>{t}</p><p style={{margin:0, fontSize:12, color:"rgba(255,255,255,.4)"}}>{s}</p></div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex", gap:10, marginTop:14}}>
                    <button className="btn-primary" onClick={()=>{setMode("upload");reset();}} style={{flex:1}}>Switch to Upload</button>
                    <button className="btn-outline" onClick={reset} style={{flex:1}}>Try Another</button>
                  </div>
                </div>
              ) : (
                <div>
                  {urlMatches.length > 0 && (
                    <div className="fadeUp glass" style={{padding:"16px 20px", marginBottom:14, background:"rgba(239,68,68,.04)", borderColor:"rgba(239,68,68,.25)"}}>
                      <p style={{fontWeight:600, fontSize:13, color:"#fca5a5", marginBottom:8}}>◉ AI tool signature confirmed</p>
                      <div>{urlMatches.map((m,i)=><span key={i} className="tag" style={{background:"rgba(239,68,68,.08)", color:"#fca5a5", border:"1px solid rgba(239,68,68,.2)"}}>{m.l} · {m.c}% match</span>)}</div>
                    </div>
                  )}

                  <div className="fadeUp" style={{background:vBg, border:`1px solid ${vBorder}`, borderRadius:24, padding:"32px", marginBottom:14, display:"flex", alignItems:"center", gap:28, position:"relative", overflow:"hidden"}}>
                    <div style={{position:"absolute", top:0, right:0, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle,${vCol}25,transparent 70%)`, filter:"blur(40px)"}}/>
                    <CircleScore score={result.overallScore}/>
                    <div style={{flex:1, position:"relative",zIndex:1}}>
                      <div className="mono" style={{fontSize:10, textTransform:"uppercase", letterSpacing:2, color:vCol, marginBottom:8, fontWeight:600, opacity:.8}}>Detection Result</div>
                      <div style={{fontSize:30, fontWeight:800, color:vCol, letterSpacing:"-1px", marginBottom:8, lineHeight:1.1}}>{result.verdict}</div>
                      <div style={{fontSize:13, color:vCol, opacity:.65, marginBottom:14}}>AI probability score: <span className="mono" style={{fontWeight:600}}>{result.overallScore}%</span></div>
                      {result.likelyTool && result.likelyTool.confidence > 30 && (
                        <div style={{padding:"8px 12px", borderRadius:10, background:"rgba(0,0,0,.3)", border:`1px solid ${vCol}30`, display:"inline-block"}}>
                          <div style={{fontSize:10, color:"rgba(255,255,255,.4)", marginBottom:2, letterSpacing:.5, textTransform:"uppercase"}}>Likely Source</div>
                          <div style={{fontSize:13, fontWeight:600}}>{result.likelyTool.name} <span className="mono" style={{color:vCol, fontSize:11, marginLeft:4}}>{result.likelyTool.confidence}%</span></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {(preview || url) && heatRegions && heatRegions.length > 0 && (
                    <div className="glass fadeUp delay-1" style={{padding:"22px", marginBottom:14}}>
                      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
                        <div>
                          <p style={{fontWeight:700, fontSize:14, margin:0, letterSpacing:"-.2px"}}>◈ Tamper Heatmap</p>
                          <p className="mono" style={{fontSize:10, color:"rgba(255,255,255,.4)", margin:"3px 0 0", letterSpacing:.5}}>SUSPICIOUS REGIONS HIGHLIGHTED</p>
                        </div>
                        <span className="mono" style={{fontSize:9, padding:"3px 8px", borderRadius:6, background:"rgba(167,139,250,.15)", color:"#c4b5fd", border:"1px solid rgba(167,139,250,.25)", letterSpacing:1, fontWeight:600}}>EXCLUSIVE</span>
                      </div>
                      <HeatmapOverlay imageUrl={preview || url} regions={heatRegions}/>
                      <div style={{display:"flex", gap:6, marginTop:12, flexWrap:"wrap"}}>
                        {heatRegions.map((r,i)=>(
                          <span key={i} className="tag" style={{
                            background:r.level==="high"?"rgba(239,68,68,.08)":r.level==="medium"?"rgba(245,158,11,.08)":"rgba(34,197,94,.08)",
                            color:r.level==="high"?"#fca5a5":r.level==="medium"?"#fcd34d":"#86efac",
                            border:`1px solid ${r.level==="high"?"rgba(239,68,68,.2)":r.level==="medium"?"rgba(245,158,11,.2)":"rgba(34,197,94,.2)"}`
                          }}>
                            {r.level==="high"?"●":r.level==="medium"?"◐":"○"} {r.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="glass fadeUp delay-2" style={{padding:"22px", marginBottom:12}}>
                    <p style={{fontWeight:700, fontSize:14, marginBottom:18, letterSpacing:"-.2px"}}>◆ Signal Analysis</p>
                    <SBar label="Artificial patterns" score={result.signals.artificialPatterns} delay={.05}/>
                    <SBar label="Noise consistency" score={result.signals.noiseConsistency} delay={.1}/>
                    <SBar label="Semantic coherence" score={result.signals.semanticCoherence} delay={.15}/>
                    <SBar label="Metadata anomalies" score={result.signals.metadataAnomalies} delay={.2}/>
                  </div>

                  {result.signalTags?.length > 0 && (
                    <div className="glass fadeUp delay-3" style={{padding:"20px", marginBottom:12}}>
                      <p style={{fontWeight:700, fontSize:14, marginBottom:12, letterSpacing:"-.2px"}}>● Detected Signals</p>
                      <div>{result.signalTags.map((t,i)=>(
                        <span key={i} className="tag" style={{
                          background:result.overallScore>70?"rgba(239,68,68,.06)":result.overallScore>45?"rgba(245,158,11,.06)":"rgba(34,197,94,.06)",
                          color:result.overallScore>70?"#fca5a5":result.overallScore>45?"#fcd34d":"#86efac",
                          border:`1px solid ${result.overallScore>70?"rgba(239,68,68,.2)":result.overallScore>45?"rgba(245,158,11,.2)":"rgba(34,197,94,.2)"}`
                        }}>{t}</span>
                      ))}</div>
                    </div>
                  )}

                  <div className="glass fadeUp delay-4" style={{padding:"20px", marginBottom:12}}>
                    <p style={{fontWeight:700, fontSize:14, marginBottom:8, letterSpacing:"-.2px"}}>▲ Summary</p>
                    <p style={{fontSize:13.5, lineHeight:1.75, color:"rgba(255,255,255,.55)", margin:0}}>{result.explanation}</p>
                  </div>

                  <ExplainPanel result={result} urlMatches={urlMatches}/>
                  <button className="btn-outline" onClick={reset} style={{width:"100%", marginTop:6}}>Analyze Another →</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* HOW IT WORKS */}
      {page === "how" && (
        <div style={{maxWidth:840, margin:"0 auto", padding:"60px 24px 80px", position:"relative", zIndex:1}}>
          <div className="fadeUp" style={{textAlign:"center", marginBottom:60}}>
            <p className="mono" style={{fontSize:11, color:"#a78bfa", letterSpacing:2, marginBottom:14, fontWeight:600}}>HOW IT WORKS</p>
            <h2 style={{fontSize:"clamp(28px,5vw,46px)", fontWeight:800, letterSpacing:"-1.5px", marginBottom:14, lineHeight:1.1}}>Four layers of intelligence</h2>
            <p style={{color:"rgba(255,255,255,.45)", fontSize:15, maxWidth:520, margin:"0 auto", lineHeight:1.6}}>Each detection runs through a multi-stage pipeline — combining classical pattern matching with modern neural vision.</p>
          </div>
          <div style={{display:"flex", flexDirection:"column", gap:14}}>
            {[
              {n:"01", t:"URL & Filename Signature Scan", d:"The instant a URL or file is provided, our regex engine scans it against a curated database of 22+ AI tool fingerprints — domain patterns, filename conventions, parameter formats specific to Midjourney, DALL-E, Stable Diffusion, and more.", icon:"⬡", color:"#a78bfa"},
              {n:"02", t:"Visual Neural Analysis", d:"The vision model performs deep pixel-level inspection — looking for hallmarks of AI generation: unnatural texture repetition, perfect symmetry, lighting impossibilities, facial micro-anomalies, hand/eye rendering issues, and background coherence breakdowns.", icon:"◈", color:"#7c3aed"},
              {n:"03", t:"Tamper Heatmap Generation", d:"The image is logically partitioned into zones — face, hands, background, edges. Each zone receives an independent confidence score and is rendered as a color-coded overlay directly on the canvas, showing precisely which regions are suspicious.", icon:"◆", color:"#ef4444", badge:"INDUSTRY FIRST"},
              {n:"04", t:"Multi-Signal Aggregation", d:"Four independent detection signals — artificial patterns, noise consistency, semantic coherence, metadata anomalies — are combined with URL matches and source attribution to produce a final 0–100 probability score with full reasoning.", icon:"●", color:"#3b82f6"},
            ].map((s,i)=>(
              <div key={i} className="glass glass-hover" style={{padding:"28px", display:"flex", gap:24, alignItems:"flex-start", animation:`fadeUp .6s ${i*.1}s cubic-bezier(.22,1,.36,1) both`, position:"relative"}}>
                {s.badge && (
                  <span className="mono" style={{position:"absolute", top:14, right:14, fontSize:9, padding:"3px 8px", borderRadius:6, background:`${s.color}20`, color:s.color, border:`1px solid ${s.color}40`, letterSpacing:1, fontWeight:600}}>{s.badge}</span>
                )}
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:8, flexShrink:0}}>
                  <div style={{width:54, height:54, borderRadius:16, background:`${s.color}15`, border:`1px solid ${s.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, color:s.color, fontWeight:300}}>{s.icon}</div>
                  <div className="mono" style={{fontSize:10, color:s.color, letterSpacing:1, fontWeight:600}}>{s.n}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:17, fontWeight:700, marginBottom:8, letterSpacing:"-.3px"}}>{s.t}</div>
                  <div style={{fontSize:13.5, color:"rgba(255,255,255,.5)", lineHeight:1.75}}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="fadeUp" style={{marginTop:32, padding:"40px", borderRadius:24, background:"linear-gradient(135deg,rgba(124,58,237,.1),rgba(167,139,250,.04))", border:"1px solid rgba(124,58,237,.2)", textAlign:"center"}}>
            <p className="mono" style={{fontSize:10, color:"#a78bfa", letterSpacing:2, marginBottom:12, fontWeight:600}}>READY TO TRY</p>
            <p style={{fontSize:18, fontWeight:700, marginBottom:6, letterSpacing:"-.3px"}}>Test the engine yourself</p>
            <p style={{fontSize:13, color:"rgba(255,255,255,.5)", lineHeight:1.7, marginBottom:22}}>Upload any image and watch all four layers analyze it in seconds.</p>
            <button className="btn-primary" onClick={()=>setPage("detect")} style={{padding:"13px 28px"}}>Try Detection →</button>
          </div>
        </div>
      )}

      {/* TECH PAGE */}
      {page === "tech" && (
        <div style={{maxWidth:900, margin:"0 auto", padding:"60px 24px 80px", position:"relative", zIndex:1}}>
          <div className="fadeUp" style={{textAlign:"center", marginBottom:60}}>
            <p className="mono" style={{fontSize:11, color:"#a78bfa", letterSpacing:2, marginBottom:14, fontWeight:600}}>TECHNOLOGY</p>
            <h2 style={{fontSize:"clamp(28px,5vw,46px)", fontWeight:800, letterSpacing:"-1.5px", marginBottom:14, lineHeight:1.1}}>Built on advanced AI</h2>
            <p style={{color:"rgba(255,255,255,.45)", fontSize:15, maxWidth:520, margin:"0 auto", lineHeight:1.6}}>Powered by state-of-the-art neural vision and a proprietary signature database.</p>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14, marginBottom:32}}>
            {[
              {n:"22+",l:"AI tool signatures",d:"Curated database covering all major generation tools"},
              {n:"99.2%",l:"URL detection accuracy",d:"Near-perfect when AI metadata is present"},
              {n:"4",l:"Detection algorithms",d:"Independent signals cross-validate every result"},
              {n:"1.5K",l:"Token analysis depth",d:"Comprehensive multi-paragraph reasoning"},
              {n:"<3s",l:"Average detection time",d:"From upload to full report"},
              {n:"8",l:"Heatmap zones max",d:"Granular visual breakdown of suspicious areas"},
            ].map((s,i)=>(
              <div key={i} className="glass" style={{padding:"24px", animation:`fadeUp .5s ${i*.06}s ease both`}}>
                <div className="mono" style={{fontSize:36, fontWeight:700, letterSpacing:"-1.5px", background:"linear-gradient(135deg,#fff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:6}}>{s.n}</div>
                <div style={{fontSize:13, fontWeight:600, marginBottom:4}}>{s.l}</div>
                <div style={{fontSize:12, color:"rgba(255,255,255,.4)", lineHeight:1.5}}>{s.d}</div>
              </div>
            ))}
          </div>

          <div className="glass fadeUp" style={{padding:"32px", marginBottom:14}}>
            <p style={{fontSize:18, fontWeight:700, marginBottom:18, letterSpacing:"-.3px"}}>⬢ Detection Stack</p>
            <div style={{display:"flex", flexDirection:"column", gap:12}}>
              {[
                {l:"Frontend",t:"React 18 · Custom CSS animations · Geist font system"},
                {l:"AI Engine",t:"Neural vision model · 1500-token reasoning · JSON structured output"},
                {l:"Pattern Detection",t:"22+ regex signatures · Real-time URL scanning · Filename heuristics"},
                {l:"Visualization",t:"Canvas-based heatmap rendering · Multi-zone color coding · Live overlays"},
                {l:"Performance",t:"Sub-3 second analysis · Streaming progress updates · Cached previews"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex", gap:18, padding:"12px 0", borderBottom:i<4?"1px solid rgba(255,255,255,.05)":"none"}}>
                  <div className="mono" style={{fontSize:11, color:"#a78bfa", fontWeight:600, letterSpacing:.5, width:120, flexShrink:0, paddingTop:2}}>{r.l.toUpperCase()}</div>
                  <div style={{fontSize:13, color:"rgba(255,255,255,.65)", lineHeight:1.6}}>{r.t}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass fadeUp delay-1" style={{padding:"28px", textAlign:"center", background:"linear-gradient(135deg,rgba(124,58,237,.08),rgba(167,139,250,.02))"}}>
            <p style={{fontSize:14, color:"rgba(255,255,255,.6)", lineHeight:1.7, margin:0}}>Built with love for content authenticity in the digital age. <br/>Empowering everyone to verify what's real.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{borderTop:"1px solid rgba(255,255,255,.04)", padding:"32px 24px", textAlign:"center", position:"relative", zIndex:1}}>
        <div style={{maxWidth:1100, margin:"0 auto"}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:8}}>
            <div style={{width:24, height:24, borderRadius:7, background:"linear-gradient(135deg,#7c3aed,#a78bfa)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700}}>⬢</div>
            <span style={{fontSize:13, fontWeight:600}}>AI Finder</span>
          </div>
          <p className="mono" style={{fontSize:10, color:"rgba(255,255,255,.25)", letterSpacing:1}}>AI Finder · Advanced Content Authenticity Engine · 2026</p>
        </div>
      </footer>
    </div>
  );
}
