import React, { createContext, useState, useContext, ReactNode } from 'react';

/**
 * @typedef {Object} BusinessData
 * @property {string=} name
 * @property {string=} description
 * @property {string=} location
 * @property {string=} category
 */
type BusinessData = {
  name?: string;
  description?: string;
  location?: string;
  category?: string;
};

type BusinessContextType = {
  businessData: BusinessData;
  setBusinessData: React.Dispatch<React.SetStateAction<BusinessData>>;
};

// ✅ 3. Create the context
const CreateBusinessContext = createContext<BusinessContextType | undefined>(undefined);

// ✅ 4. Create the provider
export const CreateBusinessProvider = ({ children }: { children: ReactNode }) => {
  const [businessData, setBusinessData] = useState<BusinessData>({});

  return (
    <CreateBusinessContext.Provider value={{ businessData, setBusinessData }}>
      {children}
    </CreateBusinessContext.Provider>
  );
};

// ✅ 5. Create the hook
export const useCreateBusiness = () => {
  const context = useContext(CreateBusinessContext);
  if (!context) {
    throw new Error('useCreateBusiness must be used within a CreateBusinessProvider');
  }
  return context;
};
