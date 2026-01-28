---
layout: page
title: Engineering Knowledge Base
permalink: /slides/
description: "A collection of technical deep dives, architectural patterns, and AI research notes curated for the engineering community."
---

Welcome to my personal archive of technical presentations and architectural studies. 

This repository reflects my continuous journey in Software Engineering and Artificial Intelligence. The goal of this open collection is to **contribute to the engineering community** by synthesizing complex topics into structured, digestible modules. These materials are the result of years of hands-on experience and deep research, shared freely to help peers accelerate their own technical paths.

---

### 🧠 The Agentic Path: AI Research Series
A structured exploration of Large Language Models, from foundational mathematics to advanced autonomous agent orchestration. These modules represent my current research focus on bridging the gap between stochastic models and deterministic software engineering.

<div class="cf frame">
  {% comment %} 
    Filters posts from 'ai-tutoring' category to display specific AI modules.
  {% endcomment %}
  {% assign tutoring_posts = site.posts | where: "category", "ai-tutoring" | sort: "module_number" %}
  
  {% for item in tutoring_posts %}
      <article class="post" itemscope itemtype="http://schema.org/BlogPosting" role="article" style="margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 20px;">
        <div class="article-item">
          <header class="post-header">
            <h3 class="post-title" itemprop="name" style="font-size: 1.4em; margin-bottom: 5px;">
              <a href="{{ item.url | prepend: site.baseurl }}" itemprop="url" style="text-decoration: none;">
                <span style="color: #FFD700; font-family: monospace;">[MOD-0{{ item.module_number }}]</span> {{ item.title | remove: "🖥️ Click here - " }}
              </a>
            </h3>
          </header>
          <section class="post-excerpt" itemprop="description" style="color: #aaa; font-size: 0.95em;">
            <p>{{ item.content | strip_html | truncatewords: 40 }}</p>
          </section>
        </div>
      </article>
  {% endfor %}
</div>

---

### 🛠️ Technical Deep Dives, Systems Engineering & System Architecture
General presentations focused on Software Engineering, Machine Learning, SRE, Chaos Engineering and High-Stakes Infrastructure.

<div class="cf frame">
  {% comment %} 
  Robust Logic:
  1. Aggregates posts and slides.
  2. Filters only what has the "slides" layout.
  3. EXCLUDES any item whose category contains the word "ai-tutoring".
  This acts as a Regex /ai-tutoring/ and prevents exact typos.
  {% endcomment %}
  
  {% assign all_slides = site.posts | concat: site.slides | where: "layout", "slides" %}
  
  {% for item in all_slides %}
    
    {% comment %} Captures the category and converts it to lowercase for reliable comparison. {% endcomment %}
    {% assign item_cat = item.category | downcase %}
    
    {% comment %} 
      The magic happens here: 'unless' is the opposite of 'if'.
      It only executes if the category does NOT contain "ai-tutoring".
      This covers "ai-tutoring", "ai-tutoring-module", "AI-Tutoring", etc.
    {% endcomment %}
    {% unless item_cat contains "ai-tutoring" %}
    
      <article class="post" itemscope itemtype="http://schema.org/BlogPosting" role="article" style="margin-bottom: 15px;">
        <div class="article-item">
          <header class="post-header">
            <h4 class="post-title" itemprop="name" style="margin-bottom: 5px;">
              <a href="{{ item.url | prepend: site.baseurl }}" itemprop="url" style="text-decoration: none; border-bottom: 1px dotted #666;">
                {{ item.title }}
              </a>
            </h4>
          </header>
          <section class="post-excerpt" itemprop="description" style="color: #888; font-size: 0.9em;">
             {% comment %} 
              If the content is raw slide markdown (with '---'),
              strip_html may fail to clear. We further restrict truncate.
             {% endcomment %}
            <p>{{ item.content | strip_html | truncatewords: 20 }}</p>
          </section>
        </div>
      </article>

    {% endunless %}
  {% endfor %}
</div>
---

### 🤝 Community & Philosophy
Knowledge grows when shared. This page serves as a "living document" of my studies.

* **Continuous Learning:** These modules are updated as the technology landscape evolves (e.g., from Transformer architecture to Agentic Frameworks).
* **Open Access:** All materials here are available for study and reference.
* **Collaborative Growth:** Feedback and technical discussions are always welcome to refine these concepts.

> *"We are standing on the shoulders of giants. This is my way of adding a small step to the ladder."*

---