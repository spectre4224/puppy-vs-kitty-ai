import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Brain, Sparkles, Zap, PawPrint, Camera } from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from '@/components/ImageUpload';
import ClassificationResult from '@/components/ClassificationResult';
import { aiClassifier, PetClassificationResult } from '@/services/aiClassifier';
import heroPets from '@/assets/hero-pets.jpg';
import aiBackground from '@/assets/ai-background.jpg';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PetClassificationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setResult(null);
    setShowResult(false);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setResult(null);
    setShowResult(false);
  };

  const handleClassify = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first!');
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setShowResult(false);

    try {
      toast.info('🧠 AI is analyzing your pet...', {
        description: 'This may take a moment while we load the neural network.'
      });
      
      const classificationResult = await aiClassifier.classifyImage(selectedImage);
      setResult(classificationResult);
      setShowResult(true);
      
      const emoji = classificationResult.prediction === 'dog' ? '🐕' : 
                   classificationResult.prediction === 'cat' ? '🐱' : '🤔';
      
      toast.success(`${emoji} Classification complete!`, {
        description: `Detected: ${classificationResult.prediction} with ${classificationResult.confidence}% confidence`
      });
      
    } catch (error) {
      console.error('Classification error:', error);
      toast.error('❌ Classification failed', {
        description: 'Please try again with a different image.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTryAnother = () => {
    setSelectedImage(null);
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div 
        className="absolute inset-0 opacity-5 bg-cover bg-center"
        style={{ backgroundImage: `url(${aiBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-primary/5" />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-full bg-gradient-ai">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-ai bg-clip-text text-transparent">
                AI Pet Classifier
              </h1>
              <div className="p-3 rounded-full bg-gradient-ai">
                <PawPrint className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Upload an image of your pet and let our advanced AI neural network 
              classify whether it's a dog or cat with deep learning precision!
            </p>

            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Deep Learning</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Real-time AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Image Recognition</span>
              </div>
            </div>

            <img 
              src={heroPets} 
              alt="AI Pet Classification" 
              className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl animate-float"
            />
          </div>

          <Separator className="my-12" />

          {/* Main Interface */}
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border-2 border-primary/20 shadow-primary">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                  <Brain className="w-6 h-6 text-primary" />
                  <span>Pet Classification Engine</span>
                </CardTitle>
                <p className="text-muted-foreground">
                  Upload your pet's photo and discover what our AI sees
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  onClearImage={handleClearImage}
                  isProcessing={isProcessing}
                />

                {selectedImage && !showResult && (
                  <div className="text-center">
                    <Button
                      onClick={handleClassify}
                      disabled={isProcessing}
                      size="lg"
                      className={`
                        bg-gradient-primary hover:shadow-primary transition-all duration-300
                        ${isProcessing ? 'animate-pulse' : 'hover:scale-105'}
                      `}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5 mr-2" />
                          Classify Pet with AI
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            {showResult && result && (
              <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                <ClassificationResult result={result} />
                
                <div className="text-center">
                  <Button
                    onClick={handleTryAnother}
                    variant="outline"
                    size="lg"
                    className="hover:bg-primary/10 hover:border-primary"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Try Another Image
                  </Button>
                </div>
              </div>
            )}

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="text-center p-6 hover:shadow-primary transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-dog rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🐕</span>
                </div>
                <h3 className="font-semibold mb-2">Dog Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced neural networks trained on thousands of dog breeds
                </p>
              </Card>

              <Card className="text-center p-6 hover:shadow-cat transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-cat rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🐱</span>
                </div>
                <h3 className="font-semibold mb-2">Cat Recognition</h3>
                <p className="text-sm text-muted-foreground">
                  Precise feline identification with confidence scoring
                </p>
              </Card>

              <Card className="text-center p-6 hover:shadow-glow transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-ai rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">AI Powered</h3>
                <p className="text-sm text-muted-foreground">
                  State-of-the-art deep learning models running in your browser
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
