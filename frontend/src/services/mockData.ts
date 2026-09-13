// Embedded Database Synchronization for High-Speed Execution and Resilient Fallback
// Contains all 12 production jobs, 15 applicant dossiers, users, tickets, and logs from futureverse.db

export const MOCK_USERS = [
  {
    "id": 1,
    "email": "admin@futureverse.ai",
    "full_name": "Super Administrator",
    "role": "SUPER_ADMIN",
    "is_active": 1
  },
  {
    "id": 2,
    "email": "recruiter@futureverse.ai",
    "full_name": "Alex Morgan",
    "role": "OWNER",
    "is_active": 1
  },
  {
    "id": 3,
    "email": "aarav.sharma@example.com",
    "full_name": "Aarav Sharma",
    "role": "CANDIDATE",
    "is_active": 1
  },
  {
    "id": 4,
    "email": "priya.patel@example.com",
    "full_name": "Priya Patel",
    "role": "CANDIDATE",
    "is_active": 1
  },
  {
    "id": 5,
    "email": "rohan.verma@example.com",
    "full_name": "Rohan Verma",
    "role": "CANDIDATE",
    "is_active": 1
  },
  {
    "id": 6,
    "email": "ananya.sen@example.com",
    "full_name": "Ananya Sen",
    "role": "CANDIDATE",
    "is_active": 1
  },
  {
    "id": 7,
    "email": "sayanrooj742137@gmail.com",
    "full_name": "Sayan Rooj",
    "role": "CANDIDATE",
    "is_active": 1
  },
  {
    "id": 8,
    "email": "sayanrooj312005@gmail.com",
    "full_name": "sayan rooj",
    "role": "CANDIDATE",
    "is_active": 1
  }
];

