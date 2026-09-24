# JalSakshi — Supervisor Escalation & CAG Compliance Portal

> **Track**: Social Impact & Public Good • AI/ML & Open Innovation  
> **Tagline**: From a water-test strip to verified corrective action.  
> **Core Purpose**: The missing evidence-to-action layer for the Jal Jeevan Mission (JJM) water testing ecosystem.

---

## 🌟 Key Capabilities

### 1. ⏱️ Real-Time Turnaround Tracker & CAG Compliance Monitor
- Enforces strict tracking of the **24–48 hour laboratory referral target** established by the CAG Performance Audit benchmarks.
- Highlights urgent cases and overdue lab turnarounds with live status badges (`OVERDUE`, `Urgent`, `Review Needed`).
- Prevents adverse Field Testing Kit (FTK) screening results from getting lost without follow-up.

### 2. 🔄 Case Management Lifecycle Engine
Implements the formal, audited state machine transitions for drinking water contamination incidents:
- **`refer_to_lab`**: Dispatches formal laboratory requisition to NABL accredited laboratories.
- **`record_action`**: Issues mandatory remediation and engineering repair work orders to PHED / Jal Nigam.
- **`link_retest`**: Links and schedules verified field retests for repaired sources.
- **`close`**: Authorises formal case closure only when all evidence criteria are satisfied.
- **`reopen`**: Reopens closed sources if subsequent screening detects water quality degradation.

### 3. 🛡️ Mandatory G-CLOSE Audit Gate Checklist
Guarantees that no water contamination case is closed without fulfilling the 4 critical prerequisites:
1. **NABL Certified Laboratory Report** (Verified parameter failure/pass).
2. **Corrective Remediation Action** (Accepted repair/defluoridation/super-chlorination).
3. **Post-Repair Verified Retest** (Distinct, later sample confirming potability).
4. **Community Communication Dispatch** (Logged citizen advisory notice).

### 4. 📱/🖥️ Device Frame Toggle
- **Fluid Canvas View**: Expansive widescreen desktop layout optimized for district supervisors, quality engineers, and lab officers.
- **Phone Frame View**: Smartphone bezel simulator for field inspection and on-the-go supervisor reviews.

### 5. 📊 Reports & JJM-WQMIS Batch Exports
- Bureau of Indian Standards (**BIS 10500:2012**) parameter compliance breakdown (pH, Turbidity, Nitrate, Chlorine, E. coli).
- One-click export to standard JJM-WQMIS datasets.

---

## 🛠️ Technology Stack
- **Framework**: React 19, TypeScript, Vite
- **Icons**: Lucide React
- **Styles**: Custom high-performance CSS design system (`Plus Jakarta Sans` / `Inter`, modern gradients, soft diffuse shadows)
- **State Machine**: Aligned with JalSakshi OpenAPI contracts and Pydantic v2 schemas

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
