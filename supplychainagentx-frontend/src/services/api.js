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
  
  // Add rejectRecommendation if needed later
  // export const rejectRecommendation = async (id) => { ... }