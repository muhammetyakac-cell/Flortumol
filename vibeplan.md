# 🎯 Flortumol → Vibe‑Coding & Modernizasyon Yol Haritası

Bu doküman, **vibe‑coding** yaklaşımına uygun, kod tabanınızı modern, sürdürülebilir ve SEO‑odaklı bir yapıya taşıyacak adımları içerir. Her aşama amaç, görev, fayda ve yaklaşık süresiyle birlikte listelenmiştir.

---

## 1️⃣ Temeller – Stabilite & Geleceğe Hazırlık

| Hedef | İşlemler | Neden Önemli? | Yaklaşık Süre |
|------|----------|----------------|---------------|
| **Tip güvenliği & lint** | • Projeyi **TypeScript**'e kademeli geçiş (`.tsx` dosyaları).<br>• **ESLint + Prettier** kurulumu (`eslint-config-prettier`, `eslint-plugin-react`, `eslint-plugin-react-hooks`).<br>• `no‑any`, `strictNullChecks`, `noUnusedLocals` gibi kurallar etkin. | Çalışma zamanı hatalarını önler, IDE desteği artırır, refactor güvenliğini sağlar. | 2 gün |
| **Test altyapısı** | • **Vitest** ile birim testleri.<br>• **React Testing Library** ile komponent testleri.<br>• **Cypress** (veya Playwright) ile uç‑uç (E2E) testleri (login → sohbet akışı). | Geri dönüşsüz hataları erken yakalar, yeni özellik eklerken güven verir. | 3 gün |
| **CI/CD** | • GitHub Actions iş akışı: lint → type‑check → test → build.<br>• Vercel preview‑deploy entegrasyonu (branch‑bazlı). | Her PR’in sağlam olduğunu garantiler, otomatik dağıtım. | 1 gün |
| **Kod kalitesi** | • `src/App.jsx`'i **özellik klasörlerine** böl (`pages/`, `components/`, `hooks/`).<br>• Ortak mantığı **custom hook** (`useSupabase`, `useAuth`, `useToast`) haline getir. | Tekrarları azaltır, okunabilirliği artırır, yeni ekip üyeleri daha hızlı adapte olur. | 4 gün |

---

## 2️⃣ UI / Tasarım Sistemi – "Vibe" Katmanı

| Hedef | İşlemler | Sonuç |
|------|----------|-------|
| **Tasarım tokenları** | Tailwind `tailwind.config.js` dosyasına renk, spacing, `--brand` CSS değişkenleri ekle. | Tek bir yerden tema kontrolü, dark‑mode kolaylığı. |
| **Bileşen kütüphanesi** | `/src/ui` içinde atomik bileşenler: `Button`, `Card`, `Input`, `Modal`, `Tooltip`, `Avatar`.<br>**Storybook** kur ve her bileşeni dokümante et. | Tekrar kullanılabilir, test edilebilir UI parçaları. |
| **Responsive tasarım** | Tailwind responsive sınıfları (`sm:`, `md:` vb.) ile layout’ları oluştur. Lighthouse mobil puanlarını `90+` hedefle. | Mobil uyumlu, düşük CLS. |
| **Mikro‑etkileşimler** | **Framer Motion** ile giriş‑çıkış animasyonları, kart hover vs. <br>`useReducedMotion` ile erişilebilir fallback. | Modern, akıcı his. |
| **Erişilebilirlik** | `eslint-plugin-jsx-a11y` ve **axe** ile denetim.<br>Odak göstergeleri, `aria‑label` ve `alt` metinleri ekle. | WCAG 2.1 AA uyumu, SEO sinyali. |
| **Güvenli HTML** | `dangerouslySetInnerHTML` kullanan yerleri **DOMPurify** ile temizle (whitelist). | XSS riski ortadan kalkar. |

---

## 3️⃣ Veri & API Katmanı – Temiz Supabase Entegrasyonu

