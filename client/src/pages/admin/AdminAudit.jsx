import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, ScrollText, ShieldCheck } from '../../components/icons';
import { adminApi, formatNumber, initials, relativeTime } from '../../lib/admin';
import { Badge, EmptyState, ErrorState, LoadingState, PageHeader, Pagination, Panel } from '../../components/admin/ui';

export default function AdminAudit() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .audit({ page, limit: 20 })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page]);

  if (loading && !data) return <LoadingState label={t('admin.common.loading')} />;
  if (error && !data) {
    return <ErrorState title={t('admin.errors.loadAudit')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />;
  }

  const logs = data?.logs || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  return (
    <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C]">
      <PageHeader
        eyebrow={t('admin.shell.operations')}
        title={t('admin.audit.title')}
        subtitle={t('admin.audit.subtitle')}
        actions={
          <button
            type="button"
            onClick={load}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DD88CF] bg-[#F8E7F6] text-[#4B164C] transition-colors hover:bg-[#DD88CF]/30 shadow-sm"
            aria-label={t('admin.common.refresh')}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      <Panel noPadding className="bg-white border border-[#DD88CF]/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-[#DD88CF]/30 px-5 py-4 bg-[#F8E7F6]/50">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#4B164C]">
            <ShieldCheck className="h-4 w-4 text-[#DD88CF]" /> {t('admin.audit.title')}
          </h2>
          <Badge tone="outline" className="bg-white text-[#4B164C] border-[#DD88CF]">
            {formatNumber(pagination.total, i18n.language)}
          </Badge>
        </div>

        {logs.length === 0 ? (
          <EmptyState title={t('admin.audit.noLogs')} icon={ScrollText} />
        ) : (
          <>
            <div className="admin-scroll hidden overflow-x-auto md:block">
              <table className="admin-table w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#DD88CF]/30 bg-[#F5F5F5] text-[11px] text-[#4B164C]">
                    <th className="p-3.5">{t('admin.audit.actor')}</th>
                    <th className="p-3.5">{t('admin.audit.action')}</th>
                    <th className="p-3.5">{t('admin.audit.target')}</th>
                    <th className="p-3.5">{t('admin.audit.details')}</th>
                    <th className="p-3.5">{t('admin.audit.time')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DD88CF]/20 text-xs">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-[#F5F5F5]/60 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F8E7F6] text-[10px] font-extrabold text-[#4B164C] border border-[#DD88CF]/50">
                            {initials(log.actor?.name || 'A')}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-[#4B164C]">{log.actor?.name || t('admin.common.notAvailable')}</p>
                            <p className="text-[9px] text-[#4B164C]/70" dir="ltr">{log.actor?.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <Badge tone="amber" className="bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]">
                          {t(`admin.audit.actions.${log.action}`, { defaultValue: log.action })}
                        </Badge>
                      </td>
                      <td className="p-3.5">
                        <p className="text-[11px] font-bold text-[#4B164C]">{log.targetLabel || '—'}</p>
                        <p className="text-[9px] text-[#4B164C]/70">{t(`admin.audit.targets.${log.targetType}`, { defaultValue: log.targetType || '' })}</p>
                      </td>
                      <td className="p-3.5 max-w-sm text-[11px] text-[#4B164C]/80">{log.details || '—'}</td>
                      <td className="p-3.5 text-[10px] text-[#4B164C]/70">{relativeTime(log.createdAt, i18n.language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#DD88CF]/20 md:hidden">
              {logs.map((log) => (
                <div key={log._id} className="flex items-start gap-3 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F8E7F6] text-[10px] font-extrabold text-[#4B164C] border border-[#DD88CF]/50">
                    {initials(log.actor?.name || 'A')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-[11px] font-extrabold text-[#4B164C]">{t(`admin.audit.actions.${log.action}`, { defaultValue: log.action })}</p>
                      <Badge tone="outline" className="bg-[#F8E7F6] text-[#4B164C] border-[#DD88CF]">{t(`admin.audit.targets.${log.targetType}`, { defaultValue: log.targetType || '' })}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-[10px] font-semibold text-[#4B164C]/70">{log.targetLabel || '—'}</p>
                    {log.details && <p className="mt-0.5 line-clamp-2 text-[10px] text-[#4B164C]/80">{log.details}</p>}
                    <p className="mt-1 text-[9px] font-semibold text-[#4B164C]/60">{relativeTime(log.createdAt, i18n.language)} · {log.actor?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          onPage={setPage}
          language={i18n.language}
          labels={{
            total: t('admin.common.total'),
            page: t('admin.common.page'),
            previous: t('admin.common.previous'),
            next: t('admin.common.next'),
          }}
        />
      </Panel>
    </div>
  );
}