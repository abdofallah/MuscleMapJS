/**
 * MuscleMapJS — Internationalization (i18n)
 * Ported from MuscleMap SwiftUI SDK Localizable.strings files.
 * 
 * Supports all 11 locales from the original Swift SDK.
 */
import type { Muscle } from '../types';

/** Supported locale codes. */
export type Locale = 'en' | 'ar' | 'de' | 'es' | 'fr' | 'ja' | 'ko' | 'pt-BR' | 'ru' | 'tr' | 'zh-Hans';

/** All muscle display names per locale. */
const LOCALES: Record<Locale, Record<Muscle, string>> = {
  en: {
    'abs': 'Abs', 'adductors': 'Adductors', 'ankles': 'Ankles', 'biceps': 'Biceps',
    'calves': 'Calves', 'chest': 'Chest', 'deltoids': 'Deltoids', 'feet': 'Feet',
    'forearm': 'Forearm', 'gluteal': 'Gluteal', 'hamstring': 'Hamstring', 'hands': 'Hands',
    'head': 'Head', 'knees': 'Knees', 'lower-back': 'Lower Back', 'neck': 'Neck',
    'obliques': 'Obliques', 'quadriceps': 'Quadriceps', 'tibialis': 'Tibialis',
    'trapezius': 'Trapezius', 'triceps': 'Triceps', 'upper-back': 'Upper Back',
    'rotator-cuff': 'Rotator Cuff', 'hip-flexors': 'Hip Flexors', 'serratus': 'Serratus',
    'rhomboids': 'Rhomboids', 'upper-chest': 'Upper Chest', 'lower-chest': 'Lower Chest',
    'inner-quad': 'Inner Quad', 'outer-quad': 'Outer Quad', 'upper-abs': 'Upper Abs',
    'lower-abs': 'Lower Abs', 'front-deltoid': 'Front Deltoid', 'rear-deltoid': 'Rear Deltoid',
    'upper-trapezius': 'Upper Trapezius', 'lower-trapezius': 'Lower Trapezius',
  },
  ar: {
    'abs': 'عضلات البطن', 'adductors': 'العضلات المقربة', 'ankles': 'الكاحلان', 'biceps': 'العضلة ذات الرأسين',
    'calves': 'ربلة الساق', 'chest': 'الصدر', 'deltoids': 'الدالية', 'feet': 'القدمان',
    'forearm': 'الساعد', 'gluteal': 'الأرداف', 'hamstring': 'أوتار الركبة', 'hands': 'اليدان',
    'head': 'الرأس', 'knees': 'الركبتان', 'lower-back': 'أسفل الظهر', 'neck': 'الرقبة',
    'obliques': 'المائلة', 'quadriceps': 'عضلات الفخذ الأمامية', 'tibialis': 'القصبة',
    'trapezius': 'شبه المنحرفة', 'triceps': 'العضلة ثلاثية الرؤوس', 'upper-back': 'أعلى الظهر',
    'rotator-cuff': 'الكفة المدورة', 'hip-flexors': 'ثنيات الورك', 'serratus': 'المنشارية',
    'rhomboids': 'المعينية', 'upper-chest': 'أعلى الصدر', 'lower-chest': 'أسفل الصدر',
    'inner-quad': 'الفخذ الداخلي', 'outer-quad': 'الفخذ الخارجي', 'upper-abs': 'البطن العلوية',
    'lower-abs': 'البطن السفلية', 'front-deltoid': 'الدالية الأمامية', 'rear-deltoid': 'الدالية الخلفية',
    'upper-trapezius': 'شبه المنحرفة العلوية', 'lower-trapezius': 'شبه المنحرفة السفلية',
  },
  de: {
    'abs': 'Bauchmuskeln', 'adductors': 'Adduktoren', 'ankles': 'Knöchel', 'biceps': 'Bizeps',
    'calves': 'Waden', 'chest': 'Brust', 'deltoids': 'Deltamuskeln', 'feet': 'Füße',
    'forearm': 'Unterarm', 'gluteal': 'Gesäßmuskeln', 'hamstring': 'Oberschenkelrückseite', 'hands': 'Hände',
    'head': 'Kopf', 'knees': 'Knie', 'lower-back': 'Unterer Rücken', 'neck': 'Nacken',
    'obliques': 'Schräge Bauchmuskeln', 'quadriceps': 'Quadrizeps', 'tibialis': 'Schienbeinmuskel',
    'trapezius': 'Trapezmuskel', 'triceps': 'Trizeps', 'upper-back': 'Oberer Rücken',
    'rotator-cuff': 'Rotatorenmanschette', 'hip-flexors': 'Hüftbeuger', 'serratus': 'Sägemuskel',
    'rhomboids': 'Rautenmuskeln', 'upper-chest': 'Obere Brust', 'lower-chest': 'Untere Brust',
    'inner-quad': 'Innerer Quadrizeps', 'outer-quad': 'Äußerer Quadrizeps', 'upper-abs': 'Obere Bauchmuskeln',
    'lower-abs': 'Untere Bauchmuskeln', 'front-deltoid': 'Vorderer Deltamuskel', 'rear-deltoid': 'Hinterer Deltamuskel',
    'upper-trapezius': 'Oberer Trapezmuskel', 'lower-trapezius': 'Unterer Trapezmuskel',
  },
  es: {
    'abs': 'Abdominales', 'adductors': 'Aductores', 'ankles': 'Tobillos', 'biceps': 'Bíceps',
    'calves': 'Pantorrillas', 'chest': 'Pecho', 'deltoids': 'Deltoides', 'feet': 'Pies',
    'forearm': 'Antebrazo', 'gluteal': 'Glúteos', 'hamstring': 'Isquiotibiales', 'hands': 'Manos',
    'head': 'Cabeza', 'knees': 'Rodillas', 'lower-back': 'Espalda Baja', 'neck': 'Cuello',
    'obliques': 'Oblicuos', 'quadriceps': 'Cuádriceps', 'tibialis': 'Tibial',
    'trapezius': 'Trapecio', 'triceps': 'Tríceps', 'upper-back': 'Espalda Alta',
    'rotator-cuff': 'Manguito Rotador', 'hip-flexors': 'Flexores de Cadera', 'serratus': 'Serrato',
    'rhomboids': 'Romboides', 'upper-chest': 'Pecho Superior', 'lower-chest': 'Pecho Inferior',
    'inner-quad': 'Cuádriceps Interno', 'outer-quad': 'Cuádriceps Externo', 'upper-abs': 'Abdominales Superiores',
    'lower-abs': 'Abdominales Inferiores', 'front-deltoid': 'Deltoides Anterior', 'rear-deltoid': 'Deltoides Posterior',
    'upper-trapezius': 'Trapecio Superior', 'lower-trapezius': 'Trapecio Inferior',
  },
  fr: {
    'abs': 'Abdominaux', 'adductors': 'Adducteurs', 'ankles': 'Chevilles', 'biceps': 'Biceps',
    'calves': 'Mollets', 'chest': 'Poitrine', 'deltoids': 'Deltoïdes', 'feet': 'Pieds',
    'forearm': 'Avant-bras', 'gluteal': 'Fessiers', 'hamstring': 'Ischio-jambiers', 'hands': 'Mains',
    'head': 'Tête', 'knees': 'Genoux', 'lower-back': 'Bas du Dos', 'neck': 'Cou',
    'obliques': 'Obliques', 'quadriceps': 'Quadriceps', 'tibialis': 'Tibial',
    'trapezius': 'Trapèze', 'triceps': 'Triceps', 'upper-back': 'Haut du Dos',
    'rotator-cuff': 'Coiffe des Rotateurs', 'hip-flexors': 'Fléchisseurs de Hanche', 'serratus': 'Dentelé',
    'rhomboids': 'Rhomboïdes', 'upper-chest': 'Poitrine Haute', 'lower-chest': 'Poitrine Basse',
    'inner-quad': 'Quadriceps Interne', 'outer-quad': 'Quadriceps Externe', 'upper-abs': 'Abdominaux Supérieurs',
    'lower-abs': 'Abdominaux Inférieurs', 'front-deltoid': 'Deltoïde Antérieur', 'rear-deltoid': 'Deltoïde Postérieur',
    'upper-trapezius': 'Trapèze Supérieur', 'lower-trapezius': 'Trapèze Inférieur',
  },
  ja: {
    'abs': '腹筋', 'adductors': '内転筋', 'ankles': '足首', 'biceps': '上腕二頭筋',
    'calves': 'ふくらはぎ', 'chest': '胸', 'deltoids': '三角筋', 'feet': '足',
    'forearm': '前腕', 'gluteal': '臀筋', 'hamstring': 'ハムストリング', 'hands': '手',
    'head': '頭', 'knees': '膝', 'lower-back': '腰', 'neck': '首',
    'obliques': '腹斜筋', 'quadriceps': '大腿四頭筋', 'tibialis': '前脛骨筋',
    'trapezius': '僧帽筋', 'triceps': '上腕三頭筋', 'upper-back': '上背部',
    'rotator-cuff': '回旋筋腱板', 'hip-flexors': '股関節屈筋', 'serratus': '前鋸筋',
    'rhomboids': '菱形筋', 'upper-chest': '大胸筋上部', 'lower-chest': '大胸筋下部',
    'inner-quad': '内側広筋', 'outer-quad': '外側広筋', 'upper-abs': '上腹部',
    'lower-abs': '下腹部', 'front-deltoid': '三角筋前部', 'rear-deltoid': '三角筋後部',
    'upper-trapezius': '上部僧帽筋', 'lower-trapezius': '下部僧帽筋',
  },
  ko: {
    'abs': '복근', 'adductors': '내전근', 'ankles': '발목', 'biceps': '이두근',
    'calves': '종아리', 'chest': '가슴', 'deltoids': '삼각근', 'feet': '발',
    'forearm': '전완', 'gluteal': '둔근', 'hamstring': '햄스트링', 'hands': '손',
    'head': '머리', 'knees': '무릎', 'lower-back': '하부 등', 'neck': '목',
    'obliques': '복사근', 'quadriceps': '대퇴사두근', 'tibialis': '전경골근',
    'trapezius': '승모근', 'triceps': '삼두근', 'upper-back': '상부 등',
    'rotator-cuff': '회전근개', 'hip-flexors': '고관절 굴근', 'serratus': '전거근',
    'rhomboids': '능형근', 'upper-chest': '상부 가슴', 'lower-chest': '하부 가슴',
    'inner-quad': '내측광근', 'outer-quad': '외측광근', 'upper-abs': '상복부',
    'lower-abs': '하복부', 'front-deltoid': '전면 삼각근', 'rear-deltoid': '후면 삼각근',
    'upper-trapezius': '상부 승모근', 'lower-trapezius': '하부 승모근',
  },
  'pt-BR': {
    'abs': 'Abdominais', 'adductors': 'Adutores', 'ankles': 'Tornozelos', 'biceps': 'Bíceps',
    'calves': 'Panturrilhas', 'chest': 'Peito', 'deltoids': 'Deltoides', 'feet': 'Pés',
    'forearm': 'Antebraço', 'gluteal': 'Glúteos', 'hamstring': 'Posteriores da Coxa', 'hands': 'Mãos',
    'head': 'Cabeça', 'knees': 'Joelhos', 'lower-back': 'Lombar', 'neck': 'Pescoço',
    'obliques': 'Oblíquos', 'quadriceps': 'Quadríceps', 'tibialis': 'Tibial',
    'trapezius': 'Trapézio', 'triceps': 'Tríceps', 'upper-back': 'Costas Superiores',
    'rotator-cuff': 'Manguito Rotador', 'hip-flexors': 'Flexores do Quadril', 'serratus': 'Serrátil',
    'rhomboids': 'Romboides', 'upper-chest': 'Peito Superior', 'lower-chest': 'Peito Inferior',
    'inner-quad': 'Quadríceps Interno', 'outer-quad': 'Quadríceps Externo', 'upper-abs': 'Abdominais Superiores',
    'lower-abs': 'Abdominais Inferiores', 'front-deltoid': 'Deltoide Anterior', 'rear-deltoid': 'Deltoide Posterior',
    'upper-trapezius': 'Trapézio Superior', 'lower-trapezius': 'Trapézio Inferior',
  },
  ru: {
    'abs': 'Пресс', 'adductors': 'Приводящие мышцы', 'ankles': 'Лодыжки', 'biceps': 'Бицепс',
    'calves': 'Икры', 'chest': 'Грудь', 'deltoids': 'Дельтовидные', 'feet': 'Стопы',
    'forearm': 'Предплечье', 'gluteal': 'Ягодичные', 'hamstring': 'Бицепс бедра', 'hands': 'Кисти',
    'head': 'Голова', 'knees': 'Колени', 'lower-back': 'Поясница', 'neck': 'Шея',
    'obliques': 'Косые мышцы', 'quadriceps': 'Квадрицепс', 'tibialis': 'Большеберцовая мышца',
    'trapezius': 'Трапеция', 'triceps': 'Трицепс', 'upper-back': 'Верхняя часть спины',
    'rotator-cuff': 'Ротаторная манжета', 'hip-flexors': 'Сгибатели бедра', 'serratus': 'Зубчатая мышца',
    'rhomboids': 'Ромбовидные', 'upper-chest': 'Верхняя грудь', 'lower-chest': 'Нижняя грудь',
    'inner-quad': 'Внутренний квадрицепс', 'outer-quad': 'Внешний квадрицепс', 'upper-abs': 'Верхний пресс',
    'lower-abs': 'Нижний пресс', 'front-deltoid': 'Передняя дельта', 'rear-deltoid': 'Задняя дельта',
    'upper-trapezius': 'Верхняя трапеция', 'lower-trapezius': 'Нижняя трапеция',
  },
  tr: {
    'abs': 'Karın Kasları', 'adductors': 'Adduktörler', 'ankles': 'Bilekler', 'biceps': 'Biseps',
    'calves': 'Baldırlar', 'chest': 'Göğüs', 'deltoids': 'Deltoidler', 'feet': 'Ayaklar',
    'forearm': 'Ön Kol', 'gluteal': 'Kalça', 'hamstring': 'Arka Bacak', 'hands': 'Eller',
    'head': 'Baş', 'knees': 'Dizler', 'lower-back': 'Bel', 'neck': 'Boyun',
    'obliques': 'Oblikler', 'quadriceps': 'Kuadriseps', 'tibialis': 'Tibialis',
    'trapezius': 'Trapez', 'triceps': 'Triseps', 'upper-back': 'Üst Sırt',
    'rotator-cuff': 'Rotator Kaf', 'hip-flexors': 'Kalça Fleksörleri', 'serratus': 'Serratus',
    'rhomboids': 'Romboidler', 'upper-chest': 'Üst Göğüs', 'lower-chest': 'Alt Göğüs',
    'inner-quad': 'İç Kuadriseps', 'outer-quad': 'Dış Kuadriseps', 'upper-abs': 'Üst Karın',
    'lower-abs': 'Alt Karın', 'front-deltoid': 'Ön Deltoid', 'rear-deltoid': 'Arka Deltoid',
    'upper-trapezius': 'Üst Trapez', 'lower-trapezius': 'Alt Trapez',
  },
  'zh-Hans': {
    'abs': '腹肌', 'adductors': '内收肌', 'ankles': '脚踝', 'biceps': '肱二头肌',
    'calves': '小腿肌', 'chest': '胸部', 'deltoids': '三角肌', 'feet': '足部',
    'forearm': '前臂', 'gluteal': '臀肌', 'hamstring': '腘绳肌', 'hands': '手',
    'head': '头部', 'knees': '膝盖', 'lower-back': '下背', 'neck': '颈部',
    'obliques': '腹斜肌', 'quadriceps': '股四头肌', 'tibialis': '胫骨前肌',
    'trapezius': '斜方肌', 'triceps': '肱三头肌', 'upper-back': '上背',
    'rotator-cuff': '肩袖', 'hip-flexors': '髋屈肌', 'serratus': '前锯肌',
    'rhomboids': '菱形肌', 'upper-chest': '上胸', 'lower-chest': '下胸',
    'inner-quad': '股内侧肌', 'outer-quad': '股外侧肌', 'upper-abs': '上腹',
    'lower-abs': '下腹', 'front-deltoid': '三角肌前束', 'rear-deltoid': '三角肌后束',
    'upper-trapezius': '上斜方肌', 'lower-trapezius': '下斜方肌',
  },
};

