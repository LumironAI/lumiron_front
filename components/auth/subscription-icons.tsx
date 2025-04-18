import { Flame, Rocket, Star } from "lucide-react"

interface SubscriptionIconProps {
  type: "flame" | "rocket" | "star"
  className?: string
}

export function SubscriptionIcon({ type, className = "" }: SubscriptionIconProps) {
  switch (type) {
    case "flame":
      return <Flame className={`h-5 w-5 ${className}`} />
    case "rocket":
      return <Rocket className={`h-5 w-5 ${className}`} />
    case "star":
      return <Star className={`h-5 w-5 ${className}`} />
    default:
      return null
  }
}
