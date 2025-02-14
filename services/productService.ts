export interface Stock {
    id: number;
    name: string;
    quantity: number;
    localisation: {
      city: string;
      latitude: number;
      longitude: number;
    };
  }
  
  export interface Product {
    id: number;
    name: string;
    type: string;
    barcode: string;
    price: number;
    solde?: number;
    supplier: string;
    image?: string;
    stocks: Stock[];
    editedBy: {
      warehousemanId: number;
      at: string;
    }[];
  }
  export interface Statistics {
    totalProducts: number;
    totalCities: number;
    outOfStock: number;
    totalStockValue: number;
  }
  
  export const sortProducts = (
    products: Product[],
    criterion: "price" | "name" | "quantity",
    order: "asc" | "desc" = "asc"
  ): Product[] => {
    return [...products].sort((a, b) => {
      let valueA, valueB;
      switch (criterion) {
        case "price":
          valueA = a.price;
          valueB = b.price;
          break;
        case "name":
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case "quantity":
          valueA = a.stocks.reduce((total, stock) => total + stock.quantity, 0);
          valueB = b.stocks.reduce((total, stock) => total + stock.quantity, 0);
          break;
        default:
          return 0;
      }
      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });
  };
  
  export const filterByCity = (products: Product[], city: string): Product[] => {
    return products.filter((product) =>
      product.stocks.some((stock) => stock.localisation.city.toLowerCase() === city.toLowerCase())
    );
  };
  
  export const searchProducts = (
    products: Product[],
    keyword: string,
    criteria: "name" | "type" | "price" | "supplier"
  ): Product[] => {
    keyword = keyword.toLowerCase();
    return products.filter((product) => {
      switch (criteria) {
        case "name":
          return product.name.toLowerCase().includes(keyword);
        case "type":
          return product.type.toLowerCase().includes(keyword);
        case "price":
          return product.price.toString().includes(keyword);
        case "supplier":
          return product.supplier.toLowerCase().includes(keyword);
        default:
          return false;
      }
    });
  };
  