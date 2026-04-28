/**
 * Sevich Hair - Google Apps Script Backend
 * 
 * À déployer comme Web App dans Google Apps Script
 * Toutes les commandes, paniers abandonnés, newsletter, contacts seront enregistrés
 * dans des feuilles séparées de votre Google Sheet.
 * 
 * INSTRUCTIONS DE DÉPLOIEMENT :
 * 1. Allez sur https://script.google.com et créez un nouveau projet
 * 2. Collez ce code dans le fichier Code.gs
 * 3. Cliquez sur "Déployer" > "Nouveau déploiement"
 * 4. Type : "Application Web"
 * 5. Exécuter en tant que : "Moi"
 * 6. Qui a accès : "Tout le monde"
 * 7. Cliquez "Déployer" et copiez l'URL
 * 8. Collez l'URL dans Settings du panneau admin
 */

const SHEET_NAMES = {
  ORDERS: 'Orders',
  ABANDONED: 'Abandoned Carts',
  NEWSLETTER: 'Newsletter',
  CONTACT: 'Contact',
  TEST: 'Test Log',
};

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const type = payload.type;
    const data = payload.data || {};
    
    switch (type) {
      case 'order':
        return handleOrder(data);
      case 'abandoned_cart':
        return handleAbandoned(data);
      case 'newsletter':
        return handleNewsletter(data);
      case 'contact':
        return handleContact(data);
      case 'test':
        return handleTest(data);
      default:
        return jsonResponse({ status: 'error', message: 'Unknown type: ' + type });
    }
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function doGet() {
  return jsonResponse({ status: 'ok', message: 'Sevich Hair Webhook is running' });
}

function handleOrder(data) {
  const sheet = getSheet(SHEET_NAMES.ORDERS, [
    'Date', 'Order ID', 'Status', 'Name', 'Phone', 'Email',
    'Wilaya', 'Commune', 'Address', 'Shipping Type', 
    'Products', 'Total Qty', 'Subtotal', 'Shipping Cost', 'Total', 'Notes'
  ]);
  sheet.appendRow([
    data.created_at || new Date().toISOString(),
    data.order_id || '',
    data.status || 'En attente',
    data.name || '',
    data.phone || '',
    data.email || '',
    data.wilaya || '',
    data.commune || '',
    data.address || '',
    data.shipping_type || '',
    data.cart_items || '',
    data.total_qty || 0,
    data.subtotal || 0,
    data.shipping_cost || 0,
    data.total || 0,
    data.notes || '',
  ]);
  return jsonResponse({ status: 'success' });
}

function handleAbandoned(data) {
  const sheet = getSheet(SHEET_NAMES.ABANDONED, [
    'Last Update', 'Phone', 'Name', 'Email', 'Wilaya', 'Commune', 'Address',
    'Cart Items', 'Subtotal', 'Recovered'
  ]);
  
  // Cherche la ligne existante par téléphone
  const phone = (data.phone || '').replace(/\D/g, '');
  const values = sheet.getDataRange().getValues();
  let foundRow = -1;
  for (let i = 1; i < values.length; i++) {
    const rowPhone = String(values[i][1] || '').replace(/\D/g, '');
    if (rowPhone === phone && phone !== '') {
      foundRow = i + 1;
      break;
    }
  }
  
  const row = [
    data.updated_at || new Date().toISOString(),
    data.phone || '',
    data.name || '',
    data.email || '',
    data.wilaya || '',
    data.commune || '',
    data.address || '',
    data.cart_items || '',
    data.subtotal || 0,
    'Non',
  ];
  
  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
  
  return jsonResponse({ status: 'success' });
}

function handleNewsletter(data) {
  const sheet = getSheet(SHEET_NAMES.NEWSLETTER, ['Date', 'Email']);
  sheet.appendRow([data.created_at || new Date().toISOString(), data.email || '']);
  return jsonResponse({ status: 'success' });
}

function handleContact(data) {
  const sheet = getSheet(SHEET_NAMES.CONTACT, [
    'Date', 'Name', 'Phone', 'Email', 'Subject', 'Message'
  ]);
  sheet.appendRow([
    data.created_at || new Date().toISOString(),
    data.name || '',
    data.phone || '',
    data.email || '',
    data.subject || '',
    data.message || '',
  ]);
  return jsonResponse({ status: 'success' });
}

function handleTest(data) {
  const sheet = getSheet(SHEET_NAMES.TEST, ['Date', 'Message']);
  sheet.appendRow([new Date().toISOString(), data.message || 'Test']);
  return jsonResponse({ status: 'success', message: 'Connection OK' });
}

function getSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#1d1d1f')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
