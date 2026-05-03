import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════
   PHOTO — Replace with your image URL or base64
   ═══════════════════════════════════════════════ */
const PHOTO_URL = "public/me.png";
/* ── PROJECT DATA ── */
const PROJECTS = [
  { id:"f1", num:"01", title:"F1 Analysis & Predictions", subtitle:"Data Science • Dashboard", period:"Jul – Nov 2025",
    cover:"/projects/f1-cover.png", coverGradient:null, images:["/projects/f1-1.png","/projects/f1-2.png","/projects/f1-3.png","/projects/f1-4.png","/projects/f1-5.png","/projects/f1-6.png","/projects/f1-7.png","/projects/f1-8.png","/projects/f1-9.png","/projects/f1-10.png","/projects/f1-11.png"], link:null,
    desc:"Ingested 45+ years of F1 race data with automated ETL pipelines. Built Lasso Regression models achieving R² > 0.85 for championship forecasting.",
    stack:["Python","Pandas","Scikit-Learn","Lasso Regression","Clustering","Streamlit","Jupyter"],
    longDesc:"This project involved processing and analyzing over four decades of Formula 1 racing data. Using automated pandas ETL pipelines with modular feature engineering, the data was cleaned and made ready for predictive modeling. Lasso Regression was applied to forecast championship standings with high accuracy. K-means clustering identified performance patterns across different circuit types and weather conditions. The final deliverable was a full interactive Streamlit web application." },
  { id:"fuelsense", num:"02", title:"FuelSense", subtitle:"Analytics • Geospatial", period:"Dec 2024 – May 2025",
    cover:"/projects/fs-cover.png", coverGradient:null, images:["/projects/fs-1.png","/projects/fs-2.jpg","/projects/fs-3.png","/projects/fs-4.png","/projects/fs-5.png"], link:"https://fuelsense.streamlit.app",
    desc:"Analyzed fuel consumption across vehicle categories with geospatial mapping and regional clustering.",
    stack:["Python","Matplotlib","Scikit-Learn","Geospatial Analysis","Streamlit"],
    longDesc:"FuelSense processes fuel-consumption-per-kilometer data across diverse vehicle categories and geographic regions. Regional clustering and geospatial mapping uncover consumption pattern differences at scale. The deployed Streamlit dashboard provides dynamic charts, geospatial visualizations, and region-wise comparison tools." },
  { id:"acrs", num:"03", title:"ACRS — Automated Code Review", subtitle:"GNN • Full-Stack", period:"2024 – 2025",
    cover:"/projects/acrs-cover.png", coverGradient:null, images:["/projects/acrs-1.png","/projects/acrs-2.png","/projects/acrs-3.png","/projects/acrs-4.png","/projects/acrs-5.png","/projects/acrs-6.png","/projects/acrs-7.png","/projects/acrs-8.png"], link:"https://acrscan.vercel.app",
    desc:"GNN-based code review platform using a custom Graph Attention Network built from scratch in NumPy.",
    stack:["Python","NumPy","Flask","React","D3.js","Vite","Vercel","Render"],
    longDesc:"ACRS is a GNN-based code review platform. The system uses a custom Graph Attention Network (GAT) implemented entirely from scratch in NumPy, parsing source code into unified program graphs combining AST, CFG, and DFG. Backend on Flask/Render, frontend on React/D3.js/Vercel." },
  { id:"anchor", num:"04", title:"Anchor", subtitle:"GenAI • Causal ML", period:"2026",
    cover:"/projects/anchor-cover.jpg", coverGradient:null, images:["/projects/anchor-1.jpg","/projects/anchor-2.jpg","/projects/anchor-3.jpg","/projects/anchor-4.jpg",,"/projects/anchor-5.jpg",,"/projects/anchor-6.jpg",,"/projects/anchor-7.jpg"], link:null,
    desc:"Causal Prompt Anchoring system that grounds LLM outputs in discovered root causes, verified by a novel CGR metric.",
    stack:["Python","FastAPI","React","Vite","STL","Isolation Forest","Granger Causality","PC Algorithm"],
    longDesc:"Full-stack research project for the Generative AI in Business Use Cases course. The FastAPI backend runs STL decomposition, Isolation Forest anomaly detection, PC algorithm + Granger causality for causal discovery, and backward root-cause tracing. LLM generation is constrained by Causal Prompt Anchoring (CPA), and outputs are verified against a novel CGR (Causal Grounding Ratio) metric. React/Vite frontend with a black-and-white Apple-inspired design. Co-authors: Janmay, Shubhang Gandevia, Aryan Nair." },
];
const SKILLS_ROW1 = ["Python","TensorFlow","PyTorch","Scikit-Learn","Pandas","NumPy","Streamlit","FastAPI","Docker","Git","Kafka","SQL","Python","TensorFlow","PyTorch","Scikit-Learn","Pandas","NumPy","Streamlit","FastAPI","Docker","Git","Kafka","SQL"];
const SKILLS_ROW2 = ["CNNs","RNNs","Transformers","NLP","XGBoost","LightGBM","Clustering","Time-Series","Spark","Hadoop","MLOps","REST APIs","CNNs","RNNs","Transformers","NLP","XGBoost","LightGBM","Clustering","Time-Series","Spark","Hadoop","MLOps","REST APIs"];
const EXPERIENCE = [
  { role:"Corporate Associate", org:"Cherry+ Network", period:"Oct 2024 — Present", desc:"Secured 10+ sponsors for major tech events through end-to-end stakeholder outreach and budget negotiation. Led full-cycle organization of ForceFest and the Nariyukthi Hackathon." },
  { role:"Championships Volunteer", org:"AARUUSH", period:"Aug — Oct 2023", desc:"Contributed to planning for flagship events TurboDrift and QuadCopter. Coordinated logistics and live event flow for 500+ participants." },
];

/* ── SVG Icons ── */
const IC = {
  mail:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  phone:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  gh:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>,
  li:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>,
  arr:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>,
  back:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  ext:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

/* ══════════════════════════════════════════════
   SCROLL REVEAL & MOTION HOOKS
   ══════════════════════════════════════════════ */
function useReveal(t=0.12){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([x])=>{if(x.isIntersecting){s(true);o.unobserve(e)}},{threshold:t,rootMargin:"0px 0px -40px 0px"});o.observe(e);return()=>o.disconnect()},[]);return[r,v]}

function Reveal({children,delay=0,y=60,style={}}){const[r,v]=useReveal();return<div ref={r} style={{...style,opacity:v?1:0,transform:v?"translateY(0)":`translateY(${y}px)`,transition:`opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s`,willChange:"opacity,transform"}}>{children}</div>}
function RevealLeft({children,delay=0,style={}}){const[r,v]=useReveal();return<div ref={r} style={{...style,opacity:v?1:0,transform:v?"translateX(0)":"translateX(-80px)",transition:`opacity 1s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}s`,willChange:"opacity,transform"}}>{children}</div>}
function RevealRight({children,delay=0,style={}}){const[r,v]=useReveal();return<div ref={r} style={{...style,opacity:v?1:0,transform:v?"translateX(0)":"translateX(80px)",transition:`opacity 1s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}s`,willChange:"opacity,transform"}}>{children}</div>}

