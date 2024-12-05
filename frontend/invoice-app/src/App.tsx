import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { 
  ClerkProvider, 
  SignedIn, 
  SignedOut,
  RedirectToSignIn,
} from '@clerk/clerk-react'
import Layout from './components/layout/Layout'
import SignUpPage from './components/auth/SignUp'
import SignInPage from './components/auth/SignIn'


// Initialize QueryClient
const queryClient = new QueryClient()

// Get Clerk publishable key from environment variable
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public auth routes */}
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            
            {/* Protected routes */}
            <Route
              element={
                <>
                  <SignedIn>
                    <Layout />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            >
              <Route path="/" element={<div>Dashboard</div>} />
              <Route path="/invoices" element={<div>Invoices</div>} />
              <Route path="/customers" element={<div>Customers</div>} />
              <Route path="/settings" element={<div>Settings</div>} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default App