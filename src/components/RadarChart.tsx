import type React from 'react';
import { useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
} from 'recharts';
import type { Configuration } from '../App';
import AttributeTable from './AttributeTable';

interface RadarChartProps {
  configuration: Configuration;
}

const RadarChart: React.FC<RadarChartProps> = ({ configuration }) => {
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [showLevelDescriptions, setShowLevelDescriptions] = useState(false);

  const data = configuration.attributes.map((attr) => ({
    subject: attr.name,
    value: attr.value,
    fullMark: configuration.levels,
  }));

  // const hasAttributeDescriptions = configuration.attributes.some((attr) => attr.description);
  const hasLevelDescriptions =
    configuration.levelDescriptions && configuration.levelDescriptions.length > 0;

  // Responsive chart height and font sizes
  const isMobile = window.innerWidth <= 768;
  const chartHeight = isMobile ? '300px' : '400px';
  const fontSize = isMobile ? 10 : 12;

  return (
    <div style={{ width: '100%' }}>
      <h2 
        style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          fontSize: isMobile ? '18px' : '24px',
          padding: '0 10px'
        }}
      >
        {configuration.name}
      </h2>
      <div style={{ height: chartHeight, marginBottom: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <PolarGrid />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fontSize, textAnchor: 'middle' }}
              className="radar-axis-text"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, configuration.levels]}
              tick={{ fontSize }}
              tickCount={isMobile ? 3 : 5}
            />
            <Radar
              name="Values"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
              strokeWidth={isMobile ? 1.5 : 2}
              dot={{ r: isMobile ? 3 : 4 }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-info-panel">
        <div className="info-section">
          <div className="info-header">
            <h3>Attribute Details</h3>
            <button className="expand-btn" onClick={() => setShowDescriptions(!showDescriptions)}>
              {showDescriptions ? '▼' : '▶'}
            </button>
          </div>
          {showDescriptions && (
            <div className="attribute-tables">
              {configuration.attributes.map((attr, index) => (
                <AttributeTable key={index} attribute={attr} />
              ))}
            </div>
          )}
        </div>

        {hasLevelDescriptions && (
          <div className="info-section">
            <div className="info-header">
              <h3>General Level Descriptions</h3>
              <button
                className="expand-btn"
                onClick={() => setShowLevelDescriptions(!showLevelDescriptions)}
              >
                {showLevelDescriptions ? '▼' : '▶'}
              </button>
            </div>
            {showLevelDescriptions && (
              <div className="level-descriptions-display">
                {configuration.levelDescriptions?.map((level, index) => (
                  <div key={index} className="level-description-display-item">
                    <strong>{level.name}:</strong> {level.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RadarChart;
