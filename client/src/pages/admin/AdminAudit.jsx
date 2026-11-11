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
    <div className="space-y-6 bg-[#E3E8F8] min-h-screen p-6 text-[#3E588F]">
      <PageHeader
        eyebrow={t('admin.shell.operations')}
        title={t('admin.audit.title')}
        subtitle={t('admin.audit.subtitle')}
        actions={
          <button
            type="button"
            onClick={load}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C0C5CD] bg-[#E3E8F8] text-[#3E588F] transition-colors hover:bg-[#C0C5CD]/30 shadow-sm"
            aria-label={t('admin.common.refresh')}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      <Panel noPadding className="bg-white border border-[#C0C5CD]/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-[#C0C5CD]/30 px-5 py-4 bg-[#E3E8F8]/50">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#3E588F]">
            <ShieldCheck className="h-4 w-4 text-[#C0C5CD]" /> {t('admin.audit.title')}
          </h2>
          <Badge tone="outline" className="bg-white text-[#3E588F] border-[#C0C5CD]">
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
                  <tr className="border-b border-[#C0C5CD]/30 bg-[#E3E8F8] text-[11px] text-[#3E588F]">
                    <th className="p-3.5">{t('admin.audit.actor')}</th>
                    <th className="p-3.5">{t('admin.audit.action')}</th>
                    <th className="p-3.5">{t('admin.audit.target')}</th>
                    <th className="p-3.5">{t('admin.audit.details')}</th>
                    <th className="p-3.5">{t('admin.audit.time')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C0C5CD]/20 text-xs">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-[#E3E8F8]/60 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E3E8F8] text-[10px] font-extrabold text-[#3E588F] border border-[#C0C5CD]/50">
                            {initials(log.actor?.name || 'A')}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-[#3E588F]">{log.actor?.name || t('admin.common.notAvailable')}</p>
                            <p className="text-[9px] text-[#3E588F]/70" dir="ltr">{log.actor?.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <Badge tone="amber" className="bg-[#E3E8F8] text-[#3E588F] border border-[#C0C5CD]">
                          {t(`admin.audit.actions.${log.action}`, { defaultValue: log.action })}
                        </Badge>
                      </td>
                      <td className="p-3.5">
                        <p className="text-[11px] font-bold text-[#3E588F]">{log.targetLabel || '—'}</p>
                        <p className="text-[9px] text-[#3E588F]/70">{t(`admin.audit.targets.${log.targetType}`, { defaultValue: log.targetType || '' })}</p>
                      </td>
                      <td className="p-3.5 max-w-sm text-[11px] text-[#3E588F]/80">{log.details || '—'}</td>
                      <td className="p-3.5 text-[10px] text-[#3E588F]/70">{relativeTime(log.createdAt, i18n.language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#C0C5CD]/20 md:hidden">
              {logs.map((log) => (
                <div key={log._id} className="flex items-start gap-3 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E3E8F8] text-[10px] font-extrabold text-[#3E588F] border border-[#C0C5CD]/50">
                    {initials(log.actor?.name || 'A')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-[11px] font-extrabold text-[#3E588F]">{t(`admin.audit.actions.${log.action}`, { defaultValue: log.action })}</p>
                      <Badge tone="outline" className="bg-[#E3E8F8] text-[#3E588F] border-[#C0C5CD]">{t(`admin.audit.targets.${log.targetType}`, { defaultValue: log.targetType || '' })}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-[10px] font-semibold text-[#3E588F]/70">{log.targetLabel || '—'}</p>
                    {log.details && <p className="mt-0.5 line-clamp-2 text-[10px] text-[#3E588F]/80">{log.details}</p>}
                    <p className="mt-1 text-[9px] font-semibold text-[#3E588F]/60">{relativeTime(log.createdAt, i18n.language)} · {log.actor?.name}</p>
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