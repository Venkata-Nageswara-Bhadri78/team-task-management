import { Loader2 } from 'lucide-react';

const Loader = ({ className = '' }) => {
  return (
    <div className={`flex justify-center items-center h-full w-full ${className}`}>
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );
};

export default Loader;
