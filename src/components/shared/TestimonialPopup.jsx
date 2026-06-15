import { useEffect, useRef, useState } from 'react';

const DISMISS_MS = 7000;
const INTERVAL_MS = 15000;
const FIRST_DELAY_MS = 8000;
const ACTIVITY_SHOW_MS = 4000;
const ACTIVITY_HIDE_MS = 3000;

const testimonials = [
    { name: "Aarav Sharma", code: "in" },
    { name: "Priya Patel", code: "in" },
    { name: "Li Wei", code: "cn" },
    { name: "Zhang Mei", code: "cn" },
    { name: "Emma Johnson", code: "us" },
    { name: "Michael Smith", code: "us" },
    { name: "Muhammad Rizki", code: "id" },
    { name: "Siti Nurhaliza", code: "id" },
    { name: "João Silva", code: "br" },
    { name: "Maria Santos", code: "br" },
    { name: "Ahmed Khan", code: "pk" },
    { name: "Fatima Ali", code: "pk" },
    { name: "Mohammad Rahman", code: "bd" },
    { name: "Arif Hossain", code: "bd" },
    { name: "Alexander Ivanov", code: "ru" },
    { name: "Anastasia Petrova", code: "ru" },
    { name: "Diego Morales", code: "mx" },
    { name: "Sofia Hernandez", code: "mx" },
    { name: "Dawit Haile", code: "et" },
    { name: "Selam Tesfaye", code: "et" },
    { name: "Hiroshi Tanaka", code: "jp" },
    { name: "Sakura Yamamoto", code: "jp" },
    { name: "Juan Dela Cruz", code: "ph" },
    { name: "Angelo Reyes", code: "ph" },
    { name: "Mohamed Hassan", code: "eg" },
    { name: "Aisha Khalil", code: "eg" },
    { name: "Brian Otieno", code: "ke" },
    { name: "Grace Wanjiku", code: "ke" },
    { name: "Mohammed Al-Saud", code: "sa" },
    { name: "Ahmed Al-Mansouri", code: "ae" },
    { name: "Oliver Smith", code: "gb" },
    { name: "Amelia Brown", code: "gb" },
    { name: "Lukas Müller", code: "de" },
    { name: "Hannah Schmidt", code: "de" },
    { name: "Lucas Dubois", code: "fr" },
    { name: "Camille Martin", code: "fr" },
    { name: "Sipho Dlamini", code: "za" },
    { name: "Mateo Gonzalez", code: "ar" },
    { name: "Santiago Reyes", code: "co" },
    { name: "Oleksandr Koval", code: "ua" },
    { name: "Nguyen Van Minh", code: "vn" },
    { name: "Ahmet Yilmaz", code: "tr" },
    { name: "Somchai Wongsak", code: "th" },
    { name: "Kwame Mensah", code: "gh" },
    { name: "Luca Müller", code: "ch" },
    { name: "Liam Henderson", code: "au" },
    { name: "Chloe Williams", code: "au" },
];

