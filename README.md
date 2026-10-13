# A life in play — Himanshu's story match

The default experience is a scripted eight-point tennis exhibition. Visitors start a rally, watch two players move and exchange shots, then discover a chapter of Himanshu's story after the winning shot. Each chapter shows the updated score and waits for **Continue the rally**. Scrolling does not award points or advance chapters.

```sh
npm install
npm run dev
npm run build
npm test
```

Preview: http://localhost:5173. The earlier sculpture study remains at `/?concept=sculpture`.

## Experience and content

The eight chapters cover sport, PICT education, hackathons, research, the Bajaj Finserv internship, professional engineering, personal travel, and UCD in Dublin. Copy and the scripted winner sequence live in `src/content/matchStory.js`. Match results are illustrative, not a real personal match record. The sequence ends with deuce, advantage, and game.

The palette uses midnight plum, lavender, acid green, and warm ivory. The court remains clearly visible throughout play; story cards interrupt the action rather than competing with it.

## Implementation

- `src/prototype/RallyApp.jsx`: explicit ready → playing → story → next point → complete state flow. Closing a chapter leads to a paused intermission; only an explicit continuation starts the next point.
- `src/prototype/RallyScene.jsx`: moving players, stride and racquet animation, ball flight, bounces, and the final missed return. One shared clock coordinates the scene and stops on hidden tabs, pause, or dialogs.
- `src/utils/tennis.js`: deterministic contact positions, equal shot duration, point completion, and standard advantage-game scoring.
- `src/prototype/match.css`: responsive match and chapter-card layouts.
- `src/prototype/ScoreLesson.jsx`: optional interactive scoring explanation with an ITF reference.

Visitors can skip a point's animation to reveal its chapter. Reduced-motion mode skips directly to the chapter after Start or Continue, without bypassing a user pause. Native dialogs contain keyboard focus; Escape closes the card and keeps the rally paused.

The original scroll rally/filmstrip files remain as reference material, but are not the active experience. Prior tests are retained in `.previous.js` files, outside Playwright's test pattern.

## Validation and scope

`npm test` checks natural point completion, player movement, contact continuity, all eight scores, exactly-once awards, explicit continuation, pause, modal behavior, mobile layout, and reduced motion. The sculpture's tests also remain active. Screenshots are saved in `test-results/`.

This is a story prototype. User-controlled movement, aiming, collision-based outcomes, and playable game modes are future scope. Current shot outcomes are scripted so every visitor reaches the complete story. Public contact links and chapter media are configured; project URLs and the life journal writing can be added separately.

## Add your contacts, projects, and photographs later

Everything for these additions is in **`src/content/connections.js`**:

- `connections.contacts`: set `href` to your public URL, `mailto:your@email.com`, or `tel:+353...`. Set `value` to the address/handle/number you want displayed. Resume accepts a local `/assets/documents/resume.pdf` path. Blank entries show “Details coming soon” and are not clickable.
- `connections.projects`: add your projects, set `demo` to the live deployment URL and `repo` to the GitHub repository URL. Use full `https://` URLs. Only add repositories and demos that you are allowed to share publicly.
- `chapterMedia`: each chapter has a configured `src`, an example `placeholderPath`, `alt`, and `caption`. Put your file under `public/assets/images/`, then set its `src` to `/assets/images/your-file.jpg`. Update `alt` and `caption`. The framed graphic is a deliberate placeholder until a real image is supplied; it does not pretend to be a personal photograph.

Use tennis or early-years photos for the first card, a campus/graduation photo for college, a team shot for hackathons, project artefacts for research and engineering, and real travel/UCD photos for the later chapters. Do not include internal employer screenshots or identifying customer data.

The site now labels the players **Curiosity** and **Experience**. Both represent aspects of Himanshu's story, so the match is not a personal success/failure rating. The final point still completes the illustrative game; the final chapter and completion state invite recruiters to explore projects and connect about Dublin opportunities. Those shortcuts are available in the header from the start.

