import { useCallback } from 'react';
import type { Configuration } from '../App';

export const useUrlState = () => {
  const getConfigFromUrl = useCallback((): Partial<Configuration> | null => {
    const params = new URLSearchParams(window.location.search);
    
    try {
      const configName = params.get('config');
      const attributesParam = params.get('attributes');
      const levelsParam = params.get('levels');
      
      if (!attributesParam) return null;
      
      const attributes = JSON.parse(decodeURIComponent(attributesParam));
      const levels = levelsParam ? parseInt(levelsParam) : 4;
      
      return {
        name: configName || 'Custom Configuration',
        attributes,
        levels,
      };
    } catch (error) {
      console.warn('Failed to parse configuration from URL:', error);
      return null;
    }
  }, []);

  const updateUrlWithConfig = useCallback((config: Configuration) => {
    const params = new URLSearchParams();
    
    // Only include essential data in URL to keep it manageable
    params.set('config', encodeURIComponent(config.name));
    params.set('attributes', encodeURIComponent(JSON.stringify(
      config.attributes.map(attr => ({
        name: attr.name,
        value: attr.value
      }))
    )));
    params.set('levels', config.levels.toString());
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, []);

  const generateShareableUrl = useCallback((config: Configuration): string => {
    const params = new URLSearchParams();
    params.set('config', encodeURIComponent(config.name));
    params.set('attributes', encodeURIComponent(JSON.stringify(
      config.attributes.map(attr => ({
        name: attr.name,
        value: attr.value
      }))
    )));
    params.set('levels', config.levels.toString());
    
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, []);

  return {
    getConfigFromUrl,
    updateUrlWithConfig,
    generateShareableUrl,
  };
};