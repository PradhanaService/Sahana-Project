import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Folders, Layers3, Search, Users2 } from 'lucide-react';
import { db } from './firebase';
import useAuth from './hooks/useAuth';
import AuthScreen from './components/AuthScreen';
import CommentPanel from './components/CommentPanel';
import CreateIssueModal from './components/CreateIssueModal';
import CreateProjectModal from './components/CreateProjectModal';
import DashboardOverview from './components/DashboardOverview';
import DashboardSkeleton from './components/DashboardSkeleton';
import IssueList from './components/IssueList';
import ProjectTeamPanel from './components/ProjectTeamPanel';
import ProfileSetup from './components/ProfileSetup';
import ProjectGrid from './components/ProjectGrid';
import ProjectsSidebar from './components/ProjectsSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import ToastViewport from './components/ToastViewport';
import getFriendlyError from './utils/friendlyError';

const dashboardSeedProjects = [
  {
    key: 'CORE',
    name: 'Core Platform',
    description: 'Authentication, workflow rules, audit coverage, and release readiness for the internal platform.',
    team: 'Platform',
    visibility: 'Private',
    status: 'Active',
  },
  {
    key: 'UX',
    name: 'Experience Refresh',
    description: 'Card-driven redesign for the project hub, onboarding, and role-based dashboard surfaces.',
    team: 'Frontend',
    visibility: 'Shared',
    status: 'Planning',
  },
  {
    key: 'QA',
    name: 'Quality Command',
    description: 'Regression planning, handoff verification, and release certification workflows.',
    team: 'QA Guild',
    visibility: 'Private',
    status: 'Active',
  },
];

