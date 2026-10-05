// Everything personal lives here. Replace the local media paths with your own files.
// Stock imagery is a visual stand-in, never a claim to depict personal photographs.
const photo = (file, id, alt) => ({
  src: `/assets/images/${file}`,
  fallback: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=85`,
  alt,
});

export const portfolioData = {
  name: 'Himanshu Parag Baheti', shortName: 'Himanshu Baheti', nickname: 'Jiya', monogram: 'h.',
  siteTitle: 'A work in progress.',
  navigation: { label: 'The chapters', contact: 'Let’s connect', skip: 'Skip to the story', home: 'Back to the beginning' },
  location: 'Currently in Dublin, IE', role: 'Engineer by craft. Curious by nature.',
  loading: { title: 'Every story starts somewhere.', label: 'A little patience. A little perspective.' },
  ui: { scroll: 'Scroll to explore', scrollHint: 'Five chapters. One unfolding journey.', chapter: 'Chapter', next: 'Next chapter', back: 'Back to the beginning', sound: 'A story best taken slowly.', mediaNote: 'Visual placeholders · personal frames coming soon', comingSoon: 'Coming soon', contactTitle: 'Let’s make something meaningful.', close: 'Close contact details', contactIntro: 'My contact details are being added. In the meantime, explore the chapters.', progress: 'Story progress' },
  footer: { left: 'Made of logic. Moved by curiosity.', right: 'An ongoing story, by Himanshu.' },
  // Add real URLs to enable these links. Empty URLs are shown honestly as coming soon.
  contacts: [
    { label: 'Email', href: '', detail: 'Add your email address', icon: 'mail' },
    { label: 'LinkedIn', href: '', detail: 'Add your LinkedIn URL', icon: 'arrow' },
    { label: 'GitHub', href: '', detail: 'Add your GitHub URL', icon: 'arrow' },
    { label: 'Resume', href: '', placeholder: '/assets/documents/himanshu-baheti-resume.pdf', detail: 'Add your resume PDF', icon: 'download' },
  ],
  chapters: [
    {
      id: 'origins', number: '01', nav: 'Origins', eyebrow: 'MAHARASHTRA, INDIA · WHERE IT BEGAN',
      title: 'A little logic.', titleItalic: 'A lot of wonder.',
      intro: 'Hi, I’m Himanshu.', alias: 'Friends call me Jiya.',
      description: 'A data engineer with a camera roll full of detours. From a curious kid in Maharashtra to finding my feet in Dublin, this is the story so far.',
      note: 'Always asking why. Usually taking the scenic route.',
      tags: ['Data engineer', 'Visual storyteller', 'Lifelong explorer'],
      image: photo('placeholder-origins.jpg', 'photo-1476514525535-07fb3b4ae5f1', 'Illustrative mountain landscape and a lakeside village'),
      video: '/assets/videos/origins-timelapse.mp4', videoEnabled: false,
      photoLabel: 'THE WORLD IS BIG. STAY CURIOUS.', photoCaption: 'A collection of places, people & possibilities.',
      stamp: 'EST. IN MAHARASHTRA', floating: 'Somewhere between\nlogic & a little magic.',
      memories: [
        photo('placeholder-childhood.jpg', 'photo-1441974231531-c6227db76b6e', 'Nature placeholder for a childhood photograph'),
        photo('placeholder-teenage.jpg', 'photo-1470770841072-f978cf4d019e', 'Landscape placeholder for a teenage photograph'),
      ],
      memoryCaption: 'The early years · Maharashtra',
    },
    {
      id: 'academy', number: '02', nav: 'The Academy', eyebrow: 'PUNE, INDIA · THE FOUNDATION',
      title: 'Late nights.', titleItalic: 'Bright ideas.',
      intro: 'The classroom was only the beginning.',
      description: 'College and graduation in Pune gave my curiosity a direction. Hackathons gave it a deadline. Somewhere between the academic grind, shared screens, and late-night debugging, I learned how to turn an idea into something real.',
      note: 'Build. Break. Learn. Repeat.', tags: ['College & graduation', 'Hackathons', 'Problem-solving'],
      image: photo('placeholder-pune-college.jpg', 'photo-1523050854058-8df90110c9f1', 'Illustrative university graduation scene'),
      secondImage: photo('placeholder-hackathon.jpg', 'photo-1516321318423-f06f85e504b3', 'Illustrative collaborative work around a laptop'),
      photoCaption: 'Pune, where curiosity became a craft.', secondCaption: 'Ideas don’t keep office hours.',
      code: ['while (curious) {', '  build();', '  learn();', '  tryAgain();', '}'],
      annotation: 'A few bugs. A lot of becoming.',
    },
    {
      id: 'professional', number: '03', nav: 'The Professional', eyebrow: 'PUNE, INDIA · CONNECTING THE DOTS',
      title: 'Complex problems.', titleItalic: 'Clear thinking.',
      intro: 'Making data do something useful.',
      description: 'I build data pipelines with Databricks and PySpark, bringing structure to complexity. My approach is practical: concise code, short variable names, and a clear path from problem to solution.',
      note: 'Good engineering makes the complicated feel simple.', tags: ['Databricks', 'PySpark', 'Azure Data Factory'],
      projects: [
        { number: '01', title: 'Pipelines with perspective', type: 'DATA ENGINEERING', description: 'Building data pipelines with Databricks and PySpark to make data ready for the next decision.', stack: 'Databricks / PySpark', icon: 'database' },
        { number: '02', title: 'No failure left behind', type: 'ORCHESTRATION', description: 'Modifying Azure Data Factory child pipelines to capture failures across parallel and sequential tasks.', stack: 'Azure Data Factory / Failure handling', icon: 'workflow' },
        { number: '03', title: 'From drawing to delivery', type: 'ENTREPRENEURSHIP', description: 'Building and commercializing an automated reporting tool for ballooned engineering drawings.', stack: 'Automation / Engineering reporting', icon: 'scan' },
      ],
      diagram: ['Raw data', 'A little engineering', 'Clarity'],
    },
    {
      id: 'lens', number: '04', nav: 'The Creative Lens', eyebrow: 'OUT IN THE WORLD · THROUGH MY LENS',
      title: 'Life, outside', titleItalic: 'the brackets.',
      intro: 'Some stories deserve more than a camera roll.',
      description: 'I’m building a vlogging channel to collect the big adventures and the small, ordinary moments. A new city, a good rally, one more song. There’s a story in all of it.',
      note: 'Less perfect. More present.', tags: ['Travel', 'Photography', 'Vlogging in the making'],
      gallery: [
        { ...photo('placeholder-singapore-kl.jpg', 'photo-1525625293386-3f8f99389edd', 'Illustrative view of Singapore’s Marina Bay'), title: 'For the ones who started it all.', location: 'SINGAPORE & KUALA LUMPUR', date: 'JUL 2025', caption: 'A family trip for my parents’ 25th anniversary.' },
        { ...photo('placeholder-bangkok-krabi.jpg', 'photo-1552465011-b4e21bf6e79a', 'Illustrative tropical coast in Thailand'), title: 'Good company. No straight lines.', location: 'BANGKOK & KRABI', date: 'APR 2026', caption: 'An escape to Thailand with friends.' },
        { ...photo('placeholder-everyday.jpg', 'photo-1510915361894-db8b60106cb1', 'Illustrative acoustic guitar'), title: 'The in-between moments.', location: 'EVERYDAY LITTLE THINGS', date: 'ONGOING', caption: 'Pickleball timelapses, night golf & acoustic guitar.' },
      ],
    },
    {
      id: 'dublin', number: '05', nav: 'Dublin & Beyond', eyebrow: 'DUBLIN, IRELAND · THE CURRENT CHAPTER',
      title: 'New city.', titleItalic: 'Same curiosity.',
      intro: 'A different view. A wider perspective.',
      description: 'Now living in Dublin for my studies, I’m bringing my data engineering background into an international setting. Ireland is a chance to learn alongside new perspectives, grow beyond the familiar, and see what I can build next.',
      note: 'The next chapter is still being written.', tags: ['Studying in Dublin', 'Learning without borders'],
      image: photo('placeholder-dublin.jpg', 'photo-1549918864-48ac978761a4', 'Illustrative view of Dublin’s river and city architecture'),
      photoCaption: 'Dublin, Ireland · A new beginning', contactHeading: 'Good things start\nwith a conversation.', contactLabel: 'HAVE SOMETHING IN MIND?',
    },
  ],
};
