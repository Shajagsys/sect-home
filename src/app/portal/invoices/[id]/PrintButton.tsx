'use client';

export default function PrintButton() {
  return (
    <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => window.print()}>
      🖨 Print / Save PDF
    </button>
  );
}
