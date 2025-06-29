// Configuración de zona horaria para Argentina
// Este archivo contiene utilidades para manejar horarios en GMT-3

export const TIMEZONE_CONFIG = {
  // Zona horaria principal
  timezone: 'America/Argentina/Buenos_Aires',
  gmtOffset: -3,
  name: 'Argentina',
  shortName: 'ART',
  
  // Ciudades en la misma zona horaria
  cities: [
    'Buenos Aires 🇦🇷',
    'Montevideo 🇺🇾', 
    'Santiago 🇨🇱',
    'São Paulo 🇧🇷'
  ],

  // Conversiones para otros países
  conversions: {
    'Colombia/Ecuador': { offset: -2, emoji: '🇨🇴🇪🇨' },
    'México': { offset: -3, emoji: '🇲🇽' },
    'Venezuela': { offset: -1, emoji: '🇻🇪' },
    'España': { offset: +4, emoji: '🇪🇸' },
    'Miami': { offset: -1, emoji: '🇺🇸' },
    'Nueva York': { offset: -1, emoji: '🇺🇸' }
  }
};

// Función para convertir hora de Argentina a otra zona horaria
export const convertFromArgentina = (time, targetTimezone) => {
  const conversion = TIMEZONE_CONFIG.conversions[targetTimezone];
  if (!conversion) return time;
  
  const [hours, minutes] = time.split(':').map(Number);
  const convertedHours = hours + conversion.offset;
  
  // Manejar casos de cambio de día
  if (convertedHours < 0) {
    return `${24 + convertedHours}:${minutes.toString().padStart(2, '0')} (día anterior)`;
  } else if (convertedHours >= 24) {
    return `${convertedHours - 24}:${minutes.toString().padStart(2, '0')} (día siguiente)`;
  }
  
  return `${convertedHours}:${minutes.toString().padStart(2, '0')}`;
};

// Función para generar URL de Google Calendar con zona horaria de Argentina
export const generateGoogleCalendarUrl = (event) => {
  const startDate = new Date(`${event.date}T${event.time}:00-03:00`);
  const endDate = new Date(startDate.getTime() + (event.duration * 60 * 60 * 1000));
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    details: `${event.description}\n\nInstructor: ${event.instructor}\nPlataforma: ${event.platform}`,
    ctz: TIMEZONE_CONFIG.timezone,
    // Agregar al calendario específico de DevOps
    src: '69e0096b8ebf5cfa5db7f7f4c934fc0ea8e33cf715468e1cabb857fbe012c798@group.calendar.google.com'
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// URL del calendario público para referencias directas
export const PUBLIC_CALENDAR_URL = 'https://calendar.google.com/calendar/embed?src=69e0096b8ebf5cfa5db7f7f4c934fc0ea8e33cf715468e1cabb857fbe012c798%40group.calendar.google.com&ctz=America%2FArgentina%2FBuenos_Aires';

// Horarios sugeridos para eventos (en hora de Argentina)
export const SUGGESTED_TIMES = {
  weekday: {
    morning: ['09:00', '10:00', '11:00'],
    afternoon: ['14:00', '15:00', '16:00'],
    evening: ['18:00', '19:00', '20:00']
  },
  weekend: {
    morning: ['10:00', '11:00'],
    afternoon: ['14:00', '15:00', '16:00', '17:00'],
    evening: ['18:00', '19:00']
  }
};

export default TIMEZONE_CONFIG;
