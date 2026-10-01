import { WorldDataDNAEngine, WorldDataDNANode, DNARelationEdge } from './worldDataDNA';
import { COUNTRIES_DATA } from '../data/countriesData';
import { US_STATES } from '../data/usStatesData';

// Seed the autonomous DNA Knowledge Graph with root, countries, states, and interconnected graph edges
export const initializeWorldDataDNA = (): void => {
  // 1. Root Node: The World
  WorldDataDNAEngine.registerNode({
    id: 'DNA-ROOT-000',
    handle: '@world',
    canonicalPath: 'liii.st/World',
    title: 'The World',
    nativeTitle: 'Earth • Planeta Terra',
    domain: 'planetary',
    facet: 'root',
    childrenCount: 195,
    metrics: {
      primaryValue: '195',
      primaryLabel: 'Sovereign States',
      secondaryValue: '8.1B',
      secondaryLabel: 'Global Inhabitants'
    },
    edges: [
      { targetId: 'DNA-DIR-COUNTRIES', targetHandle: '@countries', relation: 'contains', weight: 1.0 },
      { targetId: 'DNA-DOM-OCEANS', targetHandle: '@oceans', relation: 'contains', weight: 0.9 },
      { targetId: 'DNA-DOM-CONTINENTS', targetHandle: '@continents', relation: 'contains', weight: 0.95 }
    ],
    metadata: {
      verifiedAt: '2026-09-29T12:00:00Z',
      version: 'DNA-2.0'
    }
  });

  // 2. Directory Node: Countries of the World
  WorldDataDNAEngine.registerNode({
    id: 'DNA-DIR-COUNTRIES',
    handle: '@countries',
    canonicalPath: 'liii.st/World/Country',
    title: 'Countries of the World',
    nativeTitle: 'Sovereign States Directory',
    domain: 'geopolitical',
    facet: 'node',
    parentId: 'DNA-ROOT-000',
    childrenCount: 195,
    metrics: {
      primaryValue: '195',
      primaryLabel: 'Cataloged Nations',
      secondaryValue: '148.9M km²',
      secondaryLabel: 'Land Area'
    },
    edges: [
      { targetId: 'DNA-ROOT-000', targetHandle: '@world', relation: 'part_of', weight: 1.0 },
      { targetId: 'DNA-COUNTRY-US', targetHandle: '@usa', relation: 'contains', weight: 0.9 },
      { targetId: 'DNA-COUNTRY-JP', targetHandle: '@japan', relation: 'contains', weight: 0.9 },
      { targetId: 'DNA-COUNTRY-DE', targetHandle: '@germany', relation: 'contains', weight: 0.9 }
    ],
    metadata: {
      verifiedAt: '2026-09-29T12:00:00Z',
      version: 'DNA-2.0'
    }
  });

  // 3. Register All 195 Countries
  COUNTRIES_DATA.forEach((country) => {
    const cleanSlug = country.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const countryHandle = `@${cleanSlug}`;
    const countryId = `DNA-COUNTRY-${country.code}`;

    const countryEdges: DNARelationEdge[] = (country.borderingCodes || []).map((bCode) => ({
      targetId: `DNA-COUNTRY-${bCode}`,
      targetHandle: `@${bCode.toLowerCase()}`,
      relation: 'borders',
      weight: 0.8
    }));

    // If USA, connect to @us-states
    if (country.code === 'US') {
      countryEdges.push({
        targetId: 'DNA-DIR-US-STATES',
        targetHandle: '@us-states',
        relation: 'contains',
        weight: 1.0
      });
    }

    WorldDataDNAEngine.registerNode({
      id: countryId,
      handle: countryHandle,
      canonicalPath: `liii.st/World/Country/${encodeURIComponent(country.name)}`,
      title: country.name,
      nativeTitle: country.officialName,
      domain: 'geopolitical',
      facet: 'node',
      parentId: 'DNA-DIR-COUNTRIES',
      childrenCount: country.sublists.length,
      metrics: {
        primaryValue: (country.population / 1_000_000).toFixed(1) + 'M',
        primaryLabel: 'Population',
        secondaryValue: country.areaKm2.toLocaleString() + ' km²',
        secondaryLabel: 'Territory'
      },
      edges: countryEdges,
      metadata: {
        establishedYear: country.independenceYear,
        isoCode: country.code,
        verifiedAt: '2026-09-29T12:00:00Z',
        version: 'DNA-2.0'
      }
    });
  });

  // 4. US States Directory Node
  WorldDataDNAEngine.registerNode({
    id: 'DNA-DIR-US-STATES',
    handle: '@us-states',
    canonicalPath: 'liii.st/World/Country/United States/States',
    title: 'States of the United States',
    nativeTitle: 'Federated Sovereign States',
    domain: 'administrative',
    facet: 'node',
    parentId: 'DNA-COUNTRY-US',
    childrenCount: US_STATES.length,
    metrics: {
      primaryValue: '50',
      primaryLabel: 'Federated States',
      secondaryValue: '$27.4T',
      secondaryLabel: 'National GDP'
    },
    edges: [
      { targetId: 'DNA-COUNTRY-US', targetHandle: '@usa', relation: 'part_of', weight: 1.0 },
      { targetId: 'DNA-STATE-CA', targetHandle: '@california', relation: 'contains', weight: 0.95 },
      { targetId: 'DNA-STATE-TX', targetHandle: '@texas', relation: 'contains', weight: 0.95 },
      { targetId: 'DNA-STATE-NY', targetHandle: '@newyork', relation: 'contains', weight: 0.95 }
    ],
    metadata: {
      verifiedAt: '2026-09-29T12:00:00Z',
      version: 'DNA-2.0'
    }
  });

  // 5. Register US States & Cities
  US_STATES.forEach((state) => {
    const stateSlug = state.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const stateHandle = `@${stateSlug}`;
    const stateId = `DNA-STATE-${state.code}`;

    const stateEdges: DNARelationEdge[] = state.cities.map((city) => ({
      targetId: `DNA-CITY-${state.code}-${city.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      targetHandle: `@${city.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      relation: 'contains',
      weight: city.isCapital ? 1.0 : 0.8
    }));

    // Register State Node
    WorldDataDNAEngine.registerNode({
      id: stateId,
      handle: stateHandle,
      canonicalPath: `liii.st/World/Country/United States/${encodeURIComponent(state.name)}`,
      title: state.name,
      nativeTitle: state.nickname,
      domain: 'administrative',
      facet: 'leaf',
      parentId: 'DNA-DIR-US-STATES',
      childrenCount: state.cities.length,
      metrics: {
        primaryValue: (state.population / 1_000_000).toFixed(1) + 'M',
        primaryLabel: 'State Population',
        secondaryValue: `$${state.gdpBillion}B`,
        secondaryLabel: 'State GDP'
      },
      edges: [
        { targetId: 'DNA-DIR-US-STATES', targetHandle: '@us-states', relation: 'part_of', weight: 1.0 },
        ...stateEdges
      ],
      metadata: {
        establishedYear: state.admissionYear,
        isoCode: `US-${state.code}`,
        verifiedAt: '2026-09-29T12:00:00Z',
        version: 'DNA-2.0'
      }
    });

    // Register City Nodes
    state.cities.forEach((city) => {
      const citySlug = city.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cityHandle = `@${citySlug}`;
      const cityId = `DNA-CITY-${state.code}-${citySlug}`;

      WorldDataDNAEngine.registerNode({
        id: cityId,
        handle: cityHandle,
        canonicalPath: `liii.st/World/Country/United States/${encodeURIComponent(state.name)}/${encodeURIComponent(city.name)}`,
        title: city.name,
        nativeTitle: city.nickname || city.name,
        domain: 'municipal',
        facet: 'quantum',
        parentId: stateId,
        childrenCount: city.notableAttractions ? city.notableAttractions.length : 0,
        metrics: {
          primaryValue: city.population.toLocaleString(),
          primaryLabel: 'Municipal Residents',
          secondaryValue: city.areaKm2 ? `${city.areaKm2} km²` : undefined,
          secondaryLabel: 'Area'
        },
        edges: [
          { targetId: stateId, targetHandle: stateHandle, relation: 'part_of', weight: 1.0 },
          { targetId: 'DNA-COUNTRY-US', targetHandle: '@usa', relation: 'part_of', weight: 0.9 }
        ],
        metadata: {
          verifiedAt: '2026-09-29T12:00:00Z',
          version: 'DNA-2.0'
        }
      });
    });
  });
};
