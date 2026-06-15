// Expanded cross-country name pool (more believable global mix)
const FIRST_NAMES = [
    // USA / Canada / UK / Australia
    'Alex', 'Ava', 'Amelia', 'Aria', 'Ben', 'Benjamin', 'Brooke', 'Caleb', 'Caroline', 'Charles', 'Chloe',
    'Daniel', 'David', 'Dylan', 'Ethan', 'Ella', 'Elijah', 'Emily', 'Emma', 'Eva', 'Grace', 'Hannah',
    'Henry', 'Isla', 'Jack', 'Jacob', 'James', 'Jason', 'Jeff', 'Jordan', 'Joseph', 'Julia', 'Kate', 'Kevin',
    'Liam', 'Lily', 'Logan', 'Lucas', 'Mason', 'Mia', 'Noah', 'Olivia', 'Owen', 'Paige', 'Penelope',
    'Quinn', 'Ryan', 'Samuel', 'Sarah', 'Sophia', 'Sofia', 'Stella', 'Thomas', 'Victoria', 'Zoe',

    // Latin America / Spain / Portugal
    'Mateo', 'Sofia', 'Camila', 'Valentina', 'Lucia', 'Mateus', 'Rafaela', 'Isadora', 'Bruno', 'Thiago',
    'Valeria', 'Gabriela', 'Leo', 'Nicolas', 'Miguel', 'Isabella', 'Elena', 'Bianca',

    // France / francophone
    'Camille', 'Julien', 'Louis', 'Noemie', 'Adeline', 'Theo', 'Chloe', 'Emile', 'Luc', 'Mael', 'Celine',

    // Germany / Austria / Switzerland
    'Lukas', 'Felix', 'Mila', 'Leonie', 'Emilia', 'Theo', 'Hannah', 'Greta', 'Jonas', 'Finn', 'Lina',

    // Nordics
    'Freya', 'Ida', 'Astrid', 'Noah', 'Signe', 'Oliver', 'Elias', 'Emil', 'Linnea',

    // India / South Asia
    'Aarav', 'Vihaan', 'Arjun', 'Isha', 'Anaya', 'Kiara', 'Riya', 'Kavya', 'Meera', 'Sameer', 'Neha', 'Aditya',

    // Middle East
    'Omar', 'Layla', 'Zayn', 'Amir', 'Nour', 'Farah', 'Yara', 'Rami', 'Samir', 'Hassan', 'Mariam',

    // Africa (varied)
    'Kwame', 'Kofi', 'Ama', 'Tunde', 'Chidi', 'Amina', 'Fatima', 'Zola', 'Lerato', 'Thabo', 'Nandi', 'Emmanuel',

    // East Asia
    'Minseo', 'Hana', 'Yuki', 'Sora', 'Rina', 'Kenji', 'Daichi', 'Mei', 'Aiko', 'Hiro', 'Yuna',
];

const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez', 'Rodriguez', 'Lopez', 'Gonzalez',
    'Hernandez', 'Perez', 'Santos', 'Silva', 'Costa', 'Ferreira', 'Almeida', 'Souza', 'Oliveira', 'Gomes',
    'Moreira', 'Rossi', 'Bianchi', 'Russo', 'Conti', 'Ferrari', 'Verdi', 'Gallo', 'Ribeiro', 'Kowalski', 'Nowak',
    'Schmidt', 'Muller', 'Weber', 'Fischer', 'Hansen', 'Johansson', 'Andersson', 'Nilsen', 'Svensson',
    'Khan', 'Rahman', 'Singh', 'Patel', 'Sharma', 'Kumar', 'Ahmed', 'Hussein', 'Saleh', 'Al-Saud', 'Ibrahim',
    'Adeyemi', 'Adebayo', 'Okafor', 'Nwosu', 'Mensah', 'Osei', 'Diallo', 'Kone', 'Mokhtar', 'Nguyen', 'Tanaka',
    'Kim', 'Park', 'Sato', 'Wong', 'Chung', 'Alvarez', 'Mendoza', 'Vargas', 'Cruz', 'Morales', 'Stein', 'Berg',
    'Larsen', 'Johansen'
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

const TIME_OPTIONS = ['just now', '30sec ago', 'few minutes ago', '2mins', '5mins', '10mins', '38mins', '1hr', 'few hours ago', 'yesterday'];
const AMOUNT = '$20,000';

