import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Skeleton } from './components/ui/Skeleton'

const IntroPage = lazy(() => import('./pages/IntroPage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'))
const EnlistPage = lazy(() => import('./pages/EnlistPage'))

function PageLoader() {
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-full w-full" />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <IntroPage />
          </Suspense>
        ),
      },
      {
        path: 'explore',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ExplorePage />
          </Suspense>
        ),
      },
      {
        path: 'explore/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JobDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'enlist',
        element: (
          <Suspense fallback={<PageLoader />}>
            <EnlistPage />
          </Suspense>
        ),
      },
    ],
  },
])
