"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Key } from "lucide-react"

interface SettingsDialogProps {
  apiKey: string
  onApiKeyChange: (apiKey: string) => void
}

export default function SettingsDialog({ apiKey, onApiKeyChange }: SettingsDialogProps) {
  const [localApiKey, setLocalApiKey] = useState(apiKey)
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    onApiKeyChange(localApiKey)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-border bg-card hover:bg-accent transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure your OpenAI API key for company comparisons.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="settings-api-key" className="text-sm font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              OpenAI API Key
            </Label>
            <Input
              id="settings-api-key"
              type="password"
              placeholder="sk-..."
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="h-12 bg-background border-input transition-colors focus:border-primary font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
            Your API key is not stored or saved. It's only used in your browser session.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
