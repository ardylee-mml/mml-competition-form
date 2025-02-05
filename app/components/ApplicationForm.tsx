"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Users, Gamepad, Rocket, History, DiscIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from 'next/navigation'

// Define validation schema using Zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  discordId: z.string()
    .min(2, "Discord ID must be at least 2 characters")
    .regex(/^.{3,32}#[0-9]{4}$|^.{2,32}$/, "Please enter a valid Discord ID"),
  teamName: z.string().min(2, "Team name must be at least 2 characters"),
  teamMembers: z.string()
    .min(10, "Please provide more details about team members")
    .max(500, "Team members description is too long"),
  teamExperience: z.string()
    .min(10, "Please provide more details about team experience")
    .max(500, "Team experience description is too long"),
  gameTitle: z.string().min(2, "Game title must be at least 2 characters"),
  gameConcept: z.string()
    .min(50, "Please provide more details about your game concept")
    .max(600, "Game concept is too long (max 300 words)"),
  whyWin: z.string()
    .min(30, "Please provide more details about why your game should win")
    .max(400, "Response is too long (max 200 words)"),
  whyPlayersLike: z.string()
    .min(30, "Please provide more details about why players will like your game")
    .max(400, "Response is too long (max 200 words)"),
  promotionPlan: z.string()
    .min(30, "Please provide more details about your promotion plan")
    .max(400, "Response is too long (max 200 words)"),
  monetizationPlan: z.string()
    .min(30, "Please provide more details about your monetization plan")
    .max(400, "Response is too long (max 200 words)"),
  projectedDAU: z.number()
    .min(1, "DAU must be at least 1")
    .max(1000000, "Please enter a realistic DAU projection"),
  dayOneRetention: z.number()
    .min(1, "Retention rate must be at least 1%")
    .max(100, "Retention rate cannot exceed 100%"),
  developmentTimeline: z.string()
    .min(30, "Please provide more details about your development timeline")
    .max(400, "Response is too long (max 200 words)"),
  resourcesTools: z.string()
    .min(30, "Please provide more details about required resources and tools")
    .max(400, "Response is too long (max 200 words)"),
  previousProjects: z.string()
    .min(10, "Please provide links to your previous projects")
    .max(500, "Response is too long"),
  teamExperienceDescription: z.string()
    .min(50, "Please provide more details about your team's experience")
    .max(600, "Response is too long (max 300 words)"),
  acknowledgment: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge the terms to submit"
  })
})

type FormData = z.infer<typeof formSchema>

const formSections = [
  { title: "Applicant Information", icon: <User className="h-5 w-5" /> },
  { title: "Team Information", icon: <Users className="h-5 w-5" /> },
  { title: "Previous Work and Experience", icon: <History className="h-5 w-5" /> },
  { title: "Game Idea Submission", icon: <Gamepad className="h-5 w-5" /> },
  { title: "Development Plan", icon: <Rocket className="h-5 w-5" /> },
]

