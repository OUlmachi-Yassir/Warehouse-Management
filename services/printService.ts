import * as Print from 'expo-print';
import { Product } from './productService';

export const printProductList = async (products: Product[]) => {
  const html = generateHTML(products);

  const { uri } = await Print.printToFileAsync({ html });
  await Print.printAsync({
    uri,
  });
  console.log('PDF saved at: ', uri);
};

const generateHTML = (products: Product[]) => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          .image { width: 100px; height: auto; }
          .section-title { font-size: 18px; margin-top: 20px; text-decoration: underline; }
        </style>
      </head>
      <body>
        <h2>Liste des Produits</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Type</th>
              <th>Prix</th>
              <th>Fournisseur</th>
              <th>Stock Total</th>
              <th>Image</th>
              <th>Code-barres</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(product => `
              <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.type}</td>
                <td>${product.price} €</td>
                <td>${product.supplier}</td>
                <td>${product.stocks.reduce((sum, stock) => sum + stock.quantity, 0)}</td>
                <td><img src="${product.image}" class="image" /></td>
                <td>${product.barcode}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">Détails des Stocks</div>
        ${products.map(product => `
          <div>
            <h3>${product.name}</h3>
            <table>
              <thead>
                <tr>
                  <th>Nom de l'entrepôt</th>
                  <th>Quantité</th>
                  <th>Localisation</th>
                </tr>
              </thead>
              <tbody>
                ${product.stocks.map(stock => `
                  <tr>
                    <td>${stock.name}</td>
                    <td>${stock.quantity}</td>
                    <td>${stock.localisation.city} (Lat: ${stock.localisation.latitude}, Lon: ${stock.localisation.longitude})</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}

        <div class="section-title">Historique des Modifications</div>
        ${products.map(product => `
          <div>
            <h3>${product.name}</h3>
            <table>
              <thead>
                <tr>
                  <th>Modifié par</th>
                  <th>Date de modification</th>
                </tr>
              </thead>
              <tbody>
                ${product.editedBy.map(edit => `
                  <tr>
                    <td>Warehouseman ${edit.warehousemanId}</td>
                    <td>${new Date(edit.at).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
      </body>
    </html>
  `;
};
