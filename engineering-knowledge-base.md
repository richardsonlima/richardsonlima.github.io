---
layout: null
permalink: /engineering-knowledge-base/
sitemap: false
---
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Engineering Knowledge Base | Richardson Lima</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* Reusing the visual base from your futuristic index.html */
        :root {
            --bg-color: #050507;
            --card-bg: rgba(15, 15, 18, 0.9);
            --primary-accent: #6600ff;
            --secondary-accent: #00f0ff;
            --text-main: #ffffff;
            --text-muted: #94949e;
            --border-color: rgba(255, 255, 255, 0.1);
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            margin: 0;
            overflow-x: hidden;
        }

        /* Interstellar Glow Grid Effect */
        body::before {
            content: '';
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(102, 0, 255, 0.08) 0%, transparent 70%);
            z-index: -1;
        }

        header {
            padding: 80px 20px;
            text-align: center;
            max-width: 900px;
            margin: 0 auto;
        }

        .badge {
            background: rgba(0, 240, 255, 0.1);
            color: var(--secondary-accent);
            padding: 5px 15px;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            border: 1px solid var(--secondary-accent);
        }

        h1 { font-size: 3rem; margin: 20px 0; letter-spacing: -2px; }
        .intro-text { color: var(--text-muted); font-size: 1.1rem; line-height: 1.6; max-width: 800px; margin: 0 auto 40px auto; }

        /* Layout Style */
        .container { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }
        
        .section-title {
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 1.5rem;
            margin-bottom: 40px;
            border-left: 4px solid var(--primary-accent);
            padding-left: 15px;
        }

        .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 25px;
            margin-bottom: 80px;
        }

        /* Module Card Styling */
        .module-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 25px;
            transition: all 0.3s ease;
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .module-card:hover {
            transform: translateY(-10px);
            border-color: var(--secondary-accent);
            box-shadow: 0 20px 40px rgba(0, 240, 255, 0.1);
        }

        .module-card.coming-soon {
            opacity: 0.7;
            filter: grayscale(0.4);
            pointer-events: none;
            border-style: dashed;
        }

        .mod-number {
            font-family: 'JetBrains Mono', monospace;
            color: var(--secondary-accent);
            font-weight: 700;
            margin-bottom: 10px;
            display: block;
        }

        .module-card h3 { font-size: 1.3rem; margin: 10px 0; line-height: 1.2; }
        .module-card p { color: var(--text-muted); font-size: 0.9rem; flex-grow: 1; }

        .btn-launch {
            margin-top: 20px;
            background: var(--primary-accent);
            color: white;
            text-align: center;
            padding: 10px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
        }

        /* Philosophy Section */
        .philosophy-section {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 40px;
            margin-top: 100px;
        }
        .philosophy-section h2 { margin-top: 0; display: flex; align-items: center; gap: 10px; }
        .philosophy-list { list-style: none; padding: 0; }
        .philosophy-list li { margin-bottom: 15px; padding-left: 25px; position: relative; color: var(--text-muted); }
        .philosophy-list li::before { content: '→'; position: absolute; left: 0; color: var(--primary-accent); }
        .philosophy-list b { color: var(--text-main); }

        footer { text-align: center; padding: 100px 20px; color: var(--text-muted); }
    </style>
</head>
<body>

<header>
    <span class="badge">Open Knowledge Archive</span>
    <h1>Engineering Knowledge Base</h1>
    <div class="intro-text">
        Welcome to my personal archive of technical presentations and architectural studies.
        This repository reflects my continuous journey in Software Engineering and Artificial Intelligence.
        The goal of this open collection is to contribute to the engineering community by synthesizing complex topics into structured, digestible modules.
        These materials are the result of years of hands-on experience and deep research, shared freely to help peers accelerate their own technical paths.
    </div>
</header>