export default function ApplicationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange"
  })
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitStatus(null)
      
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.error === 'email_exists') {
          setSubmitStatus("This email address has already been registered.")
          return
        }
        if (result.error === 'discord_exists') {
          setSubmitStatus("This Discord ID has already been registered.")
          return
        }
        throw new Error(result.error || 'Failed to submit application')
      }

      // Redirect to success page
      router.push('/success')
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus("Error submitting application. Please try again.")
    }
  }

  // Validate current step before moving to next
  const handleNext = async () => {
    const fields = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fields)
    if (isStepValid) {
      setCurrentStep(Math.min(formSections.length - 1, currentStep + 1))
    }
  }

  // Helper function to get fields for current step
  const getFieldsForStep = (step: number): Array<keyof FormData> => {
    switch (step) {
      case 0:
        return ['name', 'email', 'discordId']
      case 1:
        return ['teamName', 'teamMembers', 'teamExperience']
      case 2:
        return ['previousProjects', 'teamExperienceDescription']
      case 3:
        return [
          'gameTitle',
          'gameConcept',
          'whyWin',
          'whyPlayersLike',
          'promotionPlan',
          'monetizationPlan',
          'projectedDAU',
          'dayOneRetention'
        ]
      case 4:
        return ['developmentTimeline', 'resourcesTools', 'acknowledgment']
      default:
        return []
    }
  }

  const renderInput = (
    name: keyof FormData, 
    label: string, 
    icon: React.ReactNode, 
    type = "text",
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-gray-300">
        {icon}
        {label}
        <span className="text-red-400">*</span>
      </Label>
      <Input
        {...register(name, { 
          valueAsNumber: type === "number"
        })}
        type={type}
        placeholder={placeholder}
        className={`${errors[name] ? "border-red-500" : ""} bg-gray-900 text-gray-100 focus:bg-gray-950`}
      />
      {errors[name] && (
        <p className="text-xs text-red-400">{errors[name]?.message}</p>
      )}
    </div>
  )

  const renderTextarea = (
    name: keyof FormData, 
    label: string, 
    maxLength?: number,
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <Label className="block text-gray-300">
        {label}
        <span className="text-red-400">*</span>
      </Label>
      <Textarea
        {...register(name)}
        placeholder={placeholder}
        className={`${errors[name] ? "border-red-500" : ""} bg-gray-900 text-gray-100 focus:bg-gray-950 min-h-[100px]`}
      />
      {errors[name] && (
        <p className="text-xs text-red-400">{errors[name]?.message}</p>
      )}
    </div>
  )

  const renderFormSection = (index: number) => {
    switch (index) {
      case 0:
        return (
          <Card className="bg-gray-800 p-6">
            <CardContent className="space-y-4">
              {renderInput("name", "Name", <User className="h-4 w-4" />)}
              {renderInput("email", "Email", <Mail className="h-4 w-4" />, "email")}
              {renderInput("discordId", "Discord ID", <DiscIcon className="h-4 w-4" />)}
            </CardContent>
          </Card>
        )
      case 1:
        return (
          <Card className="bg-gray-800 p-6">
            <CardContent className="space-y-4">
              {renderInput("teamName", "Team Name", <Users className="h-4 w-4" />)}
              {renderTextarea("teamMembers", "Team Members (Names and Roles)")}
              {renderTextarea("teamExperience", "Team's Game Development Experience")}
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card className="bg-gray-800 p-6">
            <CardContent className="space-y-4">
              {renderTextarea("previousProjects", "Provide Links to Previous Game Projects")}
              {renderTextarea(
                "teamExperienceDescription",
                "Describe Your Team's Experience in Game Development (Max 300 words)",
                300,
              )}
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card className="bg-gray-800 p-6">
            <CardContent className="space-y-4">
              {renderInput("gameTitle", "Game Title", <Gamepad className="h-4 w-4" />)}
              {renderTextarea(
                "gameConcept", 
                "Game Concept Description (Max 300 words)", 
                300,
                "Example: A multiplayer survival game where players must work together to build and defend their base..."
              )}
              {renderTextarea(
                "whyWin", 
                "Why should your game win? (Max 200 words)", 
                200,
                "Example: Our game introduces innovative mechanics such as..."
              )}
              {renderTextarea(
                "whyPlayersLike", 
                "Why will game players like your game? (Max 200 words)", 
                200,
                "Example: Players will enjoy the unique combination of..."
              )}
              {renderTextarea(
                "promotionPlan", 
                "How are you planning to promote your game? (Max 200 words)", 
                200,
                "Example: We plan to collaborate with Roblox influencers and..."
              )}
              {renderTextarea(
                "monetizationPlan", 
                "How are you monetizing your game? (Max 200 words)", 
                200,
                "Example: Our monetization strategy includes cosmetic items and..."
              )}
              {renderInput(
                "projectedDAU", 
                "Projected Daily Active Users (DAU) in 3 months time", 
                null, 
                "number",
                "Example: 5000"
              )}
              {renderInput(
                "dayOneRetention", 
                "Projected Day 1 Retention Rate (%) in 3 months time", 
                null, 
                "number",
                "Example: 40"
              )}
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card className="bg-gray-800 p-6">
            <CardContent className="space-y-4">
              {renderTextarea(
                "developmentTimeline", 
                "Timeline for Game Development (Max 200 words)", 
                200,
                "Example: Month 1: Core mechanics and basic gameplay\nMonth 2: Asset creation and level design\nMonth 3: Testing and optimization..."
              )}
              {renderTextarea(
                "resourcesTools", 
                "Resources and Tools Required (Max 200 words)", 
                200,
                "Example: Development tools: Roblox Studio, Blender\nTeam resources: 2 developers, 1 artist\nHardware requirements..."
              )}
              
              <div className="space-y-2 pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="acknowledgment"
                    {...register("acknowledgment")}
                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600 bg-gray-900"
                  />
                  <Label 
                    htmlFor="acknowledgment" 
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    I acknowledge that all information provided is accurate and I agree to the competition rules and terms.
                    <span className="text-red-400 ml-1">*</span>
                  </Label>
                </div>
                {errors.acknowledgment && (
                  <p className="text-xs text-red-400">{errors.acknowledgment.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="mb-8">
        <div className="flex flex-wrap gap-1 mb-4 bg-gray-800 p-1 rounded-lg">
          {formSections.map((section, index) => (
            <Button
              key={index}
              variant={currentStep === index ? "default" : "outline"}
              className={`flex-1 min-w-[150px] ${
                currentStep === index 
                  ? "bg-cyan-600 text-white" 
                  : "bg-gray-900 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-center justify-center gap-2">
                {section.icon}
                <span className="inline">{section.title}</span>
              </div>
            </Button>
          ))}
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / formSections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {formSections.map((_, index) => (
        <div key={index} className={currentStep === index ? "" : "hidden"}>
          {renderFormSection(index)}
        </div>
      ))}

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || isSubmitting}
          className="bg-gray-700 hover:bg-gray-800 text-white"
        >
          Previous
        </Button>
        {currentStep < formSections.length - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Next
          </Button>
        ) : (
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        )}
      </div>

      {submitStatus && (
        <p className={`mt-4 text-center ${submitStatus.includes("Error") ? "text-red-400" : "text-green-400"}`}>
          {submitStatus}
        </p>
      )}
    </form>
  )
}