// Countries + flags + culturally realistic name pools (20 countries)
const COUNTRY_PROFILES = [
    {
        flag: '🇮🇳',
        country: 'India',
        names: ['Aarav Sharma', 'Priya Patel', 'Rohan Gupta', 'Neha Verma', 'Arjun Iyer', 'Meera Nair', 'Vihaan Kapoor', 'Isha Roy'],
    },
    {
        flag: '🇨🇳',
        country: 'China',
        names: ['Li Wei', 'Zhang Mei', 'Wang Jun', 'Chen Hao', 'Liu Yating', 'Zhao Ming', 'Sun Qian', 'Yang Wei'],
    },
    {
        flag: '🇺🇸',
        country: 'USA',
        names: ['Emma Johnson', 'Michael Smith', 'Sophia Garcia', 'James Wilson', 'Olivia Brown', 'Daniel Martinez', 'Ava Thompson', 'William Lee'],
    },
    {
        flag: '🇮🇩',
        country: 'Indonesia',
        names: ['Muhammad Rizki', 'Siti Nurhaliza', 'Ahmad Santoso', 'Dewi Lestari', 'Fajar Pratama', 'Rizka Putri', 'Bima Wijaya', 'Nadia Rahma'],
    },
    {
        flag: '🇵🇰',
        country: 'Pakistan',
        names: ['Ahmed Khan', 'Fatima Ali', 'Bilal Hussain', 'Ayesha Raza', 'Usman Butt', 'Hassan Malik', 'Zainab Qureshi', 'Omer Farooq'],
    },
    {
        flag: '🇬🇧',
        country: 'UK',
        names: ['Oliver Smith', 'Amelia Brown', 'James Wilson', 'Sophia Patel', 'Jack Thompson', 'Emily Johnson', 'Noah Williams', 'Mia Clarke'],
    },
    {
        flag: '🇧🇷',
        country: 'Brazil',
        names: ['João Silva', 'Maria Santos', 'Lucas Oliveira', 'Ana Souza', 'Pedro Ferreira', 'Camila Ribeiro', 'Rafaela Costa', 'Bruno Martins'],
    },
    {
        flag: '🇧🇩',
        country: 'Bangladesh',
        names: ['Mohammad Rahman', 'Fatima Begum', 'Arif Hossain', 'Mariam Sultana', 'Nurul Islam', 'Shamim Akter', 'Rahim Chowdhury', 'Tania Ahmed'],
    },
    {
        flag: '🇷🇺',
        country: 'Russia',
        names: ['Alexander Ivanov', 'Anastasia Petrova', 'Dmitri Sokolov', 'Ekaterina Morozova', 'Nikita Volkov', 'Olga Kuznetsova', 'Sergey Smirnov', 'Irina Popova'],
    },
    {
        flag: '🇲🇽',
        country: 'Mexico',
        names: ['Diego Morales', 'Sofia Hernandez', 'Mateo Ramirez', 'Valentina Cruz', 'Adrian Delgado', 'Carolina Vargas', 'Luis Ortega', 'Mariana Flores'],
    },
    {
        flag: '🇯🇵',
        country: 'Japan',
        names: ['Hiroshi Tanaka', 'Sakura Yamamoto', 'Kenji Sato', 'Yuki Nakamura', 'Aiko Watanabe', 'Daichi Suzuki', 'Mei Kobayashi', 'Rina Takahashi'],
    },
    {
        flag: '🇪🇹',
        country: 'Ethiopia',
        names: ['Dawit Haile', 'Selam Tesfaye', 'Yonas Alem', 'Tewodros Bekele', 'Sara Gebre', 'Abel Demissie', 'Meaza Wolde', 'Hana Tesfaye'],
    },
    {
        flag: '🇵🇭',
        country: 'Philippines',
        names: ['Juan Dela Cruz', 'Maria Santos', 'Angelo Reyes', 'Alyssa Villanueva', 'Miguel Ramos', 'Catherine Flores', 'Joshua Lopez', 'Therese Ramirez'],
    },
    {
        flag: '🇪🇬',
        country: 'Egypt',
        names: ['Mohamed Hassan', 'Aisha Khalil', 'Omar Abdel', 'Youssef Nasser', 'Sara El-Sayed', 'Amira Mostafa', 'Hassan Ali', 'Mariam Ibrahim'],
    },
    {
        flag: '🇸🇦',
        country: 'Saudi Arabia',
        names: ['Mohammed Al-Saud', 'Fatima Al-Ahmed', 'Abdullah Rahman', 'Ahmed Al-Mansouri', 'Layla Al-Zahrani', 'Omar Al-Qurashi', 'Noura Al-Harbi', 'Faisal Al-Otaibi'],
    },
    {
        flag: '🇦🇪',
        country: 'UAE',
        names: ['Ahmed Al-Mansouri', 'Layla Al-Khalifa', 'Omar Hassan', 'Salim Al-Falasi', 'Mariam Al-Balushi', 'Hassan Al-Nuaimi', 'Aisha Al-Serkal', 'Yousef Al-Raisi'],
    },
    {
        flag: '🇳🇬',
        country: 'Nigeria',
        names: ['Chinedu Okoro', 'Adaobi Nwosu', 'Emeka Okafor', 'Ngozi Eze', 'Ifeanyi Chukwu', 'Amina Bello', 'Tunde Adebayo', 'Funke Ogunleye'],
    },
    {
        flag: '🇿🇦',
        country: 'South Africa',
        names: ['Sipho Dlamini', 'Thando Nkosi', 'Lerato Mokoena', 'Bongani Khumalo', 'Nomsa Ndlovu', 'Themba Zulu', 'Zanele Mthembu', 'Kagiso Radebe'],
    },
    {
        flag: '🇹🇷',
        country: 'Turkey',
        names: ['Mehmet Yilmaz', 'Ayse Kaya', 'Ali Demir', 'Fatma Celik', 'Mustafa Arslan', 'Elif Polat', 'Huseyin Sahin', 'Zeynep Ozturk'],
    },
    {
        flag: '🇳🇱',
        country: 'Netherlands',
        names: ['Jan de Vries', 'Anna Jansen', 'Piet van der Berg', 'Sophie Bakker', 'Lars Mulder', 'Eva de Boer', 'Dirk van Leeuwen', 'Marlies Visser'],
    },
];