/* Magnetic wrapper - element gently follows the cursor */
function Magnetic({children,strength=0.25,className="",style={}}){
  const ref=useRef(null);
  const reset=()=>{const el=ref.current;if(el)el.style.transform=""};
  const move=(e)=>{
    const el=ref.current;if(!el)return;
    const r=el.getBoundingClientRect();
    const mx=e.clientX-r.left-r.width/2;
    const my=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${mx*strength}px, ${my*strength}px)`;
  };
  return <div ref={ref} className={`mag ${className}`} style={{...style,transition:"transform 0.45s cubic-bezier(0.22,1,0.36,1)",display:"inline-flex"}} onMouseMove={move} onMouseLeave={reset}>{children}</div>;
}

/* Smooth counter - supports a starting value so "2027" doesn't count from 0 */
function AnimCount({end,decimals=0,duration=1800,start=0,suffix=""}){
  const[ref,vis]=useReveal(0.3);const[val,setVal]=useState(start);const started=useRef(false);
  useEffect(()=>{if(!vis||started.current)return;started.current=true;const t0=Date.now();
    const tick=()=>{const p=Math.min((Date.now()-t0)/duration,1);const e=1-Math.pow(1-p,4);setVal(start+e*(end-start));if(p<1)requestAnimationFrame(tick);else setVal(end)};requestAnimationFrame(tick)},[vis]);
  return<div ref={ref}><div className="count-num">{decimals>0?val.toFixed(decimals):Math.round(val)}{suffix}</div></div>;
}

/* Tilt card (kept for future use) */
function TiltCard({children,className="",onClick,style={}}){
  const ref=useRef(null);
  const handleMove=(e)=>{const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-0.5;const y=(e.clientY-r.top)/r.height-0.5;el.style.transform=`perspective(1200px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-6px)`};
  const handleLeave=()=>{const el=ref.current;if(el)el.style.transform=""};
  return<div ref={ref} className={className} onClick={onClick} style={{...style,transition:"transform 0.5s cubic-bezier(0.22,1,0.36,1),border-color 0.4s,box-shadow 0.4s"}} onMouseMove={handleMove} onMouseLeave={handleLeave}>{children}</div>;
}

/* ══════════════════════════════════════════════
   STACK CARD — sticky-stacking project tile
   Each card sticks at a slightly-incrementing top offset.
   As the NEXT card approaches its pin position, this card
   scales, dims, and blurs - giving a real depth stack feel.
   ══════════════════════════════════════════════ */
function StackCard({project:p, index:i, total, onClick}){
  const wrapRef = useRef(null);
  const [prog, setProg] = useState(0);

  useEffect(()=>{
    let raf;
    const tick = ()=>{
      if (i < total - 1) {
        const nextEl = document.getElementById(`proj-wrap-${i+1}`);
        if (nextEl) {
          const nextRect = nextEl.getBoundingClientRect();
          const nextStickyTop = 100 + (i+1) * 10;
          const d = nextRect.top - nextStickyTop;
          const vh = window.innerHeight;
          const p = 1 - Math.max(0, Math.min(1, d / (vh*0.85)));
          setProg(p);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf);
  }, [i, total]);

  const flipped = i % 2 === 1;
  const scale = 1 - prog * 0.06;
  const opacity = 1 - prog * 0.55;
  const blur = prog * 4;
  const translateY = prog * -30;

  return (
    <div ref={wrapRef} id={`proj-wrap-${i}`} className="stack-wrap" style={{
      position: "sticky",
      top: `${100 + i * 10}px`,
      marginBottom: "10vh",
      zIndex: i + 1
    }}>
      <div className="stack-card" style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
        filter: blur>0.15?`blur(${blur}px)`:"none",
      }}>
        <div className={`stack-inner ${flipped?"flipped":""}`} onClick={onClick}>
          <div className="stack-media">
            {p.cover ? <img src={p.cover} alt={p.title}/> : <div className="stack-media-blank"><span>{p.num}</span></div>}
            <div className="stack-media-grad"/>
          </div>
          <div className="stack-body">
            <div className="stack-top-row">
              <div className="stack-num">/ {p.num}</div>
              <div className="stack-period">{p.period}</div>
            </div>
            <div className="stack-tag">{p.subtitle}</div>
            <h3 className="stack-title">{p.title}</h3>
            <p className="stack-desc">{p.desc}</p>
            <div className="stack-chips">{p.stack.slice(0,6).map(t=><span key={t} className="stack-chip">{t}</span>)}</div>
            <div className="stack-cta">
              <span>View case study</span>
              <span className="stack-arrow">↗</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MUSIC PLAYER — bottom-right mini player (unchanged logic)
   ══════════════════════════════════════════════ */
/* PLAYLIST — replace the title and artist fields below with your actual song info.
   File paths match your public/music/ and public/covers/ folders. */
const PLAYLIST = [
  { title:"Good Morning", artist:"Kanye West", src:"/music/track1-gm.mp3",   cover:"/music/cover1.png" },
  { title:"Drive Slow", artist:"Kanye West", src:"/music/track2-ds.mp3",   cover:"/music/cover2.jpg" },
  { title:"Devil in a New Dress", artist:"Kanye West", src:"/music/track3-diand.mp3", cover:"/music/cover3.jpg" },
  { title:"One of Wun", artist:"Gunna", src:"/music/track4-oow.mp3",  cover:"/music/cover4.jpg" },
  { title:"Over My Dead Body", artist:"Drake", src:"/music/track5-omdb.mp3", cover:"/music/cover5.jpg" },
  { title:"Japan", artist:"Famous Dex", src:"/music/track6-j.mp3",    cover:"/music/cover6.jpg" },
  { title:"Too Many Nights", artist:"Metro Boomin", src:"/music/track7-tmn.mp3",  cover:"/music/cover7.jpg" },
  { title:"Stories About My Brother", artist:"Drake", src:"/music/track8-samb.mp3", cover:"/music/cover8.jpg" },
];

function MusicPlayer(){
  const audioRef=useRef(null);
  const[playing,setPlaying]=useState(false);
  const[vol,setVol]=useState(0.4);
  const[showVol,setShowVol]=useState(false);
  const[track,setTrack]=useState(0);
  const[progress,setProgress]=useState(0);

  const song=PLAYLIST[track]||PLAYLIST[0];

  useEffect(()=>{
    const a=audioRef.current;if(!a)return;
    a.volume=vol;
    const onEnd=()=>{setTrack(t=>(t+1)%PLAYLIST.length);setPlaying(true)};
    const onTime=()=>{if(a.duration)setProgress(a.currentTime/a.duration)};
    a.addEventListener("ended",onEnd);
    a.addEventListener("timeupdate",onTime);
    return()=>{a.removeEventListener("ended",onEnd);a.removeEventListener("timeupdate",onTime)};
  },[]);

  useEffect(()=>{const a=audioRef.current;if(!a)return;a.volume=vol},[vol]);
  useEffect(()=>{
    const a=audioRef.current;if(!a)return;
    a.src=song.src;a.load();setProgress(0);
    if(playing)a.play().catch(()=>{});
  },[track]);

  const toggle=()=>{
    const a=audioRef.current;if(!a)return;
    if(playing){a.pause();setPlaying(false)}
    else{a.play().then(()=>setPlaying(true)).catch(()=>{})}
  };
  const next=()=>{setTrack(t=>(t+1)%PLAYLIST.length)};

  if(!PLAYLIST.length)return null;

  return(
    <div className="music-wrap">
      {!playing&&<div className="mp-hint">▶ press play</div>}
      <div className="music-player">
      <audio ref={audioRef} preload="metadata"/>
      <div className="mp-cover" style={{backgroundImage:`url(${song.cover})`}} onClick={toggle}>
        <div className="mp-play-icon">{playing?<svg width="10" height="10" viewBox="0 0 24 24" fill="var(--cream)"><rect x="5" y="4" width="4" height="16"/><rect x="15" y="4" width="4" height="16"/></svg>:<svg width="10" height="10" viewBox="0 0 24 24" fill="var(--cream)"><polygon points="6,4 20,12 6,20"/></svg>}</div>
      </div>
      <div className="mp-info">
        <div className="mp-title">{song.title}</div>
        <div className="mp-artist">{song.artist}</div>
        <div className="mp-progress" onClick={(e)=>{const a=audioRef.current;if(!a||!a.duration)return;const r=e.currentTarget.getBoundingClientRect();a.currentTime=(e.clientX-r.left)/r.width*a.duration}}>
          <div className="mp-progress-fill" style={{width:`${progress*100}%`}}/>
        </div>
      </div>
      <div className="mp-controls">
        <button className="mp-btn" onClick={toggle}>{playing?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2"><polygon points="6,4 20,12 6,20"/></svg>}</button>
        {PLAYLIST.length>1&&<button className="mp-btn" onClick={next}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2"><polygon points="5,4 15,12 5,20"/><line x1="19" y1="5" x2="19" y2="19"/></svg></button>}
        <button className="mp-btn" onClick={()=>setShowVol(!showVol)} style={{position:"relative"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></button>
      </div>
      {showVol&&<div className="mp-vol-wrap"><input type="range" min="0" max="1" step="0.01" value={vol} onChange={e=>setVol(parseFloat(e.target.value))} className="mp-vol-slider"/></div>}
    </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   3D DARK GLOBE — Three.js (kept)
   ══════════════════════════════════════════════ */
function DarkGlobe(){
  const mountRef=useRef(null);
  useEffect(()=>{
    const el=mountRef.current;if(!el)return;
    const W=el.clientWidth||450,H=el.clientHeight||450;
    const scene=new THREE.Scene();
    /* Wider FOV + farther camera so the moon and its orbit ring stay inside the view */
    /* Wider FOV + farther camera so the moon and its orbit ring stay inside the view at all aspect ratios */
    const camera=new THREE.PerspectiveCamera(50,W/H,0.1,1000);
    camera.position.z=3.6;
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
    renderer.setSize(W,H);renderer.setPixelRatio(window.devicePixelRatio);renderer.setClearColor(0x000000,0);
    el.appendChild(renderer.domElement);
    const group=new THREE.Group();scene.add(group);
    const useTexture = true;

    const sphereGeo=new THREE.SphereGeometry(1,64,64);
    let sphereMat;
    if(useTexture){
      const tex=new THREE.TextureLoader().load("/earth-bw.jpg");
      sphereMat=new THREE.MeshBasicMaterial({map:tex});
      group.add(new THREE.Mesh(sphereGeo,sphereMat));
      const wireGeo=new THREE.SphereGeometry(1.003,36,24);
      group.add(new THREE.Mesh(wireGeo,new THREE.MeshBasicMaterial({color:0xcccccc,wireframe:true,transparent:true,opacity:0.08})));
    }else{
      sphereMat=new THREE.MeshPhongMaterial({color:0x111115,emissive:0x060608,specular:0x222222,shininess:20});
      group.add(new THREE.Mesh(sphereGeo,sphereMat));
      group.add(new THREE.Mesh(new THREE.SphereGeometry(1.002,36,24),new THREE.MeshBasicMaterial({color:0xe8e4de,wireframe:true,transparent:true,opacity:0.06})));
      const N=1400;const pos=new Float32Array(N*3);const sizes=new Float32Array(N);const phi0=(1+Math.sqrt(5))/2;
      for(let i=0;i<N;i++){
        const th=2*Math.PI*i/phi0;const ph=Math.acos(1-2*(i+0.5)/N);const r=1.005;
        pos[i*3]=r*Math.sin(ph)*Math.cos(th);pos[i*3+1]=r*Math.cos(ph);pos[i*3+2]=r*Math.sin(ph)*Math.sin(th);
        sizes[i]=0.8+Math.random()*1.2;
      }
      const dotGeo=new THREE.BufferGeometry();
      dotGeo.setAttribute("position",new THREE.BufferAttribute(pos,3));
      dotGeo.setAttribute("size",new THREE.BufferAttribute(sizes,1));
      const dotMat=new THREE.ShaderMaterial({
        uniforms:{color:{value:new THREE.Color(0xe8e4de)},opacity:{value:0.35}},
        vertexShader:`attribute float size;varying float vA;void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=size*(150.0/-mv.z);gl_Position=projectionMatrix*mv;vec3 n=normalize(normalMatrix*normalize(position));vA=pow(max(0.0,n.z),1.5);}`,
        fragmentShader:`uniform vec3 color;uniform float opacity;varying float vA;void main(){float d=length(gl_PointCoord-vec2(0.5));if(d>0.45)discard;gl_FragColor=vec4(color,(1.0-d*2.2)*vA*opacity);}`,
        transparent:true,depthWrite:false,
      });
      group.add(new THREE.Points(dotGeo,dotMat));
    }

    const glow=new THREE.Mesh(new THREE.RingGeometry(1.02,1.08,64),new THREE.MeshBasicMaterial({color:0x8899aa,transparent:true,opacity:0.05,side:THREE.DoubleSide}));
    glow.lookAt(camera.position);scene.add(glow);

    /* ─── MOON + ORBIT ─── */
    /* Tighter orbit so the moon never gets clipped at extreme scales / corner viewports */
    const MOON_ORBIT_R = 1.32;
    const moonSystem = new THREE.Group();
    /* Tilt the orbital plane so the ring and moon are both visibly 3D */
    moonSystem.rotation.x = 0.35;
    moonSystem.rotation.z = 0.12;
    scene.add(moonSystem);

    /* Orbit ring (thin circle) */
    const orbitGeo = new THREE.RingGeometry(MOON_ORBIT_R - 0.006, MOON_ORBIT_R + 0.006, 180);
    const orbitMat = new THREE.MeshBasicMaterial({color:0xc8c6c0, transparent:true, opacity:0.14, side:THREE.DoubleSide});
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = Math.PI / 2; /* lay ring flat in moonSystem local XZ plane */
    moonSystem.add(orbitRing);

    /* Moon — uses the SAME earth-bw texture wrap technique as the earth above, so the moon
       reads as a sibling object in the same visual language. The earth-bw map's contrast also
       happens to look genuinely lunar (bright continents = bright lunar highlands, dark oceans
       = darker lunar maria) when desaturated and slightly inverted-feeling. */
    const moonGroup = new THREE.Group();
    moonSystem.add(moonGroup);

    const moonRadius = 0.20;
    const moonTex = new THREE.TextureLoader().load("/moon.jpg");
    const moonBaseMat = new THREE.MeshBasicMaterial({map: moonTex});
    const moonSphere = new THREE.Mesh(new THREE.SphereGeometry(moonRadius, 48, 48), moonBaseMat);
    moonGroup.add(moonSphere);

    /* Wireframe overlay — same aesthetic as the earth's grid */
    const moonWire = new THREE.Mesh(
      new THREE.SphereGeometry(moonRadius * 1.003, 24, 16),
      new THREE.MeshBasicMaterial({color:0xcccccc, wireframe:true, transparent:true, opacity:0.10})
    );
    moonGroup.add(moonWire);

    /* Subtle moon glow */
    const moonGlow = new THREE.Mesh(
      new THREE.SphereGeometry(moonRadius * 1.25, 24, 24),
      new THREE.MeshBasicMaterial({color:0xe8e4de, transparent:true, opacity:0.06})
    );
    moonSystem.add(moonGlow);

    const key=new THREE.DirectionalLight(0xdedcd6,1.0);key.position.set(2,1,3);scene.add(key);
    const rim=new THREE.DirectionalLight(0x4466aa,0.4);rim.position.set(-3,0,-1);scene.add(rim);
    scene.add(new THREE.AmbientLight(0x222222,0.4));
    group.rotation.x=0.4;group.rotation.z=-0.1;
    let dragging=false,dragX=0,dragY=0,rotVx=0,rotVy=0.003;
    let moonAngle = 0;
    const onDown=(e)=>{dragging=true;dragX=e.clientX||e.touches?.[0]?.clientX||0;dragY=e.clientY||e.touches?.[0]?.clientY||0;el.style.cursor="grabbing"};
    const onUp=()=>{dragging=false;el.style.cursor="grab"};
    const onDrag=(e)=>{
      if(!dragging)return;
      const cx=e.clientX||e.touches?.[0]?.clientX||0;
      const cy=e.clientY||e.touches?.[0]?.clientY||0;
      rotVy=(cx-dragX)*0.005;rotVx=(cy-dragY)*0.005;
      dragX=cx;dragY=cy;
    };
    el.addEventListener("mousedown",onDown);el.addEventListener("touchstart",onDown,{passive:true});
    window.addEventListener("mouseup",onUp);window.addEventListener("touchend",onUp);
    el.addEventListener("mousemove",onDrag);el.addEventListener("touchmove",onDrag,{passive:true});
    el.style.cursor="grab";
    let aid;
    const anim=()=>{
      aid=requestAnimationFrame(anim);
      if(!dragging){rotVy+=(0.003-rotVy)*0.02;rotVx*=0.95}
      group.rotation.y+=rotVy;group.rotation.x+=rotVx;

      /* Moon orbits the earth in its own tilted plane, independent of earth's rotation.
         Moon also spins slowly on its own axis so the texture's features rotate through view. */
      moonAngle += 0.0045;
      const mx = Math.cos(moonAngle) * MOON_ORBIT_R;
      const mz = Math.sin(moonAngle) * MOON_ORBIT_R;
      moonGroup.position.set(mx, 0, mz);
      moonGlow.position.set(mx, 0, mz);
      moonGroup.rotation.y += 0.004;

      renderer.render(scene,camera);
    };
    anim();
    const onResize=()=>{const w=el.clientWidth||450,h=el.clientHeight||450;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)};
    window.addEventListener("resize",onResize);
    return()=>{cancelAnimationFrame(aid);el.removeEventListener("mousedown",onDown);el.removeEventListener("touchstart",onDown);window.removeEventListener("mouseup",onUp);window.removeEventListener("touchend",onUp);el.removeEventListener("mousemove",onDrag);el.removeEventListener("touchmove",onDrag);window.removeEventListener("resize",onResize);renderer.dispose();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement)};
  },[]);
  return<div ref={mountRef} className="globe-wrap"/>;
}

/* ── IST Clock ── */
function useClock(){const[t,s]=useState("");useEffect(()=>{const tick=()=>{const d=new Date();const ist=new Date(d.getTime()+(5.5*60*60*1000)+(d.getTimezoneOffset()*60*1000));const h=ist.getHours();s(`${h%12||12}:${String(ist.getMinutes()).padStart(2,"0")} ${h>=12?"PM":"AM"} IST`)};tick();const id=setInterval(tick,10000);return()=>clearInterval(id)},[]);return t}

/* ══════════════════════════════════════════════
   PROJECT DETAIL (polished)
   ══════════════════════════════════════════════ */
function ProjectDetail({project:p, onBack}){
  useEffect(()=>{window.scrollTo(0,0)},[]);
  return (
    <div className="project-detail">
      <div className="pd-inner">
        <button onClick={onBack} className="pd-back">{IC.back} Back to work</button>
        <div className="pd-meta"><span>{p.subtitle}</span><span className="pd-sep">/</span><span>{p.period}</span></div>
        <h1 className="pd-title">{p.title}</h1>
        <div className="pd-hero">
          {p.cover ? <img src={p.cover} alt={p.title}/> : <div className="pd-hero-blank">Add cover</div>}
        </div>
        <div className="pd-grid">
          <div>
            <h3 className="pd-sec-head">Overview</h3>
            <p className="pd-prose">{p.longDesc}</p>
          </div>
          <div>
            <h4 className="pd-sec-head pd-small">Stack</h4>
            <div className="pd-chips">{p.stack.map(t=><span key={t} className="pd-chip">{t}</span>)}</div>
            {p.link && <Magnetic strength={0.15}><a href={p.link} target="_blank" rel="noopener noreferrer" className="pd-link">Live Site {IC.ext}</a></Magnetic>}
          </div>
        </div>
        {p.images.length>0 ? <div>
          <h3 className="pd-sec-head">Gallery</h3>
          <div className="pd-gallery">{p.images.map((img,i)=><div key={i} className="pd-shot"><img src={img} alt={`${p.title} ${i+1}`}/></div>)}</div>
        </div> : <div className="pd-empty"><p>Add screenshots to the PROJECTS data</p></div>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MOBILE MENU & RESUME MODAL — extracted
   ══════════════════════════════════════════════ */
function MobileMenu({go, setShowResume, setMenuOpen}){
  return <div className="mobile-overlay">
    {["about","skills","projects","experience","contact"].map((s,i)=>
      <button key={s} onClick={()=>go(s)} className="mobile-link" style={{animationDelay:`${i*0.05}s`}}>{s}</button>
    )}
    <button onClick={()=>{setShowResume(true); setMenuOpen(false)}} className="mobile-link" style={{animationDelay:"0.3s"}}>Resume</button>
  </div>
}

function ResumeModal({onClose}){
  return <div className="resume-overlay" onClick={(e)=>{if(e.target===e.currentTarget)onClose()}}>
    <div className="resume-modal">
      <div className="resume-header">
        <span className="resume-title">Resume / <em>Ritwik Kumar</em></span>
        <div className="resume-actions">
          <a href="/resume.pdf" download className="resume-dl">Download {IC.arr}</a>
          <button onClick={onClose} className="resume-close" aria-label="Close">&times;</button>
        </div>
      </div>
      <div className="resume-body"><iframe src="/resume.pdf" title="Resume"/></div>
    </div>
  </div>
}

/* ══════════════════════════════════════════════ MAIN ══════════════════════════════════════════════ */
export default function Portfolio(){
  const [scrollY, setScrollY] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [navShow, setNavShow] = useState(true);
  const lastScroll = useRef(0);
  const [activeProject, setActiveProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [loaded, setLoaded] = useState(false);
  /* Latched intro progress: only increases, never decreases. Once the intro plays through once,
     scrolling back to the top doesn't replay it. */
  const introMaxRef = useRef(0);
  const istTime = useClock();

  useEffect(()=>{const t=setTimeout(()=>setLoaded(true),2200);return()=>clearTimeout(t)},[]);

  /* rAF-throttled scroll handler */
  useEffect(()=>{
    let raf = null;
    const compute = ()=>{
      const y = window.scrollY;
      setScrollY(y);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH>0? y/docH : 0);
      if(y<100) setNavShow(true);
      else if(y<lastScroll.current) setNavShow(true);
      else if(y>lastScroll.current+5) setNavShow(false);
      lastScroll.current = y;
      raf = null;
    };
    const onScroll = ()=>{ if(!raf) raf = requestAnimationFrame(compute); };
    window.addEventListener("scroll", onScroll, {passive:true});
    compute();
    return ()=>{window.removeEventListener("scroll", onScroll); if(raf) cancelAnimationFrame(raf)};
  },[]);

  const go = (id)=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false)};
  /* goBack closes the project. We pop the history entry we pushed when opening, which also
     handles the case where the user clicks the back arrow in our own UI (we want the
     browser URL to revert as well, so a real Back press won't double-pop). */
  const goBack = ()=>{
    if(window.history.state && window.history.state.project){ window.history.back(); return; }
    if(window._pageFade){ window._pageFade(()=>setActiveProject(null)) } else setActiveProject(null);
  };

  /* Open a project = push a history entry. Browser Back will then fire popstate and we close. */
  const openProject = (p)=>{
    try{ window.history.pushState({project:p.id},"", `#${p.id}`); }catch(e){}
    if(window._pageFade){ window._pageFade(()=>setActiveProject(p)) } else setActiveProject(p);
  };

  /* popstate listener: handles browser Back/Forward and any history.back() we trigger ourselves.
     If a project is open and the user navigates back, close the project instead of leaving the site. */
  useEffect(()=>{
    const onPop = ()=>{
      const st = window.history.state;
      if(!st || !st.project){
        if(activeProject){
          if(window._pageFade){ window._pageFade(()=>setActiveProject(null)) } else setActiveProject(null);
        }
      }
    };
    window.addEventListener("popstate", onPop);
    return ()=>window.removeEventListener("popstate", onPop);
  },[activeProject]);

  /* If the page loads with a #project hash, open that project after mount (deep linking) */
  useEffect(()=>{
    const hash = window.location.hash.replace("#","");
    if(!hash) return;
    const p = PROJECTS.find(pp=>pp.id===hash);
    if(p){ setActiveProject(p); /* don't push state — we're already at this URL */ }
  },[]);

  if(activeProject){
    return (
      <div style={{background:"transparent",minHeight:"100vh",position:"relative",zIndex:1}}>
        <style>{CSS}</style>
        <div className="grain"/>
        <nav className="pill-nav">
          <span className="nav-brand" onClick={goBack}>ritwik.</span>
          <div className="nav-pills"><button className="pill-btn" onClick={goBack}>← Work</button></div>
          <span className="nav-time">{istTime}</span>
        </nav>
        <button className="resume-btn" onClick={()=>setShowResume(true)}>Resume {IC.arr}</button>
        <ProjectDetail project={activeProject} onBack={goBack}/>
        {showResume && <ResumeModal onClose={()=>setShowResume(false)}/>}
      </div>
    )
  }

  /* Intro sequence: globe + name start HUGE at center, settle into their places.
     introProg is LATCHED — once it hits 1, scrolling back up keeps it at 1 so the intro never replays. */
  const liveProg = Math.min(1, scrollY / 700);
  if (liveProg > introMaxRef.current) introMaxRef.current = liveProg;
  const introProg = introMaxRef.current;
  const introInv = 1 - introProg;
  /* Hero exit: scale + fade on scroll down (only after intro completes) */
  const heroScale = Math.max(0.92, 1 - Math.max(0, scrollY-700)/2400);
  const heroOpac = Math.max(0, Math.min(1, (1600 - scrollY) / 500));
  /* Globe visibility: always 1 while near hero, fades to 0 when user scrolls past hero into content sections */
  const globeFade = Math.max(0, Math.min(1, (1200 - scrollY) / 400));

  return (
    <div style={{background:"transparent",color:"var(--cream)",minHeight:"100vh",position:"relative",zIndex:1,"--intro-prog":introProg,"--intro-inv":introInv}}>
      <style>{CSS}</style>
      <div className="grain"/>

      {/* ─── PRELOADER ─── */}
      <div className="preloader" style={{opacity:loaded?0:1,pointerEvents:loaded?"none":"all",transition:"opacity 0.6s ease 0.3s"}}>
        <div className="preloader-inner">
          <div className="preloader-name"><em>R /</em> Ritwik Kumar</div>
          <div className="preloader-bar"><div className="preloader-fill"/></div>
          <div className="preloader-tag">{new Date().getFullYear()}</div>
        </div>
      </div>

      {/* ─── SCROLL PROGRESS ─── */}
      <div className="scroll-prog-wrap">
        <div className="scroll-prog" style={{width:`${scrollPct*100}%`,boxShadow:scrollPct>0?"0 0 10px rgba(232,228,222,0.3)":"none"}}/>
      </div>

      {/* ─── NAV ─── */}
      <nav className="pill-nav" style={{opacity:navShow?1:0,transform:navShow?"translateX(-50%) translateY(0)":"translateX(-50%) translateY(-20px)"}}>
        <span className="nav-brand" onClick={()=>go("home")}>ritwik.</span>
        <div className="nav-pills">{[["about","About"],["skills","Stack"],["projects","Work"],["experience","Exp"],["contact","Contact"]].map(([id,l])=><button key={id} className="pill-btn" onClick={()=>go(id)}>{l}</button>)}</div>
        <span className="nav-time">{istTime}</span>
      </nav>
      <div className="mobile-nav" style={{opacity:navShow?1:0}}>
        <span className="nav-brand" onClick={()=>go("home")}>ritwik.</span>
        <button className="mob-btn" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?"CLOSE":"MENU"}</button>
      </div>
      <button className="resume-btn" onClick={()=>setShowResume(true)}>Resume {IC.arr}</button>
      {menuOpen && <MobileMenu go={go} setShowResume={setShowResume} setMenuOpen={setMenuOpen}/>}

      {/* ═══════════ HERO ═══════════ */}
      <section id="home" className="hero" style={{opacity:heroOpac,transform:`scale(${heroScale})`,transformOrigin:"center 35%"}}>
        <div className="hero-inner">
          <div className="hero-status hero-fly hero-fly-tl">
            <span className="status-dot"/>
            <span>Available for <em>work</em></span>
          </div>

          <div className="hero-title-wrap hero-title-fade">
            <h1 className="hero-title">
              <span className="htl-line"><span className="htl-word">RITWIK</span></span>
              <span className="htl-line"><span className="htl-word">KUMAR</span></span>
            </h1>
          </div>

          <div className="hero-meta hero-fly hero-fly-bl">
            <div className="hero-meta-grid">
              <div className="hm-col">
                <div className="hm-label">(Role)</div>
                <div className="hm-val">ML Engineer<br/>Full-stack</div>
              </div>
              <div className="hm-col">
                <div className="hm-label">(Based)</div>
                <div className="hm-val">Chennai /<br/>Delhi NCR</div>
              </div>
              <div className="hm-col">
                <div className="hm-label">(Focus)</div>
                <div className="hm-val">Deep Learning<br/>Data pipelines</div>
              </div>
            </div>
            <div className="hero-globe-spacer" aria-hidden="true"/>
          </div>

          <div className="hero-ctas hero-fly hero-fly-br">
            <Magnetic strength={0.18}><button onClick={()=>go("projects")} className="btn-primary">View Work <span className="arr">→</span></button></Magnetic>
            <Magnetic strength={0.18}><button onClick={()=>go("contact")} className="btn-ghost">Get in Touch</button></Magnetic>
          </div>
        </div>

        <div className="hero-bottom hero-fly hero-fly-down">
          <button className="hero-scroll-hint" onClick={()=>go("about")} aria-label="Scroll to next section" type="button">
            <span className="scroll-line"/>
            <span className="scroll-word">SCROLL</span>
            <span className="scroll-arrow" aria-hidden="true">↓</span>
          </button>
          <div className="hero-ticker">
            <div className="hero-ticker-track">
              {[...Array(3)].flatMap((_,k)=>["AVAILABLE FOR WORK","MACHINE LEARNING","DEEP LEARNING","GRAPH NEURAL NETS","DATA PIPELINES","FULL-STACK","PYTORCH","TENSORFLOW","CHENNAI / DELHI NCR"].map((t,i)=>(
                <span key={`${k}-${i}`} className="ticker-item"><em>{t}</em><span className="ticker-dot">✦</span></span>
              )))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ NAME STAGE — fixed overlay that starts over the globe and flies to the hero title position ═══════════ */}
      <div className="name-stage" aria-hidden="true">
        <span className="name-line">RITWIK</span>
        <span className="name-line">KUMAR</span>
      </div>

      {/* ═══════════ GLOBE STAGE (fixed) — starts huge & centered, settles to right half of screen (large) ═══════════ */}
      <div className="globe-stage" style={{opacity:globeFade,pointerEvents:introProg>0.85 && globeFade>0.5?"auto":"none"}} aria-hidden={globeFade<0.3}>
        <div className="globe-stage-inner" style={{transform:`translate(-50%, -50%) translate(${introProg*20}vw, ${introProg*-6}vh) scale(${1 - introProg*0.42})`}}>
          <DarkGlobe/>
        </div>
        {/* Scroll hint that stays visible during intro — clickable to advance past the intro */}
        <button className="globe-intro-hint" style={{opacity:introInv,pointerEvents:introInv>0.1?"auto":"none"}}
                onClick={()=>window.scrollTo({top:760,behavior:"smooth"})}
                aria-label="Begin" type="button">
          <span className="gih-line"/>
          <span>SCROLL TO BEGIN</span>
        </button>
      </div>

      {/* ═══════════ ABOUT ═══════════ */}
      <section id="about" className="section section-about">
        <div className="section-head section-head-tall">
          <div className="section-num">(01)</div>
          <div className="section-labels">
            <div className="s-tag">About</div>
            <Reveal delay={0.05}><h2 className="s-head-big about-head">ML engineer,<br/><em>data</em> scientist.</h2></Reveal>
          </div>
        </div>
        <div className="about-grid">
          <RevealLeft delay={0.1}>
            <div className="about-text">
              <p>Pre-Final year <em>Computer Science</em> student at SRMIST, Chennai — specialising in Data Science & Business Systems. I build ML models, graph neural networks, and data pipelines that ship.</p>
              <p>From predictive dashboards on decades of F1 race data to NLP pipelines written from scratch, I turn raw data into deployed product.</p>
              <div className="counters">
                {[{end:2027,dec:0,label:"Graduation",start:2020,dur:1400},{end:15,dec:0,label:"Projects Shipped",start:0,dur:1600,suffix:"+"},{end:10,dec:0,label:"Technologies",start:0,dur:1400,suffix:"+"}].map(s=>
                  <div key={s.label} className="counter-item">
                    <AnimCount end={s.end} decimals={s.dec} duration={s.dur} start={s.start} suffix={s.suffix||""}/>
                    <div className="counter-label">{s.label}</div>
                  </div>
                )}
              </div>
            </div>
          </RevealLeft>
          <RevealRight delay={0.2}>
            <div className="about-photo-wrap">
              <div className="about-photo">
                <img src={PHOTO_URL} alt="Ritwik Kumar" style={{transform:`translate3d(0,${-scrollY*0.04}px,0) scale(1.08)`}}/>
              </div>
              <div className="photo-caption">
                <span>Ritwik Kumar</span><em>Chennai, 2026</em>
              </div>
            </div>
          </RevealRight>
        </div>
      </section>

      {/* ═══════════ SKILLS ═══════════ */}
      <section id="skills" className="section section-skills">
        <div className="section-head">
          <div className="section-num">(02)</div>
          <div className="section-labels">
            <div className="s-tag">What I work with</div>
            <Reveal delay={0.05}><h2 className="s-head">Tech <em>stack.</em></h2></Reveal>
          </div>
        </div>
        <div className="marquee-left"><div className="marquee-track">{SKILLS_ROW1.map((s,i)=><div key={`a${i}`} className="marquee-item">{s}</div>)}</div></div>
        <div className="marquee-right"><div className="marquee-track">{SKILLS_ROW2.map((s,i)=><div key={`b${i}`} className="marquee-item">{s}</div>)}</div></div>
      </section>

      {/* ═══════════ PROJECTS — STACKING ═══════════ */}
      <section id="projects" className="section section-projects">
        <div className="section-head">
          <div className="section-num">(03)</div>
          <div className="section-labels">
            <div className="s-tag">Work</div>
            <Reveal delay={0.05}><h2 className="s-head"><em>Projects.</em></h2></Reveal>
          </div>
        </div>
        <div className="stack-hint">
          <span className="scroll-line-h"/>
          <span>Scroll — projects stack as you go</span>
        </div>
        <div className="stack-wrapper">
          {PROJECTS.map((p,i)=>
            <StackCard key={p.id} project={p} index={i} total={PROJECTS.length} onClick={()=>openProject(p)}/>
          )}
        </div>
      </section>

      {/* ═══════════ EXPERIENCE ═══════════ */}
      <section id="experience" className="section">
        <div className="section-head">
          <div className="section-num">(04)</div>
          <div className="section-labels">
            <div className="s-tag">Leadership & Activities</div>
            <Reveal delay={0.05}><h2 className="s-head">Professional <em>experience.</em></h2></Reveal>
          </div>
        </div>
        <div className="exp-list">{EXPERIENCE.map((exp,i)=>
          <Reveal key={i} delay={i*0.1}>
            <div className="exp-card-v2">
              <div className="exp-period">{exp.period}</div>
              <div className="exp-body">
                <div className="exp-role-line"><h4>{exp.role}</h4><span className="exp-sep">/</span><span className="exp-org"><em>{exp.org}</em></span></div>
                <p>{exp.desc}</p>
              </div>
            </div>
          </Reveal>
        )}</div>
      </section>

      {/* ═══════════ CONTACT ═══════════ */}
      <section id="contact" className="section section-contact">
        <div className="section-head">
          <div className="section-num">(05)</div>
          <div className="section-labels">
            <div className="s-tag">Contact</div>
            <Reveal delay={0.05}><h2 className="s-head-big">Get in <em>touch.</em></h2></Reveal>
          </div>
        </div>
        <div className="contact-grid-v2">
          <Reveal delay={0.1}>
            <a href="mailto:kritwik495@gmail.com" className="contact-cta-v2">
              <div className="cta-ico-wrap">{IC.mail}</div>
              <div className="cta-body">
                <div className="cta-label">Drop a line</div>
                <div className="cta-val">kritwik495@gmail.com</div>
              </div>
              <span className="cta-arrow">{IC.arr}</span>
            </a>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="contact-socials">
              {[{icon:IC.phone,label:"Phone",value:"+91 98910 03096",href:"tel:+919891003096"},{icon:IC.gh,label:"GitHub",value:"@Ritzwik",href:"https://github.com/Ritzwik"},{icon:IC.li,label:"LinkedIn",value:"Ritwik Kumar",href:"https://www.linkedin.com/in/ritwikk03/"}].map((c,i)=>
                <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="contact-link-v2">
                  <div className="cl-ico">{c.icon}</div>
                  <div className="cl-body"><div className="cl-label">{c.label}</div><div className="cl-val">{c.value}</div></div>
                  <span className="cl-arrow">{IC.arr}</span>
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="footer-v2">
        <div className="footer-huge">
          <span>RITWIK <em>KUMAR.</em></span>
        </div>
        <div className="footer-ticker">
          <div className="footer-ticker-track">
            {[...Array(3)].flatMap((_,k)=>["RITWIK KUMAR","AVAILABLE FOR WORK","MACHINE LEARNING","DEEP LEARNING","GRAPH NEURAL NETS","FULL-STACK ENGINEERING","CHENNAI / DELHI NCR"].map((t,i)=>(
              <span key={`${k}-${i}`} className="ticker-item"><em>{t}</em><span className="ticker-dot">✦</span></span>
            )))}
          </div>
        </div>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} Ritwik Kumar</span>
          <span>All rights reserved</span>
        </div>
      </footer>

      <MusicPlayer/>

      <button className="back-to-top" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{opacity:scrollPct>0.3?1:0,transform:scrollPct>0.3?"translateY(0)":"translateY(20px)",pointerEvents:scrollPct>0.3?"auto":"none"}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
      </button>

      {showResume && <ResumeModal onClose={()=>setShowResume(false)}/>}
    </div>
  );
}


