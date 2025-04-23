import io
from PyPDF2 import PdfReader

def extract_text(content: bytes, filename: str) -> str:
    if filename.lower().endswith(".pdf"):
        reader = PdfReader(io.BytesIO(content))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    else:
        return content.decode("utf-8", errors="ignore")

