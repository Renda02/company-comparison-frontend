"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Shield } from "lucide-react"

interface CompanyComparisonFormProps {
  onSubmit: (company1: string, company2: string) => void
  isLoading: boolean
  apiKey: string
}

export default function CompanyComparisonForm({ onSubmit, isLoading, apiKey }: CompanyComparisonFormProps) {
  const [company1, setCompany1] = useState("")
  const [company2, setCompany2] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (company1.trim() && company2.trim() && apiKey.trim()) {
      onSubmit(company1.trim(), company2.trim())
    }
  }

  const isFormValid = company1.trim() && company2.trim() && apiKey.trim()

  return (
    <Card className="border-border bg-card shadow-lg animate-in slide-in-from-bottom-4 duration-500">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="company1" className="text-base font-semibold flex items-center gap-2 text-foreground">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                Company Name 1
              </Label>
              <Input
                id="company1"
                type="text"
                placeholder="e.g., OpenAI"
                value={company1}
                onChange={(e) => setCompany1(e.target.value)}
                disabled={isLoading}
                className="h-12 bg-background border-input transition-colors focus:border-primary text-base"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="company2" className="text-base font-semibold flex items-center gap-2 text-foreground">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                Company Name 2
              </Label>
              <Input
                id="company2"
                type="text"
                placeholder="e.g., Anthropic"
                value={company2}
                onChange={(e) => setCompany2(e.target.value)}
                disabled={isLoading}
                className="h-12 bg-background border-input transition-colors focus:border-primary text-base"
                required
              />
            </div>
          </div>

          {!apiKey && (
            <div className="p-4 rounded-lg bg-[#3d3d2a] border border-[#4a4a34]">
              <p className="text-[#d4a755] text-sm text-center">
                Please configure your OpenAI API key in the settings (top-right corner) before comparing.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full h-14 text-base font-semibold bg-[#9a9a9a] hover:bg-[#888888] text-black transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="animate-pulse">Analyzing Companies...</span>
              </>
            ) : (
              <>
                <Shield className="mr-2 w-5 h-5" />
                Compare
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