export const MOCK_JOBS = [
  {
    "id": 1,
    "title": "Senior AI / Machine Learning Engineer",
    "department": "Artificial Intelligence & Data Science",
    "location": "Bangalore, India",
    "employment_type": "Full Time",
    "experience_level": "Mid-Senior",
    "work_mode": "Hybrid",
    "openings": 3,
    "status": "ACTIVE",
    "min_score_threshold": 70.0,
    "category_thresholds": {
      "Technical Skills": 65.0,
      "Problem Solving": 60.0
    },
    "created_at": "2026-09-13 11:07:43.838269",
    "description": "Join our central AI team to build high-scale machine learning models, transformer architectures, and intelligent parsing pipelines for automated decision systems.",
    "requirements_count": 14,
    "applications_count": 2,
    "requirements": [
      {
        "id": 1,
        "job_id": 1,
        "type": "EDUCATION",
        "name": "Bachelor's / Master's Degree in CS, AI, Data Science or related field",
        "level": null,
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 2,
        "job_id": 1,
        "type": "EXPERIENCE",
        "name": "1\u20133 years relevant experience in Machine Learning or Data Science",
        "level": null,
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 3,
        "job_id": 1,
        "type": "TECH_SKILL",
        "name": "Python",
        "level": "Advanced",
        "is_required": 1,
        "weight": 20.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 4,
        "job_id": 1,
        "type": "TECH_SKILL",
        "name": "Machine Learning",
        "level": "Intermediate",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 5,
        "job_id": 1,
        "type": "TECH_SKILL",
        "name": "SQL",
        "level": "Intermediate",
        "is_required": 1,
        "weight": 8.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 6,
        "job_id": 1,
        "type": "TECH_SKILL",
        "name": "Data Structures & Algorithms",
        "level": "Intermediate",
        "is_required": 0,
        "weight": 5.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 7,
        "job_id": 1,
        "type": "TECH_SKILL",
        "name": "Git",
        "level": "Intermediate",
        "is_required": 0,
        "weight": 2.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 8,
        "job_id": 1,
        "type": "PROJECT",
        "name": "Practical Machine Learning / NLP Capstone Project",
        "level": null,
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 9,
        "job_id": 1,
        "type": "KNOWLEDGE",
        "name": "Deep Learning & Neural Architectures",
        "level": "Intermediate",
        "is_required": 0,
        "weight": 4.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 10,
        "job_id": 1,
        "type": "KNOWLEDGE",
        "name": "Statistics & Probability",
        "level": "Intermediate",
        "is_required": 0,
        "weight": 3.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 11,
        "job_id": 1,
        "type": "SOFT_SKILL",
        "name": "Problem Solving",
        "level": null,
        "is_required": 1,
        "weight": 5.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 12,
        "job_id": 1,
        "type": "SOFT_SKILL",
        "name": "Communication",
        "level": null,
        "is_required": 0,
        "weight": 3.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 13,
        "job_id": 1,
        "type": "SOFT_SKILL",
        "name": "Teamwork",
        "level": null,
        "is_required": 0,
        "weight": 2.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 14,
        "job_id": 1,
        "type": "CERTIFICATION",
        "name": "AI / Cloud Certification (AWS, GCP, or DeepLearning.AI)",
        "level": null,
        "is_required": 0,
        "weight": 3.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      }
    ],
    "criteria": [
      {
        "id": 1,
        "job_id": 1,
        "category_name": "Technical Skills",
        "weight_percentage": 25.0,
        "sub_weights": "{}"
      },
      {
        "id": 2,
        "job_id": 1,
        "category_name": "Relevant Experience",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 3,
        "job_id": 1,
        "category_name": "Education",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 4,
        "job_id": 1,
        "category_name": "Projects",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 5,
        "job_id": 1,
        "category_name": "AI/ML Knowledge",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 6,
        "job_id": 1,
        "category_name": "Problem Solving",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 7,
        "job_id": 1,
        "category_name": "Communication",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      },
      {
        "id": 8,
        "job_id": 1,
        "category_name": "Certifications",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      },
      {
        "id": 9,
        "job_id": 1,
        "category_name": "Role Relevance",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      }
    ]
  },
  {
    "id": 2,
    "title": "Full Stack Software Engineer",
    "department": "Engineering & Product Delivery",
    "location": "Hyderabad, India",
    "employment_type": "Full Time",
    "experience_level": "Mid-Senior",
    "work_mode": "Hybrid",
    "openings": 2,
    "status": "ACTIVE",
    "min_score_threshold": 70.0,
    "category_thresholds": {
      "Technical Skills": 65.0
    },
    "created_at": "2026-09-13 11:07:43.842277",
    "description": "Build modern web applications, scalable client interfaces, and robust backend microservices powering our talent technology ecosystem.",
    "requirements_count": 10,
    "applications_count": 2,
    "requirements": [
      {
        "id": 15,
        "job_id": 2,
        "type": "EDUCATION",
        "name": "Bachelor's Degree in CS/IT or related engineering discipline",
        "level": null,
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 16,
        "job_id": 2,
        "type": "EXPERIENCE",
        "name": "1\u20133 years hands-on software development experience",
        "level": null,
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 17,
        "job_id": 2,
        "type": "TECH_SKILL",
        "name": "JavaScript",
        "level": "Advanced",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 18,
        "job_id": 2,
        "type": "TECH_SKILL",
        "name": "React",
        "level": "Advanced",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 19,
        "job_id": 2,
        "type": "TECH_SKILL",
        "name": "Node.js",
        "level": "Intermediate",
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 20,
        "job_id": 2,
        "type": "TECH_SKILL",
        "name": "REST APIs",
        "level": "Intermediate",
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 21,
        "job_id": 2,
        "type": "TECH_SKILL",
        "name": "SQL",
        "level": "Intermediate",
        "is_required": 0,
        "weight": 5.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 22,
        "job_id": 2,
        "type": "PROJECT",
        "name": "Production Full-Stack Application",
        "level": null,
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 23,
        "job_id": 2,
        "type": "SOFT_SKILL",
        "name": "Problem Solving",
        "level": null,
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 24,
        "job_id": 2,
        "type": "SOFT_SKILL",
        "name": "Communication",
        "level": null,
        "is_required": 0,
        "weight": 5.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      }
    ],
    "criteria": [
      {
        "id": 10,
        "job_id": 2,
        "category_name": "Technical Skills",
        "weight_percentage": 30.0,
        "sub_weights": "{}"
      },
      {
        "id": 11,
        "job_id": 2,
        "category_name": "Relevant Experience",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 12,
        "job_id": 2,
        "category_name": "Education",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 13,
        "job_id": 2,
        "category_name": "Projects",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 14,
        "job_id": 2,
        "category_name": "Problem Solving",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 15,
        "job_id": 2,
        "category_name": "Communication",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      },
      {
        "id": 16,
        "job_id": 2,
        "category_name": "Role Relevance",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      }
    ]
  },
  {
    "id": 3,
    "title": "Data Analyst & Business Intelligence Specialist",
    "department": "Data Analytics & Strategy",
    "location": "Remote / Anywhere in India",
    "employment_type": "Full Time",
    "experience_level": "Mid-Senior",
    "work_mode": "Remote",
    "openings": 2,
    "status": "ACTIVE",
    "min_score_threshold": 65.0,
    "category_thresholds": {},
    "created_at": "2026-09-13 11:07:43.887728",
    "description": "Synthesize business performance data, build interactive Power BI dashboards, and perform exploratory statistical analysis for executive stakeholders.",
    "requirements_count": 0,
    "applications_count": 2,
    "requirements": [],
    "criteria": [
      {
        "id": 17,
        "job_id": 3,
        "category_name": "Technical Skills",
        "weight_percentage": 25.0,
        "sub_weights": "{}"
      },
      {
        "id": 18,
        "job_id": 3,
        "category_name": "Relevant Experience",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 19,
        "job_id": 3,
        "category_name": "Education",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 20,
        "job_id": 3,
        "category_name": "Projects",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 21,
        "job_id": 3,
        "category_name": "Problem Solving",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 22,
        "job_id": 3,
        "category_name": "Communication",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 23,
        "job_id": 3,
        "category_name": "Role Relevance",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      }
    ]
  },
  {
    "id": 4,
    "title": "Frontend UI/UX Engineer",
    "department": "Product Design & Engineering",
    "location": "Remote / Bangalore, India",
    "employment_type": "Full Time",
    "experience_level": "Mid-Senior",
    "work_mode": "Remote",
    "openings": 2,
    "status": "ACTIVE",
    "min_score_threshold": 65.0,
    "category_thresholds": {},
    "created_at": "2026-09-13 11:07:43.914733",
    "description": "Craft pixel-perfect user interfaces, sleek motion transitions, and accessible interactive workflows using React, TypeScript, and modern CSS architecture.",
    "requirements_count": 0,
    "applications_count": 1,
    "requirements": [],
    "criteria": [
      {
        "id": 24,
        "job_id": 4,
        "category_name": "Technical Skills",
        "weight_percentage": 35.0,
        "sub_weights": "{}"
      },
      {
        "id": 25,
        "job_id": 4,
        "category_name": "Relevant Experience",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 26,
        "job_id": 4,
        "category_name": "Education",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 27,
        "job_id": 4,
        "category_name": "Projects",
        "weight_percentage": 20.0,
        "sub_weights": "{}"
      },
      {
        "id": 28,
        "job_id": 4,
        "category_name": "Communication",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 29,
        "job_id": 4,
        "category_name": "Role Relevance",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      }
    ]
  },
  {
    "id": 5,
    "title": "Software Engineering Intern (Summer 2026)",
    "department": "University Talent & Incubation",
    "location": "Bangalore Innovation Campus",
    "employment_type": "Internship",
    "experience_level": "Mid-Senior",
    "work_mode": "On-site",
    "openings": 5,
    "status": "ACTIVE",
    "min_score_threshold": 60.0,
    "category_thresholds": {},
    "created_at": "2026-09-13 11:07:43.928729",
    "description": "Intensive internship program designed for ambitious computer science undergraduates. Work alongside principal engineers to build real-world software features.",
    "requirements_count": 0,
    "applications_count": 1,
    "requirements": [],
    "criteria": [
      {
        "id": 30,
        "job_id": 5,
        "category_name": "Problem Solving",
        "weight_percentage": 25.0,
        "sub_weights": "{}"
      },
      {
        "id": 31,
        "job_id": 5,
        "category_name": "Technical Skills",
        "weight_percentage": 25.0,
        "sub_weights": "{}"
      },
      {
        "id": 32,
        "job_id": 5,
        "category_name": "Education",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 33,
        "job_id": 5,
        "category_name": "Projects",
        "weight_percentage": 20.0,
        "sub_weights": "{}"
      },
      {
        "id": 34,
        "job_id": 5,
        "category_name": "Communication",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      },
      {
        "id": 35,
        "job_id": 5,
        "category_name": "Role Relevance",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      }
    ]
  },
  {
    "id": 6,
    "title": "Senior DevOps Architect (100% Criteria Verified)",
    "department": "Infrastructure",
    "location": "Bengaluru / Remote",
    "employment_type": "Full-Time",
    "experience_level": "Mid-Senior",
    "work_mode": "Remote",
    "openings": 2,
    "status": "ACTIVE",
    "min_score_threshold": 70.0,
    "category_thresholds": {},
    "created_at": "2026-09-13 11:21:27.869757",
    "description": "Leading cloud infrastructure",
    "requirements_count": 1,
    "applications_count": 1,
    "requirements": [
      {
        "id": 25,
        "job_id": 6,
        "type": "hard_skill",
        "name": "Kubernetes & Terraform",
        "level": "Expert",
        "is_required": 1,
        "weight": 35.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      }
    ],
    "criteria": [
      {
        "id": 36,
        "job_id": 6,
        "category_name": "Technical Hard Skills",
        "weight_percentage": 40.0,
        "sub_weights": "{}"
      },
      {
        "id": 37,
        "job_id": 6,
        "category_name": "Cloud Architecture",
        "weight_percentage": 40.0,
        "sub_weights": "{}"
      },
      {
        "id": 38,
        "job_id": 6,
        "category_name": "Leadership & Communication",
        "weight_percentage": 20.0,
        "sub_weights": "{}"
      }
    ]
  },
  {
    "id": 7,
    "title": "Senior DevOps Architect (100% Criteria Verified)",
    "department": "Infrastructure",
    "location": "Bengaluru / Remote",
    "employment_type": "Full-Time",
    "experience_level": "Mid-Senior",
    "work_mode": "Remote",
    "openings": 2,
    "status": "ACTIVE",
    "min_score_threshold": 70.0,
    "category_thresholds": {},
    "created_at": "2026-09-13 11:22:51.581712",
    "description": "Leading cloud infrastructure",
    "requirements_count": 1,
    "applications_count": 1,
    "requirements": [
      {
        "id": 26,
        "job_id": 7,
        "type": "hard_skill",
        "name": "Kubernetes & Terraform",
        "level": "Expert",
        "is_required": 1,
        "weight": 35.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      }
    ],
    "criteria": [
      {
        "id": 39,
        "job_id": 7,
        "category_name": "Technical Hard Skills",
        "weight_percentage": 40.0,
        "sub_weights": "{}"
      },
      {
        "id": 40,
        "job_id": 7,
        "category_name": "Cloud Architecture",
        "weight_percentage": 40.0,
        "sub_weights": "{}"
      },
      {
        "id": 41,
        "job_id": 7,
        "category_name": "Leadership & Communication",
        "weight_percentage": 20.0,
        "sub_weights": "{}"
      }
    ]
  },
  {
    "id": 8,
    "title": "Senior DevOps Architect (100% Criteria Verified)",
    "department": "Infrastructure",
    "location": "Bengaluru / Remote",
    "employment_type": "Full-Time",
    "experience_level": "Mid-Senior",
    "work_mode": "Remote",
    "openings": 2,
    "status": "ACTIVE",
    "min_score_threshold": 70.0,
    "category_thresholds": {},
    "created_at": "2026-09-13 12:44:06.175312",
    "description": "Leading cloud infrastructure",
    "requirements_count": 1,
    "applications_count": 0,
    "requirements": [
      {
        "id": 27,
        "job_id": 8,
        "type": "hard_skill",
        "name": "Kubernetes & Terraform",
        "level": "Expert",
        "is_required": 1,
        "weight": 35.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      }
    ],
    "criteria": [
      {
        "id": 42,
        "job_id": 8,
        "category_name": "Technical Hard Skills",
        "weight_percentage": 40.0,
        "sub_weights": "{}"
      },
      {
        "id": 43,
        "job_id": 8,
        "category_name": "Cloud Architecture",
        "weight_percentage": 40.0,
        "sub_weights": "{}"
      },
      {
        "id": 44,
        "job_id": 8,
        "category_name": "Leadership & Communication",
        "weight_percentage": 20.0,
        "sub_weights": "{}"
      }
    ]
  },
  {
    "id": 9,
    "title": "new requirment",
    "department": "Artificial Intelligence & Data Science",
    "location": "kolkata west bengal india",
    "employment_type": "Full Time",
    "experience_level": "Mid-Senior",
    "work_mode": "On-site",
    "openings": 2,
    "status": "ACTIVE",
    "min_score_threshold": 70.0,
    "category_thresholds": {
      "Technical Skills": 60.0,
      "Problem Solving": 60.0
    },
    "created_at": "2026-09-13 12:57:08.107076",
    "description": "done all the things ",
    "requirements_count": 8,
    "applications_count": 2,
    "requirements": [
      {
        "id": 28,
        "job_id": 9,
        "type": "EDUCATION",
        "name": "Bachelor's Degree in Computer Science or related field",
        "level": "Degree",
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 29,
        "job_id": 9,
        "type": "EXPERIENCE",
        "name": "2 years relevant experience",
        "level": "2+ yrs",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 30,
        "job_id": 9,
        "type": "TECH_SKILL",
        "name": "Python",
        "level": "Advanced",
        "is_required": 1,
        "weight": 20.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 31,
        "job_id": 9,
        "type": "TECH_SKILL",
        "name": "Machine Learning",
        "level": "Intermediate",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 32,
        "job_id": 9,
        "type": "TECH_SKILL",
        "name": "SQL",
        "level": "Intermediate",
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 33,
        "job_id": 9,
        "type": "SOFT_SKILL",
        "name": "Problem Solving",
        "level": "Professional",
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 34,
        "job_id": 9,
        "type": "SOFT_SKILL",
        "name": "Communication",
        "level": "Professional",
        "is_required": 0,
        "weight": 5.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 35,
        "job_id": 9,
        "type": "PROJECT",
        "name": "Practical Machine Learning / NLP Capstone Implementation",
        "level": "Production Ready",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      }
    ],
    "criteria": [
      {
        "id": 45,
        "job_id": 9,
        "category_name": "Technical Skills",
        "weight_percentage": 25.0,
        "sub_weights": "{}"
      },
      {
        "id": 46,
        "job_id": 9,
        "category_name": "Relevant Experience",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 47,
        "job_id": 9,
        "category_name": "Education",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 48,
        "job_id": 9,
        "category_name": "Projects",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 49,
        "job_id": 9,
        "category_name": "AI/ML Knowledge",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 50,
        "job_id": 9,
        "category_name": "Problem Solving",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 51,
        "job_id": 9,
        "category_name": "Communication",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      },
      {
        "id": 52,
        "job_id": 9,
        "category_name": "Certifications",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      },
      {
        "id": 53,
        "job_id": 9,
        "category_name": "Role Relevance",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      }
    ]
  },
  {
    "id": 10,
    "title": "new in company",
    "department": "Artificial Intelligence & Data Science",
    "location": "Bangalore, India",
    "employment_type": "Full Time",
    "experience_level": "Mid-Senior",
    "work_mode": "Hybrid",
    "openings": 2,
    "status": "ACTIVE",
    "min_score_threshold": 70.0,
    "category_thresholds": {
      "Technical Skills": 60.0,
      "Problem Solving": 60.0
    },
    "created_at": "2026-09-13 13:05:47.348320",
    "description": "nothing",
    "requirements_count": 8,
    "applications_count": 2,
    "requirements": [
      {
        "id": 36,
        "job_id": 10,
        "type": "EDUCATION",
        "name": "Bachelor's Degree in Computer Science or related field",
        "level": "Degree",
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 37,
        "job_id": 10,
        "type": "EXPERIENCE",
        "name": "2 years relevant experience",
        "level": "2+ yrs",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 38,
        "job_id": 10,
        "type": "TECH_SKILL",
        "name": "Python",
        "level": "Advanced",
        "is_required": 1,
        "weight": 20.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 39,
        "job_id": 10,
        "type": "TECH_SKILL",
        "name": "Machine Learning",
        "level": "Intermediate",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 40,
        "job_id": 10,
        "type": "TECH_SKILL",
        "name": "SQL",
        "level": "Intermediate",
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 41,
        "job_id": 10,
        "type": "SOFT_SKILL",
        "name": "Problem Solving",
        "level": "Professional",
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 42,
        "job_id": 10,
        "type": "SOFT_SKILL",
        "name": "Communication",
        "level": "Professional",
        "is_required": 0,
        "weight": 5.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 43,
        "job_id": 10,
        "type": "PROJECT",
        "name": "Practical Machine Learning / NLP Capstone Implementation",
        "level": "Production Ready",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      }
    ],
    "criteria": [
      {
        "id": 54,
        "job_id": 10,
        "category_name": "Technical Skills",
        "weight_percentage": 25.0,
        "sub_weights": "{}"
      },
      {
        "id": 55,
        "job_id": 10,
        "category_name": "Relevant Experience",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 56,
        "job_id": 10,
        "category_name": "Education",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 57,
        "job_id": 10,
        "category_name": "Projects",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 58,
        "job_id": 10,
        "category_name": "AI/ML Knowledge",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 59,
        "job_id": 10,
        "category_name": "Problem Solving",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 60,
        "job_id": 10,
        "category_name": "Communication",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      },
      {
        "id": 61,
        "job_id": 10,
        "category_name": "Certifications",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      },
      {
        "id": 62,
        "job_id": 10,
        "category_name": "Role Relevance",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      }
    ]
  },
  {
    "id": 11,
    "title": "CSE (AI) Engineer",
    "department": "Artificial Intelligence & Data Science",
    "location": "Kolkata / Bangalore, India",
    "employment_type": "Full Time",
    "experience_level": "Mid-Senior",
    "work_mode": "Hybrid",
    "openings": 3,
    "status": "ACTIVE",
    "min_score_threshold": 70.0,
    "category_thresholds": {},
    "created_at": "2026-09-13 13:31:15.172148",
    "description": "Developing multi-modal recruitment neural networks and semantic embeddings.",
    "requirements_count": 0,
    "applications_count": 0,
    "requirements": [],
    "criteria": []
  },
  {
    "id": 12,
    "title": "for email msg",
    "department": "Artificial Intelligence & Data Science",
    "location": "Bangalore, India",
    "employment_type": "Full Time",
    "experience_level": "Mid-Senior",
    "work_mode": "Hybrid",
    "openings": 2,
    "status": "ACTIVE",
    "min_score_threshold": 70.0,
    "category_thresholds": {
      "Technical Skills": 60.0,
      "Problem Solving": 60.0
    },
    "created_at": "2026-09-13 15:02:58.130616",
    "description": "receiving msg",
    "requirements_count": 8,
    "applications_count": 1,
    "requirements": [
      {
        "id": 44,
        "job_id": 12,
        "type": "EDUCATION",
        "name": "Bachelor's Degree in Computer Science or related field",
        "level": "Degree",
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 45,
        "job_id": 12,
        "type": "EXPERIENCE",
        "name": "2 years relevant experience",
        "level": "2+ yrs",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 46,
        "job_id": 12,
        "type": "TECH_SKILL",
        "name": "Python",
        "level": "Advanced",
        "is_required": 1,
        "weight": 20.0,
        "min_score": 0.0,
        "is_knockout": 1,
        "details": "{}"
      },
      {
        "id": 47,
        "job_id": 12,
        "type": "TECH_SKILL",
        "name": "Machine Learning",
        "level": "Intermediate",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 48,
        "job_id": 12,
        "type": "TECH_SKILL",
        "name": "SQL",
        "level": "Intermediate",
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 49,
        "job_id": 12,
        "type": "SOFT_SKILL",
        "name": "Problem Solving",
        "level": "Professional",
        "is_required": 1,
        "weight": 10.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 50,
        "job_id": 12,
        "type": "SOFT_SKILL",
        "name": "Communication",
        "level": "Professional",
        "is_required": 0,
        "weight": 5.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      },
      {
        "id": 51,
        "job_id": 12,
        "type": "PROJECT",
        "name": "Practical Machine Learning / NLP Capstone Implementation",
        "level": "Production Ready",
        "is_required": 1,
        "weight": 15.0,
        "min_score": 0.0,
        "is_knockout": 0,
        "details": "{}"
      }
    ],
    "criteria": [
      {
        "id": 63,
        "job_id": 12,
        "category_name": "Technical Skills",
        "weight_percentage": 30.0,
        "sub_weights": "{}"
      },
      {
        "id": 64,
        "job_id": 12,
        "category_name": "Relevant Experience",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 65,
        "job_id": 12,
        "category_name": "Education",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 66,
        "job_id": 12,
        "category_name": "Projects",
        "weight_percentage": 15.0,
        "sub_weights": "{}"
      },
      {
        "id": 67,
        "job_id": 12,
        "category_name": "AI/ML Knowledge",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 68,
        "job_id": 12,
        "category_name": "Problem Solving",
        "weight_percentage": 10.0,
        "sub_weights": "{}"
      },
      {
        "id": 69,
        "job_id": 12,
        "category_name": "Communication",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      },
      {
        "id": 70,
        "job_id": 12,
        "category_name": "Role Relevance",
        "weight_percentage": 5.0,
        "sub_weights": "{}"
      }
    ]
  }
];

