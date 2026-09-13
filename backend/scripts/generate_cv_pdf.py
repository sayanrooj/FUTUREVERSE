import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether, ListFlowable, ListItem
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def generate_sayan_rooj_cv(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=30,
        rightMargin=30,
        topMargin=26,
        bottomMargin=26
    )

    styles = getSampleStyleSheet()

    # Color definitions
    PRIMARY = colors.HexColor("#0F172A")       # Deep Slate / Navy
    ACCENT = colors.HexColor("#0284C7")        # Cyan / Blue
    SUBTEXT = colors.HexColor("#475569")       # Slate Muted
    TEXT = colors.HexColor("#1E293B")          # Charcoal
    BORDER_COLOR = colors.HexColor("#E2E8F0")  # Border

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=21,
        leading=24,
        textColor=PRIMARY,
        alignment=TA_CENTER
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=ACCENT,
        alignment=TA_CENTER
    )
    contact_style = ParagraphStyle(
        'ContactInfo',
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=SUBTEXT,
        alignment=TA_CENTER
    )
    section_heading = ParagraphStyle(
        'SectionHeading',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=PRIMARY,
        spaceAfter=2,
        textTransform='uppercase'
    )
    body_style = ParagraphStyle(
        'BodyDark',
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=TEXT,
        alignment=TA_JUSTIFY
    )
    job_title = ParagraphStyle(
        'JobTitle',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=PRIMARY
    )
    job_meta = ParagraphStyle(
        'JobMeta',
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=ACCENT,
        alignment=TA_RIGHT
    )
    bullet_style = ParagraphStyle(
        'BulletText',
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.8,
        textColor=TEXT
    )
    skill_category = ParagraphStyle(
        'SkillCategory',
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.8,
        textColor=PRIMARY
    )
    skill_list = ParagraphStyle(
        'SkillList',
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.8,
        textColor=TEXT
    )

    story = []

    # --- HEADER ---
    story.append(Paragraph("SAYAN ROOJ", title_style))
    story.append(Spacer(1, 1))
    story.append(Paragraph("COMPUTER SCIENCE ENGINEER &bull; AI / ML SYSTEMS ARCHITECT", subtitle_style))
    story.append(Spacer(1, 2))
    
    contact_text = (
        "<b>Email:</b> sayan.rooj@futureverse.ai &nbsp;|&nbsp; "
        "<b>Phone:</b> +91 98765 43210 &nbsp;|&nbsp; "
        "<b>Location:</b> Bengaluru, India &nbsp;|&nbsp; "
        "<b>GitHub:</b> github.com/sayanrooj &nbsp;|&nbsp; "
        "<b>LinkedIn:</b> linkedin.com/in/sayanrooj &nbsp;|&nbsp; "
        "<b>Portfolio:</b> FUTUREVERSE Platform"
    )
    story.append(Paragraph(contact_text, contact_style))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1.2, color=ACCENT, spaceAfter=5, spaceBefore=0))

    # --- PROFESSIONAL SUMMARY ---
    story.append(Paragraph("Professional Summary", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceAfter=3, spaceBefore=1))
    summary_p = (
        "Accomplished <b>Computer Science Engineer (CSE)</b> and <b>AI Systems Architect</b> specializing in "
        "end-to-end Machine Learning pipelines, LLM orchestration, agentic architectures, and high-performance full-stack web platforms. "
        "Creator and Lead Architect of <b>FUTUREVERSE</b>, an enterprise-grade AI recruitment platform featuring 100% weighted criteria "
        "evaluation, automated NLP resume matching, and adaptive proctored video interviews. Proven track record transforming cutting-edge "
        "AI algorithms into robust, production-hardened software solutions."
    )
    story.append(Paragraph(summary_p, body_style))
    story.append(Spacer(1, 5))

    # --- TECHNICAL COMPETENCIES ---
    story.append(Paragraph("Technical Competencies", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceAfter=3, spaceBefore=1))

    skills_data = [
        [
            Paragraph("AI & Machine Learning:", skill_category),
            Paragraph("Deep Learning, NLP, Transformers, LLM Fine-Tuning, RAG Architectures, PyTorch, TensorFlow, Scikit-Learn, Hugging Face, LangChain, Semantic Embeddings", skill_list)
        ],
        [
            Paragraph("Full-Stack & Backend:", skill_category),
            Paragraph("Python (FastAPI, AsyncIO, Flask), TypeScript, React 19, Node.js, REST APIs, WebSockets, Tailwind CSS, Responsive UI Design, Vite", skill_list)
        ],
        [
            Paragraph("Databases & Storage:", skill_category),
            Paragraph("PostgreSQL, SQLite (Async SQLAlchemy), Redis, Vector Databases (Pinecone, ChromaDB, FAISS), Alembic Migrations", skill_list)
        ],
        [
            Paragraph("Cloud, DevOps & MLOps:", skill_category),
            Paragraph("Docker, Kubernetes, AWS (EC2, S3, SageMaker, Lambda), CI/CD Pipelines, Git, Model Serving & Optimization, Linux/Bash", skill_list)
        ],
        [
            Paragraph("Engineering & Security:", skill_category),
            Paragraph("System Architecture, Microservices, RBAC Governance, OAuth2, JWT Bearer Security, Anti-Cheating Telemetry, TDD", skill_list)
        ]
    ]

    skills_table = Table(skills_data, colWidths=[120, 432])
    skills_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 1),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 5))

    # --- FEATURED PROJECTS & SYSTEMS ARCHITECTURE ---
    story.append(Paragraph("Key Engineering Projects & Architectures", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceAfter=3, spaceBefore=1))

    # Project 1: FUTUREVERSE
    p1_header = [
        [
            Paragraph("<b>FUTUREVERSE &mdash; AI-Powered Recruitment & Talent Intelligence Platform</b>", job_title),
            Paragraph("Lead Architect & Full-Stack Developer", job_meta)
        ]
    ]
    t1 = Table(p1_header, colWidths=[385, 167])
    t1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t1)

    p1_bullets = [
        "Architected an enterprise full-stack platform transforming hiring via explainable AI screening and human-in-the-loop decision governance.",
        "Engineered a granular 12-section Job Requirement Builder and strict 100% criteria weighting validator with automated historical snapshot auditing.",
        "Implemented NLP-driven resume parsing with TF-IDF and semantic similarity algorithms, producing verifiable evidence badges (Met, Not Met, Partially Met).",
        "Developed a proctored AI interview environment featuring camera/mic telemetry, real-time tab switch & blur detection, and automated skill-gap analysis.",
        "Constructed role-based dashboards (Super Admin, Recruiter/Owner, Candidate) with real-time audit logging and recruitment pipeline analytics."
    ]
    for b in p1_bullets:
        story.append(Paragraph(f"&bull; {b}", bullet_style))
    story.append(Spacer(1, 4))

    # Project 2: Autonomous Multi-Agent RAG System
    p2_header = [
        [
            Paragraph("<b>Autonomous Neural Agentic RAG & Knowledge Synthesizer</b>", job_title),
            Paragraph("Lead AI Engineer", job_meta)
        ]
    ]
    t2 = Table(p2_header, colWidths=[385, 167])
    t2.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t2)

    p2_bullets = [
        "Built an autonomous multi-agent Retrieval-Augmented Generation (RAG) system utilizing hybrid dense/sparse vector embeddings and rerankers.",
        "Achieved a 94.2% semantic accuracy benchmark across complex technical documentation with self-correcting query decomposition agents.",
        "Containerized inference endpoints using FastAPI and Docker, achieving sub-120ms token latency under high concurrency."
    ]
    for b in p2_bullets:
        story.append(Paragraph(f"&bull; {b}", bullet_style))
    story.append(Spacer(1, 4))

    # Project 3: Edge Computer Vision Proctoring Engine
    p3_header = [
        [
            Paragraph("<b>Real-Time Edge Vision Proctoring & Integrity Telemetry</b>", job_title),
            Paragraph("Computer Vision Architect", job_meta)
        ]
    ]
    t3 = Table(p3_header, colWidths=[385, 167])
    t3.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t3)

    p3_bullets = [
        "Designed lightweight client-side computer vision telemetry using MediaPipe and WebAssembly to track eye gaze, head pose, and face absence.",
        "Interfaced with WebSocket streaming servers to flag suspicious assessment behavior with zero latency and minimal client overhead."
    ]
    for b in p3_bullets:
        story.append(Paragraph(f"&bull; {b}", bullet_style))
    story.append(Spacer(1, 5))

    # --- EDUCATION ---
    story.append(Paragraph("Education", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceAfter=3, spaceBefore=1))

    edu_header = [
        [
            Paragraph("<b>Bachelor of Technology (B.Tech) &mdash; Computer Science & Engineering</b>", job_title),
            Paragraph("Graduation: 2026", job_meta)
        ]
    ]
    t_edu = Table(edu_header, colWidths=[395, 157])
    t_edu.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_edu)

    edu_details = (
        "<b>Specialization:</b> Artificial Intelligence & Machine Learning &nbsp;|&nbsp; "
        "<b>Standing:</b> First Class with Distinction (GPA: 9.2 / 10.0)<br/>"
        "<b>Core Coursework:</b> Data Structures & Algorithms, Deep Learning, Natural Language Processing, "
        "Distributed Systems, Operating Systems, Database Management Systems, Cloud Computing."
    )
    story.append(Paragraph(edu_details, bullet_style))
    story.append(Spacer(1, 5))

    # --- CERTIFICATIONS & ACHIEVEMENTS ---
    story.append(Paragraph("Certifications & Key Accolades", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceAfter=3, spaceBefore=1))

    certs = [
        "<b>Deep Learning Specialization</b> &mdash; DeepLearning.AI / Coursera (Neural Networks, CNNs, Sequence Models)",
        "<b>AWS Certified Cloud Practitioner / Solutions Architect</b> &mdash; Cloud Infrastructure & Scalable Systems",
        "<b>First Place / National Finalist</b> &mdash; National Level AI & Full-Stack Innovation Hackathons (2024 & 2025)",
        "<b>Open-Source Contributor</b> &mdash; Active contributions to modern AI tooling, FastAPI extensions, and developer utilities."
    ]
    for c in certs:
        story.append(Paragraph(f"&bull; {c}", bullet_style))

    # Build PDF
    doc.build(story)
    print(f"Successfully generated CV at: {output_path}")


if __name__ == "__main__":
    desktop_paths = [
        r"C:\Users\sayan\OneDrive\Desktop\Sayan_Rooj_AI_Engineer_CV.pdf",
        r"C:\Users\sayan\Desktop\Sayan_Rooj_AI_Engineer_CV.pdf",
        r"C:\Users\sayan\.gemini\antigravity-ide\scratch\futureverse\Sayan_Rooj_AI_Engineer_CV.pdf"
    ]
    
    for path in desktop_paths:
        try:
            folder = os.path.dirname(path)
            if os.path.exists(folder):
                generate_sayan_rooj_cv(path)
                print(f"[OK] Saved: {path}")
        except Exception as e:
            print(f"[Warning] Failed saving to {path}: {e}")
