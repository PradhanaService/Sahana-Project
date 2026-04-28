function ProtectedRoute({ isAllowed, isLoading, fallback = null, children }) {
  if (isLoading) {
    return <div className="p-6 text-sm text-slate-300">Checking session...</div>;
  }

  if (!isAllowed) {
    return fallback;
  }

  return children;
}

export default ProtectedRoute;
