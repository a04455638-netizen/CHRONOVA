// E2E Integration & Verification Script for CHRONOVA

async function runTests() {
  console.log('🚀 Starting CHRONOVA Integration Tests...');
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Home page
  await test('Storefront Home (/) HTTP 200', async () => {
    const res = await fetch(`${baseUrl}/`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('CHRONOVA')) throw new Error('Missing CHRONOVA brand text');
  });

  // 2. Catalog page
  await test('Katalog (/katalog) HTTP 200', async () => {
    const res = await fetch(`${baseUrl}/katalog`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // 3. Admin Login API
  let adminCookie = '';
  await test('Admin Login API (/api/admin/login)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@chronova.uz',
        password: 'ChronovaAdmin2026!'
      })
    });
    if (res.status !== 200) throw new Error(`Login failed with status ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Login not successful');
    const cookie = res.headers.get('set-cookie');
    if (cookie) adminCookie = cookie.split(';')[0];
  });

  // 4. Order Creation API (Guest Checkout)
  let createdOrderNumber = '';
  let createdOrderId = '';
  await test('Guest Checkout Order Creation (/api/orders/create)', async () => {
    const res = await fetch(`${baseUrl}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Alisher Qodirov',
        customer_phone: '+998 90 999 88 77',
        customer_email: 'alisher@test.uz',
        delivery_region: 'Toshkent shahri',
        delivery_city: 'Mirobod tumani',
        delivery_address: 'Nukus ko\'chasi, 21-uy',
        delivery_notes: 'Qo\'ng\'iroq qilib kelinsin',
        payment_method: 'cash_on_delivery',
        items: [
          {
            product_id: 'p-rolex-submariner',
            qty: 1
          }
        ]
      })
    });

    if (res.status !== 200) {
      const err = await res.text();
      throw new Error(`Order create returned ${res.status}: ${err}`);
    }
    const data = await res.json();
    if (!data.order || !data.order.order_number) {
      throw new Error('Order number missing in response');
    }
    createdOrderNumber = data.order.order_number;
    createdOrderId = data.order.id;
    console.log(`   Order created: ${createdOrderNumber} (ID: ${createdOrderId})`);
  });

  // 5. Order Tracking API
  await test('Order Tracking (/api/orders/track)', async () => {
    if (!createdOrderNumber) throw new Error('No order to track');
    const res = await fetch(`${baseUrl}/api/orders/track?id=${encodeURIComponent(createdOrderNumber)}&phone=${encodeURIComponent('+998 90 999 88 77')}`);
    if (res.status !== 200) throw new Error(`Tracking returned ${res.status}`);
    const data = await res.json();
    if (!data.order || data.order.order_number !== createdOrderNumber) {
      throw new Error('Tracked order does not match created order');
    }
  });

  // 6. Admin Order Status Update
  await test('Admin Status Update (/api/admin/orders/status)', async () => {
    if (!createdOrderId) throw new Error('No order to update');
    const res = await fetch(`${baseUrl}/api/admin/orders/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      },
      body: JSON.stringify({
        order_id: createdOrderId,
        status: 'confirmed',
        note: 'Admin tomonidan tasdiqlandi'
      })
    });
    if (res.status !== 200) throw new Error(`Status update failed: ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update status');
  });

  // 7. Telegram Bot Dispatcher
  await test('Telegram Outbox Dispatcher (/api/telegram/dispatch)', async () => {
    const res = await fetch(`${baseUrl}/api/telegram/dispatch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer chronova_super_secret_cron_pass_2026'
      }
    });
    if (res.status !== 200) throw new Error(`Dispatch returned ${res.status}`);
    const data = await res.json();
    console.log(`   Dispatched outbox count: ${data.processed || 0}`);
  });

  // 8. Admin Product CRUD
  let createdProductId = '';
  await test('Admin Product CRUD (/api/admin/products)', async () => {
    // Create product
    const createRes = await fetch(`${baseUrl}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      },
      body: JSON.stringify({
        name: 'Patek Philippe Nautilus 5711/1R Test',
        slug: `nautilus-test-${Date.now()}`,
        brand_id: 'b-patek',
        category_id: 'cat-sport',
        model_number: '5711/1R-001',
        sku: `PP-NAUT-${Date.now()}`,
        base_price_uzs: 980000000,
        stock_quantity: 3,
        description: 'Rose gold luxury sports icon.',
        movement_type: 'Avtomatik',
        is_published: true
      })
    });
    if (createRes.status !== 200) throw new Error(`Product creation failed: ${createRes.status}`);
    const createData = await createRes.json();
    if (!createData.product?.id) throw new Error('Product ID missing');
    createdProductId = createData.product.id;
    console.log(`   Created Product: ${createData.product.name} (ID: ${createdProductId})`);

    // Update product stock
    const updateRes = await fetch(`${baseUrl}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie
      },
      body: JSON.stringify({
        id: createdProductId,
        stock_quantity: 7
      })
    });
    if (updateRes.status !== 200) throw new Error(`Product update failed: ${updateRes.status}`);
    const updateData = await updateRes.json();
    if (updateData.product?.stock_quantity !== 7) throw new Error('Stock update failed to apply');

    // Delete product
    const delRes = await fetch(`${baseUrl}/api/admin/products?id=${createdProductId}`, {
      method: 'DELETE',
      headers: { 'Cookie': adminCookie }
    });
    if (delRes.status !== 200) throw new Error(`Product delete failed: ${delRes.status}`);
  });

  // 9. Coupon Discount Calculation during checkout
  await test('Coupon Validation (CHRONOVA10 = 10% OFF)', async () => {
    const res = await fetch(`${baseUrl}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Diyorbek Nurmatov',
        customer_phone: '+998 97 111 22 33',
        delivery_region: 'Samarqand viloyati',
        delivery_city: 'Samarqand shahri',
        delivery_address: 'Registon ko\'chasi, 12-uy',
        coupon_code: 'CHRONOVA10',
        payment_method: 'card_upon_receipt',
        items: [{ product_id: 'p-cartier-santos', quantity: 1 }]
      })
    });
    if (res.status !== 200) {
      const err = await res.text();
      throw new Error(`Order with coupon failed: ${err}`);
    }
    const data = await res.json();
    if (!data.order || data.order.discount_uzs <= 0) {
      throw new Error('Coupon discount was not applied properly');
    }
    console.log(`   Applied discount: ${data.order.discount_uzs.toLocaleString()} UZS on order ${data.order.order_number}`);
  });

  // 10. Maintenance Mode (Texnik Tanaffus) Toggle
  await test('Maintenance Mode Toggle (/api/admin/maintenance)', async () => {
    // 1. Enable maintenance mode
    const enableRes = await fetch(`${baseUrl}/api/admin/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie,
      },
      body: JSON.stringify({
        enabled: true,
        reason: 'Texnik tanaffus testi: server sozlanmoqda.',
      }),
    });
    if (enableRes.status !== 200) throw new Error(`Enable maintenance returned ${enableRes.status}`);
    const enableData = await enableRes.json();
    if (!enableData.maintenance?.enabled) throw new Error('Maintenance mode did not turn on');

    // 2. Check public status endpoint
    const pubRes = await fetch(`${baseUrl}/api/maintenance`);
    const pubData = await pubRes.json();
    if (!pubData.enabled) throw new Error('Public maintenance API did not report enabled');

    // 3. Disable maintenance mode (restore online)
    const disableRes = await fetch(`${baseUrl}/api/admin/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminCookie,
      },
      body: JSON.stringify({
        enabled: false,
      }),
    });
    if (disableRes.status !== 200) throw new Error(`Disable maintenance returned ${disableRes.status}`);
    const disableData = await disableRes.json();
    if (disableData.maintenance?.enabled) throw new Error('Maintenance mode did not turn off');
    console.log('   Maintenance mode toggle on/off verified successfully.');
  });

  // 11. Security Test: Direct unauthenticated /admin access redirects to /admin/login
  await test('Security: Unauthenticated /admin redirects to /admin/login', async () => {
    const res = await fetch(`${baseUrl}/admin`, { redirect: 'manual' });
    const location = res.headers.get('location') || '';
    if (res.status !== 307 && res.status !== 302 && !location.includes('/admin/login')) {
      throw new Error(`Expected redirect to /admin/login, got status ${res.status} with location ${location}`);
    }
  });

  // 12. Security Test: Public footer contains NO admin links
  await test('Security: Public storefront has NO Admin links in footer/navbar', async () => {
    const res = await fetch(`${baseUrl}/`);
    const html = await res.text();
    if (html.includes('href="/admin"') || html.includes('Admin Panelga Kirish') || html.includes('Admin Tizimi')) {
      throw new Error('Found publicly visible Admin Panel links in storefront HTML!');
    }
  });

  // 13. Security Test: Non-admin customer session receives Access Denied
  await test('Security: Customer session blocked from /admin (Access Denied)', async () => {
    const customerCookie = 'chronova_admin_session=' + encodeURIComponent(JSON.stringify({
      email: 'customer@test.uz',
      name: 'Regular Customer',
      role: 'customer'
    }));

    const res = await fetch(`${baseUrl}/admin`, {
      headers: { 'Cookie': customerCookie },
      redirect: 'manual'
    });
    const location = res.headers.get('location') || '';
    if (!location.includes('/admin/access-denied') && res.status !== 403) {
      throw new Error(`Expected redirect to /admin/access-denied, got status ${res.status} with location ${location}`);
    }
  });

  console.log(`\n🏁 Test Results: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)\n`);
  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();

