import { SendHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';

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

  const sortedComments = useMemo(
    () =>
      [...comments].sort((left, right) => {
        const leftValue = left.createdAt?.seconds ?? 0;
        const rightValue = right.createdAt?.seconds ?? 0;
        return leftValue - rightValue;
      }),
    [comments],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = draft.trim();

    if (!body || !activeIssue) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmitComment(body);
      setDraft('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Comments</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Issue conversation</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Real-time chat-style thread for the selected issue with author and timestamp.
        </p>
      </div>

      {activeIssue ? (
        <>
          <div className="mb-4 rounded-xl border border-gray-800 bg-gray-950 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{activeIssue.code}</p>
            <h3 className="mt-1 text-base font-semibold text-white">{activeIssue.title}</h3>
          </div>

          <div className="flex max-h-[22rem] flex-col gap-2 overflow-y-auto pr-1">
            {sortedComments.map((comment) => {
              const ownComment = comment.authorId === currentUser.id;

              return (
                <div key={comment.id} className={`flex ${ownComment ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-xl px-3 py-2.5 shadow-lg shadow-black/10 ${
                      ownComment ? 'bg-blue-600 text-white' : 'border border-gray-800 bg-gray-950 text-white'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className={`text-xs font-semibold uppercase tracking-[0.12em] ${ownComment ? 'text-blue-100' : 'text-gray-400'}`}>
                        {comment.authorName}
                      </span>
                      <span className={`text-[11px] ${ownComment ? 'text-blue-100/80' : 'text-gray-500'}`}>
                        {formatTimestamp(comment.createdAt)}
                      </span>
                    </div>
                    <p className={`text-sm leading-6 ${ownComment ? 'text-white' : 'text-gray-200'}`}>{comment.body}</p>
                  </div>
                </div>
              );
            })}

            {!sortedComments.length ? (
              <div className="rounded-xl border border-dashed border-gray-800 bg-gray-950 p-4 text-center text-sm text-gray-500">
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
                placeholder="Write a comment..."
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition hover:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <button
              type="submit"
              disabled={submitting || !draft.trim()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SendHorizontal size={18} />
            </button>
          </form>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-800 bg-gray-950 p-5 text-center text-sm text-gray-500">
          Select an issue card on the board to open its comments.
        </div>
      )}
    </section>
  );
}

export default CommentPanel;
