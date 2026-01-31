---
layout: null
permalink: /engineering-knowledge-base/
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Engineering Knowledge Base | Richardson Lima</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* Reutilizando a base visual do seu index.html futurista */
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

        /* Efeito de Grade e Brilho Interestelar (Interstellar Glow) */
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
        .description { color: var(--text-muted); font-size: 1.2rem; margin-bottom: 40px; }

        /* Estilo Udemy/Learning Path */
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
        }

        /* Card de Módulo estilo Alura/Hotpage */
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

        footer { text-align: center; padding: 100px 20px; color: var(--text-muted); }
    </style>
</head>
<body>

<header>
    <span class="badge">Open Knowledge Archive</span>
    <h1>Engineering Knowledge Base</h1>
    <p class="description">
        A structured collection of technical deep dives and AI research designed to bridge the gap between stochastic models and deterministic software engineering.
    </p>
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

    <div class="section-title" style="margin-top: 80px;">
        <span>🛠️</span> Technical Deep Dives & Systems Architecture
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
</div>

<footer>
    <p>"Standing on the shoulders of giants."</p>
    <p>&copy; 2026 Richardson Lima</p>
    <a href="/" style="color: var(--secondary-accent); text-decoration: none;">← Back to Blog</a>
</footer>

</body>
</html>