import React, { useState, useEffect } from 'react'
import type { IncidentSummary } from '../../types'
import { patchIncidentStatus } from '../../services/api'

interface FieldOpsViewProps {
  incidents: IncidentSummary[]
  onSelectIncident: (incident: IncidentSummary) => void
  onRefresh: () => void
}

export const FieldOpsView: React.FC<FieldOpsViewProps> = ({
  incidents,
  onSelectIncident,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED'>('ALL')
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [resolutionNote, setResolutionNote] = useState<string>('')
  const [activeResolvingId, setActiveResolvingId] = useState<string | null>(null)

  // Immediately refresh incidents upon opening Field Ops Portal
  useEffect(() => {
    onRefresh()
  }, [])

  // Filter incidents for field operations - ALL shows all incidents including newly logged frames
  const fieldIncidents = incidents.filter((inc) => {
    if (filter === 'ALL') return true
    return inc.status === filter
  })

  const handleAssignWork = async (incidentId: string) => {
    try {
      setSubmittingId(incidentId)
      await patchIncidentStatus(incidentId, 'ASSIGNED', 'Assigned to Field Ops Crew for remediation')
      onRefresh()
    } catch (err: any) {
      alert(`Failed to assign: ${err.message || err}`)
    } finally {
      setSubmittingId(null)
    }
  }

  const handleResolve = async (incidentId: string) => {
    try {
      setSubmittingId(incidentId)
      await patchIncidentStatus(incidentId, 'RESOLVED', resolutionNote || 'Resolved by Field Ops Crew')
      setActiveResolvingId(null)
      setResolutionNote('')
      onRefresh()
    } catch (err: any) {
      alert(`Failed to resolve: ${err.message || err}`)
    } finally {
      setSubmittingId(null)
    }
  }

  const handleStartWork = async (incidentId: string) => {
    try {
      setSubmittingId(incidentId)
      await patchIncidentStatus(incidentId, 'IN_PROGRESS', 'Field crew dispatched on-site')
      onRefresh()
    } catch (err: any) {
      alert(`Failed to update status: ${err.message || err}`)
    } finally {
      setSubmittingId(null)
    }
  }

  const openGoogleMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '50px' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
              Field Operations & Resolution Portal
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: '4px 0 0 0' }}>
            Field official dispatch, on-site GPS navigation, evidence inspection, and work order closure.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(['ALL', 'NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as const).map((f) => {
            const count = incidents.filter((inc) => (f === 'ALL' ? true : inc.status === f)).length
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid var(--border)',
                  backgroundColor: filter === f ? 'var(--primary)' : 'var(--surface)',
                  color: filter === f ? 'var(--bg)' : 'var(--text-2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{f === 'NEW' ? 'NEW (UNASSIGNED)' : f.replace('_', ' ')}</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '10px',
                    backgroundColor: filter === f ? 'rgba(255,255,255,0.25)' : 'var(--surface-3)',
                    color: filter === f ? 'var(--bg)' : 'var(--text-2)',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Incident List Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {fieldIncidents.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              backgroundColor: 'var(--surface)',
              borderRadius: '10px',
              padding: '40px',
              textAlign: 'center',
              border: '1px solid var(--border)',
              color: 'var(--text-3)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--border)' }}>
              assignment_turned_in
            </span>
            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '8px', color: 'var(--text-1)' }}>
              No Work Orders in this Category
            </div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>
              Select "All" or check back when new road repairs are assigned to the field.
            </div>
          </div>
        ) : (
          fieldIncidents.map((inc) => (
            <div
              key={inc.incident_id}
              className="cv-card"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                {/* Header: ID + Status + Severity */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: 'var(--text-2)' }}>
                    {inc.incident_id}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: inc.severity === 'Critical' ? 'var(--danger-subtle)' : inc.severity === 'High' ? 'var(--warning-subtle)' : 'var(--warning-subtle)',
                        color: inc.severity === 'Critical' ? 'var(--danger)' : inc.severity === 'High' ? 'var(--warning)' : 'var(--warning)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {inc.severity}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: inc.status === 'RESOLVED' ? 'var(--success-subtle)' : 'var(--surface-2)',
                        color: inc.status === 'RESOLVED' ? 'var(--success)' : 'var(--text-2)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {inc.status}
                    </span>
                  </div>
                </div>

                {/* Anomaly Title */}
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-1)', marginTop: '8px' }}>
                  {inc.anomaly_type}
                </div>

                {/* Location & Time Info */}
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>📍 Lat: {inc.latitude.toFixed(5)}, Lon: {inc.longitude.toFixed(5)}</div>
                  <div>🕒 Reported: {new Date(inc.first_detected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div>🚌 Multi-Bus Confirmations: {inc.confirmation_count}</div>
                </div>

                {/* Snapshot preview if available */}
                {inc.primary_image_url && (
                  <div style={{ marginTop: '10px', aspectRatio: '16 / 9', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#0b1c30', position: 'relative' }}>
                    <img
                      src={inc.primary_image_url}
                      alt="Hazard Evidence"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '8px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(11, 28, 48, 0.75)',
                        backdropFilter: 'blur(4px)',
                        color: '#34d399',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '10px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                      <span>ONBOARD SNAPSHOT</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openGoogleMaps(inc.latitude, inc.longitude)}
                    className="btn-secondary"
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>navigation</span>
                    <span>Navigate</span>
                  </button>

                  <button
                    onClick={() => onSelectIncident(inc)}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                  >
                    Details
                  </button>
                </div>

                {/* Status Advancement: Assign to Field Crew */}
                {(inc.status === 'NEW' || inc.status === 'VERIFIED') && (
                  <button
                    disabled={submittingId === inc.incident_id}
                    onClick={() => handleAssignWork(inc.incident_id)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', gap: '4px', padding: '8px', fontSize: '12px', fontWeight: 700 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>assignment_ind</span>
                    <span>{submittingId === inc.incident_id ? 'Assigning...' : 'Assign to Field Crew'}</span>
                  </button>
                )}

                {/* Status Advancement: Start Work */}
                {inc.status === 'ASSIGNED' && (
                  <button
                    disabled={submittingId === inc.incident_id}
                    onClick={() => handleStartWork(inc.incident_id)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid var(--warning)',
                      backgroundColor: 'var(--warning-subtle)',
                      color: 'var(--warning)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {submittingId === inc.incident_id ? 'Updating...' : 'Start Work (Mark In-Progress)'}
                  </button>
                )}

                {inc.status === 'IN_PROGRESS' && (
                  <div>
                    {activeResolvingId === inc.incident_id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <input
                          type="text"
                          placeholder="Resolution note (e.g. cold mix patched)"
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          style={{
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                            fontSize: '12px',
                            backgroundColor: 'var(--surface-2)',
                            color: 'var(--text-1)',
                          }}
                        />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            disabled={submittingId === inc.incident_id}
                            onClick={() => handleResolve(inc.incident_id)}
                            style={{
                              flex: 1,
                              padding: '6px',
                              borderRadius: '4px',
                              border: '1px solid var(--success)',
                              backgroundColor: 'var(--success-subtle)',
                              color: 'var(--success)',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Confirm Resolved
                          </button>
                          <button
                            onClick={() => setActiveResolvingId(null)}
                            className="btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveResolvingId(inc.incident_id)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid var(--success)',
                          backgroundColor: 'var(--success-subtle)',
                          color: 'var(--success)',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Complete & Mark Resolved
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
