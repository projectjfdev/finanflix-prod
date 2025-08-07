'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface MessageResponse {
  type: 'success' | 'error' | 'info'
  message: string
}

interface EnhancedModalProps {
  messageRes: MessageResponse
  onClose: () => void
  children: any;
}

export function EnhancedModal({ messageRes, onClose,children }: EnhancedModalProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (messageRes.type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-500" />
      default:
        return <Info className="w-12 h-12 text-blue-500" />
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
        {children}
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <CardTitle className="text-2xl font-bold text-center">
            {messageRes.type.charAt(0).toUpperCase() + messageRes.type.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {getIcon()}
          <p className="text-center text-lg">{messageRes.message}</p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

