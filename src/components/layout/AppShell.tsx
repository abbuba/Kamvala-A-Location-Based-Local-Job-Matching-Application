import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useListingsContext } from '../../context/ListingsContext'

function ExploreIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={active ? '#007AFF' : 'none'}
        stroke={active ? '#007AFF' : '#8E8E93'}
        strokeWidth="1.5"
      />
      <circle cx="12" cy="9" r="2.5" fill={active ? '#fff' : 'none'} stroke={active ? '#fff' : '#8E8E93'} strokeWidth="1.5" />
    </svg>
  )
}

function EnlistIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 9h16v11H4V9z"
        fill={active ? '#007AFF' : 'none'}
        stroke={active ? '#007AFF' : '#8E8E93'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 9V7a4 4 0 118 0v2"
        stroke={active ? '#007AFF' : '#8E8E93'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const tabs = [
  { to: '/explore', label: 'Explore', Icon: ExploreIcon },
  { to: '/enlist', label: 'Enlist', Icon: EnlistIcon },
]

export function AppShell() {
  const location = useLocation()
  const { refreshListings } = useListingsContext()
  const isDetail = /\/explore\/.+/.test(location.pathname)
  const isIntro = location.pathname === '/'

  return (
    <div className="flex h-full flex-col bg-kamvala-gray">
      <main className="flex-1 overflow-hidden">
        <div key={location.pathname} className="page-enter h-full">
          <Outlet />
        </div>
      </main>

      {!isDetail && !isIntro && (
        <nav className="ios-tab-bar flex shrink-0 pb-1 pt-1" aria-label="Main navigation">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              onClick={() => {
                if (tab.to === '/explore') refreshListings()
              }}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium ${isActive ? 'text-kamvala-blue' : 'text-kamvala-muted'}`
              }
            >
              {({ isActive }) => (
                <>
                  <tab.Icon active={isActive} />
                  {tab.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
