import { RootState, StoreType } from '@/services/redux/store'; 
import { fetchProducts, deleteProduct } from '@/services/redux/productSlice';
import productReducer from '@/services/redux/productSlice';
import { Product } from '@/services/productService';
import { configureStore } from '@reduxjs/toolkit';

global.fetch = jest.fn();

const mockProducts: Product[] = [
  { id: 1, name: 'Product A', type: 'Electronics', barcode: '12345', price: 100, supplier: 'Supplier X', stocks: [], editedBy: [] },
  { id: 2, name: 'Product B', type: 'Appliances', barcode: '67890', price: 50, supplier: 'Supplier Y', stocks: [], editedBy: [] }
];

describe('Product Slice', () => {
  let store: StoreType; 

  beforeEach(() => {
    store = configureStore({
      reducer: { products: productReducer },
    }) as StoreType; 
  });

  test('should return initial state', () => {
    expect(productReducer(undefined, { type: '' })).toEqual({
      products: [],
      loading: false,
      error: null
    });
  });

  test('fetchProducts should handle fulfilled state', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockProducts)
    });

    await store.dispatch(fetchProducts() as any);
    const state = (store.getState() as RootState).products;

    expect(state.loading).toBe(false);
    expect(state.products).toEqual(mockProducts);
  });

  test('fetchProducts should handle rejected state', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });

    await store.dispatch(fetchProducts() as any);
    const state = (store.getState() as RootState).products;

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch products');
  });

  test('deleteProduct should remove a product from state', async () => {
    store.dispatch({ type: fetchProducts.fulfilled.type, payload: mockProducts });

    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    await store.dispatch(deleteProduct(1) as any);
    const state = (store.getState() as RootState).products;

    expect(state.products.length).toBe(1);
    expect(state.products[0].id).toBe(2);
  });
});
