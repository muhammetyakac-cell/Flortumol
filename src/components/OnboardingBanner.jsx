export default function OnboardingBanner({ onboardingState, setUserView }) {
  if (onboardingState.completed) return null;

  return (
    <div className="bg-amber-100 border-b border-amber-200 px-6 py-3">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
         <div>
          <p className="font-bold text-amber-900">Hoş geldin! Profilini tamamla ({onboardingState.currentStep}/3)</p>
          <p className="text-sm text-amber-800">Fotoğraf ekle, hobilerini gir ve eşleşmelere başla.</p>
        </div>
        <button onClick={() => setUserView((!onboardingState.hasPhoto || !onboardingState.hasHobbies) ? 'profile' : 'discover')} className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm">
          Adımı Tamamla
        </button>
      </div>
    </div>
  );
}
