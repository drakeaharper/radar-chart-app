import React, { useEffect, useState } from 'react';
import './App.css';
import ConfigurationPanel from './components/ConfigurationPanel';
import RadarChart from './components/RadarChart';

export interface AttributeLevelDescription {
  level: number;
  description: string;
}

export interface Attribute {
  name: string;
  value: number;
  description?: string;
  levelDescriptions?: AttributeLevelDescription[];
}

export interface LevelDescription {
  name: string;
  description: string;
}

export interface Configuration {
  name: string;
  attributes: Attribute[];
  levels: number;
  levelDescriptions?: LevelDescription[];
}

const presetConfigurations: Configuration[] = [
  {
    name: 'Technical Capability Assessment',
    attributes: [
      {
        name: 'Curiosity',
        value: 3,
        description: 'Is fascinated by the world around them and the way things work.',
        levelDescriptions: [
          {
            level: 1,
            description:
              'Learns new things in time to get the work done. Tends to stick to their preferred tools, and may consider themself a "Rails", "React", or "AWS" engineer.',
          },
          {
            level: 2,
            description:
              'Explores the capabilities of their tools to build a deep understanding of them. Always has a willingness to learn new things. Often asks "what if?" or "why?"',
          },
          {
            level: 3,
            description:
              "Has explored and gained expertise in multiple tools or languages. Is fascinated by learning the ins and outs of different paradigms and models. Aims to understand the core of why we're doing things so they can find ways to improve.",
          },
          {
            level: 4,
            description:
              'Has endless curiosity both in the technical space and outside of it. Has a wide breadth of knowledge across different subjects. Synthesizes and shares ideas from different spaces to bring fresh ideas to the organization.',
          },
        ],
      },
      {
        name: 'Quality mindset',
        value: 2,
        description:
          'Understands procedures and best practices and is able to follow them to achieve precise and correct results.',
        levelDescriptions: [
          {
            level: 1,
            description:
              'Sometimes skips tests, or writes just enough to get coverage metrics to pass. Writes code in large patchsets that are difficult to review and are more likely to introduce defects. Would rather do things their own way than following established best practices.',
          },
          {
            level: 2,
            description:
              'Writes tests to cover all the functionality of their code. Fixes bugs before moving on to the next thing. Understands the test pyramid and writes tests at appropriate levels to cover beyond the happy path.',
          },
          {
            level: 3,
            description:
              'Writes tests that are both good and fast. Leaves code surrounding their changes better than they found it. Implements functional requirements that are complete and defect-free.',
          },
          {
            level: 4,
            description:
              'Thinks critically about an approach to testing their code early on. Can anticipate quality problems before they manifest as bugs in code. Identifies and implements testing tools that reshape how we think about quality.',
          },
        ],
      },
      {
        name: 'Fearlessness',
        value: 2,
        description: 'Is unwilling to be intimidated by problems that have an unclear solution.',
        levelDescriptions: [
          {
            level: 1,
            description:
              "Generally sticks to tasks they're already competent at and familiar with. Hesitates to take on tasks outside their immediate responsibility.",
          },
          {
            level: 2,
            description:
              'Takes on challenges when prompted and can see them through to completion. Asks the team questions when stuck on something. Is excited to explore unfamiliar areas of the codebase.',
          },
          {
            level: 3,
            description:
              'Is as good at reading code as writing it. Is unafraid of taking on tasks in new languages or tools. Actively asks questions to domain experts to find pitfalls and reduce unknowns.',
          },
          {
            level: 4,
            description:
              "Has taken on large projects in areas in which they're completely unfamiliar. Jumps into complex areas of the codebase and asks the right questions to fully understand the problem. Tackles uncertainty early on in a project to prevent future surprises.",
          },
        ],
      },
      {
        name: 'Propensity to ship',
        value: 3,
        description: 'Has a desire and ability to ship code to production repeatedly and rapidly.',
        levelDescriptions: [
          {
            level: 1,
            description:
              "Has contributed bug fixes and work towards smaller features. Hasn't yet shipped anything large or complex.",
          },
          {
            level: 2,
            description:
              'Has led in their role on small projects to completion. Works effectively with product management to manage complexity and reduce scope when needed to get things released on time.',
          },
          {
            level: 3,
            description:
              'Maintains some long running projects. Has led complex projects with a team to production. Can make the right trade-offs between functional and non-functional requirements based on the situation at hand.',
          },
          {
            level: 4,
            description:
              'Has demonstrated they can make sound strategic decisions around how to structure work. Ships important things to customers quickly and regularly. Has been instrumental in shipping critical features and products.',
          },
        ],
      },
      {
        name: 'Ownership',
        value: 2,
        description:
          'Understands the business impact of their work and is accountable for the outcomes of their actions.',
        levelDescriptions: [
          {
            level: 1,
            description:
              "Is more excited about technical challenges and tools than the impact on the business. Doesn't always think of business impact when making a choice about language or tools.",
          },
          {
            level: 2,
            description:
              "Can work within the constraints of a budget. Acts on behalf of the company and doesn't say \"that's not my job.\" Can effectively learn from failures and doesn't try to hide them.",
          },
          {
            level: 3,
            description:
              'Takes responsibility for their services and responds effectively to problems when they come up. Has an eye towards how their work has an impact beyond their time here. Sacrifices technical preferences for business impact.',
          },
          {
            level: 4,
            description:
              "Focuses on long-term value over short-term results. Can lead effective incident management and post-mortems to make sure incidents aren't repeated. Aligns with the company goals and objectives in how they approach their work.",
          },
        ],
      },
      {
        name: 'Communication',
        value: 3,
        description:
          'Can bring people together to a shared understanding, can effectively resolve conflict and inspire others.',
        levelDescriptions: [
          {
            level: 1,
            description:
              'Mostly keeps to themself, but is willing to share feedback, thoughts, and opinions when prompted.',
          },
          {
            level: 2,
            description:
              'Works in public whenever they can. Is an active participant in meetings, giving valuable feedback and direction to their team. Can communicate effectively with cross-functional teammates, other teams, and management.',
          },
          {
            level: 3,
            description:
              'Is receptive to feedback and makes necessary changes to grow. Helps to run meetings, keeping them on topic and useful. Encourages healthy conflict and can diffuse touchy situations.',
          },
          {
            level: 4,
            description:
              'Effectively communicates objectives and helps steer the efforts of multiple teams towards a common goal. Can present a compelling vision of the future across the organization and inspire others to do their best work. Reinforces inclusivity, humanity, and growth with their communication.',
          },
        ],
      },
      {
        name: 'Next right thing',
        value: 2,
        description:
          'Understands how to break down large problems to identify the next appropriate task.',
        levelDescriptions: [
          {
            level: 1,
            description:
              "Is effective when there is a clear direction and existing examples of how to solve a particular problem. Sometimes gets stuck on large projects that aren't effectively broken down. May spin their wheels on multiple large projects at once.",
          },
          {
            level: 2,
            description:
              'Can prioritize and focus on accomplishing tasks. Knows how to plan their work around time constraints. Can adequately break down work to complete it without getting overwhelmed.',
          },
          {
            level: 3,
            description:
              'Knows how to devise good strategies around how to decompose problems. Is unintimidated by a blank codebase or new feature. Can build a plan of action to achieve significant goals.',
          },
          {
            level: 4,
            description:
              "Can handle complex changes or difficult refactors without breaking things. Is prolific in how much they're able to get done. Prioritizes work that has the most impact.",
          },
        ],
      },
      {
        name: 'Support for others',
        value: 1,
        description: 'Shares what they learn and helps to sponsor the success of others.',
        levelDescriptions: [
          {
            level: 1,
            description:
              "Is primarily focused on their own growth. Isn't actively mentoring anyone else, and may be looking to be mentored.",
          },
          {
            level: 2,
            description:
              'Is respectful and generous towards others. Provides thoughtful and useful guidance for their colleagues. Has one or more mentees within the organization.',
          },
          {
            level: 3,
            description:
              'Actively volunteers energy towards the growth of others. Has influenced the career paths of others. Can build deep trust with colleagues and gives candid and constructive feedback.',
          },
          {
            level: 4,
            description:
              'Acts as a positive role model and is respected by colleagues in the organization. Their guidance and ideas have influenced others who have passed the knowledge to new generations of mentees. Has influenced long term talent growth within the organization.',
          },
        ],
      },
      {
        name: 'Empathic work',
        value: 2,
        description:
          'Understands and anticipates the impact their work has on colleagues and customers.',
        levelDescriptions: [
          {
            level: 1,
            description:
              'Is more concerned about getting the work done than what happens afterwards. Has little to no direct contact with others before or after their work is done.',
          },
          {
            level: 2,
            description:
              "Understands that their work exists to support users and customers. Writes clean code with an understanding that someone else will maintain it in the future. Works effectively with product and design to make sure we're building the right thing.",
          },
          {
            level: 3,
            description:
              "Makes technical decisions that are flexible to future changes. Writes good documentation to explain why we're doing things a particular way, including clear examples. Follows up on previous work to make sure it fulfills needs.",
          },
          {
            level: 4,
            description:
              'Approaches all work from a perspective of the outcomes and impact it has on users. Reduces risk on projects by gathering useful information and insights to understand a problem before starting their work. Thoughtfully designs the experiences others will have when interacting with their work.',
          },
        ],
      },
      {
        name: 'Community',
        value: 1,
        description: 'Helps to organize and build communities within Instructure.',
        levelDescriptions: [
          {
            level: 1,
            description:
              'Has little to no involvement in organizing or contributing towards community activities.',
          },
          {
            level: 2,
            description:
              'Attends community activities. Is a source of positivity for those around them. Shares what they learn with their team and the wider organization.',
          },
          {
            level: 3,
            description:
              'Builds culture internally at Instructure through their contributions. Regularly gives talks at events such as Avocode and Pandamonium. Is active in the Architecture Guilds or the Canvas open source community.',
          },
          {
            level: 4,
            description:
              'Has an outsized impact on the company and culture. Organizes and hosts community activities and events such as Avocode, Pandamonium, the Intern Program, and others. Is Instrumental in making the company a place we all want to work.',
          },
        ],
      },
    ],
    levels: 4,
    levelDescriptions: [
      {
        name: 'Basic',
        description: 'Entry level - developing foundational skills and learning basic concepts.',
      },
      {
        name: 'Proficient',
        description:
          'Competent - able to work independently and contribute effectively to the team.',
      },
      {
        name: 'Advanced',
        description: 'Skilled - demonstrates expertise and helps guide others in their area.',
      },
      {
        name: 'Expert',
        description: 'Mastery - recognized expert who shapes standards and mentors others.',
      },
    ],
  },
  {
    name: 'Skills Assessment',
    attributes: [
      { name: 'Programming', value: 8 },
      { name: 'Design', value: 6 },
      { name: 'Communication', value: 7 },
      { name: 'Leadership', value: 5 },
    ],
    levels: 10,
  },
  {
    name: 'Product Features',
    attributes: [
      { name: 'Usability', value: 9 },
      { name: 'Performance', value: 7 },
      { name: 'Security', value: 8 },
      { name: 'Scalability', value: 6 },
      { name: 'Maintainability', value: 7 },
    ],
    levels: 10,
  },
  {
    name: 'Basic Template',
    attributes: [
      { name: 'Attribute 1', value: 1 },
      { name: 'Attribute 2', value: 1 },
      { name: 'Attribute 3', value: 1 },
    ],
    levels: 5,
  },
];

