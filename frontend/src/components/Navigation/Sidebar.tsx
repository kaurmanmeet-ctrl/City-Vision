import React from 'react'

export type NavTab = 'home' | 'live-detection' | 'road-map' | 'transport-authority' | 'field-ops' | 'reports' | 'bus-fleet' | 'analytics'
export type UserRole = 'command_center' | 'transport_authority' | 'field_official'

interface SidebarProps {
  activeTab: NavTab
  onSelectTab: (tab: NavTab) => void
  activeBusesCount: number
  isScanProcessing?: boolean
  scanEventsCount?: number
  activeRole?: UserRole
  isCollapsed: boolean
  onToggleCollapse: () => void
}

interface NavItem {
  id: NavTab
  label: string
  icon: string
  badge?: string
  roles?: UserRole[]
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'grid_view', roles: ['command_center'] },
  { id: 'live-detection', label: 'Live Detection', icon: 'videocam', badge: 'LIVE', roles: ['command_center'] },
  { id: 'road-map', label: 'Road Map', icon: 'map', roles: ['command_center'] },
  { id: 'reports', label: 'Reports', icon: 'assignment_late', roles: ['command_center', 'transport_authority'] },
  { id: 'bus-fleet', label: 'Bus Fleet', icon: 'directions_bus', roles: ['command_center', 'transport_authority'] },
  { id: 'analytics', label: 'Analytics', icon: 'insights', roles: ['command_center', 'transport_authority'] },
  { id: 'transport-authority', label: 'Transport Hub', icon: 'traffic', roles: ['command_center', 'transport_authority'] },
  { id: 'field-ops', label: 'Field Ops', icon: 'handyman', roles: ['command_center', 'field_official'] },
]

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeBusesCount,
  isScanProcessing,
  scanEventsCount = 0,
  activeRole = 'command_center',
  isCollapsed,
  onToggleCollapse,
}) => {
  const visibleNavItems = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(activeRole))

  return (
    <aside
      id="app-sidebar"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: isCollapsed ? 'var(--sidebar-collapsed-width, 64px)' : 'var(--sidebar-width, 240px)',
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Brand Header */}
        <div
          style={{
            height: '60px',
            padding: isCollapsed ? '0' : '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: 0,
              cursor: 'pointer',
            }}
            onClick={() => onSelectTab('home')}
            title="City Vision AI"
          >
            {/* Minimal Brand Monogram */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'var(--text-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--bg)',
                  letterSpacing: '-0.02em',
                }}
              >
                CV
              </span>
            </div>

            {!isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--text-1)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    whiteSpace: 'nowrap',
                  }}
                >
                  CITY VISION
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 600,
                    color: 'var(--text-3)',
                    letterSpacing: '0.08em',
                    marginTop: '1px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  AI ROAD MONITOR
                </span>
              </div>
            )}
          </div>

          {/* Sidebar Collapse Toggle Button */}
          <button
            id="sidebar-toggle-btn"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-3)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-1)'
              e.currentTarget.style.backgroundColor = 'var(--surface-2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-3)'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '18px',
                transform: isCollapsed ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            >
              keyboard_double_arrow_left
            </span>
          </button>
        </div>

        {/* Navigation Category Label */}
        {!isCollapsed && (
          <div style={{ padding: '14px 16px 6px 16px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--text-3)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Navigation
            </span>
          </div>
        )}

        {/* Nav Links */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            padding: isCollapsed ? '10px 8px' : '6px 10px',
          }}
        >
          {visibleNavItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '9px 0' : '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--surface-2)' : 'transparent',
                  color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                  textAlign: 'left',
                  width: '100%',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--surface-2)'
                    e.currentTarget.style.color = 'var(--text-1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--text-2)'
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '18px',
                      color: isActive ? 'var(--text-1)' : 'var(--text-3)',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                  )}
                </div>

                {!isCollapsed && item.id === 'live-detection' && isScanProcessing ? (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 700,
                      backgroundColor: 'var(--danger)',
                      color: '#ffffff',
                      padding: '2px 5px',
                      borderRadius: 'var(--radius-xs)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                    <span>{scanEventsCount}</span>
                  </span>
                ) : !isCollapsed && item.badge ? (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 600,
                      backgroundColor: isActive ? 'var(--surface-3)' : 'var(--surface-2)',
                      color: 'var(--text-2)',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {item.badge}
                  </span>
                ) : isCollapsed && item.id === 'live-detection' && isScanProcessing ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '8px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--danger)',
                    }}
                  />
                ) : null}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Telemetry Widget Footer */}
      <div
        style={{
          margin: isCollapsed ? '8px' : '12px',
          padding: isCollapsed ? '10px 4px' : '12px 14px',
          backgroundColor: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isCollapsed ? 'center' : 'stretch',
        }}
        title={isCollapsed ? `RT-STREAM // ACTIVE • ${activeBusesCount || 24} vehicles syncing GIS payloads.` : undefined}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', marginBottom: isCollapsed ? 0 : '4px' }}>
          {!isCollapsed && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9.5px',
                fontWeight: 600,
                color: 'var(--text-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Telemetry Feed
            </span>
          )}
          <span
            className="radar-ping"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--success)',
              display: 'inline-block',
            }}
          />
        </div>
        
        {!isCollapsed && (
          <>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-1)',
                letterSpacing: '0.02em',
              }}
            >
              RT-STREAM // ACTIVE
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                color: 'var(--text-3)',
                marginTop: '3px',
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {activeBusesCount || 24} vehicles syncing GIS payloads.
            </p>
          </>
        )}
      </div>
    </aside>
  )
}
