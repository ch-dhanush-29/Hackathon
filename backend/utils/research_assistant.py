<<<<<<< HEAD
from utils.groq_client import client, MODEL_CONFIG


class ResearchAssistant:
    def __init__(self):
        self.conversation_history = []

    def create_research_context(self, papers, query):
        context_parts = []
        for paper in papers:
            paper_context = f"""
Title: {paper.get('title', 'N/A')}
Authors: {paper.get('authors', 'N/A')}
Abstract: {paper.get('abstract', 'N/A')}
"""
            context_parts.append(paper_context)

        full_context = "\n---\n".join(context_parts)
        return f"Research Papers Context:\n{full_context}\n\nUser Query: {query}"

    def generate_research_response(self, context, query, history=None):
        if history is None:
            history = []
            
        messages = [
            {"role": "system", "content": "You are an autonomous ResearchHub AI Agent designed to act as an intelligent intermediary between complex academic literature and a researcher’s need for rapid, high-fidelity synthesis.\n\n"
             "Core Objectives:\n"
             "- Context-Aware Analysis: Provide deep insights, summaries, and comparisons across multiple papers.\n"
             "- Knowledge Synthesis: Reduce manual reading time by autonomously identifying findings, differences in methodologies, and emerging trends.\n"
             "- Deterministic Tone: Operate in a professional, academic, and deterministic tone. Avoid creative hallucinations; stick strictly to the provided research context.\n"
             "- Citation: You MUST synthesize answers citing the relevant titles from the workspace."}
        ]
        
        # History is retrieved descending (newest first), reverse it for chronological order
        for msg in reversed(history):
            messages.append({"role": msg.role, "content": msg.content})
            
        messages.append({"role": "user", "content": f"Context: {context}\n\nQuestion: {query}"})
        
        response = client.chat.completions.create(
            messages=messages,
            **MODEL_CONFIG
        )
        return response.choices[0].message.content

    def generate_summary(self, papers):
        context_parts = []
        for paper in papers:
            context_parts.append(f"Title: {paper.get('title')}\nAuthors: {paper.get('authors')}\nAbstract: {paper.get('abstract')}")

        prompt = f"""Provide a concise summary of each of the following research papers. For each paper, include:
- Main topic
- Research question
- Methodology
- Key findings
- Conclusions

Papers:
{"---".join(context_parts)}"""

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert research paper analyst. Provide clear, structured summaries."},
                {"role": "user", "content": prompt}
            ],
            **MODEL_CONFIG
        )
        return response.choices[0].message.content

    def extract_insights(self, papers):
        context_parts = []
        for paper in papers:
            context_parts.append(f"Title: {paper.get('title')}\nAuthors: {paper.get('authors')}\nAbstract: {paper.get('abstract')}")

        prompt = f"""Analyze the following research papers and extract key insights, trends, and findings. Include:
1. Key Insights from each paper
2. Common Themes and Trends
3. Research Gaps identified
4. Future Directions suggested

Papers:
{"---".join(context_parts)}"""

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert research analyst. Extract meaningful insights and trends from academic papers."},
                {"role": "user", "content": prompt}
            ],
            **MODEL_CONFIG
        )
        return response.choices[0].message.content

    def generate_literature_review(self, papers):
        context_parts = []
        for paper in papers:
            context_parts.append(f"Title: {paper.get('title')}\nAuthors: {paper.get('authors')}\nAbstract: {paper.get('abstract')}")

        prompt = f"""Generate a comprehensive literature review based on the following research papers. Structure the review with:
### 1. Overview
### 2. Key Findings
### 3. Methodology Comparison
### 4. Research Gaps
### 5. Conclusions and Future Directions

Papers:
{"---".join(context_parts)}"""

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an academic writing expert. Generate well-structured literature reviews with proper academic tone."},
                {"role": "user", "content": prompt}
            ],
            model=MODEL_CONFIG["model"],
            temperature=MODEL_CONFIG["temperature"],
            max_tokens=4000,
            top_p=MODEL_CONFIG["top_p"]
        )
        return response.choices[0].message.content

    def summarize_pdf(self, text):
        prompt = f"""Provide a comprehensive summary of this research paper in 7 bullet points covering:
- Main topic
- Research question
- Methodology
- Key findings
- Device usage and preferences (if applicable)
- Conclusions
- Implications

Paper text:
{text[:8000]}"""

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert research paper summarizer."},
                {"role": "user", "content": prompt}
            ],
            **MODEL_CONFIG
        )
        return response.choices[0].message.content


