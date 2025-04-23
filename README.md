Tasks:
- [ ] manifest initdata endpoint for app intialization and populate zustand state
- [X] Create an activity heat map + backend integration
    - [X] initially overlay on the peace map, as we scroll down it transitions to the peace map (by opacity 0)
- [ ] Create a conflict map + backend integration
- [x] Connect Zustand global state with io-socket events to update state
    - [X] listen to activeUsersUpdate and connect to intro page & LiveSlider
    - [X] listen to peaceCountUpdate and connect to intro page & LiveSlider
    - [ ] listen to peaceMapUpdate and connect to peace map page
    - [ ] listen to peaceMapDiffUpdate and connect to peace map page
    - [ ] listen to heatmapSnapshotUpdate and connect to heatmap page
    - [ ] listen to heatmapSnapshotDiffUpdate and connect to heatmap page
- [X] Connect global state with maps
    - [ ] connect to heatmap page
    - [ ] connect to peace map page
    - [ ] connect to conflict map page
- [ ] Add fingerprint JS
- [ ] Finish Footer
- [ ] Add CTA’s across the board
- [X] Hero Section Buttons - Pledge For Peace | Move To Decentralized Version( For Anonomyity)
- [X] Add coming soon countdown timer under 'move to decentralized version'
- [X] Transitions: Hero Section Activity HeatMap -> Peace Map with data + buttons for activity map | conflict map | peace map (enabled)

- [ ] Create the pledge flow
    - [ ] Move from the /auth to the /pledge
    - [ ] Add the contract sign step
    - [ ] Add location selection
    - [ ] Add the Success step
    - [ ] Add the background(peace map in blur)


Enhancements:
- [ ] Create a leaderboard + backend integration
- [ ] Create Mobile Version

Bugs:

Deployment:
- [ ] Deploy to production (Vercel, Netlify, Cloudflare)
