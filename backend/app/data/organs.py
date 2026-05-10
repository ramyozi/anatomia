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
            ("Brain, Wikipedia", "https://en.wikipedia.org/wiki/Brain", "wikipedia"),
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
            "cavités, deux oreillettes et deux ventricules, séparées par des valves qui imposent un "
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
            ("valves", "Valves cardiaques", "Mitrale, tricuspide, aortique, pulmonaire, imposent le sens du flux."),
            ("noeud-sinusal", "Nœud sino-atrial", "Pacemaker naturel, déclenche le battement à 60-100 bpm."),
        ],
        "sources": [
            ("Heart, Wikipedia", "https://en.wikipedia.org/wiki/Heart", "wikipedia"),
            ("WHO, Cardiovascular diseases", "https://www.who.int/health-topics/cardiovascular-diseases", "who"),
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
            ("Lung, Wikipedia", "https://en.wikipedia.org/wiki/Lung", "wikipedia"),
            ("CDC, Lung diseases", "https://www.cdc.gov/lung-cancer/", "cdc"),
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
            ("Liver, Wikipedia", "https://en.wikipedia.org/wiki/Liver", "wikipedia"),
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
            ("Kidney, Wikipedia", "https://en.wikipedia.org/wiki/Kidney", "wikipedia"),
            ("NIH, Kidney Disease", "https://www.niddk.nih.gov/health-information/kidney-disease", "nih"),
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
            ("Stomach, Wikipedia", "https://en.wikipedia.org/wiki/Stomach", "wikipedia"),
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
            ("Small intestine, Wikipedia", "https://en.wikipedia.org/wiki/Small_intestine", "wikipedia"),
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
            ("Pancreas, Wikipedia", "https://en.wikipedia.org/wiki/Pancreas", "wikipedia"),
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
            ("Skin, Wikipedia", "https://en.wikipedia.org/wiki/Skin", "wikipedia"),
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
            ("Human eye, Wikipedia", "https://en.wikipedia.org/wiki/Human_eye", "wikipedia"),
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
            ("Thyroid, Wikipedia", "https://en.wikipedia.org/wiki/Thyroid", "wikipedia"),
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
            ("Spleen, Wikipedia", "https://en.wikipedia.org/wiki/Spleen", "wikipedia"),
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
            ("Urinary bladder, Wikipedia", "https://en.wikipedia.org/wiki/Urinary_bladder", "wikipedia"),
        ],
    },
    {
        "slug": "squelette",
        "name": "Squelette",
        "system": "skeletal",
        "short_description": "Charpente de 206 os assurant soutien, protection, mouvement et hématopoïèse.",
        "description": (
            "Le squelette adulte comporte 206 os reliés par des articulations. Il protège les "
            "organes vitaux (boîte crânienne, cage thoracique, rachis), constitue le levier des "
            "muscles et abrite la moelle osseuse hématopoïétique."
        ),
        "functions": [
            "Soutien et posture",
            "Protection des organes",
            "Levier pour les muscles",
            "Production des cellules sanguines (moelle rouge)",
            "Réservoir de calcium et phosphate",
        ],
        "stats": {
            "metrics": [
                {"label": "Os", "value": "206"},
                {"label": "Articulations", "value": "≈ 360"},
                {"label": "Os le plus long", "value": "Fémur"},
                {"label": "Os le plus petit", "value": "Étrier"},
                {"label": "Renouvellement annuel", "value": "7-10 %"},
            ],
        },
        "sub_organs": [
            ("crane", "Crâne", "22 os formant la boîte crânienne et la face."),
            ("colonne-vertebrale", "Colonne vertébrale", "33 vertèbres : 7 cervicales, 12 thoraciques, 5 lombaires, sacrum, coccyx."),
            ("vertebre-c1", "Atlas (C1)", "Première vertèbre cervicale, supporte le crâne."),
            ("vertebre-c2", "Axis (C2)", "Deuxième vertèbre cervicale, permet la rotation de la tête."),
            ("cage-thoracique", "Cage thoracique", "12 paires de côtes + sternum, protège cœur et poumons."),
            ("sternum", "Sternum", "Os plat médian sur lequel s'attachent les côtes."),
            ("clavicule", "Clavicule", "Os reliant le sternum à l'omoplate."),
            ("omoplate", "Omoplate (scapula)", "Os plat de la ceinture scapulaire."),
            ("humerus", "Humérus", "Os long du bras."),
            ("radius", "Radius", "Os latéral de l'avant-bras."),
            ("ulna", "Ulna (cubitus)", "Os médial de l'avant-bras."),
            ("bassin", "Bassin", "Os iliaque + sacrum, soutient la colonne et abrite les organes pelviens."),
            ("femur", "Fémur", "Os le plus long et le plus solide du corps."),
            ("rotule", "Rotule (patella)", "Os sésamoïde du genou."),
            ("tibia", "Tibia", "Os médial de la jambe, supporte le poids du corps."),
            ("perone", "Péroné (fibula)", "Os latéral de la jambe."),
            ("etrier", "Étrier", "Plus petit os du corps, oreille moyenne (≈ 3 mm)."),
        ],
        "sources": [
            ("Skeleton, Wikipedia", "https://en.wikipedia.org/wiki/Human_skeleton", "wikipedia"),
            ("NIH, Bone biology", "https://www.bones.nih.gov/health-info/bone/bone-health/what-is-bone", "nih"),
        ],
    },
    {
        "slug": "muscles",
        "name": "Muscles",
        "system": "muscular",
        "short_description": "Environ 640 muscles squelettiques générant la force par contraction de fibres myocytaires.",
        "description": (
            "Le système musculaire produit le mouvement, maintient la posture et génère de la "
            "chaleur. Les muscles striés squelettiques (≈ 640) sont volontaires ; le myocarde et "
            "les muscles lisses (digestif, vasculaire) sont involontaires."
        ),
        "functions": [
            "Mouvement volontaire",
            "Posture et équilibre",
            "Thermogenèse (frissons)",
            "Pompe veineuse",
        ],
        "stats": {
            "metrics": [
                {"label": "Muscles squelettiques", "value": "≈ 640"},
                {"label": "% masse corporelle", "value": "40 %"},
                {"label": "Plus gros", "value": "Grand fessier"},
                {"label": "Le plus rapide", "value": "Orbiculaire de l'œil"},
                {"label": "Plus puissant", "value": "Masséter"},
            ],
        },
        "sub_organs": [
            ("pectoral", "Grand pectoral", "Muscle large de la poitrine, adducteur du bras."),
            ("deltoide", "Deltoïde", "Muscle de l'épaule, abducteur du bras."),
            ("biceps", "Biceps brachial", "Fléchisseur de l'avant-bras et supinateur."),
            ("triceps", "Triceps brachial", "Extenseur de l'avant-bras."),
            ("trapeze", "Trapèze", "Muscle dorsal supérieur, élévateur de l'épaule."),
            ("grand-dorsal", "Grand dorsal", "Adducteur et rotateur interne de l'humérus."),
            ("grand-fessier", "Grand fessier", "Muscle le plus volumineux, extenseur de la cuisse."),
            ("quadriceps", "Quadriceps fémoral", "Extenseur du genou, 4 chefs."),
            ("ischio-jambiers", "Ischio-jambiers", "Fléchisseurs du genou et extenseurs de la hanche."),
            ("triceps-sural", "Triceps sural", "Mollet, contient gastrocnémien et soléaire."),
            ("abdominaux", "Grands droits de l'abdomen", "Muscle central abdominal, fléchisseur du tronc."),
            ("obliques", "Obliques", "Rotateurs et fléchisseurs latéraux du tronc."),
            ("masseter", "Masséter", "Muscle masticateur le plus puissant du corps."),
            ("diaphragme", "Diaphragme", "Muscle respiratoire principal."),
        ],
        "sources": [
            ("Muscle, Wikipedia", "https://en.wikipedia.org/wiki/Muscle", "wikipedia"),
        ],
    },
    {
        "slug": "moelle-epiniere",
        "name": "Moelle épinière",
        "system": "nervous",
        "short_description": "Cordon nerveux logé dans le canal rachidien, voie de communication entre cerveau et corps.",
        "description": (
            "La moelle épinière s'étend de la base du crâne jusqu'à L1-L2 chez l'adulte. Elle "
            "contient les voies sensitives ascendantes et motrices descendantes, et héberge les "
            "circuits réflexes segmentaires."
        ),
        "functions": [
            "Conduction sensorielle vers le cerveau",
            "Conduction motrice vers les muscles",
            "Réflexes médullaires",
            "Régulation autonome",
        ],
        "stats": {
            "metrics": [
                {"label": "Longueur", "value": "≈ 45 cm"},
                {"label": "Diamètre", "value": "1-1.5 cm"},
                {"label": "Segments", "value": "31 (8C, 12T, 5L, 5S, 1Co)"},
            ],
        },
        "sub_organs": [
            ("rachis-cervical", "Rachis cervical (C1-C8)", "Innervation cou, diaphragme, membres supérieurs."),
            ("rachis-thoracique", "Rachis thoracique (T1-T12)", "Innervation tronc et viscères thoraciques."),
            ("rachis-lombaire", "Rachis lombaire (L1-L5)", "Innervation membres inférieurs (en partie)."),
            ("rachis-sacre", "Rachis sacré (S1-S5)", "Innervation pelvis, organes génito-urinaires, jambes."),
            ("queue-cheval", "Queue de cheval", "Faisceau de racines nerveuses lombaires et sacrées."),
        ],
        "sources": [
            ("Spinal cord, Wikipedia", "https://en.wikipedia.org/wiki/Spinal_cord", "wikipedia"),
        ],
    },
    {
        "slug": "nerfs-peripheriques",
        "name": "Nerfs périphériques",
        "system": "nervous",
        "short_description": "Nerfs crâniens et spinaux assurant la transmission entre SNC et organes/muscles.",
        "description": (
            "Le système nerveux périphérique est constitué de 12 paires de nerfs crâniens "
            "(émergeant directement du cerveau) et 31 paires de nerfs spinaux. Il transmet les "
            "informations sensorielles et motrices."
        ),
        "functions": [
            "Innervation sensorielle",
            "Innervation motrice somatique",
            "Innervation autonome (sympathique/parasympathique)",
        ],
        "stats": {
            "metrics": [
                {"label": "Nerfs crâniens", "value": "12 paires"},
                {"label": "Nerfs spinaux", "value": "31 paires"},
                {"label": "Vitesse max", "value": "120 m/s"},
            ],
        },
        "sub_organs": [
            ("nerf-optique-ii", "Nerf optique (II)", "Transmet l'information visuelle de la rétine au cerveau."),
            ("nerf-trijumeau-v", "Nerf trijumeau (V)", "Sensibilité de la face et muscles masticateurs."),
            ("nerf-facial-vii", "Nerf facial (VII)", "Mimique faciale, gustation antérieure de la langue."),
            ("nerf-vague-x", "Nerf vague (X)", "Innervation parasympathique des viscères thoraciques et abdominaux."),
            ("nerf-sciatique", "Nerf sciatique", "Plus gros nerf du corps, innerve la face postérieure de la jambe."),
            ("nerf-median", "Nerf médian", "Innervation de la face palmaire de la main, sujet au syndrome du canal carpien."),
            ("nerf-radial", "Nerf radial", "Extension du poignet et des doigts."),
            ("nerf-femoral", "Nerf fémoral", "Innervation du quadriceps et de la peau antérieure de la cuisse."),
        ],
        "sources": [
            ("Peripheral nervous system, Wikipedia", "https://en.wikipedia.org/wiki/Peripheral_nervous_system", "wikipedia"),
        ],
    },
    {
        "slug": "vaisseaux-sanguins",
        "name": "Vaisseaux sanguins",
        "system": "cardiovascular",
        "short_description": "Réseau de 100 000 km transportant le sang à travers tout l'organisme.",
        "description": (
            "Les vaisseaux sanguins forment un circuit fermé avec le cœur. Les artères transportent "
            "le sang oxygéné sous haute pression, les veines le ramènent à basse pression, et les "
            "capillaires (≈ 5-10 μm) permettent les échanges avec les tissus."
        ),
        "functions": [
            "Transport O₂ et CO₂",
            "Transport des nutriments",
            "Distribution hormonale",
            "Thermorégulation cutanée",
        ],
        "stats": {
            "metrics": [
                {"label": "Longueur totale", "value": "≈ 100 000 km"},
                {"label": "Capillaires", "value": "≈ 40 milliards"},
                {"label": "Diamètre aorte", "value": "2.5 cm"},
                {"label": "Diamètre capillaire", "value": "5-10 μm"},
            ],
        },
        "sub_organs": [
            ("aorte", "Aorte", "Plus grosse artère, naît du ventricule gauche."),
            ("carotides", "Carotides", "Artères du cou irriguant le cerveau."),
            ("coronaires", "Artères coronaires", "Vascularisent le myocarde."),
            ("pulmonaires", "Artères pulmonaires", "Transportent le sang désoxygéné vers les poumons."),
            ("veine-cave", "Veine cave", "Ramène le sang désoxygéné au cœur droit."),
            ("veines-pulmonaires", "Veines pulmonaires", "Ramènent le sang oxygéné des poumons."),
            ("femorale", "Artère fémorale", "Vascularise le membre inférieur."),
            ("capillaires", "Capillaires", "Réseau d'échange tissulaire le plus fin."),
        ],
        "sources": [
            ("Blood vessel, Wikipedia", "https://en.wikipedia.org/wiki/Blood_vessel", "wikipedia"),
        ],
    },
    {
        "slug": "dents",
        "name": "Dents",
        "system": "digestive",
        "short_description": "32 dents adultes assurant la mastication et la phonation.",
        "description": (
            "L'adulte possède 32 dents permanentes : 8 incisives, 4 canines, 8 prémolaires et "
            "12 molaires (incluant les dents de sagesse). Chaque dent est constituée d'émail, "
            "de dentine, de pulpe et de cément."
        ),
        "functions": [
            "Mastication",
            "Phonation",
            "Maintien du visage",
        ],
        "stats": {
            "metrics": [
                {"label": "Dents adulte", "value": "32"},
                {"label": "Dents lait", "value": "20"},
                {"label": "Émail", "value": "Tissu le plus dur du corps"},
            ],
        },
        "sub_organs": [
            ("incisives", "Incisives", "8 dents antérieures à bord tranchant."),
            ("canines", "Canines", "4 dents pointues, déchirent la nourriture."),
            ("premolaires", "Prémolaires", "8 dents intermédiaires à 2 cuspides."),
            ("molaires", "Molaires", "12 dents postérieures à 4-5 cuspides, broient la nourriture."),
            ("dents-sagesse", "Dents de sagesse", "3e molaires, éruption tardive (17-25 ans)."),
        ],
        "sources": [
            ("Tooth, Wikipedia", "https://en.wikipedia.org/wiki/Tooth", "wikipedia"),
        ],
    },
    {
        "slug": "oreille",
        "name": "Oreille",
        "system": "sensory",
        "short_description": "Organe de l'audition et de l'équilibre, divisé en oreille externe, moyenne et interne.",
        "description": (
            "L'oreille externe (pavillon, conduit auditif) capte les sons, l'oreille moyenne "
            "(tympan, osselets) les amplifie, et l'oreille interne (cochlée, vestibule) les "
            "convertit en signaux nerveux. Le vestibule héberge le sens de l'équilibre."
        ),
        "functions": [
            "Audition",
            "Équilibre (vestibule)",
            "Localisation spatiale du son",
        ],
        "stats": {
            "metrics": [
                {"label": "Plage auditive", "value": "20 Hz - 20 kHz"},
                {"label": "Osselets", "value": "Marteau, enclume, étrier"},
                {"label": "Cellules ciliées", "value": "≈ 16 000"},
            ],
        },
        "sub_organs": [
            ("pavillon", "Pavillon", "Capte et oriente les ondes sonores."),
            ("conduit-auditif", "Conduit auditif externe", "Amène le son au tympan."),
            ("tympan", "Tympan", "Membrane qui vibre sous l'effet des sons."),
            ("marteau", "Marteau (malleus)", "Premier osselet, transmet la vibration du tympan."),
            ("enclume", "Enclume (incus)", "Deuxième osselet."),
            ("etrier-os", "Étrier (stapes)", "Plus petit os du corps, transmet à la fenêtre ovale."),
            ("cochlee", "Cochlée", "Spirale osseuse contenant l'organe de Corti, transduction sonore."),
            ("vestibule", "Vestibule", "Utricule + saccule, détecte les accélérations linéaires."),
            ("canaux-semicirculaires", "Canaux semi-circulaires", "Trois canaux orthogonaux, détectent les rotations."),
        ],
        "sources": [
            ("Ear, Wikipedia", "https://en.wikipedia.org/wiki/Ear", "wikipedia"),
        ],
    },
]
