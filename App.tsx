import React, { Suspense } from 'react';
import { Scene } from './components/Scene';
import { UI } from './components/UI';

// Fallback loader while 3D scene compiles
const Loader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-black text-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-blue-400 animate-pulse font-mono tracking-widest">INITIALIZING SEO MATRIX...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Fixed UI Layer (Navbar, Chat, Animations) - Sits on top */}
      <UI />
      
      {/* 3D Scene Layer (Canvas + Scrollable Overlay) */}
      <Suspense fallback={<Loader />}>
        <Scene />
      </Suspense>
    </div>
  );
};

export default App;