import type React from 'react';
import { useState } from 'react';
import { type Attribute, type Configuration } from '../App';

interface ConfigurationPanelProps {
  configuration: Configuration;
  presetConfigurations: Configuration[];
  savedConfigurations: Configuration[];
  onConfigurationChange: (config: Configuration) => void;
  onSaveConfiguration: (config: Configuration) => void;
  onDeleteConfiguration: (configName: string) => void;
  generateShareableUrl: (config: Configuration) => string;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  configuration,
  presetConfigurations,
  savedConfigurations,
  onConfigurationChange,
  onSaveConfiguration,
  onDeleteConfiguration,
  generateShareableUrl,
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [saveAsName, setSaveAsName] = useState<string>('');
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [expandedAttributes, setExpandedAttributes] = useState<Set<number>>(new Set());
  const [expandedLevels, setExpandedLevels] = useState<boolean>(false);

  const validateConfiguration = (config: Configuration): string[] => {
    const newErrors: string[] = [];

    if (config.attributes.length < 3) {
      newErrors.push('Minimum 3 attributes required');
    }

    if (config.levels < 1) {
      newErrors.push('Minimum 1 level required');
    }

    const attributeNames = config.attributes.map((attr) => attr.name.trim());
    const uniqueNames = new Set(attributeNames);
    if (uniqueNames.size !== attributeNames.length) {
      newErrors.push('Attribute names must be unique');
    }

    if (attributeNames.some((name) => name === '')) {
      newErrors.push('Attribute names cannot be empty');
    }

    // Validate level descriptions if they exist
    if (config.levelDescriptions && config.levelDescriptions.length > 0) {
      const levelNames = config.levelDescriptions.map((level) => level.name.trim());
      const uniqueLevelNames = new Set(levelNames);
      if (uniqueLevelNames.size !== levelNames.length) {
        newErrors.push('Level names must be unique');
      }

      if (levelNames.some((name) => name === '')) {
        newErrors.push('Level names cannot be empty');
      }
    }

    return newErrors;
  };

  const handleConfigurationNameChange = (name: string) => {
    const newConfig = { ...configuration, name };
    const validationErrors = validateConfiguration(newConfig);
    setErrors(validationErrors);
    onConfigurationChange(newConfig);
  };

  const handleSaveAs = () => {
    if (saveAsName.trim()) {
      const configToSave = { ...configuration, name: saveAsName.trim() };
      onSaveConfiguration(configToSave);
      onConfigurationChange(configToSave);
      setSaveAsName('');
      setShowSaveDialog(false);
    }
  };

  const handleSaveCurrent = () => {
    if (configuration.name) {
      onSaveConfiguration(configuration);
    }
  };

  const isPresetConfiguration = (configName: string): boolean => {
    return [
      'Technical Capability Assessment',
      'Skills Assessment',
      'Product Features',
      'Basic Template',
    ].includes(configName);
  };

  const handleAttributeDescriptionChange = (index: number, description: string) => {
    const newAttributes = [...configuration.attributes];
    newAttributes[index] = { ...newAttributes[index], description };
    const newConfig = { ...configuration, attributes: newAttributes };
    onConfigurationChange(newConfig);
  };

  const handleLevelDescriptionChange = (index: number, description: string) => {
    const newLevelDescriptions = [...(configuration.levelDescriptions || [])];
    if (newLevelDescriptions[index]) {
      newLevelDescriptions[index] = { ...newLevelDescriptions[index], description };
    }
    const newConfig = { ...configuration, levelDescriptions: newLevelDescriptions };
    onConfigurationChange(newConfig);
  };

  const handleLevelNameChange = (index: number, name: string) => {
    const newLevelDescriptions = [...(configuration.levelDescriptions || [])];
    if (newLevelDescriptions[index]) {
      newLevelDescriptions[index] = { ...newLevelDescriptions[index], name };
    }
    const newConfig = { ...configuration, levelDescriptions: newLevelDescriptions };
    onConfigurationChange(newConfig);
  };

