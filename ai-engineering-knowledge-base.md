---
layout: null
permalink: /ai-engineering-knowledge-base/
sitemap: false
---
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Engineering Knowledge Base | Richardson Lima</title>
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
    <span class="badge">Open Knowledge Course</span>
    <h1>AI Engineering Knowledge Base</h1>
    <div class="intro-text">
        From linear algebra to autonomous agent swarms, this path spans Python, TypeScript, Rust, and Julia.
Every lesson produces reusable assets: prompts, skills, agents, and MCP servers.

You do not just study AI.
You practice AI with AI, build real products, and ship tools other people can use.
    </div>
</header>

<div class="container">
    <div class="section-title">
        <span>🧠</span> Step 01 - Math Foundations: The intuition behind every AI algorithm, through code.
    </div>

    <div class="modules-grid">
        {% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-01" | sort: "module_number" %}
        {% for item in tutoring_posts %}
        {% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}
        <a href="{{ item.url | prepend: site.baseurl }}" class="module-card">
            <div>
                <span class="mod-number">MODULE {{ module_label }}</span>
                <h3>{{ item.title | remove: "🖥️ Click here - " }}</h3>
                <p>{{ item.content | strip_html | truncatewords: 25 }}</p>
            </div>
            <div class="btn-launch">Launch Masterclass →</div>
        </a>
        {% endfor %}
    </div>
    <div class="section-title">
        <span>🧠</span> Step 02 - ML Fundamentals: Classical ML, still the backbone of most production AI.
    </div>
    <div class="modules-grid">
        {% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-02" | sort: "module_number" %}
        {% for item in tutoring_posts %}
        {% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}
        <a href="{{ item.url | prepend: site.baseurl }}" class="module-card">
            <div>
                <span class="mod-number">MODULE {{ module_label }}</span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.content | strip_html | truncatewords: 25 }}</p>
            </div>
            <div class="btn-launch">Launch Masterclass →</div>
        </a>
        {% endfor %}
    </div>

    <div class="section-title">
        <span>🧠</span> Step 03 - Deep Learning Core: Neural networks from first principles.
    </div>
    <div class="modules-grid">
        {% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-03" | sort: "module_number" %}
        {% for item in tutoring_posts %}
        {% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}
        <a href="{{ item.url | prepend: site.baseurl }}" class="module-card">
            <div>
                <span class="mod-number">MODULE {{ module_label }}</span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.content | strip_html | truncatewords: 25 }}</p>
            </div>
            <div class="btn-launch">Launch Masterclass →</div>
        </a>
        {% endfor %}
    </div>

    <div class="section-title">
        <span>🧠</span> Step 04 - Computer Vision: From pixels to understanding in image, video, 3D and VLMs.
    </div>
    <div class="modules-grid">
        {% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-04" | sort: "module_number" %}
        {% for item in tutoring_posts %}
        {% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}
        <a href="{{ item.url | prepend: site.baseurl }}" class="module-card">
            <div>
                <span class="mod-number">MODULE {{ module_label }}</span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.content | strip_html | truncatewords: 25 }}</p>
            </div>
            <div class="btn-launch">Launch Masterclass →</div>
        </a>
        {% endfor %}
    </div>

    <div class="section-title"><span>🧠</span> Step 05 - NLP Foundations to Advanced: Language is the interface to intelligence.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-05" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 06 - Speech & Audio: Hear, understand, speak.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-06" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 07 - Transformers Deep Dive: The architecture that changed everything.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-07" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 08 - Generative AI: Create images, video, audio, 3D and more.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-08" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 09 - Reinforcement Learning: Foundations of RLHF and game-playing AI.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-09" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 10 - LLMs from Scratch: Build, train and understand large language models.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-10" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 11 - LLM Engineering: Put LLMs to work in production.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-11" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 12 - Multimodal AI: See, hear, read and reason across modalities.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-12" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 13 - Tools & Protocols: Interfaces between AI and the real world.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-13" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 14 - Agent Engineering: Loop, memory, planning and production.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-14" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 15 - Autonomous Systems: Long-horizon agents and safety stack.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-15" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 16 - Multi-Agent & Swarms: Coordination and collective intelligence.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-16" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 17 - Infrastructure & Production: Ship AI to the real world.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-17" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 18 - Ethics, Safety & Alignment: Build AI that helps humanity.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-18" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

    <div class="section-title"><span>🧠</span> Step 19 - Capstone Projects: End-to-end shippable products.</div>
    <div class="modules-grid">{% assign tutoring_posts = site.slides | where: "category", "ai-engineering-course-step-19" | sort: "module_number" %}{% for item in tutoring_posts %}{% assign module_label = item.module_number | plus: 0 | prepend: "00" | slice: -2, 2 %}<a href="{{ item.url | prepend: site.baseurl }}" class="module-card"><div><span class="mod-number">MODULE {{ module_label }}</span><h3>{{ item.title }}</h3><p>{{ item.content | strip_html | truncatewords: 25 }}</p></div><div class="btn-launch">Launch Masterclass →</div></a>{% endfor %}</div>

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
