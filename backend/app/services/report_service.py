import json
from io import BytesIO
from pathlib import Path
from threading import Lock

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from reportlab.lib import colors

from app.core.config import BACKEND_DIR
from app.schemas.analysis import AnalysisResponse

REPORTS_FILE = BACKEND_DIR / 'results' / 'reports.json'
REPORTS_FILE.parent.mkdir(parents=True, exist_ok=True)
_REPORTS_LOCK = Lock()


def _load() -> list[dict]:
    if not REPORTS_FILE.exists():
        return []
    try:
        return json.loads(REPORTS_FILE.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError):
        return []


def _save(reports: list[dict]) -> None:
    temporary_file = REPORTS_FILE.with_suffix('.tmp')
    temporary_file.write_text(json.dumps(reports, indent=2), encoding='utf-8')
    temporary_file.replace(REPORTS_FILE)


def save_report(report: AnalysisResponse) -> None:
    with _REPORTS_LOCK:
        reports = [item for item in _load() if item['verification_id'] != report.verification_id]
        reports.insert(0, report.model_dump(mode='json'))
        _save(reports)


def get_reports() -> list[dict]:
    with _REPORTS_LOCK:
        return _load()


def get_report(verification_id: str) -> dict | None:
    return next((report for report in get_reports() if report['verification_id'].lower() == verification_id.lower()), None)


def delete_report(verification_id: str) -> bool:
    with _REPORTS_LOCK:
        reports = _load()
        updated = [report for report in reports if report['verification_id'].lower() != verification_id.lower()]
        if len(updated) == len(reports):
            return False
        _save(updated)
        return True


def build_pdf(report: dict) -> BytesIO:
    buffer = BytesIO()
    document = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm, topMargin=16 * mm, bottomMargin=16 * mm)
    styles = getSampleStyleSheet()
    title = styles['Title']
    title.textColor = colors.HexColor('#0e7490')
    body = styles['BodyText']
    body.leading = 14
    story = [
        Paragraph('DEEPVERIFY', title),
        Paragraph('AI-POWERED MEDIA VERIFICATION REPORT', styles['Heading2']),
        Spacer(1, 8),
    ]
    metadata = [
        ['Verification ID', report.get('verification_id', '')],
        ['Filename', report.get('filename', '')],
        ['Media type', report.get('media_type', '')],
        ['File type', report.get('file_type', '')],
        ['File size', report.get('file_size', '')],
        ['Timestamp', report.get('timestamp', '')],
        ['Status', report.get('status', '')],
    ]
    table = Table(metadata, colWidths=[42 * mm, 130 * mm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e0f2fe')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#0f172a')),
        ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#bae6fd')),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 7),
    ]))
    story.extend([table, Spacer(1, 14), Paragraph('Verification Assessment', styles['Heading2'])])
    assessment = [
        ['Prediction', str(report.get('prediction', '')).upper()],
        ['Deepfake probability', f"{float(report.get('deepfake_probability', 0)) * 100:.1f}%"],
        ['Authentic probability', f"{float(report.get('authentic_probability', 0)) * 100:.1f}%"],
        ['Confidence', f"{float(report.get('confidence', 0)) * 100:.1f}%"],
        ['Risk level', str(report.get('risk_level', '')).upper()],
        ['Model version', report.get('model_version', '')],
    ]
    assessment_table = Table(assessment, colWidths=[55 * mm, 117 * mm])
    assessment_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#cffafe')),
        ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#cbd5e1')),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('PADDING', (0, 0), (-1, -1), 7),
    ]))
    story.extend([assessment_table, Spacer(1, 14), Paragraph('Analysis Explanation', styles['Heading2'])])
    for explanation in report.get('explanation') or []:
        story.append(Paragraph(f'• {explanation}', body))
    story.append(Spacer(1, 10))
    story.append(Paragraph('Detailed Findings', styles['Heading2']))
    for finding in report.get('detailed_findings') or []:
        story.append(Paragraph(f"<b>{finding.get('title', 'Finding')}</b>: {finding.get('description', '')} (score: {finding.get('score', '')})", body))
    story.append(Spacer(1, 10))
    story.append(Paragraph('Suspicious Regions', styles['Heading2']))
    for region in report.get('suspicious_regions') or []:
        story.append(Paragraph(f"<b>{region.get('label', region.get('type', 'Region'))}</b>: {region.get('description', '')} (confidence: {float(region.get('confidence', 0)) * 100:.1f}%)", body))
    model_details = report.get('model_details') or {}
    story.extend([
        Spacer(1, 10),
        Paragraph('Model Information', styles['Heading2']),
        Paragraph(f"{model_details.get('name', report.get('model_version', ''))}<br/>{model_details.get('architecture', '')}<br/>Version: {report.get('model_version', '')}", body),
        Spacer(1, 14),
        Paragraph('Disclaimer: This result represents an AI-assisted assessment and should not be treated as absolute proof of authenticity.', body),
    ])
    document.build(story)
    buffer.seek(0)
    return buffer
