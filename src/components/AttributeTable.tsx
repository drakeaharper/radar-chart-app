import React from 'react';
import { Attribute } from '../App';

interface AttributeTableProps {
  attribute: Attribute;
}

const AttributeTable: React.FC<AttributeTableProps> = ({ attribute }) => {
  if (!attribute.levelDescriptions || attribute.levelDescriptions.length === 0) {
    return null;
  }

  const getLevelName = (level: number): string => {
    switch (level) {
      case 1: return 'Basic';
      case 2: return 'Proficient';
      case 3: return 'Advanced';
      case 4: return 'Expert';
      default: return `Level ${level}`;
    }
  };

  const getLevelColor = (level: number): string => {
    switch (level) {
      case 1: return '#ffe6cc'; // Light orange
      case 2: return '#fff2cc'; // Light yellow
      case 3: return '#d5e8d4'; // Light green
      case 4: return '#dae8fc'; // Light blue
      default: return '#f8f9fa';
    }
  };

  return (
    <div className="attribute-table">
      <div className="attribute-table-header">
        <div className="attribute-name-cell">
          <h4>{attribute.name}</h4>
          <p className="attribute-description">{attribute.description}</p>
        </div>
      </div>
      <div className="attribute-table-body">
        {attribute.levelDescriptions.map((levelDesc) => (
          <div 
            key={levelDesc.level} 
            className="level-row"
            style={{ backgroundColor: getLevelColor(levelDesc.level) }}
          >
            <div className="level-name">
              {getLevelName(levelDesc.level)}
            </div>
            <div className="level-description">
              {levelDesc.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeTable;