---
layout: slides
title: "Data Retrieval Systems: Building External Memory"
slides: ai-tutoring-module-04-data-retrieval.md
category: "ai-tutoring"
module_number: 4
complexity: "Intermediate / Systems"
---

<div style="background: linear-gradient(145deg, #1e1e1e, #252525); border: 1px solid #333; border-radius: 12px; padding: 25px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
    <span style="font-family: monospace; color: #FFD700; font-size: 0.8em; text-transform: uppercase; letter-spacing: 1px;">
      MODULE 0{{ page.module_number }}
    </span>
    <span style="background: #333; color: #aaa; padding: 4px 10px; border-radius: 4px; font-size: 0.75em; font-family: sans-serif;">
      {{ page.complexity }}
    </span>
  </div>
  
  <h2 style="margin-top: 0; color: #fff; font-size: 1.5em; border-bottom: none;">{{ page.title }}</h2>
  
  <p style="color: #ccc; font-size: 1.05em; line-height: 1.6;">
    Large Language Models have a knowledge cutoff. This module shifts focus from model architecture to <strong>Systems Engineering</strong>, explaining how to architect <strong>Retrieval-Augmented Generation (RAG)</strong> pipelines and connect LLMs to external Vector Databases.
  </p>

  <div style="margin-top: 25px;">
    <a href="{{ site.baseurl }}{{ page.url }}" style="text-decoration: none;">
      <button style="background: #fff; color: #000; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: transform 0.2s;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        LAUNCH MASTERCLASS
      </button>
    </a>
    <p style="margin-top: 10px; font-size: 0.8em; color: #666;">
      <em>Interactive Slides • Press 'F' for Fullscreen</em>
    </p>
  </div>
</div>

### 📑 Executive Summary

This module addresses the distinction between **Parametric Memory** (weights) and **Non-Parametric Memory** (context). We cover the end-to-end engineering required to give AI access to private data.

**Key Engineering Concepts:**
* **The ETL Pipeline:** Strategies for efficient **Chunking** and embedding ingestion.
* **Vector Databases:** Understanding the underlying mechanics of high-speed retrieval algorithms like **HNSW**.
* **Search Optimization:** Implementing **Hybrid Search** (Dense + Sparse) to achieve production-grade recall.

---