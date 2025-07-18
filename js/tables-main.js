document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle logic
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const overlay = document.querySelector('.overlay');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // Tabs logic (التربيزات وفواتير التربيزات) - تم إصلاح هذا الجزء
    const tabs = document.querySelectorAll('.devices-tab');
    const tabContents = document.querySelectorAll('.tab-content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.tabTarget);
            
            if (target) {
                // إزالة active من جميع التبويبات
                tabs.forEach(t => t.classList.remove('active'));
                // إخفاء جميع المحتويات
                tabContents.forEach(tc => {
                    tc.classList.remove('active');
                    tc.classList.add('hidden-section');
                });

                // تفعيل التبويب المحدد
                tab.classList.add('active');
                // إظهار المحتوى المستهدف
                target.classList.remove('hidden-section');
                target.classList.add('active');
            }
        });
    });

    // Set initial tab active
    const initialActiveTab = document.querySelector('.devices-tab.active');
    if (initialActiveTab) {
        const initialTarget = document.querySelector(initialActiveTab.dataset.tabTarget);
        if (initialTarget) {
            initialTarget.classList.remove('hidden-section');
            initialTarget.classList.add('active');
        }
    }

    // Modals
    const addDeviceModal = document.getElementById('addDeviceModal');
    const addDeviceBtn = document.getElementById('addDeviceBtn');
    const cancelAddDevice = document.getElementById('cancelAddDevice');
    const saveNewDevice = document.getElementById('saveNewDevice');

    const deviceDetailsModal = document.getElementById('deviceDetailsModal');
    const closeDeviceDetailsModal = document.getElementById('closeDeviceDetailsModal');

    // Open Add Device Modal
    if (addDeviceBtn) {
        addDeviceBtn.addEventListener('click', () => {
            addDeviceModal.classList.add('active');
        });
    }

    // Close Add Device Modal
    if (addDeviceModal) {
        const closeBtn = addDeviceModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                addDeviceModal.classList.remove('active');
            });
        }
    }

    if (cancelAddDevice) {
        cancelAddDevice.addEventListener('click', () => {
            addDeviceModal.classList.remove('active');
        });
    }

    // Handle Save New Device
    if (saveNewDevice) {
        saveNewDevice.addEventListener('click', (event) => {
            event.preventDefault();
            alert('تم حفظ التربيزة الجديدة بنجاح (وظيفة وهمية)');
            addDeviceModal.classList.remove('active');
        });
    }

    // Open Device Details Modal
    document.querySelectorAll('.btn-device-details').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.device-card');
            const deviceType = card.querySelector('.device-type').textContent;
            const deviceId = card.querySelector('.device-id').textContent;
            const hourlyRate = (deviceId === '001' || deviceId === '004') ? '25.00' : '20.00';

            if (document.getElementById('modalDeviceType')) {
                document.getElementById('modalDeviceType').textContent = deviceType;
            }
            if (document.getElementById('modalDeviceID')) {
                document.getElementById('modalDeviceID').textContent = deviceId;
            }
            if (document.getElementById('modalDeviceHourlyRate')) {
                document.getElementById('modalDeviceHourlyRate').textContent = hourlyRate;
            }

            if (deviceDetailsModal) {
                deviceDetailsModal.classList.add('active');
            }
        });
    });

    // Close Device Details Modal
    if (deviceDetailsModal) {
        const closeBtn = deviceDetailsModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                deviceDetailsModal.classList.remove('active');
            });
        }
    }

    if (closeDeviceDetailsModal) {
        closeDeviceDetailsModal.addEventListener('click', () => {
            deviceDetailsModal.classList.remove('active');
        });
    }

    // Invoice & Bofeih Modal Logic
    const invoiceBofeihModal = document.getElementById('invoiceBofeihModal');
    const invoiceMessageSection = document.querySelector('.invoice-message-section');
    const bofeihSection = document.querySelector('.bofeih-section');
    const footerButtons = document.querySelector('.modal-footer-buttons');

    // Function to open Invoice & Bofeih Modal
    document.querySelectorAll('.btn-invoice-bofeih').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.device-card');
            const deviceId = card.querySelector('.device-id').textContent;

            if (invoiceBofeihModal) {
                invoiceBofeihModal.classList.add('active');
                
                // إظهار الأقسام الأساسية
                if (invoiceMessageSection) invoiceMessageSection.classList.remove('hidden-section');
                if (bofeihSection) bofeihSection.classList.remove('hidden-section');
                if (footerButtons) footerButtons.classList.remove('hidden-section');

                // تحديث رقم التربيزة
                const deviceIdSpan = document.querySelector('.device-id-in-modal');
                if (deviceIdSpan) {
                    deviceIdSpan.textContent = `تربيزة ${deviceId}`;
                }
            }
        });
    });

    // Close Invoice & Bofeih Modal
    if (invoiceBofeihModal) {
        const closeBtn = invoiceBofeihModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                invoiceBofeihModal.classList.remove('active');
            });
        }

        const cancelBtn = invoiceBofeihModal.querySelector('.btn-cancel-bottom');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                invoiceBofeihModal.classList.remove('active');
            });
        }
    }

    // Bofeih Details Modal Logic
    const bofeihDetailsModal = document.getElementById('bofeihDetailsModal');
    const editBofeihBtn = document.getElementById('editBofeihBtn');
    const bofeihDeviceIdDisplay = document.getElementById('bofeihDeviceIdDisplay');
    const bofeihProductsTableBody = document.getElementById('bofeihProductsTableBody');
    const bofeihTotalSumDisplay = document.getElementById('bofeihTotalSumDisplay');
    const addProductsBtn = document.getElementById('addProductsBtn');

    // Open Bofeih Details Modal
    if (editBofeihBtn) {
        editBofeihBtn.addEventListener('click', function() {
            if (invoiceBofeihModal) {
                invoiceBofeihModal.classList.remove('active');
            }
            
            if (bofeihDetailsModal) {
                bofeihDetailsModal.classList.add('active');
                
                // تحديث رقم التربيزة
                const currentDeviceId = document.querySelector('.device-id-in-modal');
                if (currentDeviceId && bofeihDeviceIdDisplay) {
                    const deviceId = currentDeviceId.textContent.replace('تربيزة ', '');
                    bofeihDeviceIdDisplay.textContent = deviceId;
                }

                // تحديث جدول المنتجات
                updateBofeihProductsTable([
                    { name: "كوكاكولا", price: 12.00, qty: 1 },
                    { name: "شيبسي", price: 5.00, qty: 2 },
                    { name: "عصير برتقال", price: 8.00, qty: 1 }
                ]);
            }
        });
    }

    // Close Bofeih Details Modal
    if (bofeihDetailsModal) {
        const closeBtn = bofeihDetailsModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                bofeihDetailsModal.classList.remove('active');
                if (invoiceBofeihModal) {
                    invoiceBofeihModal.classList.add('active');
                }
            });
        }

        const cancelBtn = document.getElementById('cancelBofeihDetailsModalBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                bofeihDetailsModal.classList.remove('active');
                if (invoiceBofeihModal) {
                    invoiceBofeihModal.classList.add('active');
                }
            });
        }
    }

    // Function to update products table
    function updateBofeihProductsTable(products) {
        if (!bofeihProductsTableBody) return;
        
        bofeihProductsTableBody.innerHTML = '';
        let totalBofeihAmount = 0;

        products.forEach(product => {
            const row = bofeihProductsTableBody.insertRow();
            const itemTotal = product.price * product.qty;
            totalBofeihAmount += itemTotal;

            row.innerHTML = `
                <td class="item-name">${product.name}</td>
                <td class="item-price">${product.price.toFixed(2)}</td>
                <td class="item-qty">${product.qty}</td>
                <td class="item-total">${itemTotal.toFixed(2)} ج</td>
                <td><button class="delete-product-btn"><i class="fas fa-trash-alt"></i></button></td>
            `;
            
            const deleteBtn = row.querySelector('.delete-product-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    row.remove();
                    updateBofeihTotalDisplay();
                });
            }
        });
        
        updateBofeihTotalDisplay(totalBofeihAmount);
    }

    function updateBofeihTotalDisplay(initialTotal = null) {
        if (!bofeihTotalSumDisplay) return;
        
        let currentTotal = initialTotal !== null ? initialTotal : 0;
        if (initialTotal === null && bofeihProductsTableBody) {
            bofeihProductsTableBody.querySelectorAll('tr').forEach(row => {
                const itemTotalText = row.querySelector('.item-total')?.textContent || '0';
                const itemTotal = parseFloat(itemTotalText.replace(' ج', ''));
                if (!isNaN(itemTotal)) {
                    currentTotal += itemTotal;
                }
            });
        }
        bofeihTotalSumDisplay.textContent = currentTotal.toFixed(2);
    }

    // Add Products Modal Logic
    const addProductToBofeihModal = document.getElementById('addProductToBofeihModal');
    const addProductDeviceIdDisplay = document.getElementById('addProductDeviceIdDisplay');
    const searchProductInput = document.querySelector('#addProductToBofeihModal .search-product-input');
    const categoryButtons = document.querySelectorAll('#addProductToBofeihModal .category-btn');
    const productListDiv = document.querySelector('#addProductToBofeihModal .product-list');
    const selectedProductsTableBody = document.getElementById('selectedProductsTableBody');
    const totalSelectedProductsAmountSpan = document.getElementById('totalSelectedProductsAmount');
    const saveSelectedProductsBtn = document.querySelector('.save-selected-products-btn');

    // أزرار عرض الشبكة والقائمة
    const gridViewBtn = document.getElementById('bofeihGridViewBtn');
    const listViewBtn = document.getElementById('bofeihListViewBtn');

    // Dummy Product Data
    const allProducts = [
        { id: 'juice001', name: 'عصير برتقال', category: 'عصائر', price: 15.00 },
        { id: 'juice002', name: 'عصير تفاح', category: 'عصائر', price: 15.00 },
        { id: 'juice003', name: 'عصير مانجو', category: 'عصائر', price: 20.00 },
        { id: 'juice004', name: 'عصير فراولة', category: 'عصائر', price: 18.00 },
        { id: 'soda001', name: 'كوكاكولا', category: 'صودا', price: 10.00 },
        { id: 'soda002', name: 'بيبسي', category: 'صودا', price: 10.00 },
        { id: 'soda003', name: 'سفن أب', category: 'صودا', price: 9.00 },
        { id: 'soda004', name: 'سبرايت', category: 'صودا', price: 9.00 },
        { id: 'hot001', name: 'قهوة', category: 'مشروبات ساخنة', price: 12.00 },
        { id: 'hot002', name: 'شاي', category: 'مشروبات ساخنة', price: 8.00 },
        { id: 'hot003', name: 'نسكافيه', category: 'مشروبات ساخنة', price: 15.00 },
        { id: 'hot004', name: 'هوت شوكليت', category: 'مشروبات ساخنة', price: 22.00 }
    ];

    // متغير لتتبع نوع العرض الحالي
    let currentViewType = 'grid';

    function renderProducts(productsToRender) {
        if (!productListDiv) return;
        
        productListDiv.innerHTML = '';
        if (productsToRender.length === 0) {
            productListDiv.innerHTML = '<p style="text-align: center; color: #777;">لا توجد منتجات مطابقة.</p>';
            return;
        }

        // تطبيق نوع العرض
        productListDiv.className = `product-list ${currentViewType}-view`;

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.dataset.productId = product.id;
            
            if (currentViewType === 'list') {
                productCard.innerHTML = `
                    <div class="product-info">
                        <div>
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">${product.price.toFixed(2)} ج</div>
                        </div>
                        <button class="add-product-to-selection-btn" 
                                data-product-id="${product.id}"
                                data-product-name="${product.name}"
                                data-product-price="${product.price}">
                            أضف <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                `;
            } else {
                productCard.innerHTML = `
                    <p class="product-name">${product.name}</p>
                    <p class="product-price">${product.price.toFixed(2)} ج</p>
                    <button class="add-product-to-selection-btn" 
                            data-product-id="${product.id}"
                            data-product-name="${product.name}"
                            data-product-price="${product.price}">
                        أضف <i class="fas fa-cart-plus"></i>
                    </button>
                `;
            }
            
            productListDiv.appendChild(productCard);
        });

        // Add event listeners for new "Add" buttons
        productListDiv.querySelectorAll('.add-product-to-selection-btn').forEach(button => {
            button.addEventListener('click', addProductToSelectedList);
        });
    }

    // أزرار تغيير نوع العرض
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            currentViewType = 'grid';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            
            // إعادة عرض المنتجات بالنوع الجديد
            const activeCategory = document.querySelector('#addProductToBofeihModal .category-btn.active');
            if (activeCategory) {
                const category = activeCategory.textContent;
                const filteredProducts = category === 'الكل' ? allProducts : allProducts.filter(p => p.category === category);
                renderProducts(filteredProducts);
            }
        });
    }

    if (listViewBtn) {
        listViewBtn.addEventListener('click', function() {
            currentViewType = 'list';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            
            // إعادة عرض المنتجات بالنوع الجديد
            const activeCategory = document.querySelector('#addProductToBofeihModal .category-btn.active');
            if (activeCategory) {
                const category = activeCategory.textContent;
                const filteredProducts = category === 'الكل' ? allProducts : allProducts.filter(p => p.category === category);
                renderProducts(filteredProducts);
            }
        });
    }

    function addProductToSelectedList(event) {
        const productId = event.currentTarget.dataset.productId;
        const productName = event.currentTarget.dataset.productName;
        const productPrice = parseFloat(event.currentTarget.dataset.productPrice);

        if (!selectedProductsTableBody) return;

        // Check if product already exists
        const existingRow = selectedProductsTableBody.querySelector(`tr[data-product-id="${productId}"]`);

        if (existingRow) {
            const qtyInput = existingRow.querySelector('.item-qty input');
            if (qtyInput) {
                qtyInput.value = parseInt(qtyInput.value) + 1;
                updateSelectedProductRowTotal(qtyInput);
            }
        } else {
            const row = selectedProductsTableBody.insertRow();
            row.dataset.productId = productId;
            row.innerHTML = `
                <td class="item-name">${productName}</td>
                <td class="item-price">${productPrice.toFixed(2)}</td>
                <td class="item-qty"><input type="number" value="1" min="1" data-product-price="${productPrice}" class="qty-input"></td>
                <td class="item-total">${productPrice.toFixed(2)} ج</td>
                <td><button class="delete-selected-product-btn"><i class="fas fa-trash-alt"></i></button></td>
            `;

            const qtyInput = row.querySelector('.qty-input');
            if (qtyInput) {
                qtyInput.addEventListener('input', function() {
                    if (this.value < 1) this.value = 1;
                    updateSelectedProductRowTotal(this);
                });
            }

            const deleteBtn = row.querySelector('.delete-selected-product-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    this.closest('tr').remove();
                    updateSelectedProductsTotal();
                });
            }
        }
        updateSelectedProductsTotal();
    }

    function updateSelectedProductRowTotal(qtyInput) {
        const row = qtyInput.closest('tr');
        const price = parseFloat(qtyInput.dataset.productPrice);
        const quantity = parseInt(qtyInput.value);
        const itemTotal = price * quantity;
        const totalCell = row.querySelector('.item-total');
        if (totalCell) {
            totalCell.textContent = `${itemTotal.toFixed(2)} ج`;
        }
        updateSelectedProductsTotal();
    }

    function updateSelectedProductsTotal() {
        if (!selectedProductsTableBody || !totalSelectedProductsAmountSpan) return;
        
        let total = 0;
        selectedProductsTableBody.querySelectorAll('tr').forEach(row => {
            const itemTotalText = row.querySelector('.item-total')?.textContent || '0';
            const itemTotal = parseFloat(itemTotalText.replace(' ج', ''));
            if (!isNaN(itemTotal)) {
                total += itemTotal;
            }
        });
        totalSelectedProductsAmountSpan.textContent = total.toFixed(2);
    }

    // Open Add Products Modal
    if (addProductsBtn) {
        addProductsBtn.addEventListener('click', function() {
            if (bofeihDetailsModal) {
                bofeihDetailsModal.classList.remove('active');
            }
            
            if (addProductToBofeihModal) {
                addProductToBofeihModal.classList.add('active');
                
                // تحديث رقم التربيزة
                if (bofeihDeviceIdDisplay && addProductDeviceIdDisplay) {
                    addProductDeviceIdDisplay.textContent = bofeihDeviceIdDisplay.textContent;
                }

                // مسح المنتجات المحددة سابقاً
                if (selectedProductsTableBody) {
                    selectedProductsTableBody.innerHTML = '';
                }
                if (totalSelectedProductsAmountSpan) {
                    totalSelectedProductsAmountSpan.textContent = '0.00';
                }
                
                // إظهار المنتجات الافتراضية
                if (searchProductInput) {
                    searchProductInput.value = '';
                }
                
                // تفعيل أول فئة وعرض الشبكة
                currentViewType = 'grid';
                if (gridViewBtn) gridViewBtn.classList.add('active');
                if (listViewBtn) listViewBtn.classList.remove('active');
                
                categoryButtons.forEach((btn, index) => {
                    btn.classList.remove('active');
                    if (index === 0) {
                        btn.classList.add('active');
                        const category = btn.textContent;
                        const filteredProducts = category === 'الكل' ? allProducts : allProducts.filter(p => p.category === category);
                        renderProducts(filteredProducts);
                    }
                });
            }
        });
    }

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            if (searchProductInput) {
                searchProductInput.value = '';
            }

            const category = this.textContent;
            const filteredProducts = category === 'الكل' ? allProducts : allProducts.filter(product => product.category === category);
            renderProducts(filteredProducts);
        });
    });

    // Search functionality
    if (searchProductInput) {
        searchProductInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            const filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        });
    }

    // Close Add Product Modal
    if (addProductToBofeihModal) {
        const closeBtn = addProductToBofeihModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                addProductToBofeihModal.classList.remove('active');
                if (bofeihDetailsModal) {
                    bofeihDetailsModal.classList.add('active');
                }
            });
        }

        const cancelBtn = document.getElementById('cancelAddProductModalBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                addProductToBofeihModal.classList.remove('active');
                if (bofeihDetailsModal) {
                    bofeihDetailsModal.classList.add('active');
                }
            });
        }
    }

    // Save Selected Products
    if (saveSelectedProductsBtn) {
        saveSelectedProductsBtn.addEventListener('click', function() {
            const selectedItems = [];
            if (selectedProductsTableBody) {
                selectedProductsTableBody.querySelectorAll('tr').forEach(row => {
                    const productId = row.dataset.productId;
                    const productName = row.querySelector('.item-name')?.textContent || '';
                    const productPrice = parseFloat(row.querySelector('.item-price')?.textContent || '0');
                    const productQty = parseInt(row.querySelector('.item-qty input')?.value || '0');
                    selectedItems.push({ id: productId, name: productName, price: productPrice, qty: productQty });
                });
            }

            alert('تم حفظ المنتجات المضافة بنجاح!');
            
            // تحديث جدول البوفيه
            updateBofeihProductsTable(selectedItems);
            
            // إغلاق مودال إضافة المنتجات والعودة لمودال البوفيه
            if (addProductToBofeihModal) {
                addProductToBofeihModal.classList.remove('active');
            }
            if (bofeihDetailsModal) {
                bofeihDetailsModal.classList.add('active');
            }
        });
    }

    // Invoice View Modal Logic
    const invoiceViewModal = document.getElementById('invoiceViewModal');
    const viewInvoiceBtn = document.querySelector('.btn-view-invoice');

    if (viewInvoiceBtn) {
        viewInvoiceBtn.addEventListener('click', function() {
            if (invoiceBofeihModal) {
                invoiceBofeihModal.classList.remove('active');
            }
            
            if (invoiceViewModal) {
                invoiceViewModal.classList.add('active');
                
                // تحديث البيانات
                const currentDeviceId = document.querySelector('.device-id-in-modal')?.textContent.replace('تربيزة ', '') || '1';
                const deviceIdSpan = document.getElementById('invoiceViewDeviceId');
                if (deviceIdSpan) {
                    deviceIdSpan.textContent = currentDeviceId;
                }
                
                // تحديث المبالغ (بيانات وهمية)
                const totalTimeSpan = document.getElementById('invoiceTotalTime');
                const totalBofeihSpan = document.getElementById('invoiceTotalBofeih');
                const grandTotalSpan = document.getElementById('invoiceGrandTotal');
                
                if (totalTimeSpan) totalTimeSpan.textContent = '30.00 ج';
                if (totalBofeihSpan) totalBofeihSpan.textContent = '22.00 ج';
                if (grandTotalSpan) grandTotalSpan.textContent = '52.00 ج';
            }
        });
    }

    // Close Invoice View Modal
    if (invoiceViewModal) {
        const closeBtn = invoiceViewModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                invoiceViewModal.classList.remove('active');
            });
        }

        const closeInvoiceBtn = invoiceViewModal.querySelector('.close-invoice-btn');
        if (closeInvoiceBtn) {
            closeInvoiceBtn.addEventListener('click', function() {
                invoiceViewModal.classList.remove('active');
            });
        }
    }

    // Payment Modal Logic
    const paymentModal = document.getElementById('paymentModal');
    const payInvoiceBtn = document.querySelector('.pay-invoice-btn');
    const cashAmountInput = document.getElementById('cashAmount');
    const discountAmountInput = document.getElementById('discountAmount');
    const paymentTotalAmountSpan = document.getElementById('paymentTotalAmount');
    const remainingAmountSpan = document.getElementById('remainingAmount');
    const remainingSection = document.querySelector('.remaining-section');
    const savePaymentBtn = document.getElementById('savePaymentBtn');
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const customerSearchSection = document.querySelector('.customer-search-section');
    const couponSection = document.querySelector('.coupon-section');
    const cashSection = document.querySelector('.cash-section');
    const customerSelect = document.getElementById('customerSelect');
    const customerInfoDisplay = document.querySelector('.customer-info-display');
    const customerNameDisplay = document.getElementById('customerNameDisplay');
    const customerBalanceDisplay = document.getElementById('customerBalanceDisplay');
    const couponCodeInput = document.getElementById('couponCode');
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const appliedCouponName = document.getElementById('appliedCouponName');
    const appliedCouponDiscount = document.getElementById('appliedCouponDiscount');

    // بيانات الكوبونات الوهمية
    const availableCoupons = {
        'SAVE10': { name: 'خصم 10 جنيه', discount: 10.00, type: 'fixed' },
        'DISCOUNT20': { name: 'خصم 20%', discount: 20, type: 'percentage' },
        'WELCOME': { name: 'ترحيب - خصم 5 جنيه', discount: 5.00, type: 'fixed' },
        'VIP50': { name: 'عضو VIP - خصم 50%', discount: 50, type: 'percentage' }
    };

    let appliedCoupon = null;

    // Function to calculate payment and remaining amount
    function calculatePaymentRemaining() {
        if (!paymentTotalAmountSpan || !remainingAmountSpan || !remainingSection || !savePaymentBtn) return;

        const totalAmount = parseFloat(paymentTotalAmountSpan.textContent.replace(' ج', '')) || 0;
        let discountAmount = parseFloat(discountAmountInput?.value) || 0;
        
        // إضافة خصم الكوبون
        let couponDiscount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.type === 'percentage') {
                couponDiscount = totalAmount * (appliedCoupon.discount / 100);
            } else {
                couponDiscount = appliedCoupon.discount;
            }
        }
        
        // حساب المبلغ بعد الخصم
        const finalTotal = totalAmount - discountAmount - couponDiscount;
        
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        let paidAmount = 0;

        if (paymentMethod === 'cash') {
            paidAmount = parseFloat(cashAmountInput?.value) || 0;
        } else if (paymentMethod === 'customerCredit') {
            const selectedCustomer = customerSelect?.value;
            if (selectedCustomer && customerInfoDisplay?.classList.contains('active')) {
                const customerBalance = parseFloat(customerBalanceDisplay?.textContent) || 0;
                paidAmount = Math.min(customerBalance, finalTotal);
            }
        } else if (paymentMethod === 'coupon') {
            paidAmount = finalTotal; // الكوبون يغطي المبلغ كاملاً
        }

        const remaining = paidAmount - finalTotal;

        if (paidAmount > 0 || paymentMethod === 'coupon') {
            remainingSection.classList.add('active');
            
            if (remaining >= 0) {
                // المبلغ كافي أو أكثر - إظهار الباقي
                remainingSection.classList.remove('negative');
                remainingSection.style.backgroundColor = '#d4edda';
                remainingSection.style.color = '#155724';
                remainingSection.style.borderColor = '#28a745';
                remainingAmountSpan.textContent = `الباقي: ${remaining.toFixed(2)} ج`;
                savePaymentBtn.disabled = false;
                savePaymentBtn.style.backgroundColor = '#28a745';
                savePaymentBtn.style.cursor = 'pointer';
            } else {
                // المبلغ غير كافي - إظهار المطلوب
                remainingSection.classList.add('negative');
                remainingSection.style.backgroundColor = '#f8d7da';
                remainingSection.style.color = '#721c24';
                remainingSection.style.borderColor = '#dc3545';
                remainingAmountSpan.textContent = `المطلوب: ${Math.abs(remaining).toFixed(2)} ج`;
                savePaymentBtn.disabled = true;
                savePaymentBtn.style.backgroundColor = '#cccccc';
                savePaymentBtn.style.cursor = 'not-allowed';
            }
        } else {
            remainingSection.classList.remove('active');
            savePaymentBtn.disabled = true;
            savePaymentBtn.style.backgroundColor = '#cccccc';
            savePaymentBtn.style.cursor = 'not-allowed';
        }
    }

    // Payment method selection
    if (paymentMethodRadios) {
        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Hide all sections first
                if (customerSearchSection) customerSearchSection.classList.remove('active');
                if (couponSection) couponSection.classList.remove('active');
                if (cashSection) cashSection.classList.remove('active');
                
                // Show relevant section based on selected payment method
                if (this.value === 'cash') {
                    if (cashSection) cashSection.classList.add('active');
                } else if (this.value === 'customerCredit') {
                    if (customerSearchSection) customerSearchSection.classList.add('active');
                } else if (this.value === 'coupon') {
                    if (couponSection) couponSection.classList.add('active');
                }
                
                // Recalculate payment
                calculatePaymentRemaining();
            });
        });
    }

    // Customer selection
    if (customerSelect) {
        customerSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.value && customerInfoDisplay) {
                const customerName = selectedOption.textContent.split(' - ')[0];
                const customerBalance = selectedOption.dataset.balance;
                
                customerNameDisplay.textContent = customerName;
                customerBalanceDisplay.textContent = customerBalance;
                customerInfoDisplay.classList.add('active');
                
                calculatePaymentRemaining();
            } else if (customerInfoDisplay) {
                customerInfoDisplay.classList.remove('active');
                calculatePaymentRemaining();
            }
        });
    }

    // Apply Coupon
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', function() {
            const couponCode = couponCodeInput?.value.trim().toUpperCase();
            
            if (couponCode && availableCoupons[couponCode]) {
                appliedCoupon = availableCoupons[couponCode];
                appliedCouponName.textContent = appliedCoupon.name;
                
                if (appliedCoupon.type === 'percentage') {
                    appliedCouponDiscount.textContent = `${appliedCoupon.discount}%`;
                } else {
                    appliedCouponDiscount.textContent = `${appliedCoupon.discount.toFixed(2)} ج`;
                }
                
                alert(`تم تطبيق الكوبون: ${appliedCoupon.name}`);
                calculatePaymentRemaining();
            } else {
                alert('كود الكوبون غير صحيح!');
                appliedCoupon = null;
                appliedCouponName.textContent = '-';
                appliedCouponDiscount.textContent = '0.00 ج';
                calculatePaymentRemaining();
            }
        });
    }

    if (payInvoiceBtn) {
        payInvoiceBtn.addEventListener('click', function() {
            if (invoiceViewModal) {
                invoiceViewModal.classList.remove('active');
            }
            
            if (paymentModal) {
                paymentModal.classList.add('active');
                
                // تحديث البيانات
                const currentDeviceId = document.getElementById('invoiceViewDeviceId')?.textContent || '1';
                const paymentDeviceIdSpan = document.getElementById('paymentDeviceId');
                if (paymentDeviceIdSpan) {
                    paymentDeviceIdSpan.textContent = currentDeviceId;
                }
                
                // تحديث المبلغ الإجمالي
                const totalAmount = document.getElementById('invoiceGrandTotal')?.textContent || '52.00 ج';
                if (paymentTotalAmountSpan) {
                    paymentTotalAmountSpan.textContent = totalAmount;
                }
                
                // إظهار قسم النقد بشكل افتراضي
                if (cashSection) {
                    cashSection.classList.add('active');
                }

                // إعادة تعيين القيم
                if (cashAmountInput) cashAmountInput.value = '';
                if (discountAmountInput) discountAmountInput.value = '0';
                if (couponCodeInput) couponCodeInput.value = '';
                if (customerSelect) customerSelect.value = '';
                if (customerInfoDisplay) customerInfoDisplay.classList.remove('active');
                appliedCoupon = null;
                if (appliedCouponName) appliedCouponName.textContent = '-';
                if (appliedCouponDiscount) appliedCouponDiscount.textContent = '0.00 ج';
                if (remainingSection) remainingSection.classList.remove('active');
                if (savePaymentBtn) {
                    savePaymentBtn.disabled = true;
                    savePaymentBtn.style.backgroundColor = '#cccccc';
                    savePaymentBtn.style.cursor = 'not-allowed';
                }
            }
        });
    }

    // Add event listeners for payment calculation
    if (cashAmountInput) {
        cashAmountInput.addEventListener('input', calculatePaymentRemaining);
    }

    if (discountAmountInput) {
        discountAmountInput.addEventListener('input', calculatePaymentRemaining);
    }

    // Close Payment Modal
    if (paymentModal) {
        const closeBtn = paymentModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                paymentModal.classList.remove('active');
                if (invoiceViewModal) {
                    invoiceViewModal.classList.add('active');
                }
            });
        }

        const cancelBtn = paymentModal.querySelector('.cancel-payment-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                paymentModal.classList.remove('active');
                if (invoiceViewModal) {
                    invoiceViewModal.classList.add('active');
                }
            });
        }
    }

    // Save Payment Button
    if (savePaymentBtn) {
        savePaymentBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const totalAmount = parseFloat(paymentTotalAmountSpan.textContent.replace(' ج', '')) || 0;
            const paidAmount = parseFloat(cashAmountInput?.value) || 0;
            const discountAmount = parseFloat(discountAmountInput?.value) || 0;
            let couponDiscount = 0;
            
            if (appliedCoupon) {
                if (appliedCoupon.type === 'percentage') {
                    couponDiscount = totalAmount * (appliedCoupon.discount / 100);
                } else {
                    couponDiscount = appliedCoupon.discount;
                }
            }
            
            const finalTotal = totalAmount - discountAmount - couponDiscount;
            const remaining = paidAmount - finalTotal;

            let paymentDetails = `تم حفظ الدفع بنجاح!\n\nالإجمالي: ${totalAmount.toFixed(2)} ج\nالخصم العادي: ${discountAmount.toFixed(2)} ج`;
            
            if (appliedCoupon) {
                paymentDetails += `\nخصم الكوبون: ${couponDiscount.toFixed(2)} ج (${appliedCoupon.name})`;
            }
            
            paymentDetails += `\nالمطلوب: ${finalTotal.toFixed(2)} ج\nالمدفوع: ${paidAmount.toFixed(2)} ج\nالباقي: ${remaining.toFixed(2)} ج`;

            alert(paymentDetails);
            
            // إغلاق جميع المودالات
            paymentModal.classList.remove('active');
            invoiceViewModal.classList.remove('active');
            invoiceBofeihModal.classList.remove('active');
        });
    }

    // New Order Button Logic - زر أوردر جديد
    document.querySelectorAll('.btn-new-order').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.device-card');
            const deviceId = card.querySelector('.device-id').textContent;
            
            // فتح مودال إضافة المنتجات مباشرة
            if (addProductToBofeihModal) {
                addProductToBofeihModal.classList.add('active');
                
                // تحديث رقم التربيزة
                if (addProductDeviceIdDisplay) {
                    addProductDeviceIdDisplay.textContent = deviceId;
                }

                // مسح المنتجات المحددة سابقاً
                if (selectedProductsTableBody) {
                    selectedProductsTableBody.innerHTML = '';
                }
                if (totalSelectedProductsAmountSpan) {
                    totalSelectedProductsAmountSpan.textContent = '0.00';
                }
                
                // إظهار المنتجات الافتراضية
                if (searchProductInput) {
                    searchProductInput.value = '';
                }
                
                // تفعيل أول فئة وعرض الشبكة
                currentViewType = 'grid';
                if (gridViewBtn) gridViewBtn.classList.add('active');
                if (listViewBtn) listViewBtn.classList.remove('active');
                
                categoryButtons.forEach((btn, index) => {
                    btn.classList.remove('active');
                    if (index === 0) {
                        btn.classList.add('active');
                        const category = btn.textContent;
                        const filteredProducts = category === 'الكل' ? allProducts : allProducts.filter(p => p.category === category);
                        renderProducts(filteredProducts);
                    }
                });
            }
        });
    });

    // تعديل زر حفظ المنتجات لتحويل التربيزة من متاحة لغير متاحة
    if (saveSelectedProductsBtn) {
        const originalSaveHandler = saveSelectedProductsBtn.onclick;
        saveSelectedProductsBtn.onclick = null;
        
        saveSelectedProductsBtn.addEventListener('click', function() {
            const selectedItems = [];
            if (selectedProductsTableBody) {
                selectedProductsTableBody.querySelectorAll('tr').forEach(row => {
                    const productId = row.dataset.productId;
                    const productName = row.querySelector('.item-name')?.textContent || '';
                    const productPrice = parseFloat(row.querySelector('.item-price')?.textContent || '0');
                    const productQty = parseInt(row.querySelector('.item-qty input')?.value || '0');
                    selectedItems.push({ id: productId, name: productName, price: productPrice, qty: productQty });
                });
            }

            if (selectedItems.length > 0) {
                alert('تم حفظ الأوردر بنجاح! التربيزة أصبحت غير متاحة.');
                
                // العثور على التربيزة وتحويلها من متاحة لغير متاحة
                const deviceId = addProductDeviceIdDisplay?.textContent;
                if (deviceId) {
                    const deviceCard = document.querySelector(`.device-card .device-id:contains('${deviceId}')`);
                    if (!deviceCard) {
                        // البحث بطريقة أخرى
                        document.querySelectorAll('.device-card .device-id').forEach(idElement => {
                            if (idElement.textContent === deviceId) {
                                const card = idElement.closest('.device-card');
                                if (card && card.classList.contains('available')) {
                                    // تحويل التربيزة من متاحة لغير متاحة
                                    card.classList.remove('available');
                                    card.classList.add('unavailable');
                                    
                                    // تحديث الأزرار
                                    const actionsDiv = card.querySelector('.device-actions');
                                    if (actionsDiv) {
                                        actionsDiv.innerHTML = `
                                            <button class="btn-invoice-bofeih"><i class="fas fa-receipt"></i> الفاتورة والبوفيه</button>
                                            <button class="btn-device-details"><i class="fas fa-info-circle"></i> بيانات التربيزة</button>
                                        `;
                                        
                                        // إعادة ربط الأحداث للأزرار الجديدة
                                        const newInvoiceBtn = actionsDiv.querySelector('.btn-invoice-bofeih');
                                        if (newInvoiceBtn) {
                                            newInvoiceBtn.addEventListener('click', function() {
                                                const card = this.closest('.device-card');
                                                const deviceId = card.querySelector('.device-id').textContent;

                                                if (invoiceBofeihModal) {
                                                    invoiceBofeihModal.classList.add('active');
                                                    
                                                    // إظهار الأقسام الأساسية
                                                    if (invoiceMessageSection) invoiceMessageSection.classList.remove('hidden-section');
                                                    if (bofeihSection) bofeihSection.classList.remove('hidden-section');
                                                    if (footerButtons) footerButtons.classList.remove('hidden-section');

                                                    // تحديث رقم التربيزة
                                                    const deviceIdSpan = document.querySelector('.device-id-in-modal');
                                                    if (deviceIdSpan) {
                                                        deviceIdSpan.textContent = `تربيزة ${deviceId}`;
                                                    }
                                                }
                                            });
                                        }
                                        
                                        const newDetailsBtn = actionsDiv.querySelector('.btn-device-details');
                                        if (newDetailsBtn) {
                                            newDetailsBtn.addEventListener('click', function() {
                                                const card = this.closest('.device-card');
                                                const deviceType = card.querySelector('.device-type').textContent;
                                                const deviceId = card.querySelector('.device-id').textContent;
                                                const hourlyRate = (deviceId === '001' || deviceId === '004') ? '25.00' : '20.00';

                                                if (document.getElementById('modalDeviceType')) {
                                                    document.getElementById('modalDeviceType').textContent = deviceType;
                                                }
                                                if (document.getElementById('modalDeviceID')) {
                                                    document.getElementById('modalDeviceID').textContent = deviceId;
                                                }
                                                if (document.getElementById('modalDeviceHourlyRate')) {
                                                    document.getElementById('modalDeviceHourlyRate').textContent = hourlyRate;
                                                }

                                                if (deviceDetailsModal) {
                                                    deviceDetailsModal.classList.add('active');
                                                }
                                            });
                                        }
                                    }
                                    
                                    // نقل التربيزة من قسم المتاحة لقسم غير المتاحة
                                    const unavailableContainer = document.querySelector('.unavailable-title').nextElementSibling.querySelector('.device-cards-container');
                                    if (unavailableContainer) {
                                        unavailableContainer.appendChild(card);
                                    }
                                }
                            }
                        });
                    }
                }
                
                // إغلاق مودال إضافة المنتجات
                if (addProductToBofeihModal) {
                    addProductToBofeihModal.classList.remove('active');
                }
            } else {
                alert('يرجى اختيار منتجات أولاً!');
            }
        });
    }

    console.log('تم تحميل جميع وظائف التربيزات بنجاح');
});