export const MOCK_APPLICATIONS = [
  {
    "id": 1,
    "job_id": 1,
    "job_title": "Senior AI / Machine Learning Engineer",
    "job_department": "Artificial Intelligence & Data Science",
    "work_mode": "Hybrid",
    "candidate_id": 1,
    "candidate_name": "Super Administrator",
    "candidate_email": "admin@futureverse.ai",
    "status": "Offer Extended",
    "overall_match_score": 92.4,
    "applied_at": "2026-09-13 11:07:43.949239",
    "updated_at": "2026-09-13 13:41:04.395445",
    "final_decision": "SELECTED",
    "final_decision_at": "2026-09-13 13:40:57.289295",
    "final_decision_by": "Alex Morgan",
    "final_decision_notes": "",
    "status_summary": "Application currently in Offer Extended stage",
    "stage": "Stage: Offer Extended",
    "interview_score": 88.0,
    "interview_status": "Completed",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 92.4,
      "criteria_breakdown": {
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
      "requirement_evidence": [
        {
          "name": "Python",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Extensive Python production history and open-source contributions verified.",
          "impact": "High"
        },
        {
          "name": "Machine Learning",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "2 capstone ML architectures deployed in production.",
          "impact": "High"
        },
        {
          "name": "SQL",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Relational schema design and query optimization confirmed.",
          "impact": "High"
        },
        {
          "name": "AWS Certified Machine Learning",
          "type": "CERTIFICATION",
          "is_required": false,
          "status": "Met",
          "evidence": "Valid AWS Specialty credential verified.",
          "impact": "Low"
        },
        {
          "name": "Master's Degree in AI/CS",
          "type": "EDUCATION",
          "is_required": true,
          "status": "Met",
          "evidence": "M.Tech in AI from premier technical institution.",
          "impact": "High"
        }
      ],
      "knockout_met": true
    },
    "interview": {
      "id": 1,
      "token": "demo-aarav-interview-token-2026",
      "status": "Completed",
      "scheduled_at": "2026-09-13 11:07:43.962237"
    },
    "f2f_schedule": {
      "round_type": "FACE_TO_FACE",
      "date_str": "2026-09-24",
      "time_str": "15:00 IST",
      "meeting_link": "https://meet.futureverse.ai/f2f-executive"
    }
  },
  {
    "id": 2,
    "job_id": 2,
    "job_title": "Full Stack Software Engineer",
    "job_department": "Engineering & Product Delivery",
    "work_mode": "Hybrid",
    "candidate_id": 2,
    "candidate_name": "Alex Morgan",
    "candidate_email": "recruiter@futureverse.ai",
    "status": "Shortlisted",
    "overall_match_score": 88.5,
    "applied_at": "2026-09-13 11:07:43.971661",
    "updated_at": "2026-09-13 11:07:43.971661",
    "final_decision": null,
    "final_decision_at": null,
    "final_decision_by": null,
    "final_decision_notes": null,
    "status_summary": "Application currently in Shortlisted stage",
    "stage": "Stage: Shortlisted",
    "interview_score": null,
    "interview_status": "PENDING",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 88.5,
      "criteria_breakdown": {
        "Technical Skills": 90.0,
        "Relevant Experience": 85.0,
        "Education": 95.0,
        "Projects": 88.0,
        "Problem Solving": 86.0,
        "Communication": 85.0,
        "Role Relevance": 85.0
      },
      "requirement_evidence": [
        {
          "name": "React",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Production state management and dynamic UI experience verified.",
          "impact": "High"
        },
        {
          "name": "Node.js",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Asynchronous REST microservice architecture confirmed.",
          "impact": "High"
        },
        {
          "name": "SQL",
          "type": "TECH_SKILL",
          "is_required": false,
          "status": "Met",
          "evidence": "Relational schema experience present in project history.",
          "impact": "Low"
        }
      ],
      "knockout_met": true
    },
    "interview": null,
    "f2f_schedule": null
  },
  {
    "id": 3,
    "job_id": 3,
    "job_title": "Data Analyst & Business Intelligence Specialist",
    "job_department": "Data Analytics & Strategy",
    "work_mode": "Remote",
    "candidate_id": 3,
    "candidate_name": "Aarav Sharma",
    "candidate_email": "aarav.sharma@example.com",
    "status": "Recruiter Review",
    "overall_match_score": 82.0,
    "applied_at": "2026-09-13 11:07:43.989664",
    "updated_at": "2026-09-13 11:07:43.989664",
    "final_decision": null,
    "final_decision_at": null,
    "final_decision_by": null,
    "final_decision_notes": null,
    "status_summary": "Application currently in Recruiter Review stage",
    "stage": "Stage: Recruiter Review",
    "interview_score": null,
    "interview_status": "PENDING",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 82.0,
      "criteria_breakdown": {
        "Technical Skills": 85.0,
        "Relevant Experience": 80.0,
        "Education": 85.0,
        "Projects": 82.0,
        "Problem Solving": 80.0,
        "Communication": 80.0,
        "Role Relevance": 80.0
      },
      "requirement_evidence": [
        {
          "name": "SQL",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Complex analytical queries and window functions documented.",
          "impact": "High"
        },
        {
          "name": "Power BI",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Demonstrated BI dashboard portfolio verified.",
          "impact": "High"
        }
      ],
      "knockout_met": true
    },
    "interview": null,
    "f2f_schedule": null
  },
  {
    "id": 4,
    "job_id": 7,
    "job_title": "Senior DevOps Architect (100% Criteria Verified)",
    "job_department": "Infrastructure",
    "work_mode": "Remote",
    "candidate_id": 5,
    "candidate_name": "Rohan Verma",
    "candidate_email": "rohan.verma@example.com",
    "status": "CV Screening",
    "overall_match_score": 75.0,
    "applied_at": "2026-09-13 11:51:52.927309",
    "updated_at": "2026-09-13 11:51:52.927309",
    "final_decision": null,
    "final_decision_at": null,
    "final_decision_by": null,
    "final_decision_notes": null,
    "status_summary": "Application currently in CV Screening stage",
    "stage": "Stage: CV Screening",
    "interview_score": null,
    "interview_status": "PENDING",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 75.0,
      "criteria_breakdown": {
        "Technical Skills": 80.0,
        "Relevant Experience": 80.0,
        "Education": 80.0,
        "Projects": 80.0,
        "Soft Skills": 80.0,
        "Certifications": 80.0,
        "AI/ML Knowledge": 80.0,
        "Problem Solving": 80.0,
        "Communication": 80.0,
        "Role Relevance": 170.0
      },
      "requirement_evidence": [
        {
          "name": "Kubernetes & Terraform",
          "type": "hard_skill",
          "is_required": true,
          "status": "Met",
          "evidence": "Verified alignment with requirement: Kubernetes & Terraform.",
          "impact": "High"
        }
      ],
      "knockout_met": true
    },
    "interview": null,
    "f2f_schedule": null
  },
  {
    "id": 5,
    "job_id": 6,
    "job_title": "Senior DevOps Architect (100% Criteria Verified)",
    "job_department": "Infrastructure",
    "work_mode": "Remote",
    "candidate_id": 5,
    "candidate_name": "Rohan Verma",
    "candidate_email": "rohan.verma@example.com",
    "status": "CV Screening",
    "overall_match_score": 75.0,
    "applied_at": "2026-09-13 11:52:26.131548",
    "updated_at": "2026-09-13 11:52:26.131548",
    "final_decision": null,
    "final_decision_at": null,
    "final_decision_by": null,
    "final_decision_notes": null,
    "status_summary": "Application currently in CV Screening stage",
    "stage": "Stage: CV Screening",
    "interview_score": null,
    "interview_status": "PENDING",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 75.0,
      "criteria_breakdown": {
        "Technical Skills": 80.0,
        "Relevant Experience": 80.0,
        "Education": 80.0,
        "Projects": 80.0,
        "Soft Skills": 80.0,
        "Certifications": 80.0,
        "AI/ML Knowledge": 80.0,
        "Problem Solving": 80.0,
        "Communication": 80.0,
        "Role Relevance": 170.0
      },
      "requirement_evidence": [
        {
          "name": "Kubernetes & Terraform",
          "type": "hard_skill",
          "is_required": true,
          "status": "Met",
          "evidence": "Verified alignment with requirement: Kubernetes & Terraform.",
          "impact": "High"
        }
      ],
      "knockout_met": true
    },
    "interview": null,
    "f2f_schedule": null
  },
  {
    "id": 6,
    "job_id": 1,
    "job_title": "Senior AI / Machine Learning Engineer",
    "job_department": "Artificial Intelligence & Data Science",
    "work_mode": "Hybrid",
    "candidate_id": 5,
    "candidate_name": "Rohan Verma",
    "candidate_email": "rohan.verma@example.com",
    "status": "Offer Extended",
    "overall_match_score": 61.2,
    "applied_at": "2026-09-13 11:52:45.849884",
    "updated_at": "2026-09-13 13:03:45.733349",
    "final_decision": "SELECTED",
    "final_decision_at": "2026-09-13 13:03:45.733349",
    "final_decision_by": "Alex Morgan",
    "final_decision_notes": "done",
    "status_summary": "Application currently in Offer Extended stage",
    "stage": "Stage: Offer Extended",
    "interview_score": 88.0,
    "interview_status": "Completed",
    "recommendation": "Review",
    "scores": {
      "overall_score": 61.2,
      "criteria_breakdown": {
        "Technical Skills": 40.0,
        "Relevant Experience": 40.0,
        "Education": 100.0,
        "Projects": 95.0,
        "Soft Skills": 70.0,
        "Certifications": 50.0,
        "AI/ML Knowledge": 40.0,
        "Problem Solving": 70.0,
        "Communication": 70.0,
        "Role Relevance": 80.0
      },
      "requirement_evidence": [
        {
          "name": "Bachelor's / Master's Degree in CS, AI, Data Science or related field",
          "type": "EDUCATION",
          "is_required": true,
          "status": "Met",
          "evidence": "Formal degree verified: Bachelor's Degree in Computer Science matches academic criteria.",
          "impact": "High"
        },
        {
          "name": "1\u20133 years relevant experience in Machine Learning or Data Science",
          "type": "EXPERIENCE",
          "is_required": true,
          "status": "Not Met",
          "evidence": "Candidate profile indicates 2.0 years, below configured requirement.",
          "impact": "High"
        },
        {
          "name": "Python",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill Python found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "Machine Learning",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill Machine Learning found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "SQL",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill SQL found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "Data Structures & Algorithms",
          "type": "TECH_SKILL",
          "is_required": false,
          "status": "Met",
          "evidence": "Demonstrated proficiency in Data Structures & Algorithms verified from candidate profile and technical portfolio.",
          "impact": "Low"
        },
        {
          "name": "Git",
          "type": "TECH_SKILL",
          "is_required": false,
          "status": "Not Met",
          "evidence": "Preferred skill Git not listed; non-critical to core qualification.",
          "impact": "Low"
        },
        {
          "name": "Practical Machine Learning / NLP Capstone Project",
          "type": "PROJECT",
          "is_required": true,
          "status": "Met",
          "evidence": "Multiple practical project implementations identified: Full-Stack Web Application with React and FastAPI.",
          "impact": "High"
        },
        {
          "name": "Deep Learning & Neural Architectures",
          "type": "KNOWLEDGE",
          "is_required": false,
          "status": "Not Met",
          "evidence": "Preferred skill Deep Learning & Neural Architectures not listed; non-critical to core qualification.",
          "impact": "Low"
        },
        {
          "name": "Statistics & Probability",
          "type": "KNOWLEDGE",
          "is_required": false,
          "status": "Not Met",
          "evidence": "Preferred skill Statistics & Probability not listed; non-critical to core qualification.",
          "impact": "Low"
        },
        {
          "name": "Problem Solving",
          "type": "SOFT_SKILL",
          "is_required": true,
          "status": "Partially Met",
          "evidence": "General professional maturity observed; targeted Problem Solving assessment via AI interview recommended.",
          "impact": "High"
        },
        {
          "name": "Communication",
          "type": "SOFT_SKILL",
          "is_required": false,
          "status": "Partially Met",
          "evidence": "General professional maturity observed; targeted Communication assessment via AI interview recommended.",
          "impact": "Low"
        },
        {
          "name": "Teamwork",
          "type": "SOFT_SKILL",
          "is_required": false,
          "status": "Partially Met",
          "evidence": "General professional maturity observed; targeted Teamwork assessment via AI interview recommended.",
          "impact": "Low"
        },
        {
          "name": "AI / Cloud Certification (AWS, GCP, or DeepLearning.AI)",
          "type": "CERTIFICATION",
          "is_required": false,
          "status": "Not Met",
          "evidence": "Preferred credential AI / Cloud Certification (AWS, GCP, or DeepLearning.AI) not found in candidate certification list.",
          "impact": "Low"
        }
      ],
      "knockout_met": false
    },
    "interview": {
      "id": 2,
      "token": "1c199b0e-02df-44e8-802d-763442492453",
      "status": "Completed",
      "scheduled_at": "2026-09-13 11:57:11.688608"
    },
    "f2f_schedule": {
      "round_type": "FACE_TO_FACE",
      "date_str": "2026-09-24",
      "time_str": "15:00 IST",
      "meeting_link": "https://meet.futureverse.ai/f2f-executive"
    }
  },
  {
    "id": 7,
    "job_id": 4,
    "job_title": "Frontend UI/UX Engineer",
    "job_department": "Product Design & Engineering",
    "work_mode": "Remote",
    "candidate_id": 5,
    "candidate_name": "Rohan Verma",
    "candidate_email": "rohan.verma@example.com",
    "status": "Not Selected",
    "overall_match_score": 80.0,
    "applied_at": "2026-09-13 11:58:02.487615",
    "updated_at": "2026-09-13 12:15:57.870693",
    "final_decision": null,
    "final_decision_at": null,
    "final_decision_by": null,
    "final_decision_notes": null,
    "status_summary": "Application currently in Not Selected stage",
    "stage": "Stage: Not Selected",
    "interview_score": null,
    "interview_status": "PENDING",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 80.0,
      "criteria_breakdown": {
        "Technical Skills": 80.0,
        "Relevant Experience": 80.0,
        "Education": 80.0,
        "Projects": 80.0,
        "Soft Skills": 80.0,
        "Certifications": 80.0,
        "AI/ML Knowledge": 80.0,
        "Problem Solving": 80.0,
        "Communication": 80.0,
        "Role Relevance": 80.0
      },
      "requirement_evidence": [],
      "knockout_met": true
    },
    "interview": null,
    "f2f_schedule": null
  },
  {
    "id": 8,
    "job_id": 3,
    "job_title": "Data Analyst & Business Intelligence Specialist",
    "job_department": "Data Analytics & Strategy",
    "work_mode": "Remote",
    "candidate_id": 5,
    "candidate_name": "Rohan Verma",
    "candidate_email": "rohan.verma@example.com",
    "status": "Not Selected",
    "overall_match_score": 80.0,
    "applied_at": "2026-09-13 11:58:07.148642",
    "updated_at": "2026-09-13 12:13:17.321994",
    "final_decision": null,
    "final_decision_at": null,
    "final_decision_by": null,
    "final_decision_notes": null,
    "status_summary": "Application currently in Not Selected stage",
    "stage": "Stage: Not Selected",
    "interview_score": null,
    "interview_status": "PENDING",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 80.0,
      "criteria_breakdown": {
        "Technical Skills": 80.0,
        "Relevant Experience": 80.0,
        "Education": 80.0,
        "Projects": 80.0,
        "Soft Skills": 80.0,
        "Certifications": 80.0,
        "AI/ML Knowledge": 80.0,
        "Problem Solving": 80.0,
        "Communication": 80.0,
        "Role Relevance": 80.0
      },
      "requirement_evidence": [],
      "knockout_met": true
    },
    "interview": null,
    "f2f_schedule": null
  },
  {
    "id": 9,
    "job_id": 2,
    "job_title": "Full Stack Software Engineer",
    "job_department": "Engineering & Product Delivery",
    "work_mode": "Hybrid",
    "candidate_id": 5,
    "candidate_name": "Rohan Verma",
    "candidate_email": "rohan.verma@example.com",
    "status": "AI Interview Invited",
    "overall_match_score": 59.5,
    "applied_at": "2026-09-13 11:58:10.886611",
    "updated_at": "2026-09-13 16:05:35.247241",
    "final_decision": null,
    "final_decision_at": null,
    "final_decision_by": null,
    "final_decision_notes": null,
    "status_summary": "Application currently in AI Interview Invited stage",
    "stage": "Stage: AI Interview Invited",
    "interview_score": 88.0,
    "interview_status": "Scheduled",
    "recommendation": "Review",
    "scores": {
      "overall_score": 59.5,
      "criteria_breakdown": {
        "Technical Skills": 24.0,
        "Relevant Experience": 40.0,
        "Education": 100.0,
        "Projects": 95.0,
        "Soft Skills": 80.0,
        "Certifications": 80.0,
        "AI/ML Knowledge": 80.0,
        "Problem Solving": 70.0,
        "Communication": 70.0,
        "Role Relevance": 80.0
      },
      "requirement_evidence": [
        {
          "name": "Bachelor's Degree in CS/IT or related engineering discipline",
          "type": "EDUCATION",
          "is_required": true,
          "status": "Met",
          "evidence": "Formal degree verified: Bachelor's Degree in Computer Science matches academic criteria.",
          "impact": "High"
        },
        {
          "name": "1\u20133 years hands-on software development experience",
          "type": "EXPERIENCE",
          "is_required": true,
          "status": "Not Met",
          "evidence": "Candidate profile indicates 2.0 years, below configured requirement.",
          "impact": "High"
        },
        {
          "name": "JavaScript",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill JavaScript found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "React",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill React found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "Node.js",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill Node.js found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "REST APIs",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill REST APIs found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "SQL",
          "type": "TECH_SKILL",
          "is_required": false,
          "status": "Not Met",
          "evidence": "Preferred skill SQL not listed; non-critical to core qualification.",
          "impact": "Low"
        },
        {
          "name": "Production Full-Stack Application",
          "type": "PROJECT",
          "is_required": true,
          "status": "Met",
          "evidence": "Multiple practical project implementations identified: Full-Stack Web Application with React and FastAPI.",
          "impact": "High"
        },
        {
          "name": "Problem Solving",
          "type": "SOFT_SKILL",
          "is_required": true,
          "status": "Partially Met",
          "evidence": "General professional maturity observed; targeted Problem Solving assessment via AI interview recommended.",
          "impact": "High"
        },
        {
          "name": "Communication",
          "type": "SOFT_SKILL",
          "is_required": false,
          "status": "Partially Met",
          "evidence": "General professional maturity observed; targeted Communication assessment via AI interview recommended.",
          "impact": "Low"
        }
      ],
      "knockout_met": true
    },
    "interview": {
      "id": 6,
      "token": "ff7e4cc9-714c-46ed-9ad9-133ea11db61e",
      "status": "Scheduled",
      "scheduled_at": "2026-09-13 16:05:35.222404"
    },
    "f2f_schedule": null
  },
  {
    "id": 10,
    "job_id": 5,
    "job_title": "Software Engineering Intern (Summer 2026)",
    "job_department": "University Talent & Incubation",
    "work_mode": "On-site",
    "candidate_id": 5,
    "candidate_name": "Rohan Verma",
    "candidate_email": "rohan.verma@example.com",
    "status": "Shortlisted",
    "overall_match_score": 80.0,
    "applied_at": "2026-09-13 11:58:26.953599",
    "updated_at": "2026-09-13 12:14:36.343711",
    "final_decision": null,
    "final_decision_at": null,
    "final_decision_by": null,
    "final_decision_notes": null,
    "status_summary": "Application currently in Shortlisted stage",
    "stage": "Stage: Shortlisted",
    "interview_score": null,
    "interview_status": "PENDING",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 80.0,
      "criteria_breakdown": {
        "Technical Skills": 80.0,
        "Relevant Experience": 80.0,
        "Education": 80.0,
        "Projects": 80.0,
        "Soft Skills": 80.0,
        "Certifications": 80.0,
        "AI/ML Knowledge": 80.0,
        "Problem Solving": 80.0,
        "Communication": 80.0,
        "Role Relevance": 80.0
      },
      "requirement_evidence": [],
      "knockout_met": true
    },
    "interview": null,
    "f2f_schedule": null
  },
  {
    "id": 11,
    "job_id": 9,
    "job_title": "new requirment",
    "job_department": "Artificial Intelligence & Data Science",
    "work_mode": "On-site",
    "candidate_id": 1,
    "candidate_name": "Super Administrator",
    "candidate_email": "admin@futureverse.ai",
    "status": "CV Screening",
    "overall_match_score": 94.5,
    "applied_at": "2026-09-13 12:58:03.866180",
    "updated_at": "2026-09-13 12:58:03.866180",
    "final_decision": null,
    "final_decision_at": null,
    "final_decision_by": null,
    "final_decision_notes": null,
    "status_summary": "Application currently in CV Screening stage",
    "stage": "Stage: CV Screening",
    "interview_score": null,
    "interview_status": "PENDING",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 94.5,
      "criteria_breakdown": {
        "Technical Skills": 100.0,
        "Relevant Experience": 100.0,
        "Education": 100.0,
        "Projects": 95.0,
        "Soft Skills": 80.0,
        "Certifications": 80.0,
        "AI/ML Knowledge": 80.0,
        "Problem Solving": 95.0,
        "Communication": 95.0,
        "Role Relevance": 80.0
      },
      "requirement_evidence": [
        {
          "name": "Bachelor's Degree in Computer Science or related field",
          "type": "EDUCATION",
          "is_required": true,
          "status": "Met",
          "evidence": "Formal degree verified: Master of Technology (M.Tech) matches academic criteria.",
          "impact": "High"
        },
        {
          "name": "2 years relevant experience",
          "type": "EXPERIENCE",
          "is_required": true,
          "status": "Met",
          "evidence": "Candidate documents 2.5 years of relevant experience, meeting the 2-year requirement.",
          "impact": "High"
        },
        {
          "name": "Python",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Demonstrated proficiency in Python verified from candidate profile and technical portfolio.",
          "impact": "High"
        },
        {
          "name": "Machine Learning",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Demonstrated proficiency in Machine Learning verified from candidate profile and technical portfolio.",
          "impact": "High"
        },
        {
          "name": "SQL",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Demonstrated proficiency in SQL verified from candidate profile and technical portfolio.",
          "impact": "High"
        },
        {
          "name": "Problem Solving",
          "type": "SOFT_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Clear demonstration of Problem Solving in team and collaborative history.",
          "impact": "High"
        },
        {
          "name": "Communication",
          "type": "SOFT_SKILL",
          "is_required": false,
          "status": "Met",
          "evidence": "Clear demonstration of Communication in team and collaborative history.",
          "impact": "Low"
        },
        {
          "name": "Practical Machine Learning / NLP Capstone Implementation",
          "type": "PROJECT",
          "is_required": true,
          "status": "Met",
          "evidence": "Multiple practical project implementations identified: Automated Multilingual Resume Parser.",
          "impact": "High"
        }
      ],
      "knockout_met": true
    },
    "interview": null,
    "f2f_schedule": null
  },
  {
    "id": 12,
    "job_id": 10,
    "job_title": "new in company",
    "job_department": "Artificial Intelligence & Data Science",
    "work_mode": "Hybrid",
    "candidate_id": 1,
    "candidate_name": "Super Administrator",
    "candidate_email": "admin@futureverse.ai",
    "status": "Offer Extended",
    "overall_match_score": 94.5,
    "applied_at": "2026-09-13 13:07:34.658850",
    "updated_at": "2026-09-13 13:39:15.742006",
    "final_decision": "SELECTED",
    "final_decision_at": "2026-09-13 13:39:15.742006",
    "final_decision_by": "Alex Morgan",
    "final_decision_notes": "",
    "status_summary": "Application currently in Offer Extended stage",
    "stage": "Stage: Offer Extended",
    "interview_score": null,
    "interview_status": "PENDING",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 94.5,
      "criteria_breakdown": {
        "Technical Skills": 100.0,
        "Relevant Experience": 100.0,
        "Education": 100.0,
        "Projects": 95.0,
        "Soft Skills": 80.0,
        "Certifications": 80.0,
        "AI/ML Knowledge": 80.0,
        "Problem Solving": 95.0,
        "Communication": 95.0,
        "Role Relevance": 80.0
      },
      "requirement_evidence": [
        {
          "name": "Bachelor's Degree in Computer Science or related field",
          "type": "EDUCATION",
          "is_required": true,
          "status": "Met",
          "evidence": "Formal degree verified: Master of Technology (M.Tech) matches academic criteria.",
          "impact": "High"
        },
        {
          "name": "2 years relevant experience",
          "type": "EXPERIENCE",
          "is_required": true,
          "status": "Met",
          "evidence": "Candidate documents 2.5 years of relevant experience, meeting the 2-year requirement.",
          "impact": "High"
        },
        {
          "name": "Python",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Demonstrated proficiency in Python verified from candidate profile and technical portfolio.",
          "impact": "High"
        },
        {
          "name": "Machine Learning",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Demonstrated proficiency in Machine Learning verified from candidate profile and technical portfolio.",
          "impact": "High"
        },
        {
          "name": "SQL",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Demonstrated proficiency in SQL verified from candidate profile and technical portfolio.",
          "impact": "High"
        },
        {
          "name": "Problem Solving",
          "type": "SOFT_SKILL",
          "is_required": true,
          "status": "Met",
          "evidence": "Clear demonstration of Problem Solving in team and collaborative history.",
          "impact": "High"
        },
        {
          "name": "Communication",
          "type": "SOFT_SKILL",
          "is_required": false,
          "status": "Met",
          "evidence": "Clear demonstration of Communication in team and collaborative history.",
          "impact": "Low"
        },
        {
          "name": "Practical Machine Learning / NLP Capstone Implementation",
          "type": "PROJECT",
          "is_required": true,
          "status": "Met",
          "evidence": "Multiple practical project implementations identified: Automated Multilingual Resume Parser.",
          "impact": "High"
        }
      ],
      "knockout_met": true
    },
    "interview": null,
    "f2f_schedule": null
  },
  {
    "id": 13,
    "job_id": 10,
    "job_title": "new in company",
    "job_department": "Artificial Intelligence & Data Science",
    "work_mode": "Hybrid",
    "candidate_id": 5,
    "candidate_name": "Rohan Verma",
    "candidate_email": "rohan.verma@example.com",
    "status": "Offer Extended",
    "overall_match_score": 70.8,
    "applied_at": "2026-09-13 13:08:15.805699",
    "updated_at": "2026-09-13 15:01:15.096418",
    "final_decision": "SELECTED",
    "final_decision_at": "2026-09-13 15:01:15.096418",
    "final_decision_by": "Alex Morgan",
    "final_decision_notes": "",
    "status_summary": "Application currently in Offer Extended stage",
    "stage": "Stage: Offer Extended",
    "interview_score": 88.0,
    "interview_status": "Scheduled",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 70.8,
      "criteria_breakdown": {
        "Technical Skills": 20.0,
        "Relevant Experience": 100.0,
        "Education": 100.0,
        "Projects": 95.0,
        "Soft Skills": 80.0,
        "Certifications": 80.0,
        "AI/ML Knowledge": 80.0,
        "Problem Solving": 70.0,
        "Communication": 70.0,
        "Role Relevance": 80.0
      },
      "requirement_evidence": [
        {
          "name": "Bachelor's Degree in Computer Science or related field",
          "type": "EDUCATION",
          "is_required": true,
          "status": "Met",
          "evidence": "Formal degree verified: Bachelor's Degree in Computer Science matches academic criteria.",
          "impact": "High"
        },
        {
          "name": "2 years relevant experience",
          "type": "EXPERIENCE",
          "is_required": true,
          "status": "Met",
          "evidence": "Candidate documents 2.0 years of relevant experience, meeting the 2-year requirement.",
          "impact": "High"
        },
        {
          "name": "Python",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill Python found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "Machine Learning",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill Machine Learning found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "SQL",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill SQL found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "Problem Solving",
          "type": "SOFT_SKILL",
          "is_required": true,
          "status": "Partially Met",
          "evidence": "General professional maturity observed; targeted Problem Solving assessment via AI interview recommended.",
          "impact": "High"
        },
        {
          "name": "Communication",
          "type": "SOFT_SKILL",
          "is_required": false,
          "status": "Partially Met",
          "evidence": "General professional maturity observed; targeted Communication assessment via AI interview recommended.",
          "impact": "Low"
        },
        {
          "name": "Practical Machine Learning / NLP Capstone Implementation",
          "type": "PROJECT",
          "is_required": true,
          "status": "Met",
          "evidence": "Multiple practical project implementations identified: Full-Stack Web Application with React and FastAPI.",
          "impact": "High"
        }
      ],
      "knockout_met": false
    },
    "interview": {
      "id": 4,
      "token": "29d66c3c-661f-43c0-bd05-ec14ec20a5e5",
      "status": "Scheduled",
      "scheduled_at": "2026-09-13 14:44:52.393792"
    },
    "f2f_schedule": {
      "round_type": "Technical System Design & Architecture",
      "date_str": "2026-09-24",
      "time_str": "15:00 IST",
      "meeting_link": "https://meet.futureverse.ai/f2f-executive"
    }
  },
  {
    "id": 14,
    "job_id": 9,
    "job_title": "new requirment",
    "job_department": "Artificial Intelligence & Data Science",
    "work_mode": "On-site",
    "candidate_id": 5,
    "candidate_name": "Rohan Verma",
    "candidate_email": "rohan.verma@example.com",
    "status": "Offer Extended",
    "overall_match_score": 70.8,
    "applied_at": "2026-09-13 13:08:21.667035",
    "updated_at": "2026-09-13 14:42:39.803734",
    "final_decision": "SELECTED",
    "final_decision_at": "2026-09-13 14:42:39.803734",
    "final_decision_by": "Alex Morgan",
    "final_decision_notes": "",
    "status_summary": "Application currently in Offer Extended stage",
    "stage": "Stage: Offer Extended",
    "interview_score": 88.0,
    "interview_status": "Scheduled",
    "recommendation": "Hire",
    "scores": {
      "overall_score": 70.8,
      "criteria_breakdown": {
        "Technical Skills": 20.0,
        "Relevant Experience": 100.0,
        "Education": 100.0,
        "Projects": 95.0,
        "Soft Skills": 80.0,
        "Certifications": 80.0,
        "AI/ML Knowledge": 80.0,
        "Problem Solving": 70.0,
        "Communication": 70.0,
        "Role Relevance": 80.0
      },
      "requirement_evidence": [
        {
          "name": "Bachelor's Degree in Computer Science or related field",
          "type": "EDUCATION",
          "is_required": true,
          "status": "Met",
          "evidence": "Formal degree verified: Bachelor's Degree in Computer Science matches academic criteria.",
          "impact": "High"
        },
        {
          "name": "2 years relevant experience",
          "type": "EXPERIENCE",
          "is_required": true,
          "status": "Met",
          "evidence": "Candidate documents 2.0 years of relevant experience, meeting the 2-year requirement.",
          "impact": "High"
        },
        {
          "name": "Python",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill Python found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "Machine Learning",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill Machine Learning found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "SQL",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill SQL found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "Problem Solving",
          "type": "SOFT_SKILL",
          "is_required": true,
          "status": "Partially Met",
          "evidence": "General professional maturity observed; targeted Problem Solving assessment via AI interview recommended.",
          "impact": "High"
        },
        {
          "name": "Communication",
          "type": "SOFT_SKILL",
          "is_required": false,
          "status": "Partially Met",
          "evidence": "General professional maturity observed; targeted Communication assessment via AI interview recommended.",
          "impact": "Low"
        },
        {
          "name": "Practical Machine Learning / NLP Capstone Implementation",
          "type": "PROJECT",
          "is_required": true,
          "status": "Met",
          "evidence": "Multiple practical project implementations identified: Full-Stack Web Application with React and FastAPI.",
          "impact": "High"
        }
      ],
      "knockout_met": false
    },
    "interview": {
      "id": 3,
      "token": "f650a343-f721-4847-ab85-c79c24671fe8",
      "status": "Scheduled",
      "scheduled_at": "2026-09-13 14:40:16.360897"
    },
    "f2f_schedule": {
      "round_type": "FACE_TO_FACE",
      "date_str": "2026-09-24",
      "time_str": "15:00 IST",
      "meeting_link": "https://meet.futureverse.ai/f2f-executive"
    }
  },
  {
    "id": 15,
    "job_id": 12,
    "job_title": "for email msg",
    "job_department": "Artificial Intelligence & Data Science",
    "work_mode": "Hybrid",
    "candidate_id": 6,
    "candidate_name": "Ananya Sen",
    "candidate_email": "ananya.sen@example.com",
    "status": "Offer Extended",
    "overall_match_score": 46.2,
    "applied_at": "2026-09-13 15:03:59.893246",
    "updated_at": "2026-09-13 16:00:46.538498",
    "final_decision": "SELECTED",
    "final_decision_at": "2026-09-13 16:00:46.538498",
    "final_decision_by": "Alex Morgan",
    "final_decision_notes": "",
    "status_summary": "Application currently in Offer Extended stage",
    "stage": "Stage: Offer Extended",
    "interview_score": 88.0,
    "interview_status": "In Progress",
    "recommendation": "Review",
    "scores": {
      "overall_score": 46.2,
      "criteria_breakdown": {
        "Technical Skills": 20.0,
        "Relevant Experience": 40.0,
        "Education": 50.0,
        "Projects": 45.0,
        "Soft Skills": 80.0,
        "Certifications": 80.0,
        "AI/ML Knowledge": 80.0,
        "Problem Solving": 70.0,
        "Communication": 70.0,
        "Role Relevance": 80.0
      },
      "requirement_evidence": [
        {
          "name": "Bachelor's Degree in Computer Science or related field",
          "type": "EDUCATION",
          "is_required": true,
          "status": "Unclear / Evidence Not Found",
          "evidence": "Educational institution credentials require recruiter verification.",
          "impact": "High"
        },
        {
          "name": "2 years relevant experience",
          "type": "EXPERIENCE",
          "is_required": true,
          "status": "Not Met",
          "evidence": "Candidate profile indicates 0.0 years, below configured requirement.",
          "impact": "High"
        },
        {
          "name": "Python",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill Python found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "Machine Learning",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill Machine Learning found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "SQL",
          "type": "TECH_SKILL",
          "is_required": true,
          "status": "Not Met",
          "evidence": "No direct evidence for required skill SQL found in parsed CV or submitted credentials.",
          "impact": "High"
        },
        {
          "name": "Problem Solving",
          "type": "SOFT_SKILL",
          "is_required": true,
          "status": "Partially Met",
          "evidence": "General professional maturity observed; targeted Problem Solving assessment via AI interview recommended.",
          "impact": "High"
        },
        {
          "name": "Communication",
          "type": "SOFT_SKILL",
          "is_required": false,
          "status": "Partially Met",
          "evidence": "General professional maturity observed; targeted Communication assessment via AI interview recommended.",
          "impact": "Low"
        },
        {
          "name": "Practical Machine Learning / NLP Capstone Implementation",
          "type": "PROJECT",
          "is_required": true,
          "status": "Unclear / Evidence Not Found",
          "evidence": "Specific project repositories or deliverables not detailed in CV.",
          "impact": "High"
        }
      ],
      "knockout_met": false
    },
    "interview": {
      "id": 5,
      "token": "33d2f491-0de6-4631-a6bf-40bff4ea4b1b",
      "status": "In Progress",
      "scheduled_at": "2026-09-13 15:05:35.622136"
    },
    "f2f_schedule": {
      "round_type": "Technical System Design & Architecture",
      "date_str": "2026-09-24",
      "time_str": "15:00 IST",
      "meeting_link": "https://meet.futureverse.ai/f2f-executive"
    }
  }
];

export const MOCK_TICKETS = [
  {
    "id": 1,
    "user_id": 1,
    "subject": "Inquiry from Dr. Ramesh Patel (ramesh.patel@institution.edu)",
    "category": "Public Contact Inquiry",
    "message": "Name: Dr. Ramesh Patel\nEmail: ramesh.patel@institution.edu\nPhone: +91 9876543210\nMessage:\nInterested in institutional AI recruitment licensing",
    "status": "Open",
    "replies": "[]",
    "created_at": "2026-09-13 11:21:08.831935",
    "updated_at": "2026-09-13 11:21:08.831935",
    "priority": "MEDIUM",
    "closed_at": null
  },
  {
    "id": 2,
    "user_id": 1,
    "subject": "Inquiry from Dr. Ramesh Patel (ramesh.patel@institution.edu)",
    "category": "Public Contact Inquiry",
    "message": "Name: Dr. Ramesh Patel\nEmail: ramesh.patel@institution.edu\nPhone: +91 9876543210\nMessage:\nInterested in institutional AI recruitment licensing",
    "status": "Open",
    "replies": "[]",
    "created_at": "2026-09-13 11:21:27.738392",
    "updated_at": "2026-09-13 11:21:27.738392",
    "priority": "MEDIUM",
    "closed_at": null
  },
  {
    "id": 3,
    "user_id": 1,
    "subject": "Inquiry from Dr. Ramesh Patel (ramesh.patel@institution.edu)",
    "category": "Public Contact Inquiry",
    "message": "Name: Dr. Ramesh Patel\nEmail: ramesh.patel@institution.edu\nPhone: +91 9876543210\nMessage:\nInterested in institutional AI recruitment licensing",
    "status": "Open",
    "replies": "[]",
    "created_at": "2026-09-13 11:22:51.333642",
    "updated_at": "2026-09-13 11:22:51.333642",
    "priority": "MEDIUM",
    "closed_at": null
  },
  {
    "id": 4,
    "user_id": 1,
    "subject": "Inquiry from Sayan Rooj (sayanrooj742137@gmail.com)",
    "category": "Public Contact Inquiry",
    "message": "Name: Sayan Rooj\nEmail: sayanrooj742137@gmail.com\nPhone: 9883260373\nMessage:\nthanks",
    "status": "Resolved",
    "replies": "[{\"author\": \"Super Administrator\", \"role\": \"Super Admin Support\", \"message\": \"good\", \"timestamp\": \"2026-09-13T12:18:58.977036\"}]",
    "created_at": "2026-09-13 11:53:30.832130",
    "updated_at": "2026-09-13 12:18:58.977036",
    "priority": "MEDIUM",
    "closed_at": null
  },
  {
    "id": 5,
    "user_id": 3,
    "subject": "Interview Rescheduling Request",
    "category": "Technical Assessment",
    "message": "Hello support team, I would like to reschedule my proctored interview round by 2 days.",
    "status": "In Progress",
    "replies": "[{\"author\": \"Super Administrator\", \"role\": \"Super Admin Support\", \"message\": \"Hello Aarav, your reschedule has been approved. Your token has been extended by 48 hours.\", \"timestamp\": \"2026-09-13T12:41:24.802737\"}, {\"author\": \"Aarav Sharma\", \"role\": \"Candidate\", \"message\": \"Thank you so much! I will take the test on Wednesday morning.\", \"timestamp\": \"2026-09-13T12:41:24.858835\"}]",
    "created_at": "2026-09-13 12:41:24.726950",
    "updated_at": "2026-09-13 12:41:24.858835",
    "priority": "HIGH",
    "closed_at": null
  },
  {
    "id": 6,
    "user_id": 3,
    "subject": "Interview Rescheduling Request",
    "category": "Technical Assessment",
    "message": "Hello support team, I would like to reschedule my proctored interview round by 2 days.",
    "status": "In Progress",
    "replies": "[{\"author\": \"Super Administrator\", \"role\": \"Super Admin Support\", \"message\": \"Hello Aarav, your reschedule has been approved. Your token has been extended by 48 hours.\", \"timestamp\": \"2026-09-13T12:43:18.556255\"}, {\"author\": \"Aarav Sharma\", \"role\": \"Candidate\", \"message\": \"Thank you so much! I will take the test on Wednesday morning.\", \"timestamp\": \"2026-09-13T12:43:18.626846\"}]",
    "created_at": "2026-09-13 12:43:18.455060",
    "updated_at": "2026-09-13 12:43:18.626846",
    "priority": "HIGH",
    "closed_at": null
  },
  {
    "id": 7,
    "user_id": 3,
    "subject": "Interview Rescheduling Request",
    "category": "Technical Assessment",
    "message": "Hello support team, I would like to reschedule my proctored interview round by 2 days.",
    "status": "In Progress",
    "replies": "[{\"author\": \"Super Administrator\", \"role\": \"Super Admin Support\", \"message\": \"Hello Aarav, your reschedule has been approved. Your token has been extended by 48 hours.\", \"timestamp\": \"2026-09-13T12:43:57.319711\"}, {\"author\": \"Aarav Sharma\", \"role\": \"Candidate\", \"message\": \"Thank you so much! I will take the test on Wednesday morning.\", \"timestamp\": \"2026-09-13T12:43:57.367078\"}]",
    "created_at": "2026-09-13 12:43:57.238003",
    "updated_at": "2026-09-13 12:43:57.367078",
    "priority": "HIGH",
    "closed_at": null
  },
  {
    "id": 8,
    "user_id": 1,
    "subject": "Inquiry from Dr. Ramesh Patel (ramesh.patel@institution.edu)",
    "category": "Public Contact Inquiry",
    "message": "Name: Dr. Ramesh Patel\nEmail: ramesh.patel@institution.edu\nPhone: +91 9876543210\nMessage:\nInterested in institutional AI recruitment licensing",
    "status": "Open",
    "replies": "[]",
    "created_at": "2026-09-13 12:44:06.052162",
    "updated_at": "2026-09-13 12:44:06.052162",
    "priority": "MEDIUM",
    "closed_at": null
  },
  {
    "id": 9,
    "user_id": 7,
    "subject": "ok",
    "category": "GENERAL_INQUIRY",
    "message": "nothing",
    "status": "RESOLVED",
    "replies": "[{\"author\": \"Super Administrator\", \"role\": \"Super Admin Support\", \"message\": \"ok\", \"timestamp\": \"2026-09-13T12:55:18.365569\"}]",
    "created_at": "2026-09-13 12:54:45.421497",
    "updated_at": "2026-09-13 12:55:18.365569",
    "priority": "HIGH",
    "closed_at": null
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    "id": 224,
    "user_id": 7,
    "user_role": "CANDIDATE",
    "user_email": "sayanrooj742137@gmail.com",
    "action": "LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{\"role\": \"CANDIDATE\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 16:24:17.146435"
  },
  {
    "id": 223,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "OWNER_LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{}",
    "ip_address": "152.56.157.120",
    "timestamp": "2026-09-13 16:06:22.301859"
  },
  {
    "id": 222,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "AI_INTERVIEW_INVITED",
    "target_type": "Interview",
    "target_id": "6",
    "details": "{\"candidate\": \"sayanrooj742137@gmail.com\", \"token\": \"ff7e4cc9-714c-46ed-9ad9-133ea11db61e\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 16:05:39.249784"
  },
  {
    "id": 221,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "OWNER_LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{}",
    "ip_address": "152.56.157.120",
    "timestamp": "2026-09-13 16:05:01.505687"
  },
  {
    "id": 220,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "FINAL_DECISION_ISSUED",
    "target_type": "Application",
    "target_id": "15",
    "details": "{\"old_decision\": \"SELECTED\", \"new_decision\": \"SELECTED\", \"old_status\": \"Offer Extended\", \"new_status\": \"Offer Extended\", \"notes\": \"\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 16:00:50.782512"
  },
  {
    "id": 219,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "OWNER_LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{}",
    "ip_address": "152.56.157.120",
    "timestamp": "2026-09-13 16:00:16.212166"
  },
  {
    "id": 218,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "OWNER_LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{}",
    "ip_address": "152.56.157.120",
    "timestamp": "2026-09-13 15:56:47.115518"
  },
  {
    "id": 217,
    "user_id": 3,
    "user_role": "CANDIDATE",
    "user_email": "aarav.sharma@example.com",
    "action": "LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{\"role\": \"CANDIDATE\"}",
    "ip_address": "152.56.157.120",
    "timestamp": "2026-09-13 15:56:36.296489"
  },
  {
    "id": 216,
    "user_id": 1,
    "user_role": "SUPER_ADMIN",
    "user_email": "admin@futureverse.ai",
    "action": "SUPER_ADMIN_LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:23:37.237878"
  },
  {
    "id": 215,
    "user_id": 1,
    "user_role": "SUPER_ADMIN",
    "user_email": "admin@futureverse.ai",
    "action": "SUPER_ADMIN_LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:14:42.449073"
  },
  {
    "id": 214,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "OWNER_LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:14:42.414478"
  },
  {
    "id": 213,
    "user_id": 3,
    "user_role": "CANDIDATE",
    "user_email": "aarav.sharma@example.com",
    "action": "LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{\"role\": \"CANDIDATE\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:14:38.329987"
  },
  {
    "id": 212,
    "user_id": 7,
    "user_role": "CANDIDATE",
    "user_email": "sayanrooj742137@gmail.com",
    "action": "LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{\"role\": \"CANDIDATE\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:14:38.295808"
  },
  {
    "id": 211,
    "user_id": 8,
    "user_role": "CANDIDATE",
    "user_email": "sayanrooj312005@gmail.com",
    "action": "LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{\"role\": \"CANDIDATE\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:09:55.629718"
  },
  {
    "id": 210,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "FINAL_DECISION_ISSUED",
    "target_type": "Application",
    "target_id": "15",
    "details": "{\"old_decision\": \"NOT_SELECTED\", \"new_decision\": \"SELECTED\", \"old_status\": \"Not Selected\", \"new_status\": \"Offer Extended\", \"notes\": \"\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:09:28.284585"
  },
  {
    "id": 209,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "OWNER_LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:09:12.621101"
  },
  {
    "id": 208,
    "user_id": 8,
    "user_role": "CANDIDATE",
    "user_email": "sayanrooj312005@gmail.com",
    "action": "LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{\"role\": \"CANDIDATE\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:08:38.317288"
  },
  {
    "id": 207,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "FINAL_DECISION_ISSUED",
    "target_type": "Application",
    "target_id": "15",
    "details": "{\"old_decision\": \"SELECTED\", \"new_decision\": \"NOT_SELECTED\", \"old_status\": \"Offer Extended\", \"new_status\": \"Not Selected\", \"notes\": \"\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:06:54.499856"
  },
  {
    "id": 206,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "FINAL_DECISION_ISSUED",
    "target_type": "Application",
    "target_id": "15",
    "details": "{\"old_decision\": null, \"new_decision\": \"SELECTED\", \"old_status\": \"Face-to-Face Scheduled\", \"new_status\": \"Offer Extended\", \"notes\": \"\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:06:35.113687"
  },
  {
    "id": 205,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "F2F_INTERVIEW_SCHEDULED",
    "target_type": "InterviewSchedule",
    "target_id": "15",
    "details": "{\"date\": \"2026-09-24\", \"time\": \"15:00 IST\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:06:12.095063"
  },
  {
    "id": 204,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "F2F_INTERVIEW_SCHEDULED",
    "target_type": "InterviewSchedule",
    "target_id": "15",
    "details": "{\"date\": \"2026-09-24\", \"time\": \"15:00 IST\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:06:10.688184"
  },
  {
    "id": 203,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "AI_INTERVIEW_INVITED",
    "target_type": "Interview",
    "target_id": "5",
    "details": "{\"candidate\": \"sayanrooj312005@gmail.com\", \"token\": \"33d2f491-0de6-4631-a6bf-40bff4ea4b1b\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:05:39.631265"
  },
  {
    "id": 202,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "APPLICATION_STATUS_UPDATED",
    "target_type": "Application",
    "target_id": "15",
    "details": "{\"old_status\": \"Shortlisted\", \"new_status\": \"Shortlisted\", \"override\": true, \"reason\": \"\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:05:17.937807"
  },
  {
    "id": 201,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "APPLICATION_STATUS_UPDATED",
    "target_type": "Application",
    "target_id": "15",
    "details": "{\"old_status\": \"Shortlisted\", \"new_status\": \"Shortlisted\", \"override\": true, \"reason\": \"\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:05:12.713947"
  },
  {
    "id": 200,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "APPLICATION_STATUS_UPDATED",
    "target_type": "Application",
    "target_id": "15",
    "details": "{\"old_status\": \"CV Screening\", \"new_status\": \"Shortlisted\", \"override\": true, \"reason\": \"\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:05:08.712116"
  },
  {
    "id": 199,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "OWNER_LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:04:42.865988"
  },
  {
    "id": 198,
    "user_id": 8,
    "user_role": "CANDIDATE",
    "user_email": "sayanrooj312005@gmail.com",
    "action": "APPLICATION_SUBMITTED",
    "target_type": "Application",
    "target_id": "15",
    "details": "{\"job_id\": 12, \"score\": 46.2}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:04:04.097970"
  },
  {
    "id": 197,
    "user_id": 8,
    "user_role": "CANDIDATE",
    "user_email": "sayanrooj312005@gmail.com",
    "action": "CANDIDATE_REGISTER",
    "target_type": "User",
    "target_id": "8",
    "details": "{\"email\": \"sayanrooj312005@gmail.com\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:03:48.216567"
  },
  {
    "id": 196,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "JOB_CREATED",
    "target_type": "Job",
    "target_id": "12",
    "details": "{\"title\": \"for email msg\", \"openings\": 2}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:02:58.199489"
  },
  {
    "id": 195,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "FINAL_DECISION_ISSUED",
    "target_type": "Application",
    "target_id": "13",
    "details": "{\"old_decision\": \"SELECTED\", \"new_decision\": \"SELECTED\", \"old_status\": \"Offer Extended\", \"new_status\": \"Offer Extended\", \"notes\": \"\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:01:18.978137"
  },
  {
    "id": 194,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "FINAL_DECISION_ISSUED",
    "target_type": "Application",
    "target_id": "13",
    "details": "{\"old_decision\": \"SELECTED\", \"new_decision\": \"SELECTED\", \"old_status\": \"Face-to-Face Scheduled\", \"new_status\": \"Offer Extended\", \"notes\": \"\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:01:12.784629"
  },
  {
    "id": 193,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "F2F_INTERVIEW_SCHEDULED",
    "target_type": "InterviewSchedule",
    "target_id": "13",
    "details": "{\"date\": \"2026-09-24\", \"time\": \"15:00 IST\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:01:04.468329"
  },
  {
    "id": 192,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "AI_INTERVIEW_INVITED",
    "target_type": "Interview",
    "target_id": "4",
    "details": "{\"candidate\": \"sayanrooj742137@gmail.com\", \"token\": \"29d66c3c-661f-43c0-bd05-ec14ec20a5e5\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:00:50.554152"
  },
  {
    "id": 191,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "APPLICATION_EMAIL_RETRIED",
    "target_type": "Application",
    "target_id": "13",
    "details": "{\"status\": \"SENT\", \"error\": null}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:00:39.826787"
  },
  {
    "id": 190,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "APPLICATION_STATUS_UPDATED",
    "target_type": "Application",
    "target_id": "13",
    "details": "{\"old_status\": \"Face-to-Face Scheduled\", \"new_status\": \"Offer Extended\", \"override\": true, \"reason\": \"\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 15:00:29.680037"
  },
  {
    "id": 189,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "F2F_INTERVIEW_SCHEDULED",
    "target_type": "InterviewSchedule",
    "target_id": "13",
    "details": "{\"date\": \"2026-09-24\", \"time\": \"15:00 IST\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:59:44.950344"
  },
  {
    "id": 188,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "APPLICATION_EMAIL_RETRIED",
    "target_type": "Application",
    "target_id": "13",
    "details": "{\"status\": \"SENT\", \"error\": null}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:59:36.145216"
  },
  {
    "id": 187,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "AI_INTERVIEW_INVITED",
    "target_type": "Interview",
    "target_id": "4",
    "details": "{\"candidate\": \"sayanrooj742137@gmail.com\", \"token\": \"29d66c3c-661f-43c0-bd05-ec14ec20a5e5\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:59:18.385190"
  },
  {
    "id": 186,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "APPLICATION_EMAIL_RETRIED",
    "target_type": "Application",
    "target_id": "13",
    "details": "{\"status\": \"SENT\", \"error\": null}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:58:33.586834"
  },
  {
    "id": 185,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "APPLICATION_STATUS_UPDATED",
    "target_type": "Application",
    "target_id": "13",
    "details": "{\"old_status\": \"Offer Extended\", \"new_status\": \"Shortlisted\", \"override\": true, \"reason\": \"\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:58:26.365783"
  },
  {
    "id": 184,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "APPLICATION_EMAIL_RETRIED",
    "target_type": "Application",
    "target_id": "13",
    "details": "{\"status\": \"SENT\", \"error\": null}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:54:17.568940"
  },
  {
    "id": 183,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "FINAL_DECISION_ISSUED",
    "target_type": "Application",
    "target_id": "13",
    "details": "{\"old_decision\": \"SELECTED\", \"new_decision\": \"SELECTED\", \"old_status\": \"Face-to-Face Scheduled\", \"new_status\": \"Offer Extended\", \"notes\": \"\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:54:13.273004"
  },
  {
    "id": 182,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "F2F_INTERVIEW_SCHEDULED",
    "target_type": "InterviewSchedule",
    "target_id": "13",
    "details": "{\"date\": \"2026-09-25\", \"time\": \"02:30 PM IST\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:54:09.356338"
  },
  {
    "id": 181,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "AI_INTERVIEW_INVITED",
    "target_type": "Interview",
    "target_id": "4",
    "details": "{\"candidate\": \"sayanrooj742137@gmail.com\", \"token\": \"29d66c3c-661f-43c0-bd05-ec14ec20a5e5\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:54:05.348843"
  },
  {
    "id": 180,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "OWNER_LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:54:01.232390"
  },
  {
    "id": 179,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "AI_INTERVIEW_INVITED",
    "target_type": "Interview",
    "target_id": "4",
    "details": "{\"candidate\": \"sayanrooj742137@gmail.com\", \"token\": \"29d66c3c-661f-43c0-bd05-ec14ec20a5e5\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:53:33.596167"
  },
  {
    "id": 178,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "OWNER_LOGIN_SUCCESS",
    "target_type": null,
    "target_id": null,
    "details": "{}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:53:29.475875"
  },
  {
    "id": 177,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "APPLICATION_EMAIL_RETRIED",
    "target_type": "Application",
    "target_id": "13",
    "details": "{\"status\": \"SENT\", \"error\": null}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:45:55.709211"
  },
  {
    "id": 176,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "AI_INTERVIEW_INVITED",
    "target_type": "Interview",
    "target_id": "4",
    "details": "{\"candidate\": \"sayanrooj742137@gmail.com\", \"token\": \"29d66c3c-661f-43c0-bd05-ec14ec20a5e5\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:44:56.698979"
  },
  {
    "id": 175,
    "user_id": 2,
    "user_role": "OWNER",
    "user_email": "recruiter@futureverse.ai",
    "action": "AI_INTERVIEW_INVITED",
    "target_type": "Interview",
    "target_id": "4",
    "details": "{\"candidate\": \"sayanrooj742137@gmail.com\", \"token\": \"29d66c3c-661f-43c0-bd05-ec14ec20a5e5\", \"email_status\": \"SENT\"}",
    "ip_address": "127.0.0.1",
    "timestamp": "2026-09-13 14:44:56.527183"
  }
];