## Render deployment

`render.yaml` configures a Render Static Site named `himanshu-life-court`. It runs `npm ci && npm run build` and publishes `dist/`; `SKIP_INSTALL_DEPS=true` avoids duplicate automatic installation. No paid compute service, backend, database, or application secrets are required.

After the repository is connected to Render, create a Blueprint from it to use this configuration. Alternatively create a Static Site with the same build/publish settings. The Render connection and a destination GitHub repository must be available before this workspace can be published.

## Between Points: personal stories

Open **Between Points** from the Life Court header or visit `/?view=blog`. The collection contains Hostel Life and Hum Paanch; Trips is marked Coming soon. Individual stories have shareable query URLs: `/?view=blog&story=hostel` and `/?view=blog&story=family`. These work without server-side route rewrites.

### Edit writing

Full supplied texts live in `src/content/stories/hostel.md` and `src/content/stories/family.md`. Use `#` for the article title, `###` for section headings, blank lines between paragraphs, and `**bold**` / `*italic*` for emphasis. Text is rendered safely without raw HTML. Reading time is calculated automatically.

### Add or change media

Files live in `public/assets/images/blog/`. Their paths, captions, alt text, story order and publication status are in `src/content/lifeBlog.js`. The `sectionMedia` keys must exactly match the corresponding Markdown section headings. Each section accepts any number of media entries. Update captions and alternative text there if more specific context is needed.

The supplied `family-cover.HEIC` has a JPEG copy for browsers; the original remains untouched. `hostel-food.mp4` is supported as video with controls, muted looping playback when visible, and automatic pausing offscreen. Reduced-motion visitors start it manually. Photos retain their full proportions and open in a keyboard-accessible viewer.

### Add another story

1. Create `src/content/stories/my-story.md` with the same heading structure.
2. Import it in `lifeBlog.js`: `import myStoryText from './stories/my-story.md?raw';`.
3. Copy a published story object in `stories` and give it a unique `id`, title, subtitle, label and teaser. Set `text: myStoryText` and `status: 'published'`.
4. Set its `cover`, two `keepsakes`, `sectionMedia` and `closing` quote. Reuse the `photo('filename.jpg', 'Caption', 'Alternative text')` helper. Place files in the blog media folder.
5. Preview the collection and `/?view=blog&story=my-story`. No component edits are required. To announce a future story, use `status: 'coming-soon'` with just an id, title, subtitle and label.

Nothing is committed or pushed until instructed.

## Add another project — only one content file needs editing

1. Open `src/content/connections.js` and find `connections.projects`.
2. Add an object inside the `projects: [ ... ]` array, separated from its neighbours by commas:

   ```js
   {
     id: 'my-new-project',
     title: 'My new project',
     category: 'DATA ENGINEERING',
     description: 'Explain the problem, what you built, and a result you can substantiate.',
     repo: 'https://github.com/HimanshuBaheti/your-repository',
     demo: 'https://your-live-demo.example.com',
     image: '',
   },
   ```

3. Give every project a unique `id`. The array order is the display order. Use real full HTTPS links; leave `repo` or `demo` as `''` when unavailable. Those links display as coming soon. The `image` field is currently reserved and is not rendered by the project panel.
4. No component, routing, or CSS changes are needed. `src/prototype/ConnectionsPanel.jsx` renders every entry automatically.
5. Run `npm run dev`, open **Selected work**, and check the copy and both links. Run `npm run build` before publishing.

Local edits do not update the live site until they are committed and pushed. These changes are being kept local pending your instruction.

## Finding your way around Life Court

The start button explains the watch → read → continue sequence. Visitors can also choose any chapter from the chapter library without changing the match score. Opening a chapter preview pauses a running rally; closing it leaves the rally paused until the visitor explicitly resumes. Between Points is a growing personal story collection accessible without playing the match.
