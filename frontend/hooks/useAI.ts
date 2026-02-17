'use client'

import { useEffect, useRef, useState } from 'react';
import { submitDiseaseImage, getJobStatus } from '@/lib/ai.service';
import type { DiseaseDetection } from '@/lib/types/ai-insights';

type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export function useDiseaseDetection(pollInterval = 1300) {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [result, setResult] = useState<DiseaseDetection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    if (!jobId) return;

    setIsLoading(true);
    setStatus('pending');

    const doPoll = async () => {
      try {
        const res: any = await getJobStatus(jobId);
        setStatus(res.status);

        if (res.status === 'completed') {
          setResult(res.result || null);
          setIsLoading(false);
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        } else if (res.status === 'failed') {
          setError(res.error || 'Job failed');
          setIsLoading(false);
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      } catch (err: any) {
        setError(err?.message || String(err));
        setIsLoading(false);
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }
    };

    // immediate + interval polling
    doPoll();
    pollRef.current = window.setInterval(doPoll, pollInterval);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [jobId, pollInterval]);

  async function submitImage(file?: File | null) {
    setError(null);
    setResult(null);
    setIsLoading(true);
    try {
      const data = await submitDiseaseImage(file ?? undefined);
      setJobId(data.jobId);
      return data.jobId;
    } catch (err: any) {
      setError(err?.message || String(err));
      setIsLoading(false);
      throw err;
    }
  }

  function reset() {
    setJobId(null);
    setStatus(null);
    setResult(null);
    setIsLoading(false);
    setError(null);
  }

  return { submitImage, jobId, status, result, isLoading, error, reset } as const;
}
