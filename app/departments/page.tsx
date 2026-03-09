import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Departments</h1>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
          <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Departments</h3>
          <p className="text-slate-400">Department management coming soon</p>
        </div>
      </div>
    </div>
  );
}
