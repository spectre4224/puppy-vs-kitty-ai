import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PawPrint, Brain, Zap } from 'lucide-react';
import { PetClassificationResult } from '@/services/aiClassifier';

interface ClassificationResultProps {
  result: PetClassificationResult;
}

const ClassificationResult: React.FC<ClassificationResultProps> = ({ result }) => {
  const getPredictionIcon = () => {
    switch (result.prediction) {
      case 'dog':
        return '🐕';
      case 'cat':
        return '🐱';
      default:
        return '🤔';
    }
  };

  const getPredictionColor = () => {
    switch (result.prediction) {
      case 'dog':
        return 'dog';
      case 'cat':
        return 'cat';
      default:
        return 'muted';
    }
  };

  const getPredictionText = () => {
    switch (result.prediction) {
      case 'dog':
        return 'This is a Dog! 🐕';
      case 'cat':
        return 'This is a Cat! 🐱';
      default:
        return 'Uncertain Classification 🤔';
    }
  };

  const getConfidenceColor = () => {
    if (result.confidence >= 70) return 'text-green-600';
    if (result.confidence >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main Result Card */}
      <Card className={`
        relative overflow-hidden border-2 
        ${result.prediction === 'dog' ? 'border-dog shadow-dog' : 
          result.prediction === 'cat' ? 'border-cat shadow-cat' : 
          'border-border'}
        transition-all duration-500 animate-pulse-glow
      `}>
        <div className={`
          absolute inset-0 opacity-10
          ${result.prediction === 'dog' ? 'bg-gradient-dog' : 
            result.prediction === 'cat' ? 'bg-gradient-cat' : 
            'bg-gradient-primary'}
        `} />
        
        <CardHeader className="relative text-center pb-4">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className={`
              p-3 rounded-full text-3xl
              ${result.prediction === 'dog' ? 'bg-gradient-dog' : 
                result.prediction === 'cat' ? 'bg-gradient-cat' : 
                'bg-gradient-primary'}
            `}>
              <span className="text-white">{getPredictionIcon()}</span>
            </div>
            <Brain className="w-6 h-6 text-primary animate-pulse" />
          </div>
          
          <CardTitle className="text-2xl font-bold">
            {getPredictionText()}
          </CardTitle>
          
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">Confidence:</span>
            <span className={`text-xl font-bold ${getConfidenceColor()}`}>
              {result.confidence}%
            </span>
          </div>
          
          <div className="mt-3 w-full max-w-xs mx-auto">
            <Progress 
              value={result.confidence} 
              className="h-3"
            />
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`
              p-4 rounded-lg border-2 text-center transition-all duration-300
              ${result.isDog ? 'border-dog bg-dog/10 shadow-dog' : 'border-border bg-muted/20'}
            `}>
              <div className="text-2xl mb-2">🐕</div>
              <div className="font-semibold">Dog</div>
              <Badge 
                variant={result.isDog ? "default" : "secondary"}
                className={result.isDog ? "bg-dog hover:bg-dog/80" : ""}
              >
                {result.isDog ? 'Detected' : 'Not Detected'}
              </Badge>
            </div>
            
            <div className={`
              p-4 rounded-lg border-2 text-center transition-all duration-300
              ${result.isCat ? 'border-cat bg-cat/10 shadow-cat' : 'border-border bg-muted/20'}
            `}>
              <div className="text-2xl mb-2">🐱</div>
              <div className="font-semibold">Cat</div>
              <Badge 
                variant={result.isCat ? "default" : "secondary"}
                className={result.isCat ? "bg-cat hover:bg-cat/80" : ""}
              >
                {result.isCat ? 'Detected' : 'Not Detected'}
              </Badge>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <PawPrint className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">AI Analysis Details</h4>
            </div>
            
            <div className="space-y-2">
              {result.rawResults.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="capitalize">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-border rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-medium">
                      {item.confidence}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassificationResult;