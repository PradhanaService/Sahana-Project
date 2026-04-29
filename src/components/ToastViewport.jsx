import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, TriangleAlert } from 'lucide-react';

const toastStyles = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-200 bg-white text-slate-800',
    iconClassName: 'text-emerald-600',
  },
  error: {
    icon: TriangleAlert,
    className: 'border-rose-200 bg-white text-slate-800',
    iconClassName: 'text-rose-600',
  },
  info: {
    icon: Info,
    className: 'border-cyan-200 bg-white text-slate-800',
    iconClassName: 'text-cyan-600',
  },
};

function ToastViewport({ toasts }) {
  return (
    <div className="pointer-events-none fixed right-5 top-5 z-50 flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] ?? toastStyles.info;
          const Icon = style.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`pointer-events-auto rounded-[24px] border px-4 py-3 shadow-xl shadow-slate-200/70 backdrop-blur-xl ${style.className}`}
            >
              <div className="flex items-start gap-3">
                <Icon size={18} className={`mt-0.5 shrink-0 ${style.iconClassName}`} />
                <div>
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.message ? <p className="mt-1 text-sm/6 opacity-90">{toast.message}</p> : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default ToastViewport;
