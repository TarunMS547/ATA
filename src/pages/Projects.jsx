import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Plus, FolderKanban, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const isDemoMode = import.meta.env.VITE_FIREBASE_API_KEY === undefined;

export default function Projects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', type: 'Web Application' });

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  const fetchProjects = async () => {
    try {
      if (!currentUser) return;
      setIsLoading(true);

      if (isDemoMode) {
        // Mock data for previewing
        const savedProjects = JSON.parse(localStorage.getItem('mockProjects') || '[]');
        if (savedProjects.length === 0) {
          const defaultProject = {
            id: 'mock-1',
            name: 'Demo Project',
            description: 'This is a demo project to showcase the UI.',
            type: 'Web Application',
            ownerId: currentUser.uid,
            createdAt: { toMillis: () => Date.now() - 86400000 }
          };
          setProjects([defaultProject]);
          localStorage.setItem('mockProjects', JSON.stringify([defaultProject]));
        } else {
          setProjects(savedProjects);
        }
        setIsLoading(false);
        return;
      }

      const q = query(collection(db, 'projects'), where('ownerId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const fetchedProjects = [];
      querySnapshot.forEach((doc) => {
        fetchedProjects.push({ id: doc.id, ...doc.data() });
      });
      // Sort by creation date descending client-side for simplicity
      fetchedProjects.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name) return;
    
    try {
      setIsCreating(true);
      const projectData = {
        ...newProject,
        ownerId: currentUser.uid,
        createdAt: isDemoMode ? { toMillis: () => Date.now() } : serverTimestamp(),
        updatedAt: isDemoMode ? { toMillis: () => Date.now() } : serverTimestamp()
      };
      
      if (isDemoMode) {
        const newProjectMock = { id: `mock-${Date.now()}`, ...projectData };
        const updatedProjects = [newProjectMock, ...projects];
        setProjects(updatedProjects);
        localStorage.setItem('mockProjects', JSON.stringify(updatedProjects));
      } else {
        const docRef = await addDoc(collection(db, 'projects'), projectData);
        setProjects([{ id: docRef.id, ...projectData, createdAt: { toMillis: () => Date.now() } }, ...projects]);
      }
      
      setShowModal(false);
      setNewProject({ name: '', description: '', type: 'Web Application' });
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your testing projects and applications.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="input-field pl-9 py-2 w-full sm:w-64"
            />
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" /> New Project
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center">
          <div className="bg-primary-50 p-4 rounded-full mb-4 text-primary-500">
            <FolderKanban className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-500 mb-6 max-w-sm">
            Get started by creating a new project to manage your testing requirements, cases, and executions.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="card hover:shadow-md transition-shadow group flex flex-col">
              <div className="p-5 border-b border-slate-100 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                  <span className="badge-info text-[10px] uppercase tracking-wider">{project.type}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1 line-clamp-1">{project.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
                  {project.description || 'No description provided.'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
                <span>Created {project.createdAt?.toMillis ? format(new Date(project.createdAt.toMillis()), 'MMM d, yyyy') : 'Just now'}</span>
                <button className="text-primary-600 font-medium hover:text-primary-700">Open Project &rarr;</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">Create New Project</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div>
                  <label className="label-text">Project Name *</label>
                  <input 
                    type="text" 
                    required 
                    className="input-field" 
                    placeholder="e.g. E-commerce Platform"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label-text">Application Type</label>
                  <select 
                    className="input-field"
                    value={newProject.type}
                    onChange={(e) => setNewProject({...newProject, type: e.target.value})}
                  >
                    <option>Web Application</option>
                    <option>Mobile App (iOS)</option>
                    <option>Mobile App (Android)</option>
                    <option>API / Backend</option>
                    <option>Desktop Application</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">Description</label>
                  <textarea 
                    className="input-field min-h-[100px]" 
                    placeholder="Briefly describe what this project does..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  ></textarea>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="btn-secondary"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary flex items-center justify-center min-w-[100px]"
                  disabled={isCreating || !newProject.name}
                >
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
