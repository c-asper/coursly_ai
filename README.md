This project demonstrates an MVP implementation that integrates Weaviate with a SentenceTransformer model for semantic search capabilities.

🛠 Getting Started
To run the project locally:

docker-compose up --build

🧠 Models & Tools Used
Weaviate – A vector database used to store and query semantic embeddings.

SentenceTransformer – Used for generating sentence embeddings to be indexed in Weaviate.

Docker & Docker Compose – For containerized development and deployment.

ShadCN/UI – Component library built on top of Radix UI and Tailwind, chosen for its accessibility, aesthetics, and developer-friendly API.

Tailwind CSS – Utility-first CSS framework for rapid UI development.

Framer Motion – For smooth animations.

React Query & React Router (TanStack) – For data-fetching and routing in React apps.

xxhash – Used for fast and efficient file hashing to detect and avoid duplicate uploads.

⚠️ Assumptions & Shortcuts
This is a minimal viable product (MVP), so several features and best practices were intentionally skipped to keep the implementation lightweight. These include:

Persisted Database: A simple in-memory database is used instead of a persistent one like SQLite.

Semantic Chunking: Currently, documents are not semantically chunked, though it would improve retrieval accuracy.

Duplicate Detection: There is no file hashing implemented to prevent duplicate uploads.

Error Handling & Validation: Basic and not exhaustive.