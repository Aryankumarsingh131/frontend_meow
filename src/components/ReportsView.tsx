import { useState } from 'react';
import {
  BarChart3,
  Download,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  Layers,
  Sparkles,
} from 'lucide-react';
import { initialWaterParameters } from '../data';

export default function ReportsView() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2025-Q1');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExportWQMIS = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('JJM-WQMIS Standard Format XML/CSV dataset successfully exported!');
    }, 1000);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
            District Water Quality &amp; Compliance Analytics
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
            Bureau of Indian Standards (BIS 10500:2012) &amp; JJM-WQMIS Automated Reporting
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: '#FFFFFF',
            }}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="2025-Q1">Q1 2025 (Jan – Mar)</option>
            <option value="2025-Q2">Q2 2025 (Apr – Jun)</option>
            <option value="2024-ANNUAL">2024 Full Year Audit</option>
          </select>

          <button
            className="btn-submit-primary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}
            onClick={handleExportWQMIS}
            disabled={isExporting}
          >
            <Download size={16} />
            <span>{isExporting ? 'Generating...' : 'Export JJM-WQMIS Batch'}</span>
          </button>
        </div>
      </div>

      {/* Compliance Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div className="stat-kpi-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}>
            <Droplet size={24} />
          </div>
          <div>
            <div className="stat-metric-number">4,812</div>
            <div className="stat-metric-title">Total Tests Synchronized</div>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-metric-number">94.2%</div>
            <div className="stat-metric-title">BIS 10500 Compliance</div>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-metric-number">281</div>
            <div className="stat-metric-title">Contamination Alerts</div>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#EDE9FE', color: '#6D28D9' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div className="stat-metric-number">97.8%</div>
            <div className="stat-metric-title">AI Optical Confidence</div>
          </div>
        </div>
      </div>

      {/* Parameter Compliance Deep Dive */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.25rem' }}>
        {/* Left: Parameter Pass Rates */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="#008294" />
            Parameter Compliance Rates vs National Standards
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {initialWaterParameters.map((p) => (
              <div key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  <span>{p.name} ({p.standard})</span>
                  <span style={{ color: '#059669' }}>96.5% Passed</span>
                </div>
                <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '96.5%', height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Field Testing Kits (FTK) Statistics */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="#008294" />
            Jal Jeevan Mission FTK Metrics
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
            <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 800, color: '#0F172A' }}>24.8 Lakh Trained Women Testers</div>
              <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '2px' }}>
                National target for grassroot community surveillance empowerment.
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 800, color: '#0F172A' }}>47.59 Lakh Tests Reported (2025–26)</div>
              <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '2px' }}>
                Up from 93.84 lakh cumulative tests in prior cycle.
              </div>
            </div>

            <div style={{ background: '#ECFDF5', padding: '0.75rem', borderRadius: '10px', border: '1px solid #A7F3D0', color: '#065F46' }}>
              <div style={{ fontWeight: 800 }}>CAG Audit Compliance Ready</div>
              <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                Every adverse result is cryptographically bound to a 24-48h lab referral timer.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
