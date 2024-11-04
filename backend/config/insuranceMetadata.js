// backend/config/insuranceMetadata.js

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
          type: "text", 
          required: false, 
          factor: 1.5, 
          instructions: "List any chronic health conditions." 
      },
      { 
          name: "smokingStatus", 
          type: "select", 
          options: ["smoker", "non-smoker"], 
          required: true, 
          factor: 1.8, 
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
          name: "occupation", 
          type: "text", 
          required: true, 
          factor: 1.4, 
          instructions: "State your occupation." 
      },
      { 
          name: "lifestyle", 
          type: "select", 
          options: ["active", "sedentary"], 
          required: true, 
          factor: 1.3, 
          instructions: "Select your lifestyle type." 
      }
  ],
  Car: [
      { 
          name: "carModel", 
          type: "text", 
          required: true, 
          factor: 1.2, 
          instructions: "Provide the make and model of your car." 
      },
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
          options: ["clean", "minor accidents", "major accidents"], 
          required: true, 
          factor: 1.6, 
          instructions: "Select your driving record." 
      },
      { 
          name: "location", 
          type: "select", 
          options: ["high density", "medium density", "low density"], 
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
          options: ["urban", "suburban", "rural"], 
          required: true, 
          factor: 1.5, 
          instructions: "Select the area type where your home is located." 
      },
      { 
          name: "constructionType", 
          type: "select", 
          options: ["brick", "wood", "concrete"], 
          required: true, 
          factor: 1.4, 
          instructions: "Select the primary construction material of your home." 
      }
  ],
  Travel: [
      { 
          name: "destination", 
          type: "text", 
          required: true, 
          factor: 1.2, 
          instructions: "Enter the destination country or region." 
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
          options: ["business", "vacation", "study", "other"], 
          required: true, 
          factor: 1.5, 
          instructions: "Select the purpose of your travel." 
      }
  ]
};

module.exports = insuranceMetadata;
