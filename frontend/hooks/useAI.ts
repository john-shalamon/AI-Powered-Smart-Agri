'use client'

import { useEffect, useRef, useState } from 'react';
import { submitDiseaseImage, getJobStatus } from '@/lib/ai.service';
import type { DiseaseDetection } from '@/lib/types/ai-insights';

type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

function normalizeDiseaseResult(raw: any): DiseaseDetection {
  const now = new Date();
  return {
    id: String(raw?.id ?? crypto.randomUUID()),
    cropName: String(raw?.cropName ?? 'Crop'),
    imageUrl: String(raw?.imageUrl ?? '/placeholder.svg?height=400&width=400'),
    detectedDisease: String(raw?.detectedDisease ?? 'Unknown Disease'),
    confidence: Number(raw?.confidence ?? 0),
    severity: raw?.severity === 'low' || raw?.severity === 'medium' || raw?.severity === 'high' ? raw.severity : 'medium',
    symptoms: Array.isArray(raw?.symptoms) ? raw.symptoms.map(String) : [],
    treatment: {
      chemical: Array.isArray(raw?.treatment?.chemical) ? raw.treatment.chemical.map(String) : [],
      organic: Array.isArray(raw?.treatment?.organic) ? raw.treatment.organic.map(String) : [],
      preventive: Array.isArray(raw?.treatment?.preventive) ? raw.treatment.preventive.map(String) : [],
    },
    yieldImpact: {
      current: Number(raw?.yieldImpact?.current ?? 0),
      withTreatment: Number(raw?.yieldImpact?.withTreatment ?? 0),
      withoutTreatment: Number(raw?.yieldImpact?.withoutTreatment ?? 0),
    },
    detectedAt: raw?.detectedAt ? new Date(raw.detectedAt) : now,
  };
}

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
          setResult(res.result ? normalizeDiseaseResult(res.result) : null);
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
