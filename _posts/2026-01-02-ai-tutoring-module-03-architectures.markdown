---
layout: slides
title: "Encoder vs. Decoder: Choosing the Right Engine"
slides: ai-tutoring-module-03-architectures.md
category: "ai-tutoring"
module_number: 3
complexity: "Technical / Architectural"
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
    Not all Transformers are created equal. This module demystifies the architectural divergence between <strong>BERT (Encoders)</strong> and <strong>GPT (Decoders)</strong>, focusing on the critical geometry of the Attention Mask.
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

Understanding the "Civil War" of Transformer architectures is vital for system design. We analyze why Decoders have monopolized Generative AI while Encoders remain the gold standard for Classification and Search.

**Architecture Analysis:**
* **The Visibility Factor:** Exploring how **Bidirectional** vs. **Causal** attention masks define the model's capabilities (Understanding vs. Predicting).
* **Engineering Use Cases:** When to deploy BERT (for embeddings/NER) and when to deploy GPT (for reasoning/generation).
* **Hybrid Models:** A look at T5 and Encoder-Decoder architectures for Seq2Seq tasks.

---