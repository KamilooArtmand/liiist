export interface CountyInfo {
  name: string; // e.g. "New York County" (Manhattan), "Kings County" (Brooklyn)
  fipsCode: string;
  countySeat: string;
  population: number;
  areaKm2: number;
  establishedYear: number;
  largestCityOrTown?: string;
  boroughEquivalent?: string;
  description?: string;
}

// All 62 Official Counties of the State of New York
export const ALL_NEW_YORK_COUNTIES: CountyInfo[] = [
  { name: 'Albany County', fipsCode: '36001', countySeat: 'Albany', population: 314848, areaKm2: 1380, establishedYear: 1683, description: 'Contains the state capital of New York, Albany.' },
  { name: 'Allegany County', fipsCode: '36003', countySeat: 'Belmont', population: 46456, areaKm2: 2678, establishedYear: 1806, description: 'Southern tier rural county with expansive hardwood forests.' },
  { name: 'Bronx County', fipsCode: '36005', countySeat: 'The Bronx', population: 1472654, areaKm2: 148, establishedYear: 1914, boroughEquivalent: 'The Bronx', description: 'Coextensive with the Borough of The Bronx in New York City.' },
  { name: 'Broome County', fipsCode: '36007', countySeat: 'Binghamton', population: 198683, areaKm2: 1852, establishedYear: 1806, description: 'Birthplace of IBM and carousel capital of the world.' },
  { name: 'Cattaraugus County', fipsCode: '36009', countySeat: 'Little Valley', population: 77042, areaKm2: 3393, establishedYear: 1808, description: 'Home to Allegany State Park and Seneca Nation of Indians territory.' },
  { name: 'Cayuga County', fipsCode: '36011', countySeat: 'Auburn', population: 76248, areaKm2: 2237, establishedYear: 1799, description: 'Finger Lakes heartland stretching to Lake Ontario.' },
  { name: 'Chautauqua County', fipsCode: '36013', countySeat: 'Mayville', population: 127657, areaKm2: 3885, establishedYear: 1808, description: 'Home of the historic Chautauqua Institution on Chautauqua Lake.' },
  { name: 'Chemung County', fipsCode: '36015', countySeat: 'Elmira', population: 84148, areaKm2: 1064, establishedYear: 1836, description: 'Historic home of author Mark Twain in Elmira.' },
  { name: 'Chenango County', fipsCode: '36017', countySeat: 'Norwich', population: 47202, areaKm2: 2328, establishedYear: 1798, description: 'Central agricultural dairy and manufacturing county.' },
  { name: 'Clinton County', fipsCode: '36019', countySeat: 'Plattsburgh', population: 79843, areaKm2: 2896, establishedYear: 1788, description: 'Northeastern corner bordering Quebec and Lake Champlain.' },
  { name: 'Columbia County', fipsCode: '36021', countySeat: 'Hudson', population: 61570, areaKm2: 1678, establishedYear: 1786, description: 'Hudson River valley historic arts and architecture center.' },
  { name: 'Cortland County', fipsCode: '36023', countySeat: 'Cortland', population: 46809, areaKm2: 1300, establishedYear: 1808, description: 'Central New York college community hosting SUNY Cortland.' },
  { name: 'Delaware County', fipsCode: '36025', countySeat: 'Delhi', population: 44308, areaKm2: 3802, establishedYear: 1797, description: 'Catskill mountain peaks and key watershed for NYC reservoirs.' },
  { name: 'Dutchess County', fipsCode: '36027', countySeat: 'Poughkeepsie', population: 295911, areaKm2: 2137, establishedYear: 1683, description: 'One of the original 12 counties; home to FDR Presidential Library.' },
  { name: 'Erie County', fipsCode: '36029', countySeat: 'Buffalo', population: 954236, areaKm2: 3178, establishedYear: 1821, description: 'Anchor of Western New York, Canalside, and Lake Erie shoreline.' },
  { name: 'Essex County', fipsCode: '36031', countySeat: 'Elizabethtown', population: 37381, areaKm2: 4962, establishedYear: 1799, description: 'Heart of the High Peaks in the Adirondacks, Lake Placid.' },
  { name: 'Franklin County', fipsCode: '36033', countySeat: 'Malone', population: 47555, areaKm2: 4394, establishedYear: 1808, description: 'Adirondack park reserve and Canadian borderlands.' },
  { name: 'Fulton County', fipsCode: '36035', countySeat: 'Johnstown', population: 53324, areaKm2: 1380, establishedYear: 1838, description: 'Glove and leather manufacturing capital history.' },
  { name: 'Genesee County', fipsCode: '36037', countySeat: 'Batavia', population: 58388, areaKm2: 1282, establishedYear: 1802, description: 'Historic Holland Land Office and agricultural breadbasket.' },
  { name: 'Greene County', fipsCode: '36039', countySeat: 'Catskill', population: 47931, areaKm2: 1704, establishedYear: 1800, description: 'Birthplace of the Hudson River School of landscape art.' },
  { name: 'Hamilton County', fipsCode: '36041', countySeat: 'Lake Pleasant', population: 5107, areaKm2: 4683, establishedYear: 1816, description: 'Completely within the Adirondack Park; least densely populated NY county.' },
  { name: 'Herkimer County', fipsCode: '36043', countySeat: 'Herkimer', population: 60139, areaKm2: 3776, establishedYear: 1791, description: 'Famous for "Herkimer Diamond" quartz crystals and Mohawk Valley history.' },
  { name: 'Jefferson County', fipsCode: '36045', countySeat: 'Watertown', population: 116721, areaKm2: 4815, establishedYear: 1805, description: 'Thousand Islands archipelago on the St. Lawrence River, Fort Drum.' },
  { name: 'Kings County', fipsCode: '36047', countySeat: 'Brooklyn', population: 2736074, areaKm2: 251, establishedYear: 1683, boroughEquivalent: 'Brooklyn', description: 'Coextensive with Borough of Brooklyn; most populous county in NY State.' },
  { name: 'Lewis County', fipsCode: '36049', countySeat: 'Lowville', population: 26582, areaKm2: 3341, establishedYear: 1805, description: 'Tug Hill plateau region known for record annual snowfall.' },
  { name: 'Livingston County', fipsCode: '36051', countySeat: 'Geneseo', population: 61834, areaKm2: 1658, establishedYear: 1821, description: 'Letchworth State Park, "Grand Canyon of the East".' },
  { name: 'Madison County', fipsCode: '36053', countySeat: 'Wampsville', population: 68016, areaKm2: 1715, establishedYear: 1806, description: 'Home of Colgate University and Oneida Indian Nation.' },
  { name: 'Monroe County', fipsCode: '36055', countySeat: 'Rochester', population: 759443, areaKm2: 3572, establishedYear: 1821, description: 'Imaging and photonics capital (Kodak, Xerox, Bausch & Lomb heritage).' },
  { name: 'Montgomery County', fipsCode: '36057', countySeat: 'Fonda', population: 49532, areaKm2: 1062, establishedYear: 1772, description: 'Historic Erie Canal crossing through the Mohawk River valley.' },
  { name: 'Nassau County', fipsCode: '36059', countySeat: 'Mineola', population: 1395774, areaKm2: 1173, establishedYear: 1899, description: 'Affluent Long Island Gold Coast suburban hub.' },
  { name: 'New York County', fipsCode: '36061', countySeat: 'New York (Manhattan)', population: 1694251, areaKm2: 87, establishedYear: 1683, boroughEquivalent: 'Manhattan', description: 'Coextensive with Borough of Manhattan; the financial center of the world.' },
  { name: 'Niagara County', fipsCode: '36063', countySeat: 'Lockport', population: 212666, areaKm2: 2953, establishedYear: 1808, description: 'Encompasses the American side of world-famous Niagara Falls and Erie Canal locks.' },
  { name: 'Oneida County', fipsCode: '36065', countySeat: 'Utica', population: 232125, areaKm2: 3256, establishedYear: 1798, description: 'Gateway to the Adirondacks; Wolfspeed silicon carbide fab corridor.' },
  { name: 'Onondaga County', fipsCode: '36067', countySeat: 'Syracuse', population: 476516, areaKm2: 2088, establishedYear: 1794, description: 'Crossroads of Central New York; site of Micron Technology megafab.' },
  { name: 'Ontario County', fipsCode: '36069', countySeat: 'Canandaigua', population: 112458, areaKm2: 1715, establishedYear: 1789, description: 'Finger Lakes wine trails and Canandaigua Lake resort shores.' },
  { name: 'Orange County', fipsCode: '36071', countySeat: 'Goshen', population: 401310, areaKm2: 2173, establishedYear: 1683, description: 'One of original 12 counties; hosts United States Military Academy at West Point.' },
  { name: 'Orleans County', fipsCode: '36073', countySeat: 'Albion', population: 40343, areaKm2: 2116, establishedYear: 1824, description: 'Orchards along the Lake Ontario State Parkway.' },
  { name: 'Oswego County', fipsCode: '36075', countySeat: 'Oswego', population: 117525, areaKm2: 3398, establishedYear: 1816, description: 'Deep-water port on Lake Ontario and world-class salmon fishing on Salmon River.' },
  { name: 'Otsego County', fipsCode: '36077', countySeat: 'Cooperstown', population: 58524, areaKm2: 2598, establishedYear: 1791, description: 'Cooperstown: home of the National Baseball Hall of Fame.' },
  { name: 'Putnam County', fipsCode: '36079', countySeat: 'Carmel', population: 97621, areaKm2: 637, establishedYear: 1812, description: 'Lower Hudson Valley wooded reservoirs and hiking corridors.' },
  { name: 'Queens County', fipsCode: '36081', countySeat: 'Jamaica (Queens)', population: 2405464, areaKm2: 462, establishedYear: 1683, boroughEquivalent: 'Queens', description: 'Coextensive with Borough of Queens; most ethnically diverse urban area globally.' },
  { name: 'Rensselaer County', fipsCode: '36083', countySeat: 'Troy', population: 161130, areaKm2: 1722, establishedYear: 1791, description: 'Tech Valley capital district county; home to RPI university.' },
  { name: 'Richmond County', fipsCode: '36085', countySeat: 'St. George (Staten Island)', population: 495747, areaKm2: 265, establishedYear: 1683, boroughEquivalent: 'Staten Island', description: 'Coextensive with Borough of Staten Island in New York City.' },
  { name: 'Rockland County', fipsCode: '36087', countySeat: 'New City', population: 338329, areaKm2: 515, establishedYear: 1798, description: 'West side of Hudson River directly north of New Jersey border.' },
  { name: 'Saint Lawrence County', fipsCode: '36089', countySeat: 'Canton', population: 108505, areaKm2: 7306, establishedYear: 1802, description: 'Largest county in New York State by land area (7,306 km²).' },
  { name: 'Saratoga County', fipsCode: '36091', countySeat: 'Ballston Spa', population: 235509, areaKm2: 2186, establishedYear: 1791, description: 'Turning Point of the American Revolution (1777), Saratoga Thoroughbred racecourse.' },
  { name: 'Schenectady County', fipsCode: '36093', countySeat: 'Schenectady', population: 158061, areaKm2: 544, establishedYear: 1809, description: 'Historical headquarters of Thomas Edison\'s General Electric.' },
  { name: 'Schoharie County', fipsCode: '36095', countySeat: 'Schoharie', population: 29714, areaKm2: 1621, establishedYear: 1795, description: 'Howe Caverns geological limestone formations and agriculture.' },
  { name: 'Schuyler County', fipsCode: '36097', countySeat: 'Watkins Glen', population: 17898, areaKm2: 886, establishedYear: 1854, description: 'Watkins Glen State Park gorges and historic auto racing circuit.' },
  { name: 'Seneca County', fipsCode: '36099', countySeat: 'Waterloo', population: 33814, areaKm2: 842, establishedYear: 1804, description: 'Seneca Falls: birthplace of women\'s rights movement (1848 Convention).' },
  { name: 'Steuben County', fipsCode: '36101', countySeat: 'Bath', population: 93584, areaKm2: 3649, establishedYear: 1796, description: 'Corning Museum of Glass and Southern Tier ceramics engineering.' },
  { name: 'Suffolk County', fipsCode: '36103', countySeat: 'Riverhead', population: 1525920, areaKm2: 6146, establishedYear: 1683, description: 'Eastern Long Island, The Hamptons, Montauk Point Lighthouse.' },
  { name: 'Sullivan County', fipsCode: '36105', countySeat: 'Monticello', population: 78624, areaKm2: 2582, establishedYear: 1809, description: 'Catskill resort corridor; historic site of the 1969 Woodstock Festival.' },
  { name: 'Tioga County', fipsCode: '36107', countySeat: 'Owego', population: 48455, areaKm2: 1355, establishedYear: 1791, description: 'Susquehanna River basin valley in Southern Tier.' },
  { name: 'Tompkins County', fipsCode: '36109', countySeat: 'Ithaca', population: 105740, areaKm2: 1272, establishedYear: 1817, description: 'Ivy League Cornell University and Ithaca College amidst glacier-cut gorges.' },
  { name: 'Ulster County', fipsCode: '36111', countySeat: 'Kingston', population: 181851, areaKm2: 3007, establishedYear: 1683, description: 'Contains Kingston (original NY State capital 1777) and Minnewaska State Park.' },
  { name: 'Warren County', fipsCode: '36113', countySeat: 'Queensbury', population: 65737, areaKm2: 2414, establishedYear: 1813, description: 'Lake George "Queen of American Lakes" resort region.' },
  { name: 'Washington County', fipsCode: '36115', countySeat: 'Fort Edward', population: 61302, areaKm2: 2191, establishedYear: 1772, description: 'Champlain canalway and rolling hills along Vermont border.' },
  { name: 'Wayne County', fipsCode: '36117', countySeat: 'Lyons', population: 91283, areaKm2: 3585, establishedYear: 1823, description: 'Largest apple-producing county in New York State on Lake Ontario.' },
  { name: 'Westchester County', fipsCode: '36119', countySeat: 'White Plains', population: 1004457, areaKm2: 1295, establishedYear: 1683, description: 'Prime suburban northern boundary of NYC, Fortune 500 corporate HQs.' },
  { name: 'Wyoming County', fipsCode: '36121', countySeat: 'Warsaw', population: 40531, areaKm2: 1544, establishedYear: 1841, description: 'Leading dairy producing county in the state; Letchworth gorge.' },
  { name: 'Yates County', fipsCode: '36123', countySeat: 'Penn Yan', population: 24774, areaKm2: 974, establishedYear: 1823, description: 'Surrounded by Keuka, Seneca, and Canandaigua Lakes; premier wine region.' }
];
