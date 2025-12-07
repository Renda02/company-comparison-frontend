"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ComparisonResultProps {
  result: string | null
  isLoading: boolean
  company1?: string
  company2?: string
}

export default function ComparisonResult({ result, isLoading, company1, company2 }: ComparisonResultProps) {
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
    const rows: { category: string; company1Value: string; company2Value: string }[] = []
    
    const company1Name = company1 || "Company 1"
    const company2Name = company2 || "Company 2"
    
    let currentCategory = ""
    
    lines.forEach((line) => {
      // Check if it's a heading (category)
      if (line.match(/^#+\s/)) {
        currentCategory = line.replace(/^#+\s/, "").trim()
      } else if (line.match(/^\d+\.\s/)) {
        // Numbered list items might be categories
        const match = line.match(/^\d+\.\s*(.+)$/)
        if (match) {
          const content = match[1].trim()
          // Check if it looks like a category (ends with colon or is short)
          if (content.includes(":") || content.length < 50) {
            currentCategory = content.replace(/:\s*$/, "").trim()
          }
        }
      } else {
        // Parse bullet points or content lines
        const cleanLine = line.replace(/^[•\-*]\s/, "").replace(/^\d+\.\s/, "").trim()
        
        if (!cleanLine) return
        
        // Try to match patterns like "Category: Company1: value1; Company2: value2"
        const categoryMatch = cleanLine.match(/^([^:]+):\s*(.+)$/)
        
        if (categoryMatch) {
          const categoryName = categoryMatch[1].trim()
          const value = categoryMatch[2].trim()
          
          // Try to extract company-specific values
          let company1Value = ""
          let company2Value = ""
          
          // Pattern 1: "Company1: value1; Company2: value2"
          const companyPattern = new RegExp(
            `(${company1Name}|${company2Name}):\\s*([^;]+)`,
            "gi"
          )
          const companyMatches = [...value.matchAll(companyPattern)]
          
          if (companyMatches.length >= 2) {
            companyMatches.forEach((match) => {
              const matchedCompany = match[1]
              const matchedValue = match[2].trim()
              if (matchedCompany.toLowerCase() === company1Name.toLowerCase()) {
                company1Value = matchedValue
              } else if (matchedCompany.toLowerCase() === company2Name.toLowerCase()) {
                company2Value = matchedValue
              }
            })
          } else {
            // Pattern 2: Split by semicolon or pipe
            const parts = value.split(/[;|]/).map((p) => p.trim()).filter(p => p)
            if (parts.length >= 2) {
              company1Value = parts[0]
              company2Value = parts[1]
            } else if (parts.length === 1) {
              // Single value - try to split by "vs" or similar
              const vsMatch = parts[0].match(/^(.+?)\s+(?:vs|versus|compared to)\s+(.+)$/i)
              if (vsMatch) {
                company1Value = vsMatch[1].trim()
                company2Value = vsMatch[2].trim()
              } else {
                company1Value = parts[0]
                company2Value = parts[0]
              }
            }
          }
          
          if (company1Value || company2Value) {
            rows.push({
              category: categoryName || currentCategory,
              company1Value: company1Value || "—",
              company2Value: company2Value || "—",
            })
          }
        } else if (currentCategory) {
          // If we have a current category and the line doesn't match a pattern,
          // try to extract comparison from the line itself
          const vsMatch = cleanLine.match(/^(.+?)\s+(?:vs|versus|compared to)\s+(.+)$/i)
          if (vsMatch) {
            rows.push({
              category: currentCategory,
              company1Value: vsMatch[1].trim(),
              company2Value: vsMatch[2].trim(),
            })
          } else {
            // Try splitting by common separators
            const parts = cleanLine.split(/[;|]/).map((p) => p.trim()).filter(p => p)
            if (parts.length >= 2) {
              rows.push({
                category: currentCategory,
                company1Value: parts[0],
                company2Value: parts[1],
              })
            }
          }
        }
      }
    })
    
    // If no structured data found, try to extract from headings and their following content
    if (rows.length === 0) {
      let lastCategory = ""
      lines.forEach((line, idx) => {
        const trimmed = line.trim()
        if (trimmed.match(/^#+\s/)) {
          lastCategory = trimmed.replace(/^#+\s/, "").trim()
        } else if (lastCategory && trimmed && !trimmed.match(/^#+\s/)) {
          const cleanLine = trimmed.replace(/^[•\-*]\s/, "").replace(/^\d+\.\s/, "").trim()
          const parts = cleanLine.split(/[;|]/).map((p) => p.trim()).filter(p => p)
          if (parts.length >= 2) {
            rows.push({
              category: lastCategory,
              company1Value: parts[0],
              company2Value: parts[1],
            })
          }
        }
      })
    }
    
    return rows
  }

  const tableRows = parseComparison(result)
  const company1Name = company1 || "Company A"
  const company2Name = company2 || "Company B"

  return (
    <Card className="border-border bg-card shadow-lg animate-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground text-xl">
          <Sparkles className="w-6 h-6 text-primary" />
          Comparison Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 px-6 text-left text-sm font-bold text-foreground">
                  Category
                </th>
                <th className="py-4 px-6 text-left text-sm font-bold text-foreground">
                  {company1Name}
                </th>
                <th className="py-4 px-6 text-left text-sm font-bold text-foreground">
                  {company2Name}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length > 0 ? (
                tableRows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm font-semibold text-foreground align-top">
                      {row.category}
                    </td>
                    <td className="py-4 px-6 text-sm text-foreground leading-relaxed">
                      {row.company1Value}
                    </td>
                    <td className="py-4 px-6 text-sm text-foreground leading-relaxed">
                      {row.company2Value}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 px-6 text-center text-sm text-muted-foreground">
                    Unable to parse comparison data. Please try again.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
