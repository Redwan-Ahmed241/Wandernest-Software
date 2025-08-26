import React, { useState } from "react";
import { FaChartBar, FaPlus, FaUserShield, FaPlane, FaHotel, FaUtensils, FaMapMarkerAlt, FaClipboardCheck } from "react-icons/fa";
// import { useAuth } from "../../Context/AuthContext"; // Uncomment if you have AuthContext
// import { Navigate } from "react-router-dom"; // Uncomment if you want to redirect non-admins
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis } from 'recharts';
// Recharts chart components for analytics dashboard

// Tailwind colors and theme should match Wandernest configuration.

const tabs = [
  { key: "analytics", icon: <FaChartBar />, label: "Analytics" },
  { key: "add", icon: <FaPlus />, label: "Add Data" },
  { key: "visa", icon: <FaClipboardCheck />, label: "Visa Approvals" },
];

function AdminDashboard() {
  // ToDo: Uncomment/use context when ready
  // const { user } = useAuth();
  // if (!user?.isAdmin) return <Navigate to="/" push />;

  const [tab, setTab] = useState("analytics");

  // Dummy data fallback
  const dummyAnalytics = {
    users: 4670,
    packagesBooked: 1235,
    featuresUsed: {
      Flights: 800,
      Hotels: 623,
      "Visa Requests": 110,
      Groups: 370,
      Blogs: 180,
    },
    trends: [
      // Sample: one point per week for last 8 weeks
      { week: "2025-W29", users: 300, packages: 45 },
      { week: "2025-W30", users: 335, packages: 53 },
      { week: "2025-W31", users: 421, packages: 62 },
      { week: "2025-W32", users: 468, packages: 78 },
      { week: "2025-W33", users: 522, packages: 104 },
      { week: "2025-W34", users: 588, packages: 121 },
      { week: "2025-W35", users: 689, packages: 137 },
      { week: "2025-W36", users: 867, packages: 163 }
    ],
    topPackages: [
      { name: "Bali Adventure", booked: 92 },
      { name: "Japan Explorer", booked: 81 },
      { name: "Paris Getaway", booked: 79 },
      { name: "Canadian Rockies", booked: 65 }
    ],
    topUsers: [
      { name: "Alice", bookings: 14 },
      { name: "Saeed", bookings: 12 },
      { name: "Maria", bookings: 10 },
      { name: "Bob", bookings: 8 }
    ]
  };
  const dummyVisaRequests = [
    { id: 1, name: "Alice Smith", country: "Japan", status: "Pending" },
    { id: 2, name: "Bob Lee", country: "Canada", status: "Pending" },
  ];

  const initialFields = { name: '', description: '' };
  const [form, setForm] = useState({ type: "package", fields: initialFields });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [analytics, setAnalytics] = useState(dummyAnalytics);
  const [visaRequests, setVisaRequests] = useState(dummyVisaRequests);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Filter states
  const [trendMetric, setTrendMetric] = useState<'users'|'packages'|'both'>('both');
  const [trendRange, setTrendRange] = useState<number>(8); // number of weeks shown

  React.useEffect(() => {
    // Sample endpoint: /api/admin/analytics
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/analytics");
        if (!res.ok) throw new Error("Network/endpoint error");
        const data = await res.json();
        setAnalytics(data);
        setApiError("");
      } catch (err) {
        setAnalytics(dummyAnalytics);
        setApiError("Could not load live analytics, using dummy stats.");
      } finally {
        setLoading(false);
      }
    }
    // Sample endpoint: /api/admin/visa-requests
    async function fetchVisaRequests() {
      try {
        const res = await fetch("/api/admin/visa-requests");
        if (!res.ok) throw new Error("Network/endpoint error");
        const data = await res.json();
        setVisaRequests(data);
      } catch (err) {
        setVisaRequests(dummyVisaRequests);
      }
    }
    fetchAnalytics();
    fetchVisaRequests();
  }, []);

  // Handle tab switching
  const handleTab = (key: string) => setTab(key);
  // Shared Tailwind section classes
  const sectionCls = "bg-white rounded-lg p-6 shadow-md mt-4";

  // Form handler examples
  // Frontend validators by field
  const validators: { [field: string]: (val: string) => string } = {
    name: (value: string) => {
      if (!value.trim()) return 'Name is required.';
      if (value.length < 3) return 'Name must be at least 3 characters.';
      if (value.length > 50) return 'Name may not exceed 50 characters.';
      return '';
    },
    description: (value: string) => {
      if (!value.trim()) return 'Description is required.';
      if (value.length < 10) return 'Description must be at least 10 characters.';
      if (value.length > 300) return 'Description may not exceed 300 characters.';
      return '';
    },
    // Extend for more fields later!
  };
  const validateField = (name: string, value: string) => {
    return validators[name] ? validators[name](value) : '';
  };
  const validateAll = () => {
    const newErrs: { [k: string]: string } = {};
    Object.entries(form.fields).forEach(([k, v]) => {
      const err = validateField(k, v as string);
      if (err) newErrs[k] = err;
    });
    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, fields: { ...form.fields, [e.target.name]: e.target.value } });
    setTouched({ ...touched, [e.target.name]: true });
    // Validate live as typing
    setErrors((errs) => ({ ...errs, [e.target.name]: validateField(e.target.name, e.target.value) }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    try {
      const url = `/api/admin/${form.type}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.fields),
      });
      if (!res.ok) throw new Error("API error");
      alert(`Successfully added ${form.type}!`);
      setForm({ ...form, fields: initialFields });
      setTouched({});
      setErrors({});
    } catch {
      alert("Could not submit to API (using dummy mode): data NOT saved on server.");
    }
  };
  // Visa Approve/Deny actions (POST dummy endpoints): /api/admin/visa-requests/{id}/approve
  const handleVisaAction = async (id: number, action: "approve" | "deny") => {
    try {
      const url = `/api/admin/visa-requests/${id}/${action}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error("API error");
      setVisaRequests((reqs) =>
        reqs.map((r) => (r.id === id ? { ...r, status: action === "approve" ? "Approved" : "Denied" } : r))
      );
    } catch {
      // fallback, update dummy client-side
      setVisaRequests((reqs) =>
        reqs.map((r) => (r.id === id ? { ...r, status: action === "approve" ? "Approved (dummy)" : "Denied (dummy)" } : r))
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#e8f2f2] p-8 font-plus-jakarta text-[#0d1c1c]">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#4a6b5b]">Admin Dashboard</h1>
      <div className="flex gap-4 border-b border-[#abb79a] pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-lg font-medium focus:outline-none ${tab === t.key ? 'bg-[#6ab187] text-white' : 'text-[#4a6b5b] bg-transparent'}`}
            onClick={() => handleTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {tab === "analytics" && (
        <section className={sectionCls}>
          <h2 className="text-2xl font-semibold mb-4 text-[#4a6b5b]">Site Analytics</h2>
          {apiError && (
            <div className="mb-3 text-sm text-red-600">{apiError}</div>
          )}
          {loading ? (
            <div className="text-lg">Loading analytics...</div>
          ) : (
            <>
              {/* Feature Use Pie & Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-[#4a6b5b] p-4 rounded-lg text-white">
                  <div className="text-3xl font-bold">{analytics.users}</div>
                  <div className="text-lg">Total Users</div>
                </div>
                <div className="bg-[#6ab187] p-4 rounded-lg text-white">
                  <div className="text-3xl font-bold">{analytics.packagesBooked}</div>
                  <div className="text-lg">Packages Booked</div>
                </div>
                <div className="bg-[#abb79a] p-4 rounded-lg text-[#0d1c1c]">
                  <div className="text-3xl font-bold">{Object.values(analytics.featuresUsed).reduce((a, b) => a + b, 0)}</div>
                  <div className="text-lg">Features Used</div>
                </div>
              </div>

              {/* Package/user trends by week with filtering */}
              <div className="mt-8 mb-12">
                <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Growth Trends (Weekly)</h3>
                  </div>
                  <div className="flex gap-2">
                    <label className="text-base font-medium">Show:
                      <select className="ml-2 p-1 border rounded" value={trendMetric} onChange={e=>setTrendMetric(e.target.value as 'users'|'packages'|'both')}>
                        <option value="both">Users & Packages</option>
                        <option value="users">Users Only</option>
                        <option value="packages">Packages Only</option>
                      </select>
                    </label>
                    <label className="text-base font-medium">Range:
                      <select className="ml-2 p-1 border rounded" value={trendRange} onChange={e=>setTrendRange(Number(e.target.value))}>
                        <option value={4}>Last 4 weeks</option>
                        <option value={8}>Last 8 weeks</option>
                        <option value={999}>All available</option>
                      </select>
                    </label>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart
                    data={(analytics.trends||[]).slice(-trendRange)}
                    margin={{ left: 16, right: 16 }}
                  >
                    <XAxis dataKey="week" tick={{fontSize: 12}} />
                    <YAxis allowDecimals={false} tick={{fontSize: 12}} />
                    <Tooltip />
                    <Legend />
                    {(trendMetric === 'users' || trendMetric === 'both') && (
                      <Line type="monotone" dataKey="users" name="New Users" stroke="#4a6b5b" strokeWidth={3} />
                    )}
                    {(trendMetric === 'packages' || trendMetric === 'both') && (
                      <Line type="monotone" dataKey="packages" name="Packages Booked" stroke="#6ab187" strokeWidth={3} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Feature Usage Pie & Breakdown */}
              <div className="mb-12 md:flex gap-16 items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Feature Usage Breakdown</h3>
                  <ul className="list-disc pl-8 text-base">
                    {Object.entries(analytics.featuresUsed).map(([k, v]) => (
                      <li key={k} className="mb-1">{k}: <span className="font-bold">{v}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="w-full md:w-1/2" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics.featuresUsed).map(([name, value]) => ({ name, value }))}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        fill="#6ab187"
                        label
                      >
                        {Object.keys(analytics.featuresUsed).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#4a6b5b", "#6ab187", "#abb79a", "#e8f2f2", "#0d1c1c"][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Packages Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Top Booked Packages (This Period)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-[320px] w-full text-base bg-[#fff] border rounded">
                    <thead className="bg-[#abb79a]/60">
                      <tr>
                        <th className="text-left py-2 px-3 font-medium">Rank</th>
                        <th className="text-left py-2 px-3 font-medium">Package</th>
                        <th className="text-left py-2 px-3 font-medium">Booked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(analytics.topPackages||[]).map((pkg, i) => (
                        <tr key={pkg.name} className="border-b last:border-none">
                          <td className="py-2 px-3">{i+1}</td>
                          <td className="py-2 px-3">{pkg.name}</td>
                          <td className="py-2 px-3">{pkg.booked}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Users Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Most Active Users (This Period)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-[320px] w-full text-base bg-[#fff] border rounded">
                    <thead className="bg-[#abb79a]/60">
                      <tr>
                        <th className="text-left py-2 px-3 font-medium">Rank</th>
                        <th className="text-left py-2 px-3 font-medium">User</th>
                        <th className="text-left py-2 px-3 font-medium">Bookings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(analytics.topUsers||[]).map((usr, i) => (
                        <tr key={usr.name} className="border-b last:border-none">
                          <td className="py-2 px-3">{i+1}</td>
                          <td className="py-2 px-3">{usr.name}</td>
                          <td className="py-2 px-3">{usr.bookings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* Add Data Tab */}
      {tab === "add" && (
        <section className={sectionCls}>
          <h2 className="text-2xl font-semibold mb-4 text-[#4a6b5b]">Add Data</h2>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block mb-1 font-medium">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value, fields: initialFields })}
                className="w-full border border-[#abb79a] rounded p-2"
              >
                <option value="package">Package</option>
                <option value="destination">Destination</option>
                <option value="restaurant">Restaurant</option>
                <option value="flight">Flight</option>
              </select>
            </div>

            {/* Example fields, replace/adapt by actual models */}
            <div>
              <label className="block mb-1 font-medium">Name/Title</label>
              <input 
                type="text" 
                name="name" 
                value={form.fields.name || ''}
                className={`w-full border ${errors.name && touched.name ? 'border-red-500' : 'border-[#abb79a]'} rounded p-2`}
                onChange={handleFormChange}
                onBlur={() => setTouched({ ...touched, name: true })}
                required 
                minLength={3}
                maxLength={50}
              />
              {errors.name && touched.name && (
                <div className="mt-1 text-red-500 text-sm">{errors.name}</div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <input 
                type="text" 
                name="description" 
                value={form.fields.description || ''}
                className={`w-full border ${errors.description && touched.description ? 'border-red-500' : 'border-[#abb79a]'} rounded p-2`}
                onChange={handleFormChange}
                onBlur={() => setTouched({ ...touched, description: true })}
                required 
                minLength={10}
                maxLength={300}
              />
              {errors.description && touched.description && (
                <div className="mt-1 text-red-500 text-sm">{errors.description}</div>
              )}
            </div>
            {/* TODO: Add type-specific fields! */}

            <button 
              type="submit" 
              className="bg-[#6ab187] text-white py-2 px-6 rounded hover:bg-[#4a6b5b] disabled:bg-[#abb79a]" 
              disabled={Object.values(errors).some(e => e)}
            >Add {form.type}</button>
          </form>
        </section>
      )}

      {/* Visa Approval Tab */}
      {tab === "visa" && (
        <section className={sectionCls}>
          <h2 className="text-2xl font-semibold mb-4 text-[#4a6b5b]">Visa Approvals</h2>
          <table className="w-full border rounded mt-4">
            <thead className="bg-[#abb79a]">
              <tr>
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Country</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visaRequests.map((req) => (
                <tr key={req.id} className="border-b last:border-none">
                  <td className="py-2 px-4">{req.name}</td>
                  <td className="py-2 px-4">{req.country}</td>
                  <td className="py-2 px-4">{req.status}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button onClick={() => handleVisaAction(req.id, "approve")} className="bg-[#6ab187] text-white px-3 py-1 rounded hover:bg-[#4a6b5b]">Approve</button>
                    <button onClick={() => handleVisaAction(req.id, "deny")} className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600">Deny</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;

