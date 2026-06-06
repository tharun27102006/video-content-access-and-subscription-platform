"use client";

import type { MouseEvent } from 'react';
import { Crown, Download, Sparkles } from 'lucide-react';
import { PlatformShell, usePlatform } from '@/components/platform-shell';
import { videos } from '@/lib/videos';

function ProfileContent() {
  const { activePlanLabel, downloads, openUpgrade, handleDownload, todayUsage, state } = usePlatform();

  const beginDownload = async (videoId: string, href: string, event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const allowed = await handleDownload(videoId);

    if (!allowed) {
      return;
    }

    window.location.assign(href);
  };

  return (
    <main className="container profile-layout">
      <section className="profile-card card">
        <span className="profile-badge">
          <Sparkles size={16} /> {activePlanLabel} plan
        </span>
        <h2 className="section-title" style={{ fontSize: '2rem', marginTop: 16 }}>
          Account overview
        </h2>
        <p className="inline-note">
          {state.plan === 'premium'
            ? 'You now have unlimited downloads for the rest of this period.'
            : 'Free users get one download per day. Upgrade when the limit feels tight.'}
        </p>
        <div className="status-chip">Today&apos;s downloads: {todayUsage}</div>
        <div className="form-row" style={{ marginTop: 18 }}>
          <a
            className="secondary-button"
            href={`/api/download/${videos[0].id}`}
            onClick={(event) => {
              void beginDownload(videos[0].id, `/api/download/${videos[0].id}`, event);
            }}
          >
            <Download size={16} /> Quick download
          </a>
          <button className="ghost-button" type="button" onClick={openUpgrade}>
            <Crown size={16} /> View premium
          </button>
        </div>
      </section>

      <section className="profile-card card">
        <h2 className="section-title" style={{ fontSize: '2rem' }}>
          Downloads
        </h2>
        <p className="section-subtitle" style={{ marginBottom: 0 }}>
          Your saved downloads appear here after each successful download.
        </p>

        <div className="download-list">
          {downloads.length ? (
            downloads.map((download) => (
              <div className="download-item" key={download.id}>
                <div>
                  <p className="download-title">{download.title}</p>
                  <p className="download-meta">Downloaded {new Intl.DateTimeFormat('en', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  }).format(new Date(download.downloadedAt))}</p>
                </div>
                <span className="profile-badge">{download.fileName}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              No downloads yet. Pick a video on the home page to populate this list.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <PlatformShell activeTab="profile">
      <section className="container">
        <section className="section">
          <h1 className="section-title">Profile</h1>
          <p className="section-subtitle">
            Your plan status and Downloads section live here. The list below is synced from browser storage
            so downloaded videos stay visible between visits.
          </p>
        </section>
      </section>
      <ProfileContent />
    </PlatformShell>
  );
}