/** UI string keys (accessibility, legend labels, etc.). */
const UI_STRINGS: Record<Locale, {
  selected: string;
  notSelected: string;
  hintTap: string;
  hintLongPress: string;
  bodyMap: string;
  legendLow: string;
  legendHigh: string;
  heatmapLegend: string;
}> = {
  en: { selected: 'Selected', notSelected: 'Not selected', hintTap: 'Double tap to select', hintLongPress: 'Long press for details', bodyMap: 'Body muscle map', legendLow: 'Low', legendHigh: 'High', heatmapLegend: 'Heatmap intensity legend' },
  ar: { selected: 'محدد', notSelected: 'غير محدد', hintTap: 'اضغط مرتين للتحديد', hintLongPress: 'اضغط مطولاً للتفاصيل', bodyMap: 'خريطة عضلات الجسم', legendLow: 'منخفض', legendHigh: 'مرتفع', heatmapLegend: 'مقياس الكثافة الحرارية' },
  de: { selected: 'Ausgewählt', notSelected: 'Nicht ausgewählt', hintTap: 'Doppeltippen zum Auswählen', hintLongPress: 'Lange drücken für Details', bodyMap: 'Körpermuskelkarte', legendLow: 'Niedrig', legendHigh: 'Hoch', heatmapLegend: 'Heatmap-Intensitätslegende' },
  es: { selected: 'Seleccionado', notSelected: 'No seleccionado', hintTap: 'Toca dos veces para seleccionar', hintLongPress: 'Mantén presionado para detalles', bodyMap: 'Mapa muscular del cuerpo', legendLow: 'Bajo', legendHigh: 'Alto', heatmapLegend: 'Leyenda de intensidad del mapa de calor' },
  fr: { selected: 'Sélectionné', notSelected: 'Non sélectionné', hintTap: 'Appuyez deux fois pour sélectionner', hintLongPress: 'Appui long pour les détails', bodyMap: 'Carte musculaire du corps', legendLow: 'Faible', legendHigh: 'Élevé', heatmapLegend: 'Légende d\'intensité de la carte thermique' },
  ja: { selected: '選択中', notSelected: '未選択', hintTap: 'ダブルタップで選択', hintLongPress: '長押しで詳細', bodyMap: '身体筋肉マップ', legendLow: '低', legendHigh: '高', heatmapLegend: 'ヒートマップ強度凡例' },
  ko: { selected: '선택됨', notSelected: '선택 안됨', hintTap: '두 번 탭하여 선택', hintLongPress: '길게 눌러 상세 보기', bodyMap: '근육 지도', legendLow: '낮음', legendHigh: '높음', heatmapLegend: '히트맵 강도 범례' },
  'pt-BR': { selected: 'Selecionado', notSelected: 'Não selecionado', hintTap: 'Toque duas vezes para selecionar', hintLongPress: 'Pressione e segure para detalhes', bodyMap: 'Mapa muscular do corpo', legendLow: 'Baixo', legendHigh: 'Alto', heatmapLegend: 'Legenda de intensidade do mapa de calor' },
  ru: { selected: 'Выбрано', notSelected: 'Не выбрано', hintTap: 'Нажмите дважды для выбора', hintLongPress: 'Удерживайте для подробностей', bodyMap: 'Карта мышц тела', legendLow: 'Низко', legendHigh: 'Высоко', heatmapLegend: 'Легенда интенсивности тепловой карты' },
  tr: { selected: 'Seçildi', notSelected: 'Seçilmedi', hintTap: 'Seçmek için çift dokunun', hintLongPress: 'Ayrıntılar için uzun basın', bodyMap: 'Vücut kas haritası', legendLow: 'Düşük', legendHigh: 'Yüksek', heatmapLegend: 'Isı haritası yoğunluk göstergesi' },
  'zh-Hans': { selected: '已选择', notSelected: '未选择', hintTap: '双击选择', hintLongPress: '长按查看详情', bodyMap: '身体肌肉图', legendLow: '低', legendHigh: '高', heatmapLegend: '热力图强度图例' },
};

/** Current active locale. */
let _currentLocale: Locale = 'en';

/** Set the active locale. */
export function setLocale(locale: Locale): void {
  _currentLocale = locale;
}

/** Get the current active locale. */
export function getLocale(): Locale {
  return _currentLocale;
}

/** Get all available locales. */
export function getAvailableLocales(): Locale[] {
  return Object.keys(LOCALES) as Locale[];
}

/** Get the display name for a muscle in the current (or specified) locale. */
export function getMuscleName(muscle: Muscle, locale?: Locale): string {
  const l = locale ?? _currentLocale;
  return LOCALES[l]?.[muscle] ?? LOCALES.en[muscle] ?? muscle;
}

/** Get all muscle display names for the current (or specified) locale. */
export function getAllMuscleNames(locale?: Locale): Record<Muscle, string> {
  const l = locale ?? _currentLocale;
  return LOCALES[l] ?? LOCALES.en;
}

/** Get a UI string in the current (or specified) locale. */
export function getUIString(key: keyof typeof UI_STRINGS['en'], locale?: Locale): string {
  const l = locale ?? _currentLocale;
  return UI_STRINGS[l]?.[key] ?? UI_STRINGS.en[key] ?? key;
}
