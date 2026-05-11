const FIRST_NAMES = [
    'Alex', 'Ava', 'Amelia', 'Aria', 'Ben', 'Benjamin', 'Brooke', 'Caleb', 'Camila', 'Caroline', 'Charles', 'Chloe', 'Daniel', 'Diana', 'Dylan', 'Ethan', 'Ella', 'Elijah', 'Emily', 'Emma', 'Eva', 'Gabriel', 'Grace', 'Hannah', 'Henry', 'Isla', 'Jack', 'Jacob', 'James', 'Jasmine', 'Jason', 'Jeff', 'Jordan', 'Joseph', 'Julia', 'Kate', 'Kevin', 'Liam', 'Lily', 'Logan', 'Lucas', 'Mason', 'Mia', 'Mila', 'Noah', 'Olivia', 'Owen', 'Paige', 'Penelope', 'Quinn', 'Ryan', 'Samuel', 'Sarah', 'Scarlett', 'Sophia', 'Sofia', 'Stella', 'Thomas', 'Victoria', 'Violet', 'William', 'Zoe'
];

const LAST_NAMES = [
    'A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.', 'K.', 'L.', 'M.', 'N.', 'O.', 'P.', 'Q.', 'R.', 'S.', 'T.', 'U.', 'V.', 'W.', 'X.', 'Y.', 'Z.'
];

const MESSAGES = [
    'I just won $20,000 and it still feels unreal! ✅',
    'Super fast payout. I\'m telling everyone I know.',
    'I followed the steps and got my $20,000 notification the next day!',
    'The process was smooth and legit—no stress at all.',
    'I was skeptical at first, but the winner announcement convinced me.',
    'I received my $20,000 quickly to my account. Thank you!',
    'Clean UI, clear rules, and real winners. 10/10.',
    'I joined for fun and ended up winning $20,000!',
    'Verified and paid. Real experience, real results.',
    'I didn\'t expect to win, but it happened. So happy!',
    'Everything felt secure. The winner email was professional.',
    'Quick verification and payout—super impressed!',
    'I checked the rules twice and still felt confident. Paid out fast.',
    'The giveaway was transparent from start to finish.',
    'I won and the support team answered instantly. Highly recommend!',
    'No surprises. The payout arrived on time.',
    'I entered, waited, and then got the real winner confirmation.',
    'The whole experience was smooth and genuinely trustworthy.',
    'I couldn\'t believe it when I saw my payout update.',
    'Great layout, clear instructions, and real winners.',
    'I verified quickly and received my prize without any hassle.',
    'The winners list made it feel honest and legit.',
    'I won $20,000—still smiling, thanks!',
    'The email + instructions were exactly what I needed.',
    'Simple steps, fast results, and a legit winner process.',
    'My payout came through quickly after approval.',
    'I love the transparency. Real winners, real payout.',
    'Everything worked as promised. 5 stars.',
    'I followed the entry steps and got notified fast.',
    'Winner announcement was accurate—paid quickly!'
];

const AVATAR_BASE_SEED = 17;
const TIME_OPTIONS = ['just now', '30sec ago', 'few minutes ago', '2mins', '5mins', '10mins', '38mins', '1hr', 'few hours ago',
    'yesterday',];
const AMOUNT = '$20,000';

// Real profile pictures from Unsplash API (high-quality real photos)
const REAL_AVATAR_URLS = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1507009073585-fc42d332212e?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1507842391343-583f20270319?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1551258545-acf82623c2f9?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1506277886957-b7cc003f23d0?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1501196354995-cdba29d7348f?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1492562564915-c79450faf357?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1516746881620-eccf12922748?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1505033575518-a36ea2ef75cb?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1502823692622-900bdf303225?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1517821740038-6465c1f1200b?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1507214159519-27ec869d8038?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1522228115018-c4dc11d6b6fe?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1507619579900-7cb5a5c4d3e1?w=96&h=96&fit=crop',
    'https://images.unsplash.com/photo-1512699596867-49d41b93ce19?w=96&h=96&fit=crop',
];

function pickUniqueName(i) {
    // Ensure uniqueness by using a large cartesian-like mapping
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    return `${first} ${last}`;
}

export const testimonialPool = Array.from({ length: 100 }).map((_, i) => {
    const name = pickUniqueName(i);
    const snippet = MESSAGES[i % MESSAGES.length];

    // Mix real pictures with generated avatars
    // 40% real images, 60% generated for variety
    let avatar;
    if (i % 5 < 2) {
        // Use real avatar from Unsplash
        avatar = REAL_AVATAR_URLS[i % REAL_AVATAR_URLS.length];
    } else {
        // Generate diverse avatars using DiceBear API with different styles and seeds
        const avatarStyles = [
            'avataaars',      // Cartoon-style avatars
            'personas',       // Cartoon personas
            'lorelei',        // Fun art style
            'micah',          // Pixel style
            'pixel-art-neutral', // Pixel art
            'fun-emoji',      // Emoji style
            'notionists-neutral', // Simple style
            'glass'           // Glass morphism style
        ];

        const style = avatarStyles[i % avatarStyles.length];
        const seed = `${AVATAR_BASE_SEED}${i}${name}`.substring(0, 20); // Unique seed per person
        avatar = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&scale=80`;
    }

    // Deterministic “random” time text (varied; still stable per index)
    const dateText = TIME_OPTIONS[(i * 11 + (i % 3)) % TIME_OPTIONS.length];

    return {
        id: i + 1,
        name,
        avatar,
        message: `“${snippet}”`,
        amount: AMOUNT,
        dateText,
    };
});

