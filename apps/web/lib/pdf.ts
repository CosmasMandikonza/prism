import PDFDocument from 'pdfkit';
import { sha256 } from './crypto';
import { Readable } from 'stream';

export function buildEvidencePDF(data: {
  answer: string; decision: string; confidence: string;
  sources: { url: string; title?: string; hash?: string }[];
  timestamps: { generatedAt: string };
  youRequests: { endpoint: string; requestId?: string }[];
}) : Buffer {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer)=>chunks.push(c));
  doc.fontSize(18).text('Prism Evidence Pack', { underline: true });
  doc.moveDown().fontSize(12);
  doc.text(`Generated: ${data.timestamps.generatedAt}`);
  doc.text(`Decision: ${data.decision} | Confidence: ${data.confidence}`);
  doc.moveDown().text('Answer:').text(data.answer);
  doc.moveDown().text('Sources:');
  data.sources.forEach((s, i)=>{
    doc.text(`${i+1}. ${s.title || s.url}`);
    doc.text(s.url, {link: s.url, underline: true});
    if (s.hash) doc.text(`content-sha256: ${s.hash}`);
    doc.moveDown(0.4);
  });
  doc.moveDown().text('You.com API Requests:');
  data.youRequests.forEach((r, i)=> doc.text(`${i+1}. ${r.endpoint} (${r.requestId ?? 'n/a'})`));
  doc.end();
  return Buffer.concat(chunks);
}
