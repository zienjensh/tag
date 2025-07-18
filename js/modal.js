// ملف: js/modal.js

// دالة لفتح المودال وتحديث ID الجهاز
function openInvoiceBofeihModal(deviceId) {
    const modal = document.getElementById('invoiceBofeihModal');
    const deviceIdSpan = modal.querySelector('.device-id-in-modal');

    // تحديث ID الجهاز في المودال
    if (deviceIdSpan) {
        deviceIdSpan.textContent = deviceId;
    }

    modal.classList.add('active'); // إضافة الكلاس 'active' لإظهار المودال
    document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
}

// دالة لإغلاق المودال
function closeInvoiceBofeihModal() {
    const modal = document.getElementById('invoiceBofeihModal');
    modal.classList.remove('active'); // إزالة الكلاس 'active' لإخفاء المودال
    document.body.style.overflow = ''; // استعادة التمرير في الخلفية
}

document.addEventListener('DOMContentLoaded', () => {
    // ربط زر "الفاتورة والبوفيه" في كل مكان (بطاقات أو جداول)
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-invoice-bofeih');
        if (btn) {
            // جلب رقم التربيزة من أقرب .device-card أو من أقرب tr في الجدول
            let deviceId = null;
            const card = btn.closest('.device-card');
            if (card) {
                const idSpan = card.querySelector('.device-id');
                if (idSpan) deviceId = idSpan.textContent.trim();
            } else {
                // إذا كان في جدول الفواتير
                const row = btn.closest('tr');
                if (row) {
                    // استخراج رقم التربيزة من نص العمود الثاني
                    const tableCell = row.querySelector('td:nth-child(2)');
                    if (tableCell) {
                        const match = tableCell.textContent.match(/ID:\s*(\d+)/);
                        if (match) deviceId = match[1];
                    }
                }
            }
            openInvoiceBofeihModal(deviceId);
        }
    });

    // ربط زر 'X' للإغلاق وزر 'إلغاء' السفلي للمودال
    const closeBtn = document.querySelector('#invoiceBofeihModal .close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeInvoiceBofeihModal);
    }

    // إغلاق المودال عند الضغط خارج محتواه
    const modalOverlay = document.getElementById('invoiceBofeihModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            // تأكد أن النقر كان على الخلفية المعتمة وليس داخل محتوى المودال
            if (event.target === modalOverlay) {
                closeInvoiceBofeihModal();
            }
        });
    }

    const cancelBtnBottom = document.querySelector('#invoiceBofeihModal .btn-cancel-bottom');
    if (cancelBtnBottom) {
        cancelBtnBottom.addEventListener('click', closeInvoiceBofeihModal);
    }

    // ربط أزرار التعديل وعرض الفاتورة داخل المودال (للتوضيح)
    const editMessageBtn = document.getElementById('editInvoiceMessageBtn');
    if (editMessageBtn) {
        editMessageBtn.addEventListener('click', () => {
            alert('سيتم فتح نافذة لتعديل رسالة الفاتورة');
        });
    }

    // إزالة أي منطق قديم يخص فتح مودال البوفيه من هنا (سيتم الاعتماد فقط على delegation)

    // تفويض الحدث لفتح مودال البوفيه بشكل مستقل
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.open-bofeih-modal, #editBofeihBtn');
        if (target) {
            e.preventDefault();
            var bofeihDetailsModalEl = document.getElementById('bofeihDetailsModal');
            if (bofeihDetailsModalEl) {
                bofeihDetailsModalEl.classList.add('active');
                // تحديث رقم التربيزة إذا كان متاحًا
                const deviceId = document.querySelector('#invoiceBofeihModal .device-id-in-modal');
                if (deviceId && document.getElementById('bofeihDeviceIdDisplay')) {
                    document.getElementById('bofeihDeviceIdDisplay').textContent = deviceId.textContent.trim();
                }
            }
        }
    });
    // إغلاق مودال البوفيه فقط عند الضغط على زر الإغلاق أو إلغاء
    var bofeihDetailsModalEl = document.getElementById('bofeihDetailsModal');
    if (bofeihDetailsModalEl) {
        bofeihDetailsModalEl.addEventListener('click', function(e) {
            if (
                e.target.classList.contains('close-btn') ||
                e.target.id === 'cancelBofeihDetailsModalBtn' ||
                e.target.classList.contains('cancel-btn-bottom')
            ) {
                bofeihDetailsModalEl.classList.remove('active');
            }
        });
    }
});