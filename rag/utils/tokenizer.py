import tiktoken

encoding = tiktoken.encoding_for_model("gpt-4")

def count_tokens(text: str) -> int:
    return len(encoding.encode(text))

def trim_tokens(texts: list[str], max_tokens: int) -> str:
    total_tokens = 0
    included_chunks = []

    for text in texts:
        token_count = count_tokens(text)
        if total_tokens + token_count > max_tokens:
            break
        included_chunks.append(text)
        total_tokens += token_count

    return "\n".join(included_chunks)
