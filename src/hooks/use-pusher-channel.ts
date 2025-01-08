'use client'

import { useEffect, useState, useRef } from 'react'
import { Channel } from 'pusher-js'
import { pusherClient } from '@/lib/realtime/pusher'
import { toast } from 'sonner'

interface UsePusherChannelProps<T> {
  channelName: string
  eventName: string
  callback: (data: T) => void
  sound?: string
}

export function usePusherChannel<T>({ channelName, eventName, callback, sound }: UsePusherChannelProps<T>) {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [hasInteraction, setHasInteraction] = useState(false)
  const [audioReady, setAudioReady] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Inisialisasi Audio Context
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

    const audioInstance = new Audio(sound || '/sounds/notif.wav')
    audioRef.current = audioInstance

    audioInstance.addEventListener('canplaythrough', () => {
      setAudioReady(true)
    })

    audioInstance.load()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      audioRef.current = null
    }
  }, [sound])

  // Handle user interaction
  useEffect(() => {
    const resumeAudioContext = async () => {
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume().then(() => {
          setHasInteraction(true)
        })
      }
    }

    const handleInteraction = async () => {
      await resumeAudioContext()
    }

    const events = ['click', 'touchstart', 'keydown', 'mousedown']
    events.forEach(event => {
      document.addEventListener(event, handleInteraction)
    })

    // Check if we already have interaction
    if (audioContextRef.current?.state === 'running') {
      setHasInteraction(true)
    }

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction)
      })
    }
  }, [])

  // Pusher subscription and event handling
  useEffect(() => {
    const channelInstance = pusherClient.subscribe(channelName)
    setChannel(channelInstance)

    const stableCallback = async (rawData: unknown) => {
      let parsedData: T
      if (typeof rawData === 'string') {
        try {
          const cleanedString = rawData
            .replace(/[\r\n\s]+/g, ' ')
            .replace(/'/g, '"')
            .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
          parsedData = JSON.parse(cleanedString) as T
        } catch {
          parsedData = rawData as T
        }
      } else {
        parsedData = rawData as T
      }

      if (audioRef.current && audioReady && hasInteraction) {
        const audio = audioRef.current
        audio.currentTime = 0
        audio.autoplay = true

        try {
          // Resume AudioContext if needed
          if (audioContextRef.current?.state === 'suspended') {
            await audioContextRef.current.resume()
          }

          // Play audio
          await audio.play()
        } catch {
          toast.error('Gagal memutar audio')
        }
      }

      callback(parsedData)
    }

    channelInstance.bind(eventName, stableCallback)

    return () => {
      channelInstance.unbind(eventName, stableCallback)
      pusherClient.unsubscribe(channelName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, eventName, audioReady, hasInteraction])

  return channel
}