export const MOCK_ACHIEVEMENTS = [
  {
    "id": 1,
    "title": "Global Talent Technology Innovation Award",
    "description": "Recognized as the premier AI recruitment solution combining transparent criteria weighting with explainable decision support.",
    "date_str": "2026-08-15",
    "category": "Platform Milestone",
    "metric": "99.2% Accuracy",
    "icon": "Award",
    "is_active": 1,
    "created_at": "2026-09-13 11:07:44.001663"
  },
  {
    "id": 2,
    "title": "10,000+ Adaptive Interviews Evaluated",
    "description": "Surpassed ten thousand proctored, multi-modal AI candidate interviews with zero data leaks and 98% positive candidate feedback.",
    "date_str": "2026-07-20",
    "category": "Scale Milestone",
    "metric": "10,000+ Sessions",
    "icon": "ShieldCheck",
    "is_active": 1,
    "created_at": "2026-09-13 11:07:44.001663"
  },
  {
    "id": 3,
    "title": "Responsible AI Certification",
    "description": "Certified for non-discriminatory algorithmic screening and complete candidate audit transparency.",
    "date_str": "2026-06-01",
    "category": "Ethics & Compliance",
    "metric": "100% Auditable",
    "icon": "CheckCircle",
    "is_active": 1,
    "created_at": "2026-09-13 11:07:44.001663"
  }
];

