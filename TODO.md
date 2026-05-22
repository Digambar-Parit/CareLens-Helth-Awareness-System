# CareLens Premium AI Healthcare Frontend - TODO

## Step 1: Foundation (global theme + tokens)
- [x] Understand existing repo structure (shared global CSS + per-page CSS/JS)
- [ ] Update `carelens/css/style.css` to match the premium healthcare palette + depth
- [ ] Add premium UI primitives (glass shimmer, glow borders, pulse rings, reduced-motion support)



## Step 2: Shared UI consistency

- [ ] Normalize shared components in `style.css` (nav, buttons, chips, cards, sections, footer)
- [ ] Ensure assistant panel selectors are consistent across pages
- [ ] Add/standardize mobile nav + drawer behavior

## Step 3: Landing page (index.html)
- [ ] Redesign hero section layout polish + visual depth (without removing existing AI assistant)
- [ ] Add premium visuals (floating icons/SVG) + improved feature hierarchy

## Step 4: Dashboard (dashboard.html)
- [ ] Improve visual hierarchy + chart/widget styling
- [ ] Add hydration/stress/sleep widgets visuals + subtle animations

## Step 5: Detection (detection.html)
- [ ] Fix right-side scrolling + card alignment
- [ ] Improve symptom chips responsiveness + severity meter animation
- [ ] Add medical scan pulse overlay (layout-safe)

## Step 6: Reports (reports.html)
- [ ] Implement drag-and-drop scan/upload animation + OCR preview visuals
- [ ] Add animated medical cards + AI summary cards

## Step 7: Reminders (reminders.html)
- [ ] Redesign medicine cards + timeline alignment and spacing
- [ ] Add schedule visualization + progress trackers

## Step 8: Emergency (emergency.html)
- [ ] Improve SOS visual hierarchy + pulse glow effect
- [ ] Polish nearby hospitals / first aid cards

## Step 9: Nearby (nearby.html)
- [ ] Improve hospital/doctor cards (distance/rating UI)
- [ ] Make map placeholder premium

## Step 10: History (history.html)
- [ ] Create animated medical timeline + filters

## Step 11: Chatbot improvements
- [ ] Add/repair animated chatbot opening + typing animation + voice button presence

## Step 12: Performance + cleanup
- [ ] Unify upload/drag behaviors across pages where duplication conflicts exist
- [ ] Reduce animation overhead and honor prefers-reduced-motion
- [ ] Ensure JS is resilient to missing elements per page

