"use client";

import { useMemo, useState } from "react";

type View = "home" | "traffic" | "policy" | "enforcement" | "requests";

const flows = [
  { source: "Internet", destination: "Payment Gateway", service: "HTTPS · TCP 443", status: "Allowed", last: "2 min ago" },
  { source: "Payment Gateway", destination: "Fraud Service", service: "HTTPS · TCP 443", status: "Allowed", last: "5 min ago" },
  { source: "Payment Gateway", destination: "Customer Database", service: "PostgreSQL · TCP 5432", status: "Needs review", last: "18 min ago" },
  { source: "Legacy Reporting", destination: "Payment Gateway", service: "Custom · TCP 8080", status: "Would be blocked", last: "1 hour ago" },
];

const nav: { id: View; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "traffic", label: "Traffic", icon: "⌁" },
  { id: "policy", label: "Connectivity", icon: "⌘" },
  { id: "enforcement", label: "Enforcement", icon: "◇" },
  { id: "requests", label: "Requests", icon: "▤" },
];

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [filter, setFilter] = useState("All traffic");
  const [policyStep, setPolicyStep] = useState(1);
  const [source, setSource] = useState("Payment Gateway");
  const [destination, setDestination] = useState("Customer Database");
  const [service, setService] = useState("PostgreSQL · TCP 5432");
  const [toast, setToast] = useState("");

  const shownFlows = useMemo(() => {
    if (filter === "All traffic") return flows;
    return flows.filter((flow) => flow.status === filter);
  }, [filter]);

  function go(next: View) {
    setView(next);
    setToast("");
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">I</span><span>Connectivity Portal</span></div>
        <nav aria-label="Primary navigation">
          {nav.map((item) => (
            <button key={item.id} className={view === item.id ? "nav-item active" : "nav-item"} onClick={() => go(item.id)}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot"><button className="help-button">? <span>Help & guidance</span></button><small>Self-service MVP</small></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumbs">Applications <span>/</span> Payment Gateway</div>
          <div className="top-actions"><button aria-label="Search">⌕</button><button aria-label="Notifications">♢<b>3</b></button><span className="avatar">LJ</span><span className="user">Lina ▾</span></div>
        </header>

        {view === "home" && <HomeView go={go} />}
        {view === "traffic" && <TrafficView filter={filter} setFilter={setFilter} rows={shownFlows} go={go} />}
        {view === "policy" && (
          <PolicyView step={policyStep} setStep={setPolicyStep} source={source} setSource={setSource} destination={destination} setDestination={setDestination} service={service} setService={setService} notify={notify} />
        )}
        {view === "enforcement" && <EnforcementView notify={notify} />}
        {view === "requests" && <RequestsView />}
      </main>
      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </div>
  );
}

function HomeView({ go }: { go: (v: View) => void }) {
  return <div className="page home-page">
    <section className="hero"><div><p className="eyebrow">PAYMENT GATEWAY</p><h1>Welcome back, Lina</h1><p>Manage application connectivity safely, step by step.</p></div><button className="app-switcher">Payment Gateway <span>⌄</span></button></section>
    <section><div className="section-title"><div><h2>What do you need to do?</h2><p>Choose a task — no Illumio knowledge required.</p></div></div>
      <div className="task-grid">
        <button className="task-card attention" onClick={() => go("traffic")}><span className="round-icon flow-icon">⌁</span><span><b>Review traffic</b><small>Understand who your application communicates with.</small><em>3 connections need attention →</em></span></button>
        <button className="task-card" onClick={() => go("policy")}><span className="round-icon">⌘</span><span><b>Create connectivity request</b><small>Allow a new application or service connection.</small><em>Start guided request →</em></span></button>
        <button className="task-card" onClick={() => go("enforcement")}><span className="round-icon shield">◇</span><span><b>Prepare for enforcement</b><small>Check readiness before protection is enabled.</small><em>Check readiness →</em></span></button>
      </div>
    </section>
    <section className="home-lower">
      <div className="panel app-summary"><div className="panel-head"><h3>Application status</h3><span className="status good">● Monitoring</span></div><div className="summary-metrics"><Metric value="24" label="Application components"/><Metric value="3" label="Connections to review" tone="risk"/><Metric value="2" label="Open requests"/></div><p className="plain-note"><b>In plain language:</b> traffic is visible, but protection is not actively blocking connections.</p></div>
      <div className="panel journey"><h3>Your protection journey</h3><JourneyStep state="current" label="Review application traffic" detail="3 connections need a decision"/><JourneyStep state="next" label="Confirm required connections" detail="Create or update policies"/><JourneyStep state="next" label="Prepare for enforcement" detail="Validate, approve and schedule"/></div>
    </section>
    <section className="panel recent"><div className="panel-head"><h3>Recent requests</h3><button onClick={() => go("requests")}>View all →</button></div><RequestRow name="Allow fraud-checker service" id="REQ-1027" type="New connection" status="Approved"/><RequestRow name="Database access for reporting" id="REQ-1031" type="Policy update" status="Awaiting approval"/></section>
  </div>;
}

function TrafficView({ filter, setFilter, rows, go }: { filter: string; setFilter: (s: string) => void; rows: typeof flows; go: (v: View) => void }) {
  return <div className="page"><section className="page-heading"><div><span className="status teal">● Monitoring</span><h1>Application traffic</h1><p>Review how Payment Gateway communicates before deciding what to allow.</p></div><button className="primary" onClick={() => go("policy")}>+ Create connectivity request</button></section>
    <div className="metric-grid"><MetricCard value="24" label="Application components"/><MetricCard value="3" label="Potential blocks" tone="risk"/><MetricCard value="78%" label="Enforcement readiness" tone="teal"/></div>
    <section className="traffic-layout"><div className="panel map-panel"><div className="panel-head"><div><h3>Traffic map</h3><p>Last 24 hours</p></div><select aria-label="Traffic time range"><option>Last 24 hours</option><option>Last 7 days</option><option>Last 30 days</option></select></div>
      <div className="flow-map" aria-label="Application flow diagram"><div className="node internet">◎<small>Internet</small></div><div className="line allowed l1"></div><div className="node api">▣<small>API Gateway</small></div><div className="line allowed l2"></div><div className="node core">◇<small>Payment Gateway</small></div><div className="line allowed l3"></div><div className="node fraud">✓<small>Fraud Service</small></div><div className="line review l4"></div><div className="node database">▤<small>Customer Database</small></div><div className="line blocked l5"></div><div className="node legacy">⊘<small>Legacy Reporting</small></div></div>
      <div className="legend"><span><i className="allowed"></i>Allowed</span><span><i className="review"></i>Needs review</span><span><i className="blocked"></i>Would be blocked</span></div></div>
      <aside className="panel next-steps"><h3>Recommended next steps</h3><button onClick={() => setFilter("Would be blocked")}><span className="risk-icon">!</span><span><b>Review potential blocks</b><small>3 connections need a decision</small></span><em>→</em></button><button onClick={() => go("policy")}><span>⌘</span><span><b>Create connectivity request</b><small>Set up an approved connection</small></span><em>→</em></button><button onClick={() => go("enforcement")}><span>◇</span><span><b>Prepare for enforcement</b><small>Resolve readiness blockers</small></span><em>→</em></button></aside>
    </section>
    <section className="panel flow-table"><div className="panel-head"><div><h3>Connection details</h3><p>Observed traffic does not automatically mean approved traffic.</p></div><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>All traffic</option><option>Allowed</option><option>Needs review</option><option>Would be blocked</option></select></div><div className="table-scroll"><table><thead><tr><th>Source</th><th>Destination</th><th>Service</th><th>Status</th><th>Last seen</th><th></th></tr></thead><tbody>{rows.map((row) => <tr key={row.source + row.destination}><td>{row.source}</td><td>{row.destination}</td><td>{row.service}</td><td><span className={`pill ${row.status.toLowerCase().replaceAll(" ", "-")}`}>{row.status}</span></td><td>{row.last}</td><td><button className="text-button" onClick={() => row.status === "Allowed" ? null : go("policy")}>{row.status === "Allowed" ? "View" : "Review →"}</button></td></tr>)}</tbody></table></div></section>
  </div>;
}

function PolicyView({ step, setStep, source, setSource, destination, setDestination, service, setService, notify }: { step: number; setStep: (n: number) => void; source: string; setSource: (s: string) => void; destination: string; setDestination: (s: string) => void; service: string; setService: (s: string) => void; notify: (s: string) => void }) {
  return <div className="page policy-page"><section className="page-heading"><div><span className="eyebrow">GUIDED CONNECTIVITY REQUEST</span><h1>Create a connectivity policy</h1><p>Describe the business need. We will translate it into a safe technical policy.</p></div></section><div className="stepper">{["Connection", "Business need", "Impact review", "Submit"].map((label, i) => <button key={label} className={step >= i + 1 ? "done" : ""} onClick={() => setStep(i + 1)}><span>{step > i + 1 ? "✓" : i + 1}</span>{label}</button>)}</div>
    {step === 1 && <section className="form-layout"><div className="panel form-card"><h2>What needs to connect?</h2><p className="form-intro">Choose applications and a known service. Technical labels are handled for you.</p><label>Connection source<select value={source} onChange={(e) => setSource(e.target.value)}><option>Payment Gateway</option><option>Fraud Service</option><option>Legacy Reporting</option></select></label><div className="direction-arrow">↓ connects to</div><label>Connection destination<select value={destination} onChange={(e) => setDestination(e.target.value)}><option>Customer Database</option><option>Fraud Service</option><option>Payment Gateway</option></select></label><label>Required service<select value={service} onChange={(e) => setService(e.target.value)}><option>PostgreSQL · TCP 5432</option><option>HTTPS · TCP 443</option><option>DNS · UDP 53</option><option>Other — needs review</option></select></label><div className="form-actions"><span></span><button className="primary" onClick={() => setStep(2)}>Continue →</button></div></div><PolicyPreview source={source} destination={destination} service={service}/></section>}
    {step === 2 && <section className="form-layout"><div className="panel form-card"><h2>Why is this connection needed?</h2><label>Business justification<textarea defaultValue="Payment processing requires access to the customer transaction database." /></label><div className="two-col"><label>Environment<select><option>Production</option><option>Non-production</option></select></label><label>Duration<select><option>Permanent</option><option>Temporary</option></select></label></div><label>Application owner<input defaultValue="Lina Johnson" /></label><div className="form-actions"><button className="secondary" onClick={() => setStep(1)}>← Back</button><button className="primary" onClick={() => setStep(3)}>Review impact →</button></div></div><PolicyPreview source={source} destination={destination} service={service}/></section>}
    {step === 3 && <section className="impact-grid"><div className="panel"><h2>Impact assessment</h2><div className="check-list"><Check ok text="Scope is limited to one source and destination application"/><Check ok text="No ‘Any’ labels or broad port ranges detected"/><Check ok text="No conflicting connectivity policy found"/><Check ok text="12 production components will be affected"/><Check warn text="Production change requires application and security approval"/></div><details><summary>View technical details</summary><pre>{`Source labels: app=payment-gateway, env=prod\nDestination labels: app=customer-db, env=prod\nService: tcp/5432\nAffected workloads: 12`}</pre></details><div className="form-actions"><button className="secondary" onClick={() => setStep(2)}>← Back</button><button className="primary" onClick={() => setStep(4)}>Continue →</button></div></div><PolicyPreview source={source} destination={destination} service={service}/></section>}
    {step === 4 && <section className="submit-card panel"><span className="success-mark">✓</span><h2>Ready to submit for approval</h2><p>This request will not change production immediately. It will be sent to the application owner and security approver first.</p><PolicySentence source={source} destination={destination} service={service}/><div className="approval-path"><span>1 Request submitted</span><span>2 Application approval</span><span>3 Security approval</span><span>4 Scheduled deployment</span></div><div className="form-actions centered"><button className="secondary" onClick={() => setStep(3)}>← Back</button><button className="primary" onClick={() => notify("Request REQ-1042 submitted for approval")}>Submit request</button></div></section>}
  </div>;
}

function EnforcementView({ notify }: { notify: (s: string) => void }) {
  const [ack, setAck] = useState(false);
  return <div className="page"><section className="page-heading"><div><span className="eyebrow">PROTECTION READINESS</span><h1>Prepare for enforcement</h1><p>Understand the impact before any connection can be blocked.</p></div><span className="status warn">● Ready with warnings</span></section><section className="enforcement-grid"><div className="panel readiness"><div className="score-ring"><b>78%</b><small>ready</small></div><div><h2>Payment Gateway needs attention</h2><p>Most requirements are complete, but production enforcement should not be requested until the remaining connections are reviewed.</p></div></div><div className="panel"><h3>Readiness checks</h3><div className="check-list"><Check ok text="24 application components are reporting normally"/><Check ok text="Application and environment labels are complete"/><Check ok text="Required standard services have policies"/><Check warn text="3 active connections still need a decision"/><Check warn text="Rollback owner has not been confirmed"/></div></div><div className="panel impact-warning"><h3>What would happen?</h3><p>If enforcement were enabled now:</p><div className="impact-numbers"><span><b>21</b><small>connections allowed</small></span><span className="risk"><b>3</b><small>may be blocked</small></span><span><b>24</b><small>components affected</small></span></div><button className="text-button">View affected connections →</button></div><div className="panel enforcement-action"><h3>Request staged enforcement</h3><p>The change will move through simulation, non-production validation and production approval. This is not an immediate mode switch.</p><label className="checkbox"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)}/><span>I understand the outstanding readiness warnings.</span></label><button className="primary full" disabled={!ack} onClick={() => notify("Enforcement readiness review requested")}>Request readiness review</button></div></section></div>;
}

