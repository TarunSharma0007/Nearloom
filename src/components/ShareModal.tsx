import { useState } from "react";
import { Check, Copy, QrCode, Share2, MessageCircle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ShareModalProps {
  communityName: string;
  communityDescription: string;
  slug: string;
}

export const ShareModal = ({ communityName, communityDescription, slug }: ShareModalProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/community/${slug}`
    : `https://nearloom.app/community/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${communityName} | Nearloom`,
          text: communityDescription,
          url: shareUrl,
        });
      } catch {
        // User closed native share sheet
      }
    } else {
      void handleCopy();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${communityName} on Nearloom: ${shareUrl}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out ${communityName} on Nearloom`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Discover ${communityName} on @NearloomApp`)}&url=${encodeURIComponent(shareUrl)}`;

  // Quick QR Code using reliable public SVG API
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}&bgcolor=fbf8f2&color=12241d`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Share Community</DialogTitle>
          <DialogDescription>
            Help {communityName} connect with more interested people in your city.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-3">
          {/* Quick Copy Link */}
          <div className="flex items-center gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="rounded-xl bg-secondary/50 font-mono text-xs"
            />
            <Button onClick={handleCopy} className="rounded-xl shrink-0 gap-1.5" size="sm">
              {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          {/* Social Quick Share Buttons */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-foreground/10 bg-emerald-500/10 p-2.5 font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-foreground/10 bg-sky-500/10 p-2.5 font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 transition-colors"
            >
              <Send className="h-4 w-4" />
              Telegram
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-foreground/10 bg-slate-500/10 p-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-500/20 transition-colors"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X / Twitter
            </a>
          </div>

          {/* QR Code toggle */}
          <div className="border-t border-foreground/10 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowQr(!showQr)}
              className="w-full justify-between text-xs text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-primary" />
                {showQr ? "Hide QR Code" : "Show Poster QR Code"}
              </span>
              <span>{showQr ? "▲" : "▼"}</span>
            </Button>

            {showQr && (
              <div className="mt-3 flex flex-col items-center justify-center rounded-2xl bg-secondary/30 p-5 text-center">
                <img
                  src={qrApiUrl}
                  alt={`QR code for ${communityName}`}
                  className="h-40 w-40 rounded-xl border border-foreground/10 shadow-sm"
                  loading="lazy"
                />
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Scan to open this circle on mobile
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
