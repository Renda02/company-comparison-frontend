"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ComparisonResultProps {
  result: string | null
  isLoading: boolean
}

export default function ComparisonResult({ result, isLoading }: ComparisonResultProps) {
  if (isLoading) {
    return (
      <Card className="border-border bg-card shadow-lg animate-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground text-xl">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            Analyzing Companies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
          <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return null
  }

  const isError = result.startsWith("Error:")

  if (isError) {
    return (
      <Alert variant="destructive" className="animate-in slide-in-from-bottom-4 duration-500">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="ml-2">{result}</AlertDescription>
      </Alert>
    )
  }

  const parseComparison = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim())
    const sections: { title: string; rows: { label: string; value: string }[] }[] = []
    let currentSection: { title: string; rows: { label: string; value: string }[] } | null = null

    lines.forEach((line) => {
      // Check if it's a heading
      if (line.match(/^#+\s/)) {
        if (currentSection) sections.push(currentSection)
        const title = line.replace(/^#+\s/, "")
        currentSection = { title, rows: [] }
      } else if (currentSection) {
        // Parse bullet points or numbered lists into label-value pairs
        const cleanLine = line.replace(/^[•\-*]\s/, "").replace(/^\d+\.\s/, "")

        // Try to split on common delimiters like ":" or "-"
        const colonMatch = cleanLine.match(/^([^:]+):\s*(.+)$/)
        const dashMatch = cleanLine.match(/^([^-]+)\s+-\s+(.+)$/)

        if (colonMatch) {
          currentSection.rows.push({ label: colonMatch[1].trim(), value: colonMatch[2].trim() })
        } else if (dashMatch) {
          currentSection.rows.push({ label: dashMatch[1].trim(), value: dashMatch[2].trim() })
        } else {
          // If no delimiter, treat the whole line as a value with empty label
          currentSection.rows.push({ label: "", value: cleanLine })
        }
      }
    })

    if (currentSection) sections.push(currentSection)
    return sections
  }

  const sections = parseComparison(result)

  return (
    <Card className="border-border bg-card shadow-lg animate-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground text-xl">
          <Sparkles className="w-6 h-6 text-primary" />
          Comparison Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-lg font-bold text-foreground border-b-2 border-primary/30 pb-2">{section.title}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {section.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        {row.label ? (
                          <>
                            <td className="py-3 px-4 text-sm font-semibold text-foreground/80 align-top w-1/3">
                              {row.label}
                            </td>
                            <td className="py-3 px-4 text-sm text-foreground leading-relaxed">{row.value}</td>
                          </>
                        ) : (
                          <td colSpan={2} className="py-3 px-4 text-sm text-foreground leading-relaxed">
                            {row.value}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
