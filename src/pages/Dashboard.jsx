import React from 'react';
import { 
  FolderKanban, 
  TestTube2, 
  CheckCircle2, 
  XCircle, 
  Bug,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const statCards = [
  { name: 'Total Projects', value: '12', icon: FolderKanban, color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: 'Total Test Cases', value: '845', icon: TestTube2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { name: 'Passed Tests', value: '712', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  { name: 'Failed Tests', value: '34', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  { name: 'Open Defects', value: '18', icon: Bug, color: 'text-orange-600', bg: 'bg-orange-100' },
  { name: 'Pass Percentage', value: '84%', icon: Activity, color: 'text-teal-600', bg: 'bg-teal-100' },
];

const executionData = [
  { name: 'Mon', passed: 40, failed: 2 },
  { name: 'Tue', passed: 30, failed: 1 },
  { name: 'Wed', passed: 20, failed: 5 },
  { name: 'Thu', passed: 27, failed: 3 },
  { name: 'Fri', passed: 18, failed: 4 },
  { name: 'Sat', passed: 23, failed: 2 },
  { name: 'Sun', passed: 34, failed: 0 },
];

const defectData = [
  { name: 'Critical', value: 2, color: '#ef4444' },
  { name: 'High', value: 5, color: '#f97316' },
  { name: 'Medium', value: 8, color: '#eab308' },
  { name: 'Low', value: 3, color: '#3b82f6' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <div className="flex gap-2">
          <select className="input-field py-1.5 text-sm w-48">
            <option>All Projects</option>
            <option>E-commerce App</option>
            <option>HR Portal</option>
          </select>
          <button className="btn-primary py-1.5 text-sm">Generate Report</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="card p-4 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-1">
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Test Execution Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="passed" name="Passed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Defects by Severity</h2>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {defectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs font-medium text-slate-600">
            {defectData.map(entry => (
              <div key={entry.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'Test Execution Completed', detail: 'Regression Suite finished with 98% pass rate.', time: '10 mins ago', type: 'success' },
            { action: 'Defect Logged', detail: 'CRIT-102: Login fails with special characters in password.', time: '1 hour ago', type: 'error' },
            { action: 'Test Cases Generated', detail: 'AI generated 15 test cases for "User Profile Management".', time: '3 hours ago', type: 'info' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
              <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                activity.type === 'success' ? 'bg-green-500' : 
                activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{activity.action}</p>
                <p className="text-sm text-slate-600 mt-0.5">{activity.detail}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
