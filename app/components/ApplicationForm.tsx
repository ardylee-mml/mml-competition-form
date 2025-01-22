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

type FormData = {
  name: string
  email: string
  discordId: string
  teamName: string
  teamMembers: string
  teamExperience: string
  gameGenre: string
  gameTitle: string
  gameConcept: string
  whyWin: string
  whyPlayersLike: string
  promotionPlan: string
  monetizationPlan: string
  projectedDAU: number
  dayOneRetention: number
  developmentTimeline: string
  resourcesTools: string
  previousProjects: string
  teamExperienceDescription: string
}

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
    formState: { errors },
  } = useForm<FormData>()
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const onSubmit = async (data: FormData) => {
    console.log(data)
    setSubmitStatus("Application submitted successfully!")
    alert("Your application has been submitted successfully!")
  }

  const renderInput = (name: keyof FormData, label: string, icon: React.ReactNode, type = "text") => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-gray-300">
        {icon}
        {label}
      </Label>
      <Input
        {...register(name, { 
          required: `${label} is required`,
          valueAsNumber: type === "number"
        })}
        type={type}
        className={`${errors[name] ? "border-red-500" : ""} bg-gray-900 text-gray-100 focus:bg-gray-950`}
      />
      {errors[name] && <p className="text-xs text-red-400">{errors[name]?.message}</p>}
    </div>
  )

  const renderTextarea = (name: keyof FormData, label: string, maxLength?: number) => (
    <div className="space-y-2">
      <Label className="block text-gray-300">{label}</Label>
      <Textarea
        {...register(name, { required: `${label} is required`, maxLength })}
        className={`${errors[name] ? "border-red-500" : ""} bg-gray-900 text-gray-100 focus:bg-gray-950 min-h-[100px]`}
      />
      {errors[name] && <p className="text-xs text-red-400">{errors[name]?.message}</p>}
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
              <div className="space-y-2">
                <Label className="block text-gray-300">Game Genre</Label>
                <RadioGroup className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Genre 1"
                      id="genre1"
                      {...register("gameGenre", { required: "Game Genre is required" })}
                    />
                    <Label htmlFor="genre1" className="cursor-pointer text-gray-300">
                      Genre 1
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Genre 2"
                      id="genre2"
                      {...register("gameGenre", { required: "Game Genre is required" })}
                    />
                    <Label htmlFor="genre2" className="cursor-pointer text-gray-300">
                      Genre 2
                    </Label>
                  </div>
                </RadioGroup>
                {errors.gameGenre && <p className="text-xs text-red-400">{errors.gameGenre.message}</p>}
              </div>
              {renderInput("gameTitle", "Game Title", <Gamepad className="h-4 w-4" />)}
              {renderTextarea("gameConcept", "Game Concept Description (Max 300 words)", 300)}
              {renderTextarea("whyWin", "Why should your game win? (Max 200 words)", 200)}
              {renderTextarea("whyPlayersLike", "Why will game players like your game? (Max 200 words)", 200)}
              {renderTextarea("promotionPlan", "How are you planning to promote your game? (Max 200 words)", 200)}
              {renderTextarea("monetizationPlan", "How are you monetizing your game? (Max 200 words)", 200)}
              {renderInput("projectedDAU", "Projected Daily Active Users (DAU)", null, "number")}
              {renderInput("dayOneRetention", "Day 1 Retention Rate (%)", null, "number")}
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card className="bg-gray-800 p-6">
            <CardContent className="space-y-4">
              {renderTextarea("developmentTimeline", "Timeline for Game Development (Max 200 words)", 200)}
              {renderTextarea("resourcesTools", "Resources and Tools Required (Max 200 words)", 200)}
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
        <div className="flex justify-between items-center mb-4">
          {formSections.map((section, index) => (
            <Button
              key={index}
              variant={currentStep === index ? "default" : "outline"}
              className={`flex-1 ${currentStep === index ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-300"}`}
              onClick={() => setCurrentStep(index)}
            >
              {section.icon}
              <span className="ml-2 hidden sm:inline">{section.title}</span>
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
          disabled={currentStep === 0}
          className="bg-gray-700 hover:bg-gray-800 text-white"
        >
          Previous
        </Button>
        {currentStep < formSections.length - 1 ? (
          <Button
            type="button"
            onClick={() => setCurrentStep(Math.min(formSections.length - 1, currentStep + 1))}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Next
          </Button>
        ) : (
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
            Submit Application
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

