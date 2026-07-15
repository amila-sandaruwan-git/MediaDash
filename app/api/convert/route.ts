// app/api/convert/route.ts
// This works for both web and desktop app

import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { randomUUID } from 'crypto'

const execPromise = promisify(exec)

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function calculateAudioSize(bitrateKbps: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0
  return Math.round((bitrateKbps * durationSeconds) / 8 * 1024)
}

function estimateVideoSize(height: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0
  let estimatedBitrate = 0
  if (height >= 4320) estimatedBitrate = 40000
  else if (height >= 2160) estimatedBitrate = 20000
  else if (height >= 1080) estimatedBitrate = 8000
  else if (height >= 720) estimatedBitrate = 4000
  else if (height >= 480) estimatedBitrate = 1500
  else estimatedBitrate = 800
  return Math.round((estimatedBitrate * durationSeconds) / 8 * 1024)
}

async function checkYtDlpInstalled(): Promise<boolean> {
  try {
    await execPromise('yt-dlp --version')
    return true
  } catch {
    return false
  }
}

function getUrlType(url: string): 'page' | 'direct' | 'unknown' {
  if (url.match(/\.(mp4|webm|mov|avi|mkv|m3u8|mpd)(\?.*)?$/i)) {
    return 'direct'
  }
  if (url.match(/reddit\.com\/r\/.*\/comments\/|redd\.it\//i)) {
    return 'page'
  }
  if (url.match(/youtube\.com\/watch|youtu\.be|facebook\.com\/watch|instagram\.com\/p|tiktok\.com\/@|twitter\.com\/.*\/status|x\.com\/.*\/status/i)) {
    return 'page'
  }
  return 'unknown'
}

function getPlatformName(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  if (url.includes('reddit.com') || url.includes('redd.it')) return 'Reddit'
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook'
  if (url.includes('instagram.com') || url.includes('instagr.am')) return 'Instagram'
  if (url.includes('tiktok.com') || url.includes('vm.tiktok.com')) return 'TikTok'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter/X'
  if (url.includes('linkedin.com')) return 'LinkedIn'
  if (url.includes('pinterest.com')) return 'Pinterest'
  if (url.includes('snapchat.com')) return 'Snapchat'
  if (url.includes('telegram.org') || url.includes('t.me')) return 'Telegram'
  if (url.includes('discord.com') || url.includes('discord.gg')) return 'Discord'
  if (url.includes('quora.com')) return 'Quora'
  return 'Unknown Platform'
}

// ============================================
// MAIN POST HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    const { url, action, formatId, quality, type } = await request.json()

    // Check if yt-dlp is installed
    const isInstalled = await checkYtDlpInstalled()
    if (!isInstalled) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'yt-dlp is not installed. Please install it first.',
          details: 'Download from: https://github.com/yt-dlp/yt-dlp/releases/latest'
        },
        { status: 500 }
      )
    }

    const urlType = getUrlType(url)
    const platform = getPlatformName(url)

    // Reddit direct link handling
    if (urlType === 'direct' && (url.includes('redd.it') || url.includes('reddit.com'))) {
      return NextResponse.json({
        success: false,
        message: '❌ Direct Reddit video links often expire.',
        suggestion: 'Please paste the Reddit post page URL instead.',
        platform: 'Reddit'
      }, { status: 400 })
    }

    if (urlType === 'direct') {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname.toLowerCase()
      if (!pathname.match(/\.(mp4|webm|mov|avi|mkv)$/)) {
        return NextResponse.json({
          success: false,
          message: `⚠️ This appears to be a direct media link from ${platform}.`,
          suggestion: 'Use the page URL instead of the direct video link.',
          platform: platform
        }, { status: 400 })
      }
    }

    // ============================================
    // DOWNLOAD ACTION
    // ============================================
    if (action === 'download') {
      if (!url || !formatId) {
        return NextResponse.json(
          { success: false, message: 'URL and format ID are required' },
          { status: 400 }
        )
      }

      const isAudio = type === 'audio' || quality === 'audio'
      const filename = `${randomUUID()}_${Date.now()}`
      const outputPath = path.join(process.cwd(), 'tmp', filename)
      
      await fs.mkdir(path.join(process.cwd(), 'tmp'), { recursive: true })

      let downloadCommand: string
      let fileExtension: string = 'mp4'
      let mimeType: string = 'video/mp4'

      let downloadUrl = url
      if (urlType === 'direct' && (url.includes('redd.it') || url.includes('reddit.com'))) {
        throw new Error('Please use the Reddit page URL instead of direct video link')
      }

      if (!isAudio) {
        // VIDEO DOWNLOAD - Use exact format ID
        downloadCommand = `yt-dlp -f "${formatId}+bestaudio[ext=m4a]/bestaudio/best" --merge-output-format mp4 -o "${outputPath}.%(ext)s" "${downloadUrl}"`
        fileExtension = 'mp4'
        mimeType = 'video/mp4'
        console.log(`[API] Downloading video format ID: ${formatId}`)
      } else {
        // AUDIO DOWNLOAD
        fileExtension = 'mp3'
        mimeType = 'audio/mpeg'
        const bitrateMatch = quality.match(/(\d+)/)
        const bitrate = bitrateMatch ? bitrateMatch[0] : '192'
        downloadCommand = `yt-dlp -f "bestaudio[ext=m4a]/bestaudio" --extract-audio --audio-format mp3 --audio-quality ${bitrate}K -o "${outputPath}.%(ext)s" "${downloadUrl}"`
        console.log(`[API] Audio bitrate selected: ${bitrate}kbps`)
      }

      console.log('Executing download command:', downloadCommand)
      
      const { stdout, stderr } = await execPromise(downloadCommand)

      if (stderr && !stderr.includes('WARNING')) {
        console.error('yt-dlp stderr:', stderr)
      }

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
      
      const ext = path.extname(downloadedFile).substring(1)
      
      if (ext === 'mp3') mimeType = 'audio/mpeg'
      else if (ext === 'webm') mimeType = 'video/webm'
      else if (ext === 'mkv') mimeType = 'video/x-matroska'
      else if (ext === 'mp4') mimeType = 'video/mp4'

      // Clean up temp file
      await fs.unlink(filePath).catch(() => {})

      const uint8Array = new Uint8Array(fileBuffer)
      return new NextResponse(uint8Array, {
        status: 200,
        headers: {
          'Content-Disposition': `attachment; filename="media.${ext}"`,
          'Content-Type': mimeType,
          'Content-Length': fileStats.size.toString(),
        },
      })

    // ============================================
    // INFO ACTION
    // ============================================
    } else {
      console.log('Fetching info for URL:', url)
      
      const command = `yt-dlp --dump-json --no-playlist --skip-download --no-warnings --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${url}"`
      
      const { stdout, stderr } = await execPromise(command)

      if (stderr && !stderr.includes('WARNING') && !stderr.includes('Failed to download')) {
        console.error('yt-dlp stderr:', stderr)
      }

      const data = JSON.parse(stdout)

      const duration = data.duration || 0
      console.log(`[API] Title: ${data.title}`)

      // ============================================
      // VIDEO FORMATS - SHOW ALL AVAILABLE
      // ============================================
      const allVideoFormats = data.formats
        .filter((f: any) => {
          return f.vcodec !== 'none' && f.height && f.height > 0 && (f.url || f.manifest_url)
        })
        .map((f: any) => {
          let codecInfo = ''
          if (f.vcodec) {
            if (f.vcodec.includes('av01')) codecInfo = 'AV1'
            else if (f.vcodec.includes('vp09')) codecInfo = 'VP9'
            else if (f.vcodec.includes('avc')) codecInfo = 'AVC'
            else if (f.vcodec.includes('h264')) codecInfo = 'H.264'
            else if (f.vcodec.includes('hevc')) codecInfo = 'HEVC'
          }
          
          const hasAudio = f.acodec !== 'none'
          let qualityLabel = f.quality_label || f.format_note || codecInfo || 'Standard'
          if (!hasAudio) {
            qualityLabel = `${qualityLabel} (Video Only)`
          }
          
          let filesize = f.filesize || f.filesize_approx || 0
          if (filesize === 0 && duration > 0) {
            filesize = estimateVideoSize(f.height, duration)
          }
          
          return {
            format_id: f.format_id,
            height: f.height,
            resolution: `${f.height}p`,
            quality: qualityLabel,
            filesize: filesize,
            ext: f.ext || 'mp4',
            url: f.url || f.manifest_url || '',
            hasAudio: hasAudio,
            priority: hasAudio ? 0 : 1
          }
        })
        .filter((f: any) => f.url && f.url.length > 0)

      // Deduplicate by resolution
      const groupedByHeight = new Map()
      for (const format of allVideoFormats) {
        const height = format.height
        if (!groupedByHeight.has(height)) {
          groupedByHeight.set(height, format)
        } else {
          const existing = groupedByHeight.get(height)
          if (format.priority < existing.priority) {
            groupedByHeight.set(height, format)
          } else if (format.priority === existing.priority) {
            const extPreference = (ext: string) => {
              if (ext === 'mp4') return 0
              if (ext === 'webm') return 1
              return 2
            }
            if (extPreference(format.ext) < extPreference(existing.ext)) {
              groupedByHeight.set(height, format)
            }
          }
        }
      }

      const videoFormats = Array.from(groupedByHeight.values())
        .map((f: any) => ({
          format_id: f.format_id,
          resolution: f.resolution,
          quality: f.quality,
          filesize: f.filesize,
          ext: f.ext,
          url: f.url,
        }))
        .sort((a, b) => {
          const aHeight = parseInt(a.resolution.match(/(\d+)/)?.[0] || '0')
          const bHeight = parseInt(b.resolution.match(/(\d+)/)?.[0] || '0')
          return aHeight - bHeight
        })

      // ============================================
      // AUDIO FORMATS
      // ============================================
      const standardBitrates = [
        { bitrate: 128, label: '128 kbps', quality: 'Standard Quality' },
        { bitrate: 192, label: '192 kbps', quality: 'Medium Quality' },
        { bitrate: 256, label: '256 kbps', quality: 'High Quality' },
        { bitrate: 320, label: '320 kbps', quality: 'Maximum MP3 Quality' },
      ]
      
      const audioFormatsFromData = data.formats
        .filter((f: any) => {
          return f.acodec !== 'none' && (f.abr !== null && f.abr !== undefined || f.tbr !== null && f.tbr !== undefined)
        })
        .map((f: any) => {
          let bitrate = 128
          if (f.abr && f.abr > 0) bitrate = Math.round(f.abr)
          else if (f.tbr && f.tbr > 0) bitrate = Math.round(f.tbr)
          
          let roundedBitrate = 128
          if (bitrate >= 300) roundedBitrate = 320
          else if (bitrate >= 220) roundedBitrate = 256
          else if (bitrate >= 160) roundedBitrate = 192
          else roundedBitrate = 128
          
          let filesize = f.filesize || f.filesize_approx || 0
          if (filesize === 0 && duration > 0) {
            filesize = calculateAudioSize(roundedBitrate, duration)
          }
          
          return {
            format_id: f.format_id,
            bitrate: roundedBitrate,
            filesize: filesize,
            ext: f.ext || 'mp3',
            url: f.url || f.manifest_url || ''
          }
        })
        .filter((f: any) => f.url && f.url.length > 0)

      const finalAudioFormats = []
      const groupedByBitrate: Record<number, any[]> = {}
      
      for (const format of audioFormatsFromData) {
        if (!groupedByBitrate[format.bitrate]) {
          groupedByBitrate[format.bitrate] = []
        }
        groupedByBitrate[format.bitrate].push(format)
      }

      for (const stdBitrate of standardBitrates) {
        let bestFormat = null
        let bestSize = 0
        
        if (groupedByBitrate[stdBitrate.bitrate]) {
          for (const f of groupedByBitrate[stdBitrate.bitrate]) {
            if (f.filesize > bestSize) {
              bestSize = f.filesize
              bestFormat = f
            }
          }
        }
        
        let finalSize = 0
        if (bestFormat && bestFormat.filesize > 0) {
          finalSize = bestFormat.filesize
        } else if (duration > 0) {
          finalSize = calculateAudioSize(stdBitrate.bitrate, duration)
        }
        
        finalAudioFormats.push({
          format_id: bestFormat?.format_id || `audio_${stdBitrate.bitrate}`,
          bitrate: `${stdBitrate.bitrate}kbps`,
          filesize: finalSize,
          ext: bestFormat?.ext || 'mp3',
          url: bestFormat?.url || ''
        })
      }
      
      const sortedAudioFormats = finalAudioFormats.sort((a, b) => {
        const aBitrate = parseInt(a.bitrate.match(/(\d+)/)?.[0] || '0')
        const bBitrate = parseInt(b.bitrate.match(/(\d+)/)?.[0] || '0')
        return aBitrate - bBitrate
      })

      const mediaInfo = {
        title: data.title || 'Untitled',
        thumbnail: data.thumbnail || '',
        duration: data.duration || 0,
        video_formats: videoFormats,
        audio_formats: sortedAudioFormats,
        webpage_url: data.webpage_url || url
      }

      return NextResponse.json({
        success: true,
        data: mediaInfo,
      })
    }

  } catch (error: any) {
    console.error('Error:', error)
    
    let errorMessage = 'Failed to process the URL. Please try again.'
    let suggestion = ''
    
    if (error.message?.includes('Unsupported URL')) {
      errorMessage = 'Unsupported URL. Please use a link from a supported platform.'
    } else if (error.message?.includes('Video unavailable') || error.message?.includes('404')) {
      errorMessage = 'Video is unavailable or private.'
      suggestion = 'Make sure the video is publicly accessible.'
    } else if (error.message?.includes('This video is private')) {
      errorMessage = 'This video is private.'
    } else if (error.message?.includes('age-restricted')) {
      errorMessage = '⚠️ This video is age-restricted.'
      suggestion = 'Try a different video that is not age-restricted.'
    } else if (error.message?.includes('Login required')) {
      errorMessage = '⚠️ This video requires login.'
      suggestion = 'Try a public video that does not require login.'
    }

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        suggestion: suggestion || undefined
      },
      { status: 500 }
    )
  }
}