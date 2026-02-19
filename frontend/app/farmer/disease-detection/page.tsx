'use client';

import { useState, useRef } from 'react';
import { PageTransition } from '@/components/animations/page-transition';
import { useDiseaseDetection } from '@/hooks/useAI';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, AlertTriangle, CheckCircle2, Leaf, Shield, TrendingUp, Eye, Zap, Droplets, Sun, Wind, Brain } from 'lucide-react';
import { mockDiseaseDetections } from '@/lib/mock-data/ai-insights';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              AI Disease Detection
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Advanced AI-powered crop disease identification with instant treatment recommendations and prevention strategies
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-4 text-center">
            <Zap className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-700">95%</p>
            <p className="text-sm text-blue-600">Accuracy Rate</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-4 text-center">
            <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700">24/7</p>
            <p className="text-sm text-green-600">Available</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-4 text-center">
            <Eye className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-700">50+</p>
            <p className="text-sm text-purple-600">Diseases Detected</p>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 p-4 text-center">
            <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-700">85%</p>
            <p className="text-sm text-orange-600">Yield Protection</p>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 backdrop-blur-md border-green-200 shadow-xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Upload Your Crop Image</h2>
              <p className="text-slate-600 max-w-md mx-auto">
                Take a clear, well-lit photo of the affected plant leaves or fruits for the most accurate diagnosis
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div className="space-y-6">
                <div className="border-2 border-dashed border-green-300 rounded-3xl p-8 hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Camera className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Capture or Upload</h3>
                    <p className="text-slate-600 mb-6 text-sm">
                      Choose a high-quality image showing clear symptoms for best results
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Image
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl border-green-300 hover:bg-green-50"
                        size="lg"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <Card className="bg-blue-50/80 border-blue-200 p-6">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Photography Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                      Use good lighting - avoid shadows
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                      Focus on affected areas clearly
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                      Include both healthy and diseased parts
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                      Multiple angles help with accuracy
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Analysis Status */}
              <div className="space-y-6">
                {isLoading && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 p-6">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Zap className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">AI Analysis in Progress</h3>
                      <p className="text-slate-600 mb-4">Our advanced AI is examining your crop image...</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-slate-700">Analyzing image quality</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <span className="text-sm text-slate-700">Identifying plant species</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                          <span className="text-sm text-slate-700">Detecting diseases & pests</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                          <span className="text-sm text-slate-700">Generating recommendations</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {!result && !isLoading && (
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Leaf className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Ready for Analysis</h3>
                      <p className="text-slate-600 mb-4">Upload an image or try our sample analysis</p>
                      <Button
                        onClick={handleAnalyze}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl"
                        size="lg"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Analyze Sample Image
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Results Section */}
        {result && !isLoading && (
          <div className="space-y-6">
            {/* Disease Alert Header */}
            <Card className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 border-red-300 shadow-xl overflow-hidden">
              <div className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{result.detectedDisease}</h2>
                      <p className="text-white/90">Detected in {result.cropName || 'Unknown Plant'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{result.confidence}%</div>
                    <div className="text-sm text-white/80">Confidence</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Detailed Analysis Tabs */}
            <Card className="bg-white/90 backdrop-blur-md border-green-200 shadow-xl">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-green-50">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="symptoms" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                    Symptoms
                  </TabsTrigger>
                  <TabsTrigger value="treatment" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                    Treatment
                  </TabsTrigger>
                  <TabsTrigger value="prevention" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                    Prevention
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                    Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-6 space-y-6">
                  {/* Plant Identification & Severity */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-600 rounded-lg">
                          <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Plant Identification</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700">Plant Species:</span>
                          <Badge className="bg-green-100 text-green-800">{result.cropName || 'Unknown'}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700">Disease Type:</span>
                          <Badge className="bg-red-100 text-red-800">{result.detectedDisease}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700">Detection Time:</span>
                          <span className="text-sm text-slate-600">Instant</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-600 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Disease Severity</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <Badge
                            className={`text-lg px-4 py-2 ${
                              result.severity === 'high'
                                ? 'bg-red-100 text-red-700 border-red-300'
                                : result.severity === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                  : 'bg-blue-100 text-blue-700 border-blue-300'
                            }`}
                          >
                            {result.severity.toUpperCase()} SEVERITY
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-700">Confidence Level</span>
                            <span className="font-bold text-slate-900">{result.confidence}%</span>
                          </div>
                          <Progress value={result.confidence} className="h-3" />
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Yield Impact Visualization */}
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-yellow-600 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Yield Impact Analysis</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-red-100 rounded-xl border border-red-200">
                        <div className="text-3xl font-bold text-red-700 mb-2">{result.yieldImpact?.withoutTreatment || 0}%</div>
                        <div className="text-sm text-red-600 font-medium">Without Treatment</div>
                        <div className="text-xs text-red-500 mt-1">Potential Loss</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-100 rounded-xl border border-yellow-200">
                        <div className="text-3xl font-bold text-yellow-700 mb-2">{result.yieldImpact?.current || 0}%</div>
                        <div className="text-sm text-yellow-600 font-medium">Current Impact</div>
                        <div className="text-xs text-yellow-500 mt-1">Active Loss</div>
                      </div>
                      <div className="text-center p-4 bg-green-100 rounded-xl border border-green-200">
                        <div className="text-3xl font-bold text-green-700 mb-2">{result.yieldImpact?.withTreatment || 0}%</div>
                        <div className="text-sm text-green-600 font-medium">With Treatment</div>
                        <div className="text-xs text-green-500 mt-1">Recoverable</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Insight:</strong> Early treatment can reduce yield loss from {result.yieldImpact?.withoutTreatment || 0}% to just {result.yieldImpact?.withTreatment || 0}%
                      </p>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="symptoms" className="p-6">
                  <Card className="border-green-200">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-600 rounded-lg">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Disease Symptoms</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-slate-900 mb-4">Visual Indicators</h4>
                          <ul className="space-y-3">
                            {result.symptoms?.map((symptom, idx) => (
                              <li key={idx} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                                <span className="text-slate-700">{symptom}</span>
                              </li>
                            )) || []}
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-bold text-blue-900 mb-2">🔍 Detection Notes</h4>
                            <p className="text-sm text-blue-800">
                              Our AI analyzes multiple factors including color changes, texture variations,
                              and pattern recognition to identify this disease with {result.confidence}% confidence.
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-bold text-green-900 mb-2">📸 Image Quality</h4>
                            <p className="text-sm text-green-800">
                              Clear, well-lit images with visible symptoms improve detection accuracy.
                              Multiple angles and close-ups help our AI provide better analysis.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="treatment" className="p-6">
                  <div className="space-y-6">
                    {/* Chemical Treatment */}
                    <Card className="border-blue-200">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">Chemical Treatment Options</h3>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <ul className="space-y-2">
                            {result.treatment?.chemical?.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-blue-800">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                                <span>{item}</span>
                              </li>
                            )) || []}
                          </ul>
                        </div>
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800">
                            <strong>⚠️ Safety Note:</strong> Always follow label instructions and wear protective gear when applying chemicals.
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Organic Treatment */}
                    <Card className="border-green-200">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-600 rounded-lg">
                            <Leaf className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">Organic & Natural Treatments</h3>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <ul className="space-y-2">
                            {result.treatment?.organic?.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-green-800">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                                <span>{item}</span>
                              </li>
                            )) || []}
                          </ul>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-800">
                            <strong>🌱 Eco-Friendly:</strong> These methods are safe for the environment and beneficial insects.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="prevention" className="p-6">
                  <Card className="border-purple-200">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-600 rounded-lg">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Prevention Strategies</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-slate-900 mb-4">🛡️ Preventive Measures</h4>
                          <ul className="space-y-3">
                            {result.treatment?.preventive?.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                                <span className="text-purple-800">{item}</span>
                              </li>
                            )) || []}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                              <Droplets className="w-4 h-4" />
                              Water Management
                            </h4>
                            <p className="text-sm text-blue-800">
                              Proper irrigation prevents many fungal diseases. Avoid overhead watering and ensure good drainage.
                            </p>
                          </div>

                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                              <Sun className="w-4 h-4" />
                              Plant Care
                            </h4>
                            <p className="text-sm text-orange-800">
                              Healthy plants resist diseases better. Ensure proper nutrition, spacing, and pruning.
                            </p>
                          </div>

                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                              <Wind className="w-4 h-4" />
                              Monitoring
                            </h4>
                            <p className="text-sm text-green-800">
                              Regular field inspections help catch problems early. Remove and destroy infected plant material.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="insights" className="p-6">
                  <div className="space-y-6">
                    {/* Disease Characteristics */}
                    <Card className="border-indigo-200">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-indigo-600 rounded-lg">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">Disease Characteristics</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                              <h4 className="font-bold text-indigo-900 mb-2">🌡️ Optimal Conditions</h4>
                              <p className="text-sm text-indigo-800">
                                {result.additionalInfo?.optimalConditions || 'Cool, humid conditions with temperatures between 60-75°F'}
                              </p>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                              <h4 className="font-bold text-purple-900 mb-2">⏰ Incubation Period</h4>
                              <p className="text-sm text-purple-800">
                                {result.additionalInfo?.incubationPeriod || '5-16 days from infection to visible symptoms'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                              <h4 className="font-bold text-orange-900 mb-2">💰 Economic Impact</h4>
                              <p className="text-sm text-orange-800">
                                {result.additionalInfo?.economicImpact || 'Can cause significant crop losses in severe cases'}
                              </p>
                            </div>

                            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                              <h4 className="font-bold text-red-900 mb-2">🌬️ Spread Mechanism</h4>
                              <p className="text-sm text-red-800">
                                {result.additionalInfo?.spread || 'Spreads through spores via wind, water, and infected tools'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Recommended Actions */}
                    <Card className="border-green-200">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-green-600 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">Recommended Actions</h3>
                        </div>

                        <div className="space-y-3">
                          {result.additionalInfo?.recommendedActions?.map((action, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center mt-0.5">
                                <span className="text-white text-xs font-bold">{idx + 1}</span>
                              </div>
                              <span className="text-green-800">{action}</span>
                            </div>
                          )) || [
                            'Isolate infected plants immediately to prevent spread',
                            'Increase monitoring frequency during favorable weather conditions',
                            'Consider protective fungicide programs for high-risk areas',
                            'Harvest fruits before symptoms appear if detected early'
                          ].map((action, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center mt-0.5">
                                <span className="text-white text-xs font-bold">{idx + 1}</span>
                              </div>
                              <span className="text-green-800">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    {/* AI Insights */}
                    <Card className="border-blue-200">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">AI Analysis Insights</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="text-2xl font-bold text-blue-700 mb-2">95%</div>
                            <div className="text-sm text-blue-600">Pattern Recognition</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="text-2xl font-bold text-green-700 mb-2">50+</div>
                            <div className="text-sm text-green-600">Disease Database</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="text-2xl font-bold text-purple-700 mb-2">&lt;2s</div>
                            <div className="text-sm text-purple-600">Analysis Time</div>
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                          <h4 className="font-bold text-slate-900 mb-2">🤖 AI-Powered Detection</h4>
                          <p className="text-sm text-slate-700">
                            Our advanced AI analyzes multiple factors including color variations, texture changes,
                            pattern recognition, and compares against a comprehensive database of crop diseases.
                            The {result.confidence}% confidence level is based on pattern matching and symptom correlation.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="p-6 border-t border-green-100 bg-green-50/50">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => reset()}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg"
                    size="lg"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Analyze Another Image
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl border-green-300 hover:bg-green-50"
                    size="lg"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Save to History
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Recent Detections & History */}
        {!result && (
          <div className="space-y-6">
            {/* Disease History */}
            <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-600 rounded-lg">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Detection History</h2>
                </div>

                <div className="grid gap-4">
                  {mockDiseaseDetections.map((detection) => (
                    <Card key={detection.id} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={detection.imageUrl}
                              alt={detection.cropName}
                              className="w-16 h-16 rounded-xl object-cover border-2 border-green-200"
                            />
                            <div>
                              <h3 className="font-bold text-slate-900">{detection.detectedDisease}</h3>
                              <p className="text-sm text-slate-600">{detection.cropName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={`mb-2 ${
                                detection.severity === 'high'
                                  ? 'bg-red-100 text-red-700'
                                  : detection.severity === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {detection.severity.toUpperCase()}
                            </Badge>
                            <div className="text-xs text-slate-500">
                              {detection.confidence}% confidence
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>Detected {detection.detectedAt.toLocaleDateString()}</span>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {detection.yieldImpact.current}% impact
                            </span>
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>

            {/* Common Diseases Reference */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Common Diseases Guide</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Late Blight', crop: 'Tomato/Potato', color: 'red' },
                    { name: 'Leaf Rust', crop: 'Wheat', color: 'orange' },
                    { name: 'Powdery Mildew', crop: 'Cucumber', color: 'purple' },
                    { name: 'Bacterial Blight', crop: 'Rice', color: 'blue' },
                    { name: 'Fusarium Wilt', crop: 'Banana', color: 'green' },
                    { name: 'Anthracnose', crop: 'Mango', color: 'yellow' },
                  ].map((disease, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                      <div className={`w-3 h-3 rounded-full bg-${disease.color}-500 mb-2`}></div>
                      <h3 className="font-bold text-slate-900 text-sm">{disease.name}</h3>
                      <p className="text-xs text-slate-600">{disease.crop}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Pro Tip:</strong> Early detection is key to preventing crop loss.
                    Regular monitoring and quick action can save up to 85% of your yield.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
