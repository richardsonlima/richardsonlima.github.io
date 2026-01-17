---
layout: page
title: Deep
permalink: /deep/
---

# 🕳️ Deep Dives
*Exploring the intersections of cognitive architecture, phenomenology, and high stakes systems.*

This section is dedicated to long-form essays, technical slides, and profound explorations. Here, I trade surface level speed for **informational density** investigating the invisible geometries that bind music, philosophy, and the human mind. 

In this space, we move beyond the *narrative self* to explore the *experiential self*. We investigate:
* **Metacognition:** The structural observation of our own thought and feeling processes.
* **Deep Psychology:** The access to pre-symbolic and archetypal layers of the human psyche.
* **Ontology:** The fundamental nature of being and existence, often found in the silence between notes.

<main class="content" role="main">
    <div class="cf frame">
      {% for post in site.posts %}
        {% if post.layout == "slides" %}
          <article class="post" itemscope itemtype="http://schema.org/BlogPosting" role="article">
            <div class="article-item">
              <header class="post-header">
                <h2 class="post-title" itemprop="name">
                  <a href="{{ post.url | prepend: site.baseurl }}" itemprop="url">{{ post.title }}</a>
                </h2>
              </header>
              <section class="post-excerpt" itemprop="description">
                <p>{{ post.content | strip_html | truncatewords: 30 }}</p>
              </section>
              <div class="post-meta">
                <time datetime="{{ post.date | date_to_long_string }}">{{ post.date | date_to_long_string }}</time>
              </div>
            </div>
          </article>
        {% endif %}
      {% endfor %}
    </div>
</main>