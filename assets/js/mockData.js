window.mockData = {
  notes: [
    {
      id: 'note-1',
      title: 'Ecosystem recap',
      category: 'Biology',
      text: 'Plants need light, water, and minerals. The system balances those inputs to support growth.',
      saved: false
    },
    {
      id: 'note-2',
      title: 'Question to revisit',
      category: 'Chemistry',
      text: 'Why do different leaves respond differently to changing light intensity?',
      saved: true
    }
  ],
  classes: [
    { id: 'class-1', title: 'Intro to Ecosystems', subject: 'Environmental Science', status: 'scheduled', time: 'Today · 5:30 PM', teacher: 'Willow Tree' },
    { id: 'class-2', title: 'Photosynthesis Basics', subject: 'Biology', status: 'live', time: 'Now live', teacher: 'Moss Elm' }
  ],
  questions: [
    { id: 'q-1', title: 'What actually limits photosynthesis rate indoors?', author: 'Leaf User', subject: 'Biology', body: 'I keep seeing conflicting explanations. How should I think about it?', answers: [] },
    { id: 'q-2', title: 'How should I structure a lesson plan?', author: 'Another Leaf', subject: 'Teaching', body: 'I want a clean flow from concept to discussion.', answers: [] }
  ],
  leaderboard: [
    { id: 'leader-1', name: 'Willow Tree', role: 'Teacher', score: '128' },
    { id: 'leader-2', name: 'Moss Elm', role: 'Teacher', score: '96' },
    { id: 'leader-3', name: 'Almost Fake', role: 'Learner', score: '82' }
  ],
  trees: [
    { id: 'tree-1', name: 'Willow Tree', expertise: ['Botany', 'Teaching'], focus: 'Biology', availability: 'Available this week' },
    { id: 'tree-2', name: 'Moss Elm', expertise: ['Science'], focus: 'Environmental Science', availability: 'Open for Q&A' }
  ],
  students: [
    { id: 'student-1', name: 'Juniper', subject: 'Biology', activity: '4 lessons this week' },
    { id: 'student-2', name: 'Cedar', subject: 'Chemistry', activity: '2 notes planted' }
  ]
};
