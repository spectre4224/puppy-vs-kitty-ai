import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js for optimal performance
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface ClassificationResult {
  label: string;
  score: number;
  confidence: number;
}

export interface PetClassificationResult {
  isDog: boolean;
  isCat: boolean;
  confidence: number;
  rawResults: ClassificationResult[];
  prediction: 'dog' | 'cat' | 'uncertain';
}

const MAX_IMAGE_DIMENSION = 512;

class AIClassifierService {
  private classifier: any = null;
  private isLoading = false;

  private resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
    let width = image.naturalWidth;
    let height = image.naturalHeight;

    if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
      if (width > height) {
        height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
        width = MAX_IMAGE_DIMENSION;
      } else {
        width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
        height = MAX_IMAGE_DIMENSION;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return { width, height };
  }

  private async initializeClassifier() {
    if (this.classifier || this.isLoading) {
      return;
    }

    this.isLoading = true;
    try {
      console.log('Initializing AI image classifier...');
      this.classifier = await pipeline(
        'image-classification',
        'microsoft/resnet-50',
        { 
          device: 'webgpu',
          dtype: 'fp32',
        }
      );
      console.log('AI classifier initialized successfully');
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      this.classifier = await pipeline(
        'image-classification',
        'microsoft/resnet-50',
        { device: 'cpu' }
      );
    } finally {
      this.isLoading = false;
    }
  }

  async classifyImage(imageFile: File): Promise<PetClassificationResult> {
    await this.initializeClassifier();

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          // Prepare image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get canvas context');

          this.resizeImageIfNeeded(canvas, ctx, img);
          
          // Get image data
          const imageData = canvas.toDataURL('image/jpeg', 0.9);
          
          console.log('Running AI classification...');
          const results = await this.classifier(imageData);
          console.log('Raw classification results:', results);
          
          // Process results to determine dog vs cat
          const processedResult = this.processPetClassification(results);
          resolve(processedResult);
          
        } catch (error) {
          console.error('Error during classification:', error);
          reject(error);
        } finally {
          URL.revokeObjectURL(img.src);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }

  private processPetClassification(results: any[]): PetClassificationResult {
    // Keywords that indicate dogs or cats in ImageNet labels
    const dogKeywords = [
      'dog', 'puppy', 'retriever', 'beagle', 'bulldog', 'terrier', 
      'spaniel', 'poodle', 'chihuahua', 'collie', 'shepherd', 'husky',
      'labrador', 'mastiff', 'boxer', 'dachshund', 'corgi', 'pointer',
      'setter', 'hound', 'schnauzer', 'rottweiler', 'doberman'
    ];
    
    const catKeywords = [
      'cat', 'kitten', 'tabby', 'persian', 'siamese', 'egyptian',
      'tiger cat', 'lynx', 'manx', 'maine coon'
    ];

    let maxDogScore = 0;
    let maxCatScore = 0;
    const processedResults: ClassificationResult[] = [];

    // Analyze all results
    for (const result of results) {
      const label = result.label.toLowerCase();
      const score = result.score;
      
      processedResults.push({
        label: result.label,
        score,
        confidence: Math.round(score * 100)
      });

      // Check for dog matches
      for (const keyword of dogKeywords) {
        if (label.includes(keyword)) {
          maxDogScore = Math.max(maxDogScore, score);
          break;
        }
      }

      // Check for cat matches
      for (const keyword of catKeywords) {
        if (label.includes(keyword)) {
          maxCatScore = Math.max(maxCatScore, score);
          break;
        }
      }
    }

    // Determine final classification
    const isDog = maxDogScore > maxCatScore && maxDogScore > 0.1;
    const isCat = maxCatScore > maxDogScore && maxCatScore > 0.1;
    const confidence = Math.max(maxDogScore, maxCatScore);
    
    let prediction: 'dog' | 'cat' | 'uncertain';
    if (confidence < 0.1) {
      prediction = 'uncertain';
    } else if (isDog) {
      prediction = 'dog';
    } else if (isCat) {
      prediction = 'cat';
    } else {
      prediction = 'uncertain';
    }

    return {
      isDog,
      isCat,
      confidence: Math.round(confidence * 100),
      rawResults: processedResults.slice(0, 5), // Top 5 results
      prediction
    };
  }
}

export const aiClassifier = new AIClassifierService();