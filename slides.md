---
layout: page
title: Presentations
permalink: /slides/
---

Below is a curated collection of my technical presentations, architectural deep dives, and the core curriculum of my AI Tutoring program.

---

### 🧠 AI Tutoring: The Agentic Path
This series represents a structured journey from the foundational mechanics of Transformers to the frontier of **Autonomous Multi-Agent Systems**. Designed for startups, AI agencies, and forward-thinking engineers, these modules provide a blueprint for building resilient agentic workflows.

<div class="cf frame">
  {% comment %} 
    Unificamos site.posts e site.slides para garantir que o Jekyll localize os arquivos
    e ordenamos estritamente pelo module_number definido no Front Matter.
  {% endcomment %}
  {% assign tutoring_modules = site.posts | concat: site.slides | where: "category", "ai-tutoring" | sort: "module_number" %}
  
  {% for item in tutoring_modules %}
      <article class="post" itemscope itemtype="http://schema.org/BlogPosting" role="article">
        <div class="article-item">
          <header class="post-header">
            <h2 class="post-title" itemprop="name">
              <a href="{{ item.url | prepend: site.baseurl }}" itemprop="url">
                <span style="color: #FFD700;">Module {{ item.module_number }}:</span> {{ item.title }}
              </a>
            </h2>
          </header>
          <section class="post-excerpt" itemprop="description">
            <p>{{ item.content | strip_html | truncatewords: 30 }}</p>
          </section>
          <div class="post-meta">
            <span class="post-tags-set">Level: {{ item.complexity }}</span>
          </div>
        </div>
      </article>
  {% endfor %}
</div>

---

### 🛠️ Technical Deep Dives & System Architecture
General presentations focused on Software Engineering, SRE, and High-Stakes Infrastructure.

<div class="cf frame">
  {% comment %} 
    Filtramos tudo que tem layout de slides mas NÃO é da categoria da tutoria.
  {% endcomment %}
  {% assign all_slides = site.posts | concat: site.slides | where: "layout", "slides" %}
  
  {% for item in all_slides %}
    {% if item.category != "ai-tutoring" %}
      <article class="post" itemscope itemtype="http://schema.org/BlogPosting" role="article">
        <div class="article-item">
          <header class="post-header">
            <h2 class="post-title" itemprop="name">
              <a href="{{ item.url | prepend: site.baseurl }}" itemprop="url">{{ item.title }}</a>
            </h2>
          </header>
          <section class="post-excerpt" itemprop="description">
            <p>{{ item.content | strip_html | truncatewords: 25 }}</p>
          </section>
        </div>
      </article>
    {% endif %}
  {% endfor %}
</div>

---

### 🚀 Roadmap to Mastery
I am currently distilling these modules into a **comprehensive E-book and a deep-dive course for AI Founders and Engineers**. 
The goal is to move beyond simple prompts into **Agentic Architecture**: designing digital ecosystems that scale human and machine potential.

* **Phase 1:** YouTube Mini-course (The English Version) - *In Progress*
* **Phase 2:** "The Geometry of Intelligence" E-book.
* **Phase 3:** Full Professional Certification on Udemy.