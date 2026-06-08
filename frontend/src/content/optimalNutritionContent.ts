type SourceItem = {
    intro: string;
    label: string;
    href: string;
};

type OptimalNutritionContent = {
    title: string;
    subtitle: string;
    introduction: string[];
    applicationsTitle: string;
    applications: string[];
    parameterTitle: string;
    parameterIntro: string;
    parameterSteps: string[];
    parameterExamples: string[];
    sourcesTitle: string;
    sources: SourceItem[];
    backToHomeLabel: string;
};

const optimalNutritionContent: OptimalNutritionContent = {
    title: 'Zasady żywienia optymalnego',
    subtitle:
        'Żywienie optymalne to dieta niskowęglowodanowa i wysokotłuszczowa opracowana przez Jana Kwaśniewskiego.',
    introduction: [
        'Na podstawie wieloletnich obserwacji stwierdził on, że większość chorób ma jedną przyczynę - nieprawidłowe odżywianie. W efekcie opracował „żywienie optymalne” jako sposób żywienia „najlepszy dla człowieka”. Główna zasada diety to ścisłe proporcje makroskładników: białko : tłuszcz : węglowodany = 1 : 2,5-3,5 : 0,5.',
        'Oznacza to, że na każdy gram białka przypada ok. 2,5-3,5 g tłuszczu (głównie zwierzęcego - masło, smalec, tłuste mięso, jaja) i tylko 0,5 g węglowodanów. Dieta wyklucza cukry, słodycze, pieczywo oraz ogranicza warzywa i owoce o wysokiej zawartości skrobi. Z założenia taki model żywienia ma przywracać prawidłowe funkcjonowanie organizmu i zapobiegać chorobom metabolicznym.',
    ],
    applicationsTitle: 'Zastosowania diety i przykłady efektów',
    applications: [
        'Zwolennicy diety Kwaśniewskiego podkreślają, że jej stosowanie poprawia stan zdrowia w wielu chorobach przewlekłych. W relacjach jej propagatorów wymienia się szybkie cofanie się objawów otyłości, miażdżycy, choroby wieńcowej, cukrzycy czy nadciśnienia tętniczego.',
        'Przykładowo u chorych na cukrzycę typu 1 (insulinozależną) odnotowano obniżenie poziomu glukozy i możliwość redukcji dawek insuliny podczas diety optymalnej. Również w cukrzycy typu 2 badania niskowęglowodanowych diet donoszą o zmniejszeniu stężenia hemoglobiny glikowanej HbA1c (lepsza kontrola glikemii) i redukcji masy ciała.',
        'Krótkoterminowo niskowęglowodanowe interwencje rzeczywiście mogą prowadzić do szybszej utraty wagi u osób otyłych - np. w jednym badaniu kobiety z otyłością i insulinoopornością straciły prawie dwukrotnie więcej kilogramów na diecie ubogowęglowodanowej niż na klasycznej diecie wysokowęglowodanowej.',
    ],
    parameterTitle: 'Parametr ŻO - obliczenia i przykłady',
    parameterIntro:
        'Parametr ŻO (Zgodność z Żywieniem Optymalnym) służy do oceny, jak bardzo skład posiłku odpowiada zalecanym proporcjom 1 : 2,5 : 0,5.',
    parameterSteps: [
        'Oblicz stosunki makroskładników: niech p = masa białka, f = tłuszczu, w = węglowodanów (gramy). Oblicz t = f/p i s = w/p.',
        'Sprawdź udział tłuszczu: oblicz fatScope = min(t/2.5, 1). Jeśli t (stosunek tłuszczu do białka) wynosi co najmniej 2,5, to fatScope = 1.',
        'Sprawdź udział węglowodanów: oblicz carbScope = min(0.5/s, 1) przy s > 0.',
        'Oblicz wskaźnik: ŻO = ((fatScope + carbScope) / 2) * 100%.',
        'Odczytaj ocenę: 90-100% - idealny, 70-89% - dobry, 40-69% - średni, 0-39% - słaby.',
    ],
    parameterExamples: [
        'Przykład: posiłek 10 g białka, 25 g tłuszczu i 5 g węglowodanów daje t = 2,5 oraz s = 0,5. Wtedy fatScope = 1 i carbScope = 1, więc ŻO = 100% (ocena „idealna”).',
        'Dla porównania, posiłek 10 g białka, 10 g tłuszczu i 5 g węglowodanów daje t = 1 i s = 0,5, więc fatScope = 0,4, carbScope = 1, a ŻO = 70% (ocena „dobry”).',
    ],
    sourcesTitle: 'Źródła:',
    sources: [
        {
            intro: 'Opis i tło „diety optymalnej”/diety Kwaśniewskiego:',
            label: 'Wikipedia - Dieta Kwaśniewskiego',
            href: 'https://pl.wikipedia.org/wiki/Dieta_Kwa%C5%9Bniewskiego',
        },
        {
            intro: 'Przegląd systematyczny (T2D): wpływ diet nisko- i bardzo niskowęglowodanowych m.in. na HbA1c i masę ciała:',
            label: 'BMJ 2021;372:m4743',
            href: 'https://www.bmj.com/content/372/bmj.m4743',
        },
        {
            intro: 'Meta-analiza (T2D): krótkoterminowa poprawa kontroli glikemii przy ograniczeniu węglowodanów:',
            label: 'BMJ Open Diabetes Research & Care 2017;5:e000354',
            href: 'https://drc.bmj.com/content/5/1/e000354',
        },
        {
            intro: 'Dane obserwacyjne dla T1D (bardzo niskie spożycie węglowodanów; kontrola glikemii i insulinoterapia):',
            label: 'Pediatrics 2018;141(6):e20173349',
            href: 'https://doi.org/10.1542/peds.2017-3349',
        },
    ],
    backToHomeLabel: 'Wróć do strony głównej',
};

export default optimalNutritionContent;
