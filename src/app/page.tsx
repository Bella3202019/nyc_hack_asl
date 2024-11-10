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
            setIsLeftCamerEnabled(false)
            if (leftVideoRef.current) leftVideoRef.current.srcObject = null
            if (isRecording) stopRecording()
          } else {
            setRightVideoStream(null)
            setIsRightCamerEnabled(false)
            if (rightVideoRef.current) rightVideoRef.current.srcObject = null
          }
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ video: true })
          addLog(`Camera access granted for ${side} side`)
          if (side === 'left') {
            setLeftVideoStream(stream)
            setIsLeftCamerEnabled(true)
            if (leftVideoRef.current) leftVideoRef.current.srcObject = stream
          } else {
            setRightVideoStream(stream)
            setIsRightCamerEnabled(true)
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
            setIsLeftMicEnabled(false)
            if (leftAudioRef.current) leftAudioRef.current.srcObject = null
          } else {
            setRightAudioStream(null)
            setIsRightMicEnabled(false)
            if (rightAudioRef.current) rightAudioRef.current.srcObject = null
          }
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          addLog(`Microphone access granted for ${side} side`)
          if (side === 'left') {
            setLeftAudioStream(stream)
            setIsLeftMicEnabled(true)
            if (leftAudioRef.current) leftAudioRef.current.srcObject = stream
          } else {
            setRightAudioStream(stream)
            setIsRightMicEnabled(true)
            if (rightAudioRef.current) rightAudioRef.current.srcObject = stream
          }
        }
      }
    } catch (error) {
      addLog(`Failed to access ${type} for ${side} side: ${error}`)
    }
  }

  const startRecording = () => {
    if (!leftVideoStream) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(leftVideoStream);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recorded-video-${new Date().toISOString()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };

    mediaRecorder.start(1000);
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };


  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const audioURL = URL.createObjectURL(file);
      setLeftAudioSrc(audioURL);
    }
  };

  const handleRightMediaUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const mediaUrl = URL.createObjectURL(file);
      setRightMediaSrc(mediaUrl);
    }
  }

  const handleLeftMediaUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const mediaUrl = URL.createObjectURL(file);
      setLeftMediaSrc(mediaUrl);
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
          
          <video ref={leftVideoRef} src={leftMediaSrc || undefined} controls className="w-full aspect-video bg-muted mb-4" autoPlay muted playsInline />
          <div className="flex justify-center gap-4">
          <input type="file" accept="audio/*,video/mp4" onChange={handleLeftMediaUpload} className="mb-2"/>

            <button onClick={() => handleMedia('camera', 'left')} 
            className={`p-2 rounded transition-colors ${
              isLeftCameraEnabled 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-red-500 hover:bg-red-600'
            } text-white`}>
              <Camera className="h-6 w-6" />
            </button>
            <button onClick={() => handleMedia('microphone', 'left')}
            className={`p-2 rounded transition-colors ${
              isLeftMicEnabled 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-red-500 hover:bg-red-600'
            } text-white`}>
              <Mic className="h-6 w-6" />
            </button>
            <button 
                onClick={() => {
                  if (leftAudioRef.current) {
                    leftAudioRef.current.muted = !leftAudioRef.current.muted;
                    setIsLeftAudioMuted(!isLeftAudioMuted)
                  }
                }}
                className={`p-2 rounded transition-colors ${
                  !isLeftAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {leftAudioRef.current?.muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>
            {isLeftCameraEnabled && (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded transition-colors ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-green-600'
                } text-white`}
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
              >
                {isRecording ? (
                  <Square className="h-6 w-6" />
                ) : (
                  <Circle className="h-6 w-6 fill-current" />
                )}
              </button>
            )}
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black">Audio</h3>
            <div className="flex items-center space-x-2">
            <input type="file" accept="audio/mp3" onChange={handleAudioUpload} className="mb-2"/>
              <audio ref={leftAudioRef} src={leftAudioSrc} autoPlay controls className="w-full" />
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black">Text</h3>
            <div className="bg-white p-2 rounded whitespace-nowrap overflow-hidden text-black">
              {leftText}
            </div>
          </div>
        </div>



        <div className="w-full md:w-[45%] space-y-4">
          <video ref={rightVideoRef} src={rightMediaSrc || undefined} controls className="w-full aspect-video bg-muted mb-4" autoPlay muted playsInline />
          <div className="flex justify-center gap-4">
          <input type="file" accept="audio/*,video/mp4" onChange={handleRightMediaUpload} className="mb-2"/>

            <button onClick={() => handleMedia('camera', 'right')}
            className={`p-2 rounded transition-colors ${
              isRightCameraEnabled 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-red-500 hover:bg-red-600'
            } text-white`}>
              <Camera className="h-6 w-6" />
            </button>
            <button onClick={() => handleMedia('microphone', 'right')} 
            className={`p-2 rounded transition-colors ${
              isRightMicEnabled 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-red-500 hover:bg-red-600'
            } text-white`}>
              <Mic className="h-6 w-6" />
            </button>
            <button
                onClick={() => {
                  if (rightAudioRef.current) {
                    rightAudioRef.current.muted = !rightAudioRef.current.muted;
                    setIsRightAudioMuted(!isRightAudioMuted)
                  }
                }}
                className={`p-2 rounded transition-colors ${
                  !isRightAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {rightAudioRef.current?.muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black">Audio</h3>
            <div className="flex items-center space-x-2">
              <audio ref={rightAudioRef} autoPlay controls className="w-full" />
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black">Text</h3>
            <div className="bg-white p-2 rounded whitespace-nowrap overflow-hidden text-black">
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