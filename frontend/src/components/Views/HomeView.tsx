import React, { useState, useMemo } from 'react'
import type { AnalyticsSummary, IncidentSummary, BusSummary } from '../../types'
import { MONITORED_ROUTES, SEED_ANALYTICS, SEED_RECENT_INCIDENTS } from '../../services/seedData'
import type { NavTab } from '../Navigation/Sidebar'

interface HomeViewProps {
  analytics: AnalyticsSummary | null
  incidents: IncidentSummary[]
  buses: BusSummary[]
  onNavigateTab: (tab: NavTab) => void
  onSelectIncident: (incident: IncidentSummary) => void
}

export const HomeView: React.FC<HomeViewProps> = ({
  analytics,
  incidents,
  buses,
  onNavigateTab,
  onSelectIncident,
}) => {
  const [selectedCam, setSelectedCam] = useState<string>('CAM-04')
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true)
  const [filterQuery, setFilterQuery] = useState<string>('')

  // Data bindings with smart seed fallback
  const activeBusesCount = buses.length || analytics?.active_buses || SEED_ANALYTICS.active_buses
  const activeIncidents = incidents.length > 0 ? incidents : SEED_RECENT_INCIDENTS

  // Top 4 items for the Triage Queue
  const triageQueueItems = useMemo(() => {
    return activeIncidents.slice(0, 4)
  }, [activeIncidents])

  // Filtered records for the incident & telemetry stream table
  const streamRecords = useMemo(() => {
    if (!filterQuery.trim()) return activeIncidents.slice(0, 8)
    const q = filterQuery.toLowerCase()
    return activeIncidents.filter(
      (incidentItem) =>
        incidentItem.incident_id.toLowerCase().includes(q) ||
        incidentItem.anomaly_type.toLowerCase().includes(q) ||
        incidentItem.severity.toLowerCase().includes(q) ||
        incidentItem.status.toLowerCase().includes(q)
    )
  }, [activeIncidents, filterQuery])

  // Human friendly defect labels
  const getDefectName = (type: string, severity: string) => {
    if (type === 'Pothole') return severity === 'Critical' ? 'Structural Pothole Hazard' : 'Pothole Depression'
    if (type === 'Crack-Severe') return 'Severe Transverse Crack'
    if (type === 'Crack') return 'Longitudinal Joint Deterioration'
    if (type === 'Speed-Bump') return 'Speed Bump Profile Deformation'
    return 'Manhole Rim Subsidence'
  }

  // Human readable corridor location based on coordinates or ID
  const getLocationName = (_inc: IncidentSummary, idx: number) => {
    const locations = [
      'NH-24 Arterial Expwy (Ch. 14+200, Lane 2)',
      'Outer Ring Rd (Near Flyover Junction 4)',
      'Sector 62 Main Commercial Corridor',
      'MG Road Overpass Eastbound',
      'Barakhamba Rd (Inter. Connaught)',
      'Ring Road Southbound Ch. 8+400',
      'Vikas Marg Transit Corridor',
      'Mathura Road Elevated Segment',
    ]
    return locations[idx % locations.length]
  }

  const getPciImpact = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return '-14.2'
      case 'high':
        return '-8.5'
      case 'medium':
        return '-4.1'
      default:
        return '-1.2'
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'NEW':
        return { label: 'Pending Dispatch', color: 'var(--danger)' }
      case 'VERIFIED':
        return { label: 'Queued', color: 'var(--warning)' }
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        return { label: 'Confirmed', color: 'var(--secondary)' }
      case 'RESOLVED':
        return { label: 'Resolved', color: 'var(--success)' }
      default:
        return { label: 'Active', color: 'var(--text-2)' }
    }
  }

  const getSeverityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return 'var(--danger)'
      case 'high':
        return 'var(--warning)'
      case 'medium':
        return 'var(--text-1)'
      default:
        return 'var(--text-3)'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Top Split Row: Video Live Monitor (Left) & Triage Queue (Right) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.55fr) minmax(360px, 1fr)',
          gap: '20px',
          alignItems: 'stretch',
        }}
      >
        {/* Left: Video Canvas Container */}
        <div
          className="cv-card"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#111317',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Video Viewport Area */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9.6',
              backgroundColor: '#0a0c10',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Real MP4 Video Loop */}
            <video
              src="/patrol_route12.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.92,
                display: 'block',
              }}
            />

            {/* Video Top Strip: Bus ID & Quality Pill */}
            <div
              style={{
                position: 'absolute',
                top: '14px',
                left: '16px',
                right: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pointerEvents: 'none',
              }}
            >
              {/* Bus Cam Tag */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(18, 20, 26, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 8px #10B981',
                  }}
                />
                <span style={{ fontWeight: 700 }}>BUS-{selectedCam}</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>/</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>ARTERIAL-12</span>
              </div>

              {/* Resolution / FPS Indicator */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(18, 20, 26, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <span>1080p · 48 fps</span>
              </div>
            </div>

            {/* YOLO Anomaly Detection Bounding Reticle (Reference Match) */}
            <div
              style={{
                position: 'absolute',
                top: '46%',
                left: '36%',
                width: '185px',
                height: '115px',
                border: '1.5px solid rgba(34, 197, 94, 0.85)',
                backgroundColor: 'rgba(34, 197, 94, 0.08)',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '6px 8px',
                pointerEvents: 'none',
                boxShadow: '0 0 16px rgba(34, 197, 94, 0.15)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span>Pothole (92%)</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  alignSelf: 'flex-end',
                }}
              >
                Vol: 0.041m³
              </div>
            </div>
          </div>

          {/* Video Bottom Control Bar */}
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: 'var(--surface)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            {/* Status & Sector Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-1)',
                }}
              >
                Central Arterial - Zone 4B
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-3)',
                }}
              >
                99.85% uptime
              </span>
            </div>

            {/* Quick Actions (Pause, Camera Select, Fullscreen) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                id="cam-select-compact"
                value={selectedCam}
                onChange={(e) => setSelectedCam(e.target.value)}
                style={{
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-1)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="CAM-04">CAM-04 (NH-24)</option>
                <option value="CAM-02">CAM-02 (Ring Rd)</option>
                <option value="CAM-08">CAM-08 (Sec 62)</option>
                <option value="CAM-01">CAM-01 (MG Rd)</option>
              </select>

              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                title={isVideoPlaying ? 'Pause feed' : 'Resume feed'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-2)',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {isVideoPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => onNavigateTab('live-detection')}
                title="Inspect in Live Patrol"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-2)',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  photo_camera
                </span>
              </button>

              <button
                onClick={() => onNavigateTab('live-detection')}
                title="Expand Fullscreen"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-2)',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  fullscreen
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Triage Queue (Matching Reference Image) */}
        <div
          className="cv-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px',
            backgroundColor: 'var(--surface)',
          }}
        >
          <div>
            {/* Header: Title + Subtitle + Pending Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-1)',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Triage Queue
                </h2>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-3)',
                    marginTop: '2px',
                    display: 'block',
                  }}
                >
                  ASTM D6433 defect log
                </span>
              </div>

              <div
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-2)',
                }}
              >
                4 pending
              </div>
            </div>

            {/* Incident Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '16px' }}>
              {triageQueueItems.map((item, idx) => {
                const title = getDefectName(item.anomaly_type, item.severity)
                const location = getLocationName(item, idx)
                const times = ['10:24 AM', '10:18 AM', '09:40 AM', '09:12 AM']
                const time = times[idx % times.length]
                const sevColor = getSeverityColor(item.severity)

                return (
                  <div
                    key={item.incident_id || idx}
                    onClick={() => onSelectIncident(item)}
                    style={{
                      cursor: 'pointer',
                      paddingBottom: '12px',
                      borderBottom: idx < triageQueueItems.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--text-1)',
                        }}
                      >
                        {item.incident_id.replace('CV-000', 'CV-00')}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10.5px',
                          color: 'var(--text-3)',
                        }}
                      >
                        {time}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--text-1)',
                        }}
                      >
                        {title}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: sevColor,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11.5px',
                        color: 'var(--text-3)',
                        margin: '2px 0 0 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {location}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom Action Buttons (Audit All + Dispatch Orders) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <button
              id="btn-audit-all"
              className="btn-secondary"
              onClick={() => onNavigateTab('reports')}
              style={{
                flex: 1,
                fontSize: '12.5px',
                padding: '9px 12px',
                justifyContent: 'center',
                fontWeight: 600,
              }}
            >
              Audit All (4)
            </button>
            <button
              id="btn-dispatch-orders"
              className="btn-primary"
              onClick={() => onNavigateTab('reports')}
              style={{
                flex: 1.2,
                fontSize: '12.5px',
                padding: '9px 14px',
                justifyContent: 'center',
                fontWeight: 600,
              }}
            >
              Dispatch Orders
            </button>
          </div>
        </div>
      </section>

      {/* 2. Bottom Full-Width Table: Incident & Telemetry Stream */}
      <section
        className="cv-card"
        style={{
          padding: '20px',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Table Header: Title + Probe Count + Search & Refresh */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--text-1)',
                margin: 0,
              }}
            >
              Incident & Telemetry Stream
            </h2>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-3)',
              }}
            >
              {activeBusesCount || 24} active probes
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Filter records search input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                width: '200px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--text-3)' }}>
                search
              </span>
              <input
                type="text"
                placeholder="Filter records..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  color: 'var(--text-1)',
                  width: '100%',
                }}
              />
            </div>

            <button
              onClick={() => setFilterQuery('')}
              title="Refresh / Reset Filter"
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '5px 8px',
                cursor: 'pointer',
                color: 'var(--text-2)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                refresh
              </span>
            </button>
          </div>
        </div>

        {/* Swiss Modernist Tabular Data */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontFamily: 'var(--font-sans)',
              fontSize: '12.5px',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-3)', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-3)', fontWeight: 600 }}>Defect</th>
                <th style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-3)', fontWeight: 600 }}>Location</th>
                <th style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-3)', fontWeight: 600 }}>Probe</th>
                <th style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-3)', fontWeight: 600 }}>PCI Impact</th>
                <th style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-3)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-3)', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {streamRecords.map((rec, idx) => {
                const statusInfo = getStatusDisplay(rec.status)
                const defect = getDefectName(rec.anomaly_type, rec.severity)
                const loc = getLocationName(rec, idx)
                const probe = `CAM-0${(idx % 8) + 1}`
                const pciImpact = getPciImpact(rec.severity)
                const isNew = rec.status === 'NEW'

                return (
                  <tr
                    key={rec.incident_id || idx}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background-color 0.12s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* ID */}
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-1)' }}>
                      {rec.incident_id.replace('CV-000', 'CV-00')}
                    </td>

                    {/* Defect */}
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-1)' }}>
                      {defect}
                    </td>

                    {/* Location */}
                    <td style={{ padding: '12px', color: 'var(--text-2)' }}>
                      {loc}
                    </td>

                    {/* Probe */}
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
                      {probe}
                    </td>

                    {/* PCI Impact */}
                    <td
                      style={{
                        padding: '12px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        color: rec.severity === 'Critical' ? 'var(--danger)' : 'var(--text-2)',
                      }}
                    >
                      {pciImpact}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: statusInfo.color,
                          }}
                        />
                        <span style={{ color: 'var(--text-1)', fontSize: '12px' }}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => onSelectIncident(rec)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: isNew ? 'var(--text-1)' : 'var(--text-3)',
                          textDecoration: 'underline',
                          textUnderlineOffset: '3px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = isNew ? 'var(--text-1)' : 'var(--text-3)')}
                      >
                        {isNew ? 'Dispatch' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Minimalist Performance & Corridor Strip (Compact, Decluttered) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        {MONITORED_ROUTES.map((rt) => (
          <div
            key={rt.route_id}
            className="cv-card"
            style={{
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>
                {rt.name.split(' (')[0]}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: rt.score >= 70 ? 'var(--success)' : 'var(--warning)',
                }}
              >
                PCI {rt.score}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-3)' }}>
              <span>{rt.active_buses} Active Units</span>
              <span>{rt.degraded_zones} Hazards Logged</span>
            </div>

            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--surface-3)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${rt.score}%`,
                  backgroundColor: rt.score >= 70 ? 'var(--success)' : 'var(--warning)',
                  borderRadius: '9999px',
                }}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