| Hedef | İşlemler | Fayda |
|------|----------|-------|
| **SupabaseProvider** | `createClient`'ı tek bir kez çalıştıran React Context. `useSupabase` hook’u ile her bileşen erişebilir. | Tekil client, testlerde mock kolaylığı. |
| **Typed RPC wrapper** | `member_sign_in`, `member_sign_up`, `admin_upsert_thread_quick_facts` için tip‑güvenli fonksiyonlar (`src/api/`). | RPC çağrıları tutarlı, otomatik dokümantasyon. |
| **TanStack Query** | Veri çekimlerini `useQuery`/`useInfiniteQuery` ile sarmala. Cache, background refetch ve hata toastları otomatik. | Az code, daha iyi UX. |
| **Sayfalama** | Blog ve şehir listeleri için **cursor‑based pagination** (cursor → `limit`, `page`). `useInfiniteQuery` ile sonsuz kaydırma. | Büyük veri setlerinde ağır istemci yükünü önler. |
| **Realtime iyileştirme** | Yayında sadece `member_profiles`, `messages`, `typing_states` kalır (diğerleri kaldırıldı). <br>Typing events için **throttle** ekle. | Bant genişliği ve mobil pil tüketimi azalır. |

---

## 4️⃣ SEO & Performans – Server‑Side Rendering (SSR) & Optimisation

| Hedef | İşlemler | Etki |
|------|----------|------|
| **SSR** | **Seçenek A:** Vite‑SSR ile Landing, Blog listesi, Şehir sayfalarını sunucu tarafında render et. <br>**Seçenek B:** Tam geçiş **Next.js 14 (app router)** – otomatik statik üretim, image‑opt, route‑level data fetch. | Arama motorları tam render alır → sıralama artar, Core‑Web‑Vitals yükselir. |
| **Görsel optimizasyonu** | `next/image` (Next) ya da `vite-plugin-imagemin` (Vite) kullan. WebP üret, `font-display: swap`. | LCP düşer, veri tüketimi azalır. |
| **Critical CSS & Font** | Above‑the‑fold Tailwind sınıflarını inline (Vite‑SSR) ya da `critical-css-webpack-plugin`. | İlk boya daha hızlı. |
| **Cache‑Control** | Statik dosyalar için `Cache‑Control: max-age=31536000, immutable`. Vercel Edge‑caching etkinleştir. | Tekrarlanan ziyaretlerde neredeyse **0 ms**. |
| **Structured‑data** | Schema.org jeneratörlerini `src/schema` içinde tek bir modüle taşı. CI’da **json‑ld validator** çalıştır. | Rich results hatasız, SERP görünürlüğü artar. |
| **Performans bütçesi** | Lighthouse bütçeleri (TTI < 3 s, TBT < 300 ms) CI’da zorunlu. | Büyüyen kodda performans kaybı önlenir. |

---

## 5️⃣ Özellik Katmanı – “Vibe” Geliştirmeleri

| Özellik | Kısa Açıklama | Vibe Katkısı |
|----------|---------------|--------------|
| **Hero Canvas → CSS‑Only** | Three.js yerine gradient + animasyonlu SVG hero. | Bundle ~870 KB azalır, hâlâ dinamik görünüm. |
| **Referral / Davet Sistemi** | `members` tablosuna `referral_code` ekle. `?ref=` URL ile yeni kayıt olan kullanıcıya hem davet eden, hem davet edilen **coin** verir. “Paylaş” butonu + QR‑code. | Viral büyüme, sosyal paylaşım kolaylığı. |
| **WhatsApp & Sosyal Paylaşım** | `react-share` ile blog/ profil sayfalarına WhatsApp, Twitter, Facebook butonları. Kısa link (`shrtco.de` API) kullan. | Tek tıkla paylaşım → trafik artışı. |
| **Onboarding turu** | Kayıt sonrası 3‑adımlı rehber (`react‑joyride`/`intro.js`). Profil fotoğrafı, ilgi alanları, ilk sohbet. | Kullanıcı kayıpsızlığı düşer. |
| **Uygulama içi coin mağazası** | Stripe Checkout’u modal içinde aç. Ödeme sonrası `member_profiles.coin_balance` güncellemesi **optimistic UI** ile. | Kesintisiz satın alma deneyimi. |
| **Dark‑Mode teması** | CSS‑variable + `useTheme` hook’u. Kullanıcı tercihi `localStorage` + Supabase `profiles.theme` alanına senkronize. | Modern, kişiselleştirilebilir görünüm. |
| **Component‑driven Docs** | Storybook’u **Vercel** üzerinde yayınla (`https://flortumol.design`). Tasarım‑geliştirici iş birliği güçlenir. | Tasarım tutarlılığı, hızlı prototip. |

