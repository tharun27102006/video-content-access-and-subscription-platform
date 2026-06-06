"use client";

import type { MouseEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, PlayCircle, Sparkles } from 'lucide-react';
import { videos } from '@/lib/videos';
import { PlatformShell } from '@/components/platform-shell';
import { usePlatform } from '@/components/platform-shell';

function HomeContent() {
  const { handleDownload, openUpgrade, state, todayUsage } = usePlatform();

  const beginDownload = async (videoId: string, href: string, event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const allowed = await handleDownload(videoId);

    if (!allowed) {
      return;
    }

    window.location.assign(href);
  };

  return (
    <main className="container">
      <section className="hero">
        <div>
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Premium video downloads with calm pastel motion
          </span>
          <h1>Download videos, keep them in your profile, and unlock unlimited access.</h1>
          <p className="hero-copy">
            Free users can save one video a day. Once the limit is reached, the upgrade modal
            opens with a Razorpay test checkout so premium unlocks stay one click away.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="#library">
              Explore videos <ArrowRight size={18} />
            </Link>
            <Link className="secondary-button" href="/profile">
              Open profile
            </Link>
          </div>
        </div>

        <aside className="hero-panel">
          <div className="panel-grid">
            <div className="stats-card">
              <span className="profile-badge">
                <Sparkles size={16} />
                Free plan guardrails
              </span>
              <h2 className="panel-title" style={{ marginTop: 14 }}>
                One free download per day, then premium takes over.
              </h2>
              <div className="stats-row">
                <div>
                  <span className="stats-value">{todayUsage}/1</span>
                  <span className="stats-label">Free downloads used</span>
                </div>
                <div>
                  <span className="stats-value">{state.plan === 'premium' ? '∞' : '1'}</span>
                  <span className="stats-label">Daily limit</span>
                </div>
                <div>
                  <span className="stats-value">Test</span>
                  <span className="stats-label">Razorpay mode</span>
                </div>
              </div>
            </div>
            <div className="stats-card">
              <span className="profile-badge">
                <PlayCircle size={16} />
                Downloads section
              </span>
              <p className="inline-note">
                Every successful download is stored locally and appears in your profile for quick
                access later.
              </p>
              <Link className="primary-button" href="/profile" style={{ display: 'inline-flex', marginTop: 8 }}>
                <Download size={18} /> View downloads
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="section" id="library">
        <h2 className="section-title">Featured library</h2>
        <p className="section-subtitle">
          Select a video card to preview the pastel gradient treatment. The download action is
          handled in the shared platform shell so the limit and premium logic stay consistent.
        </p>
        <div className="video-grid">
          {videos.map((video) => (
            <article className="video-card" key={video.id}>
              <div className="video-preview" style={{ background: video.gradient }}>
                <span className="video-badge">{video.quality}</span>
                <div>
                  <h3 className="video-title">{video.title}</h3>
                  <p className="inline-note">Duration {video.duration}</p>
                </div>
              </div>
              <div className="video-meta">
                <span>Available for download</span>
                <span>{video.duration}</span>
              </div>
              <div className="video-actions">
                <a
                  className="primary-button"
                  href={`/api/download/${video.id}`}
                  onClick={(event) => {
                    void beginDownload(video.id, `/api/download/${video.id}`, event);
                  }}
                >
                  <Download size={16} /> Download link
                </a>
                <button className="secondary-button" type="button" onClick={openUpgrade}>
                  Upgrade
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="features-grid">
        <article className="card">
          <h3>Local download history</h3>
          <p>
            Downloaded files are recorded in browser storage so the profile Downloads section stays
            populated after refreshes, and each card now exposes a real download link.
          </p>
        </article>
        <article className="card">
          <h3>Razorpay test checkout</h3>
          <p>
            Premium upgrade uses a server order route and Razorpay checkout script, ready for test
            keys in development and Vercel.
          </p>
        </article>
        <article className="card">
          <h3>Accessible contrast</h3>
          <p>
            The palette keeps body text darker on translucent surfaces so the interface remains legible
            while preserving the soft pastel mood.
          </p>
        </article>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <PlatformShell activeTab="home">
      <HomeContent />
    </PlatformShell>
  );
}
