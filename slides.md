---
layout: page
title: Presentations
permalink: /slides/
---

Below is a curated collection of my technical presentations and the AI Tutoring program.

---

### 🧠 AI Tutoring: The Agentic Path
<div class="cf frame">
  {% comment %} We only list items from _posts to avoid duplicates {% endcomment %}
  {% assign tutoring_posts = site.posts | where: "category", "ai-tutoring" | sort: "module_number" %}
  
  {% for item in tutoring_posts %}
      <article class="post">
        <div class="article-item">
          <header class="post-header">
            <h2 class="post-title">
              <a href="{{ item.url | prepend: site.baseurl }}">
                <span style="color: #FFD700;">Module {{ item.module_number }}:</span> {{ item.title }}
              </a>
            </h2>
          </header>
          <section class="post-excerpt">
            <p>{{ item.content | strip_html | truncatewords: 30 }}</p>
          </section>
        </div>
      </article>
  {% endfor %}
</div>

---

### 🛠️ Technical Deep Dives
<div class="cf frame">
  {% assign general_slides = site.slides | where_exp: "item", "item.category != 'ai-tutoring'" %}
  {% for item in general_slides %}
      <article class="post">
        <div class="article-item">
          <header class="post-header">
            <h2 class="post-title"><a href="{{ item.url | prepend: site.baseurl }}">{{ item.title }}</a></h2>
          </header>
        </div>
      </article>
  {% endfor %}
</div>

---

### 🚀 Roadmap to Mastery
I am currently distilling these modules into a **comprehensive E-book and a deep-dive course for AI Founders and Engineers**. 
The goal is to move beyond simple prompts into **Agentic Architecture**: designing digital ecosystems that scale human and machine potential.

* **Phase 1:** YouTube Mini-course (The English Version) - *In Progress*
* **Phase 2:** "The Geometry of Intelligence" E-book.
* **Phase 3:** Full Professional Certification on Udemy.