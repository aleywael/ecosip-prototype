import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDownRight, ArrowLeft, ArrowRight, Bell, Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, Coffee, Gift, Heart, History, Home, Info, Leaf, MapPin, Minus, Plus, QrCode, Recycle, RotateCcw, ScanLine, Search, Settings2, ShieldCheck, Sparkles, Ticket, Wallet, X, BarChart3, Users, ShoppingBag, ExternalLink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './style.css';

type Page = 'home'|'scan'|'rewards'|'activity'|'profile'|'admin';
type Category = 'All'|'Coffee'|'Desserts'|'Drinks'|'Food';
type Tx = { id:string; type:'deposit'|'redeem'; label:string; points:number; date:string; bottles?:number };
type Voucher = {id:string;label:string;partner:string;code:string;points:number;date:string};
type Data = {points:number;bottles:number;sessions:number;transactions:Tx[];vouchers:Voucher[]};
type Reward = {id:string;name:string;partner:string;category:Exclude<Category,'All'>;price:number;photo:string;emoji:string;description:string;accent:string};

const STORE='ecosip_mobile_demo_v2';
const initial:Data={points:120,bottles:18,sessions:3,transactions:[],vouchers:[]};
// Photographs are representative Unsplash images, not official café product photos.
const rewards:Reward[]=[
 {id:'latte',name:'Signature Latte',partner:'TBS (example)',category:'Coffee',price:65,photo:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=82&fit=crop',emoji:'☕',description:'A warm coffee break after class',accent:'#e8d0b9'},
 {id:'croissant',name:'Butter Croissant',partner:'La Poire (example)',category:'Desserts',price:55,photo:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=82&fit=crop',emoji:'🥐',description:'Golden, flaky and freshly baked',accent:'#e9d6b1'},
 {id:'cheesecake',name:'Cheesecake Slice',partner:'La Poire (example)',category:'Desserts',price:95,photo:'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900&q=82&fit=crop',emoji:'🍰',description:'A sweet reward for your effort',accent:'#f0d6d3'},
 {id:'iced',name:'Iced Coffee',partner:'TBS (example)',category:'Coffee',price:75,photo:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&q=82&fit=crop',emoji:'🧋',description:'An easy afternoon refresh',accent:'#cfdbce'},
 {id:'juice',name:'Fresh Orange Juice',partner:'Campus café (example)',category:'Drinks',price:70,photo:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=900&q=82&fit=crop',emoji:'🍊',description:'Fresh and bright between lectures',accent:'#f4d3a3'},
 {id:'sandwich',name:'Lunch Sandwich',partner:'TBS (example)',category:'Food',price:120,photo:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=900&q=82&fit=crop',emoji:'🥪',description:'A little fuel for your study day',accent:'#e9d4b7'}
];
const categoryList:Category[]=['All','Coffee','Desserts','Drinks','Food'];
const nav:{page:Page;label:string;icon:LucideIcon}[]=[{page:'home',label:'Home',icon:Home},{page:'scan',label:'Recycle',icon:QrCode},{page:'rewards',label:'Rewards',icon:Gift},{page:'activity',label:'Activity',icon:History},{page:'profile',label:'Me',icon:Users}];
function dateText(s:string){return new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
function Photo({reward,className=''}:{reward:Reward;className?:string}){const [failed,setFailed]=useState(false);return <div className={`photo ${className}`} style={{backgroundColor:reward.accent}}>{failed?<div className="photo-fallback">{reward.emoji}</div>:<img loading="lazy" src={reward.photo} alt={`Illustrative photograph for ${reward.name}`} onError={()=>setFailed(true)}/>}</div>}
function App(){
 const [page,setPage]=useState<Page>('home');
 const [data,setData]=useState<Data>(()=>{try{const s=localStorage.getItem(STORE);return s?{...initial,...JSON.parse(s)}:initial}catch{return initial}});
 const [category,setCategory]=useState<Category>('All');
 const [search,setSearch]=useState('');
 const [step,setStep]=useState<'intro'|'connected'|'done'>('intro');
 const [quantity,setQuantity]=useState(3);
 const [lastEarned,setLastEarned]=useState(0);
 const [selected,setSelected]=useState<Reward|null>(null);
 const [voucher,setVoucher]=useState<Voucher|null>(null);
 const [message,setMessage]=useState('');
 const [saved,setSaved]=useState<string[]>([]);
 useEffect(()=>{localStorage.setItem(STORE,JSON.stringify(data))},[data]);
 useEffect(()=>{if(!message)return;const id=window.setTimeout(()=>setMessage(''),3500);return()=>window.clearTimeout(id)},[message]);
 const go=(p:Page)=>{setPage(p);window.scrollTo({top:0,behavior:'smooth'})};
 const shown=useMemo(()=>rewards.filter(r=>(category==='All'||category===r.category)&&`${r.name} ${r.partner}`.toLowerCase().includes(search.toLowerCase())),[category,search]);
 const deposit=()=>{const earned=quantity*10;setLastEarned(earned);setData(d=>({...d,points:d.points+earned,bottles:d.bottles+quantity,sessions:d.sessions+1,transactions:[{id:crypto.randomUUID(),type:'deposit',label:`${quantity} PET bottles deposited`,points:earned,date:new Date().toISOString(),bottles:quantity},...d.transactions]}));setStep('done');setMessage(`+${earned} demo points earned`)};
 const redeem=()=>{if(!selected)return;if(data.points<selected.price){setMessage('Not enough points for this reward');return}const v:Voucher={id:crypto.randomUUID(),label:selected.name,partner:selected.partner,code:`ECO-${Math.random().toString(36).slice(2,8).toUpperCase()}`,points:selected.price,date:new Date().toISOString()};setData(d=>({...d,points:d.points-selected.price,vouchers:[v,...d.vouchers],transactions:[{id:crypto.randomUUID(),type:'redeem',label:selected.name,points:-selected.price,date:v.date},...d.transactions]}));setSelected(null);setVoucher(v);setMessage('Sample voucher created')};
 const toggleSaved=(id:string)=>setSaved(v=>v.includes(id)?v.filter(i=>i!==id):[...v,id]);
 return <div className="app-stage"><div className="desktop-decor deco-one"/><div className="desktop-decor deco-two"/>
  <div className="desktop-intro"><div className="intro-mark"><Leaf size={23}/></div><div className="intro-wordmark">ecosip<span>.</span></div><h1>A greener campus,<br/><em>one bottle at a time.</em></h1><p>Explore the EcoSip mobile experience — a proposed BUE recycling and rewards pilot.</p><div className="intro-pill"><Sparkles size={15}/> Interactive mobile prototype</div><div className="intro-caption">A student project concept · Not affiliated with example cafés</div></div>
  <div className="phone-frame"><div className="app-header"><button className="brand" onClick={()=>go('home')} aria-label="EcoSip home"><span className="brand-leaf"><Leaf size={18}/></span><span>eco<span>sip</span><b>.</b></span></button><div className="header-right"><span className="demo-badge">DEMO</span><button className="icon-circle" aria-label="About the demo" onClick={()=>setMessage('Prototype: QR, points and rewards are simulated. Example cafés are not partners.')}><CircleHelp size={19}/></button><button className="profile-circle" aria-label="Profile" onClick={()=>go('profile')}>ES</button></div></div>
  <div className="screen" key={page}>
  {page==='home'&&<>
    <div className="greeting"><div><div className="tiny-label"><span className="tiny-dot"/> A GREENER BUE STARTS HERE</div><h1>Hey, eco hero <span>✳</span></h1><p>Good things grow from small actions.</p></div><span className="sun-emoji">🌿</span></div>
    <section className="home-hero"><div className="hero-shine"/><div className="hero-copy"><span className="hero-overline"><Sparkles size={12}/> YOUR NEXT GOOD DEED</span><h2>Recycle.<br/>Earn.<br/><em>Enjoy.</em></h2><p>Turn empty bottles into your favourite campus treats.</p><button className="hero-button" onClick={()=>{setStep('intro');go('scan')}}>Start recycling <ArrowRight size={18}/></button></div><div className="hero-art"><span className="hero-ring ring-1"/><span className="hero-ring ring-2"/><div className="hero-bottle"><div className="hero-cap"/><div className="hero-b-neck"/><div className="hero-b-body"><Recycle size={49}/></div></div><div className="hero-star star-a">✦</div><div className="hero-star star-b">✳</div></div></section>
    <div className="impact-section-head"><h3>Your impact so far</h3><span>DEMO DATA</span></div>
    <div className="impact-grid"><div className="impact-card points"><div className="impact-icon"><Sparkles size={19}/></div><strong>{data.points}</strong><span>Points available</span></div><div className="impact-card bottles"><div className="impact-icon"><Recycle size={19}/></div><strong>{data.bottles}</strong><span>Bottles recycled</span></div></div>
    <div className="section-heading"><div><h3>Little rewards, big smiles</h3><p>Spend your points on something good</p></div><button className="see-all" onClick={()=>go('rewards')}>See all <ArrowRight size={15}/></button></div>
    <div className="featured-row">{rewards.slice(0,2).map(r=><button className="featured" key={r.id} onClick={()=>setSelected(r)}><Photo reward={r}/><div className="featured-info"><small>{r.partner}</small><strong>{r.name}</strong><span><Sparkles size={13}/>{r.price} points</span></div></button>)}</div>
    <div className="how-panel"><div className="how-top"><div className="how-icon"><QrCode size={23}/></div><div><strong>Wondering how it works?</strong><p>Scan → deposit → collect points</p></div></div><button onClick={()=>go('scan')}>Try the recycling demo <ArrowRight size={16}/></button></div>
    <div className="fine-print"><Info size={14}/> Points and café offers are illustrative; no real machine or partners are connected.</div>
  </>}
  {page==='scan'&&<>
    <div className="screen-heading"><div className="eyebrow"><Recycle size={15}/> RECYCLE & EARN</div><h1>Every bottle counts.</h1><p>Earn 10 demo points per eligible PET bottle.</p></div>
    {step==='intro'&&<div className="scan-card"><div className="step-progress"><b>01</b><span/><i>02</i><span/><i>03</i></div><span className="scan-tag">STEP 01 · CONNECT</span><div className="fake-qr"><div className="scan-bar"/><QrCode size={148} strokeWidth={1.35}/></div><h2>Scan the machine</h2><p>At BUE, you'd scan the RVM's QR code to start. For now, let's simulate it.</p><button className="solid-button" onClick={()=>setStep('connected')}><ScanLine size={19}/> Simulate QR scan <ArrowRight size={17}/></button><div className="scan-notice"><ShieldCheck size={16}/> No camera or machine connection in this demo.</div></div>}
    {step==='connected'&&<div className="scan-card"><div className="step-progress"><b>✓</b><span className="progress-active"/><b>02</b><span/><i>03</i></div><span className="scan-tag">STEP 02 · DEPOSIT</span><div className="connected-icon"><CheckCircle2 size={55}/></div><h2>Ready for your bottles!</h2><p>Choose how many bottles the imaginary machine accepts.</p><div className="counter"><button onClick={()=>setQuantity(q=>Math.max(1,q-1))} aria-label="Remove bottle"><Minus size={21}/></button><div><strong>{quantity}</strong><span>PET {quantity===1?'bottle':'bottles'}</span></div><button onClick={()=>setQuantity(q=>Math.min(20,q+1))} aria-label="Add bottle"><Plus size={21}/></button></div><div className="points-earned"><span>You'll collect</span><strong>+{quantity*10} <small>pts</small></strong></div><button className="solid-button" onClick={deposit}>Confirm demo deposit <ArrowRight size={17}/></button><button className="text-button" onClick={()=>setStep('intro')}>Back to scan</button></div>}
    {step==='done'&&<div className="scan-card success-card"><div className="step-progress"><b>✓</b><span className="progress-active"/><b>✓</b><span className="progress-active"/><b>✓</b></div><div className="success-bloom"><Check size={54}/></div><span className="scan-tag">SESSION COMPLETE</span><h2>That's a good deed! 🌱</h2><p>Your recycling demo is complete. Your points are waiting in your wallet.</p><div className="earn-number">+{lastEarned}<span>points earned</span></div><button className="solid-button" onClick={()=>go('rewards')}>Explore rewards <Gift size={18}/></button><button className="text-button" onClick={()=>{setQuantity(3);setStep('intro')}}>Recycle again</button></div>}
    <div className="tips-card"><strong>Before you recycle</strong><div><CheckCircle2 size={17}/> Empty eligible PET beverage bottles</div><div><CheckCircle2 size={17}/> Wait for deposit confirmation</div><div><Info size={17}/> Bottle acceptance depends on the selected RVM</div></div>
  </>}
  {page==='rewards'&&<>
    <div className="screen-heading reward-head"><div className="eyebrow"><Gift size={15}/> THE REWARDS CORNER</div><h1>A little treat for you.</h1><p>Small rewards for a greener campus.</p></div>
    <div className="wallet-hero"><div className="wallet-text"><span>YOUR POINTS BALANCE</span><strong>{data.points}<small> pts</small></strong><p>Good deeds look good on you.</p></div><div className="wallet-art"><Sparkles size={32}/><i>✦</i></div></div>
    <div className="partner-note"><Info size={16}/><p><b>Illustrative café catalogue.</b> TBS and La Poire are examples only — no partnership or offers are confirmed. Photos are representative.</p></div>
    <div className="reward-search"><Search size={19}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search rewards or cafés" aria-label="Search rewards"/></div>
    <div className="categories">{categoryList.map(c=><button key={c} className={category===c?'selected':''} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    <div className="section-heading rewards-heading"><div><h3>{category==='All'?'Explore rewards':category}</h3><p>{shown.length} delicious possibilities</p></div><span className="partner-tag"><MapPin size={13}/> Campus ideas</span></div>
    <div className="rewards-grid">{shown.map(r=><article className="reward-card" key={r.id}><div className="reward-photo-wrap"><Photo reward={r}/><span className="photo-category">{r.category}</span><button className={`heart ${saved.includes(r.id)?'liked':''}`} onClick={()=>toggleSaved(r.id)} aria-label={`Save ${r.name}`}><Heart size={17} fill={saved.includes(r.id)?'currentColor':'none'}/></button></div><div className="reward-card-body"><span className="reward-partner"><MapPin size={12}/>{r.partner}</span><h3>{r.name}</h3><p>{r.description}</p><div className="reward-card-footer"><span><Sparkles size={15}/><strong>{r.price}</strong> pts</span><button onClick={()=>setSelected(r)}>View <ArrowRight size={14}/></button></div></div></article>)}{shown.length===0&&<div className="empty-state"><Search size={30}/><strong>No matches yet</strong><p>Try another café or reward name.</p></div>}</div>
    {data.vouchers.length>0&&<div className="voucher-section"><div className="section-heading"><h3>Your sample vouchers</h3></div>{data.vouchers.map(v=><button key={v.id} className="voucher-item" onClick={()=>setVoucher(v)}><Ticket size={22}/><div><strong>{v.label}</strong><small>{v.partner} · {v.code}</small></div><ArrowRight size={17}/></button>)}</div>}
  </>}
  {page==='activity'&&<>
    <div className="screen-heading"><div className="eyebrow"><History size={15}/> YOUR RECYCLING JOURNEY</div><h1>Look what you've done.</h1><p>Small steps, meaningful progress.</p></div>
    <div className="activity-hero"><div><small>SIMULATED PET BOTTLES</small><strong>{data.bottles}</strong><span>bottles recycled</span></div><div className="activity-leaf"><Leaf size={73}/></div></div>
    <div className="impact-grid activity-counters"><div className="impact-card points"><div className="impact-icon"><Wallet size={19}/></div><strong>{data.points}</strong><span>Points balance</span></div><div className="impact-card bottles"><div className="impact-icon"><Recycle size={19}/></div><strong>{data.sessions}</strong><span>Demo sessions</span></div></div>
    <div className="section-heading"><div><h3>Activity timeline</h3><p>Your deposits and redemptions</p></div></div>
    <div className="timeline">{data.transactions.length?data.transactions.map(t=><div className="timeline-item" key={t.id}><div className={`timeline-symbol ${t.type}`}>{t.type==='deposit'?<Recycle size={19}/>:<Gift size={19}/>}</div><div className="timeline-copy"><strong>{t.label}</strong><span>{dateText(t.date)} · {t.type==='deposit'?'Recycling session':'Demo reward'}</span></div><b className={t.points>0?'positive':'negative'}>{t.points>0?'+':''}{t.points} pts</b></div>):<div className="empty-state"><Clock3 size={33}/><strong>Fresh start, big possibilities.</strong><p>Complete your first demo recycling session to see activity here.</p><button className="small-cta" onClick={()=>go('scan')}>Start recycling <ArrowRight size={15}/></button></div>}</div>
  </>}
  {page==='profile'&&<>
    <div className="screen-heading"><div className="eyebrow"><Users size={15}/> YOUR SPACE</div><h1>Hey, EcoSipper.</h1><p>Your campus recycling companion.</p></div>
    <div className="profile-hero"><div className="profile-large">ES</div><div><h3>Demo student</h3><p>BUE campus · Prototype account</p></div></div>
    <div className="profile-list"><button onClick={()=>go('activity')}><History size={20}/> My recycling history <ArrowRight size={17}/></button><button onClick={()=>go('rewards')}><Ticket size={20}/> Rewards and vouchers <ArrowRight size={17}/></button><button onClick={()=>go('admin')}><BarChart3 size={20}/> Admin dashboard preview <ArrowRight size={17}/></button><button onClick={()=>setMessage('EcoSip is a proposed BUE pilot. This app contains sample data only.')}><Info size={20}/> About this project <ArrowRight size={17}/></button></div>
    <button className="reset-button" onClick={()=>{if(window.confirm('Reset all prototype activity and points to zero?')){setData({points:0,bottles:0,sessions:0,transactions:[],vouchers:[]});setStep('intro');setMessage('Demo activity reset')}}}><RotateCcw size={17}/> Reset prototype data</button>
    <div className="fine-print"><ShieldCheck size={14}/> Demo only. No BUE authentication, real café payments or recycling machine connection.</div>
  </>}
  {page==='admin'&&<>
    <button className="back-link" onClick={()=>go('profile')}><ArrowLeft size={18}/> Back to profile</button>
    <div className="screen-heading"><div className="eyebrow"><BarChart3 size={15}/> OPERATIONS CONCEPT</div><h1>EcoSip at a glance.</h1><p>An illustrative administration dashboard.</p></div>
    <div className="admin-alert"><Info size={20}/><p><strong>Not a secure admin portal.</strong> Information is stored only in this browser and is not university or machine data.</p></div>
    <div className="admin-grid"><div><span>Accepted bottles</span><strong>{data.bottles}</strong></div><div><span>Demo sessions</span><strong>{data.sessions}</strong></div><div><span>Vouchers created</span><strong>{data.vouchers.length}</strong></div><div><span>Points currently held</span><strong>{data.points}</strong></div></div>
    <div className="section-heading"><h3>Before a real campus pilot</h3></div><div className="readiness">{['BUE location approval','RVM compatibility and connectivity','Café reward agreements','PET collection partner','Student authentication and privacy'].map(x=><div key={x}><span className="status-circle"/>{x}<small>Unconfirmed</small></div>)}</div>
  </>}
  </div>
  <nav className="bottom-nav" aria-label="App navigation">{nav.map(n=><button className={page===n.page?'active':''} key={n.page} onClick={()=>go(n.page)}><n.icon size={21} strokeWidth={page===n.page?2.5:1.8}/><span>{n.label}</span></button>)}</nav>
  {message&&<div className="toast" role="status"><CheckCircle2 size={17}/>{message}<button onClick={()=>setMessage('')} aria-label="Dismiss"><X size={15}/></button></div>}
  {selected&&<div className="modal-shade" onClick={()=>setSelected(null)}><div className="reward-sheet" onClick={e=>e.stopPropagation()}><div className="sheet-handle"/><button className="sheet-close" onClick={()=>setSelected(null)} aria-label="Close"><X size={19}/></button><Photo reward={selected} className="sheet-photo"/><div className="sheet-content"><div className="eyebrow">SAMPLE REWARD · {selected.category.toUpperCase()}</div><h2>{selected.name}</h2><p className="sheet-partner"><MapPin size={15}/>{selected.partner}</p><p>{selected.description}. Image is illustrative and not a photo of a specific partner's product.</p><div className="sheet-price"><span>Reward cost</span><strong><Sparkles size={18}/>{selected.price} pts</strong></div><button className="solid-button" disabled={data.points<selected.price} onClick={redeem}>{data.points<selected.price?'Not enough points':'Redeem sample reward'} <ArrowRight size={17}/></button><small className="sheet-disclaimer">No partner has agreed to this offer. Demo vouchers cannot be used for purchases.</small></div></div></div>}
  {voucher&&<div className="modal-shade" onClick={()=>setVoucher(null)}><div className="voucher-modal" onClick={e=>e.stopPropagation()}><button className="sheet-close" onClick={()=>setVoucher(null)} aria-label="Close"><X size={19}/></button><div className="voucher-icon"><Ticket size={32}/></div><span className="eyebrow">SAMPLE VOUCHER</span><h2>{voucher.label}</h2><p>{voucher.partner}</p><div className="voucher-code">{voucher.code}</div><small>Demo only — not valid at any café</small><button className="solid-button" onClick={()=>setVoucher(null)}>Done <Check size={18}/></button></div></div>}
  </div>
 </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
