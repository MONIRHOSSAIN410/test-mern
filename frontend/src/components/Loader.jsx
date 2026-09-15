// This file existed but was completely empty, which would crash anything
// that imported it.

export const Loader = ({ label = "Loading...", fullScreen = false }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-10">{spinner}</div>;
};

export default Loader;
