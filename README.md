# CaseCraft — Classical Homeopathic Case-Taking & SBAR Handover Simulator

**CaseCraft** is an interactive, clinical simulation workstation designed to train homeopathic physicians and interns in classical Hahnemannian case-taking (Organon of Medicine, Aphorisms 83–104).

## Architecture & Core Features

- **Dual-Agent Architecture:**
  - **Agent A (Simulated Patient):** Roleplays authentic patients with hidden clinical truths (Location, Sensation, Modalities, Thermals, Thirst, Mental Disposition) revealed only through non-leading inquiry (Aphorism 84).
  - **Agent B (Senior Mentor Proctor):** Generates rigorous clinical scorecards evaluating case-taking accuracy, bias avoidance, repertorial completeness, and provisional prescription totality.
- **Consultation Arena:** Interactive chat with voice dictation, non-leading probe shortcuts, and clinical progress checklist.
- **Hahnemannian Case Sheet Proforma:** Multi-tab proforma with demographic intake, LSMC breakdown, physical generals, and Kentian mental synthesis.
- **Kentian Rubric Command Palette:** Integrated repertorial lookup palette (`Cmd+K` / `Ctrl+K`) for rapid case analysis.
- **60-Second SBAR Handover Drill:** Rapid clinical communication trainer to prepare interns for hospital shift handovers.
- **Infinite Dynamic Case Generator:** Dual-agent AI generation of novel clinical scenarios across 5 pathological domains.

## Development & Testing

```bash
# Start local development server
npm run dev

# Run production build
npm run build

# Run ESLint validation
npm run lint

# Run clinical 500-case interaction test suite
npm run test:clinical -- --mock
```
