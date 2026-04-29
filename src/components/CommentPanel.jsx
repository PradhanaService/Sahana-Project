import { SendHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

function formatTimestamp(timestamp) {
  if (!timestamp?.seconds) {
    return 'Just now';
  }

  return new Date(timestamp.seconds * 1000).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function CommentPanel({ activeIssue, comments, currentUser, onSubmitComment }) {
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const sortedComments = useMemo(
    () =>
      [...comments].sort((left, right) => {
        const leftValue = left.createdAt?.seconds ?? 0;
        const rightValue = right.createdAt?.seconds ?? 0;
        return leftValue - rightValue;
      }),
    [comments],
  );

  useEffect(() => {
    setDraft('');
    setError('');
    setNotice('');
  }, [activeIssue?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = draft.trim();

    if (!body || !activeIssue) {
      setError(activeIssue ? 'Write a comment before sending.' : 'Select an issue before sending a comment.');
      return;
    }

    setSubmitting(true);
    setError('');
    setNotice('');

    try {
      await onSubmitComment(body);
      setDraft('');
      setNotice('Comment sent.');
    } catch (submitError) {
      setError(submitError?.message || 'Unable to send comment right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <section className="panel p-5">
      <div className="mb-4">
        <p className="eyebrow">Comments</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Issue conversation</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Real-time chat-style thread for the selected issue with author and timestamp.
        </p>
      </div>

      {activeIssue ? (
        <>
          <div className="mb-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{activeIssue.code}</p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">{activeIssue.title}</h3>
          </div>

          <div className="flex max-h-[22rem] flex-col gap-2 overflow-y-auto pr-1">
            {sortedComments.map((comment) => {
              const ownComment = comment.authorId === currentUser.id;

              return (
                <div key={comment.id} className={`flex ${ownComment ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-3 py-2.5 shadow-lg shadow-black/10 ${
                      ownComment ? 'border border-cyan-200 bg-cyan-50 text-slate-900' : 'border border-slate-200 bg-white text-slate-900'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className={`font-mono text-xs font-semibold uppercase tracking-[0.12em] ${ownComment ? 'text-cyan-700' : 'text-slate-500'}`}>
                        {comment.authorName}
                      </span>
                      <span className={`font-mono text-[11px] ${ownComment ? 'text-cyan-700/80' : 'text-slate-500'}`}>
                        {formatTimestamp(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-800">{comment.body}</p>
                  </div>
                </div>
              );
            })}

            {!sortedComments.length ? (
              <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                No comments yet. Start the conversation for this issue.
              </div>
            ) : null}
          </div>

          <form className="mt-4 flex items-end gap-2" onSubmit={handleSubmit}>
            <label className="flex-1">
              <textarea
                rows="2"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a comment..."
                className="field-input min-h-[88px] resize-none"
              />
            </label>
            <button
              type="submit"
              disabled={submitting || !draft.trim()}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-700 text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SendHorizontal size={18} />
            </button>
          </form>
          {error ? (
            <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          {notice ? (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {notice}
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
          Select an issue card on the board to open its comments.
        </div>
      )}
    </section>
  );
}

export default CommentPanel;
