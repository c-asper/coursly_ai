from fastapi import FastAPI, File, UploadFile, Form
from utils.parser import extract_text
from utils.embedder import embed_and_store
from utils.weaviate_client import query_weaviate
from openai import OpenAI
import os
from fastapi.responses import StreamingResponse

os.environ["TOKENIZERS_PARALLELISM"] = "false"

app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/upload/")
async def upload_file(
    file: UploadFile = File(...),
    doc_id: str = Form(...),
    user_id: str = Form(...),
    course_id: str = Form(...)
):
    print("hit")
    content = await file.read()
    text = extract_text(content, file.filename)
    embed_and_store(text, doc_id, user_id, course_id)
    return {"status": "File processed"}

@app.post("/query/")
async def query_rag(question: str = Form(...), course_id: str = Form(...) ):
    context = query_weaviate(question, course_id)

    def stream_response():
        stream = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant. Only answer using the context provided. "
                        "If the answer cannot be found in the context, say 'I don't know'. "
                        "Be concise and avoid adding extra information."
                    )
                },
                {
                    "role": "user",
                    "content": f"Context:\n{context}\n\nQuestion:\n{question}\n\nAnswer:"
                }
            ],
            stream=True
        )
        
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield f"data: {chunk.choices[0].delta.content}\n\n"

        yield "data: [DONE]\n\n"

    return StreamingResponse(stream_response(), media_type="text/event-stream")
