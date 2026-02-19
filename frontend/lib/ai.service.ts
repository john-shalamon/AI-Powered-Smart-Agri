const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function submitDiseaseImage(file?: File | null) {
  const url = `${API_BASE}/api/ai/disease-detection`;
  const fd = new FormData();
  if (file) fd.append('image', file);

  const res = await fetch(url, { method: 'POST', body: fd });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to submit image');
  }
  return (await res.json()) as { jobId: string };
}

export async function getJobStatus(jobId: string) {
  const url = `${API_BASE}/api/ai/jobs/${encodeURIComponent(jobId)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to get job status');
  }
  return res.json();
}

export async function getMarketPrices() {
  const url = `${API_BASE}/api/ai/market-prices`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch market prices');
  }
  return await res.json();
}
