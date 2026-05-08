const StatCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center transition hover:shadow-md">
      <div className={`p-4 rounded-full mr-5 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
