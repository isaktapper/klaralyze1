"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface OnboardingFormValues {
  name: string;
  email: string;
  company: string;
  role: string;
}

export function OnboardingForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
    },
  });

  async function onSubmit(data: OnboardingFormValues) {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Onboarding completed successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-8">
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter your email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company</FormLabel>
            <FormControl>
              <Input placeholder="Enter your company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <Input placeholder="Enter your role" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Complete Onboarding"}
      </Button>
    </Form>
  );
} 