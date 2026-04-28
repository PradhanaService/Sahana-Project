import { motion } from 'framer-motion';

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="rounded-[28px] border border-dashed border-white/15 bg-white/4 p-8 text-center"
    >
      {Icon ? (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-cyan-300">
          <Icon size={22} />
        </div>
      ) : null}
      <h3 className="mt-4 font-display text-2xl font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </motion.div>
  );
}

export default EmptyState;
