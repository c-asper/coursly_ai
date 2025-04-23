import nltk
nltk.download("punkt")

def split_into_sentences(text: str) -> list[str]:
    return nltk.sent_tokenize(text)

def simple_chunk(text: str, group_size: int = 5) -> list[str]:
    sentences = split_into_sentences(text)
    chunks = []

    for i in range(0, len(sentences), group_size):
        group = sentences[i:i+group_size]
        chunks.append(" ".join(group))

    return chunks

# Note:
# In production I would prefer to use semantic chunking
# I defered from using it in here as it is slower and it 
# would use more tokens while the openai key is not mine