/* ══════════════════════════════════════════════ CSS ══════════════════════════════════════════════ */
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400&display=swap');

:root{
  --bg:#070707; --bg-2:#0a0a0a;
  --surface:#121212; --surface-2:#181818;
  --border:rgba(255,255,255,0.08); --border-2:rgba(255,255,255,0.14);
  --cream:#e8e4de; --cream-dim:#9e9a94; --mid:#5a5650; --dark:#050505;
  --accent:#8f7e5f;
  --glass-bg:linear-gradient(135deg,rgba(48,48,48,0.55),rgba(14,14,14,0.7));
  --glass-bg-strong:linear-gradient(135deg,rgba(60,60,60,0.65),rgba(18,18,18,0.78));
  --glass-bd:rgba(255,255,255,0.09); --glass-bd-top:rgba(255,255,255,0.18);
  --glass-shadow:0 12px 40px rgba(0,0,0,0.45),0 2px 8px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.08),inset 0 -1px 0 rgba(0,0,0,0.2);
  --glass-shadow-hover:0 20px 60px rgba(0,0,0,0.6),0 4px 12px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.14),inset 0 -1px 0 rgba(0,0,0,0.2);
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;text-size-adjust:100%;-webkit-text-size-adjust:100%}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--cream);overflow-x:hidden;min-width:320px;-webkit-font-smoothing:antialiased}
em{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;letter-spacing:-0.01em}
::selection{background:rgba(232,228,222,0.22);color:var(--cream)}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border-2);border-radius:3px}

