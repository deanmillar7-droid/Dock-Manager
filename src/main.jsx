import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Building2, CalendarDays, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Clock3, Info, LayoutGrid, Menu, Plus, Search,
  Settings, ShieldCheck, Users, X, Check, Truck, MapPin
} from 'lucide-react';
import './styles.css';

const docks = [
  { id: 1, name: 'Dock 1', size: '3.5 m × 6 m' },
  { id: 2, name: 'Dock 2', size: '3.5 m × 8 m' },
  { id: 3, name: 'Dock 3', size: '3.7 m × 8.5 m' },
];

const initialBookings = [
  { id: 1, dock: 1, start: '07:00', duration: 60, company: 'Northstar Foods', tenant: 'Ground Floor Café', description: 'Fresh produce delivery', status: 'Confirmed', color: 'blue', contact: 'Daniel Moore', mobile: '0412 892 155', vehicle: 'Van · XTR-482' },
  { id: 2, dock: 3, start: '08:00', duration: 90, company: 'Metro Office Co.', tenant: 'Bennett & Co.', description: 'Office furniture', status: 'Confirmed', color: 'purple', contact: 'Amelia Grant', mobile: '0429 615 228', vehicle: 'Rigid truck · MOC-103' },
  { id: 3, dock: 2, start: '09:30', duration: 60, company: 'Swift Electrical', tenant: 'Building Services', description: 'Electrical maintenance', status: 'Pending', color: 'amber', contact: 'Chris Lin', mobile: '0404 220 871', vehicle: 'Van · CEL-775' },
  { id: 4, dock: 1, start: '11:00', duration: 60, company: 'ABC Couriers', tenant: 'Tenant XYZ', description: 'Parcel delivery', status: 'Confirmed', color: 'green', contact: 'Jordan Lee', mobile: '0418 930 662', vehicle: 'Van · ABC-240' },
  { id: 5, dock: 3, start: '12:00', duration: 60, company: 'CleanCo Services', tenant: 'Liberty Place', description: 'Cleaning supplies', status: 'Confirmed', color: 'blue', contact: 'Mia Perez', mobile: '0433 177 592', vehicle: 'Utility · CLN-408' },
  { id: 6, dock: 2, start: '14:00', duration: 90, company: 'Harbour Removals', tenant: 'Level 11', description: 'Tenant move-in', status: 'Confirmed', color: 'purple', contact: 'Liam Scott', mobile: '0450 994 201', vehicle: 'Truck · HRB-119' },
];

const times = Array.from({ length: 25 }, (_, i) => {
  const total = 6 * 60 + i * 30;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
});

const nav = [
  ['calendar', CalendarDays, 'Dock Calendar'],
  ['bookings', Clock3, 'My Bookings'],
  ['info', Info, 'Dock Information'],
];

