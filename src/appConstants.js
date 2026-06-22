import { hashToInt } from './helpers';

const NAME_SEEDS = [
  'Alara','Asya','Defne','Nehir','Derin','Lina','Mira','Arya','Ela','Ada','Duru','Elif','Zeynep','Eylül','İdil','İpek','Mina','Nisa','Sude','Su','Beren','Naz','Aylin','Yaren','Lara','Selin','Melis','Ayşe','Buse','Ceren','Yasemin','Sena','Gizem','Selen','Nehir','Yelda','Esila','İrem','Tuana','Merve','Hilal','Nisanur','Ece','Nazlı','Güneş','Ecrin','Hazal','Helin','Sıla','Berfin','Damla','Sinem','Yağmur','Derya','Pelin','Cansu','Gökçe','Deniz','Meryem','Beste','Aden','Alina','Maya','Sahara','Lavin','Lavinya','Rüya','Nehirsu','Miray','Sahra','Mina','Nehirnaz','Aysu','Melisa','Zümra','Ecrinsu','Asel','Rabia','Nursena','Pınar','Leman','Öykü','Çağla','Açelya','Irmak','Ahu','Nehircan','Beliz','Elvan','Ayça','Mislina','Mislinay','Aren','Arven','Helia','Hira','Yüsra','Elisa','Liya','Mona','Noa','Talia'
];
const NAME_SUFFIXES = ['', ' Nur', ' Su', ' Naz', ' Ada'];
export const FEMALE_NAMES = Array.from(new Set(NAME_SEEDS.flatMap((seed) => NAME_SUFFIXES.map((s) => `${seed}${s}`)))).slice(0, 250);
export const CITY_LIST = ['İstanbul','Ankara','İzmir','Bursa','Antalya','Eskişehir','Muğla','Mersin','Adana','Konya','Samsun','Trabzon','Gaziantep','Kayseri','Kocaeli','Tekirdağ','Çanakkale','Aydın','Balıkesir','Denizli','Sakarya','Hatay','Manisa','Edirne','Bolu','Kırklareli','Sinop','Rize','Giresun','Ordu'];
export const PRIORITY_CITY_LIST = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Şanlıurfa', 'Kocaeli'];
export const QUICK_REPLIES = ['Merhaba! 🌸', 'Naber, günün nasıl geçti?', 'Fotoğrafın çok güzel 😍', 'Kahve içelim mi? ☕'];
export const THREAD_TAGS = ['sicak_lead', 'soguk', 'takip_edilecek'];
export const BULK_TEMPLATES = ['Merhaba! 👋', 'Naber, günün nasıl?', 'Müsaitsen yaz ✨'];
export const LIST_BATCH_SIZE = 8;
export const USER_CHAT_VISIBLE_PROFILE_COUNT = 7;
export const COIN_COST_PER_MESSAGE = 20;
export const TEST_CONTACT_NUMBER = '5552083092';
export const DEFAULT_CHECKOUT_ENDPOINT = '/api/create-checkout-session';
export const initialProfile = { name: '', age: '', city: '', gender: '', hobbies: '', photo_url: '' };
export const initialMemberProfile = { age: '', hobbies: '', city: '', photo_url: '', status_emoji: '🙂', coin_balance: 100, contact_phone: '' };

export function threadKey(memberId, profileId) {
  return `${memberId}::${profileId}`;
}

export function resolveCheckoutEndpoint(endpoint) {
  const raw = String(endpoint || '').trim();
  if (!raw) return DEFAULT_CHECKOUT_ENDPOINT;
  return raw;
}

export function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildRandomVirtualProfile() {
  const fallbackCities = CITY_LIST.filter((city) => !PRIORITY_CITY_LIST.includes(city));
  const weightedCities = [
    ...Array.from({ length: 7 }, () => PRIORITY_CITY_LIST).flat(),
    ...fallbackCities,
  ];
  return {
    name: getRandomItem(FEMALE_NAMES),
    age: String(Math.floor(Math.random() * 14) + 20),
    city: getRandomItem(weightedCities),
    gender: 'Kadın',
    hobbies: getRandomItem(['Kahve, seyahat, müzik','Yoga, kitap, yürüyüş','Sinema, fotoğraf, dans','Pilates, moda, sanat','Doğa, kamp, paten']),
  };
}

export function pctChange(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getAudioUrl(content) {
  const clean = (content || '').trim();
  if (!clean) return null;
  if (clean.startsWith('audio:')) return clean.replace('audio:', '').trim();
  if (/^https?:\/\/.+\.(mp3|wav|m4a|ogg)(\?.*)?$/i.test(clean)) return clean;
  return null;
}

export function autoResizeTextarea(el, maxHeight = 220) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
}

export function buildStatsSnapshot(messages = [], members = []) {
  const memberMessages = messages.filter((m) => m.sender_role === 'member');
  const adminReplies = messages.filter((m) => m.sender_role === 'virtual');
  const activeThreadKeys = new Set(messages.map((m) => `${m.member_id}::${m.virtual_profile_id}`));
  const respondedThreadKeys = new Set();
  const responseMinutes = [];

  const grouped = new Map();
  messages.forEach((m) => {
    const key = `${m.member_id}::${m.virtual_profile_id}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(m);
  });

  grouped.forEach((rows) => {
    rows.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    let lastMemberTs = null;
    rows.forEach((row) => {
      if (row.sender_role === 'member') lastMemberTs = row.created_at;
      else if (row.sender_role === 'virtual' && lastMemberTs) {
        respondedThreadKeys.add(key);
        const diffMin = (new Date(row.created_at).getTime() - new Date(lastMemberTs).getTime()) / 60000;
        if (diffMin >= 0) responseMinutes.push(diffMin);
        lastMemberTs = null;
      }
    });
  });

  return {
    totalMessagesToday: messages.length,
    memberMessagesToday: memberMessages.length,
    adminRepliesToday: adminReplies.length,
    respondedThreadsToday: respondedThreadKeys.size,
    newMembersToday: members.length,
    activeThreadsToday: activeThreadKeys.size,
    avgResponseMinToday: responseMinutes.length ? responseMinutes.reduce((a, b) => a + b, 0) / responseMinutes.length : 0,
  };
}

export function buildHourlyOnlineMap(profiles, hourKey) {
  const map = {};
  const list = profiles || [];
  if (!list.length) return map;
  const targetOnlineCount = Math.min(list.length, Math.floor(list.length / 2) + 5);
  const ranked = [...list]
    .map((profile) => ({ id: profile.id, score: hashToInt(`${hourKey}-${profile.id}`) }))
    .sort((a, b) => a.score - b.score);
  ranked.forEach((item, index) => { map[item.id] = index < targetOnlineCount; });
  return map;
}
