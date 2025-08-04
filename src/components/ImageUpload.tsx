import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage?: File | null;
  onClearImage: () => void;
  isProcessing?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  onClearImage,
  isProcessing = false
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    disabled: isProcessing
  });

  const handleClear = () => {
    setImagePreview(null);
    onClearImage();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {!selectedImage ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-all duration-300 ease-in-out
            ${isDragActive 
              ? 'border-primary bg-primary/5 shadow-primary' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              p-4 rounded-full bg-gradient-primary transition-transform duration-300
              ${isDragActive ? 'scale-110' : 'hover:scale-105'}
            `}>
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {isDragActive ? 'Drop your image here!' : 'Upload Pet Image'}
              </h3>
              <p className="text-muted-foreground">
                Drag & drop an image of your pet, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Supports: PNG, JPG, JPEG, GIF, WebP
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              <span className="font-medium">Selected Image</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={isProcessing}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {imagePreview && (
            <div className="p-4">
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-contain"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium">Analyzing with AI...</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p><strong>File:</strong> {selectedImage.name}</p>
                <p><strong>Size:</strong> {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ImageUpload;