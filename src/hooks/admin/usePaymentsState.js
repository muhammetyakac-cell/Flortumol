import { useEffect, useMemo, useState } from 'react';

export function usePaymentsState(initialSettings) {
  const [draft, setDraft] = useState(initialSettings);

  useEffect(() => {
    setDraft(initialSettings);
  }, [initialSettings]);

  const isDirty = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(initialSettings);
  }, [draft, initialSettings]);

  return { draft, setDraft, isDirty };
}
