"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import YouTube from "react-youtube"

const MAX_WORDS = 3

export default function SpeechToText() {
  const [isListening, setIsListening] = useState(false)
  const [words, setWords] = useState<string[]>([])

  useEffect(() => {
    if (!isListening) return

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-EN"

    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")

      const newWords = currentTranscript.split(" ")

      setWords((prevWords) => {
        const updatedWords = [...prevWords, ...newWords.slice(prevWords.length)]
        return updatedWords.slice(-MAX_WORDS)
      })
    }

    recognition.onend = () => setIsListening(false)

    recognition.start()
    return () => recognition.stop()
  }, [isListening])

  const startListening = () => {
    setWords([])
    setIsListening(true)
  }

  const stopListening = () => {
    setIsListening(false)
  }

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: "JSquQb-uzpI",
      controls: 0,
    },
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <YouTube videoId="JSquQb-uzpI" opts={opts} className="w-full h-full" />
      </div>
      <div className="absolute inset-y-0 left-0 w-1/3 z-10 flex flex-col justify-center p-8">
        <AnimatePresence>
          {words.map((word, index) => (
            <motion.div
              key={`${index}-${word}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-6xl font-bold text-yellow-300 mb-4"
            >
              {word}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex justify-center space-x-4">
          <button
            onClick={startListening}
            disabled={isListening}
            className={`px-6 py-2 text-white rounded-full text-lg font-semibold transition-colors ${
              isListening ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isListening ? "Recording..." : "Start Recording"}
          </button>
          <button
            onClick={stopListening}
            disabled={!isListening}
            className={`px-6 py-2 text-white rounded-full text-lg font-semibold transition-colors ${
              !isListening ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Stop Recording
          </button>
        </div>
      </div>
    </div>
  )
}

