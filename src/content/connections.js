// Fill only with details you want to publish. Blank entries render as unavailable.
// Email: mailto:you@example.com | Phone: tel:+353... | Social and project links: https://...
export const connections = {
  title: 'Let’s build the next chapter.',
  intro: 'Based in Dublin, studying Data and Computational Science at UCD. Exploring data engineering and Data & AI opportunities in Ireland.',
  completion: 'The game has an ending. My next chapter is open: contributing to a data engineering or Data & AI team in Dublin. Explore my work, or get in touch to start a conversation.',
  contacts: [
    { label:'Email', href:'mailto:himanshupbaheti@gmail.com', value:'himanshupbaheti@gmail.com', icon:'mail' },
    { label:'LinkedIn', href:'https://linkedin.com/in/himanshu-baheti-5344a4212', value:'Himanshu Baheti', icon:'linkedin' },
    { label:'GitHub', href:'https://github.com/HimanshuBaheti', value:'HimanshuBaheti', icon:'github' },
    { label:'Instagram · Personal', href:'https://www.instagram.com/bahetihimanshu/', value:'@bahetihimanshu', icon:'instagram' },
    { label:'Instagram · Abroad diaries', href:'https://www.instagram.com/abroad__diaries/', value:'@abroad__diaries', icon:'instagram' },
    { label:'Phone · Ireland', href:'tel:+353892513513', value:'+353 89 251 3513', icon:'phone' },
    { label:'Phone · India', href:'tel:+917410730619', value:'+91 74107 30619', icon:'phone' },
    // Add the PDF to public/assets/documents/himanshu-baheti-resume.pdf,
    // then set href to `${import.meta.env.BASE_URL}assets/documents/himanshu-baheti-resume.pdf`.
    { label:'Resume', href:`${import.meta.env.BASE_URL}assets/documents/himanshu-baheti-resume.pdf`, value:'Resume', icon:'file' },
  ],
  projects: [
    { id:'research', title:'Chest X-ray classification', category:'ACADEMIC RESEARCH', description:'Lung segmentation and classification, with comparison across 13 models. Academic research; not a clinically validated product.', repo:'',demo:'',image:'' },
    { id:'movies', title:'Movie recommendation system', category:'PERSONAL PROJECT', description:'Content-based recommendations using TF-IDF and cosine similarity, with a Streamlit interface and approximately 30,000 movies.',repo:'',demo:'',image:'' },
    { id:'hackathon', title:'Ration distribution', category:'HACKATHON PROJECT', description:'A facial-recognition solution for ration distribution, built during a winning 24-hour TIAA hackathon entry.',repo:'',demo:'',image:'' },
  ],
};

export const chapterMedia = {
  roots: {type:'video',src:`${import.meta.env.BASE_URL}assets/images/life-court-tennis.mp4`,placeholderPath:`${import.meta.env.BASE_URL}assets/images/life-court-tennis.mp4`,alt:'Himanshu on a tennis court',caption:'Where the story began',suggestion:'A tennis or early-years video',kind:'court'},
  academy: {src:`${import.meta.env.BASE_URL}assets/images/life-court-pict.jpg`,placeholderPath:`${import.meta.env.BASE_URL}assets/images/life-court-pict.jpg`,alt:'Himanshu at PICT',caption:'Pune · the college years',suggestion:'A campus or graduation photograph',kind:'grid'},
  hackathons: {src:`${import.meta.env.BASE_URL}assets/images/life-court-hackathon.jpg`,placeholderPath:`${import.meta.env.BASE_URL}assets/images/life-court-hackathon.jpg`,alt:'Himanshu with his hackathon team',caption:'A team. A deadline. An idea.',suggestion:'A team or demo-day photograph',kind:'grid'},
  research: {src:`${import.meta.env.BASE_URL}assets/images/life-court-research.jpg`,placeholderPath:`${import.meta.env.BASE_URL}assets/images/life-court-research.jpg`,alt:'A public-safe academic project diagram',caption:'From questions to evidence',suggestion:'A research poster or model comparison',kind:'diagram'},
  integration: {src:`${import.meta.env.BASE_URL}assets/images/life-court-integration.jpg`,placeholderPath:`${import.meta.env.BASE_URL}assets/images/life-court-integration.jpg`,alt:'A public-safe integration diagram',caption:'Connecting the next step',suggestion:'A self-made architecture diagram',kind:'diagram'},
  engineering: {src:`${import.meta.env.BASE_URL}assets/images/life-court-engineering.png`,placeholderPath:`${import.meta.env.BASE_URL}assets/images/life-court-engineering.png`,alt:'A public-safe engineering project diagram',caption:'The work behind the workflow',suggestion:'A public-safe diagram or work photograph',kind:'diagram'},
  outside: {src:`${import.meta.env.BASE_URL}assets/images/life-court-travel.jpg`,placeholderPath:`${import.meta.env.BASE_URL}assets/images/life-court-travel.jpg`,alt:'A photograph from Himanshu’s family trip',caption:'Singapore & Malaysia · July 2025',suggestion:'A favourite family-trip photograph',kind:'travel'},
  dublin: {src:`${import.meta.env.BASE_URL}assets/images/life-court-dublin.jpg`,placeholderPath:`${import.meta.env.BASE_URL}assets/images/life-court-dublin.jpg`,alt:'Himanshu in Dublin or at UCD',caption:'Dublin · the next chapter',suggestion:'A Dublin or UCD photograph',kind:'travel'},
};
