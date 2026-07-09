import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { MediaInfo, VideoFormat, AudioFormat } from '../../types'

const execPromise = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, message: 'URL is required' },
        { status: 400 }
      )
    }

    // Use yt-dlp to fetch media information
    const command = `yt-dlp --dump-json --no-playlist --skip-download "${url}"`
    
    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
      console.error('yt-dlp stderr:', stderr)
    }

    const data = JSON.parse(stdout)

    // Process video formats
    const videoFormats: VideoFormat[] = data.formats
      .filter((f: any) => f.vcodec !== 'none')
      .map((f: any) => ({
        format_id: f.format_id,
        resolution: f.resolution || `${f.height}p`,
        quality: f.quality_label || f.format_note || 'Standard',
        filesize: f.filesize || f.filesize_approx || 0,
        ext: f.ext,
        url: f.url
      }))
      .sort((a: VideoFormat, b: VideoFormat) => {
        const aHeight = parseInt(a.resolution) || 0
        const bHeight = parseInt(b.resolution) || 0
        return bHeight - aHeight
      })

    // Process audio formats
    const audioFormats: AudioFormat[] = data.formats
      .filter((f: any) => f.acodec !== 'none' && f.vcodec === 'none')
      .map((f: any) => ({
        format_id: f.format_id,
        bitrate: f.abr ? `${f.abr}kbps` : `${f.tbr}kbps`,
        filesize: f.filesize || f.filesize_approx || 0,
        ext: f.ext,
        url: f.url
      }))
      .sort((a: AudioFormat, b: AudioFormat) => {
        const aBitrate = parseInt(a.bitrate) || 0
        const bBitrate = parseInt(b.bitrate) || 0
        return bBitrate - aBitrate
      })

    const mediaInfo: MediaInfo = {
      title: data.title,
      thumbnail: data.thumbnail,
      duration: data.duration,
      video_formats: videoFormats,
      audio_formats: audioFormats,
      webpage_url: data.webpage_url
    }

    return NextResponse.json({
      success: true,
      data: mediaInfo
    })

  } catch (error: any) {
    console.error('Conversion error:', error)
    
    let errorMessage = 'Failed to process the URL. Please check the URL and try again.'
    
    if (error.message.includes('ERROR: Unsupported URL')) {
      errorMessage = 'Unsupported URL. Please use a link from a supported platform.'
    } else if (error.message.includes('ERROR: Video unavailable')) {
      errorMessage = 'Video is unavailable or private. Please check the URL.'
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}

