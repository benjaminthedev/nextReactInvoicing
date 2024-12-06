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

// Initialize QueryClient
const queryClient = new QueryClient()

// Get Clerk publishable key from environment variable
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function App() {

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              
              <Route path="/" element={
                <>
                  <SignedIn>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              } />
              
              <Route path="/invoices" element={
                <SignedIn>
                  <Layout>
                    <InvoicesPage />
                  </Layout>
                </SignedIn>
              } />
              
              <Route path="/customers" element={
                <SignedIn>
                  <Layout>
                    <div>Customers</div>
                  </Layout>
                </SignedIn>
              } />
              
              <Route path="/settings" element={
                <SignedIn>
                  <Layout>
                    <div>Settings</div>
                  </Layout>
                </SignedIn>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default App