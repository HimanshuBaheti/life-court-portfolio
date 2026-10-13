import hostelText from './stories/hostel.md?raw';
import familyText from './stories/family.md?raw';

const photo = (file, caption, alt = caption) => ({
  src: `assets/images/blog/${file}`, caption, alt,
  type: file.endsWith('.mp4') ? 'video' : 'image',
});

// Story text stays in Markdown. Section media keys match its ### headings exactly.
export const stories = [
  {
    id: 'hostel', status: 'published', title: 'Hostel Life',
    subtitle: 'The Days I Wish I Could Relive', label: 'FRIENDS / A PLACE THAT BECAME HOME',
    teaser: 'If I could go back for just one day, I’d choose a completely ordinary evening.',
    text: hostelText,
    cover: photo('hostel-cover.jpg', 'The same people. A different place.', 'Hostel friends together in Rajasthan'),
    keepsakes: [photo('hostel-room.jpg', 'That one room.'), photo('hostel-fun.jpg', 'Us being us.')],
    sectionMedia: {
      'A New City, A New Home, and Eight Crazy People': [photo('hostel-room.jpg', 'That one room.')],
      "The Things We Did (And Probably Shouldn't Have)": [photo('hostel-fun.jpg', 'The ordinary, chaotic days.'), photo('hostel-cricket.jpg', 'A trophy and a story.')],
      'From Hostel Rooms to Exploring the World': [photo('hostel-trip.jpg', 'The friendship continued beyond the hostel.')],
      'A Little More Than Friendship': [photo('hostel-food.mp4', 'A little piece of hostel life.')],
    },
    closing: '“She was right about everything.”',
  },
  {
    id: 'family', status: 'published', title: 'Hum Paanch',
    subtitle: 'Five Cousins, One Lifetime of Memories', label: 'FAMILY / ALWAYS THE YOUNGEST',
    teaser: 'Different lives, different cities. Put the five of us together, and nothing really changes.',
    text: familyText,
    cover: photo('family-cover.jpg', 'Together, with the family growing around us.', 'Family gathered together outdoors'),
    keepsakes: [photo('family-shreya.jpg', 'Shreya Jiji'), photo('family-amey.jpg', 'Amey')],
    sectionMedia: {
      "Shreya Jiji — Some Bonds Don't Need an Explanation": [photo('family-shreya.jpg', 'Shreya Jiji')],
      'Ayushi Jiji — My Pune Companion and So Much More': [photo('family-ayushi.jpg', 'Ayushi Jiji')],
      'Aaditya Bhaiya — The Brother I Look Up To': [photo('family-aaditya.jpg', 'Aaditya Bhaiya')],
      'Amey — My Partner in Crime': [photo('family-amey.jpg', 'Amey')],
      'Weddings, Games, and the Joy of Being Together': [photo('family-wedding.jpg', 'Another reason to come together.')],
    },
    closing: '“I’m just the youngest one again.”',
  },
  { id: 'trips', status: 'coming-soon', title: 'Trips', subtitle: 'More places. More stories.', label: 'THE COLLECTION CONTINUES' },
];

export const journalCopy = {
  title: 'Between Points',
  intro: 'If I could go back for just one evening.',
  description: 'The people, rooms and ordinary moments I wish I could keep a little longer.',
};
