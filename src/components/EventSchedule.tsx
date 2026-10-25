import { useState } from "react";
import { CalendarDays, Clock, MapPin, Check, Plus, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dataStore, type CommunityEvent } from "@/lib/dataStore";
import { toast } from "sonner";

interface EventScheduleProps {
  communityId: string;
  communityName: string;
  events: CommunityEvent[];
}

export const EventSchedule = ({ communityId, communityName, events }: EventScheduleProps) => {
  const [localEvents, setLocalEvents] = useState<CommunityEvent[]>(events);

  const handleToggleRsvp = (eventId: string) => {
    const isNowRsvpd = dataStore.toggleRsvp(communityId, eventId);
    setLocalEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            rsvpCount: isNowRsvpd ? e.rsvpCount + 1 : Math.max(0, e.rsvpCount - 1),
          };
        }
        return e;
      })
    );

    if (isNowRsvpd) {
      toast.success("RSVP confirmed! We've saved your spot.", {
        description: "You'll receive a reminder before the gathering begins.",
      });
    } else {
      toast.info("RSVP cancelled.");
    }
  };

  const getGoogleCalendarUrl = (evt: CommunityEvent) => {
    const title = encodeURIComponent(`${communityName}: ${evt.title}`);
    const details = encodeURIComponent(`${evt.description}\n\nOrganized by ${communityName} on Nearloom.`);
    const location = encodeURIComponent(evt.locationName);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  if (!localEvents || localEvents.length === 0) {
    return (
      <div className="rounded-[1.7rem] border border-dashed border-foreground/20 p-8 text-center">
        <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground opacity-60" />
        <h3 className="mt-3 font-display text-xl font-medium">No upcoming gatherings posted</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The host typically announces dates directly inside their community channel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {localEvents.map((evt) => {
        const isRsvpd = dataStore.isRsvpd(evt.id);
        const gcalUrl = getGoogleCalendarUrl(evt);

        return (
          <div
            key={evt.id}
            className="flex flex-col justify-between gap-4 rounded-[1.6rem] border border-foreground/10 bg-card p-5 transition-all duration-300 hover:border-foreground/25 hover:shadow-md sm:flex-row sm:items-center"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={evt.isOnline ? "secondary" : "outline"} className="text-xs">
                  {evt.isOnline ? "Online Session" : "In Person"}
                </Badge>
                <span className="text-xs font-semibold text-primary">{evt.date}</span>
              </div>

              <h4 className="font-display text-xl font-bold tracking-tight">{evt.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                {evt.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {evt.time}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {evt.locationName}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0 sm:items-end">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleToggleRsvp(evt.id)}
                  variant={isRsvpd ? "default" : "outline"}
                  size="sm"
                  className="rounded-full gap-1.5"
                >
                  {isRsvpd ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Attending ({evt.rsvpCount})
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      RSVP ({evt.rsvpCount})
                    </>
                  )}
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  title="Add to Google Calendar"
                >
                  <a href={gcalUrl} target="_blank" rel="noopener noreferrer">
                    <Calendar className="h-4 w-4 mr-1 text-primary" />
                    <span className="hidden sm:inline">Add to Cal</span>
                    <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
