import React, { useState } from 'react';
import { Configuration, Attribute, LevelDescription } from '../App';

interface ConfigurationPanelProps {
  configuration: Configuration;
  presetConfigurations: Configuration[];
  savedConfigurations: Configuration[];
  onConfigurationChange: (config: Configuration) => void;
  onSaveConfiguration: (config: Configuration) => void;
  onDeleteConfiguration: (configName: string) => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  configuration,
  presetConfigurations,
  savedConfigurations,
  onConfigurationChange,
  onSaveConfiguration,
  onDeleteConfiguration
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
    
    const attributeNames = config.attributes.map(attr => attr.name.trim());
    const uniqueNames = new Set(attributeNames);
    if (uniqueNames.size !== attributeNames.length) {
      newErrors.push('Attribute names must be unique');
    }
    
    if (attributeNames.some(name => name === '')) {
      newErrors.push('Attribute names cannot be empty');
    }
    
    // Validate level descriptions if they exist
    if (config.levelDescriptions && config.levelDescriptions.length > 0) {
      const levelNames = config.levelDescriptions.map(level => level.name.trim());
      const uniqueLevelNames = new Set(levelNames);
      if (uniqueLevelNames.size !== levelNames.length) {
        newErrors.push('Level names must be unique');
      }
      
      if (levelNames.some(name => name === '')) {
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
    return ['Technical Capability Assessment', 'Skills Assessment', 'Product Features', 'Basic Template'].includes(configName);
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
    newLevelDescriptions.push({ name: `Level ${newLevelDescriptions.length + 1}`, description: '' });
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
    return savedConfigurations.some(config => config.name === configName);
  };

  const handlePresetChange = (presetName: string) => {
    const preset = presetConfigurations.find(p => p.name === presetName);
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
      value: 1
    };
    const newConfig = {
      ...configuration,
      attributes: [...configuration.attributes, newAttribute]
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
    <div>
      <h2>Configuration</h2>
      
      <div className="config-section">
        <h3>Configuration Name</h3>
        <input
          type="text"
          className="config-name-input"
          value={configuration.name}
          onChange={(e) => handleConfigurationNameChange(e.target.value)}
          placeholder="Configuration name"
        />
      </div>

      <div className="config-section">
        <h3>Load Configuration</h3>
        <select 
          className="preset-selector"
          value={configuration.name}
          onChange={(e) => handlePresetChange(e.target.value)}
        >
          {presetConfigurations.map(preset => (
            <option key={preset.name} value={preset.name}>
              {preset.name} {isPresetConfiguration(preset.name) ? '(Preset)' : '(Saved)'}
            </option>
          ))}
        </select>
        {isSavedConfiguration(configuration.name) && (
          <button
            className="delete-btn"
            onClick={() => onDeleteConfiguration(configuration.name)}
            style={{ marginTop: '10px', width: '100%' }}
          >
            Delete Configuration
          </button>
        )}
      </div>

      <div className="config-section">
        <h3>Save Configuration</h3>
        <button
          className="save-btn"
          onClick={handleSaveCurrent}
          disabled={errors.length > 0}
          style={{ marginBottom: '10px', width: '100%' }}
        >
          Save Current Configuration
        </button>
        <button
          className="save-as-btn"
          onClick={() => setShowSaveDialog(true)}
          disabled={errors.length > 0}
          style={{ width: '100%' }}
        >
          Save As New Configuration
        </button>
        
        {showSaveDialog && (
          <div className="save-dialog">
            <input
              type="text"
              className="save-as-input"
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              placeholder="Enter new configuration name"
              style={{ marginTop: '10px', width: '100%' }}
            />
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button
                className="confirm-save-btn"
                onClick={handleSaveAs}
                disabled={!saveAsName.trim()}
                style={{ flex: 1 }}
              >
                Save
              </button>
              <button
                className="cancel-save-btn"
                onClick={() => {
                  setShowSaveDialog(false);
                  setSaveAsName('');
                }}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="config-section">
        <h3>Attributes</h3>
        <div className="attribute-list">
          {configuration.attributes.map((attribute, index) => (
            <div key={index} className="attribute-item-expanded">
              <div className="attribute-header">
                <input
                  type="text"
                  className="attribute-name"
                  value={attribute.name}
                  onChange={(e) => handleAttributeNameChange(index, e.target.value)}
                  placeholder="Attribute name"
                />
                <input
                  type="number"
                  className="attribute-value"
                  value={attribute.value}
                  onChange={(e) => handleAttributeValueChange(index, parseInt(e.target.value) || 0)}
                  min="0"
                  max={configuration.levels}
                />
                <button
                  className="expand-btn"
                  onClick={() => toggleAttributeExpansion(index)}
                >
                  {expandedAttributes.has(index) ? '▼' : '▶'}
                </button>
                {configuration.attributes.length > 3 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeAttribute(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              {expandedAttributes.has(index) && (
                <div className="attribute-description">
                  <label>Description:</label>
                  <textarea
                    className="attribute-description-input"
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
        <button className="add-btn" onClick={addAttribute}>
          Add Attribute
        </button>
      </div>

      <div className="config-section">
        <div className="levels-header">
          <h3>Levels</h3>
          <button
            className="expand-btn"
            onClick={() => setExpandedLevels(!expandedLevels)}
          >
            {expandedLevels ? '▼' : '▶'}
          </button>
        </div>
        <input
          type="number"
          className="levels-input"
          value={configuration.levels}
          onChange={(e) => handleLevelsChange(parseInt(e.target.value) || 1)}
          min="1"
        />
        {expandedLevels && (
          <div className="level-descriptions">
            <h4>Level Descriptions:</h4>
            {(configuration.levelDescriptions || []).map((levelDesc, index) => (
              <div key={index} className="level-description-item">
                <div className="level-description-header">
                  <input
                    type="text"
                    className="level-name-input"
                    value={levelDesc.name}
                    onChange={(e) => handleLevelNameChange(index, e.target.value)}
                    placeholder="Level name"
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeLevelDescription(index)}
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  className="level-description-input"
                  value={levelDesc.description}
                  onChange={(e) => handleLevelDescriptionChange(index, e.target.value)}
                  placeholder="Enter level description..."
                  rows={3}
                />
              </div>
            ))}
            <button className="add-btn" onClick={addLevelDescription}>
              Add Level Description
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="config-section">
          <h3>Validation Errors</h3>
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfigurationPanel;