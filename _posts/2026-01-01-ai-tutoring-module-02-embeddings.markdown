---
layout: slides
title: "The Geometry of Meaning: Tokenization & Vector Spaces"
slides: ai-tutoring-module-02-embeddings.md
category: "ai-tutoring"
module_number: 2
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
    Before a machine can think, it must convert language into numbers. This module explores the <strong>Embedding Layer</strong>, transforming discrete tokens into continuous vector representations where semantic meaning is encoded geometrically.
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

This module serves as the bridge between Linguistics and Linear Algebra. We analyze how high-dimensional spaces capture human concepts through geometry rather than rules.

**Key Technical Concepts:**
* **Tokenization Strategy:** How **Byte Pair Encoding (BPE)** solves the "unknown word" problem and manages vocabulary efficiency.
* **Vector Arithmetic:** Understanding the mathematical intuition behind `King - Man + Woman = Queen`.
* **The Static Limitation:** Why the embedding layer is context-blind before entering the Transformer blocks, and the crucial difference between ordinal integers and semantic vectors.

---