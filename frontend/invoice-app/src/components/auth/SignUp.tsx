import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => (
  <div className="flex min-h-screen items-center justify-center">
    <SignUp
      appearance={{
        elements: {
          formButtonPrimary: 
            "bg-blue-500 hover:bg-blue-600 text-sm normal-case",
        },
      }}
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
    />
  </div>
);

export default SignUpPage;