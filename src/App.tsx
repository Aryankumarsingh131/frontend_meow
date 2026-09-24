import { useState } from 'react';
import {
  Droplet,
  Smartphone,
  Monitor,
  FolderKanban,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import type { ScreenMode, TestCase } from './types';
import { initialCases } from './data';
import SupervisorCasesView from './components/SupervisorCasesView';
import ReportsView from './components/ReportsView';
import MobileFrame from './components/MobileFrame';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('supervisor-cases');
  const [isFluidMode, setIsFluidMode] = useState<boolean>(true);
  const [cases, setCases] = useState<TestCase[]>(initialCases);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(initialCases[0].id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleExecuteCaseCommand = (
    caseId: string,
    commandType: 'refer_to_lab' | 'record_action' | 'link_retest' | 'close' | 'reopen',
    details: any
  ) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;

        const timestamp = 'Just now';
        let newStatus = c.status;
        let actionDesc = '';

        if (commandType === 'refer_to_lab') {
          newStatus = 'awaiting_lab';
          actionDesc = `Referred to Sadar Sub-Divisional Laboratory. ${details.notes || ''}`;
        } else if (commandType === 'record_action') {
          newStatus = 'action_required';
          actionDesc = `Remediation directive dispatched to PHED / Jal Nigam. ${details.notes || ''}`;
        } else if (commandType === 'link_retest') {
          newStatus = 'retest_due';
          actionDesc = `Follow-up retest scheduled with local FTK operator. ${details.notes || ''}`;
        } else if (commandType === 'close') {
          newStatus = 'closed';
          actionDesc = `Case verified & closed under JJM G-CLOSE audit gate. ${details.notes || ''}`;
        } else if (commandType === 'reopen') {
          newStatus = 'review_needed';
          actionDesc = `Case reopened with new evidence. ${details.notes || ''}`;
        }

        const newAudit = [
          {
            id: `aud-${Date.now()}`,
            timestamp,
            actor: details.actor || 'Dr. A. K. Sharma (District Supervisor)',
            action: actionDesc,
            type: commandType as any,
            notes: details.notes,
          },
          ...c.auditTrail,
        ];

        return {
          ...c,
          status: newStatus,
          auditTrail: newAudit,
          labDetails:
            commandType === 'refer_to_lab'
              ? {
                  labName: 'District Central Water Testing Lab, Sadar',
                  assignedAt: 'Today, Just now',
                  turnaroundTarget: '24 Hours',
                  reportNumber: 'NABL-REQ-' + Math.floor(1000 + Math.random() * 9000),
                  isVerified: false,
                }
              : c.labDetails,
          remediation:
            commandType === 'record_action'
              ? {
                  actionPlan: details.notes || 'Emergency super-chlorination and apron repair',
                  assignedTo: 'Jal Nigam Engineering Circle',
                  accepted: true,
                }
              : c.remediation,
          retest:
            commandType === 'link_retest'
              ? {
                  scheduledDate: 'Tomorrow, 09:00 AM',
                  retestSampleId: 'SMP-2025-' + Math.floor(1000 + Math.random() * 9000),
                  result: 'Clean field verification scheduled',
                  isPassed: true,
                }
              : c.retest,
        };
      })
    );

    showToast(`Command [${commandType}] executed successfully on ${caseId}!`);
  };

  return (
    <div className="app-wrapper">
      {/* Master Top Navigation Bar */}
      <header className="master-top-bar">
        <div className="brand-badge">
          <div className="brand-logo-icon">
            <Droplet size={18} fill="#FFFFFF" />
          </div>
          <span>JalSakshi</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.75, fontWeight: 600 }}>
            Supervisor Escalation Portal
          </span>
        </div>

        {/* Screen Switcher */}
        <nav className="nav-tabs-container">
          <button
            className={`nav-tab-btn ${currentScreen === 'supervisor-cases' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('supervisor-cases')}
          >
            <FolderKanban size={15} />
            <span>Active Cases Queue &amp; CAG Compliance</span>
          </button>

          <button
            className={`nav-tab-btn ${currentScreen === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('reports')}
          >
            <BarChart3 size={15} />
            <span>BIS 10500 Reports &amp; WQMIS</span>
          </button>
        </nav>

        {/* View Layout Controls */}
        <div className="top-bar-actions">
          <button
            className="view-toggle-btn"
            onClick={() => setIsFluidMode(!isFluidMode)}
            title="Toggle between Mobile Device Simulation and Full Fluid Layout"
          >
            {isFluidMode ? <Smartphone size={15} /> : <Monitor size={15} />}
            <span>{isFluidMode ? 'Switch to Phone View' : 'Switch to Fluid Canvas'}</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Stage */}
      <main className={`viewport-stage ${isFluidMode ? 'fluid' : ''}`}>
        {currentScreen === 'supervisor-cases' && (
          <MobileFrame isFluidMode={isFluidMode}>
            <SupervisorCasesView
              cases={cases}
              selectedCaseId={selectedCaseId}
              onSelectCase={(c) => setSelectedCaseId(c.id)}
              onExecuteCommand={handleExecuteCaseCommand}
            />
          </MobileFrame>
        )}

        {currentScreen === 'reports' && (
          <MobileFrame isFluidMode={isFluidMode}>
            <ReportsView />
          </MobileFrame>
        )}
      </main>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-notification-banner">
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
