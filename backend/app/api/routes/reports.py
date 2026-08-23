from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from app.services.report_service import build_pdf, get_report, get_reports, delete_report

router = APIRouter(prefix='/reports', tags=['reports'])


@router.get('')
async def list_reports() -> list[dict]:
    return get_reports()


@router.get('/{verification_id}')
async def read_report(verification_id: str) -> dict:
    report = get_report(verification_id)
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Verification report not found.')
    return report


@router.get('/{verification_id}/download')
async def download_report(verification_id: str) -> StreamingResponse:
    report = get_report(verification_id)
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Verification report not found.')
    try:
        pdf = build_pdf(report)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Unable to generate the verification PDF.') from exc
    filename = f"DeepVerify_Report_{report['verification_id']}.pdf"
    return StreamingResponse(pdf, media_type='application/pdf', headers={'Content-Disposition': f'attachment; filename="{filename}"'})


@router.delete('/{verification_id}', status_code=status.HTTP_204_NO_CONTENT)
async def remove_report(verification_id: str) -> None:
    if not delete_report(verification_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Verification report not found.')
