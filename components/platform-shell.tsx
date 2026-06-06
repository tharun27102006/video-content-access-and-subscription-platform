'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Crown, Download, Lock, Sparkles, X } from 'lucide-react';
import type { DownloadRecord, PlanType, StoredState } from '@/lib/types';
import { defaultState, readState, writeState } from '@/lib/storage';
import { videos } from '@/lib/videos';
import clsx from 'clsx';
import Link from 'next/link';

type Toast = {
  id: string;
  message: string;
  tone: 'default' | 'error' | 'success';
};

type ShellProps = {
  activeTab: 'home' | 'profile';
  children: React.ReactNode;
};

type PlatformContextValue = {
  state: StoredState;
  activePlanLabel: string;
  todayUsage: number;
  downloads: DownloadRecord[];
  upgradeOpen: boolean;
  loadingPlan: boolean;
  openUpgrade: () => void;
  closeUpgrade: () => void;
  handleDownload: (videoId: string) => Promise<boolean>;
  handleUpgrade: () => Promise<void>;
};

const PlatformContext = createContext<PlatformContextValue | null>(null);

export const usePlatform = () => {
  const context = useContext(PlatformContext);

  if (!context) {
    throw new Error('usePlatform must be used within PlatformShell.');
  }

  return context;
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));

const todayKey = () => new Date().toISOString().slice(0, 10);

export function PlatformShell({ activeTab, children }: ShellProps) {
  const [state, setState] = useState<StoredState>(defaultState());
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    setState(readState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    writeState(state);
  }, [ready, state]);

  const downloads = useMemo(() => [...state.downloads].sort((a, b) => b.downloadedAt.localeCompare(a.downloadedAt)), [state.downloads]);
  const todayUsage = state.dailyUsage.date === todayKey() ? state.dailyUsage.count : 0;

  const pushToast = (message: string, tone: Toast['tone'] = 'default') => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const setPlan = (plan: PlanType) => setState((current) => ({ ...current, plan }));

  const handleDownload = async (videoId: string) => {
    const video = videos.find((item) => item.id === videoId);
    if (!video) {
      pushToast('Video not found.', 'error');
      return false;
    }

    const isPremium = state.plan === 'premium';
    const limitReached = state.dailyUsage.date === todayKey() && state.dailyUsage.count >= 1;

    if (!isPremium && limitReached) {
      setUpgradeOpen(true);
      pushToast('Free limit reached. Upgrade to download more today.', 'error');
      return false;
    }

    setState((current) => ({
      ...current,
      dailyUsage: {
        date: todayKey(),
        count: current.plan === 'premium' ? current.dailyUsage.count : current.dailyUsage.count + 1
      },
      downloads: [
        {
          id: crypto.randomUUID(),
          videoId: video.id,
          title: video.title,
          downloadedAt: new Date().toISOString(),
          fileName: video.fileName
        },
        ...current.downloads
      ]
    }));
    pushToast(`${video.title} link prepared for download.`, 'success');
    return true;
  };

  const handleUpgrade = async () => {
    setLoadingPlan(true);
    try {
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan: 'premium' })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Checkout is not configured. Add Razorpay test keys first.');
      }

      const payload = (await response.json()) as {
        keyId: string;
        orderId: string;
        amount: number;
        currency: string;
        name: string;
      };

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
      });

      const checkout = new (window as typeof window & {
        Razorpay: new (options: Record<string, unknown>) => { open: () => void };
      }).Razorpay({
        key: payload.keyId,
        amount: payload.amount,
        currency: payload.currency,
        name: payload.name,
        description: 'Premium video downloads',
        order_id: payload.orderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          const verifyResponse = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(response)
          });

          if (!verifyResponse.ok) {
            throw new Error('Payment verification failed.');
          }

          setPlan('premium');
          setUpgradeOpen(false);
          pushToast('Premium activated. Unlimited downloads unlocked.', 'success');
        },
        theme: {
          color: '#9c6cff'
        }
      });

      checkout.open();
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'Unable to start upgrade flow.', 'error');
    } finally {
      setLoadingPlan(false);
    }
  };

  const activePlanLabel = state.plan === 'premium' ? 'Premium' : 'Free';

  return (
    <PlatformContext.Provider
      value={{
        state,
        activePlanLabel,
        todayUsage,
        downloads,
        upgradeOpen,
        loadingPlan,
        openUpgrade: () => setUpgradeOpen(true),
        closeUpgrade: () => setUpgradeOpen(false),
        handleDownload,
        handleUpgrade
      }}
    >
      <div className="navbar">
        <div className="container navbar-inner">
          <Link className="brand" href="/">
            <span className="brand-mark" />
            Velvet Video
          </Link>
          <div className="nav-links">
            <Link className={clsx('nav-pill', activeTab === 'home' && 'active')} href="/">
              Home
            </Link>
            <Link className={clsx('nav-pill', activeTab === 'profile' && 'active')} href="/profile">
              Profile
            </Link>
            <button className="primary-button" type="button" onClick={() => setUpgradeOpen(true)}>
              <Crown size={16} /> Upgrade
            </button>
          </div>
        </div>
      </div>

      {children}

      {upgradeOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Upgrade plan">
          <div className="modal">
            <div className="form-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="profile-badge">
                  <Crown size={16} /> Upgrade plan
                </span>
                <h2 className="section-title" style={{ fontSize: '2rem', marginTop: 12 }}>
                  Unlock unlimited downloads
                </h2>
              </div>
              <button className="ghost-button" type="button" onClick={() => setUpgradeOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-grid">
              <div className="upgrade-card">
                <h3>Free</h3>
                <p className="price">$0 <small>/ month</small></p>
                <div className="ticks">
                  <span><AlertCircle size={16} /> One download per day</span>
                  <span><AlertCircle size={16} /> Local download history</span>
                  <span><AlertCircle size={16} /> Basic support</span>
                </div>
              </div>
              <div className="upgrade-card" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,240,255,0.9))' }}>
                <h3>Premium</h3>
                <p className="price">$9 <small>/ month</small></p>
                <div className="ticks">
                  <span><CheckCircle2 size={16} /> Unlimited downloads</span>
                  <span><CheckCircle2 size={16} /> Razorpay test checkout</span>
                  <span><CheckCircle2 size={16} /> Priority profile access</span>
                </div>
                <button className="primary-button" type="button" onClick={handleUpgrade} disabled={loadingPlan}>
                  {loadingPlan ? 'Opening checkout...' : 'Upgrade with Razorpay'}
                </button>
                <p className="inline-note" style={{ marginTop: 12 }}>
                  Add <strong>NEXT_PUBLIC_RAZORPAY_KEY_ID</strong> and <strong>RAZORPAY_KEY_SECRET</strong> to enable test payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div className="toast" key={toast.id} data-tone={toast.tone}>
            {toast.message}
          </div>
        ))}
      </div>
    </PlatformContext.Provider>
  );
}
