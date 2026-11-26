import React from 'react';
import { certificateLines, formatCertificateDate } from '../../lib/certificateLayout';

export default function CertificateDocument({ certificate, svgRef }) {
  const studentLines = certificateLines(certificate?.studentName || 'Learner', 28, 2);
  const courseLines = certificateLines(certificate?.courseTitle || 'Course', 44, 2);
  const nameY = studentLines.length === 1 ? 322 : 308;
  const courseY = courseLines.length === 1 ? 458 : 444;
  const instructor = certificate?.instructor
    ? certificateLines(certificate.instructor, 70, 1)[0]
    : '';

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      width="1122"
      height="794"
      viewBox="0 0 1122 794"
      role="img"
      aria-label="EduFanor Certificate of Completion"
      className="certificate-svg"
    >
      <defs>
        <linearGradient id="certificatePaper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="48%" stopColor="#F8F3E8" />
          <stop offset="100%" stopColor="#FDFAF3" />
        </linearGradient>
        <linearGradient id="certificateRule" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D8C17B" stopOpacity="0" />
          <stop offset="50%" stopColor="#A98B45" />
          <stop offset="100%" stopColor="#D8C17B" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="certificateSeal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E8B8" />
          <stop offset="100%" stopColor="#C8A85E" />
        </linearGradient>
        <pattern id="certificateGrain" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="0.55" fill="#6D5B35" opacity="0.12" />
        </pattern>
      </defs>

      <rect width="1122" height="794" fill="#EDE7DD" />
      <rect x="24" y="24" width="1074" height="746" rx="14" fill="url(#certificatePaper)" stroke="#CDBB84" strokeWidth="2" />
      <rect x="24" y="24" width="1074" height="746" rx="14" fill="url(#certificateGrain)" opacity="0.3" />
      <rect x="38" y="38" width="1046" height="718" rx="9" fill="none" stroke="#443C68" strokeWidth="1.5" opacity="0.92" />
      <rect x="46" y="46" width="1030" height="702" rx="6" fill="none" stroke="#C6B47E" strokeWidth="1" />

      <g fill="none" stroke="#B79B58" strokeWidth="1.5" strokeLinecap="round">
        <path d="M70 132 V100 Q70 70 100 70 H132" />
        <path d="M83 119 V105 Q83 83 105 83 H119" />
        <path d="M1052 132 V100 Q1052 70 1022 70 H990" />
        <path d="M1039 119 V105 Q1039 83 1017 83 H1003" />
        <path d="M70 662 V694 Q70 724 100 724 H132" />
        <path d="M83 675 V689 Q83 711 105 711 H119" />
        <path d="M1052 662 V694 Q1052 724 1022 724 H990" />
        <path d="M1039 675 V689 Q1039 711 1017 711 H1003" />
      </g>

      <g textAnchor="middle">
        <path d="M561 55 L577 62 V77 C577 90 570 99 561 104 C552 99 545 90 545 77 V62 Z" fill="#443C68" stroke="#C8A85E" strokeWidth="1.4" />
        <path d="M554 76 L560 83 L570 69" fill="none" stroke="#F8F1DD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        <text x="561" y="132" fontFamily="Georgia, 'Times New Roman', serif" fontSize="30" fontWeight="700" letterSpacing="9" fill="#443C68">
          EDUFANOR
        </text>
        <text x="561" y="152" fontFamily="Arial, Helvetica, sans-serif" fontSize="9.5" fontWeight="700" letterSpacing="3.4" fill="#8A7B52">
          LEARNING WITH PURPOSE
        </text>

        <line x1="430" y1="168" x2="692" y2="168" stroke="url(#certificateRule)" strokeWidth="1.4" />
        <path d="M561 162 L566 168 L561 174 L556 168 Z" fill="#A98B45" />

        <text x="561" y="218" fontFamily="Georgia, 'Times New Roman', serif" fontSize="35" fontWeight="700" letterSpacing="5.4" fill="#443C68">
          CERTIFICATE OF COMPLETION
        </text>
        <text x="561" y="249" fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="600" letterSpacing="2.6" fill="#6C6148">
          This certificate is proudly presented to
        </text>

        {studentLines.map((line, index) => (
          <text
            key={`student-${index}`}
            x="561"
            y={nameY + index * 42}
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize={studentLines.length === 1 ? 46 : 42}
            fontWeight="700"
            fill="#241E35"
          >
            {line}
          </text>
        ))}
        <line x1="326" y1={studentLines.length === 1 ? 340 : 368} x2="796" y2={studentLines.length === 1 ? 340 : 368} stroke="#C6B47E" strokeWidth="1.3" />

        <text x="561" y={studentLines.length === 1 ? 382 : 408} fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="600" letterSpacing="2.2" fill="#6C6148">
          for successfully completing
        </text>

        {courseLines.map((line, index) => (
          <text
            key={`course-${index}`}
            x="561"
            y={courseY + index * 40}
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize={courseLines.length === 1 ? 30 : 27}
            fontWeight="700"
            fill="#443C68"
          >
            {line}
          </text>
        ))}
        <line x1="286" y1={courseLines.length === 1 ? 476 : 504} x2="836" y2={courseLines.length === 1 ? 476 : 504} stroke="#C6B47E" strokeWidth="1.1" opacity="0.85" />

        <text x="561" y={courseLines.length === 1 ? 511 : 538} fontFamily="Georgia, 'Times New Roman', serif" fontSize="13" fontStyle="italic" fill="#6C6148">
          With dedication, discipline, and a commitment to learning.
        </text>
        {instructor && (
          <text x="561" y="560" fontFamily="Arial, Helvetica, sans-serif" fontSize="11" fill="#6C6148">
            Instructor: {instructor}
          </text>
        )}

        <line x1="190" y1="590" x2="932" y2="590" stroke="#D8C17B" strokeWidth="1" />
        <text x="320" y="620" fontFamily="Arial, Helvetica, sans-serif" fontSize="9.5" fontWeight="700" letterSpacing="2.2" fill="#8A7B52">
          COMPLETION DATE
        </text>
        <text x="320" y="645" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" fill="#443C68">
          {formatCertificateDate(certificate?.completedAt)}
        </text>
        <line x1="561" y1="598" x2="561" y2="653" stroke="#D8C17B" strokeWidth="1" />
        <text x="802" y="620" fontFamily="Arial, Helvetica, sans-serif" fontSize="9.5" fontWeight="700" letterSpacing="2.2" fill="#8A7B52">
          CERTIFICATE ID
        </text>
        <text x="802" y="645" fontFamily="Courier New, monospace" fontSize="14" fontWeight="700" fill="#443C68">
          {certificate?.certificateId || '—'}
        </text>

        <circle cx="222" cy="684" r="31" fill="none" stroke="url(#certificateSeal)" strokeWidth="2" />
        <circle cx="222" cy="684" r="24" fill="none" stroke="#A98B45" strokeWidth="0.8" opacity="0.75" />
        <text x="222" y="690" fontFamily="Georgia, 'Times New Roman', serif" fontSize="20" fontWeight="700" fill="#A98B45">
          E
        </text>

        <line x1="686" y1="695" x2="948" y2="695" stroke="#443C68" strokeWidth="1.3" />
        <text x="817" y="716" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="700" letterSpacing="1.8" fill="#6C6148">
          AUTHORIZED SIGNATURE
        </text>
        <text x="817" y="735" fontFamily="Georgia, 'Times New Roman', serif" fontSize="12" fontWeight="700" fill="#443C68">
          EduFanor
        </text>

        <text x="561" y="763" fontFamily="Arial, Helvetica, sans-serif" fontSize="8.5" fontWeight="600" letterSpacing="1.8" fill="#8A7B52">
          EDUFANOR · CERTIFICATE OF COMPLETION
        </text>
      </g>
    </svg>
  );
}
