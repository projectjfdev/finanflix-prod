import { useState, useEffect } from "react"

interface SubscriptionStatusProps {
  subscriptionId: string
}

export default function SubscriptionStatus({ subscriptionId }: SubscriptionStatusProps) {
  const [status, setStatus] = useState<string>("loading")

  useEffect(() => {
    // Aquí normalmente harías una llamada a tu API para obtener el estado real de la suscripción


    
    // Por ahora, lo simularemos con un timeout
    const timer = setTimeout(() => {
      setStatus("active")
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-4 dark:bg-background bg-background shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Estado de la Suscripción</h2>
      <p>ID de Suscripción: {subscriptionId}</p>
      <p>Estado: {status}</p>
    </div>
  )
}

