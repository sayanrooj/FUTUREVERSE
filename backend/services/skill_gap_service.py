from typing import Dict, Any, List

class SkillGapService:
    @staticmethod
    def analyze_skill_gaps(
        job_requirements: List[Any],
        candidate_skills: List[str],
        parsed_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Classifies skills into Strong, Developing, and Missing with tailored learning recommendations.
        """
        cand_skills_lower = [s.lower() for s in candidate_skills]
        if parsed_data.get("technical_skills"):
            cand_skills_lower.extend([s.lower() for s in parsed_data["technical_skills"]])

        strong = []
        developing = []
        missing = []
        recommendations = []

        for req in job_requirements:
            skill_name = getattr(req, "name", str(req))
            skill_type = getattr(req, "type", "TECH_SKILL")
            is_required = getattr(req, "is_required", True)

            # Check matching
            s_lower = skill_name.lower()
            if any(s_lower == cs for cs in cand_skills_lower):
                strong.append({
                    "skill": skill_name,
                    "status": "Strong",
                    "type": skill_type,
                    "note": f"Candidate demonstrates direct proficiency in {skill_name}."
                })
            elif any(s_lower in cs or cs in s_lower for cs in cand_skills_lower):
                developing.append({
                    "skill": skill_name,
                    "status": "Developing",
                    "type": skill_type,
                    "note": f"Candidate holds foundational exposure to {skill_name}; recommended for hands-on elevation."
                })
                recommendations.append(f"Deepen production expertise in {skill_name} through advanced project exercises and benchmarks.")
            else:
                missing.append({
                    "skill": skill_name,
                    "status": "Missing",
                    "type": skill_type,
                    "is_required": is_required,
                    "note": f"No listed experience in {skill_name}."
                })
                if is_required:
                    recommendations.append(f"Priority learning track: Complete foundational certification or capstone project involving {skill_name}.")
                else:
                    recommendations.append(f"Recommended elective: Explore fundamentals of {skill_name} to strengthen your profile.")

        return {
            "strong": strong,
            "developing": developing,
            "missing": missing,
            "recommendations": recommendations[:5]
        }
