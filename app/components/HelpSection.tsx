// app/components/HelpSection.tsx

'use client'

import type { CSSProperties } from 'react'
import {
  FaVideo, FaMusic, FaImage, FaLink, FaDownload, FaReddit, FaCookie,
  FaYoutube, FaInstagram, FaTiktok, FaTwitter, FaFacebook,
  FaCheck, FaTimes, FaClock, FaBolt, FaFolderOpen,
} from 'react-icons/fa'

const steps = [
  { icon: FaLink, title: 'Copy the URL', description: 'Copy the video or audio URL from your favorite platform.', c1: '#3b82f6', c2: '#22d3ee' },
  { icon: FaDownload, title: 'Paste & Convert', description: 'Paste the URL in the input box. It converts automatically, or click Convert.', c1: '#8b5cf6', c2: '#ec4899' },
  { icon: FaVideo, title: 'Choose Quality', description: 'Select from available video resolutions, 360p up to 8K.', c1: '#10b981', c2: '#34d399' },
  { icon: FaMusic, title: 'Download Audio', description: 'Extract MP3 audio with bitrates up to 320kbps.', c1: '#f97316', c2: '#fbbf24' },
  { icon: FaImage, title: 'Save Thumbnail', description: 'Download the video thumbnail in high resolution.', c1: '#ec4899', c2: '#fb7185' },
]

const stats = [
  { value: '1000+', label: 'Supported sites' },
  { value: '8K', label: 'Max video quality' },
  { value: '320kbps', label: 'Audio quality' },
  { value: '∞', label: 'Free downloads' },
]

const platforms = [
  { name: 'YouTube', icon: FaYoutube },
  { name: 'Facebook', icon: FaFacebook },
  { name: 'Instagram', icon: FaInstagram },
  { name: 'TikTok', icon: FaTiktok },
  { name: 'Twitter / X', icon: FaTwitter },
]

const cookieSteps = [
  'Install the "Get cookies.txt" browser extension',
  'Log in to the website (e.g., OK.ru)',
  'Click the extension and export cookies',
  'Save as cookies.txt in the MediaDash folder',
]

const urlTips = [
  { platform: 'Reddit', tip: 'Use the post page URL, not the direct video link' },
  { platform: 'YouTube', tip: 'Use the watch page URL or share link' },
  { platform: 'Instagram', tip: 'Use the post or reel URL' },
  { platform: 'TikTok', tip: 'Use the video page URL or share link' },
  { platform: 'OK.ru / VK', tip: 'Use the video page URL and export cookies' },
  { platform: 'Direct links', tip: 'Often expire or require special handling' },
]

export default function HelpSection() {
  return (
    <section id="help" className="md-help">
      {/* Header */}
      <header className="md-help__head">
        <span className="md-eyebrow">Step-by-step guide</span>
        <h2 className="md-h2">
          How to Use <span className="md-grad-text">MediaDash</span>
        </h2>
        <p className="md-lead">Download videos, audio, and thumbnails from any platform in just a few clicks.</p>
      </header>

      {/* Steps */}
      <ol className="md-steps">
        {steps.map((s, i) => (
          <li key={s.title} className="md-step" style={{ '--c1': s.c1, '--c2': s.c2 } as CSSProperties}>
            <div className="md-step__node">{i + 1}</div>
            <div className="md-step__card">
              <div className="md-step__icon"><s.icon /></div>
              <h3 className="md-step__title">{s.title}</h3>
              <p className="md-step__text">{s.description}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Stats */}
      <div className="md-help__stats">
        {stats.map((s) => (
          <div key={s.label} className="md-hstat">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="md-help__grid">
        <article className="md-panel">
          <div className="md-panel__head">
            <div className="md-panel__icon" style={{ '--c1': '#f97316', '--c2': '#fbbf24' } as CSSProperties}><FaReddit /></div>
            <h3>Reddit videos</h3>
          </div>
          <p>Always paste the <strong>Reddit post page URL</strong>, not the direct video link.</p>
          <div className="md-urlbox md-urlbox--ok"><FaCheck /><code>https://www.reddit.com/r/videos/comments/123456/...</code></div>
          <div className="md-urlbox md-urlbox--bad"><FaTimes /><code>https://packaged-media.redd.it/...</code></div>
          <p className="md-note"><FaClock /> Direct Reddit links expire quickly. The page URL works every time.</p>
        </article>

        <article className="md-panel">
          <div className="md-panel__head">
            <div className="md-panel__icon" style={{ '--c1': '#3b82f6', '--c2': '#6366f1' } as CSSProperties}><FaBolt /></div>
            <h3>Pro tips</h3>
          </div>
          <ul className="md-checklist">
            <li><FaCheck /><span>Use the <strong>page URL</strong> (not direct video links) for best results.</span></li>
            <li><FaCheck /><span>For highest quality, choose <strong>4K or 8K</strong> if available.</span></li>
            <li><FaCheck /><span>Download audio in <strong>320kbps</strong> for the best sound.</span></li>
            <li><FaCheck /><span>Cached downloads are <strong>instant</strong>. Look for the ⚡ badge.</span></li>
          </ul>
        </article>
      </div>

      {/* Cookies */}
      <article className="md-panel md-panel--wide">
        <div className="md-panel__head">
          <div className="md-panel__icon" style={{ '--c1': '#10b981', '--c2': '#34d399' } as CSSProperties}><FaCookie /></div>
          <div>
            <h3>Access restricted videos</h3>
            <p className="md-panel__sub">Some platforms (like <strong>OK.ru</strong> and <strong>VK</strong>) require login to download videos.</p>
          </div>
        </div>
        <div className="md-cookie">
          {cookieSteps.map((t, i) => (
            <div key={t} className="md-cookie__step">
              <span className="md-cookie__num">{i + 1}</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
        <div className="md-urlbox"><FaFolderOpen /><code>C:\Users\YourUser\WEB\mediadash\cookies.txt</code></div>
      </article>

      {/* Page URLs */}
      <article className="md-panel md-panel--wide md-panel--warn">
        <div className="md-panel__head">
          <div className="md-panel__icon" style={{ '--c1': '#f59e0b', '--c2': '#fbbf24' } as CSSProperties}>⚠️</div>
          <h3>Important: use page URLs</h3>
        </div>
        <div className="md-tips">
          {urlTips.map((t) => (
            <div key={t.platform} className="md-tip">
              <strong>{t.platform}</strong>
              <span>{t.tip}</span>
            </div>
          ))}
        </div>
      </article>

      {/* Platforms */}
      <div className="md-help__platforms">
        <h3>Supported platforms</h3>
        <div className="md-hero__platforms">
          {platforms.map((p) => (
            <span key={p.name} className="md-chip"><p.icon />{p.name}</span>
          ))}
          <span className="md-chip md-chip--more">+1000 more</span>
        </div>
      </div>
    </section>
  )
}