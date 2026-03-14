import { useEffect, useState } from 'react';
import TimelineItem from '../components/TimeLineItem';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { supabase } from '../lib/supabase';
import type { WorkExperience, Education } from '../types';

// Static fallbacks
import workJson from '../assets/json/work_experiences.json';
import eduJson from '../assets/json/education_history.json';

type Tab = 'work' | 'education';

export default function Experience() {
  const [activeTab, setActiveTab] = useState<Tab>('work');
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [educationHistory, setEducationHistory] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (supabase) {
        const [{ data: workData }, { data: eduData }] = await Promise.all([
          supabase.from('work_experiences').select('*').order('sort_order'),
          supabase.from('education_history').select('*').order('sort_order'),
        ]);
        if (workData) setWorkExperiences(workData as WorkExperience[]);
        if (eduData) setEducationHistory(eduData as Education[]);
      } else {
        // Fallback: transform static JSON to match interface
        setWorkExperiences(workJson.map((w, i) => ({
          id: String(i), period: w.period, title: w.title,
          company: w.company, description: w.description,
          sort_order: i, created_at: '',
        })));
        setEducationHistory(eduJson.map((e, i) => ({
          id: String(i), period: e.period, title: e.title,
          institution: e.company, description: e.description,
          sort_order: i, created_at: '',
        })));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const tabClass = (tab: Tab) =>
    `py-2 px-6 rounded-lg text-sm font-semibold font-montserrat border transition-all ${
      activeTab === tab
        ? 'border-transparent'
        : 'border-transparent hover:border-[var(--green)]'
    }`;

  return (
    <div className="w-full mx-auto py-14 page-in">
      <h1 className="text-3xl font-bold font-montserrat text-center mb-10" style={{ color: 'var(--text-primary)' }}>
        My Journey
      </h1>

      <div className="flex justify-center gap-3 mb-12">
        <button
          onClick={() => setActiveTab('work')}
          className={tabClass('work')}
          style={{
            background: activeTab === 'work' ? 'var(--btn-active)' : 'var(--btn-inactive)',
            color: activeTab === 'work' ? 'var(--btn-active-text)' : 'var(--btn-inactive-text)',
          }}
        >
          Work Experience
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={tabClass('education')}
          style={{
            background: activeTab === 'education' ? 'var(--btn-active)' : 'var(--btn-inactive)',
            color: activeTab === 'education' ? 'var(--btn-active-text)' : 'var(--btn-inactive-text)',
          }}
        >
          Education
        </button>
      </div>

      <div className="relative">
        {/* Continuous solid line */}
        <div 
          className="absolute top-0 bottom-0 left-5 md:left-1/2 w-px -translate-x-1/2 z-0" 
          style={{ background: 'var(--timeline-line)' }} 
        />
        
        {loading ? (
          <LoadingSkeleton type="list" count={2} />
        ) : activeTab === 'work' ? (
          <div>
            {workExperiences.map((exp, index) => (
              <TimelineItem
                key={exp.id}
                period={exp.period}
                title={exp.title}
                company={exp.company}
                description={exp.description}
                direction={index % 2 === 0 ? 'right' : 'left'}
              />
            ))}
          </div>
        ) : (
          <div>
            {educationHistory.map((edu, index) => (
              <TimelineItem
                key={edu.id}
                period={edu.period}
                title={edu.title}
                company={edu.institution}
                description={edu.description}
                direction={index % 2 === 0 ? 'right' : 'left'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
