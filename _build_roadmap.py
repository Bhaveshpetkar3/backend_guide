import os

src = r'c:\Users\newuser\Desktop\backend_mastery\backend_guide\backend-mastery-roadmap.md'
dst = r'c:\Users\newuser\Desktop\backend_mastery\backend_guide\roadmap.md'

with open(src, 'r', encoding='utf-8') as f:
    content = f.read()

frontmatter = """---
layout: guide
title: "From Junior to Top 1% Backend Engineer"
subtitle: "A deliberate-practice program, built around your actual stack (Node.js + AWS)"
nav_title: Roadmap
tags: [Node.js, AWS, Backend, Distributed Systems, Performance]
permalink: /roadmap/
---

"""

with open(dst, 'w', encoding='utf-8') as f:
    f.write(frontmatter + content)

print("Created roadmap.md successfully")
