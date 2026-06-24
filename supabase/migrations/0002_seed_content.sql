-- ===========================================================================
-- Starter content for Michael John Aguilar's portfolio.
--
-- Run this ONCE in the Supabase SQL editor AFTER 0001_init.sql, to pre-fill the
-- site with his real details (from his resume). After he starts editing pages
-- in /admin, do NOT run this again — it overwrites the home/about/contact
-- pages with these starter versions.
--
-- He adds his actual design images himself: /admin -> "Work" page ->
-- "Selected Work" gallery block -> Add image.
-- ===========================================================================

-- Site identity ------------------------------------------------------------
update public.site_settings
set site_title = 'Michael John Aguilar',
    tagline    = 'Digital Media Artist & Graphic Designer — Negros Occidental',
    socials    = '{"facebook":"https://facebook.com/miiiijii.aguilar","instagram":"","email":"michaeljohnaguilar.work@gmail.com"}'::jsonb;

insert into public.site_settings (site_title, tagline, socials)
select 'Michael John Aguilar',
       'Digital Media Artist & Graphic Designer — Negros Occidental',
       '{"facebook":"https://facebook.com/miiiijii.aguilar","instagram":"","email":"michaeljohnaguilar.work@gmail.com"}'::jsonb
where not exists (select 1 from public.site_settings);

-- Pages --------------------------------------------------------------------
insert into public.pages (slug, title, nav_order, published, show_in_nav, content)
values
  ('home', 'Work', 0, true, true,
   '[
     {"id":"home-hero","type":"hero","eyebrow":"Hi, I am","heading":"Michael John Aguilar","subheading":"Digital Media Artist & Graphic Designer based in Negros Occidental.","align":"center","ctaText":"Get in touch","ctaUrl":"/contact"},
     {"id":"home-intro","type":"rich_text","align":"center","text":"Fine Arts graduate majoring in Digital Media Arts — creating logos, shirt graphics, digital illustrations, and murals for brands and creators."},
     {"id":"home-work","type":"gallery","heading":"Selected Work","columns":3,"images":[]},
     {"id":"home-albums","type":"image_album","heading":"Collections","albums":[{"id":"album-tshirt","title":"T-Shirt Designs","images":[]},{"id":"album-canvas","title":"Canvas Paintings","images":[]}]}
   ]'::jsonb),

  ('about', 'About', 1, true, true,
   '[
     {"id":"about-bio","type":"profile","eyebrow":"My Biography","heading":"Digital Media Artist & Graphic Designer","body":"Creative and detail-oriented Fine Arts graduate majoring in Digital Media Arts, with experience in graphic design, digital illustration, and multimedia content creation. Skilled in creating engaging visual designs for digital and print platforms.","details":[{"label":"Name","value":"Michael John Aguilar"},{"label":"Email","value":"michaeljohnaguilar.work@gmail.com"},{"label":"Phone","value":"0945 386 9496"},{"label":"Location","value":"E.B. Magalona, Negros Occidental"}],"ctaText":"","ctaUrl":""},
     {"id":"about-div1","type":"divider"},
     {"id":"about-skills","type":"columns","columns":[
        {"heading":"Creative","text":"Graphic Design & Digital Illustration\nMural & Visual Arts\nMultimedia Content Creation\nLogo & Shirt Design"},
        {"heading":"Technical","text":"Data Encoding & Verification\nData Quality Control & Compliance\nMicrosoft Office & Google Workspace\nEmail & File Management"}
     ]},
     {"id":"about-div2","type":"divider"},
     {"id":"about-exp","type":"rich_text","heading":"Experience","text":"Data Encoder — Woflow Inc. (2022–2026)\nEncoded and verified merchant transaction data to maintain a 99% accuracy rate. Managed reports, merchants, and archives, and trained new encoders to ensure compliance with standards.\n\nPersonal Assistant — Jonathan Berg (2021–2022)\nManaged email correspondence, schedules, and documents while maintaining confidentiality and smooth daily operations.\n\nFreelance Graphic Designer — Keep Up Marketing (2018–2021)\nDesigned 100+ logos and shirt graphics for small businesses and YouTube creators, plus posters, banners, and packaging.\n\nArtist — Audacity Studio (2018–2019)\nContributed to mural projects and studio installations, taking visual design projects from concept to completion."},
     {"id":"about-div3","type":"divider"},
     {"id":"about-edu","type":"rich_text","heading":"Education","text":"Bachelor of Science in Digital Media Arts (DMA)\nLa Consolacion College — Bacolod, 2019 · Best in Research Thesis Paper\n\nComputer Engineering (one year)\nColegio San Agustin — Bacolod City, 2014–2015"}
   ]'::jsonb),

  ('contact', 'Contact', 2, true, true,
   '[
     {"id":"contact-head","type":"rich_text","heading":"Contact","text":"Let''s work together.\n\nEmail: michaeljohnaguilar.work@gmail.com\nPhone: 0945 386 9496\nLocation: E.B. Magalona, Negros Occidental"}
   ]'::jsonb)
on conflict (slug) do update
set title       = excluded.title,
    nav_order   = excluded.nav_order,
    published   = excluded.published,
    show_in_nav = excluded.show_in_nav,
    content     = excluded.content;