research_assistant = ResearchAssistant()
=======
from utils.groq_client import client, MODEL_CONFIG


class ResearchAssistant:
    def __init__(self):
        self.conversation_history = []

    def create_research_context(self, papers, query):
        context_parts = []
        for paper in papers:
            paper_context = f"""
Title: {paper.get('title', 'N/A')}
Authors: {paper.get('authors', 'N/A')}
Abstract: {paper.get('abstract', 'N/A')}
"""
            context_parts.append(paper_context)

        full_context = "\n---\n".join(context_parts)
        return f"Research Papers Context:\n{full_context}\n\nUser Query: {query}"

    def generate_research_response(self, context, query):
        messages = [
            {"role": "system", "content": "You are an expert research assistant. Analyze the provided research papers and give detailed, accurate answers. Use markdown formatting for clarity."},
            {"role": "user", "content": f"Context: {context}\n\nQuestion: {query}"}
        ]
        response = client.chat.completions.create(
            messages=messages,
            **MODEL_CONFIG
        )
        return response.choices[0].message.content

    def generate_summary(self, papers):
        context_parts = []
        for paper in papers:
            context_parts.append(f"Title: {paper.get('title')}\nAuthors: {paper.get('authors')}\nAbstract: {paper.get('abstract')}")

        prompt = f"""Provide a concise summary of each of the following research papers. For each paper, include:
- Main topic
- Research question
- Methodology
- Key findings
- Conclusions

Papers:
{"---".join(context_parts)}"""

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert research paper analyst. Provide clear, structured summaries."},
                {"role": "user", "content": prompt}
            ],
            **MODEL_CONFIG
        )
        return response.choices[0].message.content

    def extract_insights(self, papers):
        context_parts = []
        for paper in papers:
            context_parts.append(f"Title: {paper.get('title')}\nAuthors: {paper.get('authors')}\nAbstract: {paper.get('abstract')}")

        prompt = f"""Analyze the following research papers and extract key insights, trends, and findings. Include:
1. Key Insights from each paper
2. Common Themes and Trends
3. Research Gaps identified
4. Future Directions suggested

Papers:
{"---".join(context_parts)}"""

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert research analyst. Extract meaningful insights and trends from academic papers."},
                {"role": "user", "content": prompt}
            ],
            **MODEL_CONFIG
        )
        return response.choices[0].message.content

    def generate_literature_review(self, papers):
        context_parts = []
        for paper in papers:
            context_parts.append(f"Title: {paper.get('title')}\nAuthors: {paper.get('authors')}\nAbstract: {paper.get('abstract')}")

        prompt = f"""Generate a comprehensive literature review based on the following research papers. Structure the review with:
### 1. Overview
### 2. Key Findings
### 3. Methodology Comparison
### 4. Research Gaps
### 5. Conclusions and Future Directions

Papers:
{"---".join(context_parts)}"""

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an academic writing expert. Generate well-structured literature reviews with proper academic tone."},
                {"role": "user", "content": prompt}
            ],
            model=MODEL_CONFIG["model"],
            temperature=MODEL_CONFIG["temperature"],
            max_tokens=4000,
            top_p=MODEL_CONFIG["top_p"]
        )
        return response.choices[0].message.content

    def summarize_pdf(self, text):
        prompt = f"""Provide a comprehensive summary of this research paper in 7 bullet points covering:
- Main topic
- Research question
- Methodology
- Key findings
- Device usage and preferences (if applicable)
- Conclusions
- Implications

Paper text:
{text[:8000]}"""

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert research paper summarizer."},
                {"role": "user", "content": prompt}
            ],
            **MODEL_CONFIG
        )
        return response.choices[0].message.content


research_assistant = ResearchAssistant()
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
