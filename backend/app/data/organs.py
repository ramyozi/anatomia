"""Static organ catalogue. Sources: Wikipedia, Britannica, NIH."""

from typing import Any

ORGANS: list[dict[str, Any]] = [
    {
        "slug": "cerveau",
        "name": "Cerveau",
        "system": "nervous",
        "short_description": "Centre du système nerveux, siège de la pensée, du mouvement et des perceptions.",
        "description": (
            "Le cerveau est l'organe le plus complexe du corps humain, abritant environ "
            "86 milliards de neurones interconnectés. Il pilote la cognition, le langage, "
            "la motricité volontaire, les émotions, la mémoire et l'ensemble des fonctions "
            "vitales en lien avec le tronc cérébral."
        ),
        "functions": [
            "Cognition et pensée",
            "Mémoire à court et long terme",
            "Régulation hormonale (hypothalamus)",
            "Motricité volontaire",
            "Perception sensorielle",
            "Régulation émotionnelle",
            "Sommeil et éveil",
        ],
        "stats": {
            "weight": {"value": 1.4, "unit": "kg"},
            "size": "≈ 15 cm",
            "metrics": [
                {"label": "Neurones", "value": "86 milliards"},
                {"label": "Synapses", "value": "100 000 milliards"},
                {"label": "Conso. énergétique", "value": "20 % du corps"},
                {"label": "Débit sanguin", "value": "750 mL/min"},
                {"label": "Hémisphères", "value": "2"},
            ],
        },
        "sub_organs": [
            ("lobe-frontal", "Lobe frontal", "Planification, langage (aire de Broca), motricité volontaire et personnalité."),
            ("cortex-prefrontal", "Cortex préfrontal", "Fonctions exécutives, prise de décision, contrôle inhibiteur."),
            ("aire-broca", "Aire de Broca", "Production du langage articulé, dans le pied de la 3e circonvolution frontale."),
            ("cortex-moteur", "Cortex moteur primaire", "Aire motrice volontaire, organisée somatotopiquement (homonculus de Penfield)."),
            ("lobe-parietal", "Lobe pariétal", "Intégration sensorielle (toucher, douleur, proprioception), orientation spatiale."),
            ("cortex-somatosensoriel", "Cortex somatosensoriel", "Réception et traitement des sensations cutanées et proprioceptives."),
            ("lobe-temporal", "Lobe temporal", "Audition, mémoire (hippocampe), reconnaissance des visages."),
            ("aire-wernicke", "Aire de Wernicke", "Compréhension du langage oral et écrit, dans le lobe temporal gauche."),
            ("amygdale", "Amygdale", "Centre de la peur, de la mémoire émotionnelle, conditionnement aversif."),
            ("hippocampe", "Hippocampe", "Formation des souvenirs déclaratifs, navigation spatiale."),
            ("lobe-occipital", "Lobe occipital", "Traitement visuel primaire et reconnaissance des formes."),
            ("cortex-visuel-v1", "Cortex visuel V1", "Aire visuelle primaire, reçoit les afférences du corps genouillé latéral."),
            ("cervelet", "Cervelet", "Coordination motrice fine, équilibre et apprentissage moteur."),
            ("tronc-cerebral", "Tronc cérébral", "Fonctions vitales : respiration, rythme cardiaque, déglutition, éveil."),
            ("mesencephale", "Mésencéphale", "Étage supérieur du tronc cérébral, contrôle oculomoteur et substance noire."),
            ("pont", "Pont (protubérance)", "Relais entre cervelet et cortex, modulation du sommeil paradoxal."),
            ("bulbe-rachidien", "Bulbe rachidien", "Centres respiratoires et cardiaques autonomes."),
            ("hypothalamus", "Hypothalamus", "Homéostasie, régulation hormonale, thermorégulation, faim et soif."),
            ("thalamus", "Thalamus", "Relais sensoriel principal vers le cortex, sauf pour l'olfaction."),
            ("hypophyse", "Hypophyse", "Glande maître régulatrice du système endocrinien."),
            ("ganglions-base", "Ganglions de la base", "Noyaux sous-corticaux modulant le mouvement (substance noire, putamen)."),
            ("substance-noire", "Substance noire", "Source dopaminergique majeure, sa dégénérescence cause la maladie de Parkinson."),
            ("corps-calleux", "Corps calleux", "Faisceau de fibres reliant les deux hémisphères."),
            ("ventricules", "Ventricules cérébraux", "Cavités contenant le liquide céphalo-rachidien."),
        ],
        "sources": [
            ("Brain — Wikipedia", "https://en.wikipedia.org/wiki/Brain", "wikipedia"),
            ("NIH Brain Basics", "https://www.ninds.nih.gov/health-information/public-education/brain-basics", "nih"),
        ],
    },
    {
        "slug": "coeur",
        "name": "Cœur",
        "system": "cardiovascular",
        "short_description": "Pompe musculaire à quatre cavités qui propulse le sang dans tout l'organisme.",
        "description": (
            "Le cœur est un muscle creux d'environ 300 g qui se contracte sans relâche pour propulser "
            "le sang à travers la circulation pulmonaire et systémique. Il est constitué de quatre "
            "cavités — deux oreillettes et deux ventricules — séparées par des valves qui imposent un "
            "sens unique au flux sanguin."
        ),
        "functions": [
            "Circulation systémique",
            "Circulation pulmonaire",
            "Production de pression artérielle",
            "Sécrétion de peptides natriurétiques (ANP/BNP)",
        ],
        "stats": {
            "weight": {"value": 0.30, "unit": "kg"},
            "metrics": [
                {"label": "Battements / jour", "value": "≈ 100 000"},
                {"label": "Cavités", "value": "4"},
                {"label": "Débit cardiaque", "value": "5 L/min"},
                {"label": "Volume sanguin", "value": "5 L"},
                {"label": "Apex", "value": "5e espace intercostal"},
            ],
        },
        "sub_organs": [
            ("oreillette-d", "Oreillette droite", "Reçoit le sang désoxygéné des veines caves."),
            ("oreillette-g", "Oreillette gauche", "Reçoit le sang oxygéné des veines pulmonaires."),
            ("ventricule-d", "Ventricule droit", "Pompe le sang vers les poumons via l'artère pulmonaire."),
            ("ventricule-g", "Ventricule gauche", "Cavité la plus puissante, propulse le sang dans tout l'organisme."),
            ("valves", "Valves cardiaques", "Mitrale, tricuspide, aortique, pulmonaire — imposent le sens du flux."),
            ("noeud-sinusal", "Nœud sino-atrial", "Pacemaker naturel, déclenche le battement à 60-100 bpm."),
        ],
        "sources": [
            ("Heart — Wikipedia", "https://en.wikipedia.org/wiki/Heart", "wikipedia"),
            ("WHO — Cardiovascular diseases", "https://www.who.int/health-topics/cardiovascular-diseases", "who"),
        ],
    },
    {
        "slug": "poumons",
        "name": "Poumons",
        "system": "respiratory",
        "short_description": "Organes de la respiration, lieu des échanges gazeux entre l'air et le sang.",
        "description": (
            "Les poumons sont une paire d'organes spongieux qui permettent les échanges gazeux entre "
            "l'air inspiré et le sang. La surface alvéolaire totale équivaut à un demi-court de tennis. "
            "Le poumon droit comporte trois lobes, le gauche en a deux pour laisser place au cœur."
        ),
        "functions": [
            "Oxygénation du sang",
            "Élimination du CO₂",
            "Filtration des micro-emboles",
            "Régulation acido-basique",
        ],
        "stats": {
            "weight": {"value": 1.1, "unit": "kg (paire)"},
            "metrics": [
                {"label": "Surface alvéolaire", "value": "≈ 70 m²"},
                {"label": "Alvéoles", "value": "300 millions"},
                {"label": "Volume courant", "value": "500 mL"},
                {"label": "Capacité totale", "value": "6 L"},
                {"label": "Cycles / jour", "value": "≈ 22 000"},
            ],
        },
        "sub_organs": [
            ("trachee", "Trachée", "Conduit principal qui mène l'air vers les bronches."),
            ("bronches", "Bronches", "Ramifications principales menant à chaque poumon."),
            ("bronchioles", "Bronchioles", "Petites voies aériennes terminales avant les alvéoles."),
            ("alveoles", "Alvéoles", "Sacs aériens microscopiques où s'effectuent les échanges gazeux."),
            ("plevre", "Plèvre", "Membrane séreuse qui enveloppe chaque poumon."),
        ],
        "sources": [
            ("Lung — Wikipedia", "https://en.wikipedia.org/wiki/Lung", "wikipedia"),
            ("CDC — Lung diseases", "https://www.cdc.gov/lung-cancer/", "cdc"),
        ],
    },
    {
        "slug": "foie",
        "name": "Foie",
        "system": "digestive",
        "short_description": "Plus grosse glande de l'organisme, usine métabolique multifonction.",
        "description": (
            "Le foie est l'organe interne le plus volumineux. Il joue un rôle central dans le métabolisme "
            "(synthèse protéique, stockage du glucose), la détoxification, la production de bile et la "
            "régulation hormonale. Il possède une remarquable capacité de régénération."
        ),
        "functions": [
            "Détoxification",
            "Synthèse de protéines plasmatiques (albumine)",
            "Production de bile",
            "Stockage du glycogène et des vitamines",
            "Métabolisme des médicaments",
        ],
        "stats": {
            "weight": {"value": 1.5, "unit": "kg"},
            "metrics": [
                {"label": "Lobes", "value": "4"},
                {"label": "Régénération", "value": "jusqu'à 70 %"},
                {"label": "Bile produite / jour", "value": "≈ 1 L"},
                {"label": "Hépatocytes", "value": "≈ 240 milliards"},
            ],
        },
        "sub_organs": [
            ("lobe-droit", "Lobe droit", "Le plus volumineux, contient les segments V à VIII."),
            ("lobe-gauche", "Lobe gauche", "Plus petit, segments II à IV."),
            ("vesicule-biliaire", "Vésicule biliaire", "Stocke et concentre la bile entre les repas."),
        ],
        "sources": [
            ("Liver — Wikipedia", "https://en.wikipedia.org/wiki/Liver", "wikipedia"),
        ],
    },
    {
        "slug": "reins",
        "name": "Reins",
        "system": "urinary",
        "short_description": "Filtres du sang qui produisent l'urine et régulent l'équilibre hydrique.",
        "description": (
            "Les reins forment une paire d'organes en forme de haricot situés de part et d'autre de la "
            "colonne vertébrale. Ils filtrent quotidiennement environ 180 litres de plasma pour produire "
            "1,5 L d'urine, tout en régulant la pression artérielle, la production de globules rouges "
            "(érythropoïétine) et l'équilibre acido-basique."
        ),
        "functions": [
            "Filtration sanguine",
            "Production d'urine",
            "Régulation de la pression artérielle",
            "Sécrétion d'érythropoïétine",
            "Régulation du calcium (vitamine D active)",
        ],
        "stats": {
            "weight": {"value": 0.30, "unit": "kg (paire)"},
            "metrics": [
                {"label": "Néphrons / rein", "value": "≈ 1 million"},
                {"label": "Filtration / jour", "value": "180 L"},
                {"label": "Urine / jour", "value": "1.5 L"},
                {"label": "Débit sanguin", "value": "20 % du débit cardiaque"},
            ],
        },
        "sub_organs": [
            ("nephron", "Néphron", "Unité fonctionnelle de filtration."),
            ("glomerule", "Glomérule", "Réseau capillaire qui filtre le plasma."),
            ("tube-collecteur", "Tube collecteur", "Concentre l'urine et l'achemine vers les uretères."),
        ],
        "sources": [
            ("Kidney — Wikipedia", "https://en.wikipedia.org/wiki/Kidney", "wikipedia"),
            ("NIH — Kidney Disease", "https://www.niddk.nih.gov/health-information/kidney-disease", "nih"),
        ],
    },
    {
        "slug": "estomac",
        "name": "Estomac",
        "system": "digestive",
        "short_description": "Poche musculaire qui dégrade les aliments par action acide et enzymatique.",
        "description": (
            "L'estomac sécrète quotidiennement 2 à 3 litres de suc gastrique acide (pH ≈ 1,5) "
            "et de pepsine pour entamer la digestion des protéines. Sa muqueuse est protégée par "
            "une couche de mucus alcalin produite en continu."
        ),
        "functions": [
            "Digestion des protéines",
            "Acidification du bol alimentaire",
            "Sécrétion du facteur intrinsèque (vitamine B12)",
            "Stockage temporaire",
        ],
        "stats": {
            "metrics": [
                {"label": "Capacité", "value": "≈ 1 L (jusqu'à 4 L)"},
                {"label": "pH", "value": "1.5 - 3.5"},
                {"label": "Suc gastrique / jour", "value": "2-3 L"},
            ],
        },
        "sub_organs": [
            ("cardia", "Cardia", "Région d'entrée connectée à l'œsophage."),
            ("fundus", "Fundus", "Dôme supérieur où s'accumulent les gaz."),
            ("antre", "Antre pylorique", "Région distale, brassage et évacuation."),
            ("pylore", "Pylore", "Sphincter contrôlant le passage vers le duodénum."),
        ],
        "sources": [
            ("Stomach — Wikipedia", "https://en.wikipedia.org/wiki/Stomach", "wikipedia"),
        ],
    },
    {
        "slug": "intestin",
        "name": "Intestins",
        "system": "digestive",
        "short_description": "Tube digestif où s'effectue l'absorption des nutriments et la finalisation de la digestion.",
        "description": (
            "L'intestin grêle (≈ 6 m) absorbe la majorité des nutriments, tandis que le côlon (≈ 1,5 m) "
            "réabsorbe l'eau et héberge le microbiote. La surface d'absorption totale, grâce aux villosités, "
            "atteint près de 250 m²."
        ),
        "functions": [
            "Absorption des nutriments",
            "Hébergement du microbiote",
            "Réabsorption de l'eau",
            "Immunité (plaques de Peyer)",
        ],
        "stats": {
            "metrics": [
                {"label": "Longueur grêle", "value": "≈ 6 m"},
                {"label": "Longueur côlon", "value": "≈ 1.5 m"},
                {"label": "Surface d'absorption", "value": "≈ 250 m²"},
                {"label": "Microbes", "value": "100 000 milliards"},
            ],
        },
        "sub_organs": [
            ("duodenum", "Duodénum", "Première portion de l'intestin grêle, lieu d'arrivée de la bile et du suc pancréatique."),
            ("jejunum", "Jéjunum", "Portion centrale, absorption majoritaire des nutriments."),
            ("ileon", "Iléon", "Portion terminale, absorption B12 et sels biliaires."),
            ("colon", "Côlon", "Réabsorption hydrique, formation des selles, microbiote."),
            ("rectum", "Rectum", "Stockage des selles avant défécation."),
        ],
        "sources": [
            ("Small intestine — Wikipedia", "https://en.wikipedia.org/wiki/Small_intestine", "wikipedia"),
        ],
    },
    {
        "slug": "pancreas",
        "name": "Pancréas",
        "system": "endocrine",
        "short_description": "Glande mixte exocrine et endocrine cruciale pour la digestion et la glycémie.",
        "description": (
            "Le pancréas combine une fonction exocrine (sécrétion de suc digestif riche en enzymes) et "
            "une fonction endocrine (insuline et glucagon par les îlots de Langerhans), régulant la "
            "glycémie en continu."
        ),
        "functions": [
            "Sécrétion d'insuline",
            "Sécrétion de glucagon",
            "Production de suc pancréatique",
            "Sécrétion de bicarbonate",
        ],
        "stats": {
            "metrics": [
                {"label": "Longueur", "value": "≈ 15 cm"},
                {"label": "Îlots de Langerhans", "value": "≈ 1 million"},
                {"label": "Suc / jour", "value": "≈ 1.5 L"},
            ],
        },
        "sub_organs": [
            ("ilots", "Îlots de Langerhans", "Cellules endocrines (α, β, δ) productrices d'hormones."),
        ],
        "sources": [
            ("Pancreas — Wikipedia", "https://en.wikipedia.org/wiki/Pancreas", "wikipedia"),
        ],
    },
    {
        "slug": "peau",
        "name": "Peau",
        "system": "integumentary",
        "short_description": "Plus grand organe du corps, barrière protectrice et sensorielle.",
        "description": (
            "La peau est l'organe le plus étendu du corps humain. Elle constitue une barrière contre les "
            "agressions, régule la température, perçoit le toucher et synthétise la vitamine D sous "
            "exposition UV."
        ),
        "functions": [
            "Barrière physique et chimique",
            "Thermorégulation",
            "Perception sensorielle (toucher, douleur)",
            "Synthèse de vitamine D",
            "Excrétion (sueur)",
        ],
        "stats": {
            "metrics": [
                {"label": "Surface", "value": "≈ 2 m²"},
                {"label": "Poids", "value": "≈ 4 kg"},
                {"label": "Renouvellement", "value": "≈ 28 jours"},
                {"label": "Couches", "value": "3 (épi/derme/hypoderme)"},
            ],
        },
        "sub_organs": [
            ("epiderme", "Épiderme", "Couche superficielle, kératinocytes et mélanocytes."),
            ("derme", "Derme", "Couche conjonctive, vaisseaux et terminaisons nerveuses."),
            ("hypoderme", "Hypoderme", "Tissu adipeux sous-cutané, isolation thermique."),
        ],
        "sources": [
            ("Skin — Wikipedia", "https://en.wikipedia.org/wiki/Skin", "wikipedia"),
        ],
    },
    {
        "slug": "oeil",
        "name": "Yeux",
        "system": "sensory",
        "short_description": "Organes de la vision, capables de discriminer plusieurs millions de couleurs.",
        "description": (
            "L'œil capte la lumière à travers la cornée et le cristallin, la projette sur la rétine "
            "où photorécepteurs (cônes et bâtonnets) la convertissent en signaux nerveux acheminés "
            "au cerveau via le nerf optique."
        ),
        "functions": [
            "Vision diurne et nocturne",
            "Perception des couleurs",
            "Vision stéréoscopique",
            "Suivi des mouvements",
        ],
        "stats": {
            "metrics": [
                {"label": "Photorécepteurs", "value": "≈ 130 millions"},
                {"label": "Champ visuel binoculaire", "value": "≈ 200°"},
                {"label": "Cils", "value": "150-200 par paupière"},
            ],
        },
        "sub_organs": [
            ("cornee", "Cornée", "Membrane transparente antérieure, principal milieu réfringent."),
            ("cristallin", "Cristallin", "Lentille biologique permettant l'accommodation."),
            ("retine", "Rétine", "Tissu nerveux contenant cônes et bâtonnets."),
            ("nerf-optique", "Nerf optique", "Achemine l'information visuelle au cerveau."),
        ],
        "sources": [
            ("Human eye — Wikipedia", "https://en.wikipedia.org/wiki/Human_eye", "wikipedia"),
        ],
    },
    {
        "slug": "thyroide",
        "name": "Thyroïde",
        "system": "endocrine",
        "short_description": "Glande en forme de papillon qui régule le métabolisme via T3 et T4.",
        "description": (
            "La thyroïde produit les hormones T3 et T4 qui régulent le métabolisme basal, la croissance "
            "et l'usage de l'oxygène. Sa carence (hypothyroïdie) ou son hyperactivité (Graves-Basedow) "
            "perturbent gravement de nombreuses fonctions."
        ),
        "functions": [
            "Sécrétion de T3 et T4",
            "Régulation du métabolisme basal",
            "Sécrétion de calcitonine (cellules C)",
        ],
        "stats": {
            "metrics": [
                {"label": "Poids", "value": "≈ 25 g"},
                {"label": "Hormones produites", "value": "T3, T4, calcitonine"},
            ],
        },
        "sub_organs": [],
        "sources": [
            ("Thyroid — Wikipedia", "https://en.wikipedia.org/wiki/Thyroid", "wikipedia"),
        ],
    },
    {
        "slug": "rate",
        "name": "Rate",
        "system": "lymphatic",
        "short_description": "Filtre du sang et acteur clé de l'immunité adaptative.",
        "description": (
            "La rate filtre les globules rouges vieillissants, héberge des lymphocytes et joue un rôle "
            "majeur dans la réponse immunitaire à certains pathogènes encapsulés."
        ),
        "functions": [
            "Filtration des globules rouges",
            "Stockage de plaquettes",
            "Immunité (lymphocytes)",
        ],
        "stats": {
            "metrics": [
                {"label": "Poids", "value": "≈ 150 g"},
                {"label": "Globules rouges filtrés / jour", "value": "≈ 200 milliards"},
            ],
        },
        "sub_organs": [],
        "sources": [
            ("Spleen — Wikipedia", "https://en.wikipedia.org/wiki/Spleen", "wikipedia"),
        ],
    },
    {
        "slug": "vessie",
        "name": "Vessie",
        "system": "urinary",
        "short_description": "Réservoir musculaire qui collecte l'urine avant son évacuation.",
        "description": (
            "Organe creux et extensible, la vessie peut contenir jusqu'à 500 mL d'urine. Le détrusor "
            "se contracte sur ordre nerveux pour la vider via l'urètre."
        ),
        "functions": [
            "Stockage de l'urine",
            "Évacuation contrôlée",
        ],
        "stats": {
            "metrics": [
                {"label": "Capacité moyenne", "value": "300-500 mL"},
                {"label": "Évacuations / jour", "value": "4-7"},
            ],
        },
        "sub_organs": [],
        "sources": [
            ("Urinary bladder — Wikipedia", "https://en.wikipedia.org/wiki/Urinary_bladder", "wikipedia"),
        ],
    },
]