function pickDeterministic(arr, i) {
    return arr[i % arr.length];
}

function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return h;
}

function pickAvatarGradient(seed) {
    const colors = [
        ['#ef4444', '#fb7185'],
        ['#f43f5e', '#fb7185'],
        ['#e11d48', '#f97316'],
        ['#dc2626', '#f59e0b'],
        ['#f97316', '#fb7185'],
        ['#f43f5e', '#f97316'],
        ['#dc2626', '#fb7185'],
        ['#a855f7', '#ec4899'],
        ['#22c55e', '#14b8a6'],
        ['#38bdf8', '#6366f1'],
    ];
    return colors[Math.abs(hashCode(String(seed))) % colors.length];
}

function initials(fullName) {
    const parts = String(fullName).trim().split(/\s+/);
    const a = parts[0]?.[0] ?? '';
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (a + b).toUpperCase();
}

const VERIFIED_LABELS = ['Verified Customer', 'Verified Customer', 'Verified Customer'];
const VERIFIED_BADGES = ['★★★★★', '★★★★☆', '★★★★☆'];

const QUOTE_TEMPLATES = [
    (amount) => `I just won ${amount} and it still feels unreal! ✅`,
    (amount) => `Super fast payout. I’m telling everyone I know—${amount} arrived quickly.`,
    (amount) => `The process was smooth and legit—no stress at all. I received ${amount} next.`,
    (amount) => `I followed the steps and my winner notification came the very next day. ${amount} paid out!`,
    (amount) => `The winner announcement looked genuine—and sure enough, I received ${amount}.`,
];

export const testimonialPool = Array.from({ length: 120 }).map((_, i) => {
    const profile = pickDeterministic(COUNTRY_PROFILES, i);
    const name = pickDeterministic(profile.names, i * 7 + 3);
    const flag = profile.flag;
    const message = QUOTE_TEMPLATES[i % QUOTE_TEMPLATES.length](AMOUNT);

    const dateText = TIME_OPTIONS[(i * 11 + (i % 3)) % TIME_OPTIONS.length];
    const [a, b] = pickAvatarGradient(`${name}-${i}`);
    const badge = VERIFIED_BADGES[i % VERIFIED_BADGES.length];
    const verifiedLabel = VERIFIED_LABELS[i % VERIFIED_LABELS.length];

    return {
        id: i + 1,
        name,
        countryFlag: flag,
        verifiedLabel,
        verifiedBadge: badge,
        avatarGradient: { a, b },
        message: `“${message}”`,
        amount: AMOUNT,
        dateText,
    };
});

