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
    Ajuste: Filtramos as apresentações da categoria ai-tutoring 
    e ordenamos numericamente pelo module_number 
  {% endcomment %}
  {% assign tutoring_modules = site.slides | where: "category", "ai-tutoring" | sort: "module_number" %}
  
  {% for slide in tutoring_modules %}
      <article class="post" itemscope itemtype="http://schema.org/BlogPosting" role="article">
        <div class="article-item">
          <header class="post-header">
            <h2 class="post-title" itemprop="name">
              <a href="{{ slide.url | prepend: site.baseurl }}" itemprop="url">
                <span style="color: #FFD700;">Module {{ slide.module_number }}:</span> {{ slide.title }}
              </a>
            </h2>
          </header>
          <section class="post-excerpt" itemprop="description">
            <p>{{ slide.content | strip_html | truncatewords: 30 }}</p>
          </section>
          <div class="post-meta">
            <span class="post-tags-set">Level: {{ slide.complexity }}</span>
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
    Aqui listamos slides que NÃO pertencem à tutoria de IA
  {% endcomment %}
  {% assign technical_slides = site.slides | where_exp: "item", "item.category != 'ai-tutoring'" %}
  
  {% for slide in technical_slides %}
      <article class="post" itemscope itemtype="http://schema.org/BlogPosting" role="article">
        <div class="article-item">
          <header class="post-header">
            <h2 class="post-title" itemprop="name">
              <a href="{{ slide.url | prepend: site.baseurl }}" itemprop="url">{{ slide.title }}</a>
            </h2>
          </header>
          <section class="post-excerpt" itemprop="description">
            <p>{{ slide.content | strip_html | truncatewords: 25 }}</p>
          </section>
        </div>
      </article>
  {% endfor %}
</div>

---

### 🚀 Roadmap to Mastery
I am currently distilling these presentations into a **comprehensive E-book and a deep-dive course on Udemy**. 
The goal is to move beyond "Prompt Engineering" into **Agentic Architecture**: designing digital environments that scale human potential.

* **Phase 1:** YouTube Mini-course (English) - *Coming soon*
* **Phase 2:** "The Geometry of Intelligence" E-book.
* **Phase 3:** Full comprehensive AI course.