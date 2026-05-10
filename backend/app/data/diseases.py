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
            ("WHO, Cardiovascular diseases", "https://www.who.int/health-topics/cardiovascular-diseases", "who"),
            ("Myocardial infarction, Wikipedia", "https://en.wikipedia.org/wiki/Myocardial_infarction", "wikipedia"),
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
            ("WHO, Diabetes", "https://www.who.int/health-topics/diabetes", "who"),
            ("Type 2 diabetes, Wikipedia", "https://en.wikipedia.org/wiki/Type_2_diabetes", "wikipedia"),
        ],
    },
    {
        "slug": "alzheimer",
        "name": "Maladie d'Alzheimer",
        "short_description": "Maladie neurodégénérative progressive entraînant un déclin cognitif irréversible.",
        "description": (
            "La maladie d'Alzheimer est la cause la plus fréquente de démence. Elle se caractérise "
            "par l'accumulation de plaques β-amyloïdes et de dégénérescences neurofibrillaires (tau), "
            "responsables d'une atrophie cérébrale progressive, débutant typiquement par l'hippocampe."
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
            ("WHO, Dementia", "https://www.who.int/news-room/fact-sheets/detail/dementia", "who"),
            ("Alzheimer, Wikipedia", "https://en.wikipedia.org/wiki/Alzheimer%27s_disease", "wikipedia"),
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
            ("WHO, Asthma", "https://www.who.int/news-room/fact-sheets/detail/asthma", "who"),
            ("CDC, Asthma", "https://www.cdc.gov/asthma/", "cdc"),
        ],
    },
    {
        "slug": "bpco",
        "name": "BPCO",
        "short_description": "Bronchopneumopathie chronique obstructive, obstruction bronchique progressive et peu réversible.",
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
            ("WHO, COPD", "https://www.who.int/news-room/fact-sheets/detail/chronic-obstructive-pulmonary-disease-(copd)", "who"),
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
            ("WHO, Lung cancer", "https://www.who.int/news-room/fact-sheets/detail/lung-cancer", "who"),
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
            ("WHO, Stroke", "https://www.who.int/health-topics/stroke", "who"),
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
            ("WHO, Hypertension", "https://www.who.int/news-room/fact-sheets/detail/hypertension", "who"),
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
            ("WHO, Tuberculosis", "https://www.who.int/news-room/fact-sheets/detail/tuberculosis", "who"),
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
            ("WHO, COVID-19", "https://www.who.int/health-topics/coronavirus", "who"),
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
            ("WHO, Depression", "https://www.who.int/news-room/fact-sheets/detail/depression", "who"),
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
            ("WHO, Obesity", "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight", "who"),
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
            ("WHO, Malaria", "https://www.who.int/news-room/fact-sheets/detail/malaria", "who"),
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
            ("WHO, HIV", "https://www.who.int/news-room/fact-sheets/detail/hiv-aids", "who"),
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
            ("WHO, Influenza", "https://www.who.int/teams/global-influenza-programme", "who"),
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
            ("WHO, Parkinson", "https://www.who.int/news-room/fact-sheets/detail/parkinson-disease", "who"),
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
            ("Kidney disease, Wikipedia", "https://en.wikipedia.org/wiki/Chronic_kidney_disease", "wikipedia"),
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
            ("WHO, Hepatitis B", "https://www.who.int/news-room/fact-sheets/detail/hepatitis-b", "who"),
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
            ("WHO, Breast cancer", "https://www.who.int/news-room/fact-sheets/detail/breast-cancer", "who"),
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
            ("WHO, Mental health", "https://www.who.int/news-room/fact-sheets/detail/mental-disorders", "who"),
        ],
    },
    {
        "slug": "sclerose-en-plaques",
        "name": "Sclérose en plaques",
        "short_description": "Maladie auto-immune démyélinisante du système nerveux central, chronique et invalidante.",
        "description": (
            "La sclérose en plaques (SEP) est une maladie auto-immune où le système immunitaire "
            "attaque la gaine de myéline qui entoure les axones du système nerveux central. "
            "Elle évolue par poussées ou de façon progressive et touche surtout les jeunes adultes."
        ),
        "severity": "severe",
        "category": "Auto-immune",
        "prevalence_per_100k": 35,
        "symptoms": [
            "Fatigue intense",
            "Troubles visuels (névrite optique)",
            "Engourdissements et picotements",
            "Faiblesse musculaire",
            "Troubles de l'équilibre",
            "Troubles vésico-sphinctériens",
            "Troubles cognitifs",
        ],
        "causes": [
            "Auto-immunité contre la myéline",
            "Susceptibilité génétique (HLA-DRB1)",
            "Facteurs environnementaux (EBV, vitamine D)",
        ],
        "risk_factors": [
            "Sexe féminin (3:1)",
            "Antécédents familiaux",
            "Infection par le virus Epstein-Barr",
            "Carence en vitamine D",
            "Tabagisme",
            "Latitude élevée",
        ],
        "treatments": [
            "Corticostéroïdes (poussées)",
            "Interférons β",
            "Acétate de glatiramère",
            "Anticorps monoclonaux (natalizumab, ocrelizumab)",
            "Modulateurs S1P (fingolimod, ozanimod)",
            "Réadaptation pluridisciplinaire",
        ],
        "prevention": [
            "Supplémentation vitamine D (à risque)",
            "Arrêt du tabac",
        ],
        "organs": ["cerveau", "moelle-epiniere"],
        "sub_organs": ["lobe-frontal", "rachis-cervical"],
        "related_diseases": ["lupus", "polyarthrite-rhumatoide"],
        "epidemiology": {
            "globalCases": 2_900_000,
            "yearlyDeaths": 18_000,
            "mostAffectedAgeGroup": "20-40 ans",
            "sexRatio": "F 3 : H 1",
        },
        "history": [
            (1868, "Description par Jean-Martin Charcot."),
            (1993, "Approbation du premier interféron β."),
            (2004, "Approbation du natalizumab."),
        ],
        "timeline_base": (1990, 1_800_000, 0.018),
        "sources": [
            ("WHO, Multiple sclerosis", "https://www.who.int/news-room/fact-sheets/detail/multiple-sclerosis", "who"),
        ],
    },
    {
        "slug": "polyarthrite-rhumatoide",
        "name": "Polyarthrite rhumatoïde",
        "short_description": "Maladie auto-immune chronique provoquant inflammation et destruction des articulations.",
        "description": (
            "La polyarthrite rhumatoïde est une maladie auto-immune systémique qui touche "
            "préférentiellement les articulations distales (mains, pieds) de façon symétrique. "
            "Sans traitement, elle conduit à des déformations invalidantes."
        ),
        "severity": "severe",
        "category": "Auto-immune",
        "prevalence_per_100k": 700,
        "symptoms": [
            "Douleurs articulaires symétriques",
            "Gonflement",
            "Raideur matinale > 1h",
            "Asthénie",
            "Nodules rhumatoïdes",
            "Déformations articulaires",
        ],
        "causes": [
            "Auto-immunité (anti-CCP, FR)",
            "Susceptibilité HLA-DR4",
        ],
        "risk_factors": [
            "Sexe féminin (3:1)",
            "Tabagisme",
            "Antécédents familiaux",
            "Maladies parodontales",
        ],
        "treatments": [
            "Méthotrexate (1ère intention)",
            "Corticothérapie courte",
            "Anti-TNFα (infliximab, adalimumab)",
            "Anti-IL6 (tocilizumab)",
            "Inhibiteurs de JAK",
        ],
        "prevention": [
            "Arrêt du tabac",
            "Hygiène bucco-dentaire",
        ],
        "organs": ["squelette", "muscles"],
        "sub_organs": [],
        "related_diseases": ["lupus", "spondylarthrite"],
        "epidemiology": {
            "globalCases": 17_600_000,
            "yearlyDeaths": 38_000,
            "mostAffectedAgeGroup": "40-60 ans",
            "sexRatio": "F 3 : H 1",
        },
        "timeline_base": (1990, 12_000_000, 0.015),
        "sources": [
            ("Rheumatoid arthritis, Wikipedia", "https://en.wikipedia.org/wiki/Rheumatoid_arthritis", "wikipedia"),
        ],
    },
    {
        "slug": "lupus",
        "name": "Lupus érythémateux systémique",
        "short_description": "Maladie auto-immune systémique pouvant atteindre peau, articulations, reins et cœur.",
        "description": (
            "Le lupus est une maladie auto-immune chronique caractérisée par la production "
            "d'auto-anticorps anti-noyaux. Il évolue par poussées et peut toucher la quasi-totalité "
            "des organes."
        ),
        "severity": "severe",
        "category": "Auto-immune",
        "prevalence_per_100k": 70,
        "symptoms": [
            "Érythème en aile de papillon",
            "Photosensibilité",
            "Arthrites",
            "Néphrite lupique",
            "Asthénie",
            "Fièvre",
        ],
        "causes": [
            "Production d'anticorps anti-ADN, anti-Sm",
            "Activation immunitaire chronique",
        ],
        "risk_factors": [
            "Sexe féminin (9:1)",
            "Origine afro-caribéenne, asiatique",
            "Antécédents familiaux",
            "Hormones œstrogéniques",
        ],
        "treatments": [
            "Hydroxychloroquine",
            "Corticothérapie",
            "Mycophénolate, cyclophosphamide (atteinte rénale)",
            "Anifrolumab (anti-IFN-I)",
            "Bélimumab",
        ],
        "prevention": [
            "Photoprotection",
            "Vaccinations à jour",
        ],
        "organs": ["peau", "reins", "coeur"],
        "sub_organs": [],
        "related_diseases": ["polyarthrite-rhumatoide", "sclerose-en-plaques"],
        "epidemiology": {
            "globalCases": 5_000_000,
            "yearlyDeaths": 35_000,
            "mostAffectedAgeGroup": "20-40 ans",
            "sexRatio": "F 9 : H 1",
        },
        "timeline_base": (1990, 2_800_000, 0.02),
        "sources": [
            ("Lupus, Wikipedia", "https://en.wikipedia.org/wiki/Systemic_lupus_erythematosus", "wikipedia"),
        ],
    },
    {
        "slug": "sla",
        "name": "Sclérose latérale amyotrophique",
        "short_description": "Maladie de Charcot, dégénérescence progressive des motoneurones, létale.",
        "description": (
            "La SLA est une maladie neurodégénérative dégradant les motoneurones supérieurs et "
            "inférieurs. Elle entraîne une paralysie progressive. La survie médiane est de 3 à "
            "5 ans après le diagnostic."
        ),
        "severity": "critical",
        "category": "Neurologique",
        "prevalence_per_100k": 6,
        "symptoms": [
            "Faiblesse musculaire focale puis diffuse",
            "Fasciculations",
            "Atrophie musculaire",
            "Dysarthrie",
            "Dysphagie",
            "Insuffisance respiratoire (terminale)",
        ],
        "causes": [
            "Mutations C9orf72, SOD1, FUS, TARDBP",
            "Excitotoxicité au glutamate",
            "Stress oxydatif",
        ],
        "risk_factors": [
            "Antécédents familiaux (10 %)",
            "Âge > 50 ans",
            "Sexe masculin",
            "Service militaire (associations rapportées)",
        ],
        "treatments": [
            "Riluzole",
            "Édaravone",
            "Tofersen (SOD1)",
            "Ventilation non invasive",
            "Soins de support pluridisciplinaires",
        ],
        "prevention": [
            "Aucune connue",
        ],
        "organs": ["cerveau", "moelle-epiniere", "muscles"],
        "sub_organs": ["cortex-moteur", "rachis-cervical"],
        "related_diseases": ["parkinson", "alzheimer"],
        "epidemiology": {
            "globalCases": 450_000,
            "yearlyDeaths": 35_000,
            "mostAffectedAgeGroup": "55-75 ans",
            "sexRatio": "H 1.4 : F 1",
        },
        "history": [
            (1869, "Description par Jean-Martin Charcot."),
            (1995, "Riluzole, premier traitement."),
            (2023, "Tofersen approuvé pour la forme SOD1."),
        ],
        "timeline_base": (1990, 280_000, 0.014),
        "sources": [
            ("ALS, Wikipedia", "https://en.wikipedia.org/wiki/Amyotrophic_lateral_sclerosis", "wikipedia"),
        ],
    },
    {
        "slug": "epilepsie",
        "name": "Épilepsie",
        "short_description": "Trouble neurologique caractérisé par des crises récurrentes liées à des décharges anormales.",
        "description": (
            "L'épilepsie regroupe un ensemble de syndromes définis par la récurrence de crises "
            "non provoquées. Elle peut être focale ou généralisée. Plus de 50 % des cas sont "
            "idiopathiques."
        ),
        "severity": "moderate",
        "category": "Neurologique",
        "prevalence_per_100k": 730,
        "symptoms": [
            "Crises tonico-cloniques",
            "Absences",
            "Crises focales (sensitives, motrices, auras)",
            "Pertes de conscience",
            "Confusion post-critique",
        ],
        "causes": [
            "Lésions cérébrales (AVC, traumatismes)",
            "Mutations canalopathies (SCN1A)",
            "Sclérose hippocampique",
            "Tumeurs",
        ],
        "risk_factors": [
            "Antécédents familiaux",
            "Traumatisme crânien",
            "AVC",
            "Infections SNC (méningite)",
            "Privation de sommeil",
        ],
        "treatments": [
            "Antiépileptiques (lévétiracétam, lamotrigine, valproate)",
            "Régime cétogène (formes pédiatriques)",
            "Chirurgie (épilepsie temporale réfractaire)",
            "Stimulation du nerf vague",
        ],
        "prevention": [
            "Prévention des traumatismes crâniens",
            "Vaccination antipneumococcique",
        ],
        "organs": ["cerveau"],
        "sub_organs": ["lobe-temporal", "hippocampe"],
        "related_diseases": ["avc", "alzheimer"],
        "epidemiology": {
            "globalCases": 50_000_000,
            "yearlyDeaths": 125_000,
            "mostAffectedAgeGroup": "tous âges",
        },
        "timeline_base": (1990, 38_000_000, 0.008),
        "sources": [
            ("WHO, Epilepsy", "https://www.who.int/news-room/fact-sheets/detail/epilepsy", "who"),
        ],
    },
    {
        "slug": "migraine",
        "name": "Migraine",
        "short_description": "Céphalée primaire récurrente souvent invalidante avec aura possible.",
        "description": (
            "La migraine est une céphalée primaire pulsatile, unilatérale, durant 4 à 72 heures, "
            "souvent accompagnée de nausées et photophobie. Elle peut être précédée d'une aura "
            "(visuelle, sensitive)."
        ),
        "severity": "moderate",
        "category": "Neurologique",
        "prevalence_per_100k": 14_000,
        "symptoms": [
            "Céphalée pulsatile unilatérale",
            "Nausées, vomissements",
            "Photophobie, phonophobie",
            "Aura visuelle (scotomes scintillants)",
            "Allodynie",
        ],
        "causes": [
            "Hyperexcitabilité corticale",
            "Activation du système trigémino-vasculaire",
            "Libération de CGRP",
        ],
        "risk_factors": [
            "Sexe féminin (3:1)",
            "Antécédents familiaux",
            "Stress",
            "Dérèglements hormonaux",
            "Sommeil irrégulier",
        ],
        "treatments": [
            "Triptans",
            "AINS",
            "Anti-CGRP (érénumab, fremanezumab)",
            "Bêta-bloquants en prophylaxie",
            "Topiramate",
        ],
        "prevention": [
            "Hygiène de sommeil",
            "Éviter déclencheurs (alcool, jeûne)",
            "Gestion du stress",
        ],
        "organs": ["cerveau"],
        "sub_organs": ["nerf-trijumeau-v"],
        "related_diseases": ["depression", "anxiete"],
        "epidemiology": {
            "globalCases": 1_100_000_000,
            "yearlyDeaths": None,
            "mostAffectedAgeGroup": "20-50 ans",
            "sexRatio": "F 3 : H 1",
        },
        "timeline_base": (1990, 750_000_000, 0.013),
        "sources": [
            ("WHO, Headache disorders", "https://www.who.int/news-room/fact-sheets/detail/headache-disorders", "who"),
        ],
    },
    {
        "slug": "fibrillation-atriale",
        "name": "Fibrillation atriale",
        "short_description": "Trouble du rythme cardiaque le plus fréquent, source d'AVC ischémiques cardio-emboliques.",
        "description": (
            "La fibrillation atriale (FA) est une activité électrique chaotique des oreillettes "
            "qui ne se contractent plus efficacement. Elle multiplie par 5 le risque d'AVC."
        ),
        "severity": "severe",
        "category": "Cardiovasculaire",
        "prevalence_per_100k": 3300,
        "symptoms": [
            "Palpitations",
            "Dyspnée",
            "Asthénie",
            "Sensation de cœur irrégulier",
            "Forme silencieuse fréquente",
        ],
        "causes": [
            "Hypertension",
            "Cardiopathies",
            "Hyperthyroïdie",
            "Apnée du sommeil",
        ],
        "risk_factors": [
            "Âge > 65 ans",
            "Hypertension",
            "Diabète",
            "Consommation excessive d'alcool",
            "Obésité",
        ],
        "treatments": [
            "Anticoagulants (AOD : apixaban, rivaroxaban)",
            "Bêta-bloquants (contrôle fréquence)",
            "Cardioversion",
            "Ablation par cathéter",
        ],
        "prevention": [
            "Contrôle pression artérielle",
            "Limitation alcool",
            "Activité physique modérée",
        ],
        "organs": ["coeur"],
        "sub_organs": ["oreillette-d", "oreillette-g"],
        "related_diseases": ["avc", "infarctus-myocarde", "hypertension"],
        "epidemiology": {
            "globalCases": 60_000_000,
            "yearlyDeaths": 320_000,
            "mostAffectedAgeGroup": "> 65 ans",
        },
        "timeline_base": (1990, 25_000_000, 0.025),
        "sources": [
            ("Atrial fibrillation, Wikipedia", "https://en.wikipedia.org/wiki/Atrial_fibrillation", "wikipedia"),
        ],
    },
    {
        "slug": "insuffisance-cardiaque",
        "name": "Insuffisance cardiaque",
        "short_description": "Incapacité du cœur à pomper suffisamment pour répondre aux besoins métaboliques.",
        "description": (
            "L'insuffisance cardiaque est un syndrome clinique chronique caractérisé par une "
            "diminution de la fonction de pompe du cœur. Elle peut être à fraction d'éjection "
            "réduite ou préservée."
        ),
        "severity": "severe",
        "category": "Cardiovasculaire",
        "prevalence_per_100k": 800,
        "symptoms": [
            "Dyspnée d'effort puis de repos",
            "Œdèmes des membres inférieurs",
            "Asthénie",
            "Orthopnée",
            "Toux nocturne",
        ],
        "causes": [
            "Cardiopathie ischémique",
            "Hypertension",
            "Cardiomyopathies",
            "Valvulopathies",
        ],
        "risk_factors": [
            "Âge",
            "Hypertension",
            "Diabète",
            "Antécédent d'infarctus",
            "Consommation d'alcool",
        ],
        "treatments": [
            "IEC ou ARA-II / ARNI (sacubitril-valsartan)",
            "Bêta-bloquants",
            "Anti-aldostérone",
            "Inhibiteurs SGLT2",
            "Resynchronisation, défibrillateur",
        ],
        "prevention": [
            "Contrôle FdR cardiovasculaires",
            "Activité physique adaptée",
        ],
        "organs": ["coeur"],
        "sub_organs": ["ventricule-g"],
        "related_diseases": ["infarctus-myocarde", "hypertension", "fibrillation-atriale"],
        "epidemiology": {
            "globalCases": 64_000_000,
            "yearlyDeaths": 340_000,
            "mostAffectedAgeGroup": "> 65 ans",
        },
        "timeline_base": (1990, 32_000_000, 0.022),
        "sources": [
            ("Heart failure, Wikipedia", "https://en.wikipedia.org/wiki/Heart_failure", "wikipedia"),
        ],
    },
    {
        "slug": "cancer-colorectal",
        "name": "Cancer colorectal",
        "short_description": "3e cancer le plus fréquent dans le monde, dépistage par coloscopie.",
        "description": (
            "Le cancer colorectal résulte de la dégénérescence d'un polype adénomateux. La séquence "
            "adénome-cancer prend en moyenne 10 ans, justifiant le dépistage par coloscopie tous "
            "les 10 ans à partir de 45-50 ans."
        ),
        "severity": "severe",
        "category": "Cancer",
        "prevalence_per_100k": 280,
        "symptoms": [
            "Modification du transit",
            "Rectorragies",
            "Anémie ferriprive",
            "Douleurs abdominales",
            "Amaigrissement",
        ],
        "causes": [
            "Mutations APC, KRAS, TP53",
            "Polypose familiale",
            "Syndrome de Lynch",
        ],
        "risk_factors": [
            "Âge > 50 ans",
            "Régime riche en viandes rouges et transformées",
            "Faible consommation de fibres",
            "Sédentarité",
            "Obésité",
            "Antécédents familiaux",
            "Maladies inflammatoires intestinales",
        ],
        "treatments": [
            "Chirurgie (résection)",
            "Chimiothérapie (FOLFOX, FOLFIRI)",
            "Thérapies ciblées (anti-EGFR, anti-VEGF)",
            "Immunothérapie (formes MSI-H)",
        ],
        "prevention": [
            "Dépistage par test immunologique",
            "Coloscopie de surveillance",
            "Régime riche en fibres",
            "Activité physique",
        ],
        "organs": ["intestin"],
        "sub_organs": ["colon", "rectum"],
        "related_diseases": ["cancer-foie"],
        "epidemiology": {
            "globalCases": 1_930_000,
            "yearlyDeaths": 935_000,
            "mostAffectedAgeGroup": "60-80 ans",
        },
        "timeline_base": (1990, 850_000, 0.024),
        "sources": [
            ("WHO, Colorectal cancer", "https://www.who.int/news-room/fact-sheets/detail/colorectal-cancer", "who"),
        ],
    },
    {
        "slug": "leucemie",
        "name": "Leucémies",
        "short_description": "Cancer hématologique des cellules de la moelle osseuse, aiguës ou chroniques.",
        "description": (
            "Les leucémies sont des proliférations clonales de cellules hématopoïétiques. On "
            "distingue les leucémies aiguës (LAM, LAL) et chroniques (LMC, LLC). Les progrès "
            "thérapeutiques (imatinib, CAR-T) ont transformé le pronostic."
        ),
        "severity": "critical",
        "category": "Cancer",
        "prevalence_per_100k": 35,
        "symptoms": [
            "Asthénie, pâleur",
            "Hématomes spontanés",
            "Saignements",
            "Infections récurrentes",
            "Adénopathies",
            "Fièvre",
        ],
        "causes": [
            "Anomalies cytogénétiques (chromosome Philadelphie)",
            "Mutations BCR-ABL, FLT3, NPM1",
            "Exposition à des radiations ou benzène",
        ],
        "risk_factors": [
            "Antécédents de chimiothérapie",
            "Syndromes myélodysplasiques",
            "Trisomie 21 (LAM)",
            "Tabagisme",
        ],
        "treatments": [
            "Chimiothérapie d'induction",
            "Greffe de moelle osseuse",
            "Thérapies ciblées (imatinib, dasatinib)",
            "CAR-T cells (LAL réfractaire)",
            "Anticorps bispécifiques",
        ],
        "prevention": [
            "Limiter exposition au benzène",
            "Suivi des syndromes pré-leucémiques",
        ],
        "organs": ["squelette", "rate"],
        "sub_organs": [],
        "related_diseases": [],
        "epidemiology": {
            "globalCases": 480_000,
            "yearlyDeaths": 311_000,
            "mostAffectedAgeGroup": "Bimodale (enfants & > 60 ans)",
        },
        "history": [
            (1845, "Première description par Rudolf Virchow."),
            (2001, "Imatinib révolutionne la LMC."),
            (2017, "Approbation FDA des CAR-T."),
        ],
        "timeline_base": (1990, 200_000, 0.022),
        "sources": [
            ("Leukemia, Wikipedia", "https://en.wikipedia.org/wiki/Leukemia", "wikipedia"),
        ],
    },
    {
        "slug": "drepanocytose",
        "name": "Drépanocytose",
        "short_description": "Maladie génétique de l'hémoglobine, fréquente en Afrique subsaharienne et chez les afro-descendants.",
        "description": (
            "La drépanocytose est due à une mutation de l'hémoglobine (HbS) qui polymérise sous "
            "stress hypoxique, déformant les globules rouges en faucille. Elle entraîne anémie, "
            "crises vaso-occlusives douloureuses et atteintes d'organes."
        ),
        "severity": "severe",
        "category": "Génétique",
        "prevalence_per_100k": 130,
        "symptoms": [
            "Crises vaso-occlusives douloureuses",
            "Anémie chronique",
            "Ictère",
            "Syndrome thoracique aigu",
            "Priapisme",
            "Infections (asplénie fonctionnelle)",
        ],
        "causes": [
            "Mutation point HBB Glu6Val (homozygote)",
            "Polymérisation de la HbS désoxygénée",
        ],
        "risk_factors": [
            "Origine africaine, méditerranéenne, indienne",
            "Antécédents familiaux",
        ],
        "treatments": [
            "Hydroxyurée",
            "Transfusions",
            "Voxelotor, crizanlizumab",
            "Greffe de moelle (curative)",
            "Thérapie génique (Casgevy, exa-cel)",
        ],
        "prevention": [
            "Conseil génétique",
            "Dépistage néonatal",
            "Antibioprophylaxie chez l'enfant",
        ],
        "organs": ["squelette", "rate", "reins"],
        "sub_organs": [],
        "related_diseases": ["paludisme"],
        "epidemiology": {
            "globalCases": 8_000_000,
            "yearlyDeaths": 376_000,
            "mostAffectedAgeGroup": "tous âges",
        },
        "history": [
            (1910, "Première description par Herrick."),
            (1949, "Linus Pauling : première maladie moléculaire."),
            (2023, "Première thérapie génique CRISPR (Casgevy)."),
        ],
        "timeline_base": (1990, 4_500_000, 0.024),
        "sources": [
            ("WHO, Sickle cell disease", "https://www.who.int/news-room/fact-sheets/detail/sickle-cell-disease", "who"),
        ],
    },
    {
        "slug": "mucoviscidose",
        "name": "Mucoviscidose",
        "short_description": "Maladie génétique autosomique récessive affectant les épithéliums sécréteurs.",
        "description": (
            "La mucoviscidose est due à des mutations du gène CFTR. Elle entraîne un mucus "
            "épais bouchant les bronches et les canaux pancréatiques. L'arrivée des modulateurs "
            "CFTR (elexacaftor) a transformé l'espérance de vie."
        ),
        "severity": "severe",
        "category": "Génétique",
        "prevalence_per_100k": 12,
        "symptoms": [
            "Infections respiratoires récurrentes",
            "Toux chronique productive",
            "Insuffisance pancréatique exocrine",
            "Stéatorrhée",
            "Retard staturo-pondéral",
            "Stérilité masculine (CBAVD)",
        ],
        "causes": [
            "Mutations CFTR (F508del majoritaire)",
        ],
        "risk_factors": [
            "Origine caucasienne",
            "Antécédents familiaux",
        ],
        "treatments": [
            "Modulateurs CFTR (elexacaftor/tezacaftor/ivacaftor)",
            "Kinésithérapie respiratoire",
            "Antibiothérapies ciblées",
            "Enzymes pancréatiques",
            "Transplantation pulmonaire",
        ],
        "prevention": [
            "Dépistage néonatal (TIR)",
            "Conseil génétique",
        ],
        "organs": ["poumons", "pancreas"],
        "sub_organs": ["bronches", "alveoles"],
        "related_diseases": [],
        "epidemiology": {
            "globalCases": 105_000,
            "yearlyDeaths": 5_000,
            "mostAffectedAgeGroup": "tous âges",
        },
        "timeline_base": (1990, 70_000, 0.012),
        "sources": [
            ("Cystic fibrosis, Wikipedia", "https://en.wikipedia.org/wiki/Cystic_fibrosis", "wikipedia"),
        ],
    },
    {
        "slug": "cancer-prostate",
        "name": "Cancer de la prostate",
        "short_description": "Cancer le plus fréquent chez l'homme, souvent d'évolution lente.",
        "description": (
            "Le cancer de la prostate touche un homme sur huit. Il est souvent indolent mais "
            "certaines formes agressives nécessitent un traitement actif. Le PSA et l'IRM "
            "guident le dépistage."
        ),
        "severity": "moderate",
        "category": "Cancer",
        "prevalence_per_100k": 460,
        "symptoms": [
            "Souvent asymptomatique au début",
            "Troubles urinaires (dysurie)",
            "Hématurie",
            "Douleurs osseuses (métastases)",
        ],
        "causes": [
            "Mutations androgéno-dépendantes",
            "Mutations BRCA2, HOXB13",
        ],
        "risk_factors": [
            "Âge",
            "Antécédents familiaux",
            "Origine afro-caribéenne",
            "Mutations BRCA",
        ],
        "treatments": [
            "Surveillance active",
            "Prostatectomie radicale",
            "Radiothérapie (curiethérapie, IMRT)",
            "Hormonothérapie (LHRH)",
            "Inhibiteurs androgéniques (enzalutamide, abiratérone)",
        ],
        "prevention": [
            "Dépistage personnalisé (PSA selon FdR)",
        ],
        "organs": [],
        "sub_organs": [],
        "related_diseases": ["cancer-sein"],
        "epidemiology": {
            "globalCases": 1_460_000,
            "yearlyDeaths": 397_000,
            "mostAffectedAgeGroup": "> 65 ans",
            "sexRatio": "H 100 : F 0",
        },
        "timeline_base": (1990, 600_000, 0.025),
        "sources": [
            ("Prostate cancer, Wikipedia", "https://en.wikipedia.org/wiki/Prostate_cancer", "wikipedia"),
        ],
    },
    {
        "slug": "glaucome",
        "name": "Glaucome",
        "short_description": "Neuropathie optique progressive, deuxième cause mondiale de cécité.",
        "description": (
            "Le glaucome est une maladie chronique du nerf optique souvent associée à une "
            "augmentation de la pression intraoculaire. Asymptomatique au début, il entraîne "
            "une perte irréversible du champ visuel."
        ),
        "severity": "moderate",
        "category": "Neurologique",
        "prevalence_per_100k": 2200,
        "symptoms": [
            "Perte progressive du champ visuel périphérique",
            "Halos colorés (forme aiguë)",
            "Douleur (forme aiguë par fermeture de l'angle)",
        ],
        "causes": [
            "Augmentation pression intraoculaire",
            "Vasculopathie du nerf optique",
        ],
        "risk_factors": [
            "Âge",
            "Antécédents familiaux",
            "Myopie forte",
            "Origine afro-caribéenne",
            "Diabète",
        ],
        "treatments": [
            "Collyres hypotonisants (β-bloquants, prostaglandines)",
            "Trabéculoplastie laser (SLT)",
            "Trabéculectomie chirurgicale",
        ],
        "prevention": [
            "Dépistage tonométrique régulier > 40 ans",
        ],
        "organs": ["oeil"],
        "sub_organs": ["nerf-optique"],
        "related_diseases": ["diabete-type-2"],
        "epidemiology": {
            "globalCases": 80_000_000,
            "yearlyDeaths": None,
            "mostAffectedAgeGroup": "> 60 ans",
        },
        "timeline_base": (1990, 38_000_000, 0.024),
        "sources": [
            ("Glaucoma, Wikipedia", "https://en.wikipedia.org/wiki/Glaucoma", "wikipedia"),
        ],
    },
    {
        "slug": "schizophrenie",
        "name": "Schizophrénie",
        "short_description": "Trouble psychiatrique sévère caractérisé par des symptômes psychotiques.",
        "description": (
            "La schizophrénie est un trouble psychiatrique chronique avec des symptômes positifs "
            "(hallucinations, délires), négatifs (retrait, alogie) et cognitifs. Elle débute "
            "typiquement à l'adolescence ou chez le jeune adulte."
        ),
        "severity": "severe",
        "category": "Mentale",
        "prevalence_per_100k": 320,
        "symptoms": [
            "Hallucinations auditives",
            "Délires (paranoïa, mégalomanie)",
            "Discours désorganisé",
            "Apragmatisme",
            "Troubles cognitifs",
        ],
        "causes": [
            "Hyperdopaminergie mésolimbique",
            "Susceptibilité polygénique",
            "Anomalies neurodéveloppementales",
        ],
        "risk_factors": [
            "Antécédents familiaux",
            "Cannabis à l'adolescence",
            "Migration",
            "Naissance hivernale",
            "Complications obstétricales",
        ],
        "treatments": [
            "Antipsychotiques 2e génération (rispéridone, olanzapine, aripiprazole)",
            "Clozapine (formes résistantes)",
            "Psychoéducation, TCC",
            "Réhabilitation psychosociale",
        ],
        "prevention": [
            "Détection précoce des symptômes prodromiques",
            "Réduction du cannabis chez les sujets à risque",
        ],
        "organs": ["cerveau"],
        "sub_organs": ["lobe-frontal", "cortex-prefrontal"],
        "related_diseases": ["depression", "trouble-bipolaire"],
        "epidemiology": {
            "globalCases": 24_000_000,
            "yearlyDeaths": 80_000,
            "mostAffectedAgeGroup": "16-30 ans",
        },
        "timeline_base": (1990, 16_000_000, 0.013),
        "sources": [
            ("WHO, Schizophrenia", "https://www.who.int/news-room/fact-sheets/detail/schizophrenia", "who"),
        ],
    },
    {
        "slug": "trouble-bipolaire",
        "name": "Trouble bipolaire",
        "short_description": "Trouble de l'humeur alternant épisodes maniaques/hypomaniaques et dépressifs.",
        "description": (
            "Le trouble bipolaire (anciennement maladie maniaco-dépressive) alterne des phases "
            "d'élévation pathologique de l'humeur (manie ou hypomanie) et des épisodes dépressifs. "
            "On distingue les types I, II et le trouble cyclothymique."
        ),
        "severity": "severe",
        "category": "Mentale",
        "prevalence_per_100k": 700,
        "symptoms": [
            "Épisodes maniaques (humeur expansive, insomnie)",
            "Épisodes dépressifs",
            "Fluctuations rapides",
            "Comportements à risque",
            "Idées suicidaires",
        ],
        "causes": [
            "Susceptibilité génétique forte (héritabilité 70 %)",
            "Dérèglement circadien",
        ],
        "risk_factors": [
            "Antécédents familiaux",
            "Stress majeur",
            "Substances psychoactives",
        ],
        "treatments": [
            "Lithium",
            "Anticonvulsivants (valproate, lamotrigine)",
            "Antipsychotiques atypiques",
            "Psychoéducation",
        ],
        "prevention": [
            "Hygiène de sommeil régulière",
            "Évitement des substances",
        ],
        "organs": ["cerveau"],
        "sub_organs": ["lobe-frontal", "amygdale"],
        "related_diseases": ["depression", "schizophrenie"],
        "epidemiology": {
            "globalCases": 40_000_000,
            "yearlyDeaths": 110_000,
            "mostAffectedAgeGroup": "20-50 ans",
        },
        "timeline_base": (1990, 25_000_000, 0.014),
        "sources": [
            ("WHO, Bipolar disorder", "https://www.who.int/news-room/fact-sheets/detail/mental-disorders", "who"),
        ],
    },
    {
        "slug": "anemie-ferriprive",
        "name": "Anémie ferriprive",
        "short_description": "Anémie la plus fréquente, due à une carence en fer.",
        "description": (
            "L'anémie ferriprive résulte d'une carence en fer biodisponible. Elle touche "
            "principalement les femmes en âge de procréer, les enfants et les populations "
            "carencées."
        ),
        "severity": "moderate",
        "category": "Métabolique",
        "prevalence_per_100k": 24_000,
        "symptoms": [
            "Asthénie",
            "Pâleur",
            "Dyspnée d'effort",
            "Tachycardie",
            "Troubles trophiques (koïlonychie)",
            "Pica",
        ],
        "causes": [
            "Saignements chroniques (règles, digestifs)",
            "Apports insuffisants",
            "Malabsorption",
        ],
        "risk_factors": [
            "Sexe féminin",
            "Grossesse",
            "Régime végétalien strict",
            "Maladie cœliaque",
        ],
        "treatments": [
            "Supplémentation orale (sulfate ferreux)",
            "Fer IV en cas d'intolérance",
            "Traitement de la cause",
        ],
        "prevention": [
            "Apports alimentaires en fer",
            "Supplémentation prénatale",
        ],
        "organs": ["squelette"],
        "sub_organs": [],
        "related_diseases": [],
        "epidemiology": {
            "globalCases": 1_200_000_000,
            "yearlyDeaths": 50_000,
            "mostAffectedAgeGroup": "Femmes 15-49 ans",
        },
        "timeline_base": (1990, 1_500_000_000, -0.005),
        "sources": [
            ("WHO, Anaemia", "https://www.who.int/health-topics/anaemia", "who"),
        ],
    },
    {
        "slug": "ostroporose",
        "name": "Ostéoporose",
        "short_description": "Diminution de la masse osseuse exposant aux fractures, surtout chez la femme ménopausée.",
        "description": (
            "L'ostéoporose est une maladie systémique du squelette caractérisée par une "
            "diminution de la masse osseuse et une altération de la microarchitecture, "
            "augmentant le risque de fracture."
        ),
        "severity": "moderate",
        "category": "Métabolique",
        "prevalence_per_100k": 6500,
        "symptoms": [
            "Fractures de fragilité (col du fémur, vertèbres, poignet)",
            "Tassements vertébraux",
            "Diminution de la taille",
            "Cyphose dorsale",
        ],
        "causes": [
            "Carence œstrogénique post-ménopause",
            "Vieillissement osseux",
            "Corticothérapie prolongée",
        ],
        "risk_factors": [
            "Sexe féminin",
            "Ménopause précoce",
            "Antécédents familiaux",
            "Tabagisme",
            "Carence calcique et en vitamine D",
            "Sédentarité",
        ],
        "treatments": [
            "Bisphosphonates (alendronate, zolédronate)",
            "Dénosumab",
            "Tériparatide",
            "Romosozumab",
            "Apport calcium + vitamine D",
        ],
        "prevention": [
            "Activité physique en charge",
            "Apports calcium 1 000 mg/j",
            "Supplémentation vitamine D",
            "Arrêt du tabac",
        ],
        "organs": ["squelette"],
        "sub_organs": ["femur", "colonne-vertebrale"],
        "related_diseases": [],
        "epidemiology": {
            "globalCases": 200_000_000,
            "yearlyDeaths": 25_000,
            "mostAffectedAgeGroup": "Femmes > 50 ans",
        },
        "timeline_base": (1990, 90_000_000, 0.024),
        "sources": [
            ("Osteoporosis, Wikipedia", "https://en.wikipedia.org/wiki/Osteoporosis", "wikipedia"),
        ],
    },
    {
        "slug": "arthrose",
        "name": "Arthrose",
        "short_description": "Maladie articulaire dégénérative la plus fréquente.",
        "description": (
            "L'arthrose résulte d'une dégradation du cartilage articulaire avec remodelage "
            "osseux. Elle touche surtout genoux, hanches, mains et rachis. Les poussées sont "
            "inflammatoires."
        ),
        "severity": "moderate",
        "category": "Métabolique",
        "prevalence_per_100k": 7_000,
        "symptoms": [
            "Douleur mécanique",
            "Raideur après inactivité",
            "Crépitations articulaires",
            "Déformations",
            "Limitation fonctionnelle",
        ],
        "causes": [
            "Vieillissement du cartilage",
            "Surmenage articulaire",
            "Anomalies axiales",
            "Antécédents traumatiques",
        ],
        "risk_factors": [
            "Âge",
            "Surpoids (genou)",
            "Sexe féminin",
            "Antécédents familiaux",
            "Activités à fort impact",
        ],
        "treatments": [
            "Antalgiques (paracétamol, AINS)",
            "Kinésithérapie",
            "Infiltrations corticostéroïdes",
            "Acide hyaluronique",
            "Prothèses (hanche, genou)",
        ],
        "prevention": [
            "Maintien d'un poids sain",
            "Activité physique adaptée",
            "Renforcement musculaire",
        ],
        "organs": ["squelette", "muscles"],
        "sub_organs": ["femur", "rotule"],
        "related_diseases": [],
        "epidemiology": {
            "globalCases": 595_000_000,
            "yearlyDeaths": None,
            "mostAffectedAgeGroup": "> 50 ans",
        },
        "timeline_base": (1990, 280_000_000, 0.024),
        "sources": [
            ("Osteoarthritis, Wikipedia", "https://en.wikipedia.org/wiki/Osteoarthritis", "wikipedia"),
        ],
    },
    {
        "slug": "maladie-crohn",
        "name": "Maladie de Crohn",
        "short_description": "Maladie inflammatoire chronique de l'intestin (MICI) atteignant tout le tube digestif.",
        "description": (
            "La maladie de Crohn est une MICI granulomateuse pouvant toucher de la bouche à "
            "l'anus, le plus souvent l'iléon terminal. Elle évolue par poussées avec risque de "
            "complications chirurgicales."
        ),
        "severity": "severe",
        "category": "Auto-immune",
        "prevalence_per_100k": 320,
        "symptoms": [
            "Diarrhée chronique",
            "Douleurs abdominales",
            "Amaigrissement",
            "Fistules anales",
            "Manifestations extra-digestives (articulaires, cutanées)",
        ],
        "causes": [
            "Dysrégulation immunitaire muqueuse",
            "Microbiote altéré",
            "Susceptibilité NOD2/CARD15",
        ],
        "risk_factors": [
            "Antécédents familiaux",
            "Tabagisme",
            "Antibiothérapies répétées de l'enfance",
        ],
        "treatments": [
            "Corticothérapie",
            "Immunosuppresseurs (azathioprine)",
            "Anti-TNFα (infliximab, adalimumab)",
            "Vedolizumab, ustékinumab",
            "Chirurgie",
        ],
        "prevention": [
            "Sevrage tabagique",
        ],
        "organs": ["intestin"],
        "sub_organs": ["ileon", "colon"],
        "related_diseases": ["polyarthrite-rhumatoide"],
        "epidemiology": {
            "globalCases": 6_000_000,
            "yearlyDeaths": 41_000,
            "mostAffectedAgeGroup": "15-35 ans",
        },
        "timeline_base": (1990, 1_900_000, 0.04),
        "sources": [
            ("Crohn's disease, Wikipedia", "https://en.wikipedia.org/wiki/Crohn%27s_disease", "wikipedia"),
        ],
    },
    {
        "slug": "thyroidite-hashimoto",
        "name": "Thyroïdite de Hashimoto",
        "short_description": "Cause auto-immune la plus fréquente d'hypothyroïdie chronique.",
        "description": (
            "La thyroïdite de Hashimoto est une auto-agression de la thyroïde par les "
            "lymphocytes T. Elle aboutit à une hypothyroïdie chronique nécessitant un "
            "traitement substitutif à vie."
        ),
        "severity": "moderate",
        "category": "Auto-immune",
        "prevalence_per_100k": 1_500,
        "symptoms": [
            "Asthénie",
            "Frilosité",
            "Constipation",
            "Prise de poids",
            "Bradycardie",
            "Goitre indolore",
            "Troubles cognitifs",
        ],
        "causes": [
            "Anticorps anti-TPO et anti-thyroglobuline",
            "Susceptibilité HLA",
        ],
        "risk_factors": [
            "Sexe féminin (8:1)",
            "Antécédents familiaux",
            "Autres maladies auto-immunes",
        ],
        "treatments": [
            "Lévothyroxine à dose substitutive",
            "Surveillance TSH",
        ],
        "prevention": [
            "Apport iodé adéquat",
        ],
        "organs": ["thyroide"],
        "sub_organs": [],
        "related_diseases": ["lupus", "diabete-type-1"],
        "epidemiology": {
            "globalCases": 50_000_000,
            "yearlyDeaths": None,
            "mostAffectedAgeGroup": "30-60 ans",
            "sexRatio": "F 8 : H 1",
        },
        "timeline_base": (1990, 18_000_000, 0.028),
        "sources": [
            ("Hashimoto's thyroiditis, Wikipedia", "https://en.wikipedia.org/wiki/Hashimoto%27s_thyroiditis", "wikipedia"),
        ],
    },
    {
        "slug": "diabete-type-1",
        "name": "Diabète de type 1",
        "short_description": "Maladie auto-immune détruisant les cellules β pancréatiques productrices d'insuline.",
        "description": (
            "Le diabète de type 1 est dû à une destruction auto-immune des cellules β des îlots "
            "de Langerhans, conduisant à un déficit absolu en insuline. Il débute typiquement "
            "dans l'enfance ou l'adolescence."
        ),
        "severity": "severe",
        "category": "Auto-immune",
        "prevalence_per_100k": 480,
        "symptoms": [
            "Polyurie, polydipsie",
            "Amaigrissement rapide",
            "Asthénie",
            "Acidocétose inaugurale possible",
        ],
        "causes": [
            "Auto-immunité (anti-GAD, anti-IA2)",
            "Susceptibilité HLA-DR3/DR4",
            "Facteurs déclenchants viraux (entérovirus)",
        ],
        "risk_factors": [
            "Antécédents familiaux",
            "Origine européenne",
            "Maladies auto-immunes associées",
        ],
        "treatments": [
            "Insulinothérapie (basal-bolus, pompe)",
            "Capteurs de glucose en continu",
            "Pancréas artificiel hybride",
            "Greffe d'îlots / pancréas (exceptionnel)",
        ],
        "prevention": [
            "Aucune prévention prouvée",
            "Téplizumab à un stade pré-symptomatique (essais)",
        ],
        "organs": ["pancreas"],
        "sub_organs": ["ilots"],
        "related_diseases": ["diabete-type-2", "thyroidite-hashimoto"],
        "epidemiology": {
            "globalCases": 9_000_000,
            "yearlyDeaths": 35_000,
            "mostAffectedAgeGroup": "Enfants & jeunes adultes",
        },
        "timeline_base": (1990, 4_500_000, 0.022),
        "sources": [
            ("Type 1 diabetes, Wikipedia", "https://en.wikipedia.org/wiki/Type_1_diabetes", "wikipedia"),
        ],
    },
    {
        "slug": "rougeole",
        "name": "Rougeole",
        "short_description": "Maladie virale très contagieuse, prévenue par la vaccination ROR.",
        "description": (
            "La rougeole est une maladie éruptive très contagieuse (R0 ≈ 15) due au morbillivirus. "
            "Elle peut entraîner pneumonie, encéphalite et décès, surtout chez les enfants "
            "dénutris."
        ),
        "severity": "moderate",
        "category": "Infectieuse",
        "prevalence_per_100k": 110,
        "symptoms": [
            "Fièvre élevée",
            "Catarrhe oculo-nasal",
            "Signe de Köplik",
            "Éruption maculopapuleuse",
        ],
        "causes": [
            "Infection par le morbillivirus",
            "Transmission aérienne",
        ],
        "risk_factors": [
            "Non-vaccination",
            "Immunosuppression",
            "Dénutrition (carence vit. A)",
        ],
        "treatments": [
            "Symptomatique",
            "Supplémentation vit. A",
            "Antibiothérapie en cas de surinfection",
        ],
        "prevention": [
            "Vaccin ROR à 12 mois et 16-18 mois",
            "Vaccination des contacts adultes non immuns",
        ],
        "organs": ["poumons", "peau"],
        "sub_organs": [],
        "related_diseases": [],
        "epidemiology": {
            "globalCases": 9_000_000,
            "yearlyDeaths": 136_000,
            "mostAffectedAgeGroup": "Enfants",
        },
        "history": [
            (1963, "Premier vaccin antimorbilleux."),
            (2016, "Élimination déclarée dans les Amériques (puis perdue)."),
        ],
        "timeline_base": (1990, 35_000_000, -0.04),
        "sources": [
            ("WHO, Measles", "https://www.who.int/news-room/fact-sheets/detail/measles", "who"),
        ],
    },
    {
        "slug": "parkinsonisme-vasculaire",
        "name": "Parkinsonisme vasculaire",
        "short_description": "Syndrome parkinsonien d'origine ischémique, lié à des AVC sous-corticaux.",
        "description": (
            "Le parkinsonisme vasculaire est une cause secondaire de syndrome parkinsonien dû "
            "à des accidents vasculaires sous-corticaux multiples. Moins sensible à la L-DOPA "
            "que la maladie de Parkinson idiopathique."
        ),
        "severity": "moderate",
        "category": "Neurologique",
        "prevalence_per_100k": 60,
        "symptoms": [
            "Démarche à petits pas",
            "Akinésie",
            "Trouble cognitif vasculaire",
            "Instabilité posturale",
        ],
        "causes": [
            "AVC lacunaires multiples",
            "Leucoaraïose",
        ],
        "risk_factors": [
            "Hypertension",
            "Diabète",
            "Antécédents d'AVC",
        ],
        "treatments": [
            "Contrôle des facteurs de risque vasculaires",
            "Antiagrégants plaquettaires",
            "Réadaptation",
        ],
        "prevention": [
            "Prévention AVC",
        ],
        "organs": ["cerveau"],
        "sub_organs": ["ganglions-base"],
        "related_diseases": ["parkinson", "avc"],
        "epidemiology": {
            "globalCases": 700_000,
            "yearlyDeaths": 22_000,
            "mostAffectedAgeGroup": "> 70 ans",
        },
        "timeline_base": (1990, 240_000, 0.026),
        "sources": [
            ("Vascular parkinsonism, Wikipedia", "https://en.wikipedia.org/wiki/Vascular_parkinsonism", "wikipedia"),
        ],
    },
    {
        "slug": "cancer-foie",
        "name": "Cancer du foie",
        "short_description": "Carcinome hépatocellulaire le plus fréquent, complication majeure de la cirrhose.",
        "description": (
            "Le carcinome hépatocellulaire est la 6e cause de cancer mondial et la 3e cause de "
            "décès par cancer. Il survient le plus souvent sur foie cirrhotique."
        ),
        "severity": "critical",
        "category": "Cancer",
        "prevalence_per_100k": 110,
        "symptoms": [
            "Douleurs hypochondre droit",
            "Asthénie",
            "Amaigrissement",
            "Décompensation d'une cirrhose",
        ],
        "causes": [
            "Cirrhose (alcool, NASH, virus hépatites)",
            "Aflatoxines",
        ],
        "risk_factors": [
            "Hépatites B et C chroniques",
            "Alcool",
            "Stéatohépatite",
            "Diabète, obésité",
        ],
        "treatments": [
            "Résection chirurgicale",
            "Transplantation hépatique",
            "Radiofréquence",
            "Chimioembolisation",
            "Atézolizumab + bevacizumab",
        ],
        "prevention": [
            "Vaccination hépatite B",
            "Traitement antiviral hépatite C",
            "Limitation alcool",
            "Surveillance échographique semestrielle des cirrhoses",
        ],
        "organs": ["foie"],
        "sub_organs": ["lobe-droit"],
        "related_diseases": ["hepatite-b", "cancer-colorectal"],
        "epidemiology": {
            "globalCases": 906_000,
            "yearlyDeaths": 830_000,
            "mostAffectedAgeGroup": "60-75 ans",
        },
        "timeline_base": (1990, 300_000, 0.035),
        "sources": [
            ("WHO, Liver cancer", "https://www.who.int/news-room/fact-sheets/detail/liver-cancer", "who"),
        ],
    },
    {
        "slug": "tdah",
        "name": "TDAH",
        "short_description": "Trouble du neurodéveloppement avec inattention, impulsivité et hyperactivité.",
        "description": (
            "Le trouble déficit de l'attention avec ou sans hyperactivité (TDAH) est un trouble "
            "neurodéveloppemental débutant dans l'enfance, avec persistance fréquente à l'âge "
            "adulte. Il a une forte composante héritable (≈ 75 %)."
        ),
        "severity": "mild",
        "category": "Mentale",
        "prevalence_per_100k": 5_500,
        "symptoms": [
            "Inattention",
            "Hyperactivité motrice",
            "Impulsivité",
            "Difficultés exécutives",
            "Procrastination",
        ],
        "causes": [
            "Facteurs génétiques (gènes dopaminergiques)",
            "Anomalies frontales et striatales",
        ],
        "risk_factors": [
            "Antécédents familiaux",
            "Tabac/alcool pendant la grossesse",
            "Prématurité, petit poids de naissance",
        ],
        "treatments": [
            "Psychostimulants (méthylphénidate)",
            "Atomoxétine",
            "TCC",
            "Aménagements scolaires",
        ],
        "prevention": [
            "Réduction des expositions prénatales",
        ],
        "organs": ["cerveau"],
        "sub_organs": ["cortex-prefrontal"],
        "related_diseases": ["anxiete", "depression"],
        "epidemiology": {
            "globalCases": 366_000_000,
            "yearlyDeaths": None,
            "mostAffectedAgeGroup": "Enfants & jeunes adultes",
        },
        "timeline_base": (1990, 180_000_000, 0.018),
        "sources": [
            ("ADHD, Wikipedia", "https://en.wikipedia.org/wiki/Attention_deficit_hyperactivity_disorder", "wikipedia"),
        ],
    },
    {
        "slug": "autisme",
        "name": "Trouble du spectre de l'autisme",
        "short_description": "Trouble du neurodéveloppement caractérisé par des particularités sociales et sensorielles.",
        "description": (
            "Le trouble du spectre de l'autisme (TSA) regroupe des troubles neurodéveloppementaux "
            "caractérisés par des difficultés de communication sociale, des intérêts restreints "
            "et des particularités sensorielles. Le spectre est très hétérogène."
        ),
        "severity": "moderate",
        "category": "Mentale",
        "prevalence_per_100k": 1_000,
        "symptoms": [
            "Difficultés de communication sociale",
            "Intérêts restreints intenses",
            "Stéréotypies motrices",
            "Particularités sensorielles",
            "Difficultés de flexibilité",
        ],
        "causes": [
            "Forte composante génétique",
            "Anomalies neurodéveloppementales précoces",
        ],
        "risk_factors": [
            "Antécédents familiaux",
            "Âge paternel élevé",
            "Prématurité",
        ],
        "treatments": [
            "Interventions psycho-éducatives précoces",
            "Orthophonie, ergothérapie",
            "Aménagements scolaires",
            "Traitements symptomatiques (anxiété, sommeil)",
        ],
        "prevention": [
            "Aucune prévention primaire",
        ],
        "organs": ["cerveau"],
        "sub_organs": ["lobe-frontal"],
        "related_diseases": ["tdah"],
        "epidemiology": {
            "globalCases": 78_000_000,
            "yearlyDeaths": None,
            "mostAffectedAgeGroup": "tous âges",
        },
        "timeline_base": (1990, 8_000_000, 0.06),
        "sources": [
            ("WHO, Autism", "https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders", "who"),
        ],
    },
]
