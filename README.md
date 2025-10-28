# B2Scala : Génération de Code B2Scala avec RAG

## Description
 
L'objectif est de développer un **système de génération automatique de code B2Scala** basé sur la technologie **RAG (Retrieval-Augmented Generation)**, permettant de produire du code fonctionnel et commenté à partir de documents techniques, de codes sources existants et de contenus web.

Le projet combine :

- **LLM local** (Large Language Model, ex. LLaMA) pour la génération de code.
- **Base de connaissances vectorielle** pour la récupération des informations pertinentes.
- **Pipeline RAG** pour intégrer recherche et génération de code.
- **API FastAPI** et interface web React pour l’interaction avec le système.

---

## Fonctionnalités

- Génération automatique de code B2Scala à partir d’un brouillon ou d’une question.
- Recherche sémantique dans une base de connaissances locale pour contextualiser le code.
- Interface web simple pour poser des questions et obtenir du code commenté.
- Évaluation des résultats avec des métriques de qualité (BLEU, CodeBLEU, F1-Score, Similarité cosinus).

---

## Technologies et outils

**Langages :** Python,  JavaScript / React  
**Bibliothèques Python :**  
- Extraction et traitement de documents : `PyPDF2`, `pdfplumber`, `python-docx`  
- Recherche et embeddings : `sentence-transformers`, `FAISS`, `ChromaDB`, `langchain`  
- API et serveur : `FastAPI`, `Uvicorn`, `pyngrok`, `nest_asyncio`  

**LLM :** LLaMA (via API Groq)  
**Déploiement :** Google Colab, VS Code, Ngrok

---

 
