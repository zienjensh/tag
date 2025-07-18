// tables.js - نسخة محدثة مع إصلاح القائمة الجانبية

document.addEventListener('DOMContentLoaded', function() {
    // === Sidebar Toggle Logic - إصلاح القائمة الجانبية ===
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

    // === Tab Switching Logic ===
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
        if (tabName === 'tables') {
            document.getElementById('tables-content').classList.add('active');
            document.getElementById('tables-tab').classList.add('active');
        } else if (tabName === 'invoices') {
            document.getElementById('invoices-content').classList.add('active');
            document.getElementById('table-invoices-tab').classList.add('active');
        }
    };

    // === وظائف العرض والفلترة الجديدة ===
    window.showAllTables = function() {
        // إظهار جميع التربيزات
        const busySection = document.getElementById('busyTablesSection');
        const availableSection = document.getElementById('availableTablesSection');
        
        if (busySection) busySection.classList.remove('hidden');
        if (availableSection) availableSection.classList.remove('hidden');
        
        // تمييز الكارت المضغوط
        highlightCard('totalTables');
        showNotification('عرض جميع التربيزات', 'info');
    };

    window.showAvailableTables = function() {
        // إخفاء التربيزات المشغولة وإظهار المتاحة فقط
        const busySection = document.getElementById('busyTablesSection');
        const availableSection = document.getElementById('availableTablesSection');
        
        if (busySection) busySection.classList.add('hidden');
        if (availableSection) availableSection.classList.remove('hidden');
        
        // تمييز الكارت المضغوط
        highlightCard('availableTables');
        showNotification('عرض التربيزات المتاحة فقط', 'info');
    };

    window.showBusyTables = function() {
        // إخفاء التربيزات المتاحة وإظهار المشغولة فقط
        const busySection = document.getElementById('busyTablesSection');
        const availableSection = document.getElementById('availableTablesSection');
        
        if (busySection) busySection.classList.remove('hidden');
        if (availableSection) availableSection.classList.add('hidden');
        
        // تمييز الكارت المضغوط
        highlightCard('busyTables');
        showNotification('عرض التربيزات المشغولة فقط', 'info');
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

    // === Modal Functions ===
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

    // === Table Management Functions ===
    window.deleteTable = function(tableId) {
        if (confirm('هل أنت متأكد من حذف هذه التربيزة؟')) {
            const tableCard = document.querySelector(`[data-table-id="${tableId}"]`);
            if (tableCard) {
                tableCard.remove();
                updateTableCounts();
                showNotification('تم حذف التربيزة بنجاح', 'success');
            }
        }
    };

    window.openStartModal = function(tableId) {
        const tableCard = document.querySelector(`[data-table-id="${tableId}"]`);
        if (tableCard) {
            const tableName = tableCard.querySelector('.device-info h3').textContent;
            const capacity = tableCard.querySelector('.spec-value').textContent;
            
            document.getElementById('startTableName').textContent = tableName;
            document.getElementById('startTableId').textContent = `ID: ${tableId}`;
            document.getElementById('maxCapacity').textContent = capacity;
            
            openModal('startTableModal');
        }
    };

    window.confirmStartTable = function() {
        const tableId = document.getElementById('startTableId').textContent.replace('ID: ', '');
        const customerCount = document.getElementById('customerCount').value;
        const customerName = document.getElementById('customerName').value;
        
        if (!customerCount || customerCount < 1) {
            alert('يرجى إدخال عدد العملاء');
            return;
        }
        
        // Move table from available to busy
        const tableCard = document.querySelector(`[data-table-id="${tableId}"]`);
        if (tableCard) {
            // Update card appearance
            tableCard.classList.remove('available');
            tableCard.classList.add('busy');
            
            // Update status badge
            const statusBadge = tableCard.querySelector('.device-status-badge');
            statusBadge.textContent = 'مشغولة';
            statusBadge.classList.remove('available');
            statusBadge.classList.add('busy');
            
            // Replace specs with table info
            const specsDiv = tableCard.querySelector('.device-specs');
            if (specsDiv) {
                specsDiv.innerHTML = `
                    <div class="info-item">
                        <span class="info-label">العملاء:</span>
                        <span class="info-value">${customerCount} أشخاص</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">بدأت في:</span>
                        <span class="info-value">${new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                `;
                specsDiv.className = 'table-info';
            }
            
            // Update action buttons
            const actionsDiv = tableCard.querySelector('.device-actions');
            actionsDiv.innerHTML = `
                <button class="action-btn primary" onclick="openInvoiceModal('${tableId}')">
                    <i class="fas fa-receipt"></i>
                    <span>الفاتورة</span>
                </button>
                <button class="action-btn secondary" onclick="openBuffetModal('${tableId}')">
                    <i class="fas fa-coffee"></i>
                    <span>البوفيه</span>
                </button>
                <button class="action-btn secondary" onclick="openTableDetails('${tableId}')">
                    <i class="fas fa-info-circle"></i>
                    <span>التفاصيل</span>
                </button>
            `;
            
            // Move to busy section
            const busyGrid = document.getElementById('busyTablesGrid');
            busyGrid.appendChild(tableCard);
            
            updateTableCounts();
            closeModal('startTableModal');
            showNotification(`تم بدء خدمة التربيزة ${tableId} بنجاح`, 'success');
        }
    };

    window.openTableDetails = function(tableId) {
        const tableCard = document.querySelector(`[data-table-id="${tableId}"]`);
        if (tableCard) {
            const tableName = tableCard.querySelector('.device-info h3').textContent;
            const status = tableCard.classList.contains('busy') ? 'مشغولة' : 'متاحة';
            
            document.getElementById('modalTableType').textContent = tableName;
            document.getElementById('modalTableID').textContent = tableId;
            document.getElementById('modalTableStatus').textContent = status;
            
            openModal('tableDetailsModal');
        }
    };

    window.openBuffetModal = function(tableId) {
        document.getElementById('buffetTableId').textContent = tableId;
        openModal('buffetModal');
        
        // Reset order
        currentOrder = [];
        updateOrderDisplay();
    };

    window.openInvoiceModal = function(tableId) {
        document.getElementById('invoiceTableId').textContent = tableId;
        
        // Calculate total from current order
        const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('invoiceBuffetAmount').textContent = total.toFixed(2) + ' ج';
        document.getElementById('invoiceTotal').textContent = total.toFixed(2) + ' ج';
        document.getElementById('splitRemaining').textContent = total.toFixed(2);
        
        openModal('invoiceModal');
    };

    // === Buffet Management ===
    let currentOrder = [];

    window.filterProducts = function(category) {
        const products = document.querySelectorAll('.product-item');
        const buttons = document.querySelectorAll('.category-btn');
        
        // Update active button
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Filter products
        products.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
    };

    window.addToOrder = function(id, name, price) {
        const existingItem = currentOrder.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            currentOrder.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        updateOrderDisplay();
        showNotification(`تم إضافة ${name} إلى الطلب`, 'success');
    };

    function updateOrderDisplay() {
        const orderItems = document.getElementById('orderItems');
        const orderTotal = document.getElementById('orderTotal');
        
        if (currentOrder.length === 0) {
            orderItems.innerHTML = '<p class="no-items">لا توجد طلبات</p>';
            orderTotal.textContent = '0.00';
            return;
        }
        
        let html = '';
        let total = 0;
        
        currentOrder.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            html += `
                <div class="order-item">
                    <span class="item-name">${item.name}</span>
                    <div class="item-controls">
                        <button onclick="decreaseQuantity(${index})" class="qty-btn">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button onclick="increaseQuantity(${index})" class="qty-btn">+</button>
                        <span class="item-price">${itemTotal.toFixed(2)} ج</span>
                        <button onclick="removeFromOrder(${index})" class="remove-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        orderItems.innerHTML = html;
        orderTotal.textContent = total.toFixed(2);
    }

    window.increaseQuantity = function(index) {
        currentOrder[index].quantity += 1;
        updateOrderDisplay();
    };

    window.decreaseQuantity = function(index) {
        if (currentOrder[index].quantity > 1) {
            currentOrder[index].quantity -= 1;
        } else {
            currentOrder.splice(index, 1);
        }
        updateOrderDisplay();
    };

    window.removeFromOrder = function(index) {
        currentOrder.splice(index, 1);
        updateOrderDisplay();
    };

    window.saveBuffetOrder = function() {
        if (currentOrder.length === 0) {
            alert('لا توجد طلبات لحفظها');
            return;
        }
        
        closeModal('buffetModal');
        showNotification('تم حفظ طلب البوفيه بنجاح', 'success');
    };

    // === Payment Functions ===
    let appliedCoupon = null;

    // Payment method switching
    document.addEventListener('change', function(e) {
        if (e.target.name === 'paymentMethod') {
            const paymentDetails = document.querySelectorAll('.payment-details');
            paymentDetails.forEach(detail => detail.classList.remove('active'));
            
            const selectedMethod = e.target.value;
            const targetDetail = document.querySelector(`.${selectedMethod}-payment`);
            if (targetDetail) {
                targetDetail.classList.add('active');
            }
        }
    });

    window.calculateChange = function() {
        const total = parseFloat(document.getElementById('invoiceTotal').textContent.replace(' ج', '')) || 0;
        const paid = parseFloat(document.getElementById('cashAmount').value) || 0;
        const change = paid - total;
        
        document.getElementById('changeAmount').textContent = Math.max(0, change).toFixed(2);
    };

    // Coupon Functions
    window.applyCoupon = function() {
        const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
        const couponStatus = document.getElementById('couponStatus');
        
        // Available coupons
        const coupons = {
            'SAVE10': { name: 'خصم 10%', type: 'percentage', value: 10 },
            'DISCOUNT5': { name: 'خصم 5 جنيه', type: 'fixed', value: 5 },
            'WELCOME20': { name: 'خصم ترحيبي 20%', type: 'percentage', value: 20 },
            'FIXED10': { name: 'خصم 10 جنيه', type: 'fixed', value: 10 }
        };
        
        if (!couponCode) {
            couponStatus.innerHTML = '<span class="error">يرجى إدخال كود الخصم</span>';
            return;
        }
        
        if (coupons[couponCode]) {
            appliedCoupon = { code: couponCode, ...coupons[couponCode] };
            
            // Show applied coupon
            document.getElementById('appliedCouponName').textContent = appliedCoupon.name;
            document.getElementById('appliedCouponDiscount').textContent = 
                appliedCoupon.type === 'percentage' ? `-${appliedCoupon.value}%` : `-${appliedCoupon.value} ج`;
            document.getElementById('appliedCoupon').style.display = 'flex';
            document.getElementById('couponCode').value = '';
            couponStatus.innerHTML = '<span class="success">تم تطبيق الكوبون بنجاح!</span>';
            
            updateInvoiceTotals();
        } else {
            couponStatus.innerHTML = '<span class="error">كود خصم غير صحيح</span>';
        }
    };

    window.removeCoupon = function() {
        appliedCoupon = null;
        document.getElementById('appliedCoupon').style.display = 'none';
        document.getElementById('couponStatus').innerHTML = '';
        updateInvoiceTotals();
    };

    function updateInvoiceTotals() {
        const buffetAmount = parseFloat(document.getElementById('invoiceBuffetAmount').textContent.replace(' ج', '')) || 0;
        let total = buffetAmount;
        let discountAmount = 0;
        
        if (appliedCoupon) {
            if (appliedCoupon.type === 'percentage') {
                discountAmount = total * (appliedCoupon.value / 100);
            } else {
                discountAmount = appliedCoupon.value;
            }
            
            total -= discountAmount;
            
            // Show coupon discount in invoice
            document.getElementById('couponDiscountAmount').textContent = `-${discountAmount.toFixed(2)} ج`;
            document.getElementById('couponDiscountItem').style.display = 'flex';
        } else {
            document.getElementById('couponDiscountItem').style.display = 'none';
        }
        
        document.getElementById('invoiceTotal').textContent = total.toFixed(2) + ' ج';
        document.getElementById('splitRemaining').textContent = total.toFixed(2);
        
        // Update cash amount
        const cashAmountInput = document.getElementById('cashAmount');
        if (cashAmountInput) {
            cashAmountInput.value = total.toFixed(2);
            calculateChange();
        }
    }

    // Split Payment Functions
    window.addSplitPayment = function() {
        const splitList = document.getElementById('splitPaymentsList');
        const newItem = document.createElement('div');
        newItem.className = 'split-payment-item';
        newItem.innerHTML = `
            <select class="split-method">
                <option value="cash">نقداً</option>
                <option value="card">كارت</option>
                <option value="credit">رصيد عميل</option>
            </select>
            <div class="amount-input">
                <input type="number" class="split-amount" placeholder="0.00" step="0.01" onchange="calculateSplitTotal()">
                <span class="currency-symbol">ج</span>
            </div>
            <button type="button" class="remove-split-btn" onclick="removeSplitPayment(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        splitList.appendChild(newItem);
    };

    window.removeSplitPayment = function(button) {
        const splitItems = document.querySelectorAll('.split-payment-item');
        if (splitItems.length > 1) {
            button.closest('.split-payment-item').remove();
            calculateSplitTotal();
        }
    };

    window.calculateSplitTotal = function() {
        const splitAmounts = document.querySelectorAll('.split-amount');
        let total = 0;
        
        splitAmounts.forEach(input => {
            total += parseFloat(input.value) || 0;
        });
        
        const invoiceTotal = parseFloat(document.getElementById('invoiceTotal').textContent.replace(' ج', '')) || 0;
        const remaining = invoiceTotal - total;
        
        document.getElementById('splitTotal').textContent = total.toFixed(2);
        document.getElementById('splitRemaining').textContent = remaining.toFixed(2);
        
        // Update remaining color
        const remainingElement = document.querySelector('.split-remaining');
        if (remaining < 0) {
            remainingElement.classList.add('negative');
        } else {
            remainingElement.classList.remove('negative');
        }
    };

    window.processPayment = function() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const total = parseFloat(document.getElementById('invoiceTotal').textContent.replace(' ج', '')) || 0;
        
        if (paymentMethod === 'split') {
            const remaining = parseFloat(document.getElementById('splitRemaining').textContent) || 0;
            if (remaining > 0.01) {
                alert('يرجى تغطية كامل المبلغ المطلوب');
                return;
            }
        }
        
        // Process payment logic here
        alert('تم تأكيد الدفع بنجاح!');
        closeModal('invoiceModal');
        
        // End table service
        const tableId = document.getElementById('invoiceTableId').textContent;
        endTableService(tableId);
    };

    function endTableService(tableId) {
        const tableCard = document.querySelector(`[data-table-id="${tableId}"]`);
        if (tableCard) {
            // Move back to available section
            tableCard.classList.remove('busy');
            tableCard.classList.add('available');
            
            // Update status badge
            const statusBadge = tableCard.querySelector('.device-status-badge');
            statusBadge.textContent = 'متاحة';
            statusBadge.classList.remove('busy');
            statusBadge.classList.add('available');
            
            // Reset to original specs
            const tableInfo = tableCard.querySelector('.table-info');
            if (tableInfo) {
                const capacity = tableCard.querySelector('.device-info h3').textContent.includes('VIP') ? '6 أشخاص' : '4 أشخاص';
                const type = tableCard.querySelector('.device-info h3').textContent.includes('VIP') ? 'VIP' : 'عادية';
                
                tableInfo.innerHTML = `
                    <div class="spec-item">
                        <span class="spec-label">السعة:</span>
                        <span class="spec-value">${capacity}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">النوع:</span>
                        <span class="spec-value">${type}</span>
                    </div>
                `;
                tableInfo.className = 'device-specs';
            }
            
            // Reset action buttons
            const actionsDiv = tableCard.querySelector('.device-actions');
            actionsDiv.innerHTML = `
                <button class="action-btn primary" onclick="openStartModal('${tableId}')">
                    <i class="fas fa-play"></i>
                    <span>بدء الخدمة</span>
                </button>
                <button class="action-btn secondary" onclick="openBuffetModal('${tableId}')">
                    <i class="fas fa-coffee"></i>
                    <span>البوفيه</span>
                </button>
                <button class="action-btn secondary" onclick="openTableDetails('${tableId}')">
                    <i class="fas fa-info-circle"></i>
                    <span>التفاصيل</span>
                </button>
            `;
            
            // Move to available section
            const availableGrid = document.getElementById('availableTablesGrid');
            availableGrid.appendChild(tableCard);
            
            updateTableCounts();
        }
    }

    // === Utility Functions ===
    function updateTableCounts() {
        const totalTables = document.querySelectorAll('.device-card').length;
        const busyTables = document.querySelectorAll('.device-card.busy').length;
        const availableTables = document.querySelectorAll('.device-card.available').length;
        
        // Update cards
        document.querySelector('#totalTables .value').textContent = totalTables;
        document.querySelector('#busyTables .value').textContent = busyTables;
        document.querySelector('#availableTables .value').textContent = availableTables;
        
        // Update section headers
        document.querySelector('#busyTablesSection .section-count').textContent = `${busyTables} تربيزات`;
        document.querySelector('#availableTablesSection .section-count').textContent = `${availableTables} تربيزات`;
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

    // === Add Table Functionality ===
    const addTableBtn = document.getElementById('addTableBtn');
    if (addTableBtn) {
        addTableBtn.addEventListener('click', () => {
            openModal('addTableModal');
        });
    }

    window.saveTable = function() {
        const tableType = document.getElementById('tableType').value;
        const tableName = document.getElementById('tableName').value;
        const tableCapacity = document.getElementById('tableCapacity').value;
        
        if (!tableType || !tableName || !tableCapacity) {
            alert('يرجى ملء جميع الحقول');
            return;
        }
        
        // Generate new table ID
        const existingTables = document.querySelectorAll('.device-card');
        const newId = `T${String(existingTables.length + 1).padStart(3, '0')}`;
        
        // Create new table card
        const newTableCard = document.createElement('div');
        newTableCard.className = 'device-card available';
        newTableCard.setAttribute('data-table-id', newId);
        
        const typeDisplay = tableType === 'vip' ? 'VIP' : 
                           tableType === 'outdoor' ? 'خارجية' : 
                           tableType === 'private' ? 'خاصة' : 'عادية';
        
        newTableCard.innerHTML = `
            <div class="device-status-badge available">متاحة</div>
            <button class="device-delete-btn" onclick="deleteTable('${newId}')" title="حذف التربيزة">
                <i class="fas fa-trash"></i>
            </button>
            <div class="device-header">
                <div class="device-icon">
                    <i class="fas fa-table"></i>
                </div>
                <div class="device-info">
                    <h3>${tableName}</h3>
                    <span class="device-id">ID: ${newId}</span>
                </div>
            </div>
            <div class="device-specs">
                <div class="spec-item">
                    <span class="spec-label">السعة:</span>
                    <span class="spec-value">${tableCapacity} أشخاص</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">النوع:</span>
                    <span class="spec-value">${typeDisplay}</span>
                </div>
            </div>
            <div class="device-actions">
                <button class="action-btn primary" onclick="openStartModal('${newId}')">
                    <i class="fas fa-play"></i>
                    <span>بدء الخدمة</span>
                </button>
                <button class="action-btn secondary" onclick="openBuffetModal('${newId}')">
                    <i class="fas fa-coffee"></i>
                    <span>البوفيه</span>
                </button>
                <button class="action-btn secondary" onclick="openTableDetails('${newId}')">
                    <i class="fas fa-info-circle"></i>
                    <span>التفاصيل</span>
                </button>
            </div>
        `;
        
        // Add to available tables grid
        document.getElementById('availableTablesGrid').appendChild(newTableCard);
        
        // Reset form
        document.getElementById('tableType').value = '';
        document.getElementById('tableName').value = '';
        document.getElementById('tableCapacity').value = '';
        
        updateTableCounts();
        closeModal('addTableModal');
        showNotification(`تم إضافة التربيزة ${newId} بنجاح`, 'success');
    };

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
        const totalTablesCard = e.target.closest('#totalTables');
        const availableTablesCard = e.target.closest('#availableTables');
        const busyTablesCard = e.target.closest('#busyTables');
        
        if (totalTablesCard) {
            showAllTables();
        } else if (availableTablesCard) {
            showAvailableTables();
        } else if (busyTablesCard) {
            showBusyTables();
        }
    });

    // === Initialize ===
    updateTableCounts();
    
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
        `;
        document.head.appendChild(style);
    }

    // تأكد من أن القائمة الجانبية تعمل بشكل صحيح
    console.log('تم تحميل ملف tables.js بنجاح');
    console.log('القائمة الجانبية:', sidebar ? 'موجودة' : 'غير موجودة');
    console.log('زر القائمة الجانبية:', sidebarToggle ? 'موجود' : 'غير موجود');
    console.log('الطبقة الشفافة:', overlay ? 'موجودة' : 'غير موجودة');
});