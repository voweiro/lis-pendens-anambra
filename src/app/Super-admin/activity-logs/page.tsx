"use client";

import SuperAdminLayout from "@/components/super-admin/layout";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  MoreHorizontal,
  Search,
  Trash2,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ReviewModal } from "@/components/super-admin/manage-cases/review-modal";
import { GetSuperAdminActivityLogs } from "@/Services/AuthRequest/auth.request";
import { toast } from "react-toastify";

type ActivityType = "updated" | "uploaded";

interface ActivityLog {
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
    initial?: string;
  };
  type: ActivityType;
  description: string;
  timestamp: string;
  date: string;
  time: string;
  caseTitle?: string;
  caseId?: string;
  details?: {
    propertyTitle: string;
    registeredTitleNumber: string;
    location: string;
    surveyPlanNumber: string;
    ownerName: string;
    caseStatus: "Pending" | "On appeal" | "Disposed";
    lastUpdated: string;
  };
}

export default function ActivityLogsPage() {
  const [view, setView] = useState<"summary" | "list">("summary");
  const [selectedDate, setSelectedDate] = useState("20 May");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [reviewLog, setReviewLog] = useState<ActivityLog | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate dates for the date picker - current week
  const generateDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start from Monday

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const day = `${date.getDate()} ${date.toLocaleString("default", {
        month: "short",
      })}`;
      const weekday = date.toLocaleString("default", { weekday: "short" });
      dates.push({ day, weekday });
    }
    return dates;
  };

  const dates = generateDates();

  // Fetch activity logs from API
  useEffect(() => {
    const fetchActivityLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await GetSuperAdminActivityLogs();
        if (response.success) {
          setActivityLogs(response.data);
        } else {
          setError(response.error || "Failed to fetch activity logs");
          toast.error(response.error || "Failed to fetch activity logs");
        }
      } catch (error: any) {
        console.error("Error fetching activity logs:", error);
        setError(error.message || "An unexpected error occurred");
        toast.error(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []);

  // Helper functions to organize logs by date and time for the summary view
  const getActivityLogsByDate = (logs: ActivityLog[], selectedDate: string) => {
    // Filter logs for the selected date
    const filteredLogs = logs.filter((log) => log.date === selectedDate);

    // Group logs by time
    const logsByTime = filteredLogs.reduce(
      (acc: { time: string; activities: any[] }[], log) => {
        const timeGroup = acc.find((group) => group.time === log.time);

        const activity = {
          type: log.type.toUpperCase(),
          user: log.user.name || log.user.email,
          description: log.description,
        };

        if (timeGroup) {
          timeGroup.activities.push(activity);
        } else {
          acc.push({
            time: log.time,
            activities: [activity],
          });
        }

        return acc;
      },
      []
    );

    // Sort by time
    return logsByTime.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`);
      const timeB = new Date(`1970/01/01 ${b.time}`);
      return timeA.getTime() - timeB.getTime();
    });
  };

  // Calculate summary statistics
  const getActivitySummary = (logs: ActivityLog[]) => {
    const uploadCount = logs.filter(
      (log) => log.type.toLowerCase() === "uploaded"
    ).length;
    const updateCount = logs.filter(
      (log) => log.type.toLowerCase() === "updated"
    ).length;

    return {
      uploadCount,
      updateCount,
      totalCount: logs.length,
    };
  };

  // Filter logs based on search query
  const filteredLogs = activityLogs.filter((log) => {
    if (!searchQuery) return true;
    return (
      log.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.caseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.caseId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleMenuToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleReview = (log: ActivityLog) => {
    setReviewLog(log);
  };

  const handleDelete = (id: string) => {
    setSelectedLogId(id);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    // Here you would typically delete the log from your backend
    console.log(`Deleting log ${selectedLogId}`);
    // Remove the log from the local state for immediate UI update
    setActivityLogs(activityLogs.filter((log) => log.id !== selectedLogId));
    toast.success("Activity log deleted successfully");
    setShowDeleteModal(false);
    setSelectedLogId(null);
  };

  const handleFlagCase = (id: string) => {
    // Here you would typically flag the case in your backend
    console.log(`Flagging case for log ${id}`);
    setOpenMenuId(null);
  };

  // Close dropdowns when clicking outside
  const handleClickOutside = () => {
    if (openMenuId) setOpenMenuId(null);
  };

  return (
    <SuperAdminLayout
      title="Activity Logs "
      description="Track your searches and manage overall activities"
    >
      <div className="p-3 sm:p-6" onClick={handleClickOutside}>
        {/* Header Section */}

        {/* Loading State */}
        {loading && (
          <div className="mt-8 flex items-center justify-center p-8">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <p className="mt-2 text-gray-600 text-center">
                Loading activity logs...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mt-8 bg-red-50 p-4 sm:p-6 rounded-lg border border-red-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm sm:text-base">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Summary View */}
        {!loading && !error && view === "summary" && (
          <>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Summary Card */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm lg:col-span-1">
                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                <div className="flex items-center justify-center gap-2 sm:gap-4 relative">
                  <div className="relative flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg sm:text-2xl font-bold">
                        {getActivitySummary(activityLogs).uploadCount}
                      </span>
                    </div>
                    <div className="text-center mt-2 text-xs sm:text-sm text-gray-600">
                      Total upload
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gray-700 flex items-center justify-center text-white">
                      <span className="text-lg sm:text-2xl font-bold">
                        {getActivitySummary(activityLogs).updateCount}
                      </span>
                    </div>
                    <div className="text-center mt-2 text-xs sm:text-sm text-gray-600">
                      Total update
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Card */}
              <div className="bg-white rounded-lg shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                    {dates.map((date) => (
                      <button
                        key={date.day}
                        className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-md min-w-[44px] sm:min-w-[52px] ${
                          selectedDate === date.day
                            ? "bg-gray-900 text-white"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => setSelectedDate(date.day)}
                      >
                        <span className="text-xs">{date.weekday}</span>
                        <span className="font-medium text-xs sm:text-sm">
                          {date.day.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                <div className="p-3 sm:p-4 max-h-64 sm:max-h-80 overflow-y-auto">
                  {activityLogs.length === 0 && !loading ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No activity logs found for this date
                    </div>
                  ) : (
                    getActivityLogsByDate(activityLogs, selectedDate).map(
                      (timeSlot, index) => (
                        <div key={index} className="mb-4">
                          <div className="text-xs sm:text-sm text-gray-500 mb-2">
                            {timeSlot.time}
                          </div>
                          {timeSlot.activities.map((activity, actIndex) => (
                            <div
                              key={actIndex}
                              className={`p-2 sm:p-3 rounded-md mb-2 ${
                                activity.type === "UPDATED"
                                  ? "bg-gray-800 text-white"
                                  : "bg-gray-200"
                              }`}
                            >
                              <div className="font-medium text-sm">
                                {activity.type}:
                              </div>
                              <div className="text-xs sm:text-sm">
                                {activity.user} {activity.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-6 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="search username.."
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full sm:max-w-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => setView("list")}
                  className="flex items-center justify-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
                >
                  <span>More</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {filteredLogs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 sm:gap-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0 text-sm">
                      {log.user.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="font-medium text-sm sm:text-base truncate">
                          {log.user.name}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          {log.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={() => handleReview(log)}
                      >
                        Review
                      </button>
                      <div className="relative">
                        <button
                          className="p-1 rounded-md hover:bg-gray-100"
                          onClick={(e) => handleMenuToggle(log.id, e)}
                        >
                          <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>

                        {openMenuId === log.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <div className="py-1">
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFlagCase(log.id);
                                }}
                              >
                                <Flag className="h-4 w-4 text-red-500" />
                                <span>Flag case</span>
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600 text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(log.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* List View */}
        {!loading && !error && view === "list" && (
          <div className="mt-6 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <button
                onClick={() => setView("summary")}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 self-start"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm sm:text-base">Back</span>
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="search records, status.."
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full sm:min-w-[300px] focus:outline-none focus:ring-2 focus:ring-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No activity logs found matching your search
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 sm:gap-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0 text-sm">
                      {log.user.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="font-medium text-sm sm:text-base truncate">
                          {log.user.name}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          {log.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={() => handleReview(log)}
                      >
                        Review
                      </button>
                      <div className="relative">
                        <button
                          className="p-1 rounded-md hover:bg-gray-100"
                          onClick={(e) => handleMenuToggle(log.id, e)}
                        >
                          <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>

                        {openMenuId === log.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <div className="py-1">
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFlagCase(log.id);
                                }}
                              >
                                <Flag className="h-4 w-4 text-red-500" />
                                <span>Flag case</span>
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600 text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(log.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Delete Record</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-center text-gray-700 mb-6">Confirm Delete</p>

                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm sm:text-base"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {reviewLog && (
          <ReviewModal
            log={reviewLog}
            onClose={() => setReviewLog(null)}
            onDelete={() => {
              setReviewLog(null);
              setSelectedLogId(reviewLog.id);
              setShowDeleteModal(true);
            }}
            onDownload={() => {
              console.log("Downloading case details for", reviewLog.caseTitle);
            }}
          />
        )}
      </div>
    </SuperAdminLayout>
  );
}
