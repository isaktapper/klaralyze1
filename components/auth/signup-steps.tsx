import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, ChevronDown } from 'lucide-react';
import { zxcvbn } from '@zxcvbn-ts/core';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
  const stepMessages = [
    "Let's get you set up!",
    "Tell us about your role",
    "Help us understand your needs",
    "Just one last step!"
  ];

  return (
    <div className="relative mb-8">
      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-blue-100">
        <motion.div
          className="bg-[#026EE6] h-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm font-medium text-gray-900">{stepMessages[currentStep - 1]}</span>
      </div>
    </div>
  );
};

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const result = zxcvbn(password);
  const score = result.score; // 0-4

  const getStrengthColor = () => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthText = () => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  };

  return (
    <div className="mt-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-gray-200">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 ${i <= score ? getStrengthColor() : ''} transition-all duration-300`}
          />
        ))}
      </div>
      <div className="mt-1 flex items-center text-sm">
        <span className={`font-medium ${score >= 3 ? 'text-green-600' : 'text-gray-600'}`}>
          {getStrengthText()}
        </span>
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
    if (validateStep()) {
      // Show success toast
      toast.success("Account created successfully!");
      // TODO: Handle form submission
      console.log('Form submitted:', formData);
      setShowSuccess(true);
      
      // Redirect to dashboard immediately
      router.push('/dashboard');
    }
  };

  const validateStep = () => {
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
                  {formData.password && <PasswordStrengthMeter password={formData.password} />}
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
                    placeholder="Select a job title"
                    error={shouldShowError('jobTitle') ? errors.jobTitle : undefined}
                  />
                </div>

                {formData.jobTitle === 'Other' && (
                  <div>
                    <label htmlFor="otherJobTitle" className="block text-sm font-medium text-gray-700">Specify Job Title</label>
                    <input
                      type="text"
                      id="otherJobTitle"
                      name="otherJobTitle"
                      value={formData.otherJobTitle}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[#111827] placeholder-[#6B7280] focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter your job title"
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
                    <label htmlFor="otherGoal" className="block text-sm font-medium text-gray-700">Specify Your Goal</label>
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

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Back
                </button>
              )}
              <button
                type={step === 4 ? 'submit' : 'button'}
                onClick={step === 4 ? undefined : handleNext}
                className="ml-auto flex items-center justify-center rounded-lg bg-[#026EE6] px-6 py-3 text-sm font-medium text-white hover:bg-[#0256B4] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {step === 4 ? 'Complete Setup' : 'Continue'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-lg"
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Klaralyze!</h2>
          <div className="space-y-4 text-gray-600">
            <p>Your account has been successfully created.</p>
            <p className="font-medium">Your 14-day free trial starts now!</p>
            <ul className="text-left space-y-2 mt-4">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-cyan-500" />
                <span>Full access to all features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-cyan-500" />
                <span>Unlimited support ticket analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-cyan-500" />
                <span>AI-powered insights and recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-cyan-500" />
                <span>Priority customer support</span>
              </li>
            </ul>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 transition-all"
          >
            Go to Dashboard
          </button>
          <p className="text-gray-500 text-sm">Redirecting you to the dashboard...</p>
        </motion.div>
      )}
    </div>
  );
} 