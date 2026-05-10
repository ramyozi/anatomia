/**
 * ISO 3166-1 helpers used by the world map.
 *
 * The TopoJSON ``world-atlas@2/countries-110m.json`` we render exposes
 * each country's *M49 numeric code* as ``feature.id`` (eg "012" for
 * Algeria) and does NOT include the alpha-3 code in ``properties``.
 *
 * The rest of the app (backend, route params, store keys) speaks
 * alpha-3 exclusively, so we translate numeric→alpha-3 here.
 *
 * The table below covers every UN member state + the few extra entries
 * present in world-atlas (Antarctica, Greenland, Western Sahara, etc.).
 * Source: https://www.iso.org/iso-3166-country-codes.html
 */

const NUMERIC_TO_ALPHA3: Record<string, string> = {
  '004': 'AFG', '008': 'ALB', '010': 'ATA', '012': 'DZA', '016': 'ASM',
  '020': 'AND', '024': 'AGO', '028': 'ATG', '031': 'AZE', '032': 'ARG',
  '036': 'AUS', '040': 'AUT', '044': 'BHS', '048': 'BHR', '050': 'BGD',
  '051': 'ARM', '052': 'BRB', '056': 'BEL', '060': 'BMU', '064': 'BTN',
  '068': 'BOL', '070': 'BIH', '072': 'BWA', '074': 'BVT', '076': 'BRA',
  '084': 'BLZ', '086': 'IOT', '090': 'SLB', '092': 'VGB', '096': 'BRN',
  '100': 'BGR', '104': 'MMR', '108': 'BDI', '112': 'BLR', '116': 'KHM',
  '120': 'CMR', '124': 'CAN', '132': 'CPV', '136': 'CYM', '140': 'CAF',
  '144': 'LKA', '148': 'TCD', '152': 'CHL', '156': 'CHN', '158': 'TWN',
  '162': 'CXR', '166': 'CCK', '170': 'COL', '174': 'COM', '175': 'MYT',
  '178': 'COG', '180': 'COD', '184': 'COK', '188': 'CRI', '191': 'HRV',
  '192': 'CUB', '196': 'CYP', '203': 'CZE', '204': 'BEN', '208': 'DNK',
  '212': 'DMA', '214': 'DOM', '218': 'ECU', '222': 'SLV', '226': 'GNQ',
  '231': 'ETH', '232': 'ERI', '233': 'EST', '234': 'FRO', '238': 'FLK',
  '239': 'SGS', '242': 'FJI', '246': 'FIN', '248': 'ALA', '250': 'FRA',
  '254': 'GUF', '258': 'PYF', '260': 'ATF', '262': 'DJI', '266': 'GAB',
  '268': 'GEO', '270': 'GMB', '275': 'PSE', '276': 'DEU', '288': 'GHA',
  '292': 'GIB', '296': 'KIR', '300': 'GRC', '304': 'GRL', '308': 'GRD',
  '312': 'GLP', '316': 'GUM', '320': 'GTM', '324': 'GIN', '328': 'GUY',
  '332': 'HTI', '334': 'HMD', '336': 'VAT', '340': 'HND', '344': 'HKG',
  '348': 'HUN', '352': 'ISL', '356': 'IND', '360': 'IDN', '364': 'IRN',
  '368': 'IRQ', '372': 'IRL', '376': 'ISR', '380': 'ITA', '384': 'CIV',
  '388': 'JAM', '392': 'JPN', '398': 'KAZ', '400': 'JOR', '404': 'KEN',
  '408': 'PRK', '410': 'KOR', '414': 'KWT', '417': 'KGZ', '418': 'LAO',
  '422': 'LBN', '426': 'LSO', '428': 'LVA', '430': 'LBR', '434': 'LBY',
  '438': 'LIE', '440': 'LTU', '442': 'LUX', '446': 'MAC', '450': 'MDG',
  '454': 'MWI', '458': 'MYS', '462': 'MDV', '466': 'MLI', '470': 'MLT',
  '474': 'MTQ', '478': 'MRT', '480': 'MUS', '484': 'MEX', '492': 'MCO',
  '496': 'MNG', '498': 'MDA', '499': 'MNE', '500': 'MSR', '504': 'MAR',
  '508': 'MOZ', '512': 'OMN', '516': 'NAM', '520': 'NRU', '524': 'NPL',
  '528': 'NLD', '531': 'CUW', '533': 'ABW', '534': 'SXM', '535': 'BES',
  '540': 'NCL', '548': 'VUT', '554': 'NZL', '558': 'NIC', '562': 'NER',
  '566': 'NGA', '570': 'NIU', '574': 'NFK', '578': 'NOR', '580': 'MNP',
  '581': 'UMI', '583': 'FSM', '584': 'MHL', '585': 'PLW', '586': 'PAK',
  '591': 'PAN', '598': 'PNG', '600': 'PRY', '604': 'PER', '608': 'PHL',
  '612': 'PCN', '616': 'POL', '620': 'PRT', '624': 'GNB', '626': 'TLS',
  '630': 'PRI', '634': 'QAT', '638': 'REU', '642': 'ROU', '643': 'RUS',
  '646': 'RWA', '652': 'BLM', '654': 'SHN', '659': 'KNA', '660': 'AIA',
  '662': 'LCA', '663': 'MAF', '666': 'SPM', '670': 'VCT', '674': 'SMR',
  '678': 'STP', '682': 'SAU', '686': 'SEN', '688': 'SRB', '690': 'SYC',
  '694': 'SLE', '702': 'SGP', '703': 'SVK', '704': 'VNM', '705': 'SVN',
  '706': 'SOM', '710': 'ZAF', '716': 'ZWE', '724': 'ESP', '728': 'SSD',
  '729': 'SDN', '732': 'ESH', '740': 'SUR', '744': 'SJM', '748': 'SWZ',
  '752': 'SWE', '756': 'CHE', '760': 'SYR', '762': 'TJK', '764': 'THA',
  '768': 'TGO', '772': 'TKL', '776': 'TON', '780': 'TTO', '784': 'ARE',
  '788': 'TUN', '792': 'TUR', '795': 'TKM', '796': 'TCA', '798': 'TUV',
  '800': 'UGA', '804': 'UKR', '807': 'MKD', '818': 'EGY', '826': 'GBR',
  '831': 'GGY', '832': 'JEY', '833': 'IMN', '834': 'TZA', '840': 'USA',
  '850': 'VIR', '854': 'BFA', '858': 'URY', '860': 'UZB', '862': 'VEN',
  '876': 'WLF', '882': 'WSM', '887': 'YEM', '894': 'ZMB',
  // Some TopoJSON builds emit 2- or 3-digit codes without leading zeros.
  // We don't normalise here; ``toIso3`` left-pads to 3 chars before lookup.
}

/** Strict ISO alpha-3: 3 uppercase letters. */
export const ISO3_RE = /^[A-Z]{3}$/

export function isValidIso3(code: string | undefined | null): code is string {
  return typeof code === 'string' && ISO3_RE.test(code)
}

/**
 * Resolve a country code coming from the map into a canonical ISO
 * alpha-3 code. Accepts:
 *  - 3-letter alpha-3 → returned upper-cased (passthrough).
 *  - 1/2/3-digit M49 numeric (with or without leading zeros) → looked
 *    up in the table.
 *
 * Returns ``null`` if the code can't be mapped. Callers must treat a
 * null result as "no navigation" / "redirect home".
 */
export function toIso3(raw: string | number | null | undefined): string | null {
  if (raw == null) return null
  const s = String(raw).trim()
  if (!s) return null
  if (ISO3_RE.test(s.toUpperCase())) return s.toUpperCase()
  // Numeric (possibly without leading zeros): left-pad to 3.
  if (/^\d{1,3}$/.test(s)) {
    const padded = s.padStart(3, '0')
    return NUMERIC_TO_ALPHA3[padded] ?? null
  }
  return null
}
