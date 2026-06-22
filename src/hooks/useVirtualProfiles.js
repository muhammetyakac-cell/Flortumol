import { useState } from 'react';
import { supabase } from '../supabase';
import { initialProfile, getRandomItem } from '../appConstants';

const FEMALE_NAMES = ['Alara','Asya','Defne','Nehir','Derin','Lina','Mira','Arya','Ela','Ada','Duru','Elif','Zeynep','Eylül','İdil','İpek','Mina','Nisa','Sude','Su','Beren','Naz','Aylin','Yaren','Lara','Selin','Melis','Ayşe','Buse','Ceren','Yasemin','Sena','Gizem','Selen','Nehir','Yelda','Esila','İrem','Tuana','Merve','Hilal','Nisanur','Ece','Nazlı','Güneş','Ecrin','Hazal','Helin','Sıla','Berfin','Damla','Sinem','Yağmur','Derya','Pelin','Cansu','Gökçe','Deniz','Meryem','Beste','Aden','Alina','Maya','Sahara','Lavin','Lavinya','Rüya','Nehirsu','Miray','Sahra','Mina','Nehirnaz','Aysu','Melisa','Zümra','Ecrinsu','Asel','Rabia','Nursena','Pınar','Leman','Öykü','Çağla','Açelya','Irmak','Ahu','Nehircan','Beliz','Elvan','Ayça','Mislina','Mislinay','Aren','Arven','Helia','Hira','Yüsra','Elisa','Liya','Mona','Noa','Talia'];
const CITY_LIST = ['İstanbul','Ankara','İzmir','Bursa','Antalya','Eskişehir','Muğla','Mersin','Adana','Konya','Samsun','Trabzon','Gaziantep','Kayseri','Kocaeli','Tekirdağ','Çanakkale','Aydın','Balıkesir','Denizli','Sakarya','Hatay','Manisa','Edirne','Bolu','Kırklareli','Sinop','Rize','Giresun','Ordu'];
const PRIORITY_CITY_LIST = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Şanlıurfa', 'Kocaeli'];

function buildRandomVirtualProfile() {
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

export default function useVirtualProfiles({ setStatus, selectRows, fetchIncomingThreads, selectedProfileId, setSelectedProfileId }) {
  const [virtualProfiles, setVirtualProfiles] = useState([]);
  const [profileForm, setProfileForm] = useState(initialProfile);

  function fillRandomVirtualProfile() {
    setProfileForm((prev) => ({ ...prev, ...buildRandomVirtualProfile() }));
  }

  async function fetchVirtualProfiles() {
    try {
      const data = await selectRows('virtual_profiles', (q) => q.order('created_at', { ascending: true }));
      setVirtualProfiles(data || []);
      if (!selectedProfileId && data?.length) setSelectedProfileId(data[0].id);
    } catch (error) { setStatus(error.message); }
  }

  async function createVirtualProfile() {
    const auto = buildRandomVirtualProfile();
    const payload = {
      name: profileForm.name || auto.name, age: Number(profileForm.age || auto.age), city: profileForm.city || auto.city, gender: profileForm.gender || 'Kadın', hobbies: profileForm.hobbies || auto.hobbies, photo_url: profileForm.photo_url,
    };
    if (!payload.photo_url) return setStatus('Fotoğraf yükleyip Kaydet tuşuna bas.');

    let { error } = await supabase.from('virtual_profiles').insert(payload);
    if (error?.message?.includes("Could not find the 'photo_url' column")) {
      const retry = await supabase.from('virtual_profiles').insert({ name: payload.name, age: payload.age, city: payload.city, gender: payload.gender, hobbies: payload.hobbies });
      error = retry.error;
    }
    if (error) return setStatus(error.message);
    setProfileForm(initialProfile);
    fetchVirtualProfiles();
    if (fetchIncomingThreads) fetchIncomingThreads();
    setStatus(`Sanal profil oluşturuldu: ${payload.name}`);
  }

  return {
    virtualProfiles, setVirtualProfiles,
    profileForm, setProfileForm,
    fetchVirtualProfiles, createVirtualProfile,
    fillRandomVirtualProfile,
  };
}