function App() {
  const [active, setActive] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 8, 23));
  const [shift, setShift] = useState('Day shift');
  const [bookings, setBookings] = useState(initialBookings);
  const [drawer, setDrawer] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const dateText = selectedDate.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });

  function moveDate(days) {
    setSelectedDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days));
  }

  function startBooking(dock = 1, start = '10:00') {
    setDrawer({ type: 'create', dock, start });
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Truck size={21}/></div><span>Dock<span>Flow</span></span><button className="mobile-close" onClick={() => setMobileNav(false)}><X/></button></div>
      <div className="building-card">
        <div className="building-icon"><Building2 size={19}/></div>
        <div><small>BUILDING</small><strong>Liberty Place</strong><span>161 Castlereagh Street</span></div>
        <ChevronDown size={16}/>
      </div>
      <nav>
        <p>WORKSPACE</p>
        {nav.map(([id, Icon, label]) => <button key={id} className={active === id ? 'active' : ''} onClick={() => { setActive(id); setMobileNav(false); }}><Icon size={19}/>{label}</button>)}
        <p>MANAGEMENT</p>
        <button onClick={() => setActive('directory')} className={active === 'directory' ? 'active' : ''}><Users size={19}/>Directory</button>
        <button onClick={() => setActive('settings')} className={active === 'settings' ? 'active' : ''}><Settings size={19}/>Building Settings</button>
      </nav>
      <div className="sidebar-footer">
        <button><CircleHelp size={18}/>Help & support</button>
        <div className="profile"><div className="avatar">AW</div><div><strong>Alex Wong</strong><span>Building Admin</span></div><ChevronDown size={16}/></div>
      </div>
    </aside>
    {mobileNav && <div className="backdrop" onClick={() => setMobileNav(false)}/>} 

    <main>
      <header>
        <button className="menu-button" onClick={() => setMobileNav(true)}><Menu/></button>
        <div><p>LIBERTY PLACE</p><h1>{active === 'calendar' ? 'Dock Calendar' : nav.find(n => n[0] === active)?.[2] || (active === 'directory' ? 'Directory' : 'Building Settings')}</h1></div>
        <div className="header-actions"><button className="search"><Search size={18}/><span>Search</span><kbd>⌘ K</kbd></button><button className="primary" onClick={() => startBooking()}><Plus size={18}/>New booking</button></div>
      </header>

      {active === 'calendar' && <CalendarView {...{dateText, moveDate, shift, setShift, bookings, startBooking, setDrawer}}/>}
      {active === 'bookings' && <MyBookings bookings={bookings} setDrawer={setDrawer}/>} 
      {active === 'info' && <DockInfo/>}
      {active === 'directory' && <Directory/>}
      {active === 'settings' && <SettingsView/>}
    </main>
    {drawer && <BookingDrawer drawer={drawer} setDrawer={setDrawer} bookings={bookings} setBookings={setBookings} dateText={dateText}/>} 
  </div>;
}

function CalendarView({ dateText, moveDate, shift, setShift, bookings, startBooking, setDrawer }) {
  return <section className="content calendar-content">
    <div className="toolbar">
      <div className="date-controls"><button onClick={() => moveDate(-1)} aria-label="Previous day"><ChevronLeft/></button><button className="date-button"><CalendarDays size={17}/><span>{dateText}</span></button><button onClick={() => moveDate(1)} aria-label="Next day"><ChevronRight/></button><button className="today" onClick={() => moveDate(0)}>Today</button></div>
      <div className="toolbar-right"><div className="shift-toggle"><button className={shift === 'Day shift' ? 'selected' : ''} onClick={() => setShift('Day shift')}>Day shift <span>06:00–18:00</span></button><button className={shift === 'Night shift' ? 'selected' : ''} onClick={() => setShift('Night shift')}>Night shift <span>18:00–06:00</span></button></div><button className="icon-button"><LayoutGrid size={19}/></button></div>
    </div>
    <div className="legend"><span><i className="dot green"/>Confirmed</span><span><i className="dot amber"/>Pending approval</span><span className="availability"><i/> Available slot — click to book</span></div>
    <div className="calendar-card">
      <div className="calendar-head"><div className="time-head">TIME</div>{docks.map(d => <div key={d.id} className="dock-head"><strong>{d.name}</strong><span>{d.size}</span><em>Available</em></div>)}</div>
      <div className="calendar-grid">
        <div className="time-column">{times.slice(0,-1).map(t => <div key={t}>{t}</div>)}</div>
        {docks.map(d => <div className="dock-column" key={d.id}>{times.slice(0,-1).map(t => <button key={t} className="slot" aria-label={`Book ${d.name} at ${t}`} onClick={() => startBooking(d.id, t)}><Plus size={14}/><span>Book</span></button>)}{bookings.filter(b => b.dock === d.id).map(b => <BookingBlock key={b.id} booking={b} onClick={() => setDrawer({ type:'view', booking:b })}/>)}</div>)}
      </div>
    </div>
  </section>;
}

function BookingBlock({ booking, onClick }) {
  const [h,m] = booking.start.split(':').map(Number);
  const top = ((h * 60 + m) - 360) / 30 * 54;
  const height = booking.duration / 30 * 54 - 4;
  const endMin = h * 60 + m + booking.duration;
  const end = `${String(Math.floor(endMin/60)).padStart(2,'0')}:${String(endMin%60).padStart(2,'0')}`;
  return <button onClick={onClick} className={`booking ${booking.color}`} style={{top, height}}><div className="booking-time">{booking.start}–{end}<span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></div><strong>{booking.company}</strong><p>{booking.description}</p><span>{booking.tenant}</span></button>;
}

