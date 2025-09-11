import { useState } from 'react'; // 1. Impor useState
import TimelineItem from '../components/TimeLineItem';
import workExperiences from '../assets/json/work_experiences.json';
import educationHistory from '../assets/json/education_history.json';

export default function Experience() {
  const [activeTab, setActiveTab] = useState('work');

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">My Journey</h1>

      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveTab('work')}
          className={`py-2 px-6 rounded-lg font-semibold transition ${activeTab === 'work' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Work Experience
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`py-2 px-6 rounded-lg font-semibold transition ${activeTab === 'education' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Education
        </button>
      </div>

      <div className="relative">
        {activeTab === 'work' && (
          <div>
            {workExperiences.map((exp, index) => (
              <TimelineItem 
                key={`work-${index}`}
                {...exp}
                direction={index % 2 === 0 ? 'right' : 'left'}
              />
            ))}
          </div>
        )}

        {activeTab === 'education' && (
          <div>
            {educationHistory.map((edu, index) => (
              <TimelineItem 
                key={`edu-${index}`}
                {...edu}
                direction={index % 2 === 0 ? 'right' : 'left'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}