---

## 6️⃣ İzleme, Analitik & Gözlemleme

| Araç | Kullanım | Açıklama |
|------|----------|----------|
| **Sentry** (frontend) | `@sentry/react` entegrasyonu. Unhandled promise ve render hatalarını yakalar. | Hata anında Slack/Email bildirimi. |
| **Vercel Analytics** | Sayfa performans metrikleri (LCP, FID, CLS). | Gerçek‑zamanlı performans takibi. |
| **Google Analytics 4** | Event‑tabanlı: `signup`, `first_message`, `coin_purchase`. | Dönüşüm hunisi ölçümü. |
| **Feature‑flags** | `app_metadata.feature_flags` (Supabase) ile basit toggle sistemi. | Yeni özellikleri kod deploy etmeden aç/kapat. |
| **Supabase audit‑log** | Logları Slack webhook ile yönlendir. | Güvenlik olayları anında fark edilir. |

---

## 7️⃣ Zaman Çizelgesi (Sprint Önerisi)

| Sprint | Odak | Çıktılar |
|--------|------|----------|
| **Sprint 1 (1 hafta)** | Temeller – TS, lint, CI, test altyapısı. | Repo TypeScript‑hazır, CI geçiyor. |
| **Sprint 2 (1 hafta)** | UI – component library, Storybook, tema tokenları. | `src/ui` bileşenleri, Storybook canlı. |
| **Sprint 3 (1 hafta)** | Veri – SupabaseProvider, typed RPC, TanStack Query. | Tek client, tip‑güvenli API, cache‑li veri. |
| **Sprint 4 (1 hafta)** | SEO/Perf – Vite‑SSR pilot (Landing) + image‑opt. | Lighthouse > 90, SSR ile tam HTML. |
| **Sprint 5 (1 hafta)** | Vibe özellikleri – CSS‑hero, referral link, onboarding turu. | Yeni hero, davet sistemi UI, rehber. |
| **Sprint 6 (1 hafta)** | İzleme & polish – Sentry, GA4, feature‑flags, final audit. | Hata takibi, analytics, flag‑yönetimi. |
| **Sprint 7 (opsiyonel)** | **Tam Next.js** geçiş (eğer SEO kazancı gerekliyse). | Tüm sayfalar Next app router’da, otomatik ISR. |

---

## 📦 Hemen Başlamak İçin
1. `tsconfig.json` ve `eslint` ayarlarını oluştur, `npm i -D typescript eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks` çalıştır.
2. `src/ui/Button.tsx` gibi bir bileşen yarat, Storybook kur (`npx sb init`).
3. `src/context/SupabaseProvider.tsx` ekle, `useSupabase` hook’u oluştur.
4. Landing sayfasını **Vite‑SSR** ile dene (`npm run dev` ve `vercel dev`).
5. Yukarıdaki adımları sırayla tamamlayarak roadmap’i ilerlet.

---

**Bu plan, kod kalitesini, performansı ve kullanıcı deneyimini aynı anda yükseltirken, SEO odaklı modern bir “vibe” hissi yaratır.**

*İyi çalışmalar! 🚀*