function BookingDrawer({ drawer, setDrawer, bookings, setBookings, dateText }) {
  const isView = drawer.type === 'view';
  const source = drawer.booking || {};
  const [dock, setDock] = useState(source.dock || drawer.dock || 1);
  const [start, setStart] = useState(source.start || drawer.start || '10:00');
  const [duration, setDuration] = useState(source.duration || 30);
  const [description, setDescription] = useState(source.description || '');
  const [step, setStep] = useState(isView ? 'details' : 'form');
  const [agreed, setAgreed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const finish = useMemo(() => { const [h,m] = start.split(':').map(Number); const n=h*60+m+duration; return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`; }, [start,duration]);
  function submit() {
    setBookings([...bookings, { id: Date.now(), dock:Number(dock), start, duration, company:'Atlas Projects', tenant:'Building Team', description:description || 'General delivery', status:'Confirmed', color:'green', contact:'Alex Wong', mobile:'0412 345 678', vehicle:'Not provided' }]);
    setConfirmed(true);
  }
  return <><div className="drawer-backdrop" onClick={() => setDrawer(null)}/><aside className="drawer">
    <div className="drawer-header"><div><span>{isView ? 'BOOKING DETAILS' : step === 'safety' ? 'FINAL STEP' : 'NEW BOOKING'}</span><h2>{confirmed ? 'Booking confirmed' : isView ? source.company : step === 'safety' ? 'Safety confirmation' : 'Create a booking'}</h2></div><button onClick={() => setDrawer(null)}><X/></button></div>
    <div className="drawer-body">
      {confirmed ? <div className="confirmation"><div className="success-icon"><Check/></div><h3>You're all booked</h3><p>A confirmation has been sent to your email.</p><div className="summary"><strong>{dateText}</strong><span>{start}–{finish}</span><span>{docks.find(d => d.id === Number(dock))?.name}</span></div><button className="primary full" onClick={() => setDrawer(null)}>Back to calendar</button></div> :
      isView ? <><div className="status-banner"><ShieldCheck/><div><strong>{source.status}</strong><span>Safety requirements acknowledged</span></div></div><Detail label="Organisation" value={source.company}/><Detail label="Tenant / contractor" value={source.tenant}/><Detail label="Booking description" value={source.description}/><div className="detail-row split"><Detail label="Contact name" value={source.contact}/><Detail label="Mobile" value={source.mobile}/></div><Detail label="Vehicle" value={source.vehicle}/><div className="detail-row split"><Detail label="Time" value={`${source.start} · ${source.duration} min`}/><Detail label="Dock spot" value={`Dock ${source.dock}`}/></div><div className="drawer-actions"><button className="secondary">Cancel booking</button><button className="primary">Edit booking</button></div></> :
      step === 'safety' ? <><div className="requirements"><div className="requirement-title"><ShieldCheck/><div><strong>Loading Dock Requirements</strong><span>Please review before confirming</span></div></div><h4>PPE</h4><p><Check/> High-visibility clothing required</p><p><Check/> Enclosed footwear required</p><h4>DOCK INSTRUCTIONS</h4><p><Check/> Maximum vehicle height: 3.5 m</p><p><Check/> Maximum vehicle length: 8.5 m</p><p><Check/> Report to Security before entering the dock</p><p><Check/> Vehicles must not be left unattended</p></div><label className="agree"><input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}/><span>I have read and agree to comply with the loading dock requirements.</span></label><button disabled={!agreed} onClick={submit} className="primary full">Confirm booking</button><button className="back-link" onClick={() => setStep('form')}>Back to booking details</button></> :
      <><div className="selection-summary"><MapPin/><div><span>{dateText}</span><strong>Dock {dock} · {start}–{finish}</strong></div></div><label>Dock spot<select value={dock} onChange={e => setDock(e.target.value)}>{docks.map(d => <option key={d.id} value={d.id}>{d.name} — {d.size}</option>)}</select></label><label>Start time<input type="time" value={start} onChange={e=>setStart(e.target.value)}/></label><label>Duration<div className="durations">{[15,30,45,60,90,120].map(n => <button key={n} className={duration===n?'on':''} onClick={()=>setDuration(n)}>{n<60?`${n} min`:n===60?'1 hr':`${n/60} hr`}</button>)}</div></label><label>Booking description<textarea placeholder="e.g. Furniture delivery" value={description} onChange={e=>setDescription(e.target.value)}/></label><label>Contact name<input defaultValue="Alex Wong"/></label><label>Contact mobile<input defaultValue="0412 345 678"/></label><label>Vehicle registration <span className="optional">Optional</span><input placeholder="e.g. ABC-123"/></label><button className="primary full" onClick={() => setStep('safety')}>Continue to safety requirements <ChevronRight size={18}/></button></>}
    </div>
  </aside></>;
}

function Detail({label,value}) { return <div className="detail"><span>{label}</span><strong>{value}</strong></div> }
function MyBookings({bookings,setDrawer}) { return <section className="content simple-page"><div className="page-intro"><div><h2>My bookings</h2><p>View and manage your upcoming dock bookings.</p></div></div><div className="table-card"><div className="table-row table-head"><span>Date</span><span>Time</span><span>Dock</span><span>Description</span><span>Status</span></div>{bookings.slice(0,4).map(b=><button className="table-row" key={b.id} onClick={()=>setDrawer({type:'view',booking:b})}><span>23 Sep</span><span>{b.start}</span><span>Dock {b.dock}</span><strong>{b.description}</strong><span><em className="table-status">{b.status}</em></span></button>)}</div></section> }
function DockInfo() { return <section className="content simple-page"><div className="hero-dock"><div><span>LIBERTY PLACE</span><h2>Dock Information</h2><p>Everything you need to arrive prepared and access the loading dock safely.</p></div></div><div className="info-grid">{docks.map((d,i)=><div className="info-card" key={d.id}><div className="dock-number">0{d.id}</div><h3>{d.name}</h3><p>Maximum height <strong>{i===2?'3.7 m':'3.5 m'}</strong></p><p>Maximum length <strong>{i===0?'6 m':i===1?'8 m':'8.5 m'}</strong></p><span className="active-pill">Active</span></div>)}</div></section> }
function Directory(){ return <section className="content simple-page"><div className="page-intro"><div><h2>Directory</h2><p>Manage people and building access.</p></div><button className="primary"><Plus size={18}/>Invite user</button></div><div className="table-card"><div className="table-row directory table-head"><span>Name</span><span>Company</span><span>Type</span><span>Contact</span><span>Status</span></div>{[['John Smith','ABC Electrical','Contractor','04xx xxx 123'],['Sarah Jones','ANZ','Tenant','04xx xxx 458'],['Daniel Moore','Northstar Foods','Contractor','04xx xxx 901']].map(u=><div className="table-row directory" key={u[0]}><strong>{u[0]}</strong><span>{u[1]}</span><span>{u[2]}</span><span>{u[3]}</span><span><em className="table-status">Active</em></span></div>)}</div></section> }
function SettingsView(){return <section className="content simple-page"><div className="page-intro"><div><h2>Building settings</h2><p>Configure booking rules and dock availability.</p></div><button className="primary">Save changes</button></div><div className="settings-grid"><div className="settings-card"><h3>Building details</h3><label>Building name<input defaultValue="Liberty Place"/></label><label>Address<input defaultValue="161 Castlereagh Street, Sydney NSW"/></label><label>Timezone<select defaultValue="Australia/Sydney"><option>Australia/Sydney</option></select></label></div><div className="settings-card"><h3>Booking rules</h3><label>Booking approval<select defaultValue="Automatic"><option>Automatic</option><option>Approval required</option></select></label><label>Minimum booking<input defaultValue="15 minutes"/></label><label>Maximum booking<input defaultValue="2 hours"/></label></div></div></section>}

createRoot(document.getElementById('root')).render(<App/>);