/* ─── KEYFRAMES ─── */
@keyframes marquee-left{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes marquee-right{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
@keyframes heroText{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes grainShift{0%,100%{transform:translate(0)}25%{transform:translate(-3%,-8%)}50%{transform:translate(5%,3%)}75%{transform:translate(-7%,6%)}}
@keyframes pulseDot{0%,100%{transform:scale(1);opacity:1;box-shadow:0 0 0 0 rgba(164,210,130,0.5)}50%{transform:scale(1.2);opacity:0.85;box-shadow:0 0 0 8px rgba(164,210,130,0)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-33.333%)}}
@keyframes hintPulse{0%,100%{opacity:0.5}50%{opacity:1}}
@keyframes preloaderFill{0%{width:0}60%{width:80%}100%{width:100%}}
@keyframes scrollLine{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
@keyframes mobileIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes preloaderNameIn{from{opacity:0;letter-spacing:0.4em}to{opacity:1;letter-spacing:0.04em}}

/* ─── GRAIN ─── */
.grain{position:fixed;inset:-10%;pointer-events:none;z-index:9997;opacity:0.28;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");animation:grainShift 5s steps(8) infinite;mix-blend-mode:overlay}

/* ─── PRELOADER ─── */
.preloader{position:fixed;inset:0;z-index:10000;background:var(--bg);display:flex;align-items:center;justify-content:center}
.preloader-inner{display:flex;flex-direction:column;align-items:center;gap:22px}
.preloader-name{font-family:'Bebas Neue';font-size:28px;letter-spacing:0.04em;color:var(--cream);animation:preloaderNameIn 1.2s cubic-bezier(0.22,1,0.36,1)}
.preloader-name em{font-size:26px;color:var(--cream-dim);margin-right:4px}
.preloader-bar{width:180px;height:1px;background:rgba(255,255,255,0.08);overflow:hidden}
.preloader-fill{height:100%;background:var(--cream);animation:preloaderFill 2s cubic-bezier(0.22,1,0.36,1) forwards}
.preloader-tag{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.3em;color:var(--mid)}

/* ─── SCROLL PROGRESS ─── */
.scroll-prog-wrap{position:fixed;top:0;left:0;width:100%;height:2px;background:transparent;z-index:1002}
.scroll-prog{height:100%;background:linear-gradient(90deg,var(--cream-dim),var(--cream));transition:width 0.08s linear}

/* ─── PILL NAV ─── */
.pill-nav{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:1000;display:flex;align-items:center;gap:20px;padding:10px 24px;background:var(--glass-bg);backdrop-filter:blur(36px) saturate(1.8);-webkit-backdrop-filter:blur(36px) saturate(1.8);border:1px solid var(--glass-bd);border-top-color:var(--glass-bd-top);border-radius:999px;box-shadow:var(--glass-shadow);transition:opacity 0.4s,transform 0.4s}
.nav-brand{font-family:'Bebas Neue';font-size:20px;letter-spacing:0.04em;cursor:pointer;color:var(--cream);transition:opacity 0.2s}
.nav-brand:hover{opacity:0.7}
.nav-pills{display:flex;gap:4px}
.pill-btn{background:none;border:none;cursor:pointer;font-family:'DM Sans';font-size:13px;font-weight:500;color:var(--cream-dim);padding:6px 14px;border-radius:999px;transition:all 0.25s}
.pill-btn:hover{color:var(--cream);background:rgba(255,255,255,0.08)}
.nav-time{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--cream);font-weight:500;white-space:nowrap;letter-spacing:0.02em}

.resume-btn{position:fixed;top:16px;right:20px;z-index:1001;display:inline-flex;align-items:center;gap:6px;padding:10px 18px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:var(--cream);background:var(--glass-bg);backdrop-filter:blur(36px) saturate(1.8);-webkit-backdrop-filter:blur(36px) saturate(1.8);border:1px solid var(--glass-bd);border-top-color:var(--glass-bd-top);border-radius:999px;box-shadow:var(--glass-shadow);transition:all 0.3s;letter-spacing:0.02em;cursor:pointer}
.resume-btn:hover{background:var(--glass-bg-strong);border-color:var(--border-2);box-shadow:var(--glass-shadow-hover);transform:translateY(-2px)}

/* ─── MOBILE NAV ─── */
.mobile-nav{display:none;position:fixed;top:0;left:0;right:0;z-index:1000;padding:16px 24px;justify-content:space-between;align-items:center;background:linear-gradient(180deg,rgba(14,14,14,0.85),rgba(7,7,7,0.75));backdrop-filter:blur(36px) saturate(1.8);-webkit-backdrop-filter:blur(36px) saturate(1.8);border-bottom:1px solid var(--border);transition:opacity 0.4s}
.mob-btn{background:none;border:1px solid var(--border-2);border-radius:6px;padding:8px 14px;color:var(--cream);cursor:pointer;font-size:12px;font-family:'DM Sans';letter-spacing:0.08em}
.mobile-overlay{position:fixed;inset:0;z-index:999;background:rgba(7,7,7,0.97);backdrop-filter:blur(20px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px}
.mobile-link{background:none;border:none;cursor:pointer;font-family:'Bebas Neue';font-size:42px;color:var(--cream);letter-spacing:0.06em;text-transform:uppercase;opacity:0;animation:mobileIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards}

/* ══════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════ */
.hero{min-height:100vh;display:flex;flex-direction:column;padding:140px 40px 40px;position:relative;overflow:hidden;transition:opacity 0.1s linear,transform 0.1s linear;will-change:transform,opacity;z-index:5}
.hero-inner{flex:1;max-width:1400px;width:100%;margin:0 auto;display:flex;flex-direction:column;gap:36px;position:relative;z-index:2}

.hero-status{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;background:rgba(20,20,20,0.5);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:999px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.1em;color:var(--cream-dim);align-self:flex-start}
.hero-status em{font-size:13px;color:var(--cream);margin:0 2px;font-style:italic}
.status-dot{width:7px;height:7px;border-radius:50%;background:#a4d282;animation:pulseDot 2.2s ease-in-out infinite;display:inline-block}

.hero-title-wrap{overflow:visible}
.hero-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(64px,16vw,220px);line-height:0.85;letter-spacing:-0.02em;color:var(--cream);text-transform:uppercase;margin:0;display:flex;flex-direction:column;gap:0}
.htl-line{display:flex;overflow:hidden;align-items:baseline;gap:clamp(10px,2vw,28px)}
.htl-word{display:inline-block}

.hero-meta{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;margin-top:8px}
.hero-meta-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;flex:1;max-width:640px}
.hm-col{display:flex;flex-direction:column;gap:8px}
.hm-label{font-family:'Instrument Serif',serif;font-style:italic;font-size:14px;color:var(--cream-dim);letter-spacing:-0.01em}
.hm-val{font-family:'DM Sans';font-size:14px;color:var(--cream);font-weight:500;line-height:1.4}
.hero-globe-spacer{flex-shrink:0;width:clamp(200px,22vw,340px);height:clamp(200px,22vw,340px)}

.hero-ctas{display:flex;gap:14px;flex-wrap:wrap;margin-top:4px}
.btn-primary{padding:15px 30px;background:var(--cream);color:var(--dark);border:none;border-radius:999px;cursor:pointer;font-family:'DM Sans';font-size:14px;font-weight:600;transition:transform 0.2s cubic-bezier(0.22,1,0.36,1),box-shadow 0.3s;display:inline-flex;align-items:center;gap:8px;letter-spacing:0.02em}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(232,228,222,0.2)}
.btn-primary .arr{transition:transform 0.3s}
.btn-primary:hover .arr{transform:translateX(4px)}
.btn-ghost{padding:15px 30px;background:rgba(20,20,20,0.4);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);color:var(--cream);border:1px solid var(--border-2);border-radius:999px;cursor:pointer;font-family:'DM Sans';font-size:14px;font-weight:500;transition:all 0.3s;letter-spacing:0.02em}
.btn-ghost:hover{border-color:var(--cream-dim);background:rgba(30,30,30,0.5)}

/* ─── HERO FLY-IN (scroll-driven intro) ─── */
/* Content is hidden while the globe owns the screen, then gets "thrown" into place as the user scrolls.
   The --intro-prog / --intro-inv CSS vars are set on the Portfolio root. */
.hero-fly{will-change:transform,opacity;transition:none}
.hero-fly-tl    { transform: translate3d(calc(-32vw * var(--intro-inv, 1)), calc(-28vh * var(--intro-inv, 1)), 0) rotate(calc(-10deg * var(--intro-inv, 1))); opacity: var(--intro-prog, 1) }
.hero-fly-bl    { transform: translate3d(calc(-28vw * var(--intro-inv, 1)), calc(30vh * var(--intro-inv, 1)), 0) rotate(calc(6deg * var(--intro-inv, 1))); opacity: var(--intro-prog, 1) }
.hero-fly-br    { transform: translate3d(calc(32vw * var(--intro-inv, 1)), calc(24vh * var(--intro-inv, 1)), 0) rotate(calc(-6deg * var(--intro-inv, 1))); opacity: var(--intro-prog, 1) }
.hero-fly-down  { transform: translate3d(0, calc(30vh * var(--intro-inv, 1)), 0); opacity: var(--intro-prog, 1) }

/* Hero title just fades in during the second half of the intro — it's replaced visually by the .name-stage overlay until then */
.hero-title-fade{will-change:opacity;opacity:clamp(0, calc((var(--intro-prog, 1) - 0.55) * 2.4), 1)}

/* ─── NAME STAGE — fixed overlay that morphs from huge-center to left-aligned hero title position ─── */
.name-stage{
  position:fixed;top:0;left:0;z-index:6;pointer-events:none;
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(64px,16vw,220px);line-height:0.85;letter-spacing:-0.02em;
  color:var(--cream);text-transform:uppercase;
  display:flex;flex-direction:column;gap:0;
  will-change:transform,opacity;
  opacity:var(--intro-inv, 1);
  transform:
    translate3d(
      calc(40px + (50vw - 40px) * var(--intro-inv, 1)),
      calc(220px + (50vh - 220px) * var(--intro-inv, 1)),
      0
    )
    translate(
      calc(-50% * var(--intro-inv, 1)),
      calc(-50% * var(--intro-inv, 1))
    )
    scale(calc(1 + 0.28 * var(--intro-inv, 1)));
  transform-origin:center center;
  /* Strong dark halo so the name stays readable over both bright continents and dark oceans */
  text-shadow:
    0 6px 40px rgba(0,0,0,0.9),
    0 2px 14px rgba(0,0,0,0.75),
    0 0 2px rgba(0,0,0,0.5);
}
.name-stage .name-line{display:block}

/* ─── GLOBE STAGE (fixed, intro-driven) ─── */
.globe-stage{position:fixed;inset:0;z-index:2;pointer-events:none;display:flex;align-items:center;justify-content:center;transition:opacity 0.3s ease}
.globe-stage-inner{position:absolute;left:50%;top:50%;width:min(125vh,125vw);height:min(125vh,125vw);will-change:transform;transform-origin:center center}
.globe-stage-inner .globe-wrap{width:100%!important;height:100%!important;opacity:1!important}
/* Fallback rule for the hero-slot globe (kept for any stale markup) */
.globe-wrap{width:clamp(200px,22vw,340px);height:clamp(200px,22vw,340px);opacity:0.85}

.globe-intro-hint{position:absolute;bottom:44px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.35em;color:var(--cream-dim);text-transform:uppercase;transition:opacity 0.4s ease,color 0.3s ease;background:none;border:none;cursor:pointer;padding:8px 16px}
.globe-intro-hint:hover{color:var(--cream)}
.gih-line{display:inline-block;width:1px;height:40px;background:linear-gradient(180deg,transparent,var(--cream-dim));animation:scrollLine 2.4s ease-in-out infinite}

/* ─── HERO BOTTOM ─── */
.hero-bottom{position:relative;z-index:2;display:flex;flex-direction:column;gap:32px;padding-top:32px}
.hero-scroll-hint{display:inline-flex;align-items:center;gap:12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.3em;color:var(--cream-dim);text-transform:uppercase;background:none;border:none;padding:8px 4px;cursor:pointer;transition:color 0.3s ease,gap 0.3s ease}
.hero-scroll-hint:hover{color:var(--cream);gap:18px}
.hero-scroll-hint .scroll-arrow{font-size:14px;line-height:1;display:inline-block;animation:scrollArrowBob 2.2s ease-in-out infinite;letter-spacing:0;transform-origin:center}
@keyframes scrollArrowBob{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
.scroll-line{display:inline-block;width:1px;height:36px;background:var(--cream-dim);animation:scrollLine 2.5s ease-in-out infinite}
.hero-ticker{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:16px 0;margin:0 -40px}
.hero-ticker-track{display:flex;width:max-content;animation:ticker 50s linear infinite;gap:32px}
.ticker-item{font-family:'Bebas Neue';font-size:22px;letter-spacing:0.04em;color:var(--cream);text-transform:uppercase;display:inline-flex;align-items:center;gap:32px;white-space:nowrap}
.ticker-item em{font-family:'Bebas Neue';font-style:normal}
.hero-ticker:hover .hero-ticker-track,.footer-ticker:hover .footer-ticker-track{animation-play-state:paused}
.ticker-dot{color:var(--cream-dim);font-size:14px}

/* ══════════════════════════════════════════════
   SECTIONS
   ══════════════════════════════════════════════ */
.section{padding:130px 40px;max-width:1400px;margin:0 auto;position:relative;z-index:5}
.section-head{display:grid;grid-template-columns:80px 1fr;gap:32px;margin-bottom:64px;align-items:start}
.section-num{font-family:'Instrument Serif',serif;font-style:italic;font-size:18px;color:var(--cream-dim);padding-top:6px;letter-spacing:-0.01em}
.section-labels{display:flex;flex-direction:column;gap:16px}
.s-tag{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:var(--cream-dim)}
.s-head{font-family:'Bebas Neue',sans-serif;font-size:clamp(44px,7vw,88px);line-height:0.92;letter-spacing:-0.005em;text-transform:uppercase;color:var(--cream)}
.s-head em{font-family:'Instrument Serif',serif;font-style:italic;text-transform:none;font-size:0.88em;color:var(--cream-dim);font-weight:400;letter-spacing:-0.02em}
.s-head-big{font-family:'Bebas Neue',sans-serif;font-size:clamp(64px,11vw,160px);line-height:0.9;letter-spacing:-0.01em;text-transform:uppercase;color:var(--cream)}
.s-head-big em{font-family:'Instrument Serif',serif;font-style:italic;text-transform:none;font-size:0.82em;color:var(--cream-dim);font-weight:400}

/* About section — big editorial heading like the reference image */
.section-about{padding-top:160px}
.section-head-tall{margin-bottom:96px}
.about-head{font-size:clamp(72px,13vw,190px);line-height:0.88;letter-spacing:-0.015em}

/* ─── ABOUT ─── */
.about-grid{display:grid;grid-template-columns:1.1fr 0.9fr;gap:80px;align-items:start}
.about-text p{font-size:16px;color:var(--cream-dim);line-height:1.8;margin-bottom:24px;max-width:540px}
.about-text p em{font-size:17px;color:var(--cream)}
.counters{margin-top:44px;display:flex;gap:56px;flex-wrap:wrap}
.counter-item{display:flex;flex-direction:column;gap:6px}
.count-num{font-family:'Bebas Neue';font-size:52px;line-height:1;color:var(--cream);letter-spacing:0.01em}
.counter-label{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--mid);letter-spacing:0.18em;text-transform:uppercase}

.about-photo-wrap{position:relative}
.about-photo{border-radius:4px;overflow:hidden;border:1px solid var(--border);aspect-ratio:3/4;position:relative}
.about-photo img{width:100%;height:120%;object-fit:cover;filter:grayscale(30%) contrast(1.12) brightness(0.88);transition:transform 0.15s linear;will-change:transform}
.about-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 60%,rgba(0,0,0,0.4));pointer-events:none}
.photo-caption{position:absolute;bottom:-28px;left:0;right:0;display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--cream-dim);letter-spacing:0.08em;text-transform:uppercase;padding:0 4px}
.photo-caption em{font-family:'Instrument Serif',serif;font-style:italic;font-size:13px;text-transform:none;color:var(--cream)}

