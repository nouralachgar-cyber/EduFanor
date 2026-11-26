import { useCallback, useEffect, useMemo, useState } from 'react';
import { getStoredToken } from '../lib/api';
import { listCourseCertificates } from '../lib/certificates';

export default function useCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(getStoredToken()));

  const refresh = useCallback(() => {
    if (!getStoredToken()) {
      setCertificates([]);
      setLoading(false);
      return Promise.resolve([]);
    }
    setLoading(true);
    return listCourseCertificates()
      .then((data) => {
        const list = Array.isArray(data?.certificates) ? data.certificates : [];
        setCertificates(list);
        return list;
      })
      .catch(() => {
        setCertificates([]);
        return [];
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!getStoredToken()) return undefined;
    let active = true;
    listCourseCertificates()
      .then((data) => {
        if (!active) return [];
        const list = Array.isArray(data?.certificates) ? data.certificates : [];
        setCertificates(list);
        return list;
      })
      .catch(() => {
        if (!active) return [];
        setCertificates([]);
        return [];
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const byCourse = useMemo(
    () =>
      certificates.reduce((map, certificate) => {
        if (certificate?.courseKey) map[certificate.courseKey] = certificate;
        return map;
      }, {}),
    [certificates]
  );

  return { certificates, byCourse, loading, refresh };
}
