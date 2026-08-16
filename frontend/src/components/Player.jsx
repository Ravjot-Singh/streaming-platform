import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
 
export default function Player({ hlsUrl }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [levels, setLevels] = useState([])
  const [currentLevel, setCurrentLevel] = useState(-1) 
 
  useEffect(() => {
    const video = videoRef.current
    if (!video || !hlsUrl) return
 
    if (Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      hls.loadSource(hlsUrl)
      hls.attachMedia(video)
 
      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setStatus('ready')
        setLevels(data.levels)
        video.play().catch((err) => console.warn('Autoplay blocked:', err))
      })
 
      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error('hls.js error:', data)
        if (data.fatal) setStatus('error')
      })
 
      return () => {
        hls.destroy()
        hlsRef.current = null
      }
    }
 
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl
      video.play().catch((err) => console.warn('Autoplay blocked:', err))
      setStatus('ready')
      return
    }
 
    setStatus('unsupported')
  }, [hlsUrl])
 
  function handleQualityChange(e) {
    const value = Number(e.target.value)
    setCurrentLevel(value)
    if (hlsRef.current) {
      hlsRef.current.currentLevel = value 
    }
  }
 
  function levelLabel(level) {
    return level.height ? `${level.height}p` : 'Source'
  }
 
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl">
      <video ref={videoRef} controls autoPlay muted className="w-full aspect-video bg-black" />
      <div className="flex items-center justify-between px-3 py-2 border-t border-white/10 bg-black/40">
        <p className="text-xs text-neutral-500">Status: {status}</p>
        {levels.length > 0 && (
          <select
            value={currentLevel}
            onChange={handleQualityChange}
            className="text-xs bg-black/50 border border-white/10 rounded px-2 py-1 text-neutral-300"
          >
            <option value={-1}>Auto</option>
            {levels.map((level, index) => (
              <option key={index} value={index}>
                {levelLabel(level)}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}