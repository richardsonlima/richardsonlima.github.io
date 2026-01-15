---
layout: page
title: Presentations
permalink: /slides/
---

Below is a collection of my technical presentations and deep dives in slide format.

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