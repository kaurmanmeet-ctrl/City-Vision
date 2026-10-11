import React, { useState } from 'react'
import type { ScanManager } from '../../hooks/useScanManager'
import type { NavTab, UserRole } from './Sidebar'

interface TopHeaderProps {
  activeBusesCount: number
  lastUpdated: string
  onRefreshAll: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
  scanManager?: ScanManager
  onNavigateTab?: (tab: NavTab) => void
  activeRole?: UserRole
  onRoleChange?: (role: UserRole) => void
  isDarkMode: boolean
  onToggleTheme: () => void
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeBusesCount,
  lastUpdated,
  onRefreshAll,
  searchQuery,
  onSearchChange,
  scanManager,
  onNavigateTab,
  activeRole = 'command_center',
  onRoleChange,
  isDarkMode,
  onToggleTheme,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)

  const rolesConfig: Record<UserRole, { short: string; label: string; tab: NavTab }> = {
    command_center: { short: 'TO', label: 'Ops Admin', tab: 'home' },
    transport_authority: { short: 'TA', label: 'Transit Authority', tab: 'transport-authority' },
    field_official: { short: 'FO', label: 'Field Official', tab: 'field-ops' },
  }

  const currentRoleInfo = rolesConfig[activeRole] || rolesConfig.command_center

  return (
    <header
      id="top-header"
      style={{
        position: 'fixed',
        top: 0,
        left: isSidebarCollapsed ? 'var(--sidebar-collapsed-width, 64px)' : 'var(--sidebar-width, 240px)',
        right: 0,
        height: '56px',
        backgroundColor: 'var(--navbar-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--navbar-border)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        transition: 'left 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Left: Hamburger + Breadcrumb + Status Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        {/* Toggle Hamburger / Sidebar button */}
        <button
          id="btn-header-sidebar-toggle"
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-2)',
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
            e.currentTarget.style.color = 'var(--text-2)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            menu
          </span>
        </button>

        {/* Minimalist Breadcrumb Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-1)',
            }}
          >
            Command Center
          </span>
          <span style={{ color: 'var(--text-3)', fontSize: '12px' }}>/</span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 400,
              color: 'var(--text-2)',
            }}
          >
            Road Infrastructure & Triage
          </span>
        </div>

        {/* Live Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 9px',
            backgroundColor: 'var(--surface-2)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: 'var(--success)',
          }}
        >
          <span
            className="radar-ping"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--success)',
            }}
          />
          <span>Live</span>
        </div>

        {/* Active Probes Indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 9px',
            backgroundColor: 'var(--surface-2)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            color: 'var(--text-2)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--text-3)' }}>
            directions_bus
          </span>
          <span>{activeBusesCount || 24} Probes Active</span>
        </div>
      </div>

      {/* Right Controls: Search, Scan, Theme, Role (Subtle), Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Active Scan Indicator (if running) */}
        {scanManager && scanManager.scanStatus.status === 'PROCESSING' && (
          <button
            id="header-scan-indicator"
            onClick={() => onNavigateTab?.('live-detection')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              backgroundColor: 'var(--danger-subtle)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              transition: 'all 0.15s ease',
            }}
            title="Scan currently processing — click to view"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger)',
              }}
            />
            <span>SCANNING: {scanManager.scanStatus.events_dispatched} EVTS</span>
          </button>
        )}

        {/* Global Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '5px 10px',
            width: '260px',
            transition: 'border-color 0.15s ease',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--text-3)' }}>
            search
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search anomaly, route..."
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
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-3)',
                display: 'flex',
                alignItems: 'center',
                padding: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                close
              </span>
            </button>
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-3)',
                border: '1px solid var(--border)',
                borderRadius: '3px',
                padding: '1px 4px',
                lineHeight: 1,
              }}
            >
              ⌘K
            </span>
          )}
        </div>

        {/* Refresh Sync Button */}
        <button
          id="btn-global-refresh"
          onClick={onRefreshAll}
          title={`Synced ${lastUpdated} • Click to refresh`}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 8px',
            cursor: 'pointer',
            color: 'var(--text-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-2)'
            e.currentTarget.style.color = 'var(--text-1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--text-2)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            sync
          </span>
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          id="btn-theme-toggle"
          onClick={onToggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 8px',
            cursor: 'pointer',
            color: 'var(--text-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-2)'
            e.currentTarget.style.color = 'var(--text-1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--text-2)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Icon */}
        <button
          id="btn-notifications"
          title="Notifications"
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
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-1)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            notifications
          </span>
        </button>

        {/* Subtle, Minimized Role Switcher & User Profile */}
        <div style={{ position: 'relative' }}>
          <button
            id="user-role-menu-button"
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              backgroundColor: isRoleMenuOpen ? 'var(--surface-2)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-2)'
            }}
            onMouseLeave={(e) => {
              if (!isRoleMenuOpen) e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {/* User Avatar Badge */}
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '4px',
                backgroundColor: 'var(--primary)',
                color: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              {currentRoleInfo.short}
            </div>

            {/* Subtle Label */}
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-1)',
              }}
            >
              {currentRoleInfo.label}
            </span>

            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '16px',
                color: 'var(--text-3)',
                transform: isRoleMenuOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s ease',
              }}
            >
              expand_more
            </span>
          </button>

          {/* Minimalist Dropdown for Role Switching */}
          {isRoleMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '180px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-level3)',
                padding: '4px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div
                style={{
                  padding: '6px 8px 4px 8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  color: 'var(--text-3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Switch Role Portal
              </div>

              {(Object.keys(rolesConfig) as UserRole[]).map((r) => {
                const info = rolesConfig[r]
                const isSelected = activeRole === r
                return (
                  <button
                    key={r}
                    id={`role-select-${r}`}
                    onClick={() => {
                      onRoleChange?.(r)
                      onNavigateTab?.(info.tab)
                      setIsRoleMenuOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: isSelected ? 'var(--surface-2)' : 'transparent',
                      color: isSelected ? 'var(--text-1)' : 'var(--text-2)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--surface-2)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        padding: '1px 4px',
                        borderRadius: '2px',
                        backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface-3)',
                        color: isSelected ? 'var(--bg)' : 'var(--text-2)',
                        fontWeight: 700,
                      }}
                    >
                      {info.short}
                    </span>
                    <span>{info.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
