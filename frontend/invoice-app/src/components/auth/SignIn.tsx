import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => (
  <div className="flex min-h-screen items-center justify-center">
    <SignIn 
      appearance={{
        elements: {
          formButtonPrimary: 
            "bg-blue-500 hover:bg-blue-600 text-sm normal-case",
        },
      }}
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
    />
  </div>
);

export default SignInPage;