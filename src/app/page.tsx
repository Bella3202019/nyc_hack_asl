"use client"

import * as React from "react"

import { Camera, Mic, Copy, Link, VolumeX, Volume2 } from "lucide-react"


export default function Page() {
  const [leftVideoStream, setLeftVideoStream] = React.useState<MediaStream | null>(null)
  const [rightVideoStream, setRightVideoStream] = React.useState<MediaStream | null>(null)
  const [leftAudioStream, setLeftAudioStream] = React.useState<MediaStream | null>(null)
  const [rightAudioStream, setRightAudioStream] = React.useState<MediaStream | null>(null)
  const [logs, setLogs] = React.useState<string[]>([])
  const [inviteLink, setInviteLink] = React.useState("")
  const [leftText, setLeftText] = React.useState("")
  const [rightText, setRightText] = React.useState("")

  const leftVideoRef = React.useRef<HTMLVideoElement>(null)
  const rightVideoRef = React.useRef<HTMLVideoElement>(null)
  const leftAudioRef = React.useRef<HTMLAudioElement>(null)
  const rightAudioRef = React.useRef<HTMLAudioElement>(null)

  
  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleMedia = async (type: 'camera' | 'microphone', side: 'left' | 'right') => {
    try {
      let stream: MediaStream | null = null
      if (type === 'camera') {
        stream = side === 'left' ? leftVideoStream : rightVideoStream
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
          addLog(`Camera ${side} stopped`)
          if (side === 'left') {
            setLeftVideoStream(null)
            if (leftVideoRef.current) leftVideoRef.current.srcObject = null
          } else {
            setRightVideoStream(null)
            if (rightVideoRef.current) rightVideoRef.current.srcObject = null
          }
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ video: true })
          addLog(`Camera access granted for ${side} side`)
          if (side === 'left') {
            setLeftVideoStream(stream)
            if (leftVideoRef.current) leftVideoRef.current.srcObject = stream
          } else {
            setRightVideoStream(stream)
            if (rightVideoRef.current) rightVideoRef.current.srcObject = stream
          }
        }
      } else {
        stream = side === 'left' ? leftAudioStream : rightAudioStream
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
          addLog(`Microphone ${side} stopped`)
          if (side === 'left') {
            setLeftAudioStream(null)
            if (leftAudioRef.current) leftAudioRef.current.srcObject = null
          } else {
            setRightAudioStream(null)
            if (rightAudioRef.current) rightAudioRef.current.srcObject = null
          }
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          addLog(`Microphone access granted for ${side} side`)
          if (side === 'left') {
            setLeftAudioStream(stream)
            if (leftAudioRef.current) leftAudioRef.current.srcObject = stream
          } else {
            setRightAudioStream(stream)
            if (rightAudioRef.current) rightAudioRef.current.srcObject = stream
          }
        }
      }
    } catch (error) {
      addLog(`Failed to access ${type} for ${side} side: ${error}`)
    }
  }

  const generateInviteLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?invite=${Date.now()}`
    setInviteLink(link)
    addLog("Invite link generated")
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    addLog("Invite link copied")
  }

  // Simulating text generation from audio/video
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLeftText("Lorem ipsum " + new Date().toLocaleTimeString())
      setRightText("Dolor sit amet " + new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full min-h-screen p-4 bg-background">
      <h1 className="text-3xl font-bold text-center mb-8">American Sign Language (ASL) Expressor</h1>
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-8">
        <div className="w-full md:w-[45%] space-y-4">
          <video ref={leftVideoRef} className="w-full aspect-video bg-muted mb-4" autoPlay muted playsInline />
          <div className="flex justify-center gap-4">
            <button onClick={() => handleMedia('camera', 'left')} className="p-2 bg-blue-500 text-white rounded">
              <Camera className="h-6 w-6" />
            </button>
            <button onClick={() => handleMedia('microphone', 'left')} className="p-2 bg-blue-500 text-white rounded">
              <Mic className="h-6 w-6" />
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Audio</h3>
            <div className="flex items-center space-x-2">
              <audio ref={leftAudioRef} autoPlay className="w-full" />
              <button
                onClick={() => {
                  if (leftAudioRef.current) {
                    leftAudioRef.current.muted = !leftAudioRef.current.muted;
                  }
                }}
                className="p-2 bg-blue-500 text-white rounded"
              >
                {leftAudioRef.current?.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Text</h3>
            <div className="bg-white p-2 rounded whitespace-nowrap overflow-hidden">
              {leftText}
            </div>
          </div>
        </div>
        <div className="w-full md:w-[45%] space-y-4">
          <video ref={rightVideoRef} className="w-full aspect-video bg-muted mb-4" autoPlay muted playsInline />
          <div className="flex justify-center gap-4">
            <button onClick={() => handleMedia('camera', 'right')} className="p-2 bg-blue-500 text-white rounded">
              <Camera className="h-6 w-6" />
            </button>
            <button onClick={() => handleMedia('microphone', 'right')} className="p-2 bg-blue-500 text-white rounded">
              <Mic className="h-6 w-6" />
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Audio</h3>
            <div className="flex items-center space-x-2">
              <audio ref={rightAudioRef} autoPlay className="w-full" />
              <button
                onClick={() => {
                  if (rightAudioRef.current) {
                    rightAudioRef.current.muted = !rightAudioRef.current.muted;
                  }
                }}
                className="p-2 bg-blue-500 text-white rounded"
              >
                {rightAudioRef.current?.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Text</h3>
            <div className="bg-white p-2 rounded whitespace-nowrap overflow-hidden">
              {rightText}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Invite Link</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={inviteLink}
            readOnly
            placeholder="Generate an invite link"
            className="flex-grow p-2 border rounded"
          />
          <button onClick={generateInviteLink} className="p-2 bg-blue-500 text-white rounded flex items-center">
            <Link className="mr-2 h-4 w-4" />
            Generate
          </button>
          <button onClick={copyInviteLink} className="p-2 bg-blue-500 text-white rounded flex items-center">
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Logs</h2>
        <div className="bg-gray-100 p-4 rounded-lg h-48 overflow-y-auto">
          {logs.map((log, index) => (
            <p key={index} className="text-sm">{log}</p>
          ))}
        </div>
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p className="text-sm font-semibold">Latest Log:</p>
          <p className="text-sm">{logs[logs.length - 1] || "No logs yet."}</p>
        </div>
      </div>
    </div>
  )
}