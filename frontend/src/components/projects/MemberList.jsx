import { Trash2, User } from 'lucide-react';
import Badge from '../common/Badge';

const MemberList = ({ members, onRemoveMember, canManage }) => {
  if (!members || members.length === 0) {
    return <div className="text-sm text-slate-500 py-4">No members found.</div>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {members.map((member) => (
        <div key={member.id} className="py-3 flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">{member.name}</p>
              <p className="text-xs text-slate-500">{member.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={member.role === 'Admin' ? 'primary' : 'secondary'}>
              {member.role}
            </Badge>
            {canManage && (
              <button
                onClick={() => onRemoveMember(member)}
                className="text-slate-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Remove Member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