function DashboardApp() {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [comments, setComments] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeIssueId, setActiveIssueId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const [toasts, setToasts] = useState([]);
  const [profileSetupLoading, setProfileSetupLoading] = useState(false);
  const [profileSetupError, setProfileSetupError] = useState('');
  const [memberUpdateLoading, setMemberUpdateLoading] = useState(false);

  const pushToast = (type, title, message = '') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { id, type, title, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const allUsers = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        setUsers(allUsers);
        const currentProfile = allUsers.find((entry) => entry.id === currentUser.uid);
        setProfile(currentProfile ?? null);
        setProfileLoading(false);
        setProjectsLoading(Boolean(currentProfile));
        setProfileError(currentProfile ? '' : 'No user profile exists for this account in Firestore.');
      },
      (error) => {
        const message = getFriendlyError(error, 'Unable to load the user profile.');
        setProfile(null);
        setProfileLoading(false);
        setProjectsLoading(false);
        setProfileError(message);
        pushToast('error', 'Profile unavailable', message);
      },
    );

    return () => unsubscribe();
  }, [currentUser.uid]);

  useEffect(() => {
    if (!profile) {
      return undefined;
    }

    const projectsQuery =
      profile.role === 'Project Manager'
        ? query(collection(db, 'projects'))
        : query(collection(db, 'projects'), where('memberIds', 'array-contains', profile.id));

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const nextProjects = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        setProjects(nextProjects);
        setProjectsLoading(false);

        if (nextProjects.length && !nextProjects.some((project) => project.id === activeProjectId)) {
          setActiveProjectId(nextProjects[0].id);
        }

        if (!nextProjects.length) {
          setActiveProjectId(null);
          setActiveIssueId(null);
          setIssues([]);
        }
      },
      (error) => {
        const message = getFriendlyError(error, 'Unable to load projects.');
        setProjects([]);
        setProjectsLoading(false);
        setActionError(message);
        pushToast('error', 'Projects unavailable', message);
      },
    );

    return () => unsubscribe();
  }, [activeProjectId, profile]);

  useEffect(() => {
    if (!activeProjectId) {
      return undefined;
    }

    const issuesQuery = query(collection(db, 'issues'), where('projectId', '==', activeProjectId));

    const unsubscribe = onSnapshot(
      issuesQuery,
      (snapshot) => {
        const nextIssues = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        setIssues(nextIssues);
        if (nextIssues.length && !nextIssues.some((issue) => issue.id === activeIssueId)) {
          setActiveIssueId(nextIssues[0].id);
        }
        if (!nextIssues.length) {
          setActiveIssueId(null);
          setComments([]);
        }
      },
      (error) => {
        const message = getFriendlyError(error, 'Unable to load issues.');
        setIssues([]);
        setActionError(message);
        pushToast('error', 'Issues unavailable', message);
      },
    );

    return () => unsubscribe();
  }, [activeIssueId, activeProjectId]);

  useEffect(() => {
    if (!activeIssueId || !activeProjectId) {
      return undefined;
    }

    const commentsQuery = query(collection(db, 'comments'), where('issueId', '==', activeIssueId));

    const unsubscribe = onSnapshot(
      commentsQuery,
      (snapshot) => {
        setComments(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
      },
      (error) => {
        const message = getFriendlyError(error, 'Unable to load comments.');
        setComments([]);
        setActionError(message);
        pushToast('error', 'Comments unavailable', message);
      },
    );

    return () => unsubscribe();
  }, [activeIssueId, activeProjectId]);

  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) {
      return projects;
    }

    const queryText = searchTerm.toLowerCase();
    return projects.filter((project) =>
      [project.key, project.name, project.description, project.team, project.visibility]
        .join(' ')
        .toLowerCase()
        .includes(queryText),
    );
  }, [projects, searchTerm]);

  const activeProject = filteredProjects.find((project) => project.id === activeProjectId) ?? filteredProjects[0] ?? null;
  const isAdmin = profile?.role === 'Admin' || profile?.role === 'Project Manager';
  const projectMembers = useMemo(
    () => users.filter((user) => activeProject?.memberIds?.includes(user.id) && user.role === 'Employee'),
    [activeProject?.memberIds, users],
  );

  const projectIssues = useMemo(
    () =>
      [...issues]
        .map((issue) => ({
          ...issue,
          dragDisabled: !isAdmin && issue.assigneeId !== profile?.id,
        }))
        .sort((left, right) => {
          const leftValue = left.createdAt?.seconds ?? 0;
          const rightValue = right.createdAt?.seconds ?? 0;
          return rightValue - leftValue;
        }),
    [isAdmin, issues, profile?.id],
  );
  const activeIssue = projectIssues.find((issue) => issue.id === activeIssueId) ?? projectIssues[0] ?? null;

  const handleCreateProject = async (projectData) => {
    if (!profile || !isAdmin) {
      return;
    }

    setActionError('');

    try {
      await addDoc(collection(db, 'projects'), {
        ...projectData,
        ownerId: profile.id,
        memberIds: [...new Set([profile.id, ...(projectData.memberIds ?? [])])],
        companyName: projectData.companyName?.trim() || profile.companyName || 'Sprintforge',
        division: projectData.division || projectData.team || profile.division || profile.team || 'Platform',
        team: projectData.division || projectData.team || profile.division || profile.team || 'Platform',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      pushToast('success', 'Project created', `${projectData.name} is now in your workspace.`);
    } catch (error) {
      const message = getFriendlyError(error, 'Unable to create project.');
      setActionError(message);
      pushToast('error', 'Project not created', message);
      throw error;
    }
  };

  const handleDeleteProject = async (project) => {
    if (!isAdmin) {
      return;
    }

    setActionError('');

    try {
      const projectIssuesSnapshot = await getDocs(query(collection(db, 'issues'), where('projectId', '==', project.id)));
      const batch = writeBatch(db);

      projectIssuesSnapshot.forEach((entry) => {
        batch.delete(entry.ref);
      });

      batch.delete(doc(db, 'projects', project.id));
      await batch.commit();
      pushToast('success', 'Project deleted', `${project.name} and its issues were removed.`);

      if (activeProjectId === project.id) {
        setActiveProjectId(null);
      }
    } catch (error) {
      const message = getFriendlyError(error, 'Unable to delete project.');
      setActionError(message);
      pushToast('error', 'Delete failed', message);
    }
  };

  const handleCreateIssue = async (issueData) => {
    if (!profile || !activeProject || !isAdmin) {
      return;
    }

    setActionError('');

    try {
      await addDoc(collection(db, 'issues'), {
        ...issueData,
        code: `${activeProject.key}-${Date.now().toString().slice(-4)}`,
        projectId: activeProject.id,
        projectKey: activeProject.key,
        createdBy: profile.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      pushToast('success', 'Issue created', `${issueData.title} was added to ${activeProject.name}.`);
    } catch (error) {
      const message = getFriendlyError(error, 'Unable to create issue.');
      setActionError(message);
      pushToast('error', 'Issue not created', message);
      throw error;
    }
  };

  const handleMoveIssue = async (issue, nextStatus) => {
    setActionError('');

    try {
      if (!isAdmin && issue.assigneeId !== profile?.id) {
        throw new Error('Members can only manage issues assigned to them.');
      }

      await updateDoc(doc(db, 'issues', issue.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
      pushToast('success', 'Issue updated', `${issue.title} moved to ${nextStatus}.`);
    } catch (error) {
      const message = getFriendlyError(error, 'Unable to update issue status.');
      setActionError(message);
      pushToast('error', 'Update failed', message);
    }
  };

  const handleSubmitComment = async (body) => {
    if (!profile || !activeProject || !activeIssue) {
      return;
    }

    setActionError('');

    try {
      await addDoc(collection(db, 'comments'), {
        issueId: activeIssue.id,
        projectId: activeProject.id,
        authorId: profile.id,
        authorName: profile.name,
        body,
        createdAt: serverTimestamp(),
      });
      pushToast('success', 'Comment posted', 'Your update is now visible to the team.');
    } catch (error) {
      const message = getFriendlyError(error, 'Unable to send comment.');
      setActionError(message);
      pushToast('error', 'Comment failed', message);
      throw error;
    }
  };

  const handleSeedProjects = async () => {
    if (!profile || !isAdmin) {
      return;
    }

    setActionError('');

    try {
      await Promise.all(
        dashboardSeedProjects.map((project) =>
          addDoc(collection(db, 'projects'), {
            ...project,
            ownerId: profile.id,
            memberIds: [profile.id],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }),
        ),
      );
      pushToast('success', 'Sample projects added', 'The workspace has been populated with starter projects.');
    } catch (error) {
      const message = getFriendlyError(error, 'Unable to seed projects.');
      setActionError(message);
      pushToast('error', 'Seed failed', message);
    }
  };

  const handleCompleteProfile = async ({ name, role, team, division, companyName }) => {
    setProfileSetupLoading(true);
    setProfileSetupError('');

    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        name: name.trim(),
        email: currentUser.email?.trim().toLowerCase() ?? '',
        role,
        team: division || team || 'Platform',
        division: division || team || 'Platform',
        companyName: companyName?.trim() || 'Sprintforge',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      pushToast('success', 'Profile created', 'Your workspace profile is ready.');
    } catch (error) {
      const message = getFriendlyError(error, 'Unable to create your profile.');
      setProfileSetupError(message);
      pushToast('error', 'Profile setup failed', message);
    } finally {
      setProfileSetupLoading(false);
    }
  };

  const handleToggleProjectMember = async (userId, shouldAdd) => {
    if (!activeProject || !isAdmin) {
      return;
    }

    setMemberUpdateLoading(true);
    setActionError('');

    try {
      const nextMemberIds = shouldAdd
        ? [...new Set([...(activeProject.memberIds ?? []), userId])]
        : (activeProject.memberIds ?? []).filter((memberId) => memberId !== userId);

      await updateDoc(doc(db, 'projects', activeProject.id), {
        memberIds: [...new Set([profile.id, ...nextMemberIds])],
        updatedAt: serverTimestamp(),
      });

      pushToast(
        'success',
        'Project members updated',
        shouldAdd ? 'Teammate can now receive tasks in this project.' : 'Teammate access was removed from this project.',
      );
    } catch (error) {
      const message = getFriendlyError(error, 'Unable to update project members.');
      setActionError(message);
      pushToast('error', 'Member update failed', message);
    } finally {
      setMemberUpdateLoading(false);
    }
  };

  if (profileLoading || projectsLoading) {
    return (
      <>
        <DashboardSkeleton />
        <ToastViewport toasts={toasts} />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <ProfileSetup
          email={currentUser.email ?? ''}
          initialName={currentUser.displayName || currentUser.email?.split('@')[0] || ''}
          onSubmit={handleCompleteProfile}
          loading={profileSetupLoading}
          error={profileSetupError || profileError}
        />
        <ToastViewport toasts={toasts} />
      </>
    );
  }

  return (
    <>
      <div className="grid min-h-screen bg-gray-950 lg:grid-cols-[280px_1fr]">
        <ProjectsSidebar
          currentUser={profile}
          projects={filteredProjects}
          activeProjectId={activeProject?.id ?? null}
          onSelectProject={setActiveProjectId}
          onCreateProject={() => setIsCreateOpen(true)}
          onSignOut={logout}
          canManageProjects={isAdmin}
        />

        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="mx-auto max-w-7xl rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-2xl shadow-black/20"
          >
          <div className="flex flex-col gap-4 border-b border-gray-800 pb-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Workspace</p>
                <h1 className="mt-1 text-xl font-semibold text-white">
                  {activeProject?.name || 'Project dashboard'}
                </h1>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Minimal project view for switching projects, assigning work, and moving tasks quickly.
                </p>
              </div>
              {activeProject ? (
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-gray-800 bg-gray-950 px-2.5 py-1 text-xs text-gray-300">
                    {activeProject.key}
                  </span>
                  <span className="rounded-full border border-gray-800 bg-gray-950 px-2.5 py-1 text-xs text-gray-300">
                    {activeProject.division || activeProject.team || 'Platform'}
                  </span>
                  <span className="rounded-full border border-gray-800 bg-gray-950 px-2.5 py-1 text-xs text-gray-300">
                    {activeProject.visibility || 'Private'}
                  </span>
                  <span className="rounded-full border border-gray-800 bg-gray-950 px-2.5 py-1 text-xs text-gray-300">
                    {projectIssues.length} issues
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search projects"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pl-10 pr-3 text-sm text-white outline-none transition hover:border-gray-600 focus:ring-2 focus:ring-blue-500 sm:w-64"
                />
              </label>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={handleSeedProjects}
                  className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-gray-600 hover:bg-gray-700"
                >
                  Seed projects
                </button>
              ) : null}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {actionError ? (
              <motion.div
                key={actionError}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
              >
                {actionError}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
            <div className="space-y-5">
              <DashboardOverview activeProject={activeProject} issues={projectIssues} users={projectMembers} />
              <ProjectGrid
                projects={filteredProjects}
                activeProjectId={activeProject?.id ?? null}
                onSelectProject={setActiveProjectId}
                onCreateProject={() => setIsCreateOpen(true)}
                onDeleteProject={handleDeleteProject}
                canManageProjects={isAdmin}
              />
              <IssueList
                issues={projectIssues}
                users={users}
                activeProject={activeProject}
                onCreateIssue={() => setIsCreateIssueOpen(true)}
                onMoveIssue={handleMoveIssue}
                canCreateIssue={isAdmin}
                activeIssueId={activeIssue?.id ?? null}
                onSelectIssue={setActiveIssueId}
              />
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Project details</p>
                {activeProject ? (
                  <>
                    <h2 className="mt-1 text-lg font-semibold text-white">{activeProject.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {activeProject.description || 'No description yet for this project workspace.'}
                    </p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl border border-gray-800 bg-gray-950 p-3">
                        <div className="mb-2 flex items-center gap-2 text-blue-300">
                          <Layers3 size={16} />
                          <span className="text-xs font-semibold uppercase tracking-[0.12em]">Key</span>
                        </div>
                        <p className="text-sm font-semibold text-white">{activeProject.key}</p>
                      </div>
                      <div className="rounded-xl border border-gray-800 bg-gray-950 p-3">
                        <div className="mb-2 flex items-center gap-2 text-emerald-300">
                          <Folders size={16} />
                          <span className="text-xs font-semibold uppercase tracking-[0.12em]">Status</span>
                        </div>
                        <p className="text-sm font-semibold text-white">{activeProject.status || 'Active'}</p>
                      </div>
                      <div className="rounded-xl border border-gray-800 bg-gray-950 p-3">
                        <div className="mb-2 flex items-center gap-2 text-cyan-300">
                          <Users2 size={16} />
                          <span className="text-xs font-semibold uppercase tracking-[0.12em]">Visibility</span>
                        </div>
                        <p className="text-sm font-semibold text-white">{activeProject.visibility || 'Private'}</p>
                      </div>
                      <div className="rounded-xl border border-gray-800 bg-gray-950 p-3">
                        <div className="mb-2 flex items-center gap-2 text-cyan-300">
                          <Building2 size={16} />
                          <span className="text-xs font-semibold uppercase tracking-[0.12em]">Division</span>
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {activeProject.division || activeProject.team || 'Platform'}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                          {activeProject.companyName || 'Sprintforge'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-800 bg-gray-950 p-3 sm:col-span-2">
                        <div className="mb-2 flex items-center gap-2 text-fuchsia-300">
                          <Layers3 size={16} />
                          <span className="text-xs font-semibold uppercase tracking-[0.12em]">Issues</span>
                        </div>
                        <p className="text-sm font-semibold text-white">{projectIssues.length}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">Select a project from the sidebar or create a new one.</p>
                )}
              </div>
              <CommentPanel
                activeIssue={activeIssue}
                comments={comments}
                currentUser={profile}
                onSubmitComment={handleSubmitComment}
              />
              <ProjectTeamPanel
                activeProject={activeProject}
                currentUser={profile}
                users={users}
                saving={memberUpdateLoading}
                canManageProjects={isAdmin}
                onToggleMember={handleToggleProjectMember}
              />
            </aside>
          </div>
          </motion.div>
        </main>

        <CreateProjectModal
          key={`${isCreateOpen}-${profile?.id ?? 'guest'}-${projects.length}`}
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreateProject={handleCreateProject}
          users={users}
          currentUser={profile}
        />
        <CreateIssueModal
          isOpen={isCreateIssueOpen}
          onClose={() => setIsCreateIssueOpen(false)}
          onCreateIssue={handleCreateIssue}
          activeProject={activeProject}
          users={users}
        />
      </div>
      <ToastViewport toasts={toasts} />
    </>
  );
}

function App() {
  const { currentUser, authLoading } = useAuth();

  return (
    <ProtectedRoute isAllowed={Boolean(currentUser)} isLoading={authLoading} fallback={<AuthScreen />}>
      <DashboardApp key={currentUser?.uid ?? 'guest'} />
    </ProtectedRoute>
  );
}

export default App;
