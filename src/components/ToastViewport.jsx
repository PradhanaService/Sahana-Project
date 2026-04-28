import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, TriangleAlert } from 'lucide-react';

const toastStyles = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-100',
    iconClassName: 'text-emerald-300',
  },
  error: {
    icon: TriangleAlert,
    className: 'border-rose-400/25 bg-rose-500/10 text-rose-100',
    iconClassName: 'text-rose-300',
  },
  info: {
    icon: Info,
    className: 'border-cyan-400/25 bg-cyan-500/10 text-cyan-100',
    iconClassName: 'text-cyan-300',
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
              className={`pointer-events-auto rounded-[24px] border px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl ${style.className}`}
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