/* ─── SKILLS ─── */
.section-skills{padding:80px 0 120px}
.section-skills .section-head{padding:0 40px;max-width:1400px;margin:0 auto 48px}
.marquee-left,.marquee-right{overflow:hidden;margin-bottom:12px}
.marquee-track{display:flex;flex-wrap:nowrap;width:max-content;gap:14px;align-items:center}
.marquee-left .marquee-track{animation:marquee-left 50s linear infinite}
.marquee-right .marquee-track{animation:marquee-right 50s linear infinite}
.marquee-left:hover .marquee-track,.marquee-right:hover .marquee-track{animation-play-state:paused}
.marquee-item{flex:0 0 auto;padding:13px 32px;border:1px solid var(--border);border-radius:999px;font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--cream-dim);white-space:nowrap;transition:all 0.5s ease;background:var(--surface)}
.marquee-track:has(.marquee-item:hover) .marquee-item{opacity:0.3;border-color:var(--border);color:var(--mid)}
.marquee-track:has(.marquee-item:hover) .marquee-item:hover{opacity:1;color:var(--cream);border-color:rgba(232,228,222,0.4);background:rgba(232,228,222,0.08);box-shadow:0 0 24px rgba(232,228,222,0.12);transform:scale(1.08)}

/* ══════════════════════════════════════════════
   PROJECTS STACK CARDS
   ══════════════════════════════════════════════ */
