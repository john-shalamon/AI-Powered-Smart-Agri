'use client';

import { useRef } from 'react';
import { PageTransition } from '@/components/animations/page-transition';
import { useDiseaseDetection } from '@/hooks/useAI';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { mockDiseaseDetections } from '@/lib/mock-data/ai-insights';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function DiseaseDetectionPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { submitImage, jobId, status, result, isLoading, error, reset } = useDiseaseDetection();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      try {
        await submitImage(file);
      } catch (err) {
        // hook sets error
      }
    }
  };

  const handleAnalyze = async () => {
    try {
      await submitImage(); // submit without file -> backend mock/sample
    } catch (err) {
      // noop
    }
  }; 

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance">Disease Detection</h1>
          <p className="text-slate-600 mt-1">AI-powered crop disease identification and treatment recommendations</p>
        </div>

        {/* Upload Section */}
        <Card className="bg-white/80 backdrop-blur-md border-green-100 p-8">
          <div className="text-center">
            <div className="border-2 border-dashed border-green-200 rounded-2xl p-12 hover:border-green-400 transition-colors">
              <Camera className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Crop Image</h3>
              <p className="text-slate-600 mb-6">
                Take a clear photo of affected leaves or crops for accurate detection
              </p>
              <div className="flex gap-3 justify-center">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-green-600 hover:bg-green-700 rounded-xl">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div> 
            </div>

            {jobId && status && (
              <p className="mt-4 text-sm text-slate-600">
                Job <span className="font-semibold text-slate-800">{jobId.slice(0, 8)}</span> is <span className="font-semibold capitalize">{status}</span>
              </p>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="mt-8 p-6 bg-green-50 rounded-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="font-medium text-slate-900">Analyzing image...</p>
                <p className="text-sm text-slate-600 mt-1">AI is detecting diseases and pests</p>
              </div>
            )} 

            {!result && !isLoading && (
              <Button
                onClick={handleAnalyze}
                className="mt-6 bg-green-600 hover:bg-green-700 rounded-xl"
              >
                Analyze Sample Image
              </Button>
            )} 
          </div>
        </Card>

        {/* Result */}
        {result && !isLoading && (
          <Card className="bg-white/80 backdrop-blur-md border-green-100 overflow-hidden"> 
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-white" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{result.detectedDisease}</h2>
                  <p className="text-white/90">Detected in {result.cropName}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Confidence and Severity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">Detection Confidence</span>
                    <span className="text-sm font-bold text-green-600">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} className="h-2" />
                </div>
                <div className="flex items-center justify-center">
                  <Badge
                    className={
                      result.severity === 'high'
                        ? 'bg-red-100 text-red-700'
                        : result.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                    }
                  >
                    {result.severity.toUpperCase()} Severity
                  </Badge>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Common Symptoms</h3>
                <ul className="space-y-2">
                  {result.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Yield Impact */}
              <div className="bg-yellow-50 rounded-xl p-4">
                <h3 className="font-bold text-slate-900 mb-3">Yield Impact</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{result.yieldImpact.current}%</p>
                    <p className="text-xs text-slate-600">Current Loss</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{result.yieldImpact.withTreatment}%</p>
                    <p className="text-xs text-slate-600">With Treatment</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{result.yieldImpact.withoutTreatment}%</p>
                    <p className="text-xs text-slate-600">Without Treatment</p>
                  </div>
                </div>
              </div>

              {/* Treatment */}
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Treatment Recommendations</h3>

                <div className="space-y-4">
                  {/* Chemical Treatment */}
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-slate-900">Chemical Treatment</h4>
                    </div>
                    <ul className="space-y-1 ml-7">
                      {result.treatment.chemical.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-700">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Organic Treatment */}
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-slate-900">Organic Treatment</h4>
                    </div>
                    <ul className="space-y-1 ml-7">
                      {result.treatment.organic.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-700">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Preventive Measures */}
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-slate-900">Preventive Measures</h4>
                    </div>
                    <ul className="space-y-1 ml-7">
                      {result.treatment.preventive.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => reset()}
                className="w-full bg-green-600 hover:bg-green-700 rounded-xl"
              >
                Analyze Another Image
              </Button>
            </div>
          </Card>
        )}

        {/* Recent Detections */}
        {!result && (
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Detections</h2>
            <div className="space-y-3">
              {mockDiseaseDetections.map((detection) => (
                <div
                  key={detection.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={detection.imageUrl}
                      alt={detection.cropName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-slate-900">{detection.detectedDisease}</p>
                      <p className="text-sm text-slate-600">{detection.cropName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        detection.severity === 'high'
                          ? 'bg-red-100 text-red-700'
                          : detection.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                      }
                    >
                      {detection.severity}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">{detection.confidence}% confidence</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}
