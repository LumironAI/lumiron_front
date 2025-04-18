"use client"

import { useState, useEffect, useRef } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // État pour stocker notre valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      // Récupérer depuis localStorage par clé
      const item = window.localStorage.getItem(key)
      // Parser le JSON stocké ou retourner initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  // Utiliser une ref pour éviter de déclencher useEffect lors des mises à jour
  const prevValueRef = useRef<T>(storedValue)

  // Fonction pour mettre à jour la valeur dans localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre à la valeur d'être une fonction pour qu'on ait la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Ne mettre à jour que si la valeur a changé
      if (JSON.stringify(valueToStore) !== JSON.stringify(prevValueRef.current)) {
        // Sauvegarder l'état
        setStoredValue(valueToStore)
        prevValueRef.current = valueToStore

        // Sauvegarder dans localStorage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Synchroniser avec localStorage quand la clé change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsedItem = JSON.parse(item)
        if (JSON.stringify(parsedItem) !== JSON.stringify(prevValueRef.current)) {
          setStoredValue(parsedItem)
          prevValueRef.current = parsedItem
        }
      }
    }
  }, [key])

  return [storedValue, setValue] as const
}
