import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      nav_home: 'Home',
      nav_about: 'About',
      nav_services: 'Services',
      nav_blog: 'Blog',
      nav_events: 'Events',
      nav_gallery: 'Gallery',
      nav_quiz: 'Quiz',
      nav_contact: 'Contact',
      nav_signin: 'Sign in',
      nav_signout: 'Sign out',
      nav_book: 'Book Now',
      nav_my_appointments: 'My Appointments',
      nav_dashboard: 'Admin Dashboard',

      hero_title: 'Empowering Lives, Guiding Futures',
      hero_sub: 'Pathfinder provides professional psychological counseling, career guidance, and anxiety-relief workshops for students and families in Lucknow.',
      hero_cta_book: 'Book Counseling Session',
      hero_cta_about: 'Learn More',

      services_title: 'Our Counseling Packages',
      services_sub: 'Select a specialized mental wellness or career orientation service built to address your goals.',
      
      faq_title: 'Frequently Asked Questions',
      faq_sub: 'Find answers about our NGO counseling, online availability, and scheduling details.',
    }
  },
  hi: {
    translation: {
      nav_home: 'मुख्य पृष्ठ',
      nav_about: 'हमारे बारे में',
      nav_services: 'सेवाएं',
      nav_blog: 'ब्लॉग',
      nav_events: 'कार्यक्रम',
      nav_gallery: 'गैलरी',
      nav_quiz: 'क्विज़',
      nav_contact: 'संपर्क करें',
      nav_signin: 'लॉग इन करें',
      nav_signout: 'लॉग आउट',
      nav_book: 'बुक करें',
      nav_my_appointments: 'मेरे अपॉइंटमेंट',
      nav_dashboard: 'व्यवस्थापक डैशबोर्ड',

      hero_title: 'जीवन को सशक्त बनाना, भविष्य को संवारना',
      hero_sub: 'पाथफाइंडर लखनऊ में छात्रों और परिवारों के लिए पेशेवर मनोवैज्ञानिक परामर्श, करियर मार्गदर्शन और तनाव-मुक्ति कार्यशालाएं प्रदान करता है।',
      hero_cta_book: 'परामर्श सत्र बुक करें',
      hero_cta_about: 'अधिक जानें',

      services_title: 'हमारे परामर्श पैकेज',
      services_sub: 'अपनी प्राथमिकताओं और मानसिक कल्याण या करियर दिशा के लिए एक विशेष सेवा चुनें।',

      faq_title: 'अक्सर पूछे जाने वाले प्रश्न',
      faq_sub: 'हमारे एनजीओ परामर्श, ऑनलाइन सत्र और समय निर्धारण विवरण के बारे में उत्तर खोजें।',
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  })

export default i18n
