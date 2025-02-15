import {  sortProducts, filterByCity, searchProducts, Product, Stock } from "@/services/productService";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Produit A",
    type: "Électronique",
    barcode: "12345",
    price: 100,
    supplier: "Fournisseur X",
    stocks: [
      { id: 1, name: "Stock 1", quantity: 5, localisation: { city: "Paris", latitude: 48.8566, longitude: 2.3522 } }
    ],
    editedBy: [{ warehousemanId: 1, at: "2024-02-15T12:00:00Z" }]
  },
  {
    id: 2,
    name: "Produit B",
    type: "Électroménager",
    barcode: "67890",
    price: 50,
    supplier: "Fournisseur Y",
    stocks: [
      { id: 2, name: "Stock 2", quantity: 10, localisation: { city: "Lyon", latitude: 45.75, longitude: 4.85 } }
    ],
    editedBy: [{ warehousemanId: 2, at: "2024-02-14T10:00:00Z" }]
  }
];

describe("Product Utilities", () => {
  test("sortProducts should sort by price ascending", () => {
    const sorted = sortProducts(mockProducts, "price", "asc");
    expect(sorted[0].price).toBe(50);
    expect(sorted[1].price).toBe(100);
  });

  test("sortProducts should sort by name descending", () => {
    const sorted = sortProducts(mockProducts, "name", "desc");
    expect(sorted[0].name).toBe("Produit B");
    expect(sorted[1].name).toBe("Produit A");
  });

  test("filterByCity should return products in a given city", () => {
    const filtered = filterByCity(mockProducts, "Paris");
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe("Produit A");
  });

  test("searchProducts should find a product by name", () => {
    const result = searchProducts(mockProducts, "produit A", "name");
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Produit A");
  });

  test("searchProducts should find a product by supplier", () => {
    const result = searchProducts(mockProducts, "Fournisseur X", "supplier");
    expect(result.length).toBe(1);
    expect(result[0].supplier).toBe("Fournisseur X");
  });
});
