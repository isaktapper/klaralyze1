"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const jobTitles = [
  "Product Manager",
  "Product Owner",
  "Product Analyst",
  "Product Designer",
  "Support Team Lead",
  "Customer Experience Manager",
  "Customer Success Manager",
  "Head of Customer Support",
  "Support Director",
  "Other"
];

const companySizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+"
];

const ticketRanges = [
  "Less than 100",
  "100-500",
  "501-2000",
  "2001-5000",
  "5000+"
];

const goals = [
  "Improve response times",
  "Reduce ticket volume",
  "Better insights from data",
  "Team performance tracking",
  "Automate workflows",
  "Other"
];

const sources = [
  "Google",
  "LinkedIn",
  "Twitter",
  "Friend/Colleague",
  "Blog/Article",
  "Other"
];

interface StepProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: StepProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block text-blue-600">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
        <div
          style={{ width: `${progress}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
        />
      </div>
    </div>
  );
};

const CustomSelect = ({ 
  id, 
  name, 
  value, 
  onChange, 
  options, 
  placeholder,
  error
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
  error?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`mt-1 block w-full rounded-lg border ${
          error ? 'border-red-300' : 'border-[#E5E7EB]'
        } bg-white px-4 py-3 text-left text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
      >
        <div className="flex justify-between items-center">
          <span className={`${!value ? 'text-[#6B7280]' : 'text-[#111827]'}`}>
            {value || placeholder}
          </span>
          <ChevronDown className={`h-4 w-4 text-[#6B7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg bg-white shadow-lg border border-[#E5E7EB]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange({ target: { name, value: option } } as React.ChangeEvent<HTMLSelectElement>);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm text-[#111827] hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                value === option ? 'bg-gray-50' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export function SignUpSteps() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobTitle: '',
    otherJobTitle: '',
    company: '',
    employees: '',
    tickets: '',
    goal: '',
    otherGoal: '',
    source: '',
    otherSource: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouchedFields(prev => new Set(prev).add(name));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const newErrors: Record<string, string> = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value) newErrors.name = 'Name is required';
        else delete newErrors.name;
        break;
      case 'email':
        if (!value) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'Invalid email format';
        else delete newErrors.email;
        break;
      case 'password':
        if (!value) newErrors.password = 'Password is required';
        else if (value.length < 8) newErrors.password = 'Password must be at least 8 characters';
        else delete newErrors.password;
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
      case 'confirmPassword':
        if (!value) newErrors.confirmPassword = 'Please confirm your password';
        else if (value !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
        else delete newErrors.confirmPassword;
        break;
      case 'jobTitle':
        if (!value) newErrors.jobTitle = 'Job title is required';
        else delete newErrors.jobTitle;
        break;
      case 'otherJobTitle':
        if (formData.jobTitle === 'Other' && !value) newErrors.otherJobTitle = 'Please specify your job title';
        else delete newErrors.otherJobTitle;
        break;
      case 'company':
        if (!value) newErrors.company = 'Company name is required';
        else delete newErrors.company;
        break;
      case 'employees':
        if (!value) newErrors.employees = 'Number of employees is required';
        else delete newErrors.employees;
        break;
      case 'tickets':
        if (!value) newErrors.tickets = 'Number of tickets is required';
        else delete newErrors.tickets;
        break;
      case 'goal':
        if (!value) newErrors.goal = 'Primary goal is required';
        else delete newErrors.goal;
        break;
      case 'otherGoal':
        if (formData.goal === 'Other' && !value) newErrors.otherGoal = 'Please specify your goal';
        else delete newErrors.otherGoal;
        break;
      case 'source':
        if (!value) newErrors.source = 'Source is required';
        else delete newErrors.source;
        break;
      case 'otherSource':
        if (formData.source === 'Other' && !value) newErrors.otherSource = 'Please specify how you heard about us';
        else delete newErrors.otherSource;
        break;
    }

    setErrors(newErrors);
  };

  const shouldShowError = (fieldName: string) => {
    return touchedFields.has(fieldName) && errors[fieldName];
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 1) {
        // TODO: Send verification email
        console.log('Sending verification email to:', formData.email);
      }
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    
    if (!validateStep()) {
      console.log('Validation failed');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Starting signup process...');
      
      // Create user account
      console.log('Creating user account...', formData.email);
      const { data: authData, error: authError } = await signUp(formData.email, formData.password);
      
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!authData?.user?.id) {
        console.error('No user data returned');
        throw new Error('No user data returned');
      }

      console.log('User created:', authData.user.id);

      // Create user profile
      console.log('Creating user profile...');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: formData.name,
          email: formData.email,
          job_title: formData.jobTitle === 'Other' ? formData.otherJobTitle : formData.jobTitle,
          company: formData.company,
          company_size: formData.employees,
          monthly_tickets: formData.tickets,
          primary_goal: formData.goal === 'Other' ? formData.otherGoal : formData.goal,
          source: formData.source === 'Other' ? formData.otherSource : formData.source
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        throw profileError;
      }

      console.log('Profile created successfully');

      // Create organization
      console.log('Creating organization...');
      const { error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.company,
          slug: formData.company.toLowerCase().replace(/\s+/g, '-'),
          owner_id: authData.user.id,
          settings: {
            company_size: formData.employees,
            monthly_tickets: formData.tickets
          }
        });

      if (orgError) {
        console.error('Organization error:', orgError);
        throw orgError;
      }

      console.log('Organization created successfully');
      setIsLoading(false);

      // Show success message and redirect to verify email page
      toast.success('Account created successfully! Please check your email to verify your account.');
      router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
      
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error in signup process:', error);
      toast.error(error.message || 'Failed to create account. Please try again.');
    }
  };

  const validateStep = () => {
    console.log('Validating step:', step);
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        break;
      case 2:
        if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required';
        if (formData.jobTitle === 'Other' && !formData.otherJobTitle) newErrors.otherJobTitle = 'Please specify your job title';
        if (!formData.company) newErrors.company = 'Company name is required';
        if (!formData.employees) newErrors.employees = 'Number of employees is required';
        break;
      case 3:
        if (!formData.tickets) newErrors.tickets = 'Number of tickets is required';
        if (!formData.goal) newErrors.goal = 'Primary goal is required';
        if (formData.goal === 'Other' && !formData.otherGoal) newErrors.otherGoal = 'Please specify your goal';
        break;
      case 4:
        if (!formData.source) newErrors.source = 'Source is required';
        if (formData.source === 'Other' && !formData.otherSource) newErrors.otherSource = 'Please specify how you heard about us';
        break;
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {!showSuccess ? (
        <>
          <ProgressBar currentStep={step} totalSteps={4} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[#111827] placeholder-[#6B7280] focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="John Doe"
                  />
                  {shouldShowError('name') && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Work Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[#111827] placeholder-[#6B7280] focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="you@company.com"
                  />
                  {shouldShowError('email') && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[#111827] placeholder-[#6B7280] focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  {shouldShowError('password') && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[#111827] placeholder-[#6B7280] focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  {shouldShowError('confirmPassword') && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                  <CustomSelect
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    options={jobTitles}
                    placeholder="Select job title"
                    error={shouldShowError('jobTitle') ? errors.jobTitle : undefined}
                  />
                </div>

                {formData.jobTitle === 'Other' && (
                  <div>
                    <label htmlFor="otherJobTitle" className="block text-sm font-medium text-gray-700">Please specify</label>
                    <input
                      type="text"
                      id="otherJobTitle"
                      name="otherJobTitle"
                      value={formData.otherJobTitle}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[#111827] placeholder-[#6B7280] focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter job title"
                    />
                    {shouldShowError('otherJobTitle') && <p className="mt-1 text-sm text-red-600">{errors.otherJobTitle}</p>}
                  </div>
                )}

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[#111827] placeholder-[#6B7280] focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Your company"
                  />
                  {shouldShowError('company') && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
                </div>

                <div>
                  <label htmlFor="employees" className="block text-sm font-medium text-gray-700">Number of Employees</label>
                  <CustomSelect
                    id="employees"
                    name="employees"
                    value={formData.employees}
                    onChange={handleInputChange}
                    options={companySizes}
                    placeholder="Select company size"
                    error={shouldShowError('employees') ? errors.employees : undefined}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="tickets" className="block text-sm font-medium text-gray-700">Monthly Support Tickets</label>
                  <CustomSelect
                    id="tickets"
                    name="tickets"
                    value={formData.tickets}
                    onChange={handleInputChange}
                    options={ticketRanges}
                    placeholder="Select ticket volume"
                    error={shouldShowError('tickets') ? errors.tickets : undefined}
                  />
                </div>

                <div>
                  <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Primary Goal with Klaralyze</label>
                  <CustomSelect
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    options={goals}
                    placeholder="Select your primary goal"
                    error={shouldShowError('goal') ? errors.goal : undefined}
                  />
                </div>

                {formData.goal === 'Other' && (
                  <div>
                    <label htmlFor="otherGoal" className="block text-sm font-medium text-gray-700">Please specify</label>
                    <input
                      type="text"
                      id="otherGoal"
                      name="otherGoal"
                      value={formData.otherGoal}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[#111827] placeholder-[#6B7280] focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter your goal"
                    />
                    {shouldShowError('otherGoal') && <p className="mt-1 text-sm text-red-600">{errors.otherGoal}</p>}
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700">How did you hear about Klaralyze?</label>
                  <CustomSelect
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    options={sources}
                    placeholder="Select source"
                    error={shouldShowError('source') ? errors.source : undefined}
                  />
                </div>

                {formData.source === 'Other' && (
                  <div>
                    <label htmlFor="otherSource" className="block text-sm font-medium text-gray-700">Please specify</label>
                    <input
                      type="text"
                      id="otherSource"
                      name="otherSource"
                      value={formData.otherSource}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[#111827] placeholder-[#6B7280] focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter source"
                    />
                    {shouldShowError('otherSource') && <p className="mt-1 text-sm text-red-600">{errors.otherSource}</p>}
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  step === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Back
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Complete Sign Up
                </button>
              )}
            </div>
          </form>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Account created successfully!</h3>
          <p className="mt-1 text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      )}
    </div>
  );
} 