function App() {
  const [currentConfig, setCurrentConfig] = useState<Configuration>(presetConfigurations[0]);
  const [savedConfigurations, setSavedConfigurations] = useState<Configuration[]>([]);
  const [allConfigurations, setAllConfigurations] = useState<Configuration[]>(presetConfigurations);

  useEffect(() => {
    const saved = localStorage.getItem('savedConfigurations');
    if (saved) {
      const parsedSaved = JSON.parse(saved);
      setSavedConfigurations(parsedSaved);
      setAllConfigurations([...presetConfigurations, ...parsedSaved]);
    }
  }, []);

  const saveConfiguration = (config: Configuration) => {
    const existingIndex = savedConfigurations.findIndex((c) => c.name === config.name);
    let newSavedConfigs;

    if (existingIndex >= 0) {
      newSavedConfigs = [...savedConfigurations];
      newSavedConfigs[existingIndex] = config;
    } else {
      newSavedConfigs = [...savedConfigurations, config];
    }

    setSavedConfigurations(newSavedConfigs);
    setAllConfigurations([...presetConfigurations, ...newSavedConfigs]);
    localStorage.setItem('savedConfigurations', JSON.stringify(newSavedConfigs));
  };

  const deleteConfiguration = (configName: string) => {
    const newSavedConfigs = savedConfigurations.filter((c) => c.name !== configName);
    setSavedConfigurations(newSavedConfigs);
    setAllConfigurations([...presetConfigurations, ...newSavedConfigs]);
    localStorage.setItem('savedConfigurations', JSON.stringify(newSavedConfigs));

    if (currentConfig.name === configName) {
      setCurrentConfig(presetConfigurations[0]);
    }
  };

  return (
    <div className="App">
      <div className="app-container">
        <div className="left-panel">
          <ConfigurationPanel
            configuration={currentConfig}
            presetConfigurations={allConfigurations}
            savedConfigurations={savedConfigurations}
            onSaveConfiguration={saveConfiguration}
            onDeleteConfiguration={deleteConfiguration}
            onConfigurationChange={setCurrentConfig}
          />
        </div>
        <div className="right-panel">
          <RadarChart configuration={currentConfig} />
        </div>
      </div>
    </div>
  );
}

export default App;
