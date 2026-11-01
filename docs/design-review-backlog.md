# Design review backlog

Follow-up to the Interface Craft critique of the practice and settings screens
(October 2026). The first two rounds of work shipped in
[#12](https://github.com/oerd/mate123/pull/12) (rebased onto `main`) and
[#13](https://github.com/oerd/mate123/pull/13). This document lists what is
still open, ordered by impact, so the remaining work can be picked up in
slices.

## Already done

| Area | Change | Where |
| --- | --- | --- |
| Practice | Answer revealed in green on success for every operation | #12 |
| Practice | Wrong picks turn red with a cross and stay disabled; other options stay tappable | #12 |
| Practice | Dimmed options use surface color instead of opacity + grayscale | #12 |
| Practice | Mascot reacts: happy, thinking, neutral | #12 |
| Practice | Ten-dot progress tray, streak badge, set-complete card | #12 |
| Practice | Disabled "New Problem" replaced by live "Skip" that becomes "Next" | #12 |
| Practice | Page scrolls on short viewports instead of clipping; smaller title | #12 |
| Practice | `--neo-mark` and `--neo-correct` tokens replace hard-coded purple and green | #12 |
| Both | Blurred drop shadows removed; hard offset shadow everywhere | #12 |
| Settings | Dead Catppuccin `ctp-*` classes replaced with `neo` tokens | #12 |
| Settings | Operation chips labelled; answer-count slider replaced by chips | #12 |
| Settings | Language chips with native names; orange is the one selected color | #12 |
| Settings | Icon stroke weights and tooltip sizes unified | #12 |
| Settings | Settings save on every change; Save button removed | #13 |
| Settings | Title and close button in a sticky header, never overlapping inputs | #13 |

## Priority 1: consequences of the recent changes

These are not from the original critique. They are side effects of autosave
and the new practice loop and should land before the next release.

1. **Validate number inputs before autosaving.** Clearing a Min or Max field
   parses to `0` and is written to storage immediately, and a Min greater
   than Max is silently swapped. Commit the value on blur or after a short
   debounce, clamp to the allowed range, and show an inline hint when the
   field is empty or out of range. Files: `app/settings/page.tsx`.
2. **Remove the duplicate exit from settings.** The sticky header's close
   button and the bottom "Back to practice" button are now both visible at
   the end of the page. Keep the sticky one and delete the bottom button.
3. **Pause auto-advance on touch.** Hovering the Next button pauses the
   two-second countdown, which is impossible on a tablet or phone. Make a
   tap on the solved card or the Next button toggle the pause, or lengthen
   the delay when the answer was reached after a miss. Note that
   [#11](https://github.com/oerd/mate123/pull/11) adds an auto-advance speed
   setting; coordinate so there is one mechanism.
4. **Persist set progress and streak across navigation.** Opening settings and
   coming back, or a reload, resets the tray and the streak to zero. Keep
   them in `sessionStorage` under the `math-practice:` prefix with a lazy
   initializer.
5. **Give the Next button a token color.** It uses raw `bg-green-200`; every
   other fill goes through a `neo` token. Add a `--neo-correct-soft` token
   or reuse `bg-neo-green` with the drain fill drawn in a darker shade.
6. **Check the practice header at 320px.** The progress tray, streak badge
   and gear share one row. On the narrowest phones they may wrap or overflow.
   Measure, and shrink the dots or hide the streak label below 360px if
   needed.

## Priority 2: critique items not yet done

7. **Teacher gate on the settings cog.** A child can open settings and change
   the operation set mid-session. Gate the cog with a hold-for-two-seconds
   press or a one-line arithmetic question, the pattern used by Khan Kids and
   Duolingo ABC. Keep the link itself keyboard reachable.
8. **"Settings from your teacher" banner on the practice page.** When the app
   is opened from a shared link, only the settings page says so. Show a
   one-line dismissible banner on the practice screen so the child, or the
   parent helping, knows the problems are the teacher's set.
9. **Stable label on the sort toggle.** The toggle reads "Randomize answer
   options" when off and "Sort answer options from smallest to largest" when
   on, so the label flips meaning as it is toggled. Use one label, "Sort
   answers from smallest to largest", with the switch state carrying on/off.
10. **Orange means two things.** Orange is the selected color on settings and
    also the task chip ("Round to the nearest 10", "Which sign fits?") on the
    practice card. Move the task chip to the pill color or a muted surface so
    orange keeps one meaning.
11. **Number line labels.** The dashed midpoint marker is unlabelled and the
    value label above the dot is about 17px on a phone. Label the midpoint,
    raise the label size, and in dark mode confirm the marker reads against
    the card.
12. **Comparison glyphs are small.** The `<`, `=` and `>` characters sit small
    inside the square buttons. Raise their size one step so they match the
    weight of the number pills.
13. **Visible focus ring everywhere.** Keyboard focus relies on the browser's
    default outline, which is black and disappears on the dark indigo ground.
    Add `focus-visible:ring-4 focus-visible:ring-neo-blue ring-offset-2` to
    answer buttons, chips, the gear and the close button.
14. **Respect reduced motion.** Confetti still fires and the card still hops
    and shakes under `prefers-reduced-motion`. Skip confetti and replace the
    hop and shake with a color pulse when the preference is set.
15. **Settings panel signature.** The pink full-screen panel and the 56px
    radius appear nowhere else in the app. Either make that a deliberate
    "teacher area" signature and document it, or bring the panel in line with
    the practice screen's white card on the yellow ground.
16. **Language chips.** The UK flag for English and the French chip orphaned on
    its own row on desktop are small but visible. Consider dropping the flags
    now that each chip carries the language name, which also fixes the wrap.
17. **Title as static chrome.** "Math Practice" earns little of the vertical
    space it takes on phones. Options: show the app name only on the
    set-complete card, or replace the title row with the progress tray so the
    card and pills can sit higher.

## Priority 3: uncommon care

18. **Richer set-complete card.** Show the best streak of the set and the
    number of first-try answers, so finishing ten feels like a result rather
    than a counter rolling over.
19. **Landscape layout.** On landscape phones the page now scrolls, which is
    correct but not ideal. Below about 500px of height, place the card on the
    left and the pills on the right so everything fits without scrolling.
20. **Typed answers.** `knowledge.md` says children can type the answer. The
    current screen has no input. Add number-key handling: digits build an
    answer, Enter submits, Escape clears, with the typed value shown in the
    equation's answer slot.
21. **Optional sounds.** A short tone for correct and a softer one for a miss,
    off by default, toggled in settings. Many children's apps pair the
    confetti with sound and the mascot reactions would land harder with it.
22. **Document the accent semantics.** Add a short note to `AGENTS.md`:
    orange is selected, the pill color is tappable, green is correct or on,
    red is wrong, blue is an action. The critique found four selected styles
    because this was never written down.

## Suggested slicing

- **Slice A (small, safe):** items 1, 2, 5, 9, 10, 13. Settings and token
  hygiene with no behavior change for children.
- **Slice B (practice loop):** items 3, 4, 6, 14, 18. Touch pause, persistence
  and reduced motion.
- **Slice C (teacher flow):** items 7, 8, 15, 16. Gate, shared-link banner and
  the settings panel's identity.
- **Slice D (ideas):** items 11, 12, 17, 19, 20, 21, 22.