export const MOCK_EVENTS = [
  {
    "id": 1,
    "title": "FUTUREVERSE AI Recruitment Summit 2026",
    "date_str": "2026-10-18",
    "time_str": "10:00 AM - 4:00 PM IST",
    "location": "Virtual / Hybrid (Bangalore Tech Auditorium)",
    "description": "Keynote addresses, live demonstrations of adaptive interviewing, and discussions on responsible talent intelligence with top technology leaders.",
    "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    "registration_link": "https://futureverse.ai/events/summit-2026",
    "status": "UPCOMING",
    "created_at": "2026-09-13 11:07:44.010714"
  },
  {
    "id": 2,
    "title": "Masterclass: Cracking the Proctored AI Interview",
    "date_str": "2026-09-30",
    "time_str": "6:00 PM - 7:30 PM IST",
    "location": "Virtual Interactive Webinar",
    "description": "Practical workshop for engineering candidates on showcasing architecture depth, communicating trade-offs, and optimizing CV signal.",
    "image_url": "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
    "registration_link": "https://futureverse.ai/events/masterclass",
    "status": "UPCOMING",
    "created_at": "2026-09-13 11:07:44.010714"
  }
];

export const MOCK_CONTENT = [
  {
    "id": 1,
    "section_key": "hero",
    "title": "Intelligent Recruitment. Better Talent. Future Ready.",
    "subtitle": "An AI-powered recruitment platform that helps organizations discover, evaluate, and connect with the right talent through intelligent screening, adaptive interviews, and human-centered decision making.",
    "body": "Connecting companies and candidates through an intelligent, transparent recruitment workflow.",
    "metadata_json": "{\"tagline\": \"FUTUREVERSE\", \"creator\": \"Sayan Rooj\"}",
    "updated_at": "2026-09-13 11:07:44.006632"
  },
  {
    "id": 2,
    "section_key": "about",
    "title": "Empowering Ethical, Transparent AI Recruitment",
    "subtitle": "Created & Developed by Sayan Rooj",
    "body": "FUTUREVERSE was engineered from the ground up to solve recruitment opacity. By separating what matters (defined by human recruiters) from how well candidates match (evaluated by transparent AI), FUTUREVERSE preserves meritocracy while placing ultimate hiring judgment firmly in human hands.",
    "metadata_json": "{\"creator\": \"Sayan Rooj\", \"year\": \"2026\", \"version\": \"2.6\"}",
    "updated_at": "2026-09-13 11:07:44.006632"
  },
  {
    "id": 3,
    "section_key": "contact",
    "title": "Connect with FUTUREVERSE",
    "subtitle": "Reach our Talent Advisory & Engineering Teams",
    "body": "Whether you are an enterprise seeking talent acceleration or a candidate aspiring for your next breakthrough, we are here to support your journey.",
    "metadata_json": "{\"email\": \"contact@futureverse.ai\", \"phone\": \"+91 (080) 4120-9900\", \"location\": \"Bangalore Innovation Hub, India\"}",
    "updated_at": "2026-09-13 11:07:44.006632"
  }
];

// Dynamic local storage helper to ensure modifications (status updates, new applications, new jobs) persist permanently
const STORAGE_KEY_JOBS = 'futureverse_storage_jobs_v2';
const STORAGE_KEY_APPS = 'futureverse_storage_apps_v2';
const STORAGE_KEY_TICKETS = 'futureverse_storage_tickets_v2';

export function getStoredJobs(): any[] {
  try {
    const val = localStorage.getItem(STORAGE_KEY_JOBS);
    if (val) return JSON.parse(val);
  } catch {}
  return MOCK_JOBS;
}

export function saveStoredJobs(jobs: any[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
  } catch {}
}

export function getStoredApplications(): any[] {
  try {
    const val = localStorage.getItem(STORAGE_KEY_APPS);
    if (val) return JSON.parse(val);
  } catch {}
  return MOCK_APPLICATIONS;
}

export function saveStoredApplications(apps: any[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
  } catch {}
}

export function getStoredTickets(): any[] {
  try {
    const val = localStorage.getItem(STORAGE_KEY_TICKETS);
    if (val) return JSON.parse(val);
  } catch {}
  return MOCK_TICKETS;
}

export function saveStoredTickets(tickets: any[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
  } catch {}
}
