import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Importaremos los componentes conforme los vayamos creando
import WelcomeScreen from './components/WelcomeScreen';
import PhotoReel from './components/PhotoReel';
import ValentineLetter from './components/ValentineLetter';
import ProposalScreen from './components/ProposalScreen';

export default function App() {
  // Estado para controlar el flujo: 1 = Bienvenida, 2 = Carrete, 3 = Carta
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => prev + 1);

  return (
    <div className="relative w-full min-h-screen bg-rose-50 font-body">
      {/* AnimatePresence permite animar componentes cuando se desmontan (salen del DOM) */}
      <AnimatePresence mode="wait">
        
        {currentStep === 1 && (
          <WelcomeScreen key="welcome" onNext={nextStep} />
        )}

        {/* ¡Paso 2 activado! */}
        {currentStep === 2 && (
          <PhotoReel key="reel" onNext={nextStep} />
        )}

        {currentStep === 3 && (
          <ValentineLetter key="letter" onNext={nextStep}/>
        )} 

        {currentStep === 4 && (
          <ProposalScreen key="proposal" /> 
        )}

      </AnimatePresence>
    </div>
  );
}