"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
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

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: { email: string; password: string }) {
    setIsLoading(true);

    try {
      // This is where you would handle authentication
      // For now, we'll just simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Work email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@company.com" 
                  type="email" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="••••••••" 
                  type="password" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
} 