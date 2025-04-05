import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Complete your profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s personalize your experience
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
} 