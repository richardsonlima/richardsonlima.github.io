---
layout: page
title: Presentations
permalink: /slides/
---

Below is a curated collection of my technical presentations, architectural deep dives, and the core curriculum of my AI Tutoring program.

---

### 🧠 AI Tutoring: The Agentic Path
This series represents a structured journey from the foundational mechanics of Transformers to the frontier of Autonomous Multi-Agent Systems. Originally designed for internal engineering teams, these modules are being expanded into a comprehensive public curriculum.

<div class="cf frame">
  {% for post in site.posts %}
    {% if post.layout == "slides" and post.category == "ai-tutoring" %}
      <article class="post" itemscope itemtype="http://schema.org/BlogPosting" role="article">
        <div class="article-item">
          <header class="post-header">
            <h2 class="post-title" itemprop="name">
              <a href="{{ post.url | prepend: site.baseurl }}" itemprop="url">
                <span style="color: #FFD700;">Module {{ post.module_number }}:</span> {{ post.title }}
              </a>
            </h2>
          </header>
          <section class="post-excerpt" itemprop="description">
            <p>{{ post.content | strip_html | truncatewords: 30 }}</p>
          </section>
          <div class="post-meta">
            <span class="post-tags-set">Level: {{ post.complexity }}</span>
          </div>
        </div>
      </article>
    {% endif %}
  {% endfor %}
</div>

---

### 🛠️ Technical Deep Dives & System Architecture
General presentations focused on Software Engineering, SRE, and High-Stakes Infrastructure.

<div class="cf frame">
  {% for post in site.posts %}
    {% if post.layout == "slides" and post.category != "ai-tutoring" %}
      <article class="post" itemscope itemtype="http://schema.org/BlogPosting" role="article">
        <div class="article-item">
          <header class="post-header">
            <h2 class="post-title" itemprop="name">
              <a href="{{ post.url | prepend: site.baseurl }}" itemprop="url">{{ post.title }}</a>
            </h2>
          </header>
          <section class="post-excerpt" itemprop="description">
            <p>{{ post.content | strip_html | truncatewords: 25 }}</p>
          </section>
        </div>
      </article>
    {% endif %}
  {% endfor %}
</div>

---

### 🚀 Roadmap to Mastery
I am currently distilling these presentations into a **comprehensive E-book and a deep-dive course on Udemy**. 
The goal is to move beyond "Prompt Engineering" into **Agentic Architecture**: designing digital environments that scale human potential.

* **Phase 1:** YouTube Mini-course (English) - *Coming soon*
* **Phase 2:** "The Geometry of Intelligence" E-book.
* **Phase 3:** Full Professional Certification on Udemy.