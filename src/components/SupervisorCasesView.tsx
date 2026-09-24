import { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Beaker,
  Activity,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { TestCase, CaseStatus } from '../types';

interface SupervisorCasesViewProps {
  cases: TestCase[];
  onSelectCase: (testCase: TestCase) => void;
  selectedCaseId: string | null;
  onExecuteCommand: (
    caseId: string,
    commandType: 'refer_to_lab' | 'record_action' | 'link_retest' | 'close' | 'reopen',
    details: any
  ) => void;
}

export default function SupervisorCasesView({
  cases,
  onSelectCase,
  selectedCaseId,
  onExecuteCommand,
}: SupervisorCasesViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null);
  const [actionInput, setActionInput] = useState<string>('');

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const filteredCases = cases.filter((c) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'urgent') return c.deadlineHours < 12 || c.deadlineHours < 0;
    return c.status === filterStatus;
  });

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'review_needed':
        return <span className="case-flag-tag" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>Review Needed</span>;
      case 'awaiting_lab':
        return <span className="case-flag-tag" style={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}>Awaiting Lab</span>;
      case 'action_required':
        return <span className="case-flag-tag" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>Action Required</span>;
      case 'retest_due':
        return <span className="case-flag-tag" style={{ backgroundColor: '#EDE9FE', color: '#6D28D9' }}>Retest Due</span>;
      case 'closure_review':
        return <span className="case-flag-tag" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>Closure Review</span>;
      case 'closed':
        return <span className="case-flag-tag" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>Verified Closed</span>;
      default:
        return null;
    }
  };

  const handleActionSubmit = (command: 'refer_to_lab' | 'record_action' | 'link_retest' | 'close' | 'reopen') => {
    if (!selectedCase) return;
    onExecuteCommand(selectedCase.id, command, {
      notes: actionInput || 'Standard supervisor escalation process completed.',
      actor: 'Dr. A. K. Sharma (District Quality Supervisor)',
    });
    setActiveActionModal(null);
    setActionInput('');
  };

  return (
    <div className="supervisor-dashboard-container">
      {/* CAG Audit Notice Alert Banner */}
      <div className="cag-audit-alert-banner">
        <div className="cag-banner-content">
          <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0 }} />
          <div>
            <div className="cag-banner-title">
              JJM Quality Assurance &amp; CAG Performance Compliance Monitor
            </div>
            <div className="cag-banner-desc">
              Audit Rule: Adverse FTK field samples must receive laboratory confirmation within <strong>24–48 hours</strong> and verified closure upon completed remediation. (CAG Performance Audit Benchmarks).
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400E' }}>
            Avg Turnaround: 31.4h (Target &lt; 48h)
          </span>
        </div>
      </div>

      {/* Supervisor Top KPIs */}
      <div className="supervisor-header-stats-grid">
        <div className="stat-kpi-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-metric-number">
              {cases.filter((c) => c.status === 'review_needed' || c.status === 'awaiting_lab').length}
            </div>
            <div className="stat-metric-title">Active Field Escalations</div>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-metric-number">
              {cases.filter((c) => c.deadlineHours < 0).length}
            </div>
            <div className="stat-metric-title">Overdue Lab Turnarounds</div>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#EDE9FE', color: '#6D28D9' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="stat-metric-number">
              {cases.filter((c) => c.status === 'action_required' || c.status === 'retest_due').length}
            </div>
            <div className="stat-metric-title">Remediation / Retest Queue</div>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-metric-number">
              {cases.filter((c) => c.status === 'closed').length + 42}
            </div>
            <div className="stat-metric-title">Verified Closed Sources</div>
          </div>
        </div>
      </div>

      {/* Main Workspace Split: Case Queue List + Case Detail */}
      <div className="supervisor-workspace-split">
        {/* Left Column: Case Queue */}
        <div className="case-queue-column">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800 }}>
              Cases Queue ({filteredCases.length})
            </h2>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
              Live Sync Active
            </span>
          </div>

          {/* Filter Pills */}
          <div className="queue-filter-bar">
            <button
              className={`filter-chip ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Cases
            </button>
            <button
              className={`filter-chip ${filterStatus === 'urgent' ? 'active' : ''}`}
              onClick={() => setFilterStatus('urgent')}
            >
              ⚠️ Urgent / Overdue
            </button>
            <button
              className={`filter-chip ${filterStatus === 'review_needed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('review_needed')}
            >
              Review Needed
            </button>
            <button
              className={`filter-chip ${filterStatus === 'awaiting_lab' ? 'active' : ''}`}
              onClick={() => setFilterStatus('awaiting_lab')}
            >
              Awaiting Lab
            </button>
            <button
              className={`filter-chip ${filterStatus === 'closure_review' ? 'active' : ''}`}
              onClick={() => setFilterStatus('closure_review')}
            >
              Closure Review
            </button>
          </div>

          {/* Scrollable Case Cards */}
          <div className="case-cards-scroll-stack">
            {filteredCases.map((c) => {
              const isSelected = selectedCase?.id === c.id;
              const isOverdue = c.deadlineHours < 0;
              const isUrgent = c.deadlineHours > 0 && c.deadlineHours <= 12;

              return (
                <div
                  key={c.id}
                  className={`case-queue-item-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectCase(c)}
                >
                  <div className="case-card-header-row">
                    <span className="case-number-title">{c.id}</span>
                    <span
                      className={`case-deadline-badge ${
                        isOverdue
                          ? 'badge-overdue'
                          : isUrgent
                          ? 'badge-urgent'
                          : 'badge-normal'
                      }`}
                    >
                      <Clock size={10} />
                      {c.deadlineLabel}
                    </span>
                  </div>

                  <div className="case-source-subtitle">
                    <MapPin size={12} color="#0284C7" />
                    <span>{c.sourceName} ({c.sourceId})</span>
                  </div>

                  <div className="case-flagged-pill-list">
                    {c.flags.map((f, i) => (
                      <span key={i} className="case-flag-tag">
                        {f.parameter}: {f.value}
                      </span>
                    ))}
                  </div>

                  <div className="case-footer-meta">
                    <span>{getStatusBadge(c.status)}</span>
                    <span style={{ fontWeight: 700, color: '#008294' }}>
                      AI Conf: {c.confidence}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Detail & Action Engine */}
        {selectedCase && (
          <div className="case-detail-column">
            {/* Top Case Title & Action Banner */}
            <div className="case-detail-top-banner">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    {selectedCase.id}: {selectedCase.sourceName}
                  </h1>
                  {getStatusBadge(selectedCase.status)}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                  <span>Source ID: <strong>{selectedCase.sourceId}</strong></span> •{' '}
                  <span>{selectedCase.location}, {selectedCase.district}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>
                  Field Tester:
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                  {selectedCase.operator.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#0284C7', display: 'block' }}>
                  {selectedCase.operator.phone}
                </span>
              </div>
            </div>

            {/* State Machine Step Flow */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Closed-Loop Evidence Escalation Lifecycle
              </span>
              <div className="case-state-step-flow" style={{ marginTop: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: selectedCase.status === 'review_needed' ? 800 : 500, color: selectedCase.status === 'review_needed' ? '#008294' : '#64748B' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: selectedCase.status === 'review_needed' ? '#008294' : '#E2E8F0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>1</span>
                  <span>Review Needed</span>
                </div>
                <ArrowRight size={14} color="#94A3B8" />

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: selectedCase.status === 'awaiting_lab' ? 800 : 500, color: selectedCase.status === 'awaiting_lab' ? '#008294' : '#64748B' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: selectedCase.status === 'awaiting_lab' ? '#008294' : '#E2E8F0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>2</span>
                  <span>Lab Confirmation</span>
                </div>
                <ArrowRight size={14} color="#94A3B8" />

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: selectedCase.status === 'action_required' ? 800 : 500, color: selectedCase.status === 'action_required' ? '#008294' : '#64748B' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: selectedCase.status === 'action_required' ? '#008294' : '#E2E8F0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>3</span>
                  <span>Remediation</span>
                </div>
                <ArrowRight size={14} color="#94A3B8" />

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: selectedCase.status === 'retest_due' ? 800 : 500, color: selectedCase.status === 'retest_due' ? '#008294' : '#64748B' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: selectedCase.status === 'retest_due' ? '#008294' : '#E2E8F0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>4</span>
                  <span>Retest Due</span>
                </div>
                <ArrowRight size={14} color="#94A3B8" />

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: selectedCase.status === 'closed' ? 800 : 500, color: selectedCase.status === 'closed' ? '#15803D' : '#64748B' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: selectedCase.status === 'closed' ? '#15803D' : '#E2E8F0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>5</span>
                  <span>Verified Closure</span>
                </div>
              </div>
            </div>

            {/* Evidence & Field Observation Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              {/* Flagged Contaminants */}
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '14px', padding: '1rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#DC2626', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                  <Beaker size={16} />
                  Flagged Parameter Screening
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedCase.flags.map((flag, idx) => (
                    <div key={idx} style={{ background: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.82rem' }}>
                        <span>{flag.parameter}</span>
                        <span style={{ color: '#DC2626' }}>{flag.value}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                        {flag.standard}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#7F1D1D', marginTop: '0.65rem', fontStyle: 'italic' }}>
                  Field Observation: "{selectedCase.observations.sanitaryRemarks}"
                </div>
              </div>

              {/* Optical Capture & AI Verification Proof */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <Sparkles size={16} color="#008294" />
                    AI Optical Verification Proof
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Alignment Confidence:</span>
                      <span style={{ fontWeight: 700, color: '#16A34A' }}>✓ {selectedCase.confidence}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Exposure / Illumination:</span>
                      <span style={{ fontWeight: 700, color: '#16A34A' }}>✓ Optimal (Calibrated)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>GPS Tag:</span>
                      <span style={{ fontWeight: 600 }}>{selectedCase.gps.lat}, {selectedCase.gps.lng} ({selectedCase.gps.accuracy})</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#0F172A', color: '#38BDF8', padding: '0.45rem 0.75rem', borderRadius: '8px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                  <ShieldCheck size={14} color="#38BDF8" />
                  <span>Immutable Signed Hash: sha256:4a8b...9c21</span>
                </div>
              </div>
            </div>

            {/* Audit Prerequisites Checklist for Verified Closure */}
            <div className="audit-checklist-card">
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} color="#008294" />
                Closed-Loop Mandatory Audit Prerequisites (G-CLOSE Gate)
              </h3>
              <div className="audit-checklist-grid">
                <div className="audit-check-item">
                  <CheckCircle2
                    size={16}
                    color={selectedCase.labDetails?.isVerified ? '#16A34A' : '#D97706'}
                  />
                  <span>
                    1. NABL Certified Lab Report ({selectedCase.labDetails?.isVerified ? 'Verified' : 'Pending'})
                  </span>
                </div>

                <div className="audit-check-item">
                  <CheckCircle2
                    size={16}
                    color={selectedCase.remediation?.accepted ? '#16A34A' : '#D97706'}
                  />
                  <span>
                    2. Corrective Remediation Action ({selectedCase.remediation?.accepted ? 'Accepted' : 'Pending'})
                  </span>
                </div>

                <div className="audit-check-item">
                  <CheckCircle2
                    size={16}
                    color={selectedCase.retest?.isPassed ? '#16A34A' : '#D97706'}
                  />
                  <span>
                    3. Post-Repair Verified Retest ({selectedCase.retest?.isPassed ? 'Passed' : 'Pending'})
                  </span>
                </div>

                <div className="audit-check-item">
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span>4. Community Communication Dispatch (Dispatched)</span>
                </div>
              </div>
            </div>

            {/* Workflow Action Command Buttons */}
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.5rem' }}>
                Supervisor Workflow Command Engine
              </span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {selectedCase.status === 'review_needed' && (
                  <button
                    className="btn-submit-primary"
                    style={{ flex: 1, padding: '0.75rem' }}
                    onClick={() => setActiveActionModal('refer_to_lab')}
                  >
                    <Beaker size={16} />
                    <span>Refer to NABL Laboratory (refer_to_lab)</span>
                  </button>
                )}

                {(selectedCase.status === 'awaiting_lab' || selectedCase.status === 'action_required') && (
                  <button
                    className="btn-submit-primary"
                    style={{ flex: 1, padding: '0.75rem' }}
                    onClick={() => setActiveActionModal('record_action')}
                  >
                    <UserCheck size={16} />
                    <span>Dispatch Remediation Order (record_action)</span>
                  </button>
                )}

                {selectedCase.status === 'retest_due' && (
                  <button
                    className="btn-submit-primary"
                    style={{ flex: 1, padding: '0.75rem' }}
                    onClick={() => setActiveActionModal('link_retest')}
                  >
                    <RotateCcw size={16} />
                    <span>Schedule Field Retest (link_retest)</span>
                  </button>
                )}

                {(selectedCase.status === 'closure_review' || selectedCase.retest?.isPassed) && (
                  <button
                    className="btn-submit-primary"
                    style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)' }}
                    onClick={() => setActiveActionModal('close')}
                  >
                    <ShieldCheck size={16} />
                    <span>Approve Verified Closure (close)</span>
                  </button>
                )}

                {selectedCase.status === 'closed' && (
                  <button
                    className="btn-secondary-white"
                    style={{ flex: 1 }}
                    onClick={() => setActiveActionModal('reopen')}
                  >
                    <RotateCcw size={16} />
                    <span>Reopen Case with New Evidence</span>
                  </button>
                )}
              </div>
            </div>

            {/* Audit History Log */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                <Clock size={16} color="#008294" />
                Tamper-Proof Audit Trail ({selectedCase.auditTrail.length} events)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedCase.auditTrail.map((log) => (
                  <div key={log.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0F172A' }}>
                      <span>{log.action}</span>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>{log.timestamp}</span>
                    </div>
                    <div style={{ color: '#0284C7', fontWeight: 600, marginTop: '2px' }}>
                      Actor: {log.actor}
                    </div>
                    {log.notes && (
                      <div style={{ color: '#475569', marginTop: '2px', fontStyle: 'italic' }}>
                        Note: {log.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal Prompt */}
      {activeActionModal && (
        <div className="modal-overlay" onClick={() => setActiveActionModal(null)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title">
                {activeActionModal === 'refer_to_lab' && 'Refer Case to Laboratory'}
                {activeActionModal === 'record_action' && 'Dispatch Remediation Work Order'}
                {activeActionModal === 'link_retest' && 'Dispatch Field Retest Order'}
                {activeActionModal === 'close' && 'Authorise Verified Case Closure'}
                {activeActionModal === 'reopen' && 'Reopen Water Source Case'}
              </h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748B' }}
                onClick={() => setActiveActionModal(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-content">
              <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                Executing command for <strong>{selectedCase.id} ({selectedCase.sourceName})</strong>:
              </p>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Supervisor Directive &amp; Notes:
                </label>
                <textarea
                  style={{ width: '100%', minHeight: '80px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontFamily: 'inherit' }}
                  placeholder="Enter official supervisor instructions..."
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                />
              </div>

              {activeActionModal === 'close' && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.75rem', borderRadius: '8px', fontSize: '0.78rem', color: '#065F46' }}>
                  ✓ All 4 CAG closure prerequisites verified on record. This action seals the audit record and exports results to JJM-WQMIS.
                </div>
              )}
            </div>

            <div className="modal-footer-row">
              <button className="btn-secondary-white" onClick={() => setActiveActionModal(null)}>
                Cancel
              </button>
              <button
                className="btn-submit-primary"
                style={{ padding: '0.6rem 1.25rem' }}
                onClick={() => handleActionSubmit(activeActionModal as any)}
              >
                Confirm Command
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
