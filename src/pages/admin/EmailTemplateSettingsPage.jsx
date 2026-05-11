import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Save, RotateCcw, Image as ImageIcon, Sparkles, Wand2 } from 'lucide-react';
import { getWinnerEmailTemplate, upsertWinnerEmailTemplate } from '../../firebase/emailTemplate';

const VARIABLES = [
    { key: 'name', label: '{{name}}' },
    { key: 'email', label: '{{email}}' },
    { key: 'country', label: '{{country}}' },
    { key: 'prize', label: '{{prize}}' },
];

function insertAtCursor(textareaEl, insertText) {
    const el = textareaEl;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);
    const next = before + insertText + after;
    el.value = next;
    // move cursor after inserted text
    const cursor = start + insertText.length;
    el.selectionStart = cursor;
    el.selectionEnd = cursor;
    // trigger react state update by dispatching input event
    el.dispatchEvent(new Event('input', { bubbles: true }));
}

function applyVarsPreview(templateHtml, vars) {
    if (!templateHtml) return '';
    return String(templateHtml).replace(/\{\{(\w+)\}\}/g, (_, key) => {
        const v = vars[key];
        return v === undefined || v === null ? '' : String(v);
    });
}

export function EmailTemplateSettingsPage() {
    const [loading, setLoading] = useState(true);

    const [subject, setSubject] = useState('Congratulations! You Have Been Selected');
    const [bodyHtml, setBodyHtml] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [headerText, setHeaderText] = useState('Congratulations');
    const [footerText, setFooterText] = useState('Need help? Contact our support team.');
    const [accent1, setAccent1] = useState('#8B5CF6');
    const [accent2, setAccent2] = useState('#EC4899');
    const [highlight, setHighlight] = useState('#FDE68A');

    const [toast, setToast] = useState(null);

    const [previewOpen, setPreviewOpen] = useState(false);
    const previewVars = useMemo(
        () => ({
            name: 'Michael',
            email: 'michael@example.com',
            country: 'Germany',
            prize: '€1000',
        }),
        [],
    );

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const tpl = await getWinnerEmailTemplate();
                if (!mounted) return;

                setSubject(tpl.subject ?? 'Congratulations! You Have Been Selected');
                setBodyHtml(tpl.bodyHtml ?? '');
                setLogoUrl(tpl.logoUrl ?? '');
                setHeaderText(tpl.headerText ?? 'Congratulations');
                setFooterText(tpl.footerText ?? 'Need help? Contact our support team.');
                setAccent1(tpl?.theme?.accent1 ?? '#8B5CF6');
                setAccent2(tpl?.theme?.accent2 ?? '#EC4899');
                setHighlight(tpl?.theme?.highlight ?? '#FDE68A');
            } catch (e) {
                console.error(e);
                setToast({ type: 'error', msg: 'Failed to load email template.' });
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    async function handleSave() {
        setToast(null);
        try {
            await upsertWinnerEmailTemplate({
                subject,
                bodyHtml,
                logoUrl,
                headerText,
                footerText,
                theme: { accent1, accent2, highlight },
            });
            setToast({ type: 'success', msg: 'Template saved.' });
        } catch (e) {
            console.error(e);
            setToast({ type: 'error', msg: 'Failed to save template.' });
        }
    }

    function handleReset() {
        // reload from Firestore
        setToast(null);
        setLoading(true);
        (async () => {
            try {
                const tpl = await getWinnerEmailTemplate();
                setSubject(tpl.subject ?? 'Congratulations! You Have Been Selected');
                setBodyHtml(tpl.bodyHtml ?? '');
                setLogoUrl(tpl.logoUrl ?? '');
                setHeaderText(tpl.headerText ?? 'Congratulations');
                setFooterText(tpl.footerText ?? 'Need help? Contact our support team.');
                setAccent1(tpl?.theme?.accent1 ?? '#8B5CF6');
                setAccent2(tpl?.theme?.accent2 ?? '#EC4899');
                setHighlight(tpl?.theme?.highlight ?? '#FDE68A');
                setToast({ type: 'success', msg: 'Reset to latest saved template.' });
            } catch (e) {
                console.error(e);
                setToast({ type: 'error', msg: 'Failed to reset template.' });
            } finally {
                setLoading(false);
            }
        })();
    }

    function handleInsert(varLabel) {
        const el = document.getElementById('winner-email-body-editor');
        insertAtCursor(el, varLabel);
    }

    const previewHtml = useMemo(() => {
        const html = bodyHtml || '';
        const subjectPreview = subject;
        const resolved = applyVarsPreview(html, previewVars);

        // If admin wrote plain text without HTML wrapper, still show inside preview shell
        const safeBody = resolved.trim().length ? resolved : `<p style="color:#CBD5E1">No email body yet.</p>`;

        const logo = logoUrl
            ? `<img src="${logoUrl}" alt="logo" style="max-width:120px;height:auto;display:block;margin:0 auto 14px;border-radius:14px;" />`
            : '';

        // Keep styling consistent even for template bodyHtml
        return `
      <div style="font-family:Arial, Helvetica, sans-serif; padding:18px; background:#050507; color:#E5E7EB;">
        <div style="max-width:680px; margin:0 auto;">
          <div style="text-align:center; margin-bottom:10px;">
            ${logo}
            <span style="display:inline-block;padding:8px 18px;border-radius:999px;background:linear-gradient(90deg, ${accent1}, ${accent2});color:#fff;font-weight:800;">
              FanPrizeHub
            </span>
          </div>
          <div style="background:#0B0B12;border:1px solid rgba(139,92,246,0.25);border-radius:18px;overflow:hidden;">
            <div style="padding:22px 20px; background:linear-gradient(180deg, rgba(139,92,246,0.18), rgba(236,72,153,0.06));">
              <h1 style="margin:0; text-align:center; font-size:30px; letter-spacing:-0.2px; color:#fff;">
                ${headerText ? `<span style="color:${highlight};">${headerText}</span>` : ''}
              </h1>
              <p style="margin:10px 0 0; text-align:center; color:#CBD5E1; font-size:14px;">
                Subject preview: ${applyVarsPreview(subjectPreview, previewVars)}
              </p>
            </div>
            <div style="padding:18px 20px;">
              ${safeBody}
            </div>
            <div style="padding:14px 20px; border-top:1px solid rgba(255,255,255,0.06); color:#94A3B8; font-size:13px; line-height:1.6;">
              ${applyVarsPreview(footerText, previewVars)}
              <div style="margin-top:6px;">
                <span style="color:${highlight}; font-weight:700;">support@fanprizehub.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }, [bodyHtml, subject, previewVars, accent1, accent2, highlight, headerText, footerText, logoUrl]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-24 pt-32">
                <div className="rounded-2xl border border-purple-500/20 bg-[#0d0d18] p-8 text-gray-300">
                    Loading email template…
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 px-4 py-24 pt-32">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-black text-white">Winner Email Template</h1>
                <p className="text-gray-500 mt-1">
                    Edit the subject and body. Variables supported: {VARIABLES.map((v) => v.label).join(', ')}.
                </p>
            </motion.div>

            {toast && (
                <div
                    className={`px-4 py-3 rounded-xl border text-sm font-semibold ${toast.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                            : 'bg-red-500/10 border-red-500/20 text-red-300'
                        }`}
                >
                    {toast.msg}
                </div>
            )}

            {/* Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left - Editor */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0d0d18] border border-purple-500/10 rounded-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-purple-500/10">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Wand2 className="w-5 h-5 text-purple-300" />
                                <h2 className="text-white font-bold text-lg">Template Editor</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setPreviewOpen(true)}
                                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/20 text-gray-200 flex items-center gap-2 text-sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </motion.button>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                Email Subject
                            </label>
                            <input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 bg-[#0d0d18] border border-purple-500/20 rounded-xl text-white text-sm outline-none focus:border-purple-500/50"
                            />

                            <div className="flex flex-wrap gap-2">
                                {VARIABLES.map((v) => (
                                    <button
                                        key={v.key}
                                        onClick={() => handleInsert(v.label)}
                                        className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500/10 border border-purple-500/20 text-purple-200 hover:bg-purple-500/15 transition"
                                        type="button"
                                        title={`Insert ${v.label}`}
                                    >
                                        {v.label}
                                    </button>
                                ))}
                            </div>

                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                Email Body (HTML)
                            </label>

                            <textarea
                                id="winner-email-body-editor"
                                value={bodyHtml}
                                onChange={(e) => setBodyHtml(e.target.value)}
                                rows={14}
                                className="w-full px-4 py-3 bg-[#0d0d18] border border-purple-500/20 rounded-xl text-white text-sm outline-none focus:border-purple-500/50"
                                placeholder={`Example:\nHello {{name}}, congratulations!\n\n<p style="color:#fff;">Prize: {{prize}}</p>`}
                            />

                            <p className="text-xs text-gray-500">
                                Tip: Paste HTML here. Variables will be replaced at send-time by Cloud Function.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 flex flex-col sm:flex-row gap-3 justify-between border-b border-purple-500/10">
                        <div className="flex flex-wrap gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handleSave}
                                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold rounded-xl flex items-center gap-2 transition"
                            >
                                <Save className="w-4 h-4" />
                                Save Template
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handleReset}
                                className="px-5 py-2 bg-white/5 border border-purple-500/20 hover:bg-white/10 text-white font-bold rounded-xl flex items-center gap-2 transition"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </motion.button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Sparkles className="w-4 h-4 text-purple-300" />
                            Auto email will use latest saved template after admin approves winners.
                        </div>
                    </div>
                </motion.div>

                {/* Right - Brand / Theme */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0d0d18] border border-purple-500/10 rounded-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-purple-500/10">
                        <h2 className="text-white font-bold text-lg">Brand & Layout</h2>
                        <p className="text-gray-500 mt-1 text-sm">Controls applied by the Cloud Function email renderer wrapper.</p>

                        <div className="mt-5 grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-1 gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Logo URL</label>
                                <div className="relative">
                                    <ImageIcon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-[#0d0d18] border border-purple-500/20 rounded-xl text-white text-sm outline-none focus:border-purple-500/50"
                                        placeholder="https://.../logo.png"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Header Text</label>
                                <input
                                    value={headerText}
                                    onChange={(e) => setHeaderText(e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0d0d18] border border-purple-500/20 rounded-xl text-white text-sm outline-none focus:border-purple-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Footer Text</label>
                                <textarea
                                    value={footerText}
                                    onChange={(e) => setFooterText(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-[#0d0d18] border border-purple-500/20 rounded-xl text-white text-sm outline-none focus:border-purple-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Accent 1</label>
                                    <input
                                        type="color"
                                        value={accent1}
                                        onChange={(e) => setAccent1(e.target.value)}
                                        className="w-full h-10 bg-transparent border border-purple-500/20 rounded-xl"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Accent 2</label>
                                    <input
                                        type="color"
                                        value={accent2}
                                        onChange={(e) => setAccent2(e.target.value)}
                                        className="w-full h-10 bg-transparent border border-purple-500/20 rounded-xl"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Highlight</label>
                                    <input
                                        type="color"
                                        value={highlight}
                                        onChange={(e) => setHighlight(e.target.value)}
                                        className="w-full h-10 bg-transparent border border-purple-500/20 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl border border-purple-500/15 bg-white/5 p-4 text-xs text-gray-400 leading-relaxed">
                                <span className="font-bold text-gray-200">Note:</span> This editor stores HTML + subject in Firestore.
                                The Cloud Function replaces variables and sends the final email after winner approval.
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Preview Modal */}
            {previewOpen && (
                <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        className="w-full max-w-3xl bg-[#0d0d18] border border-purple-500/20 rounded-2xl overflow-hidden"
                    >
                        <div className="p-4 border-b border-purple-500/10 flex items-center justify-between">
                            <div className="text-white font-bold">Live Preview (with sample variables)</div>
                            <button
                                onClick={() => setPreviewOpen(false)}
                                className="px-3 py-1.5 rounded-xl bg-white/5 border border-purple-500/20 text-white hover:bg-white/10 transition text-sm"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-4 max-h-[70vh] overflow-auto">
                            <div
                                className="rounded-xl border border-purple-500/10 overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: previewHtml }}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
