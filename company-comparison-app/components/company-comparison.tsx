"use client"

import { useState } from "react"
import CompanyComparisonForm from "@/components/company-comparison-form"
import ComparisonResult from "@/components/comparison-result"
import SettingsDialog from "@/components/settings-dialog"

export default function CompanyComparison() {
  const [comparison, setComparison] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")

  const handleComparison = async (company1: string, company2: string) => {
    setIsLoading(true)
    setComparison(null)

    try {
      console.log("[v0] Request data being sent to OpenAI:", {
        company1,
        company2,
        model: "gpt-4o-mini",
        timestamp: new Date().toISOString(),
      })

      const requestBody = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a business analyst expert. Provide detailed, well-structured comparisons of companies based on their market position, business model, products/services, and competitive advantages. Use bullet points and clear sections.",
          },
          {
            role: "user",
            content: `Compare ${company1} and ${company2}. Provide a comprehensive analysis covering:
1. Company Overview
2. Market Position
3. Key Products/Services
4. Business Model
5. Competitive Advantages
6. Recent Performance
7. Future Outlook

Make it informative and easy to understand.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }

      console.log("[v0] Full OpenAI API request:", requestBody)

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      })

      console.log("[v0] OpenAI API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] OpenAI API error response:", errorData)
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`)
      }

      const data = await response.json()

      console.log("[v0] Full OpenAI API response:", data)

      const comparisonText = data.choices[0]?.message?.content

      if (!comparisonText) {
        throw new Error("No comparison text returned from API")
      }

      console.log("[v0] Extracted comparison text:", comparisonText)

      setComparison(comparisonText)
    } catch (error) {
      console.error("[v0] Error during comparison:", error)
      setComparison(
        `Error: ${error instanceof Error ? error.message : "Failed to compare companies. Please check your API key and try again."}`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="fixed top-6 right-6 z-50">
        <SettingsDialog apiKey={apiKey} onApiKeyChange={setApiKey} />
      </div>

      <div className="text-center mb-12 space-y-4 animate-in fade-in duration-700">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
          <span className="text-foreground">Compare Companies</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            with AI
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Leverage OpenAI's GPT-4o-mini to analyze and compare companies based on market position, business model, and
          competitive advantages.
        </p>
      </div>

      <div className="space-y-8">
        <CompanyComparisonForm onSubmit={handleComparison} isLoading={isLoading} apiKey={apiKey} />

        {(comparison || isLoading) && <ComparisonResult result={comparison} isLoading={isLoading} />}
      </div>
    </div>
  )
}
