"""Static disease catalogue. Sources cited per entry."""

from typing import Any

DISEASES: list[dict[str, Any]] = [
    {
        "slug": "infarctus-myocarde",
        "name": "Infarctus du myocarde",
        "short_description": "Nécrose d'une partie du muscle cardiaque due à l'occlusion d'une artère coronaire.",
        "description": (
            "L'infarctus du myocarde survient lorsqu'une artère coronaire se bouche brutalement, "
            "le plus souvent par rupture d'une plaque d'athérome avec formation d'un thrombus. "
            "Le manque d'oxygène (ischémie) prolongé entraîne la nécrose des cellules cardiaques. "
            "Première cause de mortalité dans les pays à hauts revenus."
        ),
        "severity": "critical",
        "category": "Cardiovasculaire",
        "prevalence_per_100k": 244,
        "symptoms": [
            "Douleur thoracique constrictive",
            "Irradiation au bras gauche, à la mâchoire ou au dos",
            "Dyspnée",
            "Sueurs profuses",
            "Nausées et vomissements",
            "Anxiété, sentiment de mort imminente",
        ],
        "causes": [
            "Athérosclérose coronaire",
            "Rupture de plaque d'athérome",
            "Spasme coronaire (rare)",
            "Embolie coronaire",
        ],
        "risk_factors": [
            "Tabagisme",
            "Hypertension artérielle",
            "Hypercholestérolémie",
            "Diabète",
            "Sédentarité",
            "Obésité abdominale",
            "Antécédents familiaux",
            "Stress chronique",
        ],
        "treatments": [
            "Reperfusion en urgence (angioplastie primaire)",
            "Thrombolyse intraveineuse",
            "Antiagrégants plaquettaires (aspirine + P2Y12)",
            "Bêta-bloquants",
            "Statines à forte dose",
            "IEC ou ARA-II",
        ],
        "prevention": [
            "Arrêt du tabac",
            "Activité physique régulière",
            "Régime méditerranéen",
            "Contrôle de la pression artérielle",
            "Dépistage du diabète",
        ],
        "organs": ["coeur"],
        "sub_organs": ["ventricule-g", "ventricule-d"],
        "related_diseases": ["athero", "insuffisance-cardiaque", "hypertension"],
        "epidemiology": {
            "globalCases": 32_400_000,
            "yearlyDeaths": 9_140_000,
            "mostAffectedAgeGroup": "55-75 ans",
            "sexRatio": "H 1.6 : F 1",
            "notes": "1ère cause de mortalité mondiale.",
        },
        "history": [
            (1772, "Première description par William Heberden (« angor »)."),
            (1912, "Distinction clinique de l'infarctus par Herrick."),
            (1977, "Première angioplastie coronaire (Grüntzig)."),
            (1986, "Première étude sur la thrombolyse (GISSI-1)."),
        ],
        "timeline_base": (1990, 7_500_000, 0.012),
        "sources": [
            ("WHO — Cardiovascular diseases", "https://www.who.int/health-topics/cardiovascular-diseases", "who"),
            ("Myocardial infarction — Wikipedia", "https://en.wikipedia.org/wiki/Myocardial_infarction", "wikipedia"),
        ],
    },
    {
        "slug": "diabete-type-2",
        "name": "Diabète de type 2",
        "short_description": "Trouble métabolique chronique caractérisé par une hyperglycémie liée à une insulinorésistance.",
        "description": (
            "Le diabète de type 2 résulte d'une combinaison d'insulinorésistance et d'un déficit "
            "relatif de sécrétion d'insuline. Il représente plus de 90 % des cas de diabète et "
            "progresse rapidement avec l'urbanisation et le vieillissement des populations."
        ),
        "severity": "severe",
        "category": "Métabolique",
        "prevalence_per_100k": 6500,
        "symptoms": [
            "Polyurie",
            "Polydipsie",
            "Asthénie",
            "Vision floue",
            "Cicatrisation lente",
            "Infections récidivantes",
        ],
        "causes": [
            "Insulinorésistance (tissus adipeux et musculaires)",
            "Déficit relatif de sécrétion d'insuline (cellules β)",
            "Susceptibilité génétique",
        ],
        "risk_factors": [
            "Surpoids et obésité",
            "Sédentarité",
            "Antécédents familiaux",
            "Origine ethnique (asiatique, africaine, hispanique)",
            "Diabète gestationnel",
            "Syndrome métabolique",
            "Âge > 45 ans",
        ],
        "treatments": [
            "Modifications du mode de vie",
            "Metformine (1ère intention)",
            "Inhibiteurs SGLT2 (dapagliflozine, empagliflozine)",
            "Agonistes GLP-1 (sémaglutide, liraglutide)",
            "Sulfamides hypoglycémiants",
            "Insulinothérapie en dernier recours",
        ],
        "prevention": [
            "Activité physique 150 min/semaine",
            "Régime équilibré",
            "Réduction du tour de taille",
            "Dépistage régulier (HbA1c)",
        ],
        "organs": ["pancreas", "reins", "oeil", "coeur"],
        "sub_organs": ["ilots", "retine"],
        "related_diseases": ["diabete-type-1", "obesite", "infarctus-myocarde"],
        "epidemiology": {
            "globalCases": 537_000_000,
            "yearlyDeaths": 1_500_000,
            "mostAffectedAgeGroup": "45-70 ans",
            "notes": "Plus de 90% des diabètes adultes.",
        },
        "history": [
            (1675, "Thomas Willis nomme la maladie « diabète sucré »."),
            (1921, "Découverte de l'insuline par Banting et Best."),
            (1957, "Introduction de la metformine."),
            (2013, "Premiers SGLT2 (canagliflozine) approuvés."),
        ],
        "timeline_base": (1990, 150_000_000, 0.045),
        "sources": [
            ("WHO — Diabetes", "https://www.who.int/health-topics/diabetes", "who"),
            ("Type 2 diabetes — Wikipedia", "https://en.wikipedia.org/wiki/Type_2_diabetes", "wikipedia"),
        ],
    },
    {
        "slug": "alzheimer",
        "name": "Maladie d'Alzheimer",
        "short_description": "Maladie neurodégénérative progressive entraînant un déclin cognitif irréversible.",
        "description": (
            "La maladie d'Alzheimer est la cause la plus fréquente de démence. Elle se caractérise "
            "par l'accumulation de plaques β-amyloïdes et de dégénérescences neurofibrillaires (tau), "
            "responsables d'une atrophie cérébrale progressive — débutant typiquement par l'hippocampe."
        ),
        "severity": "severe",
        "category": "Neurologique",
        "prevalence_per_100k": 700,
        "symptoms": [
            "Troubles de la mémoire récente",
            "Désorientation temporo-spatiale",
            "Aphasie progressive",
            "Apraxie",
            "Troubles exécutifs",
            "Modifications de personnalité",
        ],
        "causes": [
            "Accumulation de plaques β-amyloïdes",
            "Dégénérescences neurofibrillaires (tau)",
            "Atrophie hippocampique",
            "Perte synaptique",
        ],
        "risk_factors": [
            "Âge > 65 ans",
            "Antécédents familiaux",
            "Allèle ApoE4",
            "Hypertension non traitée",
            "Diabète",
            "Isolement social",
            "Faible niveau d'éducation",
            "Traumatismes crâniens répétés",
        ],
        "treatments": [
            "Inhibiteurs de l'acétylcholinestérase (donépézil, rivastigmine)",
            "Mémantine (NMDA)",
            "Anticorps anti-amyloïdes (lecanemab, donanemab)",
            "Stimulation cognitive",
            "Prise en charge des comorbidités",
        ],
        "prevention": [
            "Activité physique régulière",
            "Stimulation cognitive et sociale",
            "Régime méditerranéen",
            "Contrôle vasculaire (HTA, diabète, cholestérol)",
            "Sommeil de qualité",
        ],
        "organs": ["cerveau"],
        "sub_organs": ["hippocampe", "lobe-frontal", "lobe-temporal"],
        "related_diseases": ["parkinson", "avc"],
        "epidemiology": {
            "globalCases": 55_000_000,
            "yearlyDeaths": 1_900_000,
            "mostAffectedAgeGroup": "> 75 ans",
            "sexRatio": "F 2 : H 1",
        },
        "history": [
            (1906, "Première description par Alois Alzheimer."),
            (1984, "Identification du peptide β-amyloïde."),
            (1993, "Premier inhibiteur cholinestérase (tacrine)."),
            (2023, "Approbation FDA du lecanemab."),
        ],
        "timeline_base": (1990, 14_000_000, 0.055),
        "sources": [
            ("WHO — Dementia", "https://www.who.int/news-room/fact-sheets/detail/dementia", "who"),
            ("Alzheimer — Wikipedia", "https://en.wikipedia.org/wiki/Alzheimer%27s_disease", "wikipedia"),
        ],
    },
    {
        "slug": "asthme",
        "name": "Asthme",
        "short_description": "Maladie inflammatoire chronique des voies aériennes provoquant des crises de dyspnée.",
        "description": (
            "L'asthme est une maladie inflammatoire chronique des voies aériennes. L'hyperréactivité "
            "bronchique entraîne des épisodes de bronchoconstriction réversible, déclenchés par "
            "allergènes, exercice, infections virales ou pollution."
        ),
        "severity": "moderate",
        "category": "Respiratoire",
        "prevalence_per_100k": 4500,
        "symptoms": [
            "Dyspnée sifflante",
            "Toux nocturne",
            "Oppression thoracique",
            "Sibilants à l'auscultation",
        ],
        "causes": [
            "Sensibilisation atopique",
            "Inflammation Th2",
            "Hyperréactivité bronchique",
        ],
        "risk_factors": [
            "Antécédents atopiques",
            "Exposition tabac (surtout in utero)",
            "Allergènes domestiques (acariens, poils)",
            "Pollution atmosphérique",
            "Obésité",
        ],
        "treatments": [
            "Corticostéroïdes inhalés",
            "β2-agonistes de courte durée d'action (Ventoline)",
            "β2-agonistes de longue durée d'action",
            "Antagonistes des leucotriènes",
            "Biothérapies (omalizumab, mépolizumab)",
        ],
        "prevention": [
            "Éviction allergénique",
            "Arrêt du tabagisme passif et actif",
            "Vaccination antigrippale",
        ],
        "organs": ["poumons"],
        "sub_organs": ["bronches", "bronchioles"],
        "related_diseases": ["bpco", "rhinite-allergique"],
        "epidemiology": {
            "globalCases": 339_000_000,
            "yearlyDeaths": 461_000,
            "mostAffectedAgeGroup": "tous âges",
        },
        "history": [
            (-460, "Description par Hippocrate."),
            (1900, "Théorie allergique de l'asthme."),
            (1960, "Premiers corticostéroïdes inhalés."),
        ],
        "timeline_base": (1990, 235_000_000, 0.011),
        "sources": [
            ("WHO — Asthma", "https://www.who.int/news-room/fact-sheets/detail/asthma", "who"),
            ("CDC — Asthma", "https://www.cdc.gov/asthma/", "cdc"),
        ],
    },
    {
        "slug": "bpco",
        "name": "BPCO",
        "short_description": "Bronchopneumopathie chronique obstructive — obstruction bronchique progressive et peu réversible.",
        "description": (
            "La bronchopneumopathie chronique obstructive (BPCO) regroupe la bronchite chronique et "
            "l'emphysème. Le tabagisme est la cause principale (80 % des cas). L'obstruction est peu "
            "réversible et la maladie évolue par exacerbations."
        ),
        "severity": "severe",
        "category": "Respiratoire",
        "prevalence_per_100k": 3800,
        "symptoms": [
            "Dyspnée d'effort puis de repos",
            "Toux chronique",
            "Expectorations matinales",
            "Sibilants",
            "Perte de poids (formes sévères)",
        ],
        "causes": [
            "Tabagisme",
            "Pollution atmosphérique",
            "Expositions professionnelles (silice, fumées)",
            "Déficit en α1-antitrypsine",
        ],
        "risk_factors": [
            "Tabagisme actif et passif",
            "Pollution intérieure (cuisson au feu de bois)",
            "Infections respiratoires de l'enfance",
            "Déficit α1-antitrypsine",
        ],
        "treatments": [
            "Sevrage tabagique",
            "Bronchodilatateurs (LABA, LAMA)",
            "Corticostéroïdes inhalés (formes sévères)",
            "Réhabilitation respiratoire",
            "Oxygénothérapie de longue durée",
        ],
        "prevention": [
            "Arrêt du tabac",
            "Vaccination antigrippale et antipneumococcique",
            "Réduction des expositions professionnelles",
        ],
        "organs": ["poumons"],
        "sub_organs": ["bronches", "alveoles"],
        "related_diseases": ["asthme", "cancer-poumon"],
        "epidemiology": {
            "globalCases": 391_000_000,
            "yearlyDeaths": 3_230_000,
            "mostAffectedAgeGroup": "> 50 ans",
        },
        "timeline_base": (1990, 2_800_000, 0.012),
        "sources": [
            ("WHO — COPD", "https://www.who.int/news-room/fact-sheets/detail/chronic-obstructive-pulmonary-disease-(copd)", "who"),
        ],
    },
    {
        "slug": "cancer-poumon",
        "name": "Cancer du poumon",
        "short_description": "Tumeur maligne pulmonaire, principale cause de décès par cancer.",
        "description": (
            "Le cancer du poumon est la première cause de décès par cancer dans le monde. "
            "Le tabagisme est responsable de 85 % des cas. On distingue les cancers à petites cellules "
            "(15 %) très agressifs et les cancers non à petites cellules (85 %)."
        ),
        "severity": "critical",
        "category": "Cancer",
        "prevalence_per_100k": 280,
        "symptoms": [
            "Toux persistante",
            "Hémoptysie",
            "Dyspnée",
            "Douleur thoracique",
            "Perte de poids inexpliquée",
            "Asthénie",
        ],
        "causes": [
            "Mutations EGFR, KRAS, ALK",
            "Carcinogènes tabac",
            "Inflammation chronique",
        ],
        "risk_factors": [
            "Tabagisme (actif et passif)",
            "Exposition au radon",
            "Amiante",
            "Pollution atmosphérique",
            "Antécédents familiaux",
        ],
        "treatments": [
            "Chirurgie (lobectomie, pneumonectomie)",
            "Radiothérapie",
            "Chimiothérapie",
            "Thérapies ciblées (EGFR, ALK, ROS1)",
            "Immunothérapie (anti-PD-1/PD-L1)",
        ],
        "prevention": [
            "Arrêt du tabac",
            "Réduction de l'exposition au radon",
            "Dépistage par scanner faible dose chez fumeurs",
        ],
        "organs": ["poumons"],
        "sub_organs": ["bronches", "alveoles"],
        "related_diseases": ["bpco", "mesotheliome"],
        "epidemiology": {
            "globalCases": 2_480_000,
            "yearlyDeaths": 1_800_000,
            "mostAffectedAgeGroup": "60-80 ans",
        },
        "history": [
            (1929, "Première association tabac-cancer (Lickint)."),
            (1962, "Rapport du Royal College of Physicians."),
            (2001, "Première thérapie ciblée EGFR (gefitinib)."),
        ],
        "timeline_base": (1990, 900_000, 0.024),
        "sources": [
            ("WHO — Lung cancer", "https://www.who.int/news-room/fact-sheets/detail/lung-cancer", "who"),
        ],
    },
    {
        "slug": "avc",
        "name": "Accident vasculaire cérébral",
        "short_description": "Interruption brutale de la vascularisation cérébrale par ischémie ou hémorragie.",
        "description": (
            "L'AVC est une urgence neurologique. 85 % sont ischémiques (occlusion artérielle), "
            "15 % hémorragiques. Chaque minute sans traitement détruit environ 1,9 million de neurones."
        ),
        "severity": "critical",
        "category": "Neurologique",
        "prevalence_per_100k": 1300,
        "symptoms": [
            "Hémiplégie ou hémiparésie",
            "Aphasie brutale",
            "Asymétrie faciale",
            "Trouble visuel soudain",
            "Céphalée brutale (formes hémorragiques)",
            "Trouble de la conscience",
        ],
        "causes": [
            "Athérosclérose carotidienne",
            "Cardiopathies emboliques (FA)",
            "Rupture d'anévrisme",
            "Thrombose veineuse cérébrale",
        ],
        "risk_factors": [
            "Hypertension",
            "Fibrillation atriale",
            "Tabagisme",
            "Diabète",
            "Hypercholestérolémie",
            "Âge",
            "Antécédents familiaux",
        ],
        "treatments": [
            "Thrombolyse IV (rt-PA) < 4h30",
            "Thrombectomie mécanique < 6h (jusqu'à 24h)",
            "Antiagrégants plaquettaires",
            "Anticoagulants (AVC cardio-emboliques)",
            "Rééducation neurologique",
        ],
        "prevention": [
            "Contrôle tensionnel",
            "Anticoagulation en cas de FA",
            "Sevrage tabagique",
            "Activité physique",
        ],
        "organs": ["cerveau", "coeur"],
        "sub_organs": ["lobe-frontal", "lobe-parietal"],
        "related_diseases": ["alzheimer", "infarctus-myocarde", "hypertension"],
        "epidemiology": {
            "globalCases": 100_000_000,
            "yearlyDeaths": 6_500_000,
            "mostAffectedAgeGroup": "> 65 ans",
        },
        "history": [
            (1996, "Approbation FDA de l'altéplase."),
            (2015, "Validation de la thrombectomie mécanique."),
        ],
        "timeline_base": (1990, 5_400_000, 0.011),
        "sources": [
            ("WHO — Stroke", "https://www.who.int/health-topics/stroke", "who"),
        ],
    },
    {
        "slug": "hypertension",
        "name": "Hypertension artérielle",
        "short_description": "Élévation chronique de la pression artérielle, premier facteur de risque cardiovasculaire mondial.",
        "description": (
            "L'hypertension est définie par une pression ≥ 140/90 mmHg en cabinet. Souvent asymptomatique, "
            "elle est responsable de complications cardiaques, rénales, cérébrales et oculaires lorsqu'elle "
            "n'est pas traitée."
        ),
        "severity": "moderate",
        "category": "Cardiovasculaire",
        "prevalence_per_100k": 32_000,
        "symptoms": [
            "Souvent asymptomatique",
            "Céphalées (formes sévères)",
            "Vertiges",
            "Bourdonnements d'oreille",
            "Acouphènes",
        ],
        "causes": [
            "Hypertension essentielle (95 %)",
            "Causes secondaires : rénales, endocriniennes, vasculaires",
        ],
        "risk_factors": [
            "Âge",
            "Hérédité",
            "Apport sodé excessif",
            "Surpoids",
            "Sédentarité",
            "Consommation excessive d'alcool",
            "Stress chronique",
        ],
        "treatments": [
            "IEC ou ARA-II",
            "Inhibiteurs calciques",
            "Diurétiques thiazidiques",
            "Bêta-bloquants",
            "Modifications du mode de vie",
        ],
        "prevention": [
            "Réduction du sel",
            "Activité physique",
            "Limitation alcool",
            "Maintien d'un poids sain",
        ],
        "organs": ["coeur", "reins", "cerveau"],
        "sub_organs": [],
        "related_diseases": ["infarctus-myocarde", "avc", "insuffisance-renale"],
        "epidemiology": {
            "globalCases": 1_280_000_000,
            "yearlyDeaths": 10_800_000,
            "mostAffectedAgeGroup": "> 50 ans",
        },
        "timeline_base": (1990, 600_000_000, 0.022),
        "sources": [
            ("WHO — Hypertension", "https://www.who.int/news-room/fact-sheets/detail/hypertension", "who"),
        ],
    },
    {
        "slug": "tuberculose",
        "name": "Tuberculose",
        "short_description": "Infection bactérienne transmissible due à Mycobacterium tuberculosis.",
        "description": (
            "La tuberculose touche le plus souvent les poumons mais peut atteindre n'importe quel organe. "
            "Maladie ancienne, elle reste l'une des principales causes infectieuses de décès dans le monde, "
            "avec une menace croissante de résistance aux antibiotiques (MDR-TB, XDR-TB)."
        ),
        "severity": "severe",
        "category": "Infectieuse",
        "prevalence_per_100k": 134,
        "symptoms": [
            "Toux > 3 semaines",
            "Hémoptysie",
            "Fièvre vespérale",
            "Sueurs nocturnes",
            "Amaigrissement",
            "Asthénie",
        ],
        "causes": [
            "Infection par Mycobacterium tuberculosis",
            "Transmission aérienne",
        ],
        "risk_factors": [
            "Précarité, promiscuité",
            "Co-infection VIH",
            "Diabète",
            "Dénutrition",
            "Migration depuis zone endémique",
            "Immunosuppression",
        ],
        "treatments": [
            "Quadrithérapie 2 mois (HRZE)",
            "Bithérapie 4 mois (HR)",
            "Antibiotiques de réserve si MDR/XDR",
            "Vaccination BCG (prévention sévérité)",
        ],
        "prevention": [
            "Vaccination BCG (formes sévères de l'enfant)",
            "Dépistage des contacts",
            "Traitement de l'infection latente",
        ],
        "organs": ["poumons"],
        "sub_organs": ["alveoles"],
        "related_diseases": ["vih", "pneumonie"],
        "epidemiology": {
            "globalCases": 10_600_000,
            "yearlyDeaths": 1_300_000,
            "mostAffectedAgeGroup": "15-64 ans",
        },
        "history": [
            (1882, "Robert Koch identifie le bacille."),
            (1921, "Premier vaccin BCG."),
            (1944, "Découverte de la streptomycine."),
        ],
        "timeline_base": (1990, 8_500_000, -0.005),
        "sources": [
            ("WHO — Tuberculosis", "https://www.who.int/news-room/fact-sheets/detail/tuberculosis", "who"),
        ],
    },
    {
        "slug": "covid-19",
        "name": "COVID-19",
        "short_description": "Maladie infectieuse virale causée par le SARS-CoV-2.",
        "description": (
            "La COVID-19 est causée par le coronavirus SARS-CoV-2 apparu fin 2019. La pandémie qui a suivi "
            "a provoqué une mortalité massive et accéléré la mise au point de vaccins à ARN messager."
        ),
        "severity": "moderate",
        "category": "Infectieuse",
        "prevalence_per_100k": 9000,
        "symptoms": [
            "Fièvre",
            "Toux sèche",
            "Asthénie",
            "Anosmie / agueusie",
            "Dyspnée (formes graves)",
            "Long COVID (forme prolongée)",
        ],
        "causes": [
            "Infection par SARS-CoV-2",
            "Transmission aérienne",
        ],
        "risk_factors": [
            "Âge avancé",
            "Comorbidités cardiovasculaires",
            "Diabète",
            "Obésité",
            "Immunodépression",
        ],
        "treatments": [
            "Antiviraux (Paxlovid, remdesivir)",
            "Corticostéroïdes (formes sévères)",
            "Anticorps monoclonaux",
            "Oxygénothérapie / ventilation",
        ],
        "prevention": [
            "Vaccination",
            "Masque en milieu à risque",
            "Aération des locaux",
            "Hygiène des mains",
        ],
        "organs": ["poumons", "coeur"],
        "sub_organs": ["alveoles"],
        "related_diseases": ["grippe"],
        "epidemiology": {
            "globalCases": 770_000_000,
            "yearlyDeaths": 7_000_000,
            "mostAffectedAgeGroup": "tous âges",
            "notes": "Pandémie déclarée en mars 2020.",
        },
        "history": [
            (2019, "Premiers cas à Wuhan, Chine."),
            (2020, "Déclaration de pandémie par l'OMS."),
            (2020, "Déploiement des premiers vaccins ARN."),
        ],
        "timeline_base": (2020, 100_000_000, 0.10),
        "sources": [
            ("WHO — COVID-19", "https://www.who.int/health-topics/coronavirus", "who"),
        ],
    },
    {
        "slug": "depression",
        "name": "Dépression",
        "short_description": "Trouble de l'humeur fréquent, première cause d'incapacité dans le monde.",
        "description": (
            "Le trouble dépressif majeur se caractérise par une humeur triste persistante, une anhédonie "
            "et de multiples symptômes cognitifs et somatiques. Première cause d'incapacité mondiale "
            "selon l'OMS."
        ),
        "severity": "severe",
        "category": "Mentale",
        "prevalence_per_100k": 5400,
        "symptoms": [
            "Humeur triste persistante",
            "Anhédonie",
            "Troubles du sommeil",
            "Asthénie",
            "Sentiment de culpabilité",
            "Idées suicidaires",
            "Ralentissement psychomoteur",
        ],
        "causes": [
            "Dérèglement des neurotransmetteurs (sérotonine, noradrénaline, dopamine)",
            "Facteurs génétiques",
            "Stress chronique",
            "Inflammation",
        ],
        "risk_factors": [
            "Antécédents familiaux",
            "Événements de vie traumatiques",
            "Maladies chroniques",
            "Précarité, isolement",
            "Consommation d'alcool",
        ],
        "treatments": [
            "ISRS (sertraline, escitalopram)",
            "IRSN (venlafaxine)",
            "Psychothérapie (TCC, IPT)",
            "Activité physique",
            "TMS, kétamine, ECT (formes résistantes)",
        ],
        "prevention": [
            "Activité physique",
            "Sommeil régulier",
            "Lien social",
            "Dépistage précoce",
        ],
        "organs": ["cerveau"],
        "sub_organs": ["lobe-frontal", "hippocampe"],
        "related_diseases": ["anxiete", "trouble-bipolaire"],
        "epidemiology": {
            "globalCases": 280_000_000,
            "yearlyDeaths": 700_000,
            "mostAffectedAgeGroup": "20-50 ans",
            "sexRatio": "F 2 : H 1",
        },
        "timeline_base": (1990, 180_000_000, 0.013),
        "sources": [
            ("WHO — Depression", "https://www.who.int/news-room/fact-sheets/detail/depression", "who"),
        ],
    },
    {
        "slug": "obesite",
        "name": "Obésité",
        "short_description": "Excès de masse grasse aux conséquences métaboliques et cardiovasculaires majeures.",
        "description": (
            "L'obésité est définie par un IMC ≥ 30 kg/m². C'est un facteur de risque majeur pour le "
            "diabète de type 2, les maladies cardiovasculaires, certains cancers et l'apnée du sommeil."
        ),
        "severity": "severe",
        "category": "Métabolique",
        "prevalence_per_100k": 13_000,
        "symptoms": [
            "Excès pondéral",
            "Dyspnée d'effort",
            "Gonalgies",
            "Apnées du sommeil",
            "Stéatose hépatique",
        ],
        "causes": [
            "Déséquilibre énergétique chronique",
            "Facteurs génétiques",
            "Dérèglement hormonal",
            "Microbiote intestinal",
        ],
        "risk_factors": [
            "Sédentarité",
            "Régime hypercalorique",
            "Antécédents familiaux",
            "Stress, sommeil insuffisant",
            "Précarité socio-économique",
        ],
        "treatments": [
            "Modifications du mode de vie",
            "Activité physique adaptée",
            "Agonistes GLP-1 (sémaglutide)",
            "Tirzépatide",
            "Chirurgie bariatrique (sleeve, by-pass)",
        ],
        "prevention": [
            "Éducation nutritionnelle",
            "Activité physique dès l'enfance",
            "Limitation des produits ultra-transformés",
        ],
        "organs": ["foie", "coeur", "pancreas"],
        "sub_organs": [],
        "related_diseases": ["diabete-type-2", "infarctus-myocarde", "stéatose"],
        "epidemiology": {
            "globalCases": 890_000_000,
            "yearlyDeaths": 2_800_000,
            "mostAffectedAgeGroup": "tous âges",
        },
        "timeline_base": (1990, 200_000_000, 0.05),
        "sources": [
            ("WHO — Obesity", "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight", "who"),
        ],
    },
    {
        "slug": "paludisme",
        "name": "Paludisme",
        "short_description": "Infection parasitaire transmise par les moustiques anophèles, endémique des zones tropicales.",
        "description": (
            "Le paludisme (malaria) est une infection à Plasmodium transmise par les moustiques. "
            "P. falciparum est le plus létal. Maladie endémique en Afrique subsaharienne, Asie du Sud-Est "
            "et Amazonie."
        ),
        "severity": "severe",
        "category": "Infectieuse",
        "prevalence_per_100k": 3000,
        "symptoms": [
            "Fièvre tierce ou quarte",
            "Frissons",
            "Sueurs",
            "Céphalées",
            "Hépatosplénomégalie",
            "Anémie",
            "Coma (paludisme cérébral)",
        ],
        "causes": [
            "Infection par Plasmodium spp.",
            "Piqûre d'anophèle femelle",
        ],
        "risk_factors": [
            "Voyage en zone endémique",
            "Absence de protection (moustiquaire)",
            "Enfants < 5 ans",
            "Femmes enceintes",
            "Drépanocytose hétérozygote (protection partielle)",
        ],
        "treatments": [
            "Combinaisons à base d'artémisinine (ACT)",
            "Méfloquine",
            "Chloroquine (P. vivax)",
            "Quinine IV (formes graves)",
        ],
        "prevention": [
            "Moustiquaires imprégnées",
            "Pulvérisation intra-domiciliaire",
            "Vaccins RTS,S et R21",
            "Chimioprophylaxie pour voyageurs",
        ],
        "organs": ["foie", "rate"],
        "sub_organs": [],
        "related_diseases": ["dengue", "fievre-jaune"],
        "epidemiology": {
            "globalCases": 249_000_000,
            "yearlyDeaths": 608_000,
            "mostAffectedAgeGroup": "Enfants < 5 ans",
        },
        "history": [
            (1880, "Identification du parasite par Laveran."),
            (1897, "Démonstration de la transmission par moustique (Ross)."),
            (2021, "Recommandation OMS du vaccin RTS,S."),
        ],
        "timeline_base": (2000, 240_000_000, -0.005),
        "sources": [
            ("WHO — Malaria", "https://www.who.int/news-room/fact-sheets/detail/malaria", "who"),
        ],
    },
    {
        "slug": "vih",
        "name": "VIH / SIDA",
        "short_description": "Infection chronique du système immunitaire par le virus de l'immunodéficience humaine.",
        "description": (
            "Le VIH attaque les lymphocytes T CD4. En l'absence de traitement, l'évolution conduit au "
            "SIDA caractérisé par des infections opportunistes. Les antirétroviraux ont transformé la "
            "maladie en pathologie chronique gérable, et la PrEP en a réduit la transmission."
        ),
        "severity": "severe",
        "category": "Infectieuse",
        "prevalence_per_100k": 480,
        "symptoms": [
            "Phase aiguë : syndrome pseudo-grippal",
            "Phase asymptomatique prolongée",
            "Infections opportunistes",
            "Sarcome de Kaposi",
            "Perte de poids majeure",
        ],
        "causes": [
            "Infection par VIH-1 ou VIH-2",
            "Transmission sexuelle, sanguine ou périnatale",
        ],
        "risk_factors": [
            "Rapports non protégés",
            "Échange de seringues",
            "Transmission mère-enfant",
        ],
        "treatments": [
            "Antirétroviraux (multithérapie)",
            "PrEP (prévention pré-exposition)",
            "PEP (prévention post-exposition)",
        ],
        "prevention": [
            "Préservatif",
            "PrEP",
            "Dépistage régulier",
            "Traitement précoce (TasP)",
        ],
        "organs": ["rate"],
        "sub_organs": [],
        "related_diseases": ["tuberculose"],
        "epidemiology": {
            "globalCases": 39_000_000,
            "yearlyDeaths": 630_000,
            "mostAffectedAgeGroup": "20-50 ans",
        },
        "history": [
            (1981, "Identification du SIDA aux États-Unis."),
            (1996, "Trithérapies hautement actives."),
            (2012, "Approbation FDA de la PrEP."),
        ],
        "timeline_base": (1990, 8_000_000, 0.018),
        "sources": [
            ("WHO — HIV", "https://www.who.int/news-room/fact-sheets/detail/hiv-aids", "who"),
        ],
    },
    {
        "slug": "grippe",
        "name": "Grippe saisonnière",
        "short_description": "Infection virale respiratoire à transmission interhumaine récurrente chaque hiver.",
        "description": (
            "La grippe est causée par les virus Influenza A et B. Elle évolue par épidémies saisonnières "
            "et peut, dans de rares cas, donner naissance à des pandémies."
        ),
        "severity": "moderate",
        "category": "Infectieuse",
        "prevalence_per_100k": 6500,
        "symptoms": [
            "Fièvre élevée brutale",
            "Myalgies",
            "Céphalées",
            "Asthénie marquée",
            "Toux sèche",
            "Pharyngite",
        ],
        "causes": [
            "Virus Influenza A (H1N1, H3N2)",
            "Virus Influenza B",
        ],
        "risk_factors": [
            "Âge avancé",
            "Maladies chroniques",
            "Grossesse",
            "Immunodépression",
        ],
        "treatments": [
            "Repos, hydratation",
            "Antalgiques / antipyrétiques",
            "Antiviraux (oseltamivir) si grave",
        ],
        "prevention": [
            "Vaccination annuelle",
            "Hygiène des mains",
            "Masque en cas de symptômes",
        ],
        "organs": ["poumons"],
        "sub_organs": ["bronches"],
        "related_diseases": ["covid-19", "pneumonie"],
        "epidemiology": {
            "globalCases": 1_000_000_000,
            "yearlyDeaths": 500_000,
            "mostAffectedAgeGroup": "tous âges",
        },
        "timeline_base": (1990, 800_000_000, 0.005),
        "sources": [
            ("WHO — Influenza", "https://www.who.int/teams/global-influenza-programme", "who"),
        ],
    },
    {
        "slug": "parkinson",
        "name": "Maladie de Parkinson",
        "short_description": "Maladie neurodégénérative caractérisée par une dégénérescence dopaminergique.",
        "description": (
            "La maladie de Parkinson résulte de la perte progressive des neurones dopaminergiques de la "
            "substance noire. Elle se manifeste par une triade : tremblement de repos, rigidité, "
            "akinésie. La L-DOPA reste le traitement majeur."
        ),
        "severity": "severe",
        "category": "Neurologique",
        "prevalence_per_100k": 380,
        "symptoms": [
            "Tremblement de repos",
            "Rigidité musculaire",
            "Akinésie / bradykinésie",
            "Trouble postural",
            "Anosmie",
            "Troubles du sommeil REM",
        ],
        "causes": [
            "Dégénérescence dopaminergique",
            "Facteurs génétiques (LRRK2, GBA)",
            "Facteurs environnementaux",
        ],
        "risk_factors": [
            "Âge",
            "Antécédents familiaux",
            "Exposition pesticides",
            "Sexe masculin",
        ],
        "treatments": [
            "L-DOPA + carbidopa",
            "Agonistes dopaminergiques",
            "Inhibiteurs MAO-B",
            "Stimulation cérébrale profonde",
            "Rééducation et kinésithérapie",
        ],
        "prevention": [
            "Activité physique",
            "Caféine modérée (effet protecteur)",
        ],
        "organs": ["cerveau"],
        "sub_organs": ["tronc-cerebral"],
        "related_diseases": ["alzheimer"],
        "epidemiology": {
            "globalCases": 8_500_000,
            "yearlyDeaths": 330_000,
            "mostAffectedAgeGroup": "> 60 ans",
        },
        "history": [
            (1817, "Description originale par James Parkinson."),
            (1960, "Introduction de la L-DOPA."),
            (1990, "Premières DBS dans le noyau sous-thalamique."),
        ],
        "timeline_base": (1990, 2_500_000, 0.04),
        "sources": [
            ("WHO — Parkinson", "https://www.who.int/news-room/fact-sheets/detail/parkinson-disease", "who"),
        ],
    },
    {
        "slug": "insuffisance-renale",
        "name": "Insuffisance rénale chronique",
        "short_description": "Diminution progressive et irréversible de la fonction de filtration des reins.",
        "description": (
            "L'insuffisance rénale chronique est définie par un débit de filtration glomérulaire < 60 mL/min "
            "pendant plus de 3 mois. À un stade avancé, elle nécessite dialyse ou transplantation rénale."
        ),
        "severity": "severe",
        "category": "Métabolique",
        "prevalence_per_100k": 11_000,
        "symptoms": [
            "Œdèmes",
            "HTA",
            "Asthénie",
            "Anémie (déficit EPO)",
            "Prurit",
            "Anorexie (stade terminal)",
        ],
        "causes": [
            "Diabète",
            "Hypertension",
            "Glomérulonéphrites",
            "Polykystose rénale",
        ],
        "risk_factors": [
            "Diabète",
            "Hypertension",
            "Antécédents familiaux",
            "Tabagisme",
            "Néphrotoxiques",
        ],
        "treatments": [
            "Contrôle tensionnel strict",
            "IEC ou ARA-II",
            "Inhibiteurs SGLT2",
            "Dialyse",
            "Transplantation rénale",
        ],
        "prevention": [
            "Contrôle du diabète et de l'HTA",
            "Éviction des AINS au long cours",
            "Hydratation adéquate",
        ],
        "organs": ["reins"],
        "sub_organs": ["nephron"],
        "related_diseases": ["diabete-type-2", "hypertension"],
        "epidemiology": {
            "globalCases": 850_000_000,
            "yearlyDeaths": 1_400_000,
            "mostAffectedAgeGroup": "> 50 ans",
        },
        "timeline_base": (1990, 380_000_000, 0.024),
        "sources": [
            ("Kidney disease — Wikipedia", "https://en.wikipedia.org/wiki/Chronic_kidney_disease", "wikipedia"),
        ],
    },
    {
        "slug": "hepatite-b",
        "name": "Hépatite B",
        "short_description": "Infection virale du foie pouvant évoluer vers la cirrhose et le carcinome hépatocellulaire.",
        "description": (
            "L'hépatite B est due au virus HBV. Elle peut être aiguë ou chronique, et la forme chronique "
            "est responsable de cirrhose et de cancer du foie. Le vaccin est très efficace."
        ),
        "severity": "severe",
        "category": "Infectieuse",
        "prevalence_per_100k": 3500,
        "symptoms": [
            "Phase aiguë : ictère, fatigue, douleurs abdominales",
            "Phase chronique : souvent asymptomatique",
            "Complications : cirrhose, carcinome hépatocellulaire",
        ],
        "causes": [
            "Infection par le virus HBV",
            "Transmission sanguine, sexuelle, mère-enfant",
        ],
        "risk_factors": [
            "Origine zone endémique",
            "Rapports non protégés",
            "Échange de seringues",
            "Transmission verticale",
        ],
        "treatments": [
            "Antiviraux (ténofovir, entécavir)",
            "Interféron pégylé",
            "Surveillance échographique semestrielle",
            "Transplantation hépatique (formes terminales)",
        ],
        "prevention": [
            "Vaccination universelle",
            "Préservatif",
            "Dépistage prénatal",
        ],
        "organs": ["foie"],
        "sub_organs": ["lobe-droit", "lobe-gauche"],
        "related_diseases": ["hepatite-c", "cancer-foie"],
        "epidemiology": {
            "globalCases": 296_000_000,
            "yearlyDeaths": 820_000,
            "mostAffectedAgeGroup": "tous âges",
        },
        "timeline_base": (1990, 350_000_000, -0.003),
        "sources": [
            ("WHO — Hepatitis B", "https://www.who.int/news-room/fact-sheets/detail/hepatitis-b", "who"),
        ],
    },
    {
        "slug": "cancer-sein",
        "name": "Cancer du sein",
        "short_description": "Tumeur maligne du tissu mammaire, premier cancer chez la femme.",
        "description": (
            "Le cancer du sein est le cancer le plus diagnostiqué chez la femme. Le dépistage précoce "
            "par mammographie a permis une réduction significative de la mortalité. Les sous-types "
            "moléculaires (HER2+, RH+, triple négatif) déterminent le traitement."
        ),
        "severity": "severe",
        "category": "Cancer",
        "prevalence_per_100k": 660,
        "symptoms": [
            "Nodule mammaire palpable",
            "Modification cutanée (peau d'orange)",
            "Écoulement mamelonnaire",
            "Adénopathies axillaires",
        ],
        "causes": [
            "Mutations BRCA1, BRCA2, PALB2",
            "Stimulation hormonale",
            "Mutations somatiques",
        ],
        "risk_factors": [
            "Âge",
            "Antécédents familiaux",
            "Mutations génétiques",
            "Exposition hormonale prolongée",
            "Obésité post-ménopausique",
            "Alcool",
        ],
        "treatments": [
            "Chirurgie (tumorectomie, mastectomie)",
            "Radiothérapie",
            "Chimiothérapie",
            "Hormonothérapie",
            "Thérapies ciblées (trastuzumab)",
        ],
        "prevention": [
            "Dépistage organisé (mammographie 50-74 ans)",
            "Activité physique",
            "Allaitement",
            "Limitation alcool",
        ],
        "organs": ["peau"],
        "sub_organs": [],
        "related_diseases": ["cancer-ovaire"],
        "epidemiology": {
            "globalCases": 7_800_000,
            "yearlyDeaths": 685_000,
            "mostAffectedAgeGroup": "50-70 ans",
            "sexRatio": "F 99 : H 1",
        },
        "timeline_base": (1990, 3_400_000, 0.025),
        "sources": [
            ("WHO — Breast cancer", "https://www.who.int/news-room/fact-sheets/detail/breast-cancer", "who"),
        ],
    },
    {
        "slug": "anxiete",
        "name": "Troubles anxieux",
        "short_description": "Famille de troubles caractérisés par une anxiété excessive et persistante.",
        "description": (
            "Les troubles anxieux regroupent l'anxiété généralisée, le trouble panique, les phobies "
            "spécifiques, la phobie sociale, le TSPT. Ils touchent près de 4 % de la population mondiale."
        ),
        "severity": "moderate",
        "category": "Mentale",
        "prevalence_per_100k": 4000,
        "symptoms": [
            "Inquiétudes excessives",
            "Irritabilité",
            "Troubles du sommeil",
            "Tension musculaire",
            "Crises de panique",
            "Évitement",
        ],
        "causes": [
            "Facteurs génétiques",
            "Hyperréactivité de l'amygdale",
            "Stress chronique",
            "Traumatismes",
        ],
        "risk_factors": [
            "Antécédents familiaux",
            "Événements traumatiques",
            "Sexe féminin",
            "Maladies chroniques",
        ],
        "treatments": [
            "TCC",
            "ISRS / IRSN",
            "Benzodiazépines (court terme)",
            "Mindfulness",
            "Activité physique",
        ],
        "prevention": [
            "Gestion du stress",
            "Sommeil de qualité",
            "Soutien social",
        ],
        "organs": ["cerveau"],
        "sub_organs": ["lobe-frontal"],
        "related_diseases": ["depression"],
        "epidemiology": {
            "globalCases": 301_000_000,
            "yearlyDeaths": None,
            "mostAffectedAgeGroup": "20-50 ans",
            "sexRatio": "F 2 : H 1",
        },
        "timeline_base": (1990, 200_000_000, 0.013),
        "sources": [
            ("WHO — Mental health", "https://www.who.int/news-room/fact-sheets/detail/mental-disorders", "who"),
        ],
    },
]
