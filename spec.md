# App Sciences landing page

Tracking: [Issue #16](https://github.com/appsciences/appsci/issues/16).

Assistant-native positioning and community follow-up: [Issue #18](https://github.com/appsciences/appsci/issues/18).

## Purpose and source

Make App Sciences' business-app lineup and SDLC Orchestration approach discoverable from the root homepage. The user chose the existing `client-work.html` as the design/content source: preserve its dark monospaced hero, lavender accents, grouped product index, full-height desktop product sections, client entries, and keyboard navigation bar. `public/index.html` is the single canonical homepage. The original untracked source remains untouched in the user's checkout until the publishing task archives it.

## Content

- Feature spec-dude (living intent, specification coverage and ambiguity), auth-dude (authorization policies and explainable access), and training-dude (training from approved knowledge and software changes).
- Include crm-dude, notedude, and todude as relevant business/productivity tools.
- Preserve the development stage labels: Exploration for spec-dude/training-dude, In development for auth-dude/notedude, Prototype for crm-dude/todude. Format availability is supplied by the user in the follow-up; no plugin marketplace or installation URLs are invented.
- Every project, including all three client engagements, states that it is assistant-native and available as a Claude plugin, a ChatGPT plugin, and a standalone assistant-native web app. Explain that a prompt can run workflows and modify/update the app as needs change. Link each project to `https://postui.org/`.
- Feature the PostUI community near the top, before the project index, with a larger “AI is the new UI.” headline, an invitation to join the assistant-native community, and prominent links to `https://postui.org/` and `https://postui.org/manifesto`.
- Ground the short community summary in the existing PostUI manifesto source: intent in place of unnecessary navigation, tools/data/actions, useful visual interfaces, state and permissions, and learning through public teardowns and working pilots. Source: the local PostUI project's `public/manifesto.html` and `public/index.html`; public-site retrieval timed out during implementation, so the summary does not claim a live-source freshness check.
- Label illustrative previews as concept sketches. Do not portray them as live apps or actual product screenshots.
- Preserve vendorbuddy, algotrade, and predictmarket in the separate client-work group with their existing descriptions.
- Explain the six stages: facilitated discovery, living specification, tests before implementation, independent model/engineering review, QA of an exact build, and release/training/feedback.
- Distinguish engineering approval, QA acceptance, and release authorization.
- Preserve the invitation form and `/meet` destination. Keep the existing client-work footer identity and contact links.

Copy is grounded in the user's prior SDLC/discovery/spec-coverage discussion, the local authorization console README, InstantTraining proposal, CRM product specification, and existing task/notes projects. These sources inform positioning; they do not establish that every proposed feature is shipped. Client engagements remain separate from App Sciences product ownership.

## Behavior and accessibility

- All copy, navigation, stages, and previews are present in HTML and usable with JavaScript disabled.
- Community copy and all nine assistant-native project descriptions also work without JavaScript. The community headline remains more prominent than the brand heading on desktop and mobile; new content must not cause horizontal overflow or obscure navigation.
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
