/* global $request, $done */

(() => {
  const url = $request.url;

  if (url === 'https://v3.paddleapi.com/3.2/license/activate') {
    const body = $request.body.split('&');
    let productId = '';
    for (const k of body) {
      if (k.includes('product_id')) {
        productId = k.split('=')[1];
      }
    }

    $done({
      response: {
        body: JSON.stringify({
          success: true,
          response: {
            product_id: productId,
            activation_id: 'QiuChenly',
            type: 'personal',
            expires: 1,
            expiry_date: 1_999_999_999_999
          }
        })
      }
    });

    return;
  }

  if (url === 'https://v3.paddleapi.com/3.2/license/verify') {
    $done({
      response: {
        body: JSON.stringify({
          success: true,
          response: {
            type: 'personal',
            expires: 1,
            expiry_date: 1_999_999_999_999
          }
        })
      }
    });

    return;
  }

  if (
    url.includes('execute-api.eu-central-1.amazonaws.com/default/meddle-activate')
    || url.includes('execute-api.eu-central-1.amazonaws.com/default/meddle-deactivate')
    || url.includes('execute-api.eu-central-1.amazonaws.com/default/meddle-authenticate')
  ) {
    $done({
      response: {
        body: 'success'
      }
    });

    return;
  }

  if (url.startsWith('https://coderunnerapp.com/api.php?')) {
    const response = { body: '{}' };
    const body = {};

    if (url.includes('action=register')) {
      body.success = true;
    } else if (url.includes('action=price')) {
      body.price = 'AEAAA-ADHY5-\n2LK2G-HOS2Q';
    }

    response.body = JSON.stringify(body);
    $done({ response });
  }
})();
