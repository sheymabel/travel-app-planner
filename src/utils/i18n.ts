import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      favourites: "Favorites",
      downloads: "Downloads",
      languages: "Languages",
      location: "Location",
      logOut: "Log Out",
      editProfile: "Edit Profile",
      appVersion: "Version",
      selectLanguage: "Select Language",
      close: "Close",
      yourFavourites: "Your Favorites",
      noFavourites: "No favorites found",
      yourDownloads: "Your Downloads",
      noDownloads: "No downloads",
      locationSettings: "Location Settings",
      currentLocation: "Current Location",
      notSet: "Not set",
      error: "Error",
      dataLoadError: "Failed to load data",
      defaultBusinessName: "Business Name",
      defaultName: "Anonymous",
      defaultEmail: "No email"
    }
  },
  fr: {
    translation: {
      // Ajoutez les traductions françaises ici
    }
  },
  ar: {
    translation: {
      // Ajoutez les traductions arabes ici
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;