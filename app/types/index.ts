export interface VideoFormat {
  format_id: string
  resolution: string
  quality: string
  filesize: number
  ext: string
  url: string
}

export interface AudioFormat {
  format_id: string
  bitrate: string
  filesize: number
  ext: string
  url: string
}

export interface MediaInfo {
  title: string
  thumbnail: string
  duration: number
  video_formats: VideoFormat[]
  audio_formats: AudioFormat[]
  webpage_url: string
}

export interface SupportedSite {
  name: string
  icon: string
  url: string
}