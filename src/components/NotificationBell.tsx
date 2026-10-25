import { useState, useEffect, useCallback } from "react";
import { Bell, X, CheckCircle2, AlertTriangle, Info, CalendarClock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ── Types ──
export interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "event" | "community";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const STORAGE_KEY = "nearloom_notifications";

// ── Seed Notifications ──
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    type: "success",
    title: "Community Verified",
    message: "Cubbon Sunday Riders has been verified and is now live on Nearloom.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: "notif-2",
    type: "event",
    title: "Event Reminder",
    message: "Sunday Sunrise Loop & Airlines Breakfast starts in 2 hours.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: false,
  },
  {
    id: "notif-3",
    type: "community",
    title: "New Member Joined",
    message: "3 new members joined Early Stage Founders Hub this week.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    read: true,
  },
  {
    id: "notif-4",
    type: "info",
    title: "Profile Tip",
    message: "Complete your profile to get personalized community recommendations.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
];

function getIconForType(type: Notification["type"]) {
  switch (type) {
    case "success": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "event": return <CalendarClock className="h-4 w-4 text-primary" />;
    case "community": return <Users className="h-4 w-4 text-accent" />;
    default: return <Info className="h-4 w-4 text-blue-500" />;
  }
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
    } catch {
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [notifications]);

  const markRead = useCallback(
    (id: string) => {
      const updated = notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      setNotifications(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [notifications]
  );

  const dismiss = useCallback(
    (id: string) => {
      const updated = notifications.filter((n) => n.id !== id);
      setNotifications(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [notifications]
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="notification-dot" aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[380px] rounded-2xl border-foreground/10 p-0 shadow-premium-lg"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[360px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                You're all caught up!
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "group relative flex gap-3 border-b border-foreground/5 px-4 py-3 transition-colors hover:bg-foreground/[0.02]",
                  !notif.read && "bg-primary/[0.03]"
                )}
                onClick={() => markRead(notif.id)}
                role="button"
                tabIndex={0}
              >
                <div className="mt-0.5 shrink-0">{getIconForType(notif.type)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm font-semibold leading-tight",
                        !notif.read && "text-foreground",
                        notif.read && "text-foreground/70"
                      )}
                    >
                      {notif.title}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismiss(notif.id);
                      }}
                      className="shrink-0 rounded-full p-0.5 opacity-0 transition-opacity hover:bg-foreground/10 group-hover:opacity-100"
                      aria-label="Dismiss"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-muted-foreground/60">
                    {timeAgo(notif.timestamp)}
                  </p>
                </div>
                {!notif.read && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                    <span className="block h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