function RequestsView() { return <div className="page"><section className="page-heading"><div><span className="eyebrow">AUDITABLE WORKFLOW</span><h1>Requests</h1><p>Track connectivity and enforcement changes from draft to verification.</p></div><button className="primary">+ New request</button></section><section className="panel requests-panel"><div className="request-filters"><button className="selected">All requests <b>4</b></button><button>Awaiting approval <b>1</b></button><button>Scheduled <b>1</b></button><button>Completed <b>2</b></button></div><div className="request-list"><RequestDetail id="REQ-1042" title="Payment Gateway → Customer Database" type="New connectivity" owner="Lina Johnson" status="Draft"/><RequestDetail id="REQ-1031" title="Database access for reporting" type="Policy update" owner="Lina Johnson" status="Awaiting approval"/><RequestDetail id="REQ-1027" title="Allow fraud-checker service" type="New connectivity" owner="James Walker" status="Approved"/><RequestDetail id="REQ-1019" title="Non-production enforcement" type="Enforcement" owner="Lina Johnson" status="Completed"/></div></section></div>; }

function Metric({ value, label, tone = "" }: { value: string; label: string; tone?: string }) { return <div className={`metric ${tone}`}><b>{value}</b><span>{label}</span></div>; }
function MetricCard({ value, label, tone = "" }: { value: string; label: string; tone?: string }) { return <div className={`metric-card ${tone}`}><span>{label}</span><b>{value}</b><i>{tone === "risk" ? "!" : tone === "teal" ? "◇" : "▦"}</i></div>; }
function JourneyStep({ state, label, detail }: { state: string; label: string; detail: string }) { return <div className={`journey-step ${state}`}><span></span><div><b>{label}</b><small>{detail}</small></div></div>; }
function RequestRow({ name, id, type, status }: { name: string; id: string; type: string; status: string }) { return <div className="request-row"><div><b>{name}</b><small>{id}</small></div><span>{type}</span><span>Payment Gateway</span><span className={`pill ${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span><button>→</button></div>; }
function PolicySentence({ source, destination, service }: { source: string; destination: string; service: string }) { return <div className="policy-sentence"><span>Proposed policy</span><p>Allow <b>{source}</b> production components to connect to <b>{destination}</b> using <b>{service}</b>.</p></div>; }
function PolicyPreview({ source, destination, service }: { source: string; destination: string; service: string }) { return <aside className="panel policy-preview"><span className="preview-label">LIVE PREVIEW</span><h3>Your request in plain language</h3><PolicySentence source={source} destination={destination} service={service}/><div className="safe-note">✓ No technical Illumio terms are required. Labels and rulesets will be generated and validated.</div></aside>; }
function Check({ ok, warn, text }: { ok?: boolean; warn?: boolean; text: string }) { return <div className={`check ${warn ? "warning" : ""}`}><span>{ok ? "✓" : warn ? "!" : "•"}</span>{text}</div>; }
function RequestDetail({ id, title, type, owner, status }: { id: string; title: string; type: string; owner: string; status: string }) { return <button className="request-detail"><div><span>{id}</span><b>{title}</b></div><small>{type}</small><small>{owner}</small><span className={`pill ${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span><em>→</em></button>; }
