# App Sciences landing page

Tracking: [Issue #16](https://github.com/appsciences/appsci/issues/16).

## Purpose and source

Make App Sciences' business-app lineup and SDLC Orchestration approach discoverable from the root homepage. The user chose the existing `client-work.html` as the design/content source: preserve its dark monospaced hero, lavender accents, grouped product index, full-height desktop product sections, client entries, and keyboard navigation bar. `public/index.html` is the single canonical homepage. The original untracked source remains untouched in the user's checkout until the publishing task archives it.

## Content

- Feature spec-dude (living intent, specification coverage and ambiguity), auth-dude (authorization policies and explainable access), and training-dude (training from approved knowledge and software changes).
- Include crm-dude, notedude, and todude as relevant business/productivity tools.
- Use conservative editorial stage labels: Exploration for spec-dude/training-dude, In development for auth-dude/notedude, Prototype for crm-dude/todude. These are not release or availability claims. No unverified product URLs or signup buttons.
- Label illustrative previews as concept sketches. Do not portray them as live apps or actual product screenshots.
- Preserve vendorbuddy, algotrade, and predictmarket in the separate client-work group with their existing descriptions.
- Explain the six stages: facilitated discovery, living specification, tests before implementation, independent model/engineering review, QA of an exact build, and release/training/feedback.
- Distinguish engineering approval, QA acceptance, and release authorization.
- Preserve the invitation form and `/meet` destination. Keep the existing client-work footer identity and contact links.

Copy is grounded in the user's prior SDLC/discovery/spec-coverage discussion, the local authorization console README, InstantTraining proposal, CRM product specification, and existing task/notes projects. These sources inform positioning; they do not establish that every proposed feature is shipped. Client engagements remain separate from App Sciences product ownership.

## Behavior and accessibility

- All copy, navigation, stages, and previews are present in HTML and usable with JavaScript disabled.
- Product index anchors navigate to named sections; native disclosures expose methodology details.
- A visible-on-focus skip link moves keyboard focus to the main content.
- `j`/`k` move through products and methodology; `1`–`9` select products. Native link and disclosure activation must not be intercepted. Modified shortcuts and editable controls retain their browser behavior.
- Reduced motion disables smooth scrolling, scroll snapping, and motion effects.
- Content fits 320px through desktop widths without horizontal overflow. On mobile, product sections stack naturally and the fixed shortcut bar does not obscure the footer.

## Verification and delivery

- Write acceptance tests before implementation and confirm a failure on the old homepage.
- Validate homepage HTML, JavaScript syntax, and formatting. There is no TypeScript or business-logic layer requiring separate type/unit tests; browser integration and end-to-end tests cover the actual behavior.
- Run Playwright in Chromium and WebKit at desktop and mobile sizes, including keyboard navigation, disclosure controls, no-JavaScript use, local resources, anchors, content/stages, and narrow layouts.
- Both Firebase PR preview and main deployment depend on the same passing checks. Existing Firebase routes and other public files stay unchanged.
- Record exact-commit preview QA on the PR. The separate user-authorized publishing task handles engineering review, release authorization, merge, and production verification. Automated checks do not imply independent human approval.