const quotes = [
    "I couldn't believe it when they knocked on my door 😭 the <strong>$20,000 cash</strong> was delivered right to my doorstep. Still in shock!!",
    "They literally brought the <strong>$20,000</strong> to my house. I opened the door and there it was 🙏 best day of my life fr!",
    "No bank transfer, no waiting — the <strong>$20K cash</strong> came straight to my doorstep. God bless this giveaway 🤲",
    "My family thought I was joking until they saw the <strong>$20,000</strong> delivered right to our front door 😂 100% legit!",
    "Been a fan for years and winning felt unreal — but when the <strong>$20K</strong> showed up at my door I finally believed it 🔥",
    "The delivery was so fast! <strong>$20,000 cash</strong> brought straight to my doorstep. The team was professional 🙌",
    "I entered for fun and WON 🎉 They delivered the <strong>$20K cash prize</strong> to my home. My family was screaming!!",
    "Heard a knock, opened the door, and there was <strong>$20,000 cash</strong> waiting for me 😱🙏 I literally cried!",
    "This giveaway is real — the <strong>$20,000</strong> was hand delivered to my doorstep. Starting my business now 🚀",
    "Fastest delivery of my life 😂 the <strong>$20K cash</strong> came right to my door. No stress, no delay. Unbelievable!",
    "My neighbor saw them drop off the <strong>$20,000 cash</strong> and now she applied too 😂 100% the real deal!",
    "I was still in my pyjamas when they knocked 😭 opened the door to <strong>$20K cash</strong>. Life changed instantly!",
    "Woke up to a knock at 9am and it was the team with my <strong>$20,000</strong>. I thought I was dreaming 🙏🔥",
    "My mum answered the door and started crying when she saw the <strong>$20K cash</strong>. Unforgettable day 🥹",
    "Three days after I applied, someone knocked on my door with <strong>$20,000 cash</strong>. Still not over it 😱",
    "My kids were the ones who opened the door 😭 seeing their faces when they saw <strong>$20K cash</strong> was priceless 🥹",
    "Didn't even have to leave my house. They brought the <strong>$20,000</strong> straight to me. Next level 🔥",
    "The team was so respectful. <strong>$20,000 cash</strong> delivered to my doorstep within days. God is good 🙏",
    "I was cooking when I heard the knock 😂 put down the pot and opened the door to <strong>$20,000</strong>. Best interruption!",
    "My hands were shaking when I held the <strong>$20,000</strong> they delivered. I kept saying 'is this real?' 😭🙏",
    "From applying to having <strong>$20,000 cash</strong> delivered to my front door in less than a week 🔥",
    "I almost didn't open the door thinking it was spam 😂 glad I did — it was <strong>$20,000 cash</strong> just for me! 🎉",
    "This giveaway gave me hope. <strong>$20,000</strong> delivered to my doorstep. Thank you so much 🥹❤️",
    "Called my brother immediately after 😂 he didn't believe me until I showed him the <strong>$20K cash</strong>!",
    "The guy who delivered my <strong>$20K</strong> took a photo with me 😭 I will treasure that memory forever!",
];

const activityTemplates = [
    (n, c) => `<strong>${n}</strong> just applied for the $20K giveaway`,
    (n, c) => `<strong>${n}</strong> from ${c.toUpperCase()} just entered 🎉`,
    (n, c) => `<strong>${n}</strong> submitted their application just now`,
    (n, c) => `<strong>${n}</strong> is in the running for <strong>$20,000</strong>!`,
    (n, c) => `<strong>${n}</strong> just joined from ${c.toUpperCase()} 🔥`,
];

const confettiColors = ['#ffd200', '#ff8c00', '#ff006e', '#3a86ff', '#8338ec', '#2ed573', '#ff6348'];

function getRandom(arr, last) {
    let idx;
    do { idx = Math.floor(Math.random() * arr.length); } while (idx === last && arr.length > 1);
    return idx;
}

