// src/services/api.js

// --- MOCK DATA ---
const mockInventoryData = [
    { date: '2023-10-20', current: 500, optimal: 480 },
    { date: '2023-10-21', current: 510, optimal: 485 },
    { date: '2023-10-22', current: 490, optimal: 475 },
    { date: '2023-10-23', current: 525, optimal: 500 },
    { date: '2023-10-24', current: 530, optimal: 505 },
    { date: '2023-10-25', current: 480, optimal: 510 }, // Example where recommendation might be needed
    { date: '2023-10-26', current: 470, optimal: 500 },
  ];
  
  const mockRecommendation = {
    id: 'inv-rec-001',
    agent_type: 'InventoryAgent',
    summary: 'Increase safety stock for Product SKU-123 at Location WH-A',
    details: 'Forecasted demand variability has increased by 15% and current safety stock levels pose a 25% risk of stockout.',
    reasoning: 'Increased variability requires higher buffer to maintain target service levels.',
    benefits: 'Expected reduction in stockout risk by 20%, protecting $15k in potential revenue.',
    status: 'pending', // or 'applied', 'rejected'
  };


  const mockLogisticsKpis = {
    onTimeDelivery: 92.5, // Percentage
    transportCostPerUnit: 5.75, // Currency/Unit
    vehicleUtilization: 78.0, // Percentage
    carbonFootprintKgCo2: 15400, // Total kg CO2 for period
    lastUpdated: new Date().toISOString(), // Use current time for freshness
  };

  const mockLogisticsRecommendation = {
    id: 'log-rec-001',
    agent_type: 'LogisticsAgent',
    summary: 'Consolidate LTL shipments to Region West (CA, AZ)',
    details: 'Analysis shows 3 separate LTL shipments (ORD-567, ORD-569, ORD-571) scheduled for Region West destinations within 24 hours. Consolidating into one FTL shipment can save significant costs and improve utilization.',
    reasoning: 'Combining shipments utilizes truck space better, reduces fixed costs per shipment, and minimizes empty miles.',
    benefits: 'Estimated savings of $1200 in transport costs and potential reduction of 50kg CO2 emissions.',
    status: 'pending',
  };


  const mockDemandData = [
    { date: '2023-10-20', actual: 105, forecast: 100, product: 'SKU-123' },
    { date: '2023-10-21', actual: 110, forecast: 108, product: 'SKU-123' },
    { date: '2023-10-22', actual: 95,  forecast: 105, product: 'SKU-123' },
    { date: '2023-10-23', actual: 120, forecast: 115, product: 'SKU-123' },
    { date: '2023-10-24', actual: 115, forecast: 118, product: 'SKU-123' },
    { date: '2023-10-25', actual: 130, forecast: 125, product: 'SKU-123' },
    { date: '2023-10-26', actual: 125, forecast: 128, product: 'SKU-123' },
    // Future forecasts might not have 'actual'
    { date: '2023-10-27', forecast: 130, product: 'SKU-123' },
    { date: '2023-10-28', forecast: 135, product: 'SKU-123' },
  ];
  
  const mockDemandRecommendation = {
    id: 'dem-rec-001',
    agent_type: 'DemandAgent',
    summary: 'Adjust forecast for SKU-456 upward by 8% for next 4 weeks.',
    details: 'Detected increased social media mentions (+30%) and positive sentiment (+15%) related to Product Category B, which includes SKU-456. Competitor C is experiencing stockouts for a similar product.',
    reasoning: 'External market signals strongly suggest a near-term demand uplift beyond historical trends.',
    benefits: 'Potential to capture an additional $25k in sales by aligning inventory with anticipated demand, reducing missed opportunities.',
    status: 'pending',
  };

  // --- NEW MOCK RISK DATA ---
  const mockRiskIndicators = [
    {
      id: 'risk-001',
      description: 'Potential port congestion at Long Beach affecting incoming shipments.',
      severity: 'Medium', // Could be Low, Medium, High, Critical
      status: 'Active', // Could be Active, Mitigated, Resolved
      detected_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Detected 2 days ago
      impact_area: 'Inbound Logistics',
    },
    {
      id: 'risk-002',
      description: 'Supplier B facing potential labor shortages impacting Component Z production.',
      severity: 'High',
      status: 'Active',
      detected_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Detected 1 day ago
      impact_area: 'Procurement, Production',
    },
     {
      id: 'risk-003',
      description: 'Increased chance of extreme weather events in Southeast region.',
      severity: 'Low',
      status: 'Monitoring',
      detected_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Detected 5 days ago
      impact_area: 'Transportation, Warehouse Ops',
    },
  ];
  
  const mockRiskRecommendation = {
    id: 'risk-rec-001',
    agent_type: 'RiskAgent',
    related_risk_id: 'risk-002', // Link to the specific risk if applicable
    summary: 'Initiate secondary sourcing qualification for Component Z with Supplier D.',
    details: 'Supplier B\'s ongoing labor negotiation poses a >60% chance of production disruption within the next 4 weeks. Qualifying Supplier D provides an alternative supply source.',
    reasoning: 'Reduces single-supplier dependency for a critical component, mitigating potential stockouts or production delays.',
    benefits: 'Estimated $50k revenue protected by ensuring supply continuity. Qualification lead time approx. 3 weeks.',
    status: 'pending',
  };
  // --- END MOCK RISK DATA ---
  // --- END MOCK DATA ---
  
  // Simulate API call delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  export const fetchInventorySummary = async () => {
    console.log("API Call: Fetching inventory summary...");
    await delay(800); // Simulate network latency
    // In real app: const response = await fetch('/api/dashboard/inventory-summary'); ...
    console.log("API Call: Received inventory summary.");
    return mockInventoryData;
  };
  
  export const fetchInventoryRecommendations = async () => {
    console.log("API Call: Fetching inventory recommendations...");
    await delay(1200);
    // In real app: const response = await fetch('/api/recommendations?agent_type=inventory&status=pending'); ...
    // For MVP, let's just return one pending recommendation if available
    const pendingRecs = Math.random() > 0.3 ? [mockRecommendation] : []; // Simulate sometimes having a recommendation
    console.log(`API Call: Received ${pendingRecs.length} recommendations.`);
    return pendingRecs.length > 0 ? pendingRecs[0] : null; // Return first pending or null
  };
  
  export const applyRecommendation = async (id) => {
    console.log(`API Call: Applying recommendation ${id}...`);
    await delay(1000);
    // In real app: const response = await fetch(`/api/recommendations/${id}/apply`, { method: 'POST' }); ...
    console.log(`API Call: Applied recommendation ${id}.`);
    // Usually returns success status or updated object
    return { status: 'success', message: `Recommendation ${id} applied.` };
  };
  

  export const fetchLogisticsPerformance = async () => {
    console.log("API Call: Fetching logistics performance KPIs...");
    await delay(700); // Simulate network latency
    // In real app: const response = await fetch('/api/dashboard/logistics-performance'); ...
    console.log("API Call: Received logistics KPIs.");
    // Add slight randomness to KPIs for realism on refresh
    return {
        ...mockLogisticsKpis,
        onTimeDelivery: parseFloat((mockLogisticsKpis.onTimeDelivery + (Math.random() - 0.5) * 2).toFixed(1)), // +/- 1%
        transportCostPerUnit: parseFloat((mockLogisticsKpis.transportCostPerUnit + (Math.random() - 0.5) * 0.5).toFixed(2)), // +/- 0.25
        vehicleUtilization: parseFloat((mockLogisticsKpis.vehicleUtilization + (Math.random() - 0.5) * 3).toFixed(1)), // +/- 1.5%
    };
  };

  export const fetchLogisticsRecommendations = async () => {
    console.log("API Call: Fetching logistics recommendations...");
    await delay(1100);
    // In real app: const response = await fetch('/api/recommendations?agent_type=logistics&status=pending'); ...
    const pendingRecs = Math.random() > 0.4 ? [mockLogisticsRecommendation] : []; // Simulate sometimes having a recommendation (different probability)
    console.log(`API Call: Received ${pendingRecs.length} logistics recommendations.`);
    return pendingRecs.length > 0 ? pendingRecs[0] : null; // Return first pending or null
  };
  

  // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  export const fetchDemandTrends = async (productId = 'SKU-123') => { // Allow filtering by product later
    console.log(`API Call: Fetching demand trends for ${productId}...`);
    await delay(950); // Simulate network latency
    // In real app: const response = await fetch(`/api/dashboard/demand-trends?product_id=${productId}`); ...
    console.log("API Call: Received demand trends.");
    // In a real app, you'd filter data based on productId
    return mockDemandData;
  };
  
  export const fetchDemandRecommendations = async () => {
    console.log("API Call: Fetching demand recommendations...");
    await delay(1300);
    // In real app: const response = await fetch('/api/recommendations?agent_type=demand&status=pending'); ...
    const pendingRecs = Math.random() > 0.5 ? [mockDemandRecommendation] : []; // 50/50 chance for demand rec
    console.log(`API Call: Received ${pendingRecs.length} demand recommendations.`);
    return pendingRecs.length > 0 ? pendingRecs[0] : null; // Return first pending or null
  };
  

  export const fetchRiskIndicators = async () => {
    console.log("API Call: Fetching risk indicators...");
    await delay(600); // Simulate network latency
    // In real app: const response = await fetch('/api/dashboard/risk-indicators?status=active,monitoring'); ...
    console.log("API Call: Received risk indicators.");
    // Return active/monitored risks
    return mockRiskIndicators.filter(r => r.status === 'Active' || r.status === 'Monitoring');
  };
  
  export const fetchRiskRecommendations = async () => {
    console.log("API Call: Fetching risk recommendations...");
    await delay(1000);
    // In real app: const response = await fetch('/api/recommendations?agent_type=risk&status=pending'); ...
    const pendingRecs = Math.random() > 0.4 ? [mockRiskRecommendation] : []; // ~60% chance for risk rec
    console.log(`API Call: Received ${pendingRecs.length} risk recommendations.`);
    return pendingRecs.length > 0 ? pendingRecs[0] : null; // Return first pending or null
  };

  export const uploadContextAndQuery = async (formData) => {
    // NOTE: In a real app, you'd send `formData` in a POST request
    // const response = await fetch('/api/context/upload', { // Example endpoint
    //   method: 'POST',
    //   body: formData, // Don't set Content-Type header, browser does it for FormData
    // });
    // if (!response.ok) {
    //    const errorData = await response.json();
    //    throw new Error(errorData.message || 'Failed to upload context.');
    // }
    // return await response.json(); // Or whatever the backend returns
  
     // --- MOCK IMPLEMENTATION (ALWAYS SUCCEEDS) ---
    console.log("API Call: Simulating upload context and query...");
    // Log the keys found in FormData (won't log file content)
    for (let key of formData.keys()) {
        console.log(`  FormData key: ${key}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload time

    // REMOVED THE if/else Math.random() BLOCK
    // ALWAYS return success now
    console.log("API Call: Upload simulation successful.");
    return { success: true, message: "Context and query submitted successfully. Analysis will be updated shortly." };
    // --- END MOCK IMPLEMENTATION ---
  };

  export const fetchBackendAnalysis = async () => {
    console.log("API Call: Fetching Q1 2025 analysis text...");
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay

  const mockQ1Text = `
General Trend Analysis (Based only on Q1 2025 data and comparison notes):

The report explicitly covers only Q1 2025. Therefore, a trend "across all years" cannot be determined from the provided data alone. However, the Executive Summary provides a crucial comparison point:

Worsening Delivery Performance: Delivery times have increased by an average of 17% compared to previous quarters. This indicates a negative trend in delivery reliability leading into and during Q1 2025.

Inconsistent Quality: Supplier quality is noted as inconsistent, with specific suppliers falling below acceptable thresholds, suggesting ongoing or emerging quality control issues.

Price Volatility: The price fluctuations table shows significant price increases for several materials/components within the quarter, indicating potential cost pressures or supplier pricing issues.

Detailed Analysis of Anomalies and Issues (Q1 2025):

Here's an analysis based on the specific categories requested:

Delivery Delays or Timeline Inconsistencies:

General Issue: Widespread delivery delays are evident across multiple suppliers and products. The average delivery time increased by 17% compared to previous quarters.

Specific Anomalies:

ExpressShip: Shows significant and consistent delays.
* Raw Material C (Jan 18): 18 days vs. 9 expected (+9 days).
* Component B (Feb 10): 19 days vs. 9 expected (+10 days).
* Raw Material A (Mar 05): 16 days vs. 9 expected (+7 days). (Anomaly Note 1 confirms this pattern, especially for Raw Material C).
FastFreight: Also shows consistent delays, though less severe than ExpressShip.
* Raw Material A (Jan 05): 12 days vs. 8 expected (+4 days).
* Component D (Feb 24): 13 days vs. 8 expected (+5 days).
* Component D (Mar 26): 14 days vs. 8 expected (+6 days).
LocalLogist: While having one on-time delivery (-1 variance), it also had a delay for Component B (Mar 12): 10 days vs 8 expected (+2 days).
GlobalTrans: Shows minor delays. Raw Material C (Feb 17): +2 days; Raw Material C (Mar 19): +1 day.

Price Fluctuations Outside Normal Ranges:

General Issue: Several products experienced significant price increases during the quarter. While "normal ranges" aren't defined, the magnitude of some increases is notable.

Specific Anomalies:

Material Z (MetalWorks): Experienced the highest price increase on Feb 05, rising from $31.20 to $34.60 (+10.90%). (Confirmed by Anomaly Note 5).
Component Y (PrimeParts): Showed two price increases. Jan 25: +5.31%; Mar 25: +9.24% (reaching $75.10 from a base of $68.75).
Material X (GlobalComp): Also showed two price increases. Jan 10: +3.06%; Mar 10: +8.71% (reaching $46.20 from a base of $42.50).
Component V (FastSupply): Showed a price decrease (-4.74%) on Feb 20. While not necessarily an anomaly, it contrasts with the general trend of increases.

Quantity Discrepancies:

Finding: The provided data tables (Supplier Quality Assessment, Inventory Levels) show ordered quantities and stock levels, but do not contain information about received quantities versus ordered quantities. Therefore, specific shipment quantity discrepancies cannot be identified from this report.

Quality Issues:

General Issue: Inconsistent quality performance across suppliers, with three falling below the company's acceptable Quality Score threshold of 85%.

Specific Anomalies (Supplier Quality Assessment table):

FastSupply (Component G): Quality Score of 76 (significantly below 85%), highest Rejection Rate of 8.7%.
GlobalComp (Electronic C): Quality Score of 79 (below 85%), high Rejection Rate of 7.8%.
MetalWorks (Raw Material E): Quality Score of 82 (below 85%), Rejection Rate of 5.2%. (Anomaly Note 2 mentions GlobalComp and FastSupply, but the data shows MetalWorks is also below the threshold).

Supplier Performance Problems:

General Issue: Multiple suppliers exhibit performance issues across different metrics (delivery, quality, price).

Specific Supplier Issues:

ExpressShip: Severe and consistent delivery delays.
FastFreight: Consistent delivery delays and very poor quality score/high rejection rate.
GlobalComp: Poor quality score/high rejection rate and significant price increases for Material X.
MetalWorks: Poor quality score and the single highest price increase observed (Material Z).
PrimeParts: Significant price increases for Component Y.

Logistical Bottlenecks:

General Issue: The widespread delivery delays suggest potential bottlenecks within the network or with specific carriers/routes. Issues in the APAC region are mentioned in the summary.

Specific Indicators:

Delivery Performance: The consistent delays from ExpressShip and FastFreight point to bottlenecks related to these carriers or the routes/products they handle.
Network Connectivity:
* Lowest Reliability Scores: Supplier Hub 1 (85) and Factory 2 (86) might represent weaker links in the internal network.
* Longest Internal Transit: Supplier Hub 1 -> Factory 1 takes 7 days, the longest internal transit listed.
Inventory Levels: Stock dropping below reorder points (Warehouse A - Product 2, Warehouse B - Product 1) could be a symptom of upstream bottlenecks causing delays in replenishment.

Carbon Footprint:

General Issue: Air freight shows disproportionately high carbon emissions compared to other transport modes.

Specific Anomalies (Carbon Footprint Analysis table):

Air Freight (ExpressShip, AirCargo): Generates extremely high CO2 emissions (31,250 kg and 38,400 kg) relative to weight and distance compared to other modes. For instance, SeaFreight travels much further (8500km) but produces fewer emissions (25,500 kg).
Inefficiency: Anomaly Note 3 explicitly states that the high carbon emissions from air freight do not correspond with delivery time benefits (linking back to ExpressShip's delays), suggesting inefficiency or poor mode selection for non-urgent shipments. Rail and Truck show significantly lower emissions for their respective distances.
  `; // End of mock text

  console.log("API Call: Received Q1 analysis text.");
  return mockQ1Text.trim(); // Trim whitespace
};

export const fetchDashboardData = async () => {
    console.log("API Call: Fetching dashboard JSON data...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  
    const mockDashboardJson = {
        
            "deliveryPerformance": [
              {"Date": "2025-01-05", "Supplier": "FastFreight", "Product": "Raw Material A", "DeliveryTime": 12, "ExpectedTime": 8, "Variance": 4},
              {"Date": "2025-01-12", "Supplier": "GlobalTrans", "Product": "Component B", "DeliveryTime": 10, "ExpectedTime": 10, "Variance": 0},
              {"Date": "2025-01-18", "Supplier": "ExpressShip", "Product": "Raw Material C", "DeliveryTime": 18, "ExpectedTime": 9, "Variance": 9},
              {"Date": "2025-01-25", "Supplier": "FastFreight", "Product": "Component D", "DeliveryTime": 9, "ExpectedTime": 8, "Variance": 1},
              {"Date": "2025-02-03", "Supplier": "LocalLogist", "Product": "Raw Material A", "DeliveryTime": 7, "ExpectedTime": 8, "Variance": -1},
              {"Date": "2025-02-10", "Supplier": "ExpressShip", "Product": "Component B", "DeliveryTime": 19, "ExpectedTime": 9, "Variance": 10},
              {"Date": "2025-02-17", "Supplier": "GlobalTrans", "Product": "Raw Material C", "DeliveryTime": 12, "ExpectedTime": 10, "Variance": 2},
              {"Date": "2025-02-24", "Supplier": "FastFreight", "Product": "Component D", "DeliveryTime": 13, "ExpectedTime": 8, "Variance": 5},
              {"Date": "2025-03-05", "Supplier": "ExpressShip", "Product": "Raw Material A", "DeliveryTime": 16, "ExpectedTime": 9, "Variance": 7},
              {"Date": "2025-03-12", "Supplier": "LocalLogist", "Product": "Component B", "DeliveryTime": 10, "ExpectedTime": 8, "Variance": 2},
              {"Date": "2025-03-19", "Supplier": "GlobalTrans", "Product": "Raw Material C", "DeliveryTime": 11, "ExpectedTime": 10, "Variance": 1},
              {"Date": "2025-03-26", "Supplier": "FastFreight", "Product": "Component D", "DeliveryTime": 14, "ExpectedTime": 8, "Variance": 6}
            ],
            "supplierQuality": [
              {"Supplier": "TechSupply", "Product": "Electronic A", "QualityScore": 92, "Price": 45.80, "Quantity": 2500, "RejectionRate": 2.1},
              {"Supplier": "PrimeParts", "Product": "Electronic B", "QualityScore": 88, "Price": 67.25, "Quantity": 1800, "RejectionRate": 3.5},
              {"Supplier": "GlobalComp", "Product": "Electronic C", "QualityScore": 79, "Price": 52.40, "Quantity": 3200, "RejectionRate": 7.8},
              {"Supplier": "IndustrialX", "Product": "Raw Material D", "QualityScore": 90, "Price": 23.15, "Quantity": 5000, "RejectionRate": 2.9},
              {"Supplier": "MetalWorks", "Product": "Raw Material E", "QualityScore": 82, "Price": 34.60, "Quantity": 4200, "RejectionRate": 5.2},
              {"Supplier": "ComponentsY", "Product": "Component F", "QualityScore": 95, "Price": 78.30, "Quantity": 1500, "RejectionRate": 1.3},
              {"Supplier": "FastSupply", "Product": "Component G", "QualityScore": 76, "Price": 41.75, "Quantity": 2800, "RejectionRate": 8.7},
              {"Supplier": "PrecisionZ", "Product": "Electronic H", "QualityScore": 91, "Price": 105.20, "Quantity": 900, "RejectionRate": 2.2}
            ],
            "carbonFootprint": [
              {"Supplier": "FastFreight", "TransportMode": "Truck", "Distance": 320, "CarbonEmissions": 4800, "ShipmentWeight": 8.5},
              {"Supplier": "GlobalTrans", "TransportMode": "Rail", "Distance": 780, "CarbonEmissions": 3120, "ShipmentWeight": 12.4},
              {"Supplier": "ExpressShip", "TransportMode": "Air", "Distance": 2500, "CarbonEmissions": 31250, "ShipmentWeight": 5.2},
              {"Supplier": "LocalLogist", "TransportMode": "Truck", "Distance": 150, "CarbonEmissions": 2250, "ShipmentWeight": 7.8},
              {"Supplier": "SeaFreight", "TransportMode": "Ship", "Distance": 8500, "CarbonEmissions": 25500, "ShipmentWeight": 24.6},
              {"Supplier": "EcoLogistics", "TransportMode": "Rail", "Distance": 650, "CarbonEmissions": 2600, "ShipmentWeight": 10.5},
              {"Supplier": "AirCargo", "TransportMode": "Air", "Distance": 3200, "CarbonEmissions": 38400, "ShipmentWeight": 6.3},
              {"Supplier": "RoadExpress", "TransportMode": "Truck", "Distance": 480, "CarbonEmissions": 7200, "ShipmentWeight": 9.4}
            ],
            "networkConnectivity": [
              {"Source": "Warehouse A", "Destination": "Distribution 1", "FlowVolume": 450, "ReliabilityScore": 92, "TransitTime": 2},
              {"Source": "Warehouse B", "Destination": "Distribution 2", "FlowVolume": 380, "ReliabilityScore": 88, "TransitTime": 3},
              {"Source": "Warehouse C", "Destination": "Distribution 1", "FlowVolume": 320, "ReliabilityScore": 95, "TransitTime": 1},
              {"Source": "Factory 1", "Destination": "Warehouse A", "FlowVolume": 620, "ReliabilityScore": 90, "TransitTime": 4},
              {"Source": "Factory 2", "Destination": "Warehouse B", "FlowVolume": 580, "ReliabilityScore": 86, "TransitTime": 5},
              {"Source": "Factory 3", "Destination": "Warehouse C", "FlowVolume": 410, "ReliabilityScore": 93, "TransitTime": 3},
              {"Source": "Supplier Hub 1", "Destination": "Factory 1", "FlowVolume": 780, "ReliabilityScore": 85, "TransitTime": 7},
              {"Source": "Supplier Hub 2", "Destination": "Factory 2", "FlowVolume": 690, "ReliabilityScore": 89, "TransitTime": 6},
              {"Source": "Supplier Hub 3", "Destination": "Factory 3", "FlowVolume": 550, "ReliabilityScore": 91, "TransitTime": 5}
            ],
            "priceFluctuations": [
              {"Date": "2025-01-10", "Product": "Material X", "Supplier": "GlobalComp", "BasePrice": 42.50, "ActualPrice": 43.80, "Deviation": 3.06, "Currency": "USD"},
              {"Date": "2025-01-25", "Product": "Component Y", "Supplier": "PrimeParts", "BasePrice": 68.75, "ActualPrice": 72.40, "Deviation": 5.31, "Currency": "USD"},
              {"Date": "2025-02-05", "Product": "Material Z", "Supplier": "MetalWorks", "BasePrice": 31.20, "ActualPrice": 34.60, "Deviation": 10.90, "Currency": "USD"},
              {"Date": "2025-02-20", "Product": "Component V", "Supplier": "FastSupply", "BasePrice": 55.90, "ActualPrice": 53.25, "Deviation": -4.74, "Currency": "USD"},
              {"Date": "2025-03-10", "Product": "Material X", "Supplier": "GlobalComp", "BasePrice": 42.50, "ActualPrice": 46.20, "Deviation": 8.71, "Currency": "USD"},
              {"Date": "2025-03-25", "Product": "Component Y", "Supplier": "PrimeParts", "BasePrice": 68.75, "ActualPrice": 75.10, "Deviation": 9.24, "Currency": "USD"}
            ],
            "inventoryLevels": [
              {"Date": "2025-01-15", "Warehouse": "Warehouse A", "Product": "Product 1", "CurrentStock": 1250, "OptimalStock": 1500, "DaysOfSupply": 18, "ReorderPoint": 650},
              {"Date": "2025-01-15", "Warehouse": "Warehouse A", "Product": "Product 2", "CurrentStock": 820, "OptimalStock": 900, "DaysOfSupply": 15, "ReorderPoint": 400},
              {"Date": "2025-01-15", "Warehouse": "Warehouse B", "Product": "Product 1", "CurrentStock": 980, "OptimalStock": 1200, "DaysOfSupply": 14, "ReorderPoint": 550},
              {"Date": "2025-01-15", "Warehouse": "Warehouse B", "Product": "Product 3", "CurrentStock": 1540, "OptimalStock": 1600, "DaysOfSupply": 22, "ReorderPoint": 700},
              {"Date": "2025-02-15", "Warehouse": "Warehouse A", "Product": "Product 1", "CurrentStock": 980, "OptimalStock": 1500, "DaysOfSupply": 14, "ReorderPoint": 650},
              {"Date": "2025-02-15", "Warehouse": "Warehouse A", "Product": "Product 2", "CurrentStock": 420, "OptimalStock": 900, "DaysOfSupply": 8, "ReorderPoint": 400},
              {"Date": "2025-02-15", "Warehouse": "Warehouse B", "Product": "Product 1", "CurrentStock": 750, "OptimalStock": 1200, "DaysOfSupply": 11, "ReorderPoint": 550},
              {"Date": "2025-02-15", "Warehouse": "Warehouse B", "Product": "Product 3", "CurrentStock": 1340, "OptimalStock": 1600, "DaysOfSupply": 19, "ReorderPoint": 700},
              {"Date": "2025-03-15", "Warehouse": "Warehouse A", "Product": "Product 1", "CurrentStock": 1450, "OptimalStock": 1500, "DaysOfSupply": 21, "ReorderPoint": 650},
              {"Date": "2025-03-15", "Warehouse": "Warehouse A", "Product": "Product 2", "CurrentStock": 350, "OptimalStock": 900, "DaysOfSupply": 6, "ReorderPoint": 400},
              {"Date": "2025-03-15", "Warehouse": "Warehouse B", "Product": "Product 1", "CurrentStock": 480, "OptimalStock": 1200, "DaysOfSupply": 7, "ReorderPoint": 550},
              {"Date": "2025-03-15", "Warehouse": "Warehouse B", "Product": "Product 3", "CurrentStock": 910, "OptimalStock": 1600, "DaysOfSupply": 13, "ReorderPoint": 700}
            ],
            "anomalyNotes": [
              {"id": 1, "text": "ExpressShip consistently exceeds expected delivery times by 7-10 days, particularly for Raw Material C."},
              {"id": 2, "text": "GlobalComp and FastSupply have quality scores below our acceptable threshold of 85%."},
              {"id": 3, "text": "Air freight carbon emissions are significantly higher than other transport modes without corresponding delivery time benefits."},
              {"id": 4, "text": "Warehouse A - Product 2 and Warehouse B - Product 1 inventory levels dropped below reorder points in March."},
              {"id": 5, "text": "Material Z from MetalWorks showed the highest price increase (10.90%) in February."}
            ],
            "recommendations": [
              {"id": 1, "text": "Conduct performance review with ExpressShip and consider alternative suppliers for Raw Material C."},
              {"id": 2, "text": "Implement quality improvement programs with GlobalComp and FastSupply."},
              {"id": 3, "text": "Review air freight usage and assess alternative transportation options for non-urgent shipments."},
              {"id": 4, "text": "Improve inventory management systems to prevent stock levels dropping below reorder points."},
              {"id": 5, "text": "Investigate price increase cause for Material Z and negotiate long-term pricing agreements."}
            ]
          
      }; // End of mockDashboardJson object
  
    console.log("API Call: Received dashboard JSON data.");
    return mockDashboardJson;
  };