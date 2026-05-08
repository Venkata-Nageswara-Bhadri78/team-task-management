import { Link } from 'react-router-dom';
import { Users, CheckCircle, ClipboardList, ChevronRight } from 'lucide-react';
import Badge from '../common/Badge';
import { isAdmin } from '../../utils/roleHelpers';

const ProjectCard = ({ project }) => {
  const roleBadgeVariant = isAdmin(project.role) ? 'primary' : 'secondary';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-slate-800 line-clamp-1" title={project.name}>
          {project.name}
        </h3>
        <Badge variant={roleBadgeVariant}>{project.role}</Badge>
      </div>
      
      <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-grow">
        {project.description || 'No description provided.'}
      </p>

      <div className="flex items-center gap-4 text-sm text-slate-600 mb-6 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-slate-400" />
          <span>{project.total_tasks || 0}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>{project.completed_tasks || 0}</span>
        </div>
      </div>

      <Link
        to={`/projects/${project.id}`}
        className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2 rounded-xl transition border border-slate-200"
      >
        View Details
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default ProjectCard;
