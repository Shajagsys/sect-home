---
name: seo-optimization
description: Audits and implements complete technical and on-page SEO for web projects. Use when auditing, fixing, improving, or implementing SEO including metadata, canonical URLs, robots.txt, XML sitemaps, structured data, Open Graph, Twitter metadata, headings, image SEO, internal linking, indexability, local SEO, and SEO performance.
---

# SEO Optimization Skill

## Objective

Act as a senior technical SEO engineer and web developer.

Your job is to audit and implement SEO correctly across the entire project while preserving:

- Existing UI
- Existing UX
- Existing business logic
- Existing functionality
- Existing routes
- Existing API behavior
- Existing database behavior
- Existing animations
- Existing design

Do not make unnecessary design changes.

SEO implementation must be based on the actual project structure and content.

---

# STEP 1 — Understand the Project

Before changing anything:

1. Inspect the complete project structure.
2. Read `package.json`.
3. Identify the framework.
4. Identify the routing architecture.
5. Identify all public routes.
6. Identify all private routes.
7. Identify dynamic routes.
8. Inspect existing metadata.
9. Inspect existing sitemap implementation.
10. Inspect existing robots implementation.
11. Inspect existing canonical URLs.
12. Inspect existing structured data.
13. Inspect Open Graph metadata.
14. Inspect Twitter metadata.
15. Inspect image handling.
16. Inspect existing SEO-related utilities/components.

Do not modify files during the initial investigation.

---

# STEP 2 — Build an SEO Route Map

Create an internal route inventory.

For every route determine:

- URL
- Public/private
- Should be indexed?
- Title
- Description
- H1
- Canonical
- Robots
- Open Graph
- Twitter metadata
- Structured data
- Sitemap inclusion
- Internal links
- Important images

Do not index private application pages.

Typical private pages may include:

- `/admin`
- `/dashboard`
- `/login`
- `/signup`
- `/account`
- `/settings`
- `/api`

However, never assume these paths exist.

Inspect the actual project.

---

# STEP 3 — Metadata

Every important indexable page must have unique metadata.

Implement:

- Title
- Meta description
- Canonical
- Robots
- Open Graph
- Twitter metadata

Titles must:

- Describe the actual page
- Match search intent
- Be unique
- Avoid keyword stuffing
- Naturally include the brand

Descriptions must:

- Describe the actual page
- Be unique
- Match the page content
- Naturally contain important terms
- Encourage useful clicks

Never create spammy metadata.

Bad:

"Best SEO Company Best SEO Services Cheap SEO SEO Expert SEO Agency"

Good:

"Professional cybersecurity services including VAPT, web security, mobile security and secure code review."

---

# STEP 4 — Next.js Implementation

If the project uses Next.js App Router:

Prefer the native Next.js metadata system.

Use:

- `app/layout.tsx`
- `metadata`
- `generateMetadata()`
- `app/robots.ts`
- `app/sitemap.ts`

when appropriate.

Use `generateMetadata()` for dynamic pages.

Use `metadataBase` with the actual production domain.

Never use:

`localhost`

as a production canonical or metadata domain.

Determine the production domain from the project configuration before implementing it.

---

# STEP 5 — Canonical URLs

Every indexable page should have the correct canonical URL.

Check:

- HTTPS
- www/non-www consistency
- Trailing slash consistency
- Query parameters
- Dynamic routes
- Duplicate routes

Do not point every canonical URL to the homepage.

The canonical must represent the actual page.

---

# STEP 6 — Robots.txt

Create or fix `robots.txt`.

Allow legitimate public content.

Block private/internal routes when appropriate.

Do not accidentally block:

- CSS
- JavaScript
- Images
- Important public pages

Include the production sitemap URL.

Do not blindly copy a robots.txt template.

Inspect the actual project routes first.

---

# STEP 7 — XML Sitemap

Create or fix the XML sitemap.

Include only pages that should be indexed.

Do not include:

- Admin pages
- Login pages
- Dashboard pages
- API routes
- 404 pages
- Redirect URLs
- Noindex pages
- Duplicate URLs

For Next.js App Router, prefer native sitemap functionality.

Dynamic pages should be included when they are genuinely indexable.

Verify the sitemap uses the production domain.

---

# STEP 8 — Heading Structure

Every important public page should have:

- One meaningful H1
- Logical H2 sections
- H3 sections when needed

Check for:

- Missing H1
- Multiple unnecessary H1 elements
- Broken heading hierarchy
- Headings used only for visual styling

Preserve the existing visual design.

Use CSS if visual appearance needs to remain unchanged.

---

# STEP 9 — Structured Data

Inspect the project and determine which schema types are actually appropriate.

Possible schema types:

- Organization
- LocalBusiness
- ProfessionalService
- WebSite
- WebPage
- Service
- BreadcrumbList
- Article
- FAQPage
- Product
- JobPosting
- Person

Only implement schema supported by the actual visible content.

Never fabricate:

- Reviews
- Ratings
- Prices
- Addresses
- Awards
- Business claims

Structured data must accurately represent the page.

---

# STEP 10 — Open Graph

Implement Open Graph metadata for important public pages.

Use:

- `og:title`
- `og:description`
- `og:type`
- `og:url`
- `og:image`
- `og:site_name`

Verify that referenced images actually exist.

Never create fake image URLs.

---

# STEP 11 — Twitter/X Metadata

Implement when appropriate:

- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`

Prefer:

`summary_large_image`

when an appropriate social image exists.

---

# STEP 12 — Image SEO

Inspect important images.

Check:

- Alt text
- Dimensions
- Responsive behavior
- Lazy loading
- Priority loading
- Image optimization
- Meaningful filenames where practical

Alt text must describe the image naturally.

Do not keyword stuff alt attributes.

Bad:

`alt="best security company cybersecurity security services"`

Good:

`alt="Security professional reviewing a cybersecurity dashboard"`

Decorative images may use empty alt text.

Do not change the visual appearance of images unnecessarily.

---

# STEP 13 — Internal Linking

Audit internal links.

Important pages should be discoverable through internal links.

Create logical connections between:

- Home
- About
- Services
- Products
- Resources
- Blog
- Contact
- Important landing pages

Use descriptive anchor text.

Avoid excessive exact-match keyword anchors.

Check for orphan pages.

---

# STEP 14 — URL Structure

URLs should be:

- Readable
- Lowercase
- Meaningful
- Consistent
- Stable

Prefer:

`/services/web-security`

over:

`/services?id=123&type=web-security`

Do not change existing URLs unnecessarily.

If an existing URL must change, implement an appropriate redirect.

---

# STEP 15 — 404

Verify the project has a proper 404 page.

It should:

- Return HTTP 404
- Help users navigate
- Link to important pages
- Link to homepage
- Not be indexed

Never redirect every invalid URL to the homepage.

---

# STEP 16 — Private Pages

Identify pages that should not appear in search engines.

Depending on the actual project, these may include:

- Login
- Signup
- Admin
- Dashboard
- Account
- Internal search
- Private application pages

Use appropriate robots/noindex behavior.

Do not apply noindex to important public pages.

---

# STEP 17 — Dynamic Routes

For every dynamic route:

1. Determine whether it should be indexed.
2. Generate unique metadata.
3. Generate correct canonical.
4. Include valid pages in sitemap.
5. Handle invalid pages with proper 404 behavior.
6. Prevent infinite parameter combinations from becoming indexable.

Do not blindly index every dynamic URL.

---

# STEP 18 — Local SEO

If this project represents a local business:

Check:

- Business name
- Phone
- Address
- Service area
- Business description
- Opening hours
- Contact information

Use appropriate LocalBusiness/ProfessionalService structured data.

Never invent business information.

Keep business information consistent throughout the website.

---

# STEP 19 — Content SEO

Review important page content.

Make sure:

- Content matches search intent
- H1 matches the page topic
- Important services are clearly explained
- Content is useful
- Content is readable
- Keywords occur naturally
- There is no keyword stuffing
- There are no fabricated claims

Do not create large amounts of meaningless SEO text.

---

# STEP 20 — Performance SEO

Inspect major performance issues affecting SEO.

Check:

- LCP
- CLS
- INP
- Image optimization
- JavaScript bundle size
- Client components
- Font loading
- Third-party scripts
- Lazy loading
- Code splitting

Fix high-impact issues first.

Do not rewrite functioning architecture for insignificant theoretical gains.

---

# STEP 21 — Mobile SEO

Check:

- Responsive layout
- Viewport
- Mobile navigation
- Text readability
- Button usability
- No horizontal overflow
- Image responsiveness

Do not break the desktop layout.

---

# STEP 22 — Accessibility

Check:

- Semantic HTML
- Image alt text
- Form labels
- Button labels
- Navigation landmarks
- Heading hierarchy
- Keyboard accessibility

Improve accessibility where it also improves semantic SEO.

---

# STEP 23 — Duplicate Content

Look for:

- Duplicate pages
- Duplicate metadata
- Duplicate titles
- Duplicate descriptions
- Multiple URLs for the same content

Choose the appropriate solution:

- Canonical
- Redirect
- Noindex
- Content consolidation

Do not solve every issue using noindex.

---

# STEP 24 — Implementation Rules

Before changing existing SEO:

1. Inspect the current implementation.
2. Understand why it exists.
3. Identify the actual problem.
4. Make the smallest safe change.
5. Preserve valid existing functionality.

Never blindly replace working SEO configuration.

---

# STEP 25 — Validation

After implementation run available checks.

Use:

```bash
npm run lint

and:

npm run build

If a script does not exist, do not invent it.

Also inspect:

/robots.txt
/sitemap.xml

Verify:

Valid XML sitemap
Correct production URLs
Correct robots rules
Correct metadata
Correct canonical URLs
No accidental noindex
No broken routes
STEP 26 — Final Route Audit

After implementation, audit every important public route again.

For every route verify:

Title
Description
H1
Canonical
Robots
Open Graph
Twitter
Structured data
Sitemap inclusion
Internal links
Image alt text
Indexability
STEP 27 — Final Report

At the end provide a concise report containing:

Files Changed

List every modified/created file.

SEO Problems Found

List important issues discovered.

SEO Problems Fixed

List the fixes implemented.

Routes Audited

List the routes checked.

Validation

Report:

Lint result
Build result
Sitemap result
Robots result
Metadata result
Structured-data result
Remaining Issues

Clearly identify anything that could not be fixed automatically.

Critical Rules

NEVER:

Keyword stuff
Invent business information
Invent reviews
Invent ratings
Invent schema data
Use localhost in production SEO
Add fake backlinks
Generate spam content
Break existing functionality
Change business logic unnecessarily
Redesign the website unnecessarily
Add noindex to important public pages
Add private pages to the sitemap
Add API routes to the sitemap
Point every canonical to the homepage

ALWAYS:

Inspect first
Audit before modifying
Use the actual project architecture
Preserve existing functionality
Use unique metadata
Use correct canonical URLs
Generate a clean sitemap
Configure robots correctly
Use truthful structured data
Validate the implementation
Run lint/build when available