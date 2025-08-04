# 🐕🐱 AI Pet Classifier

An intelligent web application that uses advanced deep learning models to classify whether an uploaded image contains a dog or cat. Built with modern web technologies and powered by Hugging Face Transformers running directly in your browser.

## 🚀 Live Application

<!-- Replace this with your actual deployed app URL -->
<!-- [View Live Demo](https://your-app-url-here.com) -->
*Deploy your app and add the live link here*

## ✨ Features

- **🧠 AI-Powered Classification**: Uses Microsoft ResNet-50 neural network for accurate pet detection
- **🖼️ Smart Image Processing**: Automatic image resizing and optimization for optimal AI performance
- **📊 Confidence Scoring**: Detailed analysis with percentage confidence levels
- **🎨 Beautiful UI**: Modern, responsive design with smooth animations and gradients
- **⚡ Real-time Processing**: Fast classification powered by WebGPU acceleration
- **📱 Mobile Friendly**: Fully responsive design that works on all devices
- **🔄 Drag & Drop**: Intuitive file upload with drag and drop support

## 🛠️ Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **AI/ML**: Hugging Face Transformers.js
- **Build Tool**: Vite
- **File Handling**: react-dropzone
- **Notifications**: Sonner toast library
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Modern web browser with WebGPU support (recommended)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd puppy-vs-kitty-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🎯 How It Works

1. **Image Upload**: Users can drag and drop or click to upload pet images
2. **AI Processing**: The image is processed by a ResNet-50 model trained on ImageNet
3. **Classification**: Smart keyword matching determines if the image contains a dog or cat
4. **Results Display**: Beautiful visualization shows the prediction with confidence scores

## 🧠 AI Model Details

- **Model**: Microsoft ResNet-50 (image classification)
- **Performance**: WebGPU acceleration when available, CPU fallback
- **Processing**: Automatic image resizing to 512px for optimal performance
- **Keywords**: Trained recognition of 20+ dog breeds and cat types

## 🎨 Design System

The application features a custom design system with:
- Warm, pet-themed color palette
- Dog-specific orange gradients
- Cat-specific purple gradients
- Smooth animations and hover effects
- Semantic color tokens for consistency

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── ImageUpload.tsx  # File upload component
│   └── ClassificationResult.tsx  # Results display
├── services/            # AI and API services
│   └── aiClassifier.ts  # AI classification logic
├── assets/              # Images and static files
├── pages/               # Route components
└── lib/                 # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Hugging Face for the Transformers.js library
- Microsoft for the ResNet-50 model
- The open-source community for the amazing tools and libraries
