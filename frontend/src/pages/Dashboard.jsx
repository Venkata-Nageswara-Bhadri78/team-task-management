import { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { getDashboardSummaryApi } from '../api/dashboardApi';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import getErrorMessage from '../utils/getErrorMessage';
import StatCard from '../components/dashboard/StatCard';
import StatusChart from '../components/dashboard/StatusChart';
import TasksPerUserChart from '../components/dashboard/TasksPerUserChart';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardSummaryApi();
        setSummary(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loader className="min-h-[60vh]" />;

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100">
        <p className="font-medium">Failed to load dashboard data</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!summary) return null;

  const statusChartData = [
    { name: 'To Do', value: summary.tasks_by_status.to_do },
    { name: 'In Progress', value: summary.tasks_by_status.in_progress },
    { name: 'Done', value: summary.tasks_by_status.done },
  ];

  const userChartData = summary.tasks_per_user.map((item) => ({
    name: item.name,
    tasks: item.task_count,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}!</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={summary.total_tasks}
          icon={ClipboardList}
          colorClass="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="To Do"
          value={summary.tasks_by_status.to_do}
          icon={Clock}
          colorClass="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Completed"
          value={summary.tasks_by_status.done}
          icon={CheckCircle}
          colorClass="bg-green-100 text-green-600"
        />
        <StatCard
          title="Overdue"
          value={summary.overdue_tasks}
          icon={AlertTriangle}
          colorClass="bg-red-100 text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Tasks by Status</h3>
          <StatusChart data={statusChartData} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Tasks per User</h3>
          <TasksPerUserChart data={userChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
