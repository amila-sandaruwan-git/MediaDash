import * as fs from 'fs/promises'
import * as path from 'path'
import { createHash } from 'crypto'

interface CacheEntry {
  filename: string
  url: string
  quality: string
  type: 'video' | 'audio'
  timestamp: number
  fileSize: number
  mimeType: string
}

class CacheManager {
  private cacheDir: string
  private maxCacheSize: number // in bytes (default: 5GB)
  private maxAge: number // in milliseconds (default: 24 hours)

  constructor() {
    this.cacheDir = path.join(process.cwd(), 'cache')
    this.maxCacheSize = 5 * 1024 * 1024 * 1024 // 5GB
    this.maxAge = 24 * 60 * 60 * 1000 // 24 hours
    this.initCache()
  }

  private async initCache() {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true })
      await fs.mkdir(path.join(this.cacheDir, 'metadata'), { recursive: true })
    } catch (error) {
      console.error('Failed to initialize cache directory:', error)
    }
  }

  private getCacheKey(url: string, quality: string, type: 'video' | 'audio'): string {
    const hash = createHash('md5')
    hash.update(`${url}_${quality}_${type}`)
    return hash.digest('hex')
  }

  private getCacheFilePath(key: string, extension: string = 'mp4'): string {
    return path.join(this.cacheDir, `${key}.${extension}`)
  }

  private getMetadataPath(key: string): string {
    return path.join(this.cacheDir, 'metadata', `${key}.json`)
  }

  async saveToCache(
    url: string,
    quality: string,
    type: 'video' | 'audio',
    fileBuffer: Buffer,
    extension: string,
    mimeType: string
  ): Promise<string> {
    const key = this.getCacheKey(url, quality, type)
    const filePath = this.getCacheFilePath(key, extension)

    try {
      await this.cleanCacheIfNeeded()

      await fs.writeFile(filePath, fileBuffer)

      const metadata: CacheEntry = {
        filename: `${key}.${extension}`,
        url,
        quality,
        type,
        timestamp: Date.now(),
        fileSize: fileBuffer.length,
        mimeType,
      }

      await fs.writeFile(this.getMetadataPath(key), JSON.stringify(metadata, null, 2))
      await this.updateCacheStats()

      console.log(`[Cache] Saved ${type} (${quality}) to cache: ${key}`)
      return key

    } catch (error) {
      console.error('[Cache] Failed to save to cache:', error)
      throw error
    }
  }

  async getFromCache(
    url: string,
    quality: string,
    type: 'video' | 'audio'
  ): Promise<{ buffer: Buffer; metadata: CacheEntry; extension: string } | null> {
    const key = this.getCacheKey(url, quality, type)
    const metadataPath = this.getMetadataPath(key)

    try {
      const metadataExists = await fs.access(metadataPath).then(() => true).catch(() => false)
      if (!metadataExists) return null

      const metadataRaw = await fs.readFile(metadataPath, 'utf-8')
      const metadata: CacheEntry = JSON.parse(metadataRaw)

      if (Date.now() - metadata.timestamp > this.maxAge) {
        console.log(`[Cache] Cache expired for ${key}`)
        await this.removeFromCache(key)
        return null
      }

      const filePath = this.getCacheFilePath(key, metadata.filename.split('.').pop())
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false)
      if (!fileExists) {
        await this.removeFromCache(key)
        return null
      }

      const buffer = await fs.readFile(filePath)
      const extension = metadata.filename.split('.').pop() || 'mp4'

      console.log(`[Cache] Cache hit: ${key} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`)
      return { buffer, metadata, extension }

    } catch (error) {
      console.error('[Cache] Failed to get from cache:', error)
      return null
    }
  }

  async removeFromCache(key: string): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir)
      for (const file of files) {
        if (file.startsWith(key)) {
          await fs.unlink(path.join(this.cacheDir, file)).catch(() => {})
        }
      }

      await fs.unlink(this.getMetadataPath(key)).catch(() => {})
      console.log(`[Cache] Removed ${key} from cache`)
    } catch (error) {
      console.error('[Cache] Failed to remove from cache:', error)
    }
  }

  private async cleanCacheIfNeeded(): Promise<void> {
    try {
      const stats = await this.getCacheStats()
      if (stats.totalSize < this.maxCacheSize) return

      console.log(`[Cache] Cache size (${(stats.totalSize / 1024 / 1024 / 1024).toFixed(2)} GB) exceeds limit. Cleaning...`)

      const metadataFiles = await fs.readdir(path.join(this.cacheDir, 'metadata'))
      const entries: { key: string; timestamp: number }[] = []

      for (const file of metadataFiles) {
        if (!file.endsWith('.json')) continue
        const key = file.replace('.json', '')
        const metadataRaw = await fs.readFile(path.join(this.cacheDir, 'metadata', file), 'utf-8')
        const metadata: CacheEntry = JSON.parse(metadataRaw)
        entries.push({ key, timestamp: metadata.timestamp })
      }

      entries.sort((a, b) => a.timestamp - b.timestamp)

      let currentSize = stats.totalSize
      for (const entry of entries) {
        if (currentSize < this.maxCacheSize * 0.8) break

        const filePath = this.getCacheFilePath(entry.key)
        try {
          const fileStats = await fs.stat(filePath)
          currentSize -= fileStats.size
          await this.removeFromCache(entry.key)
        } catch (error) {
          await this.removeFromCache(entry.key)
        }
      }

      console.log(`[Cache] Cleanup complete. New size: ${(currentSize / 1024 / 1024 / 1024).toFixed(2)} GB`)

    } catch (error) {
      console.error('[Cache] Failed to clean cache:', error)
    }
  }

  private async updateCacheStats(): Promise<void> {
    try {
      const stats = await this.getCacheStats()
      const statsPath = path.join(this.cacheDir, 'stats.json')
      await fs.writeFile(statsPath, JSON.stringify(stats, null, 2))
    } catch (error) {
      console.error('[Cache] Failed to update cache stats:', error)
    }
  }

  async getCacheStats(): Promise<{ totalSize: number; fileCount: number; entries: CacheEntry[] }> {
    try {
      const metadataFiles = await fs.readdir(path.join(this.cacheDir, 'metadata'))
      let totalSize = 0
      const entries: CacheEntry[] = []

      for (const file of metadataFiles) {
        if (!file.endsWith('.json')) continue
        const metadataRaw = await fs.readFile(path.join(this.cacheDir, 'metadata', file), 'utf-8')
        const metadata: CacheEntry = JSON.parse(metadataRaw)
        
        const filePath = this.getCacheFilePath(file.replace('.json', ''), metadata.filename.split('.').pop())
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false)
        
        if (fileExists) {
          const stats = await fs.stat(filePath)
          totalSize += stats.size
          entries.push(metadata)
        } else {
          await fs.unlink(path.join(this.cacheDir, 'metadata', file)).catch(() => {})
        }
      }

      return { totalSize, fileCount: entries.length, entries }
    } catch (error) {
      return { totalSize: 0, fileCount: 0, entries: [] }
    }
  }

  async clearCache(): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir)
      for (const file of files) {
        await fs.rm(path.join(this.cacheDir, file), { recursive: true, force: true })
      }
      await this.initCache()
      console.log('[Cache] Cache cleared')
    } catch (error) {
      console.error('[Cache] Failed to clear cache:', error)
    }
  }

  async getCacheSizeMB(): Promise<number> {
    const stats = await this.getCacheStats()
    return stats.totalSize / 1024 / 1024
  }

  async isCached(url: string, quality: string, type: 'video' | 'audio'): Promise<boolean> {
    const result = await this.getFromCache(url, quality, type)
    return result !== null
  }
}

export const cacheManager = new CacheManager()