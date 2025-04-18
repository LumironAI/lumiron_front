"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, X, Eye } from "lucide-react"

import { useAgentCreation } from "@/contexts/agent-creation-context"

interface FileInfo {
  id: string
  name: string
  file: File
}

interface FileUploadProps {
  label: string
  acceptedFormats?: string
  onFileSelect?: (files: File[]) => void
}

export function FileUpload({ label, acceptedFormats = "", onFileSelect }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { agentData, updateAgentData } = useAgentCreation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles: FileInfo[] = []
      const fileNames: string[] = []

      for (let i = 0; i < files.length; i++) {
        newFiles.push({
          id: crypto.randomUUID(),
          name: files[i].name,
          file: files[i],
        })
        fileNames.push(files[i].name)
      }

      setSelectedFiles((prev) => [...prev, ...newFiles])

      // Mettre à jour le contexte avec les noms des fichiers
      const updatedDocuments = [...(agentData.documents || []), ...fileNames]
      updateAgentData({ documents: updatedDocuments })

      if (onFileSelect) {
        onFileSelect(Array.from(files))
      }

      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveFile = (id: string) => {
    // Trouver le fichier à supprimer
    const fileToRemove = selectedFiles.find((file) => file.id === id)

    // Mettre à jour l'état local
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id))

    // Mettre à jour le contexte
    if (fileToRemove) {
      const updatedDocuments = (agentData.documents || []).filter((doc) => doc !== fileToRemove.name)
      updateAgentData({ documents: updatedDocuments })
    }
  }

  const handlePreview = (file: File) => {
    // Créer une URL pour le fichier et l'ouvrir dans un nouvel onglet
    const fileUrl = URL.createObjectURL(file)
    window.open(fileUrl, "_blank")
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept={acceptedFormats} />

      <Button type="button" variant="outline" onClick={handleButtonClick} className="w-full justify-start">
        <Download className="mr-2 h-4 w-4" />
        {label}
        {acceptedFormats && <span className="ml-2 text-xs text-muted-foreground">{acceptedFormats}</span>}
      </Button>

      {selectedFiles.map((fileInfo) => (
        <div key={fileInfo.id} className="flex items-center justify-between p-2 border rounded-md">
          <span className="text-sm truncate max-w-[60%]">{fileInfo.name}</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handlePreview(fileInfo.file)} className="text-primary">
              <Eye className="h-4 w-4 mr-1" />
              Aperçu
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(fileInfo.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
