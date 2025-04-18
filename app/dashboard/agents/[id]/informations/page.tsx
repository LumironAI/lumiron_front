"use client"

import { Button } from "@/components/ui/button"
import type React from "react"
import { useState, useRef, useEffect, use } from "react"
import { useRouter, useParams } from "next/navigation"
import { Clock, CalendarX, Settings, Info, FileText, Plus, Coffee, Utensils } from "lucide-react"
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

export default function AgentInformationsPage({ params }: { params: Promise<{ id: string }> }) {
  const routeParams = useParams()
  const unwrappedParams = use(params)
  const agentId = unwrappedParams.id || (routeParams?.id as string)
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
  const [isAgentLoaded, setIsAgentLoaded] = useState(false)

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
    // Éviter de charger l'agent plus d'une fois
    if (isAgentLoaded) {
      return;
    }
    
    async function loadAgentData() {
      try {
        if (agentId) {
          setIsInitializing(true)
          setIsAgentLoaded(true)
          const { data, error } = await agentService.getAgentById(agentId)

          if (error) {
            throw error
          }

          if (data) {
            // Update context with loaded data and defaults for missing fields
            const updatedAgentData = {
              id: data.id.toString(),
              name: data.name,
              status: data.status,
              sector: data.sector || "restaurant", // Default sector
              establishment: data.establishment || "",
              website: data.website || "",
              address: data.address || "",
              city: data.city || "",
              openingHours: data.openingHours || defaultOpeningHours,
              options: data.options || defaultOptions,
              foodOptions: data.foodOptions || defaultFoodOptions,
              closureDays: data.closureDays || { enabled: false, dates: [] },
              additionalInfo: data.additionalInfo || "",
            }

            // Mettre à jour les états locaux
            setEstablishment(updatedAgentData.establishment)
            setWebsite(updatedAgentData.website)
            setAddress(updatedAgentData.address)
            setCity(updatedAgentData.city)
            setClosureDaysEnabled(updatedAgentData.closureDays.enabled)
            setClosureDates(updatedAgentData.closureDays.dates)
            setAdditionalInfo(updatedAgentData.additionalInfo)

            updateAgentData(updatedAgentData)
            setAgentId(agentId)
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
  }, [agentId, isAgentLoaded, updateAgentData, setAgentId, toast])

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
    router.push(`/dashboard/agents/${agentId}/create`)
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
      router.push("/dashboard/agents")
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
      return
    }

    try {
      setIsLoading(true)
      await saveFormData()
      toast({
        title: "Étape terminée",
        description: "Les informations ont été enregistrées",
        variant: "success",
      })
      router.push(`/dashboard/agents/${agentId}/configuration`)
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

  const saveFormData = async (asDraft = false) => {
    // Save form data
    const formData = {
      establishment,
      website,
      address,
      city,
      additionalInfo,
      closureDays: {
        enabled: closureDaysEnabled,
        dates: closureDates,
      },
    }

    // Update context
    updateAgentData({
      ...agentData,
      ...formData,
    })

    // Save to API
    if (agentId) {
      await agentService.updateAgent(agentId, {
        name: agentData.name,
        status: asDraft ? "draft" : agentData.status || "draft",
      })
    }
  }

  const handleOpeningHoursChange = (day: string, period: "lunch" | "dinner", isOpen: boolean) => {
    const updatedOpeningHours = { ...agentData.openingHours }
    if (updatedOpeningHours[day]) {
      updatedOpeningHours[day][period].open = isOpen
    }
    updateAgentData({ ...agentData, openingHours: updatedOpeningHours })
  }

  const handleOpeningHoursTimeChange = (
    day: string, 
    period: "lunch" | "dinner", 
    type: "start" | "end", 
    time: string
  ) => {
    const updatedOpeningHours = { ...agentData.openingHours }
    if (updatedOpeningHours[day]) {
      updatedOpeningHours[day][period][type] = time
    }
    updateAgentData({ ...agentData, openingHours: updatedOpeningHours })
  }

  const handleOptionChange = (option: string, checked: boolean) => {
    const updatedOptions = { ...agentData.options }
    updatedOptions[option] = checked
    updateAgentData({ ...agentData, options: updatedOptions })
  }

  const handleFoodOptionChange = (option: string, checked: boolean) => {
    const updatedFoodOptions = { ...agentData.foodOptions }
    updatedFoodOptions[option] = checked
    updateAgentData({ ...agentData, foodOptions: updatedFoodOptions })
  }

  // Afficher un chargement pendant l'initialisation
  if (isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AgentCreationLayout agentId={agentId} activeTab="informations">
      {/* Informations principales */}
      <SectionCard title="Informations principales">
        <div ref={establishmentRef} className="mb-4">
          <FormRow
            label="Nom de l'établissement"
            required
            error={isSubmitted && errors.establishment ? "Champ requis" : undefined}
          >
            <Input value={establishment} onChange={handleEstablishmentChange} className="w-full" />
          </FormRow>
        </div>
        <div ref={websiteRef} className="mb-4">
          <FormRow label="Site web">
            <Input value={website} onChange={handleWebsiteChange} type="url" placeholder="https://..." className="w-full" />
          </FormRow>
        </div>
        <div ref={addressRef} className="mb-4">
          <FormRow label="Adresse">
            <Input value={address} onChange={handleAddressChange} className="w-full" />
          </FormRow>
        </div>
        <div ref={cityRef}>
          <FormRow
            label="Ville"
            required
            error={isSubmitted && errors.city ? "Champ requis" : undefined}
          >
            <Input value={city} onChange={handleCityChange} className="w-full" />
          </FormRow>
        </div>
      </SectionCard>

      {/* Horaires d'ouverture */}
      <SectionCard icon={<Clock className="h-5 w-5" />} title="Horaires d'ouverture" iconColor="bg-sky-100">
        {/* En-tête du tableau */}
        <div className="grid grid-cols-7 items-center py-2 border-b font-medium text-sm">
          <div></div>
          <div className="text-center">Midi</div>
          <div className="col-span-2 text-center">Horaire</div>
          <div className="text-center">Soir</div>
          <div className="col-span-2 text-center">Horaire</div>
        </div>
        
        {/* Jours de la semaine */}
        <div className="space-y-0">
          {Object.entries(agentData.openingHours || defaultOpeningHours).map(([day, periods]) => (
            <OpeningHoursRow
              key={day}
              day={day}
              lunchHours={periods.lunch}
              dinnerHours={periods.dinner}
              onToggle={handleOpeningHoursChange}
              onTimeChange={handleOpeningHoursTimeChange}
            />
          ))}
        </div>
      </SectionCard>

      {/* Jours de fermeture */}
      <SectionCard icon={<CalendarX className="h-5 w-5" />} title="Jours de fermeture" iconColor="bg-red-100">
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Périodes de fermeture</span>
            <Switch checked={closureDaysEnabled} onCheckedChange={handleClosureDaysEnabledChange} />
          </div>
          {closureDaysEnabled && (
            <div className="border rounded-lg p-4">
              <Calendar
                mode="multiple"
                selected={closureDates}
                onSelect={handleClosureDatesChange}
                className="mx-auto"
                locale={fr}
              />
            </div>
          )}
        </div>
      </SectionCard>

      {/* Options disponibles et alimentaires */}
      <SectionCard>
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-gray-100 p-2 rounded-md">
            <Settings className="h-5 w-5 text-gray-600" />
          </div>
          <h3 className="font-medium text-base">Options & Services</h3>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
            {Object.entries(agentData.options || defaultOptions).map(([option, isChecked]) => (
              <OptionToggle
                key={option}
                label={option}
                checked={isChecked}
                onCheckedChange={(checked) => handleOptionChange(option, checked)}
              />
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <Button variant="ghost" className="text-blue-500 flex items-center text-xs">
              <Plus className="h-3 w-3 mr-1" /> Ajouter une option
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-amber-50 p-2 rounded-md">
            <Utensils className="h-5 w-5 text-amber-500" />
          </div>
          <h3 className="font-medium text-base">Options alimentaires</h3>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
            {Object.entries(agentData.foodOptions || defaultFoodOptions).map(([option, isChecked]) => (
              <OptionToggle
                key={option}
                label={option}
                checked={isChecked}
                onCheckedChange={(checked) => handleFoodOptionChange(option, checked)}
              />
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <Button variant="ghost" className="text-blue-500 flex items-center text-xs">
              <Plus className="h-3 w-3 mr-1" /> Ajouter une option
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* Documents */}
      <SectionCard icon={<FileText className="h-5 w-5" />} title="Documents" iconColor="bg-blue-100">
        <FileUpload label="Importer documents" acceptedFormats="Format accepté: PDF (max10MB)" />
      </SectionCard>

      {/* Informations complémentaires */}
      <SectionCard icon={<Info className="h-5 w-5" />} title="Informations complémentaires" iconColor="bg-yellow-100">
        <Textarea
          placeholder="Ajoutez des informations complémentaires ici..."
          className="min-h-[100px] w-full"
          value={additionalInfo}
          onChange={handleAdditionalInfoChange}
          onBlur={() => updateAgentData({ ...agentData, additionalInfo })}
        />
      </SectionCard>

      {/* Boutons d'action */}
      <div className="flex justify-between mt-6">
        <ActionButtons
          onPrevious={handlePrevious}
          onSaveAsDraft={handleSaveAsDraft}
          onContinue={handleContinue}
          disabled={isLoading}
        />
      </div>
    </AgentCreationLayout>
  )
}
