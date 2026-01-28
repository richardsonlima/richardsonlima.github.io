---
layout: slides
title: "Attention Is All You Need: Transformers Architecture"
slides: ai-tutoring-module-01-transformer-architecture.md
category: "ai-tutoring"
module_number: 1
complexity: "Foundational / Technical"
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
    The foundational neural network design behind Large Language Models (LLMs). This module dissects the <strong>Self-Attention</strong> mechanism and explains the critical shift from sequential processing (RNNs) to parallelized architecture.
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

The Transformer architecture represents the inflection point in modern AI. It introduces **Self-Attention**, a mechanism that allows the model to weigh the importance of different words in a sequence simultaneously, regardless of their distance.

**Core Components Analyzed:**
* **Parallelization:** Moving away from the sequential constraints of RNNs and LSTMs.
* **Encoders & Decoders:** Understanding the distinct roles of input processing vs. token generation.
* **Long-Range Dependencies:** How attention solves the "vanishing gradient" problem for long contexts.

---