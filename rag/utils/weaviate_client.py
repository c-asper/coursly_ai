from weaviate import connect_to_wcs
from weaviate.auth import AuthApiKey
from weaviate.classes.config import Property, DataType
from dotenv import load_dotenv
from datetime import datetime
import os
import openai
import atexit
from datetime import datetime, timezone
from weaviate.classes.query import MetadataQuery, Filter
from .tokenizer import trim_tokens

load_dotenv()

client = connect_to_wcs(
    cluster_url=os.getenv("WEAVIATE_URL"),
    auth_credentials=AuthApiKey(os.getenv("WEAVIATE_API_KEY")),
    headers={"X-OpenAI-Api-Key": os.getenv("OPENAI_API_KEY")}
)

atexit.register(lambda: client.close())

def setup_class():
    if not client.collections.exists("DocumentChunk"):
        client.collections.create(
            name="DocumentChunk",
            vectorizer_config=None,
            properties=[
                Property(name="text", data_type=DataType.TEXT),
                Property(name="doc_id", data_type=DataType.TEXT),
                Property(name="user_id", data_type=DataType.TEXT),
                Property(name="course_id", data_type=DataType.TEXT),
                Property(name="created_at", data_type=DataType.DATE)
            ]
        )

setup_class()

def weaviate_add(vectors, chunks, doc_id, user_id, course_id):
    collection = client.collections.get("DocumentChunk")
    for chunk, vector in zip(chunks, vectors):
        collection.data.insert(
            properties={
                "text": chunk,
                "doc_id": doc_id,
                "user_id": user_id,
                "course_id": course_id,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            vector=vector
        )
        

from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
"""     question_vector = openai.Embedding.create(
        input=question,
        model="text-embedding-ada-002"
    )["data"][0]["embedding"] """


def query_weaviate(question: str, course_id: str) -> str:
    question_vector = model.encode(question, convert_to_numpy=True).tolist()
    collection = client.collections.get("DocumentChunk")

    results = collection.query.near_vector(
        near_vector=question_vector,
        limit=10,  # allow more initially, we'll trim later
        filters=Filter.by_property("course_id").equal(course_id)
    )

    chunks = [obj.properties["text"] for obj in results.objects]
    return trim_tokens(chunks, max_tokens=7500)