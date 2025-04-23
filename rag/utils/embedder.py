from utils.chunker import simple_chunk
from utils.weaviate_client import weaviate_add
from openai import OpenAI
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()

""" client = OpenAI() """

""" def embed_chunks(chunks: list[str]) -> list[list[float]]:
    response = client.embeddings.create(
        input=chunks,
        model="text-embedding-ada-002"
    )
    return [item.embedding for item in response.data] """
    
    
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_chunks(chunks: list[str]) -> list[list[float]]:
    return model.encode(chunks, convert_to_numpy=True).tolist()

def embed_and_store(text: str, doc_id: str, user_id: str, course_id: str):
    chunks = simple_chunk(text)
    vectors = embed_chunks(chunks)
    weaviate_add(vectors, chunks, doc_id, user_id, course_id)
