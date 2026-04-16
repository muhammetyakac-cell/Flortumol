import { useEffect, useState } from 'react';

export function useInboxState(initialReply = '') {
  const [replyDraft, setReplyDraft] = useState(initialReply);

  useEffect(() => {
    setReplyDraft(initialReply || '');
  }, [initialReply]);

  return { replyDraft, setReplyDraft };
}
