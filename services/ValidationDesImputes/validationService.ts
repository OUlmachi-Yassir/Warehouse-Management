
export const validateSecretKey = (secretKey: string): string | null => {
    if (!secretKey) {
      return 'Le code secret est requis.';
    }
  
    const regex = /^[A-Za-z0-9]{6,}$/;
    if (!regex.test(secretKey)) {
      return 'Le code secret doit comporter au moins 6 caractères et être composé uniquement de lettres et de chiffres.';
    }
  
    return null;  
  };


export const validateName = (name: string): boolean => {
    const regex = /^[A-Za-z\s]{3,}$/;
    return regex.test(name);
  };
  
  export const validateType = (type: string): boolean => {
    return type.trim().length > 0;
  };
  
  export const validateBarcode = (barcode: string): boolean => {
    const regex = /^[1-9]\d{12,13}$/;
    return regex.test(barcode);
  };
  
  export const validatePrice = (price: string): boolean => {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(price);
  };
  
  export const validateSupplier = (supplier: string): boolean => {
    return supplier.trim().length > 0;
  };
  
  export const validateQuantity = (quantity: string, isStockAvailable: boolean): boolean => {
    if (isStockAvailable) {
      const regex = /^[1-9]\d*$/; 
      return regex.test(quantity);
    }
    return true; 
  };
  
  
  
  