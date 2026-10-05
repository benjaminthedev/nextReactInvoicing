import { ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { 
  ClerkProvider, 
  SignedIn, 
  SignedOut,
  RedirectToSignIn,
} from '@clerk/clerk-react'
import Layout from './components/layout/Layout'
import InvoicesPage from './pages/invoices/InvoicesPage'
import SignUpPage from './components/auth/SignUp'
import SignInPage from './components/auth/SignIn'
import DashboardPage from './components/dashboard/DashboardPage'
import CustomersPage from './pages/customers/CustomerPage'
import SettingsPage from './pages/settings/SettingsPage'
import SalesPage from './pages/sales/SalesPage'
import { AppStoreProvider } from './lib/store'

// Initialize QueryClient
const queryClient = new QueryClient()

// Get Clerk publishable key from environment variable.
// Without it the app still runs, with sign-in skipped.
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const clerkEnabled = Boolean(clerkPubKey)

function RequireAuth({ children }: { children: ReactNode }) {
  if (!clerkEnabled) {
    return children
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

function AppRoutes() {
  return (
    <AppStoreProvider>
      <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<SalesPage />} />
            <Route
              path="/sign-in"
              element={clerkEnabled ? <SignInPage /> : <Navigate to="/dashboard" replace />}
            />
            <Route
              path="/sign-up"
              element={clerkEnabled ? <SignUpPage /> : <Navigate to="/dashboard" replace />}
            />

            <Route path="/dashboard" element={
              <RequireAuth>
                <Layout>
                  <DashboardPage />
                </Layout>
              </RequireAuth>
            } />

            <Route path="/invoices" element={
              <RequireAuth>
                <Layout>
                  <InvoicesPage />
                </Layout>
              </RequireAuth>
            } />

            <Route path="/customers" element={
              <RequireAuth>
                <Layout>
                  <CustomersPage />
                </Layout>
              </RequireAuth>
            } />

            <Route path="/settings" element={
              <RequireAuth>
                <Layout>
                  <SettingsPage />
                </Layout>
              </RequireAuth>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        </Router>
      </QueryClientProvider>
    </AppStoreProvider>
  )
}

function App() {
  if (!clerkEnabled) {
    return <AppRoutes />
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppRoutes />
    </ClerkProvider>
  )
}

export default App