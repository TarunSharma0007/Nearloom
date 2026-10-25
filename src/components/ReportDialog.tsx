import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Flag, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ReportDialogProps {
  communityId: string;
  communityName: string;
}

const REPORT_REASONS = [
  { value: "spam", label: "Spam or misleading information" },
  { value: "fake", label: "Fake or non-existent community" },
  { value: "inappropriate", label: "Inappropriate or offensive content" },
  { value: "scam", label: "Scam or fraudulent activity" },
  { value: "inactive", label: "Community is inactive or disbanded" },
  { value: "other", label: "Other reason" },
];

export const ReportDialog = ({ communityId, communityName }: ReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!reason) {
      toast({ title: "Please select a reason", variant: "destructive" });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({ title: "Please sign in to report", description: "You need to be logged in to submit a report." });
      navigate("/auth");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("reports").insert({
      community_id: communityId,
      reported_by: session.user.id,
      reason: REPORT_REASONS.find(r => r.value === reason)?.label || reason,
      details: details.trim() || null,
    });

    if (error) {
      toast({ title: "Error submitting report", description: error.message, variant: "destructive" });
    } else {
      toast({ 
        title: "Report submitted", 
        description: "Thank you for helping keep our community safe. We'll review this report within 24-48 hours." 
      });
      setOpen(false);
      setReason("");
      setDetails("");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Flag className="h-4 w-4 mr-2" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Report Community
          </DialogTitle>
          <DialogDescription>
            Report "{communityName}" for violating our community guidelines
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>Why are you reporting this community? *</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {REPORT_REASONS.map((r) => (
                <div key={r.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={r.value} id={r.value} />
                  <Label htmlFor={r.value} className="font-normal cursor-pointer">
                    {r.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Additional details (optional)</Label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any additional context that might help us investigate..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {details.length}/500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !reason} variant="destructive">
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
