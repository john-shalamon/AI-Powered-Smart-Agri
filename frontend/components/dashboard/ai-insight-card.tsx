'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AIInsight } from '@/lib/types/ai-insights';
import Link from 'next/link';

interface AIInsightCardProps {
  insight: AIInsight;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  const priorityColors: Record<string, string> = {
    low: 'border-blue-200 bg-blue-50/50',
    medium: 'border-yellow-200 bg-yellow-50/50',
    high: 'border-green-200 bg-green-50/50',
  };

  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-2 p-6',
        priorityColors[insight.priority] || priorityColors.medium
      )}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-600 to-green-500 rounded-xl shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-900">{insight.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">AI Confidence</span>
            <span className="font-bold text-green-600">{insight.confidence}%</span>
          </div>
          <Progress value={insight.confidence} className="h-2" />
        </div>

        <div className="bg-white/60 rounded-xl p-4">
          <p className="text-sm font-medium text-slate-700">{insight.recommendation}</p>
        </div>

        {insight.actionButton && (
          <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl">
            <Link href={insight.actionButton.action}>
              {insight.actionButton.label}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