.section-projects{padding:100px 40px 160px}
.stack-hint{display:flex;align-items:center;gap:12px;margin-bottom:32px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;color:var(--cream-dim);text-transform:uppercase}
.scroll-line-h{display:inline-block;width:40px;height:1px;background:var(--cream-dim)}

.stack-wrapper{position:relative}
.stack-wrap{padding:0}
.stack-card{
  background:linear-gradient(140deg,rgba(26,26,28,0.88),rgba(14,14,16,0.92));
  backdrop-filter:blur(28px) saturate(1.5);-webkit-backdrop-filter:blur(28px) saturate(1.5);
  border:1px solid var(--border-2);
  border-top-color:rgba(255,255,255,0.16);
  border-left-color:rgba(255,255,255,0.12);
  border-radius:20px;overflow:hidden;
  box-shadow:0 30px 80px rgba(0,0,0,0.55),0 6px 20px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.09),inset 0 -1px 0 rgba(0,0,0,0.35);
  transition:transform 0.12s linear,opacity 0.12s linear,filter 0.12s linear;
  will-change:transform,opacity,filter;
  position:relative;
}
.stack-card::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 120% 60% at 50% 0%,rgba(255,255,255,0.05),transparent 60%);pointer-events:none;z-index:1}
.stack-inner{display:grid;grid-template-columns:1fr 1fr;gap:0;min-height:min(78vh,620px);cursor:pointer;position:relative;z-index:2}
.stack-inner.flipped{grid-template-columns:1fr 1fr}
.stack-inner.flipped .stack-media{order:2}
.stack-inner.flipped .stack-body{order:1;border-left:none;border-right:1px solid var(--border)}

.stack-media{position:relative;overflow:hidden;background:var(--surface-2);min-height:400px;border-right:1px solid var(--border)}
.stack-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.8s cubic-bezier(0.22,1,0.36,1);will-change:transform}
.stack-inner:hover .stack-media img{transform:scale(1.04)}
.stack-media-blank{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
.stack-media-blank span{font-family:'Bebas Neue';font-size:clamp(80px,8vw,120px);color:rgba(255,255,255,0.08)}
.stack-media-grad{position:absolute;inset:0;background:linear-gradient(135deg,transparent 60%,rgba(0,0,0,0.35));pointer-events:none}

.stack-body{padding:48px 52px;display:flex;flex-direction:column;justify-content:center;gap:18px}
.stack-top-row{display:flex;justify-content:space-between;align-items:center}
.stack-num{font-family:'Instrument Serif',serif;font-style:italic;font-size:18px;color:var(--cream-dim);letter-spacing:-0.01em}
.stack-period{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--mid);letter-spacing:0.1em}
.stack-tag{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--cream-dim);margin-top:-4px}
.stack-title{font-family:'Bebas Neue';font-size:clamp(36px,4.2vw,58px);line-height:0.96;letter-spacing:-0.005em;color:var(--cream);text-transform:uppercase;margin:4px 0}
.stack-desc{font-size:15px;color:var(--cream-dim);line-height:1.65;max-width:480px}
.stack-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.stack-chip{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--cream-dim);padding:4px 10px;border:1px solid var(--border);border-radius:4px;background:rgba(255,255,255,0.02)}
.stack-cta{display:inline-flex;align-items:center;gap:10px;margin-top:16px;font-family:'DM Sans';font-size:13px;font-weight:600;color:var(--cream);letter-spacing:0.04em;border-bottom:1px solid var(--cream-dim);padding-bottom:4px;width:fit-content;transition:gap 0.3s,border-color 0.3s}
.stack-inner:hover .stack-cta{gap:14px;border-color:var(--cream)}
.stack-arrow{transition:transform 0.3s cubic-bezier(0.22,1,0.36,1);display:inline-block}
.stack-inner:hover .stack-arrow{transform:translate(3px,-3px)}

/* ══════════════════════════════════════════════
   EXPERIENCE
   ══════════════════════════════════════════════ */
.exp-list{display:flex;flex-direction:column;gap:8px}
.exp-card-v2{display:grid;grid-template-columns:200px 1fr;gap:48px;padding:32px 0;border-top:1px solid var(--border);transition:background 0.3s,padding-left 0.4s cubic-bezier(0.22,1,0.36,1)}
.exp-card-v2:hover{padding-left:20px}
.exp-card-v2:last-child{border-bottom:1px solid var(--border)}
.exp-period{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--mid);letter-spacing:0.06em}
.exp-role-line{display:flex;align-items:baseline;gap:14px;margin-bottom:12px;flex-wrap:wrap}
.exp-role-line h4{font-family:'Bebas Neue';font-size:30px;letter-spacing:0.01em;color:var(--cream);font-weight:400;text-transform:uppercase}
.exp-sep{color:var(--cream-dim);font-size:18px}
.exp-org{font-family:'Instrument Serif',serif;font-style:italic;font-size:22px;color:var(--cream-dim)}
.exp-body p{font-size:15px;color:var(--cream-dim);line-height:1.7;max-width:700px}

