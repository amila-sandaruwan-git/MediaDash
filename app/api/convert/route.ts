import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { MediaInfo, VideoFormat, AudioFormat } from '../../types'
import * as fs from 'fs/promises'
import * as path from 'path'
import { randomUUID } from 'crypto'

const execPromise = promisify(exec)

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper to check if yt-dlp is installed
async function checkYtDlpInstalled(): Promise<boolean> {
  try {
    await execPromise('yt-dlp --version')
    return true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, action, formatId, quality } = await request.json()

    // Check if yt-dlp is installed
    const isInstalled = await checkYtDlpInstalled()
    if (!isInstalled) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'yt-dlp is not installed. Please install it first.' 
        },
        { status: 500 }
      )
    }

    // If this is a download request (not just fetching info)
    if (action === 'download') {
      if (!url || !formatId) {
        return NextResponse.json(
          { success: false, message: 'URL and format ID are required for download' },
          { status: 400 }
        )
      }

      // Generate a unique filename
      const filename = `${randomUUID()}_${Date.now()}`
      const outputPath = path.join(process.cwd(), 'tmp', filename)
      
      // Ensure tmp directory exists
      await fs.mkdir(path.join(process.cwd(), 'tmp'), { recursive: true })

      let downloadCommand: string
      let fileExtension: string = 'mp4'

      if (quality === 'audio') {
        // Download audio only
        fileExtension = 'mp3'
        downloadCommand = `yt-dlp -f "bestaudio[ext=m4a]/bestaudio" --extract-audio --audio-format mp3 --audio-quality 320K -o "${outputPath}.%(ext)s" "${url}"`
      } else {
        // Download video with audio (merged)
        // Try to get best video + best audio merged
        downloadCommand = `yt-dlp -f "bestvideo[height<=${quality}]+bestaudio[ext=m4a]/best[height<=${quality}]" --merge-output-format mp4 -o "${outputPath}.%(ext)s" "${url}"`
        fileExtension = 'mp4'
      }

      console.log('Executing download command:', downloadCommand)
      
      // Execute the download
      const { stdout, stderr } = await execPromise(downloadCommand)

      if (stderr && !stderr.includes('WARNING')) {
        console.error('yt-dlp stderr:', stderr)
      }

      // Find the downloaded file
      const files = await fs.readdir('tmp')
      const downloadedFile = files.find(f => f.startsWith(filename))

      if (!downloadedFile) {
        return NextResponse.json(
          { success: false, message: 'Download failed - file not found' },
          { status: 500 }
        )
      }

      const filePath = path.join(process.cwd(), 'tmp', downloadedFile)
      const fileBuffer = await fs.readFile(filePath)
      const fileStats = await fs.stat(filePath)
      
      // Get file extension from the actual downloaded file
      const ext = path.extname(downloadedFile).substring(1)
      
      // Determine content type
      let contentType = 'video/mp4'
      if (ext === 'mp3') contentType = 'audio/mpeg'
      else if (ext === 'webm') contentType = 'video/webm'
      else if (ext === 'mkv') contentType = 'video/x-matroska'
      
      // Clean up - delete the file after reading
      await fs.unlink(filePath).catch(() => {})

      // Return the file
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Disposition': `attachment; filename="media.${ext}"`,
          'Content-Type': contentType,
          'Content-Length': fileStats.size.toString(),
        },
      })

    } else {
      // --- GET INFO ONLY (Original functionality) ---
      console.log('Fetching info for URL:', url)
      
      // Use yt-dlp to fetch media information
      const command = `yt-dlp --dump-json --no-playlist --skip-download "${url}"`
      
      const { stdout, stderr } = await execPromise(command)

      if (stderr && !stderr.includes('WARNING')) {
        console.error('yt-dlp stderr:', stderr)
      }

      const data = JSON.parse(stdout)

      // Process video formats
      const videoFormats: VideoFormat[] = data.formats
        .filter((f: any) => f.vcodec !== 'none')
        .map((f: any) => ({
          format_id: f.format_id,
          resolution: f.resolution || `${f.height || 0}p`,
          quality: f.quality_label || f.format_note || 'Standard',
          filesize: f.filesize || f.filesize_approx || 0,
          ext: f.ext,
          url: f.url || ''
        }))
        .filter((f: VideoFormat) => f.url) // Only include formats with URLs
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
          bitrate: f.abr ? `${f.abr}kbps` : f.tbr ? `${f.tbr}kbps` : '128kbps',
          filesize: f.filesize || f.filesize_approx || 0,
          ext: f.ext,
          url: f.url || ''
        }))
        .filter((f: AudioFormat) => f.url) // Only include formats with URLs
        .sort((a: AudioFormat, b: AudioFormat) => {
          const aBitrate = parseInt(a.bitrate) || 0
          const bBitrate = parseInt(b.bitrate) || 0
          return bBitrate - aBitrate
        })

      const mediaInfo: MediaInfo = {
        title: data.title || 'Untitled',
        thumbnail: data.thumbnail || '',
        duration: data.duration || 0,
        video_formats: videoFormats,
        audio_formats: audioFormats,
        webpage_url: data.webpage_url || url
      }

      return NextResponse.json({
        success: true,
        data: mediaInfo
      })
    }

  } catch (error: any) {
    console.error('Error:', error)
    
    let errorMessage = 'Failed to process the URL. Please check the URL and try again.'
    
    if (error.message?.includes('ERROR: Unsupported URL')) {
      errorMessage = 'Unsupported URL. Please use a link from a supported platform (YouTube, Facebook, Instagram, TikTok, etc.)'
    } else if (error.message?.includes('ERROR: Video unavailable')) {
      errorMessage = 'Video is unavailable or private. Please check the URL.'
    } else if (error.message?.includes('ERROR: This video is private')) {
      errorMessage = 'This video is private. Please use a public video URL.'
    } else if (error.message?.includes('ERROR: File not found')) {
      errorMessage = 'The requested file could not be found. Try a different quality.'
    } else if (error.message?.includes('yt-dlp is not installed')) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}