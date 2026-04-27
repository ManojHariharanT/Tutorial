from __future__ import annotations

from pathlib import Path
import textwrap


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "PROJECT_STATUS_REPORT.md"
OUTPUT = ROOT / "PROJECT_STATUS_REPORT.pdf"

PAGE_WIDTH = 612
PAGE_HEIGHT = 792
LEFT = 54
TOP = 740
BOTTOM = 54
MAX_TEXT_WIDTH = 92


def escape_pdf_text(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def parse_markdown_lines(raw: str) -> list[tuple[str, int]]:
    parsed: list[tuple[str, int]] = []

    for source_line in raw.splitlines():
        line = source_line.rstrip()

        if not line.strip():
            parsed.append(("", 10))
            continue

        if line.startswith("# "):
            parsed.append((line[2:].strip(), 24))
            parsed.append(("", 10))
            continue

        if line.startswith("## "):
            parsed.append((line[3:].strip(), 17))
            parsed.append(("", 6))
            continue

        if line.startswith("### "):
            parsed.append((line[4:].strip(), 14))
            continue

        bullet_prefix = ""
        content = line.strip()

        if content.startswith("- "):
            bullet_prefix = "- "
            content = content[2:].strip()
        elif content[:2].isdigit() and content[2:4] == ". ":
            bullet_prefix = content[:3]
            content = content[4:].strip()

        if bullet_prefix:
            wrapped = textwrap.wrap(
                content,
                width=MAX_TEXT_WIDTH - len(bullet_prefix),
                break_long_words=False,
                break_on_hyphens=False,
            )
            for index, segment in enumerate(wrapped):
                prefix = bullet_prefix if index == 0 else " " * len(bullet_prefix)
                parsed.append((f"{prefix}{segment}", 11))
            continue

        wrapped = textwrap.wrap(
            content,
            width=MAX_TEXT_WIDTH,
            break_long_words=False,
            break_on_hyphens=False,
        )
        for segment in wrapped:
            parsed.append((segment, 11))

    return parsed


def layout_pages(lines: list[tuple[str, int]]) -> list[list[tuple[str, int, int]]]:
    pages: list[list[tuple[str, int, int]]] = []
    current: list[tuple[str, int, int]] = []
    y = TOP

    for text, size in lines:
        leading = int(size * 1.45) if text else size

        if y - leading < BOTTOM:
            pages.append(current)
            current = []
            y = TOP

        if text:
            current.append((text, size, y))

        y -= leading

    if current:
        pages.append(current)

    return pages


def build_page_stream(page_lines: list[tuple[str, int, int]]) -> bytes:
    commands: list[str] = []
    for text, size, y in page_lines:
        font = "F2" if size >= 17 else "F1"
        commands.append(f"BT /{font} {size} Tf {LEFT} {y} Td ({escape_pdf_text(text)}) Tj ET")
    return "\n".join(commands).encode("latin-1", errors="replace")


def pdf_object(number: int, body: bytes) -> bytes:
    return f"{number} 0 obj\n".encode() + body + b"\nendobj\n"


def build_pdf(page_streams: list[bytes]) -> bytes:
    page_count = len(page_streams)
    font1_obj = 3
    font2_obj = 4
    first_page_obj = 5
    first_stream_obj = first_page_obj + page_count
    objects: list[bytes] = []

    objects.append(pdf_object(1, b"<< /Type /Catalog /Pages 2 0 R >>"))

    kids = " ".join(f"{first_page_obj + index} 0 R" for index in range(page_count))
    objects.append(
        pdf_object(
            2,
            f"<< /Type /Pages /Count {page_count} /Kids [{kids}] >>".encode(),
        )
    )

    objects.append(pdf_object(font1_obj, b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"))
    objects.append(pdf_object(font2_obj, b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"))

    for index in range(page_count):
        page_obj = first_page_obj + index
        stream_obj = first_stream_obj + index
        page_body = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_WIDTH} {PAGE_HEIGHT}] "
            f"/Resources << /Font << /F1 {font1_obj} 0 R /F2 {font2_obj} 0 R >> >> "
            f"/Contents {stream_obj} 0 R >>"
        ).encode()
        objects.append(pdf_object(page_obj, page_body))

    for index, stream in enumerate(page_streams):
        stream_obj = first_stream_obj + index
        stream_body = (
            f"<< /Length {len(stream)} >>\nstream\n".encode()
            + stream
            + b"\nendstream"
        )
        objects.append(pdf_object(stream_obj, stream_body))

    pdf = bytearray()
    pdf.extend(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")

    offsets = [0]
    for obj in objects:
        offsets.append(len(pdf))
        pdf.extend(obj)

    xref_start = len(pdf)
    total_objects = len(objects) + 1
    pdf.extend(f"xref\n0 {total_objects}\n".encode())
    pdf.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode())

    pdf.extend(
        (
            f"trailer\n<< /Size {total_objects} /Root 1 0 R >>\n"
            f"startxref\n{xref_start}\n%%EOF\n"
        ).encode()
    )

    return bytes(pdf)


def main() -> None:
    source_text = SOURCE.read_text(encoding="utf-8")
    parsed_lines = parse_markdown_lines(source_text)
    pages = layout_pages(parsed_lines)
    streams = [build_page_stream(page) for page in pages]
    OUTPUT.write_bytes(build_pdf(streams))
    print(f"Created {OUTPUT}")


if __name__ == "__main__":
    main()
