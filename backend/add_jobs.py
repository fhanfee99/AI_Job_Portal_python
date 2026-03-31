import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings') 
django.setup()

from jobs.models import Job

def seed_jobs():

    job_titles = [
        "Shopify Liquid Expert", "React Native Developer", "MERN Stack Lead", 
        "Django Backend Architect", "UI/UX Designer", "DevOps Engineer", 
        "Data Scientist", "Python Automation Expert", "Frontend Lead", 
        "E-commerce Specialist", "Node.js Developer", "Full Stack Shopify Dev",
        "Quality Assurance Engineer", "Cloud Solutions Architect", "SEO Manager",
        "Blockchain Developer", "AI Model Trainer", "Cybersecurity Analyst",
        "Project Manager", "Technical Writer"
    ]

    skills_pool = [
        "React, Node.js, MongoDB, Express", "Liquid, Shopify API, JavaScript",
        "Python, Django, PostgreSQL, REST", "AWS, Docker, Kubernetes, CI/CD",
        "Figma, Adobe XD, Tailwind CSS", "Next.js, TypeScript, GraphQL",
        "PHP, Laravel, MySQL", "Solidity, Web3.js, Ethereum",
        "Java, Spring Boot, Microservices", "Flutter, Firebase, Dart",
        "Machine Learning, Pandas, Scikit-learn", "Selenium, Jest, Cypress",
        "Go, Redis, Apache Kafka", "Wordpress, PHP, Elementor",
        "Vue.js, Nuxt.js, Vuex", "Ruby on Rails, PostgreSQL",
        "C++, Embedded Systems, Linux", "Swift, iOS Development, Xcode",
        "Android SDK, Kotlin, Retrofit", "Elasticsearch, Logstash, Kibana"
    ]

    locations = ["Remote", "Indore", "Mumbai", "Bangalore", "Pune", "Dubai", "London", "USA (Remote)"]
    companies = ["Farstory Tech", "Shopify Experts", "Google", "Amazon", "Indore IT Hub", "Meta", "TCS", "Wipro"]
    job_types = ["Full-time", "Contract", "Freelance", "Internship"]

    count = 0
    for i in range(50):
        title = random.choice(job_titles) + f" (Specialist {i+1})"
        company = random.choice(companies)
        skill = random.choice(skills_pool)
        location = random.choice(locations)
        job_type = random.choice(job_types)
        
        description = f"Looking for a passionate {title} to join our team at {company}. " \
                      f"You will work on cutting-edge technologies including {skill}. " \
                      f"This is a {job_type} role based in {location}."

        Job.objects.get_or_create(
            title=title,
            company=company,
            description=description,
            skills=skill,
            location=location,
            job_type=job_type
        )
        count += 1

    print(f"Yeah! 🚀 {count} Unique Jobs successfully added.")

if __name__ == "__main__":
    seed_jobs()