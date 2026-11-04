import React from 'react';

function I({ className = '', strokeWidth = 1.8, children, ...p }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  );
}

export const ShieldCheck = p => (
  <I {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9.5 12l2 2 3.5-4" /></I>
);
export const ShieldAlert = p => (
  <I {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M12 8v4" /><path d="M12 15.5h.01" /></I>
);
export const CheckCircle2 = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></I>
);
export const HeartPulse = p => (
  <I {...p}><path d="M12 20s-7-4.3-9-9c-1.2-3 .8-6.5 4-6.5 2 0 3.4 1.2 5 3 1.6-1.8 3-3 5-3 3.2 0 5.2 3.5 4 6.5-2 4.7-9 9-9 9z" /><path d="M5 12h3l1.5-3 2 5 1.5-2h6" /></I>
);
export const BookOpen = p => (
  <I {...p}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z" /><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" /><path d="M9 7h7" /></I>
);
export const ArrowLeft = p => (
  <I {...p}><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></I>
);
export const ArrowRight = p => (
  <I {...p}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></I>
);
export const ArrowUpRight = p => (
  <I {...p}><path d="M7 17L17 7" /><path d="M8 7h9v9" /></I>
);
export const RefreshCw = p => (
  <I {...p}><path d="M20 12a8 8 0 1 1-2.34-5.66" /><path d="M20 4v4h-4" /><circle cx="12" cy="12" r="2" /></I>
);
export const Sparkles = p => (
  <I {...p}><path d="M12 3l1.7 4.6L18 9.3l-4.3 1.7L12 15.6l-1.7-4.6L6 9.3l4.3-1.7L12 3z" /><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" /><path d="M5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6L5 16z" /></I>
);
export const Mail = p => (
  <I {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></I>
);
export const Award = p => (
  <I {...p}><circle cx="12" cy="9" r="6" /><path d="M9 14.5L7.5 21l4.5-2.5L16.5 21 15 14.5" /></I>
);
export const Sun = p => (
  <I {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></I>
);
export const Moon = p => (
  <I {...p}><path d="M20 14A8.5 8.5 0 1 1 10 4a7 7 0 0 0 10 10z" /><path d="M16 4l.6 1.5L18 6l-1.4.5L16 8l-.6-1.5L14 6l1.4-.5L16 4z" /></I>
);
export const Clock = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></I>
);
export const ClipboardCheck = p => (
  <I {...p}><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4a3 3 0 0 1 6 0" /><path d="M9.5 14l2 2 3.5-4" /></I>
);
export const X = p => (<I {...p}><path d="M6 6l12 12M18 6L6 18" /></I>);
export const Globe = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></I>
);
export const Info = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></I>
);
export const Search = p => (
  <I {...p}><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></I>
);
export const Users = p => (
  <I {...p}><circle cx="9" cy="8" r="3.5" /><path d="M3 20c.7-3.5 3-5.5 6-5.5s5.3 2 6 5.5" /><path d="M16 5.2a3.5 3.5 0 0 1 0 5.6M17.5 14.8c2 .8 3.2 2.4 3.5 5.2" /></I>
);
export const TrendingUp = p => (
  <I {...p}><path d="M3 18l6-6 4 4 8-8" /><path d="M15 8h6v6" /></I>
);
export const Target = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></I>
);
export const Bot = p => (
  <I {...p}><rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 8V4" /><circle cx="12" cy="3" r="1" /><path d="M9 13h.01M15 13h.01M9.5 16h5" /></I>
);
export const HelpCircle = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.7.3-.9.7-.9 1.7" /><path d="M12 17h.01" /></I>
);
export const Settings = p => (
  <I {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></I>
);
export const LogOut = p => (
  <I {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></I>
);
export const GraduationCap = p => (
  <I {...p}><path d="M12 4l10 5-10 5L2 9l10-5z" /><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" /><path d="M22 9v5" /></I>
);
export const LayoutDashboard = p => (
  <I {...p}><rect x="3" y="3" width="8" height="10" rx="2" /><rect x="13" y="3" width="8" height="6" rx="2" /><rect x="13" y="11" width="8" height="10" rx="2" /><rect x="3" y="15" width="8" height="6" rx="2" /></I>
);
export const AlertTriangle = p => (
  <I {...p}><path d="M12 3L1.8 20h20.4L12 3z" /><path d="M12 10v4" /><path d="M12 17.5h.01" /></I>
);
export const Image = p => (
  <I {...p}><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="9" cy="10" r="1.8" /><path d="M21 16l-5-5-9 9" /></I>
);
export const Trash2 = p => (
  <I {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" /></I>
);
export const Lock = p => (
  <I {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /><circle cx="12" cy="16" r="1" /></I>
);
export const Plus = p => (<I {...p}><path d="M12 5v14M5 12h14" /></I>);
export const UserRound = p => (
  <I {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5" /></I>
);
export const Menu = p => (<I {...p}><path d="M4 7h16M4 12h16M4 17h16" /></I>);
export const Activity = p => (
  <I {...p}><path d="M3 12h4l3 8 4-16 3 8h4" /></I>
);
export const User = p => (
  <I {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5" /></I>
);
export const ChevronDown = p => (<I {...p}><path d="M6 9l6 6 6-6" /></I>);
export const ChevronRight = p => (<I {...p}><path d="M9 6l6 6-6 6" /></I>);
export const ChevronLeft = p => (<I {...p}><path d="M15 6l-6 6 6 6" /></I>);
export const ChevronUp = p => (<I {...p}><path d="M6 15l6-6 6 6" /></I>);
export const AlertCircle = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16.5h.01" /></I>
);
export const Layers = p => (
  <I {...p}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /><path d="M3 17l9 5 9-5" opacity="0" /></I>
);
export const Eye = p => (
  <I {...p}><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></I>
);
export const EyeOff = p => (
  <I {...p}><path d="M3 3l18 18" /><path d="M10.6 6c.4-.1.9-.2 1.4-.2 6.5 0 10 6.2 10 6.2a17.5 17.5 0 0 1-3 3.6M6.1 7A16.5 16.5 0 0 0 2 12s3.5 6.2 10 6.2c1.7 0 3.2-.4 4.5-1.1" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></I>
);
export const ExternalLink = p => (
  <I {...p}><path d="M14 4h6v6" /><path d="M20 4L11 13" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></I>
);
export const Loader2 = p => (
  <I {...p}><path d="M12 3a9 9 0 1 0 9 9" /><path d="M21 3v6h-6" /></I>
);
export const Languages = p => (
  <I {...p}><path d="M4 6h9M8.5 4v2c0 3-1.5 6-4 8.5M5 10c.8 2 2.5 4 5 5.5" /><path d="M13 20l4-9 4 9M14.5 16.5h5" /></I>
);
export const UserPlus = p => (
  <I {...p}><circle cx="10" cy="8" r="3.5" /><path d="M3 20c.6-3 3-5 7-5 1.2 0 2.3.2 3.2.6M18 9v6M15 12h6" /></I>
);
export const ScrollText = p => (
  <I {...p}><path d="M7 3h11a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7" /><path d="M7 18a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2" /><path d="M10 8h6M10 12h6" /></I>
);
export const Trophy = p => (
  <I {...p}><path d="M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M7 5H4a2 2 0 0 0 2 4h1M17 5h3a2 2 0 0 1-2 4h-1M12 14v4M8 21h8" /></I>
);
export const Lightbulb = p => (
  <I {...p}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10c.7.6 1 1.4 1 2h6c0-.6.3-1.4 1-2a6 6 0 0 0-4-10z" /></I>
);
export const Wind = p => (
  <I {...p}><path d="M3 8h10a3 3 0 1 0-3-3M3 12h14a3 3 0 1 1-3 3M3 16h7" /></I>
);
export const XCircle = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></I>
);
export const Home = p => (
  <I {...p}><path d="M3 11l9-8 9 8" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></I>
);
export const Video = p => (
  <I {...p}><rect x="3" y="5" width="13" height="14" rx="2.5" /><path d="M16 10l5-3v10l-5-3" /></I>
);
export const Ban = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M5.5 5.5l13 13" /></I>
);
export const FileText = p => (
  <I {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></I>
);
export const Zap = p => (<I {...p}><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></I>);
export const BarChart3 = p => (
  <I {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /><path d="M2 20h20" /></I>
);
export const Play = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M10 8.5l5 3.5-5 3.5v-7z" /></I>
);
export const Flame = p => (
  <I {...p}><path d="M12 22c3.8 0 6.5-2.6 6.5-6.3 0-2.8-1.7-4.9-3.3-6.7C13.7 7.3 12.6 5.7 12.4 3c-2.4 1.7-3.8 4.1-3.6 6.5-.9-.6-1.5-1.5-1.9-2.7C5.7 8.3 5.5 10 5.5 11.5 5.5 16.5 8.2 22 12 22z" /></I>
);
export const Brain = p => (
  <I {...p}><path d="M9 4A3 3 0 0 0 6 7v10a3 3 0 0 0 3 3M15 4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3M9 4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3M15 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3" /></I>
);
export const Edit3 = p => (
  <I {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></I>
);
export const FileQuestion = p => (
  <I {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" /><path d="M14 3v5h5M10 12a2 2 0 1 1 2.8 1.7c-.6.3-.8.6-.8 1.3" /><path d="M12 17.5h.01" /></I>
);
export const Type = p => (<I {...p}><path d="M4 7V5h16v2M12 5v14M9 19h6" /></I>);
export const ListOrdered = p => (
  <I {...p}><path d="M10 6h11M10 12h11M10 18h11" /><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></I>
);
export const Droplets = p => (
  <I {...p}><path d="M12 3c2.5 3.2 6 7 6 10.5a6 6 0 0 1-12 0C6 10 9.5 6.2 12 3z" /><path d="M4 21c1.2-1.2 2.3-1.2 3.5 0s2.3 1.2 3.5 0 2.3-1.2 3.5 0 2.3 1.2 3.5 0 2.3-1.2 2-1.2" opacity="0" /></I>
);
export const Heading = p => (<I {...p}><path d="M6 4v16M6 12h12M18 4v16" /></I>);
export const Heading2 = p => (<I {...p}><path d="M8 4v16M8 12h8M16 4v16" /></I>);
export const Circle = p => (<I {...p}><circle cx="12" cy="12" r="9" /></I>);
export const Save = p => (
  <I {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></I>
);
export const Upload = p => (
  <I {...p}><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 20h16" /></I>
);
export const Paperclip = p => (<I {...p}><path d="M20 11l-8.2 8.2a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.2 8.2a2 2 0 0 1-2.8-2.8L15 6.2" /></I>);
export const Link2 = p => (<I {...p}><path d="M10 14a5 5 0 0 0 7.1 0l2.4-2.4a5 5 0 0 0-7.1-7.1l-1.2 1.2M14 10a5 5 0 0 0-7.1 0l-2.4 2.4a5 5 0 0 0 7.1 7.1l1.2-1.2" /></I>);
export const KeyRound = p => (
  <I {...p}><circle cx="8" cy="16" r="5" /><path d="M11.5 12.5L20 4M16 4l3 3" /></I>
);
export const MessageCircle = p => (
  <I {...p}><path d="M21 11.5a8.5 8.5 0 0 1-9 8.5c-1.3 0-2.6-.3-3.7-.8L3 20l.8-5.3A8.5 8.5 0 1 1 21 11.5z" /></I>
);
export const MonitorSmartphone = p => (
  <I {...p}><rect x="3" y="4" width="12" height="11" rx="2" /><path d="M17 8h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-3" /><path d="M7 19h4" /></I>
);
export const Table = p => (
  <I {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M3 14h18M9 4v16M15 4v16" /></I>
);
export const ImagePlus = p => (
  <I {...p}><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="10" cy="10" r="1.8" /><path d="M21 16l-4.5-4.5L9 19M12 7v4M10 9h4" /></I>
);
export const SearchX = p => (
  <I {...p}><circle cx="10" cy="10" r="7" /><path d="M15.5 15.5L21 21M8 8l4 4M12 8l-4 4" /></I>
);
export const CalendarDays = p => (
  <I {...p}><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M8 3v4M16 3v4M3 10h18" /><path d="M8 15h2M13 15h2" /></I>
);
export const Footprints = p => (
  <I {...p}><path d="M8 3a3 3 0 0 1 3 3c0 2.5-1.2 5-3.5 6.5C5.6 14 5 16 5 18M16 3a3 3 0 0 1 3 3c0 2.5-1.2 5-3.5 6.5C13.6 14 13 16 13 18" /></I>
);
export const Inbox = p => (
  <I {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5.5L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.5z" /></I>
);
export const Wifi = p => (
  <I {...p}><path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0" /><path d="M12 19.5h.01" /></I>
);
export const Copy = p => (
  <I {...p}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></I>
);
export const List = p => (<I {...p}><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" /></I>);
export const MonitorPlay = p => (
  <I {...p}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M10 8.5l5 3-5 3v-6zM9 21h6" /></I>
);
export const Camera = p => (
  <I {...p}><path d="M4 8h3l2-3h6l2 3h3v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" /><circle cx="12" cy="13" r="3.5" /></I>
);
export const FileDown = p => (
  <I {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" /><path d="M14 3v5h5M12 11v7M9 15l3 3 3-3" /></I>
);
export const GripVertical = p => (<I {...p}><circle cx="9" cy="6" r="1" fill="currentColor" /><circle cx="15" cy="6" r="1" fill="currentColor" /><circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" /><circle cx="9" cy="18" r="1" fill="currentColor" /><circle cx="15" cy="18" r="1" fill="currentColor" /></I>);
export const Compass = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M16 8l-2.5 5.5L8 16l2.5-5.5L16 8z" /></I>
);
export const Check = p => (<I {...p}><path d="M4 12.5l5 5L20 6.5" /></I>);
export const Send = p => (<I {...p}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></I>);
export const PlayCircle = p => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M10 8.5l5 3.5-5 3.5v-7z" /></I>
);
export const BookCheck = p => (
  <I {...p}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z" /><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" /><path d="M13 8l2 2 3.5-4" /></I>
);
export const Images = p => (
  <I {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.8" /><path d="M21 16l-5-5-9 9" /><path d="M17 3v4M15 5h4" /></I>
);
export const ListChecks = p => (
  <I {...p}><path d="M10 6h11M10 12h9M10 18h11" /><path d="M3 5.5l1.5 1.5L7 4.5M3 11.5l1.5 1.5L7 10.5M3 17.5l1.5 1.5L7 16.5" /></I>
);
export const Timer = p => (
  <I {...p}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.8 1.7M9 2h6M12 2v3" /></I>
);
export const Monitor = p => (
  <I {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M9 20h6M12 16v4" /></I>
);
export const ArrowDown = p => (<I {...p}><path d="M12 5v14M6 13l6 6 6-6" /></I>);
export const Bookmark = p => (<I {...p}><path d="M6 3h12v18l-6-4.5L6 21V3z" /></I>);
export const Sparkle = p => (<I {...p}><path d="M12 3l2 6 6 3-6 3-2 6-2-6-6-3 6-3 2-6z" /></I>);
export const Stethoscope = p => (
  <I {...p}><path d="M5 3v5a4 4 0 0 0 8 0V3M9 20a4 4 0 0 0 4-4v-3" /><circle cx="9" cy="3" r="1.2" /><circle cx="18" cy="8" r="2.5" /><path d="M18 10.5v2a4 4 0 0 1-4 4" /></I>
);
export const Syringe = p => (
  <I {...p}><path d="M18 2l4 4M17 7l3-3M14 10l3 3M13 9l6-6M5 15l6-6M3 21l4-4M20 12l-6 6 2 2 6-6-2-2z" /></I>
);
export const ClipboardList = p => (
  <I {...p}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4a3 3 0 0 1 6 0M9 11h6M9 15h4" /></I>
);
export const FilePlus = p => (
  <I {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" /><path d="M14 3v5h5M12 12v6M9 15h6" /></I>
);
export const Edit = p => (
  <I {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></I>
);
export const Download = p => (
  <I {...p}><path d="M12 4v12M6 11l6 6 6-6" /><path d="M4 20h16" /></I>
);
export const Filter = p => (
  <I {...p}><path d="M22 4H2l8 9v6l4 2v-8l8-9z" /></I>
);
export const BarChart = p => (
  <I {...p}><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" rx="1" /><rect x="12" y="8" width="3" height="10" rx="1" /><rect x="17" y="5" width="3" height="13" rx="1" /></I>
);
export const PieChart = p => (
  <I {...p}><path d="M21 12A9 9 0 1 1 12 3v9h9z" /><path d="M15 3.5A9 9 0 0 1 20.5 9H15V3.5z" /></I>
);
export const LineChart = p => (
  <I {...p}><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-6" /></I>
);
export const AwardIcon = Award;
export { Image as ImageIcon, Settings as SettingsIcon, Table as TableIcon };
export default { ShieldCheck, ShieldAlert, CheckCircle2, HeartPulse, BookOpen };

