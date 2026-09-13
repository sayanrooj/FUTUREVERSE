import asyncio
import uuid
from datetime import datetime, timedelta
from sqlalchemy.future import select
from backend.database import AsyncSessionLocal, engine, Base
from backend.models.user import User, CandidateProfile, OwnerProfile, UserRole
from backend.models.job import (
    Job, JobRequirement, JobCriteria, CriteriaTemplate, CriteriaVersion
)
from backend.models.application import (
    Resume, ParsedResumeData, Application, CandidateScore, RecruiterNote, ApplicationStatus
)
from backend.models.interview import (
    Interview, InterviewQuestion, InterviewAnswer, InterviewResult,
    IntegrityEvent, InterviewSchedule, InterviewStatus
)
from backend.models.cms import (
    CompanyContent, Achievement, Event, SupportTicket, Notification
)
from backend.models.audit import AuditLog
from backend.services.auth_service import hash_password

async def seed_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        admin_res = await db.execute(select(User).filter(User.email == "admin@futureverse.ai"))
        if admin_res.scalars().first():
            print("[Seed] Database already populated with FUTUREVERSE demo data.")
            return

        print("[Seed] Initializing FUTUREVERSE database with production-grade demo state...")

        # 1. Super Admin Account (No public registration)
        admin_user = User(
            email="admin@futureverse.ai",
            hashed_password=hash_password("Admin@2026"),
            full_name="Super Administrator",
            role=UserRole.SUPER_ADMIN,
            is_active=True
        )
        db.add(admin_user)
        await db.flush()

        # 2. Recruiter / Owner Account (Created by Admin)
        recruiter_user = User(
            email="recruiter@futureverse.ai",
            hashed_password=hash_password("Recruiter@2026"),
            full_name="Alex Morgan",
            role=UserRole.OWNER,
            is_active=True
        )
        db.add(recruiter_user)
        await db.flush()

        recruiter_profile = OwnerProfile(
            user_id=recruiter_user.id,
            company_name="FUTUREVERSE Global Labs",
            department="Talent Acquisition & AI Systems",
            designation="Principal Recruiter & Talent Partner",
            permissions=["MANAGE_JOBS", "VIEW_APPLICATIONS", "INVITE_INTERVIEWS", "MAKE_DECISIONS"]
        )
        db.add(recruiter_profile)
        await db.flush()

        # 3. Demo Candidates
        # Candidate 1: Aarav Sharma (Senior AI/ML)
        cand1_user = User(
            email="aarav.sharma@example.com",
            hashed_password=hash_password("Candidate@2026"),
            full_name="Aarav Sharma",
            role=UserRole.CANDIDATE,
            is_active=True
        )
        db.add(cand1_user)
        await db.flush()

        cand1_profile = CandidateProfile(
            user_id=cand1_user.id,
            phone="+91 98765 43210",
            headline="AI/ML Engineer | Python, Deep Learning & Transformer Architectures",
            bio="Passionate Machine Learning practitioner with 2.5 years of industry experience building end-to-end NLP and computer vision microservices.",
            location="Bangalore, India",
            education_level="Master of Technology (M.Tech)",
            field_of_study="Artificial Intelligence & Data Science",
            experience_years=2.5,
            skills=["Python", "Machine Learning", "Deep Learning", "SQL", "Git", "PyTorch", "Docker", "Statistics", "FastAPI"],
            projects=[
                "Automated Multilingual Resume Parser with Transformer Embeddings",
                "High-Throughput Vision-Based Defect Detection System"
            ],
            certifications=["AWS Certified Machine Learning - Specialty", "DeepLearning.AI TensorFlow Developer"]
        )
        db.add(cand1_profile)
        await db.flush()

        # Candidate 2: Priya Patel (Full Stack Developer)
        cand2_user = User(
            email="priya.patel@example.com",
            hashed_password=hash_password("Candidate@2026"),
            full_name="Priya Patel",
            role=UserRole.CANDIDATE,
            is_active=True
        )
        db.add(cand2_user)
        await db.flush()

        cand2_profile = CandidateProfile(
            user_id=cand2_user.id,
            phone="+91 98765 11223",
            headline="Full Stack Engineer | React, Node.js & Scalable Cloud APIs",
            bio="Full stack specialist adept at designing responsive frontends and resilient event-driven REST APIs.",
            location="Hyderabad, India",
            education_level="Bachelor of Technology (B.Tech)",
            field_of_study="Computer Science & Engineering",
            experience_years=2.0,
            skills=["JavaScript", "React", "Node.js", "REST APIs", "SQL", "Git", "HTML/CSS", "Tailwind CSS", "TypeScript"],
            projects=[
                "Enterprise Real-Time Collaboration Dashboard using React and WebSockets",
                "Fintech Payment Gateway Integration microservice"
            ],
            certifications=["AWS Certified Cloud Practitioner"]
        )
        db.add(cand2_profile)
        await db.flush()

        # Candidate 3: Rohan Verma (Data Analyst)
        cand3_user = User(
            email="rohan.verma@example.com",
            hashed_password=hash_password("Candidate@2026"),
            full_name="Rohan Verma",
            role=UserRole.CANDIDATE,
            is_active=True
        )
        db.add(cand3_user)
        await db.flush()

        cand3_profile = CandidateProfile(
            user_id=cand3_user.id,
            phone="+91 98123 45678",
            headline="Data Analyst | SQL, Power BI, Statistics & Business Intelligence",
            bio="Data storyteller translating complex multivariate datasets into executive BI dashboards and statistical projections.",
            location="Pune, India",
            education_level="Bachelor of Science (B.Sc)",
            field_of_study="Statistics & Computing",
            experience_years=1.5,
            skills=["SQL", "Excel", "Python", "Power BI", "Statistics", "Data Visualization", "Pandas"],
            projects=[
                "E-Commerce Customer Churn Forecasting Model & Executive BI Dashboard",
                "Supply Chain Inventory Optimization Analysis"
            ],
            certifications=["Microsoft Certified: Data Analyst Associate"]
        )
        db.add(cand3_profile)
        await db.flush()

        # Candidate 4: Ananya Sen (Software Engineering Intern)
        cand4_user = User(
            email="ananya.sen@example.com",
            hashed_password=hash_password("Candidate@2026"),
            full_name="Ananya Sen",
            role=UserRole.CANDIDATE,
            is_active=True
        )
        db.add(cand4_user)
        await db.flush()

        cand4_profile = CandidateProfile(
            user_id=cand4_user.id,
            phone="+91 97654 32109",
            headline="Software Engineering Undergraduate | Algorithms & Full-Stack Development",
            bio="Third-year Computer Science undergraduate passionate about data structures, algorithmic optimization, and modern web frameworks.",
            location="Kolkata, India",
            education_level="Currently Pursuing Bachelor of Technology (B.Tech)",
            field_of_study="Computer Science & Engineering",
            experience_years=0.5,
            skills=["Python", "C++", "Data Structures", "Algorithms", "Git", "JavaScript", "HTML/CSS"],
            projects=[
                "Peer-to-Peer Distributed File Sharing Protocol in C++",
                "Campus Course Management Portal with React & Python"
            ],
            certifications=["HackerRank Problem Solving (5 Stars)"]
        )
        db.add(cand4_profile)
        await db.flush()

        # 4. Criteria Templates
        templates = [
            CriteriaTemplate(
                name="AI/ML Engineer Template",
                description="Comprehensive criteria for applied AI, Machine Learning, and Data Science practitioners.",
                role_type="AI/ML Engineer",
                criteria_json=[
                    {"category_name": "Technical Skills", "weight_percentage": 25.0},
                    {"category_name": "Relevant Experience", "weight_percentage": 15.0},
                    {"category_name": "Education", "weight_percentage": 10.0},
                    {"category_name": "Projects", "weight_percentage": 15.0},
                    {"category_name": "AI/ML Knowledge", "weight_percentage": 10.0},
                    {"category_name": "Problem Solving", "weight_percentage": 10.0},
                    {"category_name": "Communication", "weight_percentage": 5.0},
                    {"category_name": "Certifications", "weight_percentage": 5.0},
                    {"category_name": "Role Relevance", "weight_percentage": 5.0}
                ],
                default_thresholds={"Technical Skills": 65.0, "Problem Solving": 60.0}
            ),
            CriteriaTemplate(
                name="Full Stack Developer Template",
                description="Balanced evaluation for frontend, backend API, database, and system architecture skills.",
                role_type="Full Stack Developer",
                criteria_json=[
                    {"category_name": "Technical Skills", "weight_percentage": 30.0},
                    {"category_name": "Relevant Experience", "weight_percentage": 15.0},
                    {"category_name": "Education", "weight_percentage": 10.0},
                    {"category_name": "Projects", "weight_percentage": 15.0},
                    {"category_name": "Problem Solving", "weight_percentage": 15.0},
                    {"category_name": "Communication", "weight_percentage": 5.0},
                    {"category_name": "Role Relevance", "weight_percentage": 10.0}
                ],
                default_thresholds={"Technical Skills": 65.0}
            ),
            CriteriaTemplate(
                name="Software Engineering Intern Template",
                description="Focuses on fundamental coding ability, problem solving, data structures, and learning agility without requiring prior work experience.",
                role_type="Internship",
                criteria_json=[
                    {"category_name": "Problem Solving", "weight_percentage": 25.0},
                    {"category_name": "Technical Skills", "weight_percentage": 25.0},
                    {"category_name": "Education", "weight_percentage": 15.0},
                    {"category_name": "Projects", "weight_percentage": 20.0},
                    {"category_name": "Communication", "weight_percentage": 5.0},
                    {"category_name": "Role Relevance", "weight_percentage": 10.0}
                ],
                default_thresholds={"Problem Solving": 60.0}
            )
        ]
        for t in templates:
            db.add(t)
        await db.flush()

        # 5. DEMO JOB 1 — AI/ML ENGINEER
        job1 = Job(
            owner_id=recruiter_profile.id,
            title="Senior AI / Machine Learning Engineer",
            department="Artificial Intelligence & Data Science",
            category="Machine Learning",
            description="Join our central AI team to build high-scale machine learning models, transformer architectures, and intelligent parsing pipelines for automated decision systems.",
            responsibilities="Design, train, and deploy production-grade deep learning models. Architect real-time inference microservices using FastAPI and Docker. Collaborate with product managers and recruiters to continuously optimize AI recommendation engines.",
            employment_type="Full Time",
            work_mode="Hybrid",
            location="Bangalore, India",
            salary_range="₹24,00,000 - ₹38,00,000 PA",
            openings=3,
            deadline="2026-10-31",
            status="ACTIVE",
            min_score_threshold=70.0,
            category_thresholds={"Technical Skills": 65.0, "Problem Solving": 60.0},
            current_criteria_version=1
        )
        db.add(job1)
        await db.flush()

        # Job 1 Requirements
        j1_reqs = [
            JobRequirement(job_id=job1.id, type="EDUCATION", name="Bachelor's / Master's Degree in CS, AI, Data Science or related field", is_required=True, weight=10.0, is_knockout=True),
            JobRequirement(job_id=job1.id, type="EXPERIENCE", name="1–3 years relevant experience in Machine Learning or Data Science", is_required=True, weight=15.0, is_knockout=True),
            JobRequirement(job_id=job1.id, type="TECH_SKILL", name="Python", level="Advanced", is_required=True, weight=20.0, is_knockout=True),
            JobRequirement(job_id=job1.id, type="TECH_SKILL", name="Machine Learning", level="Intermediate", is_required=True, weight=15.0),
            JobRequirement(job_id=job1.id, type="TECH_SKILL", name="SQL", level="Intermediate", is_required=True, weight=8.0),
            JobRequirement(job_id=job1.id, type="TECH_SKILL", name="Data Structures & Algorithms", level="Intermediate", is_required=False, weight=5.0),
            JobRequirement(job_id=job1.id, type="TECH_SKILL", name="Git", level="Intermediate", is_required=False, weight=2.0),
            JobRequirement(job_id=job1.id, type="PROJECT", name="Practical Machine Learning / NLP Capstone Project", is_required=True, weight=15.0),
            JobRequirement(job_id=job1.id, type="KNOWLEDGE", name="Deep Learning & Neural Architectures", level="Intermediate", is_required=False, weight=4.0),
            JobRequirement(job_id=job1.id, type="KNOWLEDGE", name="Statistics & Probability", level="Intermediate", is_required=False, weight=3.0),
            JobRequirement(job_id=job1.id, type="SOFT_SKILL", name="Problem Solving", is_required=True, weight=5.0),
            JobRequirement(job_id=job1.id, type="SOFT_SKILL", name="Communication", is_required=False, weight=3.0),
            JobRequirement(job_id=job1.id, type="SOFT_SKILL", name="Teamwork", is_required=False, weight=2.0),
            JobRequirement(job_id=job1.id, type="CERTIFICATION", name="AI / Cloud Certification (AWS, GCP, or DeepLearning.AI)", is_required=False, weight=3.0)
        ]
        for r in j1_reqs:
            db.add(r)

        # Job 1 Criteria (Strictly sums to 100%)
        j1_criteria = [
            JobCriteria(job_id=job1.id, category_name="Technical Skills", weight_percentage=25.0),
            JobCriteria(job_id=job1.id, category_name="Relevant Experience", weight_percentage=15.0),
            JobCriteria(job_id=job1.id, category_name="Education", weight_percentage=10.0),
            JobCriteria(job_id=job1.id, category_name="Projects", weight_percentage=15.0),
            JobCriteria(job_id=job1.id, category_name="AI/ML Knowledge", weight_percentage=10.0),
            JobCriteria(job_id=job1.id, category_name="Problem Solving", weight_percentage=10.0),
            JobCriteria(job_id=job1.id, category_name="Communication", weight_percentage=5.0),
            JobCriteria(job_id=job1.id, category_name="Certifications", weight_percentage=5.0),
            JobCriteria(job_id=job1.id, category_name="Role Relevance", weight_percentage=5.0)
        ]
        for c in j1_criteria:
            db.add(c)

        # Snap initial version
        db.add(CriteriaVersion(
            job_id=job1.id,
            version_number=1,
            changed_by="Alex Morgan",
            criteria_snapshot=[{"category_name": c.category_name, "weight_percentage": c.weight_percentage} for c in j1_criteria]
        ))

        # 6. DEMO JOB 2 — FULL STACK DEVELOPER
        job2 = Job(
            owner_id=recruiter_profile.id,
            title="Full Stack Software Engineer",
            department="Engineering & Product Delivery",
            category="Software Development",
            description="Build modern web applications, scalable client interfaces, and robust backend microservices powering our talent technology ecosystem.",
            responsibilities="Develop responsive UI components in React and TypeScript. Architect performant backend endpoints in Node.js and Python. Implement secure token-based authentication and real-time event pipelines.",
            employment_type="Full Time",
            work_mode="Hybrid",
            location="Hyderabad, India",
            salary_range="₹18,00,000 - ₹28,00,000 PA",
            openings=2,
            deadline="2026-11-15",
            status="ACTIVE",
            min_score_threshold=70.0,
            category_thresholds={"Technical Skills": 65.0},
            current_criteria_version=1
        )
        db.add(job2)
        await db.flush()

        j2_reqs = [
            JobRequirement(job_id=job2.id, type="EDUCATION", name="Bachelor's Degree in CS/IT or related engineering discipline", is_required=True, weight=10.0),
            JobRequirement(job_id=job2.id, type="EXPERIENCE", name="1–3 years hands-on software development experience", is_required=True, weight=15.0),
            JobRequirement(job_id=job2.id, type="TECH_SKILL", name="JavaScript", level="Advanced", is_required=True, weight=15.0),
            JobRequirement(job_id=job2.id, type="TECH_SKILL", name="React", level="Advanced", is_required=True, weight=15.0),
            JobRequirement(job_id=job2.id, type="TECH_SKILL", name="Node.js", level="Intermediate", is_required=True, weight=10.0),
            JobRequirement(job_id=job2.id, type="TECH_SKILL", name="REST APIs", level="Intermediate", is_required=True, weight=10.0),
            JobRequirement(job_id=job2.id, type="TECH_SKILL", name="SQL", level="Intermediate", is_required=False, weight=5.0),
            JobRequirement(job_id=job2.id, type="PROJECT", name="Production Full-Stack Application", is_required=True, weight=10.0),
            JobRequirement(job_id=job2.id, type="SOFT_SKILL", name="Problem Solving", is_required=True, weight=10.0),
            JobRequirement(job_id=job2.id, type="SOFT_SKILL", name="Communication", is_required=False, weight=5.0)
        ]
        for r in j2_reqs:
            db.add(r)

        j2_criteria = [
            JobCriteria(job_id=job2.id, category_name="Technical Skills", weight_percentage=30.0),
            JobCriteria(job_id=job2.id, category_name="Relevant Experience", weight_percentage=15.0),
            JobCriteria(job_id=job2.id, category_name="Education", weight_percentage=10.0),
            JobCriteria(job_id=job2.id, category_name="Projects", weight_percentage=15.0),
            JobCriteria(job_id=job2.id, category_name="Problem Solving", weight_percentage=15.0),
            JobCriteria(job_id=job2.id, category_name="Communication", weight_percentage=5.0),
            JobCriteria(job_id=job2.id, category_name="Role Relevance", weight_percentage=10.0)
        ]
        for c in j2_criteria:
            db.add(c)

        # 7. DEMO JOB 3 — DATA ANALYST
        job3 = Job(
            owner_id=recruiter_profile.id,
            title="Data Analyst & Business Intelligence Specialist",
            department="Data Analytics & Strategy",
            category="Analytics",
            description="Synthesize business performance data, build interactive Power BI dashboards, and perform exploratory statistical analysis for executive stakeholders.",
            employment_type="Full Time",
            work_mode="Remote",
            location="Remote / Anywhere in India",
            salary_range="₹12,00,000 - ₹20,00,000 PA",
            openings=2,
            deadline="2026-10-15",
            status="ACTIVE",
            min_score_threshold=65.0,
            current_criteria_version=1
        )
        db.add(job3)
        await db.flush()

        j3_criteria = [
            JobCriteria(job_id=job3.id, category_name="Technical Skills", weight_percentage=25.0),
            JobCriteria(job_id=job3.id, category_name="Relevant Experience", weight_percentage=15.0),
            JobCriteria(job_id=job3.id, category_name="Education", weight_percentage=10.0),
            JobCriteria(job_id=job3.id, category_name="Projects", weight_percentage=15.0),
            JobCriteria(job_id=job3.id, category_name="Problem Solving", weight_percentage=15.0),
            JobCriteria(job_id=job3.id, category_name="Communication", weight_percentage=10.0),
            JobCriteria(job_id=job3.id, category_name="Role Relevance", weight_percentage=10.0)
        ]
        for c in j3_criteria:
            db.add(c)

        # 8. DEMO JOB 4 — FRONTEND DEVELOPER
        job4 = Job(
            owner_id=recruiter_profile.id,
            title="Frontend UI/UX Engineer",
            department="Product Design & Engineering",
            category="Frontend",
            description="Craft pixel-perfect user interfaces, sleek motion transitions, and accessible interactive workflows using React, TypeScript, and modern CSS architecture.",
            employment_type="Full Time",
            work_mode="Remote",
            location="Remote / Bangalore, India",
            salary_range="₹14,00,000 - ₹22,00,000 PA",
            openings=2,
            deadline="2026-11-01",
            status="ACTIVE",
            min_score_threshold=65.0,
            current_criteria_version=1
        )
        db.add(job4)
        await db.flush()

        j4_criteria = [
            JobCriteria(job_id=job4.id, category_name="Technical Skills", weight_percentage=35.0),
            JobCriteria(job_id=job4.id, category_name="Relevant Experience", weight_percentage=15.0),
            JobCriteria(job_id=job4.id, category_name="Education", weight_percentage=10.0),
            JobCriteria(job_id=job4.id, category_name="Projects", weight_percentage=20.0),
            JobCriteria(job_id=job4.id, category_name="Communication", weight_percentage=10.0),
            JobCriteria(job_id=job4.id, category_name="Role Relevance", weight_percentage=10.0)
        ]
        for c in j4_criteria:
            db.add(c)

        # 9. DEMO JOB 5 — SOFTWARE ENGINEERING INTERN
        job5 = Job(
            owner_id=recruiter_profile.id,
            title="Software Engineering Intern (Summer 2026)",
            department="University Talent & Incubation",
            category="Internship",
            description="Intensive internship program designed for ambitious computer science undergraduates. Work alongside principal engineers to build real-world software features.",
            employment_type="Internship",
            work_mode="On-site",
            location="Bangalore Innovation Campus",
            salary_range="₹45,000 / month stipend",
            openings=5,
            deadline="2026-12-31",
            status="ACTIVE",
            min_score_threshold=60.0,
            current_criteria_version=1
        )
        db.add(job5)
        await db.flush()

        j5_criteria = [
            JobCriteria(job_id=job5.id, category_name="Problem Solving", weight_percentage=25.0),
            JobCriteria(job_id=job5.id, category_name="Technical Skills", weight_percentage=25.0),
            JobCriteria(job_id=job5.id, category_name="Education", weight_percentage=15.0),
            JobCriteria(job_id=job5.id, category_name="Projects", weight_percentage=20.0),
            JobCriteria(job_id=job5.id, category_name="Communication", weight_percentage=5.0),
            JobCriteria(job_id=job5.id, category_name="Role Relevance", weight_percentage=10.0)
        ]
        for c in j5_criteria:
            db.add(c)

        await db.flush()

        # 10. PRE-SEEDED RESUMES & APPLICATIONS (Ready for instant live demonstration!)
        # Resume for Aarav Sharma
        r1 = Resume(
            candidate_id=cand1_profile.id,
            filename="Aarav_Sharma_AI_ML_Resume.pdf",
            file_path="uploads/Aarav_Sharma_AI_ML_Resume.pdf",
            file_size=142800,
            mime_type="application/pdf"
        )
        db.add(r1)
        await db.flush()

        db.add(ParsedResumeData(
            resume_id=r1.id,
            extracted_name="Aarav Sharma",
            extracted_email="aarav.sharma@example.com",
            extracted_phone="+91 98765 43210",
            education_history=[{"institution": "National Institute of Technology", "degree": "M.Tech in AI", "year": "2024"}],
            degree="Master of Technology (M.Tech)",
            technical_skills=["Python", "Machine Learning", "Deep Learning", "SQL", "Git", "PyTorch", "FastAPI"],
            soft_skills=["Problem Solving", "Communication", "Teamwork"],
            experience_years=2.5,
            projects=["Automated Multilingual Resume Parser", "Vision-Based Defect Detection System"],
            certifications=["AWS Certified Machine Learning - Specialty"]
        ))

        # Application for Aarav Sharma to Job 1 (AI/ML Engineer)
        app1 = Application(
            job_id=job1.id,
            candidate_id=cand1_profile.id,
            resume_id=r1.id,
            status=ApplicationStatus.INTERVIEW_COMPLETED.value,
            criteria_version=1
        )
        db.add(app1)
        await db.flush()

        # Candidate Score for Aarav (Score: 92.4/100)
        db.add(CandidateScore(
            application_id=app1.id,
            overall_score=92.4,
            criteria_breakdown={
                "Technical Skills": 95.0,
                "Relevant Experience": 90.0,
                "Education": 100.0,
                "Projects": 95.0,
                "AI/ML Knowledge": 92.0,
                "Problem Solving": 90.0,
                "Communication": 88.0,
                "Certifications": 100.0,
                "Role Relevance": 85.0
            },
            requirement_evidence=[
                {"name": "Python", "type": "TECH_SKILL", "is_required": True, "status": "Met", "evidence": "Extensive Python production history and open-source contributions verified.", "impact": "High"},
                {"name": "Machine Learning", "type": "TECH_SKILL", "is_required": True, "status": "Met", "evidence": "2 capstone ML architectures deployed in production.", "impact": "High"},
                {"name": "SQL", "type": "TECH_SKILL", "is_required": True, "status": "Met", "evidence": "Relational schema design and query optimization confirmed.", "impact": "High"},
                {"name": "AWS Certified Machine Learning", "type": "CERTIFICATION", "is_required": False, "status": "Met", "evidence": "Valid AWS Specialty credential verified.", "impact": "Low"},
                {"name": "Master's Degree in AI/CS", "type": "EDUCATION", "is_required": True, "status": "Met", "evidence": "M.Tech in AI from premier technical institution.", "impact": "High"}
            ],
            knockout_met=True,
            human_review_recommended=False
        ))

        # Completed AI Interview for Aarav
        interview1 = Interview(
            application_id=app1.id,
            token="demo-aarav-interview-token-2026",
            status=InterviewStatus.COMPLETED.value,
            duration_minutes=25,
            started_at=datetime.utcnow() - timedelta(hours=2),
            completed_at=datetime.utcnow() - timedelta(hours=1, minutes=35)
        )
        db.add(interview1)
        await db.flush()

        q1 = InterviewQuestion(
            interview_id=interview1.id,
            question_text="Walk us through the architecture of your Automated Resume Parser and how you mitigated embedding inference latency.",
            question_type="PROJECT_BASED",
            order_num=1,
            target_skill="NLP & Microservices"
        )
        db.add(q1)
        await db.flush()

        db.add(InterviewAnswer(
            question_id=q1.id,
            answer_text="We leveraged ONNX Runtime with quantization for the transformer encoder, reducing latency from 420ms to 68ms per document while maintaining 99.1% F1 score.",
            response_time_seconds=38,
            confidence_score=0.94,
            follow_up_question="How did you handle vocabulary mismatch in rare domain credentials?"
        ))

        # Interview Result for Aarav
        db.add(InterviewResult(
            interview_id=interview1.id,
            technical_score=94.0,
            problem_solving_score=92.0,
            role_knowledge_score=95.0,
            project_understanding_score=96.0,
            communication_score=90.0,
            overall_performance=93.4,
            strengths=[
                "Exceptional depth in transformer quantization and latency profiling.",
                "Systematic problem-solving methodology with empirical benchmarking.",
                "Crisp, structured articulation under technical questioning."
            ],
            weaknesses=[
                "Could expand on distributed asynchronous worker queue scaling limits."
            ],
            skill_gaps=[
                "Multi-cloud deployment orchestration (Kubernetes bare-metal fallbacks)."
            ],
            improvement_suggestions=[
                "Quantify business ROI and cost reduction alongside algorithmic metrics."
            ],
            interview_summary="Candidate demonstrated standout technical mastery, lucid reasoning, and pragmatic system design capabilities."
        ))

        # Integrity Events for Aarav (Clean session with 1 minor window blur)
        db.add(IntegrityEvent(
            interview_id=interview1.id,
            event_type="Focus Lost",
            severity="LOW",
            evidence="Window unfocused for 1.4 seconds (single transient notification event).",
            review_status="DISMISSED"
        ))

        # Recruiter Note for Aarav
        db.add(RecruiterNote(
            application_id=app1.id,
            author_name="Alex Morgan",
            note_text="Outstanding candidate. Model evaluation scores and interview performance exceed expectations. Recommend immediate Face-to-Face interview.",
            is_private=True
        ))

        # Face-to-Face Scheduled for Aarav
        db.add(InterviewSchedule(
            application_id=app1.id,
            round_type="FACE_TO_FACE",
            date_str="2026-09-22",
            time_str="14:30 IST",
            location_or_link="https://meet.futureverse.ai/round2-aarav-sharma",
            interviewer_name="Dr. Vikram Sen (VP of AI Research)",
            duration_minutes=45,
            instructions="Please be prepared for a collaborative whiteboard architecture session on scalable streaming models."
        ))

        # Application for Priya Patel to Job 2 (Full Stack Developer)
        app2 = Application(
            job_id=job2.id,
            candidate_id=cand2_profile.id,
            status=ApplicationStatus.SHORTLISTED.value,
            criteria_version=1
        )
        db.add(app2)
        await db.flush()

        db.add(CandidateScore(
            application_id=app2.id,
            overall_score=88.5,
            criteria_breakdown={
                "Technical Skills": 90.0,
                "Relevant Experience": 85.0,
                "Education": 95.0,
                "Projects": 88.0,
                "Problem Solving": 86.0,
                "Communication": 85.0,
                "Role Relevance": 85.0
            },
            requirement_evidence=[
                {"name": "React", "type": "TECH_SKILL", "is_required": True, "status": "Met", "evidence": "Production state management and dynamic UI experience verified.", "impact": "High"},
                {"name": "Node.js", "type": "TECH_SKILL", "is_required": True, "status": "Met", "evidence": "Asynchronous REST microservice architecture confirmed.", "impact": "High"},
                {"name": "SQL", "type": "TECH_SKILL", "is_required": False, "status": "Met", "evidence": "Relational schema experience present in project history.", "impact": "Low"}
            ],
            knockout_met=True
        ))

        # Application for Rohan Verma to Job 3 (Data Analyst)
        app3 = Application(
            job_id=job3.id,
            candidate_id=cand3_profile.id,
            status=ApplicationStatus.RECRUITER_REVIEW.value,
            criteria_version=1
        )
        db.add(app3)
        await db.flush()

        db.add(CandidateScore(
            application_id=app3.id,
            overall_score=82.0,
            criteria_breakdown={
                "Technical Skills": 85.0,
                "Relevant Experience": 80.0,
                "Education": 85.0,
                "Projects": 82.0,
                "Problem Solving": 80.0,
                "Communication": 80.0,
                "Role Relevance": 80.0
            },
            requirement_evidence=[
                {"name": "SQL", "type": "TECH_SKILL", "is_required": True, "status": "Met", "evidence": "Complex analytical queries and window functions documented.", "impact": "High"},
                {"name": "Power BI", "type": "TECH_SKILL", "is_required": True, "status": "Met", "evidence": "Demonstrated BI dashboard portfolio verified.", "impact": "High"}
            ],
            knockout_met=True
        ))

        # 11. Achievements
        achievements = [
            Achievement(
                title="Global Talent Technology Innovation Award",
                description="Recognized as the premier AI recruitment solution combining transparent criteria weighting with explainable decision support.",
                date_str="2026-08-15",
                category="Platform Milestone",
                metric="99.2% Accuracy",
                icon="Award"
            ),
            Achievement(
                title="10,000+ Adaptive Interviews Evaluated",
                description="Surpassed ten thousand proctored, multi-modal AI candidate interviews with zero data leaks and 98% positive candidate feedback.",
                date_str="2026-07-20",
                category="Scale Milestone",
                metric="10,000+ Sessions",
                icon="ShieldCheck"
            ),
            Achievement(
                title="Responsible AI Certification",
                description="Certified for non-discriminatory algorithmic screening and complete candidate audit transparency.",
                date_str="2026-06-01",
                category="Ethics & Compliance",
                metric="100% Auditable",
                icon="CheckCircle"
            )
        ]
        for a in achievements:
            db.add(a)

        # 12. Events
        events = [
            Event(
                title="FUTUREVERSE AI Recruitment Summit 2026",
                date_str="2026-10-18",
                time_str="10:00 AM - 4:00 PM IST",
                location="Virtual / Hybrid (Bangalore Tech Auditorium)",
                description="Keynote addresses, live demonstrations of adaptive interviewing, and discussions on responsible talent intelligence with top technology leaders.",
                image_url="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
                registration_link="https://futureverse.ai/events/summit-2026",
                status="UPCOMING"
            ),
            Event(
                title="Masterclass: Cracking the Proctored AI Interview",
                date_str="2026-09-30",
                time_str="6:00 PM - 7:30 PM IST",
                location="Virtual Interactive Webinar",
                description="Practical workshop for engineering candidates on showcasing architecture depth, communicating trade-offs, and optimizing CV signal.",
                image_url="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
                registration_link="https://futureverse.ai/events/masterclass",
                status="UPCOMING"
            )
        ]
        for e in events:
            db.add(e)

        # 13. Company Content & Creator Tribute
        cms_items = [
            CompanyContent(
                section_key="hero",
                title="Intelligent Recruitment. Better Talent. Future Ready.",
                subtitle="An AI-powered recruitment platform that helps organizations discover, evaluate, and connect with the right talent through intelligent screening, adaptive interviews, and human-centered decision making.",
                body="Connecting companies and candidates through an intelligent, transparent recruitment workflow.",
                metadata_json={"tagline": "FUTUREVERSE", "creator": "Sayan Rooj"}
            ),
            CompanyContent(
                section_key="about",
                title="Empowering Ethical, Transparent AI Recruitment",
                subtitle="Created & Developed by Sayan Rooj",
                body="FUTUREVERSE was engineered from the ground up to solve recruitment opacity. By separating what matters (defined by human recruiters) from how well candidates match (evaluated by transparent AI), FUTUREVERSE preserves meritocracy while placing ultimate hiring judgment firmly in human hands.",
                metadata_json={"creator": "Sayan Rooj", "year": "2026", "version": "2.6"}
            ),
            CompanyContent(
                section_key="contact",
                title="Connect with FUTUREVERSE",
                subtitle="Reach our Talent Advisory & Engineering Teams",
                body="Whether you are an enterprise seeking talent acceleration or a candidate aspiring for your next breakthrough, we are here to support your journey.",
                metadata_json={"email": "contact@futureverse.ai", "phone": "+91 (080) 4120-9900", "location": "Bangalore Innovation Hub, India"}
            )
        ]
        for c in cms_items:
            db.add(c)

        # 14. Seed In-app Notifications
        db.add(Notification(
            user_id=cand1_user.id,
            title="Interview Evaluated",
            message="Your AI interview for Senior AI/ML Engineer was evaluated with a standout performance score of 93.4%.",
            type="SUCCESS",
            link="/candidate/applications"
        ))

        # 15. Seed Audit Logs
        db.add(AuditLog(
            user_id=admin_user.id,
            user_role="SUPER_ADMIN",
            user_email="admin@futureverse.ai",
            action="SYSTEM_INITIALIZED",
            target_type="Platform",
            target_id="1",
            details={"version": "2026.1.0", "creator": "Sayan Rooj"}
        ))

        await db.commit()
        print("[Seed] Successfully seeded FUTUREVERSE database!")

if __name__ == "__main__":
    asyncio.run(seed_database())
