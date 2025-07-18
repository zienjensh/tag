document.addEventListener('DOMContentLoaded', function() {
    // === Sidebar Toggle Logic - مطابق للأجهزة ===
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const overlay = document.querySelector('.overlay');

    // تعريف دالة toggleSidebar في النطاق العام
    window.toggleSidebar = function() {
        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    };

    // إضافة مستمعات الأحداث للقائمة الجانبية
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.toggleSidebar();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // إغلاق القائمة عند الضغط على Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    });

    // === Tab Switching Logic - مطابق للأجهزة ===
    window.switchTab = function(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        if (tabName === 'pending') {
            document.getElementById('pending-content').classList.add('active');
            document.getElementById('pending-orders-tab').classList.add('active');
        } else if (tabName === 'completed') {
            document.getElementById('completed-content').classList.add('active');
            document.getElementById('completed-orders-tab').classList.add('active');
        } else if (tabName === 'cancelled') {
            document.getElementById('cancelled-content').classList.add('active');
            document.getElementById('cancelled-orders-tab').classList.add('active');
        }
    };

    // === وظائف العرض والفلترة الجديدة - مطابق للأجهزة ===
    window.showAllOrders = function() {
        // إظهار جميع الأوردرات
        const preparingSection = document.getElementById('preparingOrdersSection');
        const readySection = document.getElementById('readyOrdersSection');
        
        if (preparingSection) preparingSection.classList.remove('hidden');
        if (readySection) readySection.classList.remove('hidden');
        
        // تمييز الكارت المضغوط
        highlightCard('totalOrders');
        showNotification('عرض جميع الأوردرات', 'info');
    };

    window.showPendingOrders = function() {
        // إظهار الأوردرات المعلقة فقط
        const preparingSection = document.getElementById('preparingOrdersSection');
        const readySection = document.getElementById('readyOrdersSection');
        
        if (preparingSection) preparingSection.classList.remove('hidden');
        if (readySection) readySection.classList.remove('hidden');
        
        // تمييز الكارت المضغوط
        highlightCard('pendingOrders');
        showNotification('عرض الأوردرات المعلقة', 'info');
        
        // التبديل إلى تبويب الأوردرات المعلقة
        switchTab('pending');
    };

    window.showCompletedOrders = function() {
        // التبديل إلى تبويب الأوردرات المكتملة
        switchTab('completed');
        
        // تمييز الكارت المضغوط
        highlightCard('completedOrders');
        showNotification('عرض الأوردرات المكتملة', 'info');
    };

    function highlightCard(cardId) {
        // إزالة التمييز من جميع الكروت
        document.querySelectorAll('.financial-cards .card').forEach(card => {
            card.classList.remove('highlighted');
        });
        
        // إضافة التمييز للكارت المحدد
        const targetCard = document.getElementById(cardId);
        if (targetCard) {
            targetCard.classList.add('highlighted');
            setTimeout(() => {
                targetCard.classList.remove('highlighted');
            }, 2000);
        }
    }

    // === Modal Functions - مطابق للأجهزة ===
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    // === Order Management Functions ===
    window.cancelOrder = function(orderId) {
        const reason = prompt('يرجى إدخال سبب إلغاء الأوردر:');
        if (reason && reason.trim()) {
            const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
            if (orderCard) {
                // إيقاف تتبع الوقت
                const timeInterval = orderCard.dataset.timeInterval;
                if (timeInterval) {
                    clearInterval(parseInt(timeInterval));
                }
                
                // إزالة الأوردر من القائمة المعلقة
                orderCard.remove();
                updateOrderCounts();
                showNotification('تم إلغاء الأوردر بنجاح وتم نقله للأوردرات الملغية', 'success');
            }
        } else if (reason !== null) {
            alert('يرجى إدخال سبب الإلغاء');
        }
    };

    window.markOrderReady = function(orderId) {
        if (confirm('هل أنت متأكد من أن الأوردر جاهز للتقديم؟')) {
            const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
            if (orderCard) {
                // تحديث حالة الأوردر
                const statusElement = orderCard.querySelector('.device-status-badge');
                const isUrgent = statusElement.textContent.includes('عاجل');
                statusElement.textContent = 'جاهز للتقديم';
                statusElement.className = 'device-status-badge available';
                
                // تحديث الأيقونة
                const deviceIcon = orderCard.querySelector('.device-icon i');
                deviceIcon.className = 'fas fa-check-circle';
                
                // تحديث العنوان
                const deviceInfo = orderCard.querySelector('.device-info h3');
                deviceInfo.textContent = deviceInfo.textContent.replace('#', 'أوردر #');
                
                // إزالة التايمر وإضافة معلومات الإنتهاء
                const timerDiv = orderCard.querySelector('.device-timer');
                if (timerDiv) {
                    timerDiv.innerHTML = `
                        <div class="device-specs">
                            <div class="spec-item">
                                <span class="spec-label">وقت الإنتهاء:</span>
                                <span class="spec-value">${new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">مدة التحضير:</span>
                                <span class="spec-value">8 دقائق</span>
                            </div>
                        </div>
                    `;
                    timerDiv.className = 'device-specs';
                }
                
                // تحديث الأزرار
                const actionsDiv = orderCard.querySelector('.device-actions');
                actionsDiv.innerHTML = `
                    <button class="action-btn primary" onclick="deliverOrder('${orderId}')">
                        <i class="fas fa-truck"></i>
                        <span>تم التقديم</span>
                    </button>
                    <button class="action-btn secondary" onclick="openOrderDetails('${orderId}')">
                        <i class="fas fa-eye"></i>
                        <span>التفاصيل</span>
                    </button>
                    <button class="action-btn secondary" onclick="printOrderReceipt('${orderId}')">
                        <i class="fas fa-print"></i>
                        <span>طباعة</span>
                    </button>
                `;
                
                // تحديث data-status
                orderCard.dataset.status = 'ready';
                orderCard.classList.remove('busy');
                orderCard.classList.add('available');
                
                // نقل الأوردر إلى قسم الجاهز
                const readyGrid = document.getElementById('readyOrdersGrid');
                readyGrid.appendChild(orderCard);
                
                updateOrderCounts();
                showNotification('تم تحديث حالة الأوردر إلى "جاهز للتقديم"', 'success');
            }
        }
    };

    window.deliverOrder = function(orderId) {
        if (confirm('هل تم تقديم الأوردر للعميل؟')) {
            const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
            if (orderCard) {
                // إيقاف تتبع الوقت
                const timeInterval = orderCard.dataset.timeInterval;
                if (timeInterval) {
                    clearInterval(parseInt(timeInterval));
                }
                
                // إزالة الأوردر من القائمة المعلقة
                orderCard.remove();
                updateOrderCounts();
                showNotification('تم تقديم الأوردر بنجاح وتم نقله للأوردرات المكتملة', 'success');
            }
        }
    };

    window.openOrderDetails = function(orderId) {
        // بيانات وهمية للأوردرات
        const orderData = {
            'ORD001': {
                number: '#ORD001',
                status: 'قيد التحضير',
                table: 'تربيزة 001',
                time: '2024-06-25 14:30',
                elapsed: '5 دقائق',
                priority: 'عادي',
                items: [
                    { name: 'كوكاكولا', qty: 2, price: 10.00 },
                    { name: 'شيبسي', qty: 1, price: 5.50 },
                    { name: 'عصير برتقال', qty: 3, price: 10.00 }
                ],
                total: 45.50,
                notes: 'بدون ثلج في المشروبات'
            },
            'ORD002': {
                number: '#ORD002',
                status: 'عاجل - قيد التحضير',
                table: 'تربيزة 003',
                time: '2024-06-25 14:18',
                elapsed: '12 دقيقة',
                priority: 'عاجل',
                items: [
                    { name: 'قهوة', qty: 2, price: 12.00 },
                    { name: 'شاي', qty: 1, price: 8.00 },
                    { name: 'كرواسون', qty: 2, price: 23.00 }
                ],
                total: 78.00,
                notes: 'القهوة بدون سكر'
            },
            'ORD003': {
                number: '#ORD003',
                status: 'جاهز للتقديم',
                table: 'تربيزة 005',
                time: '2024-06-25 14:28',
                elapsed: '2 دقيقة',
                priority: 'عادي',
                items: [
                    { name: 'عصير مانجو', qty: 2, price: 20.00 },
                    { name: 'بسكويت', qty: 1, price: 12.00 }
                ],
                total: 32.00,
                notes: 'لا توجد ملاحظات'
            }
        };

        const order = orderData[orderId];
        if (!order) {
            // إنشاء بيانات افتراضية للأوردرات الجديدة
            const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
            if (orderCard) {
                const orderNumber = orderCard.querySelector('.device-info h3').textContent;
                const orderStatus = orderCard.querySelector('.device-status-badge').textContent;
                const tableInfo = orderCard.querySelector('.device-id').textContent;
                const orderTotal = orderCard.querySelector('.total-amount').textContent;
                
                const items = [];
                orderCard.querySelectorAll('.item-preview').forEach(item => {
                    const text = item.textContent;
                    const match = text.match(/(.+) x(\d+)/);
                    if (match) {
                        items.push({ name: match[1], qty: parseInt(match[2]), price: 10.00 });
                    }
                });

                updateOrderDetailsModal({
                    number: orderNumber,
                    status: orderStatus,
                    table: tableInfo,
                    time: new Date().toLocaleString('ar-EG'),
                    elapsed: '5 دقائق',
                    priority: orderStatus.includes('عاجل') ? 'عاجل' : 'عادي',
                    items: items,
                    total: parseFloat(orderTotal.replace(' ج', '')),
                    notes: 'لا توجد ملاحظات'
                });
            }
            return;
        }

        updateOrderDetailsModal(order);
    };

    function updateOrderDetailsModal(order) {
        // تحديث محتوى المودال
        document.getElementById('orderDetailsNumber').textContent = order.number;
        document.getElementById('orderDetailsStatus').textContent = order.status;
        document.getElementById('orderDetailsTable').textContent = order.table;
        document.getElementById('orderDetailsTime').textContent = order.time;
        document.getElementById('orderDetailsElapsed').textContent = order.elapsed;
        document.getElementById('orderDetailsPriority').textContent = order.priority;
        document.getElementById('orderDetailsTotal').textContent = order.total.toFixed(2) + ' ج';
        document.getElementById('orderDetailsNotes').textContent = order.notes;

        // تحديث جدول المنتجات
        const itemsBody = document.getElementById('orderDetailsItemsBody');
        itemsBody.innerHTML = '';
        
        order.items.forEach(item => {
            const row = itemsBody.insertRow();
            const itemTotal = item.price * item.qty;
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${item.price.toFixed(2)} ج</td>
                <td>${itemTotal.toFixed(2)} ج</td>
            `;
        });

        // تحديث لون حالة الأوردر
        const statusElement = document.getElementById('orderDetailsStatus');
        statusElement.className = 'detail-value status';
        
        if (order.status.includes('قيد التحضير')) {
            statusElement.style.backgroundColor = '#fff3cd';
            statusElement.style.color = '#856404';
        } else if (order.status.includes('جاهز')) {
            statusElement.style.backgroundColor = '#d4edda';
            statusElement.style.color = '#155724';
        }
        
        if (order.status.includes('عاجل')) {
            statusElement.style.backgroundColor = '#f8d7da';
            statusElement.style.color = '#721c24';
        }

        openModal('orderDetailsModal');
    }

    window.printOrderReceipt = function(orderId) {
        // الحصول على بيانات الأوردر من البطاقة
        const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
        if (orderCard) {
            const orderNumber = orderCard.querySelector('.device-info h3').textContent;
            const tableNumber = orderCard.querySelector('.device-id').textContent;
            const orderTotal = orderCard.querySelector('.total-amount').textContent;

            // تحديث مودال الطباعة
            document.getElementById('receiptOrderNumber').textContent = orderNumber;
            document.getElementById('receiptTableNumber').textContent = tableNumber;
            document.getElementById('receiptDate').textContent = new Date().toLocaleString('ar-EG');

            // تحديث جدول المنتجات في الإيصال
            const receiptItemsBody = document.getElementById('receiptItemsBody');
            receiptItemsBody.innerHTML = '';
            let subtotal = 0;

            orderCard.querySelectorAll('.item-preview').forEach(item => {
                const text = item.textContent;
                const match = text.match(/(.+) x(\d+)/);
                if (match) {
                    const name = match[1];
                    const qty = parseInt(match[2]);
                    const price = 10.00; // سعر افتراضي
                    const total = price * qty;
                    
                    const newRow = receiptItemsBody.insertRow();
                    newRow.innerHTML = `
                        <td>${name}</td>
                        <td>${qty}</td>
                        <td>${price.toFixed(2)} ج</td>
                        <td>${total.toFixed(2)} ج</td>
                    `;
                    
                    subtotal += total;
                }
            });

            // حساب الضريبة والإجمالي
            const tax = subtotal * 0.14;
            const grandTotal = subtotal + tax;

            document.getElementById('receiptSubtotal').textContent = subtotal.toFixed(2) + ' ج';
            document.getElementById('receiptTax').textContent = tax.toFixed(2) + ' ج';
            document.getElementById('receiptGrandTotal').textContent = grandTotal.toFixed(2) + ' ج';

            // فتح مودال الطباعة
            openModal('printReceiptModal');
        }
    };

    // === Add Order Modal Logic ===
    const addOrderModal = document.getElementById('addOrderModal');
    const addOrderBtn = document.getElementById('addOrderBtn');
    const proceedToProducts = document.getElementById('proceedToProducts');

    const productSelectionModal = document.getElementById('productSelectionModal');
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const printReceiptModal = document.getElementById('printReceiptModal');

    // Open Add Order Modal
    if (addOrderBtn) {
        addOrderBtn.addEventListener('click', () => {
            openModal('addOrderModal');
        });
    }

    // Product Selection Modal Logic
    const selectedTableDisplay = document.getElementById('selectedTableDisplay');
    const selectedPriorityDisplay = document.getElementById('selectedPriorityDisplay');
    const orderProductSearchInput = document.getElementById('orderProductSearchInput');
    const orderCategoryButtons = document.querySelectorAll('#orderCategories .category-btn');
    const orderProductList = document.getElementById('orderProductList');
    const orderSelectedProductsTableBody = document.getElementById('orderSelectedProductsTableBody');
    const orderTotalSelectedProductsAmount = document.getElementById('orderTotalSelectedProductsAmount');
    const saveOrderBtn = document.getElementById('saveOrderBtn');
    const cancelOrderProductsBtn = document.getElementById('cancelOrderProductsBtn');

    // أزرار عرض الشبكة والقائمة
    const orderGridViewBtn = document.getElementById('orderGridViewBtn');
    const orderListViewBtn = document.getElementById('orderListViewBtn');

    // Dummy Product Data
    const allOrderProducts = [
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
        { id: 'hot004', name: 'هوت شوكليت', category: 'مشروبات ساخنة', price: 22.00 },
        { id: 'food001', name: 'شيبسي', category: 'مأكولات', price: 5.50 },
        { id: 'food002', name: 'كرواسون', category: 'مأكولات', price: 23.00 },
        { id: 'food003', name: 'بسكويت', category: 'مأكولات', price: 12.00 },
        { id: 'food004', name: 'كيك', category: 'مأكولات', price: 25.00 }
    ];

    // متغير لتتبع نوع العرض الحالي
    let currentOrderViewType = 'grid';

    // Handle Proceed to Products
    if (proceedToProducts) {
        proceedToProducts.addEventListener('click', () => {
            const tableSelect = document.getElementById('orderTableSelect');
            const priority = document.getElementById('orderPriority');
            
            if (!tableSelect.value) {
                alert('يرجى اختيار التربيزة أولاً');
                return;
            }
            
            // تحديث معلومات الأوردر
            selectedTableDisplay.textContent = tableSelect.options[tableSelect.selectedIndex].text;
            selectedPriorityDisplay.textContent = priority.options[priority.selectedIndex].text;
            
            // إغلاق مودال إضافة الأوردر وفتح مودال اختيار المنتجات
            closeModal('addOrderModal');
            openModal('productSelectionModal');
            
            // مسح المنتجات المحددة سابقاً
            if (orderSelectedProductsTableBody) {
                orderSelectedProductsTableBody.innerHTML = '';
            }
            if (orderTotalSelectedProductsAmount) {
                orderTotalSelectedProductsAmount.textContent = '0.00';
            }
            
            // إظهار المنتجات الافتراضية
            if (orderProductSearchInput) {
                orderProductSearchInput.value = '';
            }
            
            // تفعيل أول فئة وعرض الشبكة
            currentOrderViewType = 'grid';
            if (orderGridViewBtn) orderGridViewBtn.classList.add('active');
            if (orderListViewBtn) orderListViewBtn.classList.remove('active');
            
            orderCategoryButtons.forEach((btn, index) => {
                btn.classList.remove('active');
                if (index === 0) {
                    btn.classList.add('active');
                    const category = btn.textContent;
                    const filteredProducts = category === 'الكل' ? allOrderProducts : allOrderProducts.filter(p => p.category === category);
                    renderOrderProducts(filteredProducts);
                }
            });
        });
    }

    function renderOrderProducts(productsToRender) {
        if (!orderProductList) return;
        
        orderProductList.innerHTML = '';
        if (productsToRender.length === 0) {
            orderProductList.innerHTML = '<p style="text-align: center; color: #777;">لا توجد منتجات مطابقة.</p>';
            return;
        }

        // تطبيق نوع العرض
        orderProductList.className = `product-list ${currentOrderViewType}-view`;

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.dataset.productId = product.id;
            
            if (currentOrderViewType === 'list') {
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
            
            orderProductList.appendChild(productCard);
        });

        // Add event listeners for new "Add" buttons
        orderProductList.querySelectorAll('.add-product-to-selection-btn').forEach(button => {
            button.addEventListener('click', addProductToOrderList);
        });
    }

    // أزرار تغيير نوع العرض
    if (orderGridViewBtn) {
        orderGridViewBtn.addEventListener('click', function() {
            currentOrderViewType = 'grid';
            orderGridViewBtn.classList.add('active');
            orderListViewBtn.classList.remove('active');
            
            // إعادة عرض المنتجات بالنوع الجديد
            const activeCategory = document.querySelector('#orderCategories .category-btn.active');
            if (activeCategory) {
                const category = activeCategory.textContent;
                const filteredProducts = category === 'الكل' ? allOrderProducts : allOrderProducts.filter(p => p.category === category);
                renderOrderProducts(filteredProducts);
            }
        });
    }

    if (orderListViewBtn) {
        orderListViewBtn.addEventListener('click', function() {
            currentOrderViewType = 'list';
            orderListViewBtn.classList.add('active');
            orderGridViewBtn.classList.remove('active');
            
            // إعادة عرض المنتجات بالنوع الجديد
            const activeCategory = document.querySelector('#orderCategories .category-btn.active');
            if (activeCategory) {
                const category =activeCategory.textContent;
                const filteredProducts = category === 'الكل' ? allOrderProducts : allOrderProducts.filter(p => p.category === category);
                renderOrderProducts(filteredProducts);
            }
        });
    }

    function addProductToOrderList(event) {
        const productId = event.currentTarget.dataset.productId;
        const productName = event.currentTarget.dataset.productName;
        const productPrice = parseFloat(event.currentTarget.dataset.productPrice);

        if (!orderSelectedProductsTableBody) return;

        // Check if product already exists
        const existingRow = orderSelectedProductsTableBody.querySelector(`tr[data-product-id="${productId}"]`);

        if (existingRow) {
            const qtyInput = existingRow.querySelector('.item-qty input');
            if (qtyInput) {
                qtyInput.value = parseInt(qtyInput.value) + 1;
                updateOrderProductRowTotal(qtyInput);
            }
        } else {
            const row = orderSelectedProductsTableBody.insertRow();
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
                    updateOrderProductRowTotal(this);
                });
            }

            const deleteBtn = row.querySelector('.delete-selected-product-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    this.closest('tr').remove();
                    updateOrderProductsTotal();
                });
            }
        }
        updateOrderProductsTotal();
    }

    function updateOrderProductRowTotal(qtyInput) {
        const row = qtyInput.closest('tr');
        const price = parseFloat(qtyInput.dataset.productPrice);
        const quantity = parseInt(qtyInput.value);
        const itemTotal = price * quantity;
        const totalCell = row.querySelector('.item-total');
        if (totalCell) {
            totalCell.textContent = `${itemTotal.toFixed(2)} ج`;
        }
        updateOrderProductsTotal();
    }

    function updateOrderProductsTotal() {
        if (!orderSelectedProductsTableBody || !orderTotalSelectedProductsAmount) return;
        
        let total = 0;
        orderSelectedProductsTableBody.querySelectorAll('tr').forEach(row => {
            const itemTotalText = row.querySelector('.item-total')?.textContent || '0';
            const itemTotal = parseFloat(itemTotalText.replace(' ج', ''));
            if (!isNaN(itemTotal)) {
                total += itemTotal;
            }
        });
        orderTotalSelectedProductsAmount.textContent = total.toFixed(2);
    }

    // Category filtering
    orderCategoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            orderCategoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            if (orderProductSearchInput) {
                orderProductSearchInput.value = '';
            }

            const category = this.textContent;
            const filteredProducts = category === 'الكل' ? allOrderProducts : allOrderProducts.filter(product => product.category === category);
            renderOrderProducts(filteredProducts);
        });
    });

    // Search functionality
    if (orderProductSearchInput) {
        orderProductSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            orderCategoryButtons.forEach(btn => btn.classList.remove('active'));
            
            const filteredProducts = allOrderProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
            renderOrderProducts(filteredProducts);
        });
    }

    // Save Order
    if (saveOrderBtn) {
        saveOrderBtn.addEventListener('click', function() {
            const selectedItems = [];
            if (orderSelectedProductsTableBody) {
                orderSelectedProductsTableBody.querySelectorAll('tr').forEach(row => {
                    const productId = row.dataset.productId;
                    const productName = row.querySelector('.item-name')?.textContent || '';
                    const productPrice = parseFloat(row.querySelector('.item-price')?.textContent || '0');
                    const productQty = parseInt(row.querySelector('.item-qty input')?.value || '0');
                    selectedItems.push({ id: productId, name: productName, price: productPrice, qty: productQty });
                });
            }

            if (selectedItems.length === 0) {
                alert('يرجى اختيار منتجات للأوردر أولاً!');
                return;
            }

            // إضافة تأثير التحميل للزر
            saveOrderBtn.classList.add('btn-loading');
            saveOrderBtn.textContent = 'جاري الحفظ...';

            setTimeout(() => {
                // إنشاء أوردر جديد
                const newOrderId = 'ORD' + String(Date.now()).slice(-3);
                const tableInfo = selectedTableDisplay.textContent;
                const priority = selectedPriorityDisplay.textContent;
                const total = parseFloat(orderTotalSelectedProductsAmount.textContent);

                alert(`تم حفظ الأوردر بنجاح!\nرقم الأوردر: ${newOrderId}\nالتربيزة: ${tableInfo}\nالإجمالي: ${total.toFixed(2)} ج`);
                
                // إضافة الأوردر الجديد للقائمة المعلقة
                addNewOrderToGrid(newOrderId, tableInfo, priority, selectedItems, total);
                
                // إزالة تأثير التحميل
                saveOrderBtn.classList.remove('btn-loading');
                saveOrderBtn.innerHTML = '<i class="fas fa-save"></i> حفظ الأوردر';
                
                // إغلاق مودال اختيار المنتجات
                closeModal('productSelectionModal');
            }, 1500);
        });
    }

    function addNewOrderToGrid(orderId, tableInfo, priority, items, total) {
        const preparingOrdersGrid = document.getElementById('preparingOrdersGrid');
        if (!preparingOrdersGrid) return;

        const isUrgent = priority === 'عاجل';
        const orderCard = document.createElement('div');
        orderCard.className = `device-card busy ${isUrgent ? 'urgent' : ''}`;
        orderCard.dataset.orderId = orderId;
        orderCard.dataset.status = 'preparing';

        const itemsHtml = items.slice(0, 3).map(item => 
            `<div class="item-preview">${item.name} x${item.qty}</div>`
        ).join('');

        orderCard.innerHTML = `
            <div class="device-status-badge busy ${isUrgent ? 'urgent' : ''}">${isUrgent ? 'عاجل - ' : ''}قيد التحضير</div>
            <button class="device-delete-btn" onclick="cancelOrder('${orderId}')" title="إلغاء الأوردر">
                <i class="fas fa-times"></i>
            </button>
            <div class="device-header">
                <div class="device-icon">
                    <i class="fas fa-utensils"></i>
                </div>
                <div class="device-info">
                    <h3>أوردر #${orderId}</h3>
                    <span class="device-id">${tableInfo}</span>
                </div>
            </div>
            <div class="device-timer ${isUrgent ? 'urgent' : ''}">
                <div class="timer-display">
                    <div class="time-unit">
                        <span class="time-value">00</span>
                        <span class="time-label">دقيقة</span>
                    </div>
                    <div class="time-separator">:</div>
                    <div class="time-unit">
                        <span class="time-value">30</span>
                        <span class="time-label">ثانية</span>
                    </div>
                </div>
                <div class="timer-info">
                    <span>بدأ في: ${new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
            </div>
            <div class="order-items-preview">
                ${itemsHtml}
                ${items.length > 3 ? `<div class="item-preview">و ${items.length - 3} منتجات أخرى</div>` : ''}
            </div>
            <div class="order-total-display">
                <span class="total-label">الإجمالي:</span>
                <span class="total-amount">${total.toFixed(2)} ج</span>
            </div>
            <div class="device-actions">
                <button class="action-btn primary ${isUrgent ? 'urgent' : ''}" onclick="markOrderReady('${orderId}')">
                    <i class="fas fa-check"></i>
                    <span>جاهز</span>
                </button>
                <button class="action-btn secondary" onclick="openOrderDetails('${orderId}')">
                    <i class="fas fa-eye"></i>
                    <span>التفاصيل</span>
                </button>
            </div>
        `;

        // إضافة الأوردر في المقدمة
        preparingOrdersGrid.insertBefore(orderCard, preparingOrdersGrid.firstChild);
        
        updateOrderCounts();
    }

    // === Print Receipt Logic ===
    const printOrderReceiptBtn = document.getElementById('printOrderReceiptBtn');
    if (printOrderReceiptBtn) {
        printOrderReceiptBtn.addEventListener('click', function() {
            // الحصول على بيانات الأوردر من المودال
            const orderNumber = document.getElementById('orderDetailsNumber').textContent;
            const tableNumber = document.getElementById('orderDetailsTable').textContent;
            const orderTime = document.getElementById('orderDetailsTime').textContent;
            const orderTotal = document.getElementById('orderDetailsTotal').textContent;

            // تحديث مودال الطباعة
            document.getElementById('receiptOrderNumber').textContent = orderNumber;
            document.getElementById('receiptTableNumber').textContent = tableNumber;
            document.getElementById('receiptDate').textContent = orderTime;

            // تحديث جدول المنتجات في الإيصال
            const receiptItemsBody = document.getElementById('receiptItemsBody');
            const orderItemsBody = document.getElementById('orderDetailsItemsBody');
            
            receiptItemsBody.innerHTML = '';
            let subtotal = 0;

            orderItemsBody.querySelectorAll('tr').forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 4) {
                    const newRow = receiptItemsBody.insertRow();
                    newRow.innerHTML = `
                        <td>${cells[0].textContent}</td>
                        <td>${cells[1].textContent}</td>
                        <td>${cells[2].textContent}</td>
                        <td>${cells[3].textContent}</td>
                    `;
                    
                    const itemTotal = parseFloat(cells[3].textContent.replace(' ج', ''));
                    subtotal += itemTotal;
                }
            });

            // حساب الضريبة والإجمالي
            const tax = subtotal * 0.14;
            const grandTotal = subtotal + tax;

            document.getElementById('receiptSubtotal').textContent = subtotal.toFixed(2) + ' ج';
            document.getElementById('receiptTax').textContent = tax.toFixed(2) + ' ج';
            document.getElementById('receiptGrandTotal').textContent = grandTotal.toFixed(2) + ' ج';

            // إغلاق مودال التفاصيل وفتح مودال الطباعة
            closeModal('orderDetailsModal');
            openModal('printReceiptModal');
        });
    }

    // إصلاح نظام الطباعة للإيصالات
    const printReceiptBtn = document.getElementById('printReceiptBtn');
    const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');

    if (printReceiptBtn) {
        printReceiptBtn.addEventListener('click', function() {
            // إضافة تأثير التحميل
            this.classList.add('btn-loading');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الطباعة...';
            
            setTimeout(() => {
                const receiptContent = document.getElementById('receiptContent');
                const printWindow = window.open('', '_blank', 'width=800,height=600');
                
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html lang="ar" dir="rtl">
                    <head>
                        <meta charset="UTF-8">
                        <title>إيصال الأوردر</title>
                        <style>
                            body { 
                                font-family: 'Cairo', Arial, sans-serif; 
                                direction: rtl; 
                                margin: 20px;
                                line-height: 1.6;
                            }
                            table { 
                                width: 100%; 
                                border-collapse: collapse; 
                                margin: 15px 0;
                            }
                            th, td { 
                                border: 1px solid #ddd; 
                                padding: 10px; 
                                text-align: center; 
                            }
                            th { 
                                background-color: #6a1b9a; 
                                color: white;
                                font-weight: bold;
                            }
                            hr { 
                                margin: 15px 0; 
                                border: 1px solid #ddd;
                            }
                            .total-row { 
                                font-weight: bold; 
                                font-size: 18px;
                                background-color: #f8f9fa;
                            }
                            .receipt-business-info {
                                text-align: center;
                                background: #6a1b9a;
                                color: white;
                                padding: 20px;
                                border-radius: 8px;
                                margin-bottom: 20px;
                            }
                            .receipt-business-info h2 {
                                margin: 0 0 10px 0;
                                font-size: 24px;
                            }
                            .receipt-row {
                                display: flex;
                                justify-content: space-between;
                                padding: 5px 0;
                                border-bottom: 1px dotted #ddd;
                            }
                            .receipt-footer {
                                text-align: center;
                                margin-top: 30px;
                                padding: 15px;
                                background-color: #f8f9fa;
                                border-radius: 8px;
                            }
                            @media print {
                                body { margin: 0; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                        ${receiptContent.innerHTML}
                    </body>
                    </html>
                `);
                
                printWindow.document.close();
                
                // انتظار تحميل المحتوى ثم الطباعة
                printWindow.onload = function() {
                    printWindow.focus();
                    printWindow.print();
                    printWindow.close();
                };
                
                // إزالة تأثير التحميل
                this.classList.remove('btn-loading');
                this.innerHTML = '<i class="fas fa-print"></i> طباعة';
            }, 1000);
        });
    }

    if (downloadReceiptBtn) {
        downloadReceiptBtn.addEventListener('click', function() {
            // إضافة تأثير التحميل
            this.classList.add('btn-loading');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
            
            setTimeout(() => {
                alert('سيتم تحميل الإيصال كملف PDF (وظيفة قيد التطوير)\nيمكنك استخدام خيار الطباعة حالياً');
                
                // إزالة تأثير التحميل
                this.classList.remove('btn-loading');
                this.innerHTML = '<i class="fas fa-download"></i> تحميل PDF';
            }, 1500);
        });
    }

    // === Utility Functions ===
    function updateOrderCounts() {
        const totalOrders = document.querySelectorAll('.device-card').length;
        const pendingOrders = document.querySelectorAll('.device-card[data-status="preparing"], .device-card[data-status="ready"]').length;
        const preparingOrders = document.querySelectorAll('.device-card[data-status="preparing"]').length;
        const readyOrders = document.querySelectorAll('.device-card[data-status="ready"]').length;
        
        // Update cards
        document.querySelector('#totalOrders .value').textContent = totalOrders;
        document.querySelector('#pendingOrders .value').textContent = pendingOrders;
        
        // Update section headers
        document.querySelector('#preparingOrdersSection .section-count').textContent = `${preparingOrders} أوردرات`;
        document.querySelector('#readyOrdersSection .section-count').textContent = `${readyOrders} أوردر`;
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // === Refresh Orders Button ===
    const refreshOrdersBtn = document.getElementById('refreshOrdersBtn');
    if (refreshOrdersBtn) {
        refreshOrdersBtn.addEventListener('click', function() {
            // إضافة تأثير دوران للأيقونة
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 1s linear';
            
            setTimeout(() => {
                icon.style.animation = '';
                showNotification('تم تحديث قائمة الأوردرات', 'success');
            }, 1000);
        });
    }

    // === Close Modal on Click Outside ===
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            const modalId = e.target.id;
            closeModal(modalId);
        }
        
        if (e.target.classList.contains('close-btn')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        }
    });

    // === إضافة أحداث النقر للكروت ===
    document.addEventListener('click', function(e) {
        const totalOrdersCard = e.target.closest('#totalOrders');
        const pendingOrdersCard = e.target.closest('#pendingOrders');
        const completedOrdersCard = e.target.closest('#completedOrders');
        
        if (totalOrdersCard) {
            showAllOrders();
        } else if (pendingOrdersCard) {
            showPendingOrders();
        } else if (completedOrdersCard) {
            showCompletedOrders();
        }
    });

    // === Initialize ===
    updateOrderCounts();
    
    // Add notification styles if not exist
    if (!document.querySelector('style[data-notifications]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notifications', 'true');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 10px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                z-index: 10000;
                min-width: 300px;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification.success {
                border-left: 4px solid #28a745;
                color: #28a745;
            }
            .notification.error {
                border-left: 4px solid #dc3545;
                color: #dc3545;
            }
            .notification.info {
                border-left: 4px solid #007bff;
                color: #007bff;
            }
            .highlighted {
                animation: highlight 2s ease-in-out;
            }
            @keyframes highlight {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); box-shadow: 0 8px 25px rgba(106, 27, 154, 0.3); }
                100% { transform: scale(1); }
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    console.log('✅ تم تحميل جميع وظائف صفحة الأوردرات بنجاح');
    console.log('✅ القائمة الجانبية جاهزة للعمل');
    console.log('✅ جميع المودالات والوظائف تعمل بشكل مثالي');
});