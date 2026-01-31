---
layout: null
permalink: /mestrado/
sitemap: false
---
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M.Sc. Research Journey | Richardson Lima</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #050507;
            --card-bg: rgba(15, 15, 18, 0.9);
            --primary-accent: #00f0ff;
            --secondary-accent: #6600ff;
            --text-main: #ffffff;
            --text-muted: #94949e;
            --border-color: rgba(255, 255, 255, 0.1);
            --ita-blue: #0056b3;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            margin: 0;
            line-height: 1.6;
            overflow-x: hidden;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at 80% 20%, rgba(0, 240, 255, 0.05) 0%, transparent 50%);
            z-index: -1;
        }

        .container { max-width: 1100px; margin: 0 auto; padding: 60px 20px; }

        header { border-bottom: 1px solid var(--border-color); padding-bottom: 40px; margin-bottom: 60px; }
        .institute-tag { color: var(--primary-accent); font-family: 'JetBrains Mono'; font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; }
        h1 { font-size: 2.8rem; margin: 15px 0; letter-spacing: -1px; }
        .description { color: var(--text-muted); font-size: 1.2rem; max-width: 850px; }

        .section-label {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-top: 80px;
            margin-bottom: 30px;
            font-weight: 700;
            color: var(--text-main);
            font-size: 1.2rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .section-label::after { content: ''; flex-grow: 1; height: 1px; background: var(--border-color); }

        /* Grid de Info Institucional */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .info-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 20px;
            border-radius: 12px;
        }

        .info-card h4 { margin: 0 0 10px 0; color: var(--primary-accent); font-size: 0.8rem; text-transform: uppercase; }
        .info-card p { margin: 0; font-size: 1rem; color: var(--text-main); }
        .info-card a { color: var(--secondary-accent); text-decoration: none; }

        /* Tabelas de Pesquisa */
        .table-container { overflow-x: auto; margin: 20px 0; border-radius: 12px; border: 1px solid var(--border-color); }
        .data-table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.02); }
        .data-table th { background: rgba(255,255,255,0.05); text-align: left; padding: 15px; color: var(--primary-accent); font-size: 0.8rem; text-transform: uppercase; }
        .data-table td { padding: 15px; border-bottom: 1px solid var(--border-color); font-size: 0.9rem; color: var(--text-muted); }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table b { color: var(--text-main); }

        /* Milestones & Links */
        .milestone-list { list-style: none; padding: 0; }
        .milestone-item { 
            display: flex; 
            align-items: center; 
            gap: 15px; 
            margin-bottom: 12px; 
            padding: 15px; 
            background: rgba(255,255,255,0.03); 
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
        }
        .check { color: #4CAF50; font-weight: bold; }
        .pending { color: #ff9800; }

        .link-chip {
            display: inline-block;
            padding: 8px 16px;
            background: rgba(102, 0, 255, 0.1);
            border: 1px solid var(--secondary-accent);
            border-radius: 50px;
            color: var(--text-main);
            text-decoration: none;
            margin-right: 10px;
            margin-bottom: 10px;
            font-size: 0.85rem;
            transition: 0.3s;
        }
        .link-chip:hover { background: var(--secondary-accent); }

        footer { margin-top: 100px; padding: 60px 0; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-muted); }
    </style>
</head>
<body>

<div class="container">
    <header>
        <div class="institute-tag">M.Sc. Research Journey · PG-EEC · ITA</div>
        <h1>Chaos Engineering & Dependability</h1>
        <p class="description">
            Tracking academic progress and systematic mapping at the <b>Instituto Tecnológico de Aeronáutica (ITA)</b>. 
            Researching the intersection of resilience testing and mission-critical financial ecosystems.
        </p>
    </header>

    <div class="info-grid">
        <div class="info-card">
            <h4>Program</h4>
            <p>Electronics and Computer Engineering (Informatics)</p>
        </div>
        <div class="info-card">
            <h4>Status</h4>
            <p>Regular Graduate Student (2024.2)</p>
        </div>
        <div class="info-card">
            <h4>Advisor</h4>
            <p><a href="https://www.gimps.info/equipe/coordenador" target="_blank">Prof. Dr. Johnny Marques</a></p>
        </div>
        <div class="info-card">
            <h4>Lab</h4>
            <p><a href="https://www.gimps.info/" target="_blank">GIMPS Research Group</a></p>
        </div>
    </div>

    <div class="section-label">🎯 Research Core</div>
    <div class="info-card" style="margin-bottom: 20px; border-left: 4px solid var(--primary-accent);">
        <p><b>Primary Objective:</b> Create an Assessment Model for Dependability Assurance in critical systems by utilizing Chaos Engineering-based experiments to evaluate resilience and provide actionable architectural recommendations.</p>
    </div>

    <div class="section-label">🔍 Research Questions (RQs)</div>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Question</th>
                    <th>Rationale</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><b>RQ1</b></td><td>Are there similar models to the one proposed?</td><td>Avoid redundancy and map state-of-the-art.</td></tr>
                <tr><td><b>RQ2</b></td><td>Which software types are developed for dependability validation?</td><td>Map open-source vs. commercial tool landscape.</td></tr>
                <tr><td><b>RQ3</b></td><td>What are the main metrics used for dependability evaluation?</td><td>Identify KPIs for resilience measurement.</td></tr>
                <tr><td><b>RQ4</b></td><td>What are the main tools used?</td><td>Identify industry standards (Chaos Mesh, Gremlin, etc.).</td></tr>
                <tr><td><b>RQ5</b></td><td>Which critical contexts are addressed?</td><td>Filter findings by industry (Finance, Healthcare, Space).</td></tr>
            </tbody>
        </table>
    </div>

    <div class="section-label">📊 Systematic Mapping: Preliminary Results</div>
    <p class="description" style="font-size: 1rem; margin-bottom: 20px;">Current mapping across IEEE, ACM, and ScienceDirect repositories.</p>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Source</th>
                    <th>Year</th>
                    <th>Title Highlight</th>
                    <th>Authors</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><b>EP4</b></td><td>IEEE</td><td>2021</td><td>Resilience and Dependability on Microservices</td><td>D. J. Arévalo et al.</td></tr>
                <tr><td><b>EP13</b></td><td>IEEE</td><td>2021</td><td>Dependability Management in Cloud-Native</td><td>L. J. S. de Oliveira et al.</td></tr>
                <tr><td><b>EP22</b></td><td>IEEE</td><td>2023</td><td>Chaos Engineering for Reliability & Dependability</td><td>Abhishek Dhama et al.</td></tr>
                <tr><td><b>EP23</b></td><td>ACM</td><td>2022</td><td>Influence of Dependability in Cloud Adoption</td><td>Chi-hoon Song et al.</td></tr>
            </tbody>
        </table>
    </div>

    <div class="section-label">✍️ Selected Bibliography (Manual Inclusion)</div>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Year</th>
                    <th>Title</th>
                    <th>Authors</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><b>IM1</b></td><td>2012</td><td>Engineering Secure Dependable Systems</td><td>M.F. Khan, R. Paul</td></tr>
                <tr><td><b>IM4</b></td><td>2015</td><td>The Principles of Dependability</td><td>N. Balakrishnan</td></tr>
                <tr><td><b>IM8</b></td><td>2019</td><td>System Dependability — Benchmarking</td><td>Y. Crouzet, K. Kanoun</td></tr>
                <tr><td><b>IM12</b></td><td>2015</td><td>Model for Assessing Internetware Dependability</td><td>Huiqun Zhao et al.</td></tr>
            </tbody>
        </table>
    </div>

    <div class="section-label">🚀 Future Milestones</div>
    <div class="milestone-list">
        <div class="milestone-item"><span class="check">[✓]</span> Admission and Enrollment (2024.2)</div>
        <div class="milestone-item"><span class="check">[✓]</span> Systematic Mapping Start</div>
        <div class="milestone-item"><span class="pending">[ ]</span> Chaos Experimentation Framework Design</div>
        <div class="milestone-item"><span class="pending">[ ]</span> M.Sc. Dissertation Defense</div>
    </div>

    <div class="section-label">🔗 Institutional Resources</div>
    <div style="margin-top: 20px;">
        <a href="http://www.ita.br/posgrad/calendario" class="link-chip" target="_blank">ITA Calendar</a>
        <a href="https://www.gimps.info/" class="link-chip" target="_blank">GIMPS Group</a>
        <a href="https://sucupira.capes.gov.br/" class="link-chip" target="_blank">Plataforma Sucupira</a>
    </div>

    <footer>
        <p>&copy; 2026 Richardson Lima · PG-EEC ITA</p>
        <p style="font-size: 0.8rem; opacity: 0.6; margin-top: 10px;">"Standing on the shoulders of giants."</p>
    </footer>
</div>

</body>
</html>