"use client";

import SuperAdminLayout from "@/components/super-admin/layout";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Search } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type TimeRange = "Last 1 month" | "Last 6 months" | "Last 1 year" | "All time";
type RecordType =
  | "Total searches"
  | "Pending records"
  | "On-appeal records"
  | "Dismissed records";

interface AdminUpload {
  email: string;
  count: number;
}

interface MonthlyData {
  name: string;
  value: number;
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Last 6 months");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [recordType, setRecordType] = useState<RecordType>("Total searches");
  const [showRecordTypeDropdown, setShowRecordTypeDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"up" | "down">(
    "down"
  );

  const timeDropdownRef = useRef<HTMLDivElement>(null);
  const recordTypeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if dropdown should open upward based on its position in the viewport
    const checkDropdownPosition = () => {
      if (timeDropdownRef.current) {
        const rect = timeDropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 200) {
          // If less than 200px below, open upward
          setDropdownPosition("up");
        } else {
          setDropdownPosition("down");
        }
      }
    };

    checkDropdownPosition();
    window.addEventListener("resize", checkDropdownPosition);
    return () => window.removeEventListener("resize", checkDropdownPosition);
  }, []);

  const caseRecordsData: MonthlyData[] = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 40 },
    { name: "Mar", value: 28 },
    { name: "Apr", value: 25 },
    { name: "May", value: 22 },
    { name: "Jun", value: 30 },
  ];

  const searchesData: MonthlyData[] = [
    { name: "Jan", value: 38 },
    { name: "Feb", value: 20 },
    { name: "Mar", value: 15 },
    { name: "Apr", value: 45 },
    { name: "May", value: 30 },
    { name: "Jun", value: 22 },
  ];

  const adminUploads: AdminUpload[] = [
    { email: "iamrick@gmail.com", count: 72 },
    { email: "stanley@gmail.com", count: 41 },
    { email: "chiomachris@gmail.com", count: 117 },
    { email: "chiomachris@gmail.com", count: 117 },
    { email: "chiomachris@gmail.com", count: 117 },
  ];

  const handleTimeRangeSelect = (range: TimeRange) => {
    setTimeRange(range);
    setShowTimeDropdown(false);
  };

  const handleRecordTypeSelect = (type: RecordType) => {
    setRecordType(type);
    setShowRecordTypeDropdown(false);
  };

  return (
    <SuperAdminLayout
      title="Data Reports"
      description="View and manage data reports"
    >
      <div className="p-6">
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Case Records Summary</h2>

            <div className="relative" ref={timeDropdownRef}>
              <button
                className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-md text-sm"
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              >
                <span>{timeRange}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showTimeDropdown && (
                <div
                  className={`absolute ${
                    dropdownPosition === "up"
                      ? "bottom-full mb-1"
                      : "top-full mt-1"
                  } right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10`}
                >
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleTimeRangeSelect("Last 1 month")}
                    >
                      Last 1 month
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleTimeRangeSelect("Last 6 months")}
                    >
                      Last 6 months
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleTimeRangeSelect("Last 1 year")}
                    >
                      Last 1 year
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleTimeRangeSelect("All time")}
                    >
                      All time
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={caseRecordsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-700">
              Total record uploads in 6 months:{" "}
              <span className="font-semibold">23465 searches</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Uploads by admins</h2>

            <div className="space-y-4">
              {adminUploads.map((admin, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">{admin.email}</div>
                  <div className="flex items-center">
                    <div className="font-semibold mr-2">{admin.count}</div>
                    <div className="w-24 h-1 bg-blue-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(admin.count / 120) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Data Reports</h2>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-md text-sm"
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <span>{timeRange}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative" ref={recordTypeDropdownRef}>
                  <button
                    className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-md text-sm"
                    onClick={() =>
                      setShowRecordTypeDropdown(!showRecordTypeDropdown)
                    }
                  >
                    <span>{recordType}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showRecordTypeDropdown && (
                    <div
                      className={`absolute ${
                        dropdownPosition === "up"
                          ? "bottom-full mb-1"
                          : "top-full mt-1"
                      } right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10`}
                    >
                      <div className="py-1">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() =>
                            handleRecordTypeSelect("Total searches")
                          }
                        >
                          Total searches
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() =>
                            handleRecordTypeSelect("Pending records")
                          }
                        >
                          Pending records
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() =>
                            handleRecordTypeSelect("On-appeal records")
                          }
                        >
                          On-appeal records
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() =>
                            handleRecordTypeSelect("Dismissed records")
                          }
                        >
                          Dismissed records
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={searchesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-700">
                Total searches in 6 months:{" "}
                <span className="font-semibold">23465 searches</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
