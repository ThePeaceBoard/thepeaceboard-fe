// src/hooks/useScreenEffects.ts
import { useEffect, useRef, useState } from 'react';
import { ScreenEffect, EffectData } from '../components/ScreenEffect';

export const useScreenEffects = (defaultEffects: Record<string, EffectData> = {}) => {
  const effectRef = useRef<ScreenEffect | null>(null);
  const [effects, setEffects] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(defaultEffects).map(key => [key, true])
  ));

  const initialize = (element: HTMLElement) => {
    if (!effectRef.current) {
      effectRef.current = new ScreenEffect(element);
      updateEffects();
    }
  };

  const updateEffects = () => {
    if (!effectRef.current) return;
    
    // Remove all effects first
    Object.keys(effects).forEach(effect => {
      effectRef.current?.remove(effect);
    });
    
    // Add enabled effects with their options
    Object.entries(effects).forEach(([effect, enabled]) => {
      if (enabled && defaultEffects[effect]) {
        effectRef.current?.add(effect, defaultEffects[effect]);
      }
    });
  };

  const toggleEffect = (effect: string, enabled: boolean) => {
    setEffects(prev => ({
      ...prev,
      [effect]: enabled
    }));
  };

  useEffect(() => {
    updateEffects();
  }, [effects]);

  useEffect(() => {
    return () => {
      effectRef.current = null;
    };
  }, []);

  return { 
    initialize,
    effects,
    toggleEffect
  };
};