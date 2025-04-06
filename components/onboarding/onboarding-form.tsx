"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

interface FormData {
  jobTitle: string;
  company: string;
  primaryGoal: string;
  teamSize: string;
  bio: string;
  interests: string;
}

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const totalSteps = 3;
  
  const [formData, setFormData] = React.useState<FormData>({
    jobTitle: "",
    company: "",
    primaryGoal: "",
    teamSize: "",
    bio: "",
    interests: "",
  });

  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const isValid = validateStep(step);
    
    if (isValid) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        await handleSubmit();
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.jobTitle.length >= 2 && formData.company.length >= 2;
      case 2:
        return formData.primaryGoal !== "" && formData.teamSize !== "";
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["jobTitle", "company"];
      case 2:
        return ["primaryGoal", "teamSize"];
      case 3:
        return ["bio", "interests"];
      default:
        return [];
    }
  };

  async function handleSubmit() {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Onboarding completed successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Progress value={(step / totalSteps) * 100} className="h-2" />
      
      <div className="mb-4 flex justify-between text-sm">
        <span>Step {step} of {totalSteps}</span>
        <span className="text-muted-foreground">{getStepTitle(step)}</span>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium">Job Title</label>
              <Input
                placeholder="Product Manager"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Company</label>
              <Input
                placeholder="Acme Inc."
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                required
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <label className="block text-sm font-medium">What is your primary goal?</label>
              <RadioGroup
                value={formData.primaryGoal}
                onValueChange={(value) => handleInputChange("primaryGoal", value)}
                className="space-y-1"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="analytics" id="analytics" />
                  <label htmlFor="analytics" className="text-sm">Analyze customer data</label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="customer_support" id="customer_support" />
                  <label htmlFor="customer_support" className="text-sm">Improve customer support</label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="marketing" id="marketing" />
                  <label htmlFor="marketing" className="text-sm">Enhance marketing efforts</label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Team Size</label>
              <Input
                placeholder="e.g., 5-10"
                value={formData.teamSize}
                onChange={(e) => handleInputChange("teamSize", e.target.value)}
                required
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Final Steps */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium">Bio</label>
              <Textarea
                placeholder="Tell us a bit about yourself..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">This will be displayed on your profile</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Interests</label>
              <Input
                placeholder="Analytics, Customer Support, AI..."
                value={formData.interests}
                onChange={(e) => handleInputChange("interests", e.target.value)}
              />
              <p className="text-sm text-gray-500">Help us tailor content to your interests</p>
            </div>
          </motion.div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isLoading}
            >
              Previous
            </Button>
          )}
          <Button
            type="button"
            onClick={nextStep}
            disabled={isLoading}
            className={step === 1 ? "w-full" : ""}
          >
            {isLoading
              ? "Processing..."
              : step === totalSteps
              ? "Complete Onboarding"
              : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return "Personal Details";
    case 2:
      return "Preferences";
    case 3:
      return "Final Steps";
    default:
      return "";
  }
} 