  const addLevelDescription = () => {
    const newLevelDescriptions = [...(configuration.levelDescriptions || [])];
    newLevelDescriptions.push({
      name: `Level ${newLevelDescriptions.length + 1}`,
      description: '',
    });
    const newConfig = { ...configuration, levelDescriptions: newLevelDescriptions };
    onConfigurationChange(newConfig);
  };

  const removeLevelDescription = (index: number) => {
    const newLevelDescriptions = [...(configuration.levelDescriptions || [])];
    newLevelDescriptions.splice(index, 1);
    const newConfig = { ...configuration, levelDescriptions: newLevelDescriptions };
    onConfigurationChange(newConfig);
  };

  const toggleAttributeExpansion = (index: number) => {
    const newExpanded = new Set(expandedAttributes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedAttributes(newExpanded);
  };

  const isSavedConfiguration = (configName: string): boolean => {
    return savedConfigurations.some((config) => config.name === configName);
  };

  const handlePresetChange = (presetName: string) => {
    const preset = presetConfigurations.find((p) => p.name === presetName);
    if (preset) {
      onConfigurationChange({ ...preset });
      setErrors([]);
    }
  };

  const handleAttributeNameChange = (index: number, name: string) => {
    const newAttributes = [...configuration.attributes];
    newAttributes[index] = { ...newAttributes[index], name };
    const newConfig = { ...configuration, attributes: newAttributes };
    const validationErrors = validateConfiguration(newConfig);
    setErrors(validationErrors);
    onConfigurationChange(newConfig);
  };

  const handleAttributeValueChange = (index: number, value: number) => {
    const newAttributes = [...configuration.attributes];
    newAttributes[index] = { ...newAttributes[index], value };
    const newConfig = { ...configuration, attributes: newAttributes };
    onConfigurationChange(newConfig);
  };

  const addAttribute = () => {
    const newAttribute: Attribute = {
      name: `Attribute ${configuration.attributes.length + 1}`,
      value: 1,
    };
    const newConfig = {
      ...configuration,
      attributes: [...configuration.attributes, newAttribute],
    };
    const validationErrors = validateConfiguration(newConfig);
    setErrors(validationErrors);
    onConfigurationChange(newConfig);
  };

  const removeAttribute = (index: number) => {
    const newAttributes = configuration.attributes.filter((_, i) => i !== index);
    const newConfig = { ...configuration, attributes: newAttributes };
    const validationErrors = validateConfiguration(newConfig);
    setErrors(validationErrors);
    onConfigurationChange(newConfig);
  };

  const handleLevelsChange = (levels: number) => {
    const newConfig = { ...configuration, levels };
    const validationErrors = validateConfiguration(newConfig);
    setErrors(validationErrors);
    onConfigurationChange(newConfig);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Name */}
      <div className="space-y-2">
        <label htmlFor="config-name" className="block text-sm font-medium text-gray-700">
          Configuration Name
        </label>
        <input
          id="config-name"
          type="text"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radar-500 focus:border-radar-500 sm:text-sm"
          value={configuration.name}
          onChange={(e) => handleConfigurationNameChange(e.target.value)}
          placeholder="Configuration name"
        />
      </div>

      {/* Load Configuration */}
      <div className="space-y-2">
        <label htmlFor="preset-selector" className="block text-sm font-medium text-gray-700">
          Load Configuration
        </label>
        <select
          id="preset-selector"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radar-500 focus:border-radar-500 sm:text-sm"
          value={configuration.name}
          onChange={(e) => handlePresetChange(e.target.value)}
        >
          {presetConfigurations.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name} {isPresetConfiguration(preset.name) ? '(Preset)' : '(Saved)'}
            </option>
          ))}
        </select>
        {isSavedConfiguration(configuration.name) && (
          <button
            className="w-full mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => onDeleteConfiguration(configuration.name)}
          >
            Delete Configuration
          </button>
        )}
      </div>

      {/* Save Configuration */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Save Configuration
        </label>
        <div className="space-y-2">
          <button
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-radar-600 hover:bg-radar-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radar-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSaveCurrent}
            disabled={errors.length > 0}
          >
            Save Current Configuration
          </button>
          <button
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radar-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowSaveDialog(true)}
            disabled={errors.length > 0}
          >
            Save As New Configuration
          </button>
        </div>

        {showSaveDialog && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radar-500 focus:border-radar-500 sm:text-sm"
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              placeholder="Enter new configuration name"
            />
            <div className="mt-3 flex space-x-2">
              <button
                className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-radar-600 hover:bg-radar-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radar-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSaveAs}
                disabled={!saveAsName.trim()}
              >
                Save
              </button>
              <button
                className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radar-500"
                onClick={() => {
                  setShowSaveDialog(false);
                  setSaveAsName('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Share Configuration */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Share Configuration
        </label>
        <button
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radar-500"
          onClick={() => {
            const url = generateShareableUrl(configuration);
            navigator.clipboard.writeText(url).then(() => {
              alert('Shareable URL copied to clipboard!');
            }).catch(() => {
              // Fallback for browsers that don't support clipboard API
              prompt('Copy this URL to share:', url);
            });
          }}
        >
          📋 Copy Shareable Link
        </button>
        <p className="text-xs text-gray-500">
          Share this URL to let others view your radar chart configuration
        </p>
      </div>

      {/* Attributes */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Attributes
        </label>
        <div className="space-y-3">
          {configuration.attributes.map((attribute, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4 bg-white">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radar-500 focus:border-radar-500 sm:text-sm"
                  value={attribute.name}
                  onChange={(e) => handleAttributeNameChange(index, e.target.value)}
                  placeholder="Attribute name"
                />
                <input
                  type="number"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radar-500 focus:border-radar-500 sm:text-sm"
                  value={attribute.value}
                  onChange={(e) => handleAttributeValueChange(index, parseInt(e.target.value) || 0)}
                  min="0"
                  max={configuration.levels}
                />
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600"
                  onClick={() => toggleAttributeExpansion(index)}
                >
                  {expandedAttributes.has(index) ? '▼' : '▶'}
                </button>
                {configuration.attributes.length > 3 && (
                  <button 
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50"
                    onClick={() => removeAttribute(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              {expandedAttributes.has(index) && (
                <div className="mt-3 space-y-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Description:
                  </label>
                  <textarea
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radar-500 focus:border-radar-500 sm:text-sm"
                    value={attribute.description || ''}
                    onChange={(e) => handleAttributeDescriptionChange(index, e.target.value)}
                    placeholder="Enter attribute description..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <button 
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radar-500"
          onClick={addAttribute}
        >
          Add Attribute
        </button>
      </div>

      {/* Levels */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <label className="block text-sm font-medium text-gray-700">
            Levels
          </label>
          <button 
            className="p-1 text-gray-400 hover:text-gray-600"
            onClick={() => setExpandedLevels(!expandedLevels)}
          >
            {expandedLevels ? '▼' : '▶'}
          </button>
        </div>
        <input
          type="number"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radar-500 focus:border-radar-500 sm:text-sm"
          value={configuration.levels}
          onChange={(e) => handleLevelsChange(parseInt(e.target.value) || 1)}
          min="1"
        />
        {expandedLevels && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Level Descriptions:</h4>
            {(configuration.levelDescriptions || []).map((levelDesc, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 bg-white">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radar-500 focus:border-radar-500 sm:text-sm"
                    value={levelDesc.name}
                    onChange={(e) => handleLevelNameChange(index, e.target.value)}
                    placeholder="Level name"
                  />
                  <button 
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50"
                    onClick={() => removeLevelDescription(index)}
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radar-500 focus:border-radar-500 sm:text-sm"
                  value={levelDesc.description}
                  onChange={(e) => handleLevelDescriptionChange(index, e.target.value)}
                  placeholder="Enter level description..."
                  rows={3}
                />
              </div>
            ))}
            <button 
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radar-500"
              onClick={addLevelDescription}
            >
              Add Level Description
            </button>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Validation Errors
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationPanel;