function launchConfetti(x, y) {
    for (let i = 0; i < 12; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
            position:fixed;width:6px;height:6px;border-radius:2px;pointer-events:none;z-index:999999;
            background:${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
            left:${x + (Math.random() - 0.5) * 80}px;
            top:${y + 10}px;
            opacity:1;
            transition:none;
        `;
        document.body.appendChild(el);
        const angle = (Math.random() - 0.5) * 120;
        const dist = 80 + Math.random() * 120;
        setTimeout(() => {
            el.style.transition = `all ${1 + Math.random() * 0.5}s ease-in`;
            el.style.transform = `translate(${angle}px, ${dist}px) rotate(${Math.random() * 720}deg)`;
            el.style.opacity = '0';
        }, 50);
        setTimeout(() => el.remove(), 1800);
    }
}

function playDing() {
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) { }
}

// Detect mobile
function isMobile() {
    return window.innerWidth < 640;
}

export function TestimonialPopup() {
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(null);
    const [progress, setProgress] = useState(1);
    const [activityVisible, setActivityVisible] = useState(false);
    const [activityHtml, setActivityHtml] = useState('');
    // FIX: track whether activity is already showing to prevent double popup
    const activityActiveRef = useRef(false);
    // FIX: prevent main popup from triggering twice simultaneously
    const isShowingRef = useRef(false);

    const lastIdx = useRef(-1);
    const lastActIdx = useRef(-1);
    const popupRef = useRef(null);
    const dismissRef = useRef(null);
    const nextRef = useRef(null);
    const actRef = useRef(null);
    const progressRef = useRef(null);
    const userInteracted = useRef(false);

    useEffect(() => {
        const onInteract = () => { userInteracted.current = true; };
        document.addEventListener('click', onInteract, { once: true });
        document.addEventListener('scroll', onInteract, { once: true });
        document.addEventListener('touchstart', onInteract, { once: true });

        const startTimer = setTimeout(show, FIRST_DELAY_MS);
        actRef.current = setTimeout(() => showActivity(testimonials[0]), 5000);


        return () => {
            clearTimeout(startTimer);
            clearAll();
            document.removeEventListener('click', onInteract);
            document.removeEventListener('scroll', onInteract);
            document.removeEventListener('touchstart', onInteract);
        };
    }, []);

    function clearAll() {
        clearTimeout(dismissRef.current);
        clearTimeout(nextRef.current);
        clearTimeout(actRef.current);
        clearInterval(progressRef.current);
    }

    function show() {
        // FIX: prevent double show if already visible
        if (isShowingRef.current) return;

        // FIX: Don't show main popup if activity popup is currently visible
        if (activityActiveRef.current) {
            clearTimeout(nextRef.current);
            nextRef.current = setTimeout(show, ACTIVITY_SHOW_MS + 500);
            return;
        }

        isShowingRef.current = true;

        const idx = getRandom(testimonials, lastIdx.current);
        lastIdx.current = idx;
        const t = testimonials[idx];
        const q = quotes[Math.floor(Math.random() * quotes.length)];

        setCurrent({ ...t, quote: q });
        setProgress(1);
        setVisible(true);

        setTimeout(() => {
            const el = popupRef.current;
            if (el) {
                const rect = el.getBoundingClientRect();
                launchConfetti(rect.left + rect.width / 2, rect.top);
            }
        }, 100);

        if (userInteracted.current) playDing();

        clearInterval(progressRef.current);
        const start = Date.now();
        progressRef.current = setInterval(() => {
            const p = Math.max(0, 1 - (Date.now() - start) / DISMISS_MS);
            setProgress(p);
            if (p <= 0) clearInterval(progressRef.current);
        }, 50);

        clearTimeout(dismissRef.current);
        dismissRef.current = setTimeout(() => {
            setVisible(false);
            isShowingRef.current = false;
        }, DISMISS_MS);

        clearTimeout(nextRef.current);
        nextRef.current = setTimeout(show, INTERVAL_MS);


    }

    function showActivity(person) {
        if (activityActiveRef.current) return;

        const idx = getRandom(testimonials, lastActIdx.current);
        lastActIdx.current = idx;
        const at = testimonials[idx];
        const fn = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
        setActivityHtml(fn(at.name, at.code));
        setActivityVisible(true);
        activityActiveRef.current = true;

        clearTimeout(actRef.current);
        actRef.current = setTimeout(() => {
            setActivityVisible(false);
            activityActiveRef.current = false;
            actRef.current = setTimeout(() => showActivity(at), ACTIVITY_HIDE_MS);
        }, ACTIVITY_SHOW_MS);
    }


    function close() {
        clearAll();
        setVisible(false);
        isShowingRef.current = false;
    }

    const mobile = isMobile();

    return (
        <>
            <style>{`
                @keyframes tp-slidein {
                    from { opacity:0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity:1; transform: translateY(0) scale(1); }
                }
                @keyframes tp-pulse {
                    0%   { box-shadow: 0 0 0 0 rgba(255,210,0,0.4); }
                    70%  { box-shadow: 0 0 0 8px rgba(255,210,0,0); }
                    100% { box-shadow: 0 0 0 0 rgba(255,210,0,0); }
                }
                @keyframes act-slidein {
                    from { opacity:0; transform: translateY(10px); }
                    to   { opacity:1; transform: translateY(0); }
                }
                @keyframes act-blink {
                    0%,100% { opacity:1; }
                    50%     { opacity:0.2; }
                }
                .tp-popup-enter { 
                    animation: tp-slidein 0.4s cubic-bezier(0.16,1,0.3,1) forwards, tp-pulse 0.7s ease-out; 
                }
                .act-popup-enter {
                    animation: act-slidein 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
                }
                .act-dot { 
                    display:inline-block;width:6px;height:6px;background:#22c55e;
                    border-radius:50%;margin-right:5px;vertical-align:middle;
                    animation:act-blink 1.2s infinite; 
                }
            `}</style>

            {/* ── Main popup — top-right, homepage only ── */}
            {visible && current && window.location.pathname === '/' && (
                <div
                    ref={popupRef}
                    className="tp-popup-enter"
                    style={{
                        position: 'fixed',
                        top: '68px',
                        right: '12px',
                        // FIX: smaller on mobile so it doesn't clash
                        width: mobile ? '160px' : '200px',
                        background: '#13131a',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: '14px',
                        padding: '10px 10px 12px',
                        zIndex: 9999,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
                        overflow: 'hidden',
                    }}
                >
                    <button
                        onClick={close}
                        style={{
                            position: 'absolute', top: '6px', right: '8px',
                            background: 'none', border: 'none',
                            color: 'rgba(255,255,255,0.35)', fontSize: '16px',
                            cursor: 'pointer', lineHeight: 1, padding: '2px 4px',
                        }}
                        aria-label="Close"
                    >×</button>

                    <div style={{
                        display: 'flex', alignItems: 'center',
                        gap: '6px', marginBottom: '2px', paddingRight: '16px',
                    }}>
                        <div style={{
                            fontWeight: 700, fontSize: mobile ? '11px' : '12px', color: '#fff',
                            whiteSpace: 'nowrap', overflow: 'hidden',
                            textOverflow: 'ellipsis', lineHeight: 1.2, flex: 1,
                        }}>
                            {current.name}
                        </div>
                        <div style={{
                            width: '22px', height: '16px', flexShrink: 0,
                            borderRadius: '3px', overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <img
                                src={`https://flagcdn.com/w80/${current.code}.png`}
                                alt={current.code}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    </div>

                    <div style={{ color: '#ffd200', fontSize: '10px', letterSpacing: '1px', marginTop: '2px' }}>
                        ★★★★★
                    </div>

                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '3px',
                        background: 'rgba(255,210,0,0.12)', border: '1px solid rgba(255,210,0,0.25)',
                        color: '#ffd200', fontSize: '9px', fontWeight: 600,
                        padding: '1px 6px', borderRadius: '20px', marginTop: '3px',
                    }}>
                        ✓ Verified Winner
                    </div>

                    <div
                        style={{
                            fontSize: mobile ? '10px' : '11px', lineHeight: 1.5,
                            color: 'rgba(255,255,255,0.65)',
                            borderTop: '1px solid rgba(255,255,255,0.07)',
                            paddingTop: '7px', marginTop: '7px',
                        }}
                        dangerouslySetInnerHTML={{ __html: current.quote }}
                    />

                    <div style={{
                        position: 'absolute', bottom: 0, left: 0,
                        height: '2px',
                        width: `${progress * 100}%`,
                        background: 'linear-gradient(90deg,#ffd200,#ff8c00)',
                        transition: 'width 50ms linear',
                        borderRadius: '0 0 0 14px',
                    }} />
                </div>
            )}

            {/* ── Activity popup — bottom-left, all pages ── */}
            {activityVisible && (
                <div
                    className="act-popup-enter"
                    style={{
                        position: 'fixed',
                        // FIX: on mobile move it up slightly so it clears nav bars
                        bottom: mobile ? '20px' : '16px',
                        left: '12px',
                        background: '#1a1a24',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderLeft: '3px solid #ffd200',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: mobile ? '10px' : '11px',
                        color: 'rgba(255,255,255,0.75)',
                        // FIX: limit width on mobile to avoid overflow
                        maxWidth: mobile ? '180px' : '220px',
                        zIndex: 9998,
                        pointerEvents: 'none',
                    }}
                >
                    <span className="act-dot" />
                    <span dangerouslySetInnerHTML={{ __html: activityHtml }} />
                </div>
            )}
        </>
    );
}