<div class="container">
    <div class="section-title">
        <span>🧠</span> The Agentic Path: AI Research Series
    </div>

    <div class="modules-grid">
        {% assign tutoring_posts = site.posts | where: "category", "ai-tutoring" | sort: "module_number" %}
        {% for item in tutoring_posts %}
        <a href="{{ item.url | prepend: site.baseurl }}" class="module-card">
            <div>
                <span class="mod-number">MODULE 0{{ item.module_number }}</span>
                <h3>{{ item.title | remove: "🖥️ Click here - " }}</h3>
                <p>{{ item.content | strip_html | truncatewords: 25 }}</p>
            </div>
            <div class="btn-launch">Launch Masterclass →</div>
        </a>
        {% endfor %}
    </div>

    <div class="section-title">
        <span>🚀</span> MLOps: Machine Learning Engineering
    </div>

    <div class="modules-grid">
        <div class="module-card coming-soon">
            <div>
                <span class="mod-number" style="color: #ff9900;">MLOPS-01</span>
                <h3>Introduction to MLOps Lifecycle</h3>
                <p>Maturity models, NYC Taxi Dataset overview, and environment setup for production ML.</p>
            </div>
            <div class="btn-launch" style="background: #333;">Available Soon...</div>
        </div>
        <div class="module-card coming-soon">
            <div>
                <span class="mod-number" style="color: #ff9900;">MLOPS-02</span>
                <h3>Experiment Tracking & Model Management</h3>
                <p>Deep dive into MLflow: tracking experiments, registering models, and versioning.</p>
            </div>
            <div class="btn-launch" style="background: #333;">Available Soon...</div>
        </div>
        <div class="module-card coming-soon">
            <div>
                <span class="mod-number" style="color: #ff9900;">MLOPS-03</span>
                <h3>Orchestration & Workflow Pipelines</h3>
                <p>Automating ML workflows with Prefect and Mage for robust data pipelines.</p>
            </div>
            <div class="btn-launch" style="background: #333;">Available Soon...</div>
        </div>
    </div>

    <div class="section-title">
        <span>🗣️</span> Applied NLP: NLU & NLG Mastery (E2E)
    </div>

    <div class="modules-grid">
        <div class="module-card coming-soon">
            <div>
                <span class="mod-number" style="color: #e91e63;">NLP-01</span>
                <h3>Deep NLU: Intent & Entity Recognition</h3>
                <p>Building robust Natural Language Understanding engines. From Slot Filling to multi-intent classification.</p>
            </div>
            <div class="btn-launch" style="background: #333;">Available Soon...</div>
        </div>
        <div class="module-card coming-soon">
            <div>
                <span class="mod-number" style="color: #e91e63;">NLP-02</span>
                <h3>Neural Text Generation (NLG) Mastery</h3>
                <p>Decoding strategies, temperature control, and Nucleus Sampling in Autoregressive models.</p>
            </div>
            <div class="btn-launch" style="background: #333;">Available Soon...</div>
        </div>
    </div>

    <div class="section-title">
        <span>🛠️</span> Software Engineering & Data Structures
    </div>

    <div class="modules-grid">
        <div class="module-card coming-soon">
            <div>
                <span class="mod-number" style="color: #4CAF50;">SWE-01</span>
                <h3>Design Patterns in Pythonic Context</h3>
                <p>Structural and Creational patterns adapted for modern asynchronous development.</p>
            </div>
            <div class="btn-launch" style="background: #333;">Available Soon...</div>
        </div>
        <div class="module-card coming-soon">
            <div>
                <span class="mod-number" style="color: #4CAF50;">SWE-02</span>
                <h3>Competitive Python & Algorithms</h3>
                <p>Solving complex challenges: from string validators to advanced ITA-based complexity analysis.</p>
            </div>
            <div class="btn-launch" style="background: #333;">Available Soon...</div>
        </div>
    </div>

    <div class="section-title">
        <span>🏛️</span> Computer Engeneering / Science Foundations: The Deep Series
    </div>

    <div class="modules-grid">
        <div class="module-card coming-soon">
            <div><span class="mod-number" style="color: #007bff;">CS-FUND-01</span><h3>Data Structures & Complexity</h3><p>Order of functions, recursive algorithms, and elementary structures.</p></div>
            <div class="btn-launch" style="background: #333;">Soon...</div>
        </div>
        <div class="module-card coming-soon">
            <div><span class="mod-number" style="color: #007bff;">CS-FUND-02</span><h3>Advanced Algorithms & Graphs</h3><p>Sorting, pattern searching, and graph traversals.</p></div>
            <div class="btn-launch" style="background: #333;">Soon...</div>
        </div>
        <div class="module-card coming-soon">
            <div><span class="mod-number" style="color: #007bff;">CS-FUND-03</span><h3>Compiler Engineering</h3><p>Lexical and syntactic analysis for virtual machines.</p></div>
            <div class="btn-launch" style="background: #333;">Soon...</div>
        </div>
    </div>

    <div class="section-title">
        <span>🔍</span> Technical Deep Dives & Systems Architecture
    </div>
    
    <div class="modules-grid">
        {% assign all_slides = site.posts | concat: site.slides | where: "layout", "slides" %}
        {% for item in all_slides %}
            {% assign item_category = item.category | downcase %}
            {% unless item_category == "ai-tutoring" %}
            <a href="{{ item.url | prepend: site.baseurl }}" class="module-card">
                <div>
                    <span class="mod-number" style="color: var(--primary-accent);">TECHNICAL CASE</span>
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.content | strip_html | truncatewords: 20 }}</p>
                </div>
                <div class="btn-launch" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color);">Explore Case →</div>
            </a>
            {% endunless %}
        {% endfor %}
    </div>

    <div class="philosophy-section">
        <h2><span>🤝</span> Community & Philosophy</h2>
        <p>Knowledge grows when shared. This page serves as a “living document” of my studies.</p>
        <ul class="philosophy-list">
            <li><b>Continuous Learning:</b> These modules are updated as the technology landscape evolves (e.g., from Transformer architecture to Agentic Frameworks).</li>
            <li><b>Open Access:</b> All materials here are available for study and reference.</li>
            <li><b>Collaborative Growth:</b> Feedback and technical discussions are always welcome to refine these concepts.</li>
        </ul>
        <p style="font-style: italic; margin-top: 30px; border-left: 3px solid var(--secondary-accent); padding-left: 15px;">
            “We are standing on the shoulders of giants. This is my way of adding a small step to the ladder.”
        </p>
    </div>
</div>

<footer>
    <p>&copy; 2026 Richardson Lima</p>
    <a href="/" style="color: var(--secondary-accent); text-decoration: none;">← Back to Blog</a>
</footer>

</body>
</html>