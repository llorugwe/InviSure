const insuranceMetadata = { 
  Health: [
    { 
      name: "age", 
      type: "number", 
      required: true, 
      factor: 1.2, 
      instructions: "Enter your age in years." 
    },
    { 
      name: "healthConditions", 
      type: "select", 
      options: [
        { label: "None", value: 1 },
        { label: "Mild", value: 1.3 },
        { label: "Chronic", value: 1.6 }
      ],
      required: true, 
      factor: 1.5, 
      instructions: "Select any chronic health conditions." 
    },
    { 
      name: "smokingStatus", 
      type: "select", 
      options: [
        { label: "non-smoker", value: 1 },
        { label: "smoker", value: 1.5 }
      ], 
      required: true, 
      instructions: "Indicate if you are a smoker." 
    }
  ],
  Life: [
    { 
      name: "age", 
      type: "number", 
      required: true, 
      factor: 1.1, 
      instructions: "Enter your age." 
    },
    { 
      name: "occupationRisk", 
      type: "select", 
      options: [
        { label: "Low risk (e.g., office job)", value: 1 },
        { label: "Medium risk (e.g., manual labor)", value: 1.3 },
        { label: "High risk (e.g., construction)", value: 1.6 }
      ], 
      required: true, 
      factor: 1.4, 
      instructions: "Select your occupation risk level." 
    },
    { 
      name: "lifestyle", 
      type: "select", 
      options: [
        { label: "active", value: 1 },
        { label: "sedentary", value: 1.3 }
      ], 
      required: true, 
      instructions: "Select your lifestyle type." 
    }
  ],
  Car: [
    { 
      name: "carYear", 
      type: "number", 
      required: true, 
      factor: 1.3, 
      instructions: "Enter the manufacturing year of your car." 
    },
    { 
      name: "drivingRecord", 
      type: "select", 
      options: [
        { label: "clean", value: 1 },          // Lowered from original 1
        { label: "minor accidents", value: 1.2 }, // Reduced jump for minor accidents
        { label: "major accidents", value: 1.5 }  // Lowered from 2 for a smoother gradient
      ], 
      required: true, 
      factor: 1.6, 
      instructions: "Select your driving record." 
    },
    { 
      name: "location", 
      type: "select", 
      options: [
        { label: "high density", value: 1.5 },
        { label: "medium density", value: 1.2 },
        { label: "low density", value: 1 }
      ], 
      required: true, 
      factor: 1.3, 
      instructions: "Select your primary residential area type." 
    }
  ],  
  Home: [
    { 
      name: "homeAge", 
      type: "number", 
      required: true, 
      factor: 1.1, 
      instructions: "Enter the age of your home in years." 
    },
    { 
      name: "location", 
      type: "select", 
      options: [
        { label: "urban", value: 1.5 },
        { label: "suburban", value: 1.2 },
        { label: "rural", value: 1 }
      ], 
      required: true, 
      factor: 1.5, 
      instructions: "Select the area type where your home is located." 
    },
    { 
      name: "constructionType", 
      type: "select", 
      options: [
        { label: "brick", value: 1 },
        { label: "wood", value: 1.3 },
        { label: "concrete", value: 0.9 }
      ], 
      required: true, 
      factor: 1.4, 
      instructions: "Select the primary construction material of your home." 
    }
  ],
  Travel: [
    { 
      name: "destinationRisk", 
      type: "select", 
      options: [
        { label: "low risk", value: 1 },
        { label: "medium risk", value: 1.3 },
        { label: "high risk", value: 1.6 }
      ], 
      required: true, 
      factor: 1.2, 
      instructions: "Select the risk level of your travel destination." 
    },
    { 
      name: "duration", 
      type: "number", 
      required: true, 
      factor: 1.3, 
      instructions: "Provide the duration of travel in days." 
    },
    { 
      name: "purpose", 
      type: "select", 
      options: [
        { label: "business", value: 1.5 },
        { label: "vacation", value: 1.2 },
        { label: "study", value: 1.3 },
        { label: "other", value: 1.1 }
      ], 
      required: true, 
      instructions: "Select the purpose of your travel." 
    }
  ]
};

module.exports = insuranceMetadata;