"use client"

import { Button } from "@/components/ui/button"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, CalendarX, Settings, Info, FileText, Plus } from "lucide-react"
import { fr } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SectionCard } from "@/components/agent-creation/common/section-card"
import { FormRow } from "@/components/agent-creation/common/form-row"
import { ActionButtons } from "@/components/agent-creation/common/action-buttons"
import { AgentCreationLayout } from "@/components/agent-creation/layout/agent-creation-layout"
import { OpeningHoursRow } from "@/components/agent-creation/step2-informations/opening-hours-row"
import { OptionToggle } from "@/components/agent-creation/step2-informations/option-toggle"
import { FileUpload } from "@/components/agent-creation/step2-informations/file-upload"
import { useAgentCreation } from "@/contexts/agent-creation-context"
import { useToast } from "@/hooks/ui/use-toast"
import { agentService } from "@/services/agent.service"

export default function AgentInformationsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { agentData, updateAgentData, setAgentId } = useAgentCreation()
  const { toast } = useToast()

  // Référence pour le scroll vers les erreurs
  const establishmentRef = useRef<HTMLDivElement>(null)
  const websiteRef = useRef<HTMLDivElement>(null)
  const addressRef = useRef<HTMLDivElement>(null)
  const cityRef = useRef<HTMLDivElement>(null)

  // État pour suivre si le formulaire a été soumis
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // États pour les champs obligatoires
  const [establishment, setEstablishment] = useState(agentData.establishment || "")
  const [website, setWebsite] = useState(agentData.website || "")
  const [address, setAddress] = useState(agentData.address || "")
  const [city, setCity] = useState(agentData.city || "")

  // États pour les erreurs de validation
  const [errors, setErrors] = useState({
    establishment: false,
    website: false,
    address: false,
    city: false,
  })

  // États pour les autres champs
  const [closureDaysEnabled, setClosureDaysEnabled] = useState(agentData.closureDays?.enabled || false)
  const [closureDates, setClosureDates] = useState<Date[]>(agentData.closureDays?.dates || [])
  const [additionalInfo, setAdditionalInfo] = useState(agentData.additionalInfo || "")

  // Initialize default opening hours if not present in context
  const defaultOpeningHours = {
    Lundi: {
      lunch: { open: false, start: "12:00", end: "14:30" },
      dinner: { open: false, start: "19:00", end: "22:30" },
    },
    Mardi: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
    Mercredi: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
    Jeudi: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
    Vendredi: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
    Samedi: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
    Dimanche: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
  }

  // Initialize default options if not present in context
  const defaultOptions = {
    "Accès PMR": false,
    "Chaise haute": false,
    "Enfant accepté": false,
    "Animaux acceptés": false,
    Parking: false,
    "Salle extérieure": false,
    Terrasse: false,
  }

  // Initialize default food options if not present in context
  const defaultFoodOptions = {
    Végétarien: false,
    Vegan: false,
    "Sans gluten": false,
    Halal: false,
    Casher: false,
  }

  // Load agent data if we have an ID
  useEffect(() => {
    async function loadAgentData() {
      try {
        if (params.id) {
          setIsInitializing(true)
          const { data, error } = await agentService.getAgentById(params.id)

          if (error) {
            throw error
          }

          if (data) {
            // Update context with loaded data and defaults for missing fields
            const agentData = {
              id: data.id.toString(),
              name: data.name,
              status: data.status,
              sector: "restaurant", // Default sector
              openingHours: defaultOpeningHours,
              options: defaultOptions,
              foodOptions: defaultFoodOptions,
            }

            updateAgentData(agentData)
            setAgentId(params.id)
          }
        }
      } catch (error) {
        console.error("Error loading agent data:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'agent",
          variant: "destructive",
        })
      } finally {
        setIsInitializing(false)
      }
    }

    loadAgentData()
  }, [params.id, updateAgentData, setAgentId, toast])

  // Gestionnaires d'événements pour les changements de valeurs
  const handleEstablishmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setEstablishment(newValue)
    if (newValue.trim()) {
      setErrors((prev) => ({ ...prev, establishment: false }))
    }
  }

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setWebsite(newValue)
    if (newValue.trim()) {
      setErrors((prev) => ({ ...prev, website: false }))
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setAddress(newValue)
    if (newValue.trim()) {
      setErrors((prev) => ({ ...prev, address: false }))
    }
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setCity(newValue)
    if (newValue.trim()) {
      setErrors((prev) => ({ ...prev, city: false }))
    }
  }

  const handleClosureDaysEnabledChange = (checked: boolean) => {
    setClosureDaysEnabled(checked)
  }

  const handleClosureDatesChange = (dates: Date[] | undefined) => {
    setClosureDates(dates || [])
  }

  const handleAdditionalInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setAdditionalInfo(newValue)
  }

  const validateForm = () => {
    const newErrors = {
      establishment: !establishment.trim(),
      website: false, // Rendu facultatif
      address: false, // Rendu facultatif
      city: !city.trim(),
    }

    setErrors(newErrors)
    setIsSubmitted(true)

    // Faire défiler vers la première erreur
    if (newErrors.establishment && establishmentRef.current) {
      establishmentRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      return false
    } else if (newErrors.city && cityRef.current) {
      cityRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      return false
    }

    return !Object.values(newErrors).some((error) => error)
  }

  const handlePrevious = () => {
    saveFormData()
    router.push(`/agents/${params.id}/create`)
  }

  const handleSaveAsDraft = async () => {
    try {
      setIsLoading(true)
      await saveFormData(true)
      toast({
        title: "Brouillon enregistré",
        description: "Votre agent a été sauvegardé comme brouillon",
        variant: "success",
      })
      router.push("/agents")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = async () => {
    if (!validateForm()) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      await saveFormData()
      toast({
        title: "Informations enregistrées",
        description: "Passons à l'étape suivante",
        variant: "success",
      })
      router.push(`/agents/${params.id}/configuration`)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour sauvegarder toutes les données du formulaire
  const saveFormData = async (asDraft = false) => {
    // Mise à jour du contexte local
    const updatedData = {
      establishment,
      website,
      address,
      city,
      closureDays: {
        enabled: closureDaysEnabled,
        dates: closureDates,
      },
      additionalInfo,
    }

    updateAgentData(updatedData)

    // Envoi au backend - only update the name and status in the database
    try {
      if (asDraft) {
        await agentService.saveAgentDraft({
          id: params.id,
          name: agentData.name,
          status: "draft",
        })
      } else {
        // Mise à jour d'un agent existant - only basic fields
        await agentService.updateAgent(params.id, {
          name: agentData.name,
          status: "draft",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      throw error
    }
  }

  // Gérer les changements d'horaires d'ouverture
  const handleOpeningHoursChange = (day: string, period: "lunch" | "dinner", isOpen: boolean) => {
    const updatedHours = { ...(agentData.openingHours || defaultOpeningHours) }
    if (updatedHours && updatedHours[day]) {
      updatedHours[day][period].open = isOpen
      updateAgentData({ openingHours: updatedHours })
    }
  }

  // Gérer les changements d'options
  const handleOptionChange = (option: string, checked: boolean) => {
    const updatedOptions = { ...(agentData.options || defaultOptions) }
    if (updatedOptions) {
      updatedOptions[option] = checked
      updateAgentData({ options: updatedOptions })
    }
  }

  // Gérer les changements d'options alimentaires
  const handleFoodOptionChange = (option: string, checked: boolean) => {
    const updatedFoodOptions = { ...(agentData.foodOptions || defaultFoodOptions) }
    if (updatedFoodOptions) {
      updatedFoodOptions[option] = checked
      updateAgentData({ foodOptions: updatedFoodOptions })
    }
  }

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Use openingHours from context or default if not available
  const openingHours = agentData.openingHours || defaultOpeningHours
  const options = agentData.options || defaultOptions
  const foodOptions = agentData.foodOptions || defaultFoodOptions

  return (
    <AgentCreationLayout agentId={params.id} activeTab="informations">
      <SectionCard>
        <FormRow>
          <div ref={establishmentRef}>
            <label className="block text-sm font-medium mb-1">
              Nom de l'établissement <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nom de l'établissement"
              value={establishment}
              onChange={handleEstablishmentChange}
              onBlur={() => updateAgentData({ establishment })}
              className={errors.establishment ? "border-red-500" : ""}
            />
            {errors.establishment && <p className="text-red-500 text-xs mt-1">Ce champ est obligatoire</p>}
          </div>
          <div ref={websiteRef}>
            <label className="block text-sm font-medium mb-1">Site internet / Facebook</label>
            <Input
              placeholder="https://"
              value={website}
              onChange={handleWebsiteChange}
              onBlur={() => updateAgentData({ website })}
              className={errors.website ? "border-red-500" : ""}
            />
            {errors.website && <p className="text-red-500 text-xs mt-1">Ce champ est obligatoire</p>}
          </div>
        </FormRow>

        <FormRow>
          <div ref={addressRef}>
            <label className="block text-sm font-medium mb-1">Adresse</label>
            <Input
              placeholder="Adresse"
              value={address}
              onChange={handleAddressChange}
              onBlur={() => updateAgentData({ address })}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">Ce champ est obligatoire</p>}
          </div>
          <div ref={cityRef}>
            <label className="block text-sm font-medium mb-1">
              Ville <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Ville"
              value={city}
              onChange={handleCityChange}
              onBlur={() => updateAgentData({ city })}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">Ce champ est obligatoire</p>}
          </div>
        </FormRow>
      </SectionCard>

      <SectionCard icon={<Clock className="h-5 w-5" />} title="Horaires d'ouverture" iconColor="bg-icon-clock">
        <div className="mb-4 grid grid-cols-7 text-center">
          <div></div>
          <div className="col-span-3 font-medium">Midi</div>
          <div className="col-span-3 font-medium">Soir</div>
        </div>

        {Object.entries(openingHours).map(([day, periods]) => (
          <OpeningHoursRow
            key={day}
            day={day}
            initialLunch={periods.lunch.open}
            initialDinner={periods.dinner.open}
            onLunchChange={(isOpen) => handleOpeningHoursChange(day, "lunch", isOpen)}
            onDinnerChange={(isOpen) => handleOpeningHoursChange(day, "dinner", isOpen)}
          />
        ))}
      </SectionCard>

      <SectionCard icon={<CalendarX className="h-5 w-5" />} title="Jours de fermeture" iconColor="bg-icon-calendar">
        <div className="flex justify-end mb-4">
          <Switch
            checked={closureDaysEnabled}
            onCheckedChange={(checked) => {
              handleClosureDaysEnabledChange(checked)
              updateAgentData({
                closureDays: {
                  enabled: checked,
                  dates: closureDates,
                },
              })
            }}
          />
        </div>

        {closureDaysEnabled && (
          <>
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Récapitulatif :</div>
              <div className="text-sm text-muted-foreground">Du 05/04/2025 au 10/04/2025</div>
            </div>

            <div className="flex justify-center">
              <Calendar
                mode="multiple"
                selected={closureDates}
                onSelect={(selectedDates) => {
                  const dates = selectedDates || []
                  handleClosureDatesChange(dates)
                  updateAgentData({
                    closureDays: {
                      enabled: closureDaysEnabled,
                      dates,
                    },
                  })
                }}
                className="rounded-md border"
                locale={fr}
                month={new Date(2025, 3)} // Avril 2025
                fixedWeeks
              />
            </div>
          </>
        )}
      </SectionCard>

      <SectionCard icon={<Settings className="h-5 w-5" />} title="Options & Services" iconColor="bg-icon-settings">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2">
          {Object.entries(options).map(([option, isEnabled]) => (
            <OptionToggle
              key={option}
              label={option}
              initialValue={isEnabled}
              onChange={(checked) => handleOptionChange(option, checked)}
            />
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="ghost" className="text-primary flex items-center">
            <Plus className="h-4 w-4 mr-1" /> <span className="text-primary">Ajouter une option</span>
          </Button>
        </div>
      </SectionCard>

      <SectionCard icon={<Settings className="h-5 w-5" />} title="Options alimentaires" iconColor="bg-icon-settings">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2">
          {Object.entries(foodOptions).map(([option, isEnabled]) => (
            <OptionToggle
              key={option}
              label={option}
              initialValue={isEnabled}
              onChange={(checked) => handleFoodOptionChange(option, checked)}
            />
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="ghost" className="text-primary flex items-center">
            <Plus className="h-4 w-4 mr-1" /> <span className="text-primary">Ajouter une option</span>
          </Button>
        </div>
      </SectionCard>

      <SectionCard icon={<FileText className="h-5 w-5" />} title="Documents" iconColor="bg-icon-document">
        <FileUpload label="Importer documents" acceptedFormats="Format accepté: PDF (max10MB)" />
      </SectionCard>

      <SectionCard icon={<Info className="h-5 w-5" />} title="Informations complémentaires" iconColor="bg-icon-info">
        <Textarea
          placeholder="Ajoutez des informations complémentaires ici..."
          className="min-h-[100px]"
          value={additionalInfo}
          onChange={handleAdditionalInfoChange}
          onBlur={() => updateAgentData({ additionalInfo })}
        />
      </SectionCard>

      <ActionButtons
        onPrevious={handlePrevious}
        onSaveAsDraft={handleSaveAsDraft}
        onContinue={handleContinue}
        disabled={isLoading}
      />
    </AgentCreationLayout>
  )
}
