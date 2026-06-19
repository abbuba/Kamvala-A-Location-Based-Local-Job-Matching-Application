import { useNavigate } from 'react-router-dom'

const cards = [
  {
    to: '/explore',
    title: 'Find a Job',
    subtitle: 'Browse nearby openings',
    gradient: 'from-blue-500 to-blue-600',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="white" strokeWidth="1.5" />
        <circle cx="12" cy="9" r="2.5" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    to: '/enlist',
    title: 'Enlist Shop',
    subtitle: 'Post a help-wanted listing',
    gradient: 'from-orange-400 to-orange-500',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 9h16v11H4V9z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 9V7a4 4 0 118 0v2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function IntroPage() {
  const navigate = useNavigate()

  return (
    <div className="ios-screen flex h-full flex-col justify-between px-5 pb-8 pt-6">
      <div className="flex flex-col items-center pt-10 text-center">
        <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
          <span className="text-3xl font-bold text-white">K</span>
        </div>
        <h1 className="ios-large-title">Kamvala</h1>
        <p className="ios-subtitle mt-2 max-w-[280px]">
          Local jobs in Hyderabad — connect with shops hiring right around the corner.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <button
            key={card.to}
            type="button"
            onClick={() => navigate(card.to)}
            className="flex aspect-square flex-col items-start justify-between rounded-[20px] bg-white p-4 text-left shadow-sm transition-transform active:scale-[0.97]"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-sm`}>
              {card.icon}
            </div>
            <div>
              <span className="block text-[15px] font-semibold text-kamvala-text">{card.title}</span>
              <span className="mt-0.5 block text-[12px] leading-tight text-kamvala-muted">{card.subtitle}</span>
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-[13px] text-kamvala-muted">
        No LinkedIn needed — just local work, local shops.
      </p>
    </div>
  )
}