/* ══════════════════════════════════════════════
   CONTACT
   ══════════════════════════════════════════════ */
.section-contact{padding:120px 40px 80px}
.contact-grid-v2{display:grid;grid-template-columns:1.1fr 0.9fr;gap:40px;align-items:stretch}
.contact-cta-v2{display:flex;align-items:center;gap:20px;padding:36px;background:var(--glass-bg);backdrop-filter:blur(28px) saturate(1.6);-webkit-backdrop-filter:blur(28px) saturate(1.6);border:1px solid var(--glass-bd);border-top-color:var(--glass-bd-top);border-left-color:rgba(255,255,255,0.12);border-radius:18px;text-decoration:none;color:var(--cream);box-shadow:var(--glass-shadow);transition:all 0.4s cubic-bezier(0.22,1,0.36,1);height:100%;position:relative;overflow:hidden}
.contact-cta-v2::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 150% 80% at 20% -20%,rgba(255,255,255,0.08),transparent 50%);pointer-events:none}
.contact-cta-v2:hover{border-color:var(--border-2);transform:translateY(-4px);box-shadow:var(--glass-shadow-hover)}
.cta-ico-wrap{width:56px;height:56px;border-radius:14px;background:rgba(232,228,222,0.06);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--cream);border:1px solid rgba(255,255,255,0.06)}
.cta-body{flex:1}
.cta-label{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--cream-dim);margin-bottom:6px}
.cta-val{font-family:'DM Sans';font-size:20px;font-weight:500;color:var(--cream)}
.cta-arrow{color:var(--cream-dim);transition:transform 0.4s cubic-bezier(0.22,1,0.36,1)}
.contact-cta-v2:hover .cta-arrow{transform:translate(4px,-4px);color:var(--cream)}

.contact-socials{display:flex;flex-direction:column;gap:10px;height:100%}
.contact-link-v2{display:flex;align-items:center;gap:16px;padding:18px 22px;background:var(--glass-bg);backdrop-filter:blur(24px) saturate(1.6);-webkit-backdrop-filter:blur(24px) saturate(1.6);border:1px solid var(--glass-bd);border-top-color:var(--glass-bd-top);border-radius:12px;text-decoration:none;color:var(--cream);box-shadow:0 6px 24px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.06);transition:all 0.35s cubic-bezier(0.22,1,0.36,1);flex:1}
.contact-link-v2:hover{border-color:var(--border-2);transform:translateY(-2px) translateX(4px);box-shadow:0 12px 40px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1)}
.cl-ico{width:38px;height:38px;border-radius:10px;background:rgba(232,228,222,0.04);display:flex;align-items:center;justify-content:center;color:var(--cream-dim);flex-shrink:0;border:1px solid var(--border)}
.contact-link-v2:hover .cl-ico{color:var(--cream)}
.cl-body{flex:1}
.cl-label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:var(--mid)}
.cl-val{font-family:'DM Sans';font-size:15px;font-weight:500;color:var(--cream);margin-top:3px}
.cl-arrow{color:var(--mid);opacity:0.6;transition:all 0.3s}
.contact-link-v2:hover .cl-arrow{color:var(--cream);opacity:1;transform:translate(3px,-3px)}

/* ══════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════ */
.footer-v2{border-top:1px solid var(--border);padding:0 0 32px;overflow:hidden;position:relative;z-index:1}
.footer-huge{padding:60px 40px 40px;max-width:1400px;margin:0 auto;font-family:'Bebas Neue';font-size:clamp(80px,18vw,280px);line-height:0.88;letter-spacing:-0.01em;color:var(--cream);text-transform:uppercase;text-align:left}
.footer-huge em{font-family:'Instrument Serif',serif;font-style:italic;color:var(--cream-dim);text-transform:none;font-size:0.82em;font-weight:400}
.footer-ticker{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:14px 0;margin-bottom:24px}
.footer-ticker-track{display:flex;width:max-content;animation:ticker 55s linear infinite;gap:32px}
.footer-meta{padding:0 40px;max-width:1400px;margin:0 auto;display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--mid);letter-spacing:0.08em;flex-wrap:wrap;gap:20px}

/* ══════════════════════════════════════════════
   PROJECT DETAIL
   ══════════════════════════════════════════════ */
.project-detail{min-height:100vh;background:var(--bg);color:var(--cream);padding:120px 40px 80px;position:relative;z-index:1}
.pd-inner{max-width:1000px;margin:0 auto}
.pd-back{display:flex;align-items:center;gap:10px;background:none;border:none;color:var(--cream-dim);cursor:pointer;font-family:'DM Sans';font-size:14px;margin-bottom:48px;transition:color 0.3s,gap 0.3s;padding:8px 0}
.pd-back:hover{color:var(--cream);gap:14px}
.pd-meta{display:flex;align-items:center;gap:10px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--cream-dim);letter-spacing:0.15em;margin-bottom:16px;text-transform:uppercase}
.pd-sep{color:var(--mid)}
.pd-title{font-family:'Bebas Neue';font-size:clamp(48px,8vw,96px);line-height:0.94;letter-spacing:-0.005em;margin-bottom:48px;text-transform:uppercase}
.pd-hero{width:100%;aspect-ratio:16/9;border-radius:18px;overflow:hidden;margin-bottom:60px;border:1px solid var(--border);background:var(--surface)}
.pd-hero img{width:100%;height:100%;object-fit:cover;display:block}
.pd-hero-blank{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue';font-size:24px;color:rgba(255,255,255,0.3)}
.pd-grid{display:grid;grid-template-columns:1fr 280px;gap:60px;margin-bottom:60px}
.pd-sec-head{font-family:'Bebas Neue';font-size:28px;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.01em}
.pd-sec-head.pd-small{font-size:20px}
.pd-prose{font-size:16px;color:var(--cream-dim);line-height:1.8}
.pd-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px}
.pd-chip{display:inline-block;padding:5px 14px;border:1px solid var(--border);border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--cream-dim)}
.pd-link{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:var(--cream);color:var(--dark);border-radius:8px;text-decoration:none;font-family:'DM Sans';font-size:14px;font-weight:600;transition:transform 0.3s,box-shadow 0.3s}
.pd-link:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(232,228,222,0.18)}
.pd-gallery{display:flex;flex-direction:column;gap:24px}
.pd-shot{width:100%;border-radius:14px;overflow:hidden;border:1px solid var(--border)}
.pd-shot img{width:100%;display:block}
.pd-empty{padding:60px;border:1px dashed var(--border);border-radius:12px;text-align:center;color:var(--mid)}
.pd-empty p{font-family:'JetBrains Mono',monospace;font-size:13px}

/* ══════════════════════════════════════════════
   RESUME MODAL
   ══════════════════════════════════════════════ */
.resume-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;animation:fadeUp 0.35s ease;padding:20px}
.resume-modal{width:100%;max-width:900px;height:88vh;background:var(--surface);border:1px solid var(--border-2);border-radius:14px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.6)}
.resume-header{display:flex;justify-content:space-between;align-items:center;padding:16px 22px;border-bottom:1px solid var(--border)}
.resume-title{font-family:'Bebas Neue';font-size:20px;letter-spacing:0.04em;color:var(--cream)}
.resume-title em{color:var(--cream-dim);font-size:18px}
.resume-actions{display:flex;gap:10px;align-items:center}
.resume-dl{font-family:'DM Sans';font-size:12px;color:var(--cream-dim);text-decoration:none;display:inline-flex;align-items:center;gap:4px;padding:7px 14px;border:1px solid var(--border-2);border-radius:999px;transition:all 0.2s}
.resume-dl:hover{color:var(--cream);border-color:var(--cream-dim)}
.resume-close{background:none;border:none;color:var(--cream-dim);font-size:26px;cursor:pointer;padding:0 4px;line-height:1;transition:color 0.2s}
.resume-close:hover{color:var(--cream)}
.resume-body{flex:1;overflow:hidden}
.resume-body iframe{width:100%;height:100%;border:none}

/* ══════════════════════════════════════════════
   MUSIC PLAYER (upgraded liquid glass)
   ══════════════════════════════════════════════ */
.music-wrap{position:fixed;bottom:20px;right:20px;z-index:998;display:flex;flex-direction:column;align-items:flex-end;gap:6px}
.mp-hint{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--cream-dim);letter-spacing:0.08em;padding:0 8px;animation:hintPulse 2.5s ease-in-out infinite}
.music-player{display:flex;align-items:center;gap:10px;padding:8px 12px 8px 8px;background:var(--glass-bg);backdrop-filter:blur(36px) saturate(1.8);-webkit-backdrop-filter:blur(36px) saturate(1.8);border:1px solid var(--glass-bd);border-top-color:var(--glass-bd-top);border-radius:14px;max-width:280px;box-shadow:var(--glass-shadow)}
.mp-cover{width:36px;height:36px;border-radius:8px;background:var(--surface) center/cover no-repeat;flex-shrink:0;cursor:pointer;position:relative;overflow:hidden}
.mp-cover:hover .mp-play-icon{opacity:1}
.mp-play-icon{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);opacity:0;transition:opacity 0.2s}
.mp-info{flex:1;min-width:0;overflow:hidden}
.mp-title{font-family:'DM Sans';font-size:11px;color:var(--cream);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3}
.mp-artist{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--mid);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3}
.mp-progress{width:100%;height:2px;background:var(--border);border-radius:1px;margin-top:4px;cursor:pointer;position:relative}
.mp-progress-fill{height:100%;background:var(--cream-dim);border-radius:1px;transition:width 0.3s linear}
.mp-controls{display:flex;align-items:center;gap:2px;flex-shrink:0}
.mp-btn{background:none;border:none;cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;opacity:0.6;transition:opacity 0.2s}
.mp-btn:hover{opacity:1}
.mp-vol-wrap{position:absolute;bottom:100%;right:0;margin-bottom:8px;padding:8px 12px;background:rgba(18,18,18,0.9);backdrop-filter:blur(20px);border:1px solid var(--border-2);border-radius:8px}
.mp-vol-slider{-webkit-appearance:none;appearance:none;width:80px;height:3px;background:var(--border-2);border-radius:2px;outline:none}
.mp-vol-slider::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:10px;border-radius:50%;background:var(--cream);cursor:pointer}

/* ─── BACK TO TOP ─── */
.back-to-top{position:fixed;bottom:24px;left:24px;z-index:998;width:40px;height:40px;border-radius:50%;background:var(--glass-bg);backdrop-filter:blur(32px) saturate(1.7);-webkit-backdrop-filter:blur(32px) saturate(1.7);border:1px solid var(--glass-bd);border-top-color:var(--glass-bd-top);box-shadow:var(--glass-shadow);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.35s cubic-bezier(0.22,1,0.36,1)}
.back-to-top:hover{background:var(--glass-bg-strong);border-color:var(--border-2);transform:translateY(-3px);box-shadow:var(--glass-shadow-hover)}

/* ══════════════════════════════════════════════
   MOBILE / RESPONSIVE
   Goal: keep the desktop intro (globe + moon + name + fly-in) on mobile too,
   just rescaled & repositioned for portrait viewports. Desktop CSS above is unchanged.
   ══════════════════════════════════════════════ */

