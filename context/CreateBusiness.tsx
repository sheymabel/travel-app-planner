import React, { createContext, useState, useContext, ReactNode } from 'react';

/**
 * @typedef {Object} businessData
 * @property {string=} name
 * @property {string=} description
 * @property {string=} location
 * @property {string=} category
 */
type businessData = {
  name?: string;
  description?: string;
  location?: string;
  category?: string;
};

type businessContextType = {
  businessData: businessData;
  setbusinessData: React.Dispatch<React.SetStateAction<businessData>>;
};

// ✅ 3. Create the context
const CreatebusinessContext = createContext<businessContextType | undefined>(undefined);

// ✅ 4. Create the provider
export const CreatebusinessProvider = ({ children }: { children: ReactNode }) => {
  const [businessData, setbusinessData] = useState<businessData>({});

  return (
    <CreatebusinessContext.Provider value={{ businessData, setbusinessData }}>
      {children}
    </CreatebusinessContext.Provider>
  );
};

// ✅ 5. Create the hook
export const useCreatebusiness = () => {
  const context = useContext(CreatebusinessContext);
  if (!context) {
    throw new Error('useCreatebusiness must be used within a CreatebusinessProvider');
  }
  return context;
};
