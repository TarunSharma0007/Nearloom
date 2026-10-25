import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { dataStore } from "@/lib/dataStore";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Eye, AlertTriangle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface PendingCommunity {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string | null;
  created_at: string;
  categories: { name: string } | null;
  locations: { city: string | null; state: string | null } | null;
  profiles: { full_name: string | null; email: string | null } | null;
}

interface CommunityReport {
  id: string;
  reason: string;
  details: string | null;
  communities: { name: string; slug: string } | null;
  profiles: { full_name: string | null } | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role, user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(authUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingCommunities, setPendingCommunities] = useState<PendingCommunity[]>([]);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [stats, setStats] = useState({
    totalCommunities: 0,
    activeCommunities: 0,
    pendingCommunities: 0,
    totalUsers: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        // Fetch pending communities
        const { data: pending } = await supabase
          .from("communities")
          .select(
            `
            *,
            categories(name),
            locations(city, state),
            profiles!communities_created_by_fkey(full_name, email)
          `
          )
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (pending) setPendingCommunities(pending as unknown as PendingCommunity[]);

        // Fetch reports
        const { data: reportsData } = await supabase
          .from("reports")
          .select(
            `
            *,
            communities(name, slug),
            profiles!reports_reported_by_fkey(full_name)
          `
          )
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (reportsData) setReports(reportsData as unknown as CommunityReport[]);

        // Fetch stats
        const [totalComm, activeComm, pendingComm, totalUsers] = await Promise.all([
          supabase.from("communities").select("id", { count: "exact", head: true }),
          supabase.from("communities").select("id", { count: "exact", head: true }).eq("status", "active"),
          supabase.from("communities").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("profiles").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          totalCommunities: totalComm.count || 0,
          activeCommunities: activeComm.count || 0,
          pendingCommunities: pendingComm.count || 0,
          totalUsers: totalUsers.count || 0,
        });
      } catch (err) {
        console.warn("Failed to fetch admin data from Supabase, falling back to dataStore:", err);
      }
    } else {
      // Local / Demo mode fallback
      const pending = dataStore.getCommunities({ status: "pending" }).map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        short_description: c.short_description,
        long_description: c.long_description,
        created_at: c.created_at,
        categories: c.categories ? { name: c.categories.name } : null,
        locations: c.locations ? { city: c.locations.city, state: c.locations.state } : null,
        profiles: { full_name: "Community Host", email: c.contact_email || null },
      }));
      setPendingCommunities(pending);

      const reportsData = dataStore.getReports().filter((r) => r.status === "pending").map((r) => ({
        id: r.id,
        reason: r.reason,
        details: r.details,
        communities: { name: r.community_name, slug: "" },
        profiles: { full_name: r.reporter_name },
      }));
      setReports(reportsData);

      const dsStats = dataStore.getStats();
      setStats({
        totalCommunities: dsStats.totalCommunities,
        activeCommunities: dsStats.activeCommunities,
        pendingCommunities: dsStats.pendingCommunities,
        totalUsers: dsStats.totalUsers,
      });
    }

    setLoading(false);
  }, []);

  const checkAdminAccess = useCallback(async () => {
    if (!isSupabaseConfigured) {
      if (role === "platform_admin") {
        setIsAdmin(true);
        void fetchData();
      } else {
        toast({
          title: "Access Denied",
          description: "A platform administrator role is required to access this page.",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    const { data: hasAdminAccess, error: roleError } = await supabase.rpc("has_role", {
      _user_id: session.user.id,
      _role: "platform_admin",
    });

    if (hasAdminAccess && !roleError) {
      setIsAdmin(true);
      void fetchData();
    } else {
      toast({
        title: "Access Denied",
        description: "A platform administrator role is required to access this page.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [fetchData, navigate, role, toast]);

  useEffect(() => {
    void checkAdminAccess();
  }, [checkAdminAccess]);

  const handleApprove = async (communityId: string) => {
    if (isSupabaseConfigured && user) {
      const { error } = await supabase
        .from("communities")
        .update({
          status: "active",
          verified_at: new Date().toISOString(),
          verified_by: user.id,
        })
        .eq("id", communityId);

      if (error) {
        toast({ title: "Error approving community", variant: "destructive" });
        return;
      }
    } else {
      dataStore.updateCommunityStatus(communityId, "active");
    }

    toast({ title: "Community approved!" });
    void fetchData();
  };

  const handleReject = async (communityId: string, reason: string) => {
    if (!reason) {
      toast({ title: "Please provide a rejection reason", variant: "destructive" });
      return;
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from("communities")
        .update({
          status: "rejected",
          rejection_reason: reason,
        })
        .eq("id", communityId);

      if (error) {
        toast({ title: "Error rejecting community", variant: "destructive" });
        return;
      }
    } else {
      dataStore.updateCommunityStatus(communityId, "rejected", reason);
    }

    toast({ title: "Community rejected" });
    void fetchData();
  };

  const handleReportAction = async (reportId: string, action: "reviewed" | "dismissed") => {
    if (isSupabaseConfigured && user) {
      const { error } = await supabase
        .from("reports")
        .update({
          status: action,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", reportId);

      if (error) {
        toast({ title: "Error updating report", variant: "destructive" });
        return;
      }
    } else {
      dataStore.updateReportStatus(reportId, action);
    }

    toast({ title: `Report ${action}` });
    void fetchData();
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Platform Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Communities</p>
            <p className="text-3xl font-bold">{stats.totalCommunities}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Active Communities</p>
            <p className="text-3xl font-bold text-green-600">{stats.activeCommunities}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingCommunities}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Approvals ({pendingCommunities.length})
            </TabsTrigger>
            <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingCommunities.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending approvals</p>
              </Card>
            ) : (
              pendingCommunities.map((community) => (
                <Card key={community.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{community.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {community.short_description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {community.categories && (
                          <Badge variant="secondary">{community.categories.name}</Badge>
                        )}
                        {community.locations && (
                          <Badge variant="outline">
                            {community.locations.city}, {community.locations.state}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted by: {community.profiles?.full_name || community.profiles?.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Date: {new Date(community.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/community/${community.slug}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>

                  {community.long_description && (
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <p className="text-sm whitespace-pre-line">{community.long_description}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(community.id)}
                      className="flex-1"
                      variant="default"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        const reason = prompt("Rejection reason:");
                        if (reason) handleReject(community.id, reason);
                      }}
                      className="flex-1"
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            {reports.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending reports</p>
              </Card>
            ) : (
              reports.map((report) => (
                <Card key={report.id} className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-semibold">Report: {report.reason}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Community: {report.communities?.name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Reported by: {report.profiles?.full_name}
                    </p>
                    {report.details && (
                      <div className="bg-muted p-3 rounded-lg mt-3">
                        <p className="text-sm">{report.details}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() =>
                        report.communities?.slug &&
                        navigate(`/community/${report.communities.slug}`)
                      }
                      variant="outline"
                    >
                      View Community
                    </Button>
                    <Button
                      onClick={() => handleReportAction(report.id, "reviewed")}
                      variant="default"
                    >
                      Mark Reviewed
                    </Button>
                    <Button
                      onClick={() => handleReportAction(report.id, "dismissed")}
                      variant="secondary"
                    >
                      Dismiss
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