/* TABLET / large phones (≤968px) — keep intro, tighten layout. */
@media(max-width:968px){
  .hero{padding:120px 24px 40px}
  .hero-meta{flex-direction:column;align-items:flex-start;gap:32px}
  .hero-meta-grid{grid-template-columns:repeat(3,1fr);gap:20px;width:100%}
  .hero-globe-col,.hero-globe-spacer{display:none!important}
  .hero-ticker{margin:0 -24px}
  .about-grid{grid-template-columns:1fr!important;gap:60px}
  .about-photo{aspect-ratio:4/5;max-width:480px;margin:0 auto}
  .stack-inner{grid-template-columns:1fr!important;min-height:auto}
  .stack-inner.flipped .stack-body{order:2;border-right:none;border-top:1px solid var(--border)}
  .stack-inner.flipped .stack-media{order:1}
  .stack-media{min-height:340px;border-right:none;border-bottom:1px solid var(--border)}
  .stack-body{padding:32px 28px}
  .section-head{grid-template-columns:60px 1fr;gap:16px;margin-bottom:40px}
  .section{padding:90px 24px}
  .section-skills{padding:60px 0 90px}
  .section-skills .section-head{padding:0 24px}
  .section-projects{padding:90px 24px 120px}
  .exp-card-v2{grid-template-columns:1fr;gap:12px;padding:24px 0}
  .exp-card-v2:hover{padding-left:8px}
  .contact-grid-v2{grid-template-columns:1fr;gap:24px}
  .footer-huge{padding:48px 24px 32px}
  .footer-meta{padding:0 24px}
  /* Globe stays — slightly smaller container so it doesn't overflow narrower viewports */
  .globe-stage-inner{width:min(110vh,110vw);height:min(110vh,110vw)}
}

@media(max-width:640px){
  .hero-status{font-size:10px;padding:7px 12px}
  .counters{gap:32px}
  .pd-grid{grid-template-columns:1fr;gap:40px}
}

/* PHONE (≤768px) — keep intro globe + moon + name reveal, just retuned for portrait */
@media(max-width:768px){
  .pill-nav{display:none!important}
  .mobile-nav{display:flex!important}

  /* Resume button — kept, just compacted into top-right */
  .resume-btn{
    top:12px;right:14px;
    padding:8px 14px;font-size:11px;letter-spacing:0.04em;
  }
  .resume-btn .arr{display:none}

  /* Hero text scales down for portrait */
  .hero{padding:96px 20px 32px}
  .hero-inner{gap:28px}
  .hero-title{font-size:clamp(64px,22vw,140px);line-height:0.86}
  .hero-meta-grid{grid-template-columns:1fr 1fr;gap:18px 24px}
  .hm-label{font-size:13px}
  .hm-val{font-size:13px}
  .hero-status{font-size:10px;padding:7px 14px;letter-spacing:0.08em}
  .hero-status em{font-size:12px}
  .hero-ctas{gap:10px;width:100%}
  .hero-ctas > *{flex:1}
  .btn-primary,.btn-ghost{padding:14px 22px;font-size:13px;width:100%;justify-content:center}

  /* Globe stage — sized for portrait so it doesn't get cropped sideways */
  .globe-stage-inner{
    width:min(140vw,90vh);
    height:min(140vw,90vh);
  }

  /* Name stage tuned for portrait. Settles to 20px from left, 25vh from top. */
  .name-stage{
    font-size:clamp(64px,22vw,140px);
    transform:
      translate3d(
        calc(20px + (50vw - 20px) * var(--intro-inv, 1)),
        calc(25vh + (50vh - 25vh) * var(--intro-inv, 1)),
        0
      )
      translate(
        calc(-50% * var(--intro-inv, 1)),
        calc(-50% * var(--intro-inv, 1))
      )
      scale(calc(1 + 0.15 * var(--intro-inv, 1)));
    text-shadow:
      0 4px 28px rgba(0,0,0,0.95),
      0 2px 10px rgba(0,0,0,0.85),
      0 0 2px rgba(0,0,0,0.6);
  }

  /* Hero-fly distances tightened so content doesn't fly all the way off-screen on a phone */
  .hero-fly-tl    { transform: translate3d(calc(-22vw * var(--intro-inv, 1)), calc(-18vh * var(--intro-inv, 1)), 0) rotate(calc(-6deg * var(--intro-inv, 1))); opacity: var(--intro-prog, 1) }
  .hero-fly-bl    { transform: translate3d(calc(-18vw * var(--intro-inv, 1)), calc(20vh * var(--intro-inv, 1)), 0) rotate(calc(4deg * var(--intro-inv, 1))); opacity: var(--intro-prog, 1) }
  .hero-fly-br    { transform: translate3d(calc(22vw * var(--intro-inv, 1)), calc(18vh * var(--intro-inv, 1)), 0) rotate(calc(-4deg * var(--intro-inv, 1))); opacity: var(--intro-prog, 1) }
  .hero-fly-down  { transform: translate3d(0, calc(20vh * var(--intro-inv, 1)), 0); opacity: var(--intro-prog, 1) }

  /* Section heads — keep editorial feel but smaller */
  .section{padding:80px 20px}
  .section-head{grid-template-columns:50px 1fr;gap:14px;margin-bottom:36px}
  .section-num{font-size:14px}
  .s-tag{font-size:10px;letter-spacing:0.18em}
  .s-head{font-size:clamp(40px,11vw,72px)}
  .s-head-big{font-size:clamp(52px,15vw,110px)}
  .about-head{font-size:clamp(56px,16vw,120px)}
  .section-about{padding-top:100px}
  .section-head-tall{margin-bottom:48px}

  /* About */
  .about-text p{font-size:15px;line-height:1.7}
  .counters{gap:36px;margin-top:32px}
  .count-num{font-size:42px}
  .counter-label{font-size:9px;letter-spacing:0.16em}
  .about-photo-wrap{margin-top:20px}
  .about-photo{aspect-ratio:4/5;max-width:none}
  .photo-caption{font-size:10px;bottom:-22px}
  .photo-caption em{font-size:12px}

  /* Skills marquee */
  .section-skills{padding:50px 0 80px}
  .section-skills .section-head{padding:0 20px;margin-bottom:32px}
  .marquee-item{padding:11px 22px;font-size:12px}
  .marquee-left .marquee-track,.marquee-right .marquee-track{animation-duration:38s}

  /* Stack cards — vertical, bigger media */
  .section-projects{padding:70px 20px 100px}
  .stack-hint{font-size:9px;letter-spacing:0.16em;margin-bottom:24px}
  .scroll-line-h{width:28px}
  .stack-wrap{position:relative!important;top:auto!important;margin-bottom:32px}
  .stack-card{transform:none!important;opacity:1!important;filter:none!important;border-radius:16px}
  .stack-media{aspect-ratio:16/10;min-height:0}
  .stack-media-blank span{font-size:80px}
  .stack-body{padding:28px 24px;gap:14px}
  .stack-num{font-size:15px}
  .stack-period{font-size:10px;letter-spacing:0.08em}
  .stack-tag{font-size:10px}
  .stack-title{font-size:clamp(28px,7vw,42px)}
  .stack-desc{font-size:14px}
  .stack-chip{font-size:10px;padding:3px 8px}
  .stack-cta{font-size:12px}

  /* Experience */
  .exp-card-v2{padding:22px 0;gap:8px}
  .exp-card-v2:hover{padding-left:0}
  .exp-period{font-size:11px}
  .exp-role-line h4{font-size:24px}
  .exp-org{font-size:18px}
  .exp-body p{font-size:14px;line-height:1.6}

  /* Contact */
  .section-contact{padding:80px 20px 60px}
  .contact-grid-v2{gap:14px}
  .contact-cta-v2{padding:24px;gap:14px}
  .cta-ico-wrap{width:46px;height:46px;border-radius:11px}
  .cta-label{font-size:10px;letter-spacing:0.1em}
  .cta-val{font-size:16px}
  .contact-link-v2{padding:14px 18px;gap:14px}
  .cl-ico{width:34px;height:34px;border-radius:9px}
  .cl-val{font-size:14px}

  /* Footer */
  .footer-huge{padding:40px 20px 28px;font-size:clamp(64px,22vw,160px)}
  .footer-meta{padding:0 20px;font-size:10px;flex-direction:column;align-items:flex-start;gap:8px}

  /* Hero ticker */
  .hero-ticker{margin:0 -20px;padding:14px 0}
  .ticker-item{font-size:18px;gap:24px}
  .hero-ticker-track,.footer-ticker-track{gap:24px}

  /* Music + back-to-top */
  .music-wrap{bottom:14px;right:14px}
  .music-player{max-width:220px;padding:6px 10px 6px 6px;gap:8px;border-radius:12px}
  .mp-cover{width:34px;height:34px;border-radius:7px}
  .mp-title{font-size:10px}
  .mp-artist{font-size:8px}
  .mp-hint{display:none}
  .back-to-top{bottom:16px;left:16px;width:38px;height:38px}

  /* Project detail */
  .project-detail{padding:90px 20px 60px}
  .pd-back{font-size:13px;margin-bottom:32px}
  .pd-meta{font-size:10px;letter-spacing:0.12em}
  .pd-title{font-size:clamp(36px,11vw,64px);margin-bottom:32px}
  .pd-hero{aspect-ratio:4/3;border-radius:14px;margin-bottom:40px}
  .pd-grid{grid-template-columns:1fr;gap:36px;margin-bottom:40px}
  .pd-sec-head{font-size:24px}
  .pd-prose{font-size:15px}

  /* Resume modal — full-screen on phone */
  .resume-overlay{padding:0}
  .resume-modal{width:100%;height:100vh;border-radius:0;border:none;max-width:none}
  .resume-header{padding:14px 18px}
  .resume-title{font-size:18px}

  /* Touch feedback replaces hover */
  .stack-inner:hover .stack-media img{transform:none}
  .stack-inner:active .stack-card{transform:scale(0.99)}
  .btn-primary:hover,.btn-ghost:hover,.contact-cta-v2:hover,.contact-link-v2:hover{transform:none}
  .btn-primary:active{transform:scale(0.97)}
  .btn-ghost:active{transform:scale(0.97)}
  .contact-cta-v2:active,.contact-link-v2:active{transform:scale(0.99)}
  .mag{transform:none!important;transition:none!important}

  /* Tap targets */
  .pill-btn,.mp-btn,.mob-btn,.pd-back,.resume-close{min-height:44px}
  .mp-btn{padding:8px}

  /* Cursor effects off on touch */
  body{cursor:auto!important}
  #cursor-spot,#cursor-trail{display:none!important}
}

/* SMALL PHONES (≤480px) — final tighten */
@media(max-width:480px){
  .hero{padding:88px 16px 28px}
  .hero-title{font-size:clamp(56px,24vw,120px)}
  .section{padding:64px 16px}
  .section-skills .section-head{padding:0 16px}
  .section-projects{padding-left:16px;padding-right:16px}
  .section-contact{padding-left:16px;padding-right:16px}
  .footer-huge{padding:32px 16px 24px}
  .footer-meta{padding:0 16px}
  .stack-body{padding:22px 18px}
  .pd-title{font-size:clamp(32px,10vw,56px)}
  .ticker-item{font-size:16px}
  .marquee-item{padding:9px 18px;font-size:11px}
  .name-stage{font-size:clamp(56px,22vw,120px)}
  .nav-brand{font-size:18px}
  .mob-btn{padding:7px 12px;font-size:11px}
  .counters{gap:24px 32px}
  .count-num{font-size:36px}
}

/* TOUCH-DEVICE GENERAL (any size with touch input) */
@media(hover:none) and (pointer:coarse){
  .stack-inner:hover .stack-media img{transform:none}
  .marquee-track:has(.marquee-item:hover) .marquee-item{opacity:1;color:var(--cream-dim)}
  .marquee-track:has(.marquee-item:hover) .marquee-item:hover{transform:none;box-shadow:none}
  .mag{transform:none!important}
  .hero-ticker:hover .hero-ticker-track,.footer-ticker:hover .footer-ticker-track{animation-play-state:running}
}

@media(min-width:769px){.mobile-nav{display:none!important}}
`;