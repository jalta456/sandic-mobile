# المرحلة 5 - الخطة الفنية للتنفيذ

## 1. نموذج البيانات المحدث

### 1.1 إضافة إلى `AppData` في `mockData.js`

```javascript
const AppData = {
    // ... البيانات الموجودة ...

    // سجل المعاملات المالي الموحد (المصدر الوحيد للحقيقة)
    fundTransactions: [
        {
            id: 1,
            type: 'deposit', // أو 'withdrawal'
            category: 'payment', // 'payment', 'expense', 'deposit', 'withdrawal'
            amount: 350,
            description: 'دفع واجب أكتوبر - أحمد محمد',
            date: '2023-10-15T10:30:00.000Z',
            relatedId: 1, // معرف الدفع أو المصروف المرتبط
            relatedType: 'payment', // 'payment', 'expense'
            status: 'completed', // 'pending', 'completed', 'cancelled'
            metadata: {
                ownerId: 1,
                month: 'أكتوبر',
                year: '2023',
                notes: 'دفعة نقدية'
            }
        }
    ],

    // تتبع التذكيرات المرسلة
    sentReminders: [
        {
            id: 1,
            ownerId: 1,
            month: 'أكتوبر',
            year: '2023',
            sentAt: '2023-10-20T09:00:00.000Z',
            method: 'whatsapp',
            status: 'delivered'
        }
    ]
};
```

### 1.2 تحديث نماذج البيانات الموجودة

#### نموذج الدفع المحدث
```javascript
{
    id: 1,
    ownerId: 1,
    amount: 350,
    month: 'أكتوبر',
    year: '2023',
    date: '15 أكتوبر 2023',
    isoDate: '2023-10-15',
    notes: 'دفعة نقدية',
    status: 'completed', // 'pending', 'completed', 'cancelled'
    transactionId: 1, // مرجع لمعاملة الصندوق
    createdAt: '2023-10-15T10:30:00.000Z',
    updatedAt: '2023-10-15T10:30:00.000Z'
}
```

#### نموذج المصروف المحدث
```javascript
{
    id: 1,
    title: 'صيانة المصعد',
    category: 'صيانة',
    amount: 2000,
    date: '2023-10-10',
    status: 'completed', // 'pending', 'completed', 'cancelled'
    transactionId: 2, // مرجع لمعاملة الصندوق
    createdAt: '2023-10-10T08:00:00.000Z',
    updatedAt: '2023-10-10T08:00:00.000Z'
}
```

## 2. المحددات (Selectors) الجديدة والمحدثة

### 2.1 محددات الصندوق في `AppDataSelectors`

```javascript
const AppDataSelectors = {
    // ... المحددات الموجودة ...

    // محددات الصندوق
    getFundTransactions(filter = 'all') {
        const transactions = AppData.fundTransactions || [];

        switch(filter) {
            case 'month':
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                return transactions.filter(t => {
                    const date = new Date(t.date);
                    return date.getMonth() === currentMonth && 
                           date.getFullYear() === currentYear;
                });
            case 'year':
                const year = new Date().getFullYear();
                return transactions.filter(t => {
                    const date = new Date(t.date);
                    return date.getFullYear() === year;
                });
            case 'deposits':
                return transactions.filter(t => t.type === 'deposit');
            case 'withdrawals':
                return transactions.filter(t => t.type === 'withdrawal');
            case 'payments':
                return transactions.filter(t => t.category === 'payment');
            case 'expenses':
                return transactions.filter(t => t.category === 'expense');
            default:
                return transactions;
        }
    },

    getFundBalance() {
        const transactions = this.getFundTransactions('all');
        const deposits = transactions
            .filter(t => t.type === 'deposit')
            .reduce((sum, t) => sum + t.amount, 0);
        const withdrawals = transactions
            .filter(t => t.type === 'withdrawal')
            .reduce((sum, t) => sum + t.amount, 0);
        return deposits - withdrawals;
    },

    getTransactionById(id) {
        return AppData.fundTransactions?.find(t => t.id === id);
    },

    getTransactionsByRelatedId(relatedId, relatedType) {
        return AppData.fundTransactions?.filter(t => 
            t.relatedId === relatedId && t.relatedType === relatedType
        ) || [];
    },

    getPendingTransactions() {
        return AppData.fundTransactions?.filter(t => t.status === 'pending') || [];
    },

    // محددات التذكيرات
    getSentReminders(ownerId = null) {
        const reminders = AppData.sentReminders || [];
        return ownerId 
            ? reminders.filter(r => r.ownerId === ownerId)
            : reminders;
    },

    hasReminderBeenSent(ownerId, month, year) {
        return this.getSentReminders(ownerId).some(r => 
            r.month === month && r.year === year
        );
    }
};
```

## 3. بنية سجل الصندوق الموحد

### 3.1 مبادئ التصميم

1. **المصدر الوحيد للحقيقة**: جميع المعاملات المالية تُسجل في `fundTransactions`
2. **الارتباط ثنائي الاتجاه**: الدفعات والمصاريف مرتبطة بمعاملات الصندوق
3. **التتبع الكامل**: كل معاملة لها تاريخ إنشاء وتحديث وحالة
4. **الحماية من التكرار**: آليات للكشف عن ومنع المعاملات المكررة

### 3.2 أنواع المعاملات

```javascript
const TransactionTypes = {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal'
};

const TransactionCategories = {
    PAYMENT: 'payment',    // دفع واجب من مالك
    EXPENSE: 'expense',    // مصروف للمجمع
    DEPOSIT: 'deposit',    // إيداع مباشر للصندوق
    WITHDRAWAL: 'withdrawal' // سحب مباشر من الصندوق
};

const TransactionStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};
```

### 3.3 دورة حياة المعاملة

```
[إنشاء معاملة] → [التحقق من الصحة] → [التحقق من التكرار] 
→ [تسجيل في السجل] → [تحديث الرصيد] → [إرسال الإشعار]
```

## 4. التحقق من الصحة والحماية من التكرار

### 4.1 التحقق من صحة المعاملة

```javascript
const TransactionValidator = {
    validateTransaction(transaction) {
        const errors = [];

        // التحقق من المبلغ
        if (!transaction.amount || transaction.amount <= 0) {
            errors.push('المبلغ يجب أن يكون أكبر من صفر');
        }

        // التحقق من النوع
        if (!['deposit', 'withdrawal'].includes(transaction.type)) {
            errors.push('نوع المعاملة غير صالح');
        }

        // التحقق من الفئة
        if (!['payment', 'expense', 'deposit', 'withdrawal'].includes(transaction.category)) {
            errors.push('فئة المعاملة غير صالحة');
        }

        // التحقق من التاريخ
        if (!transaction.date || isNaN(new Date(transaction.date))) {
            errors.push('تاريخ المعاملة غير صالح');
        }

        // التحقق من الرصيد للسحوبات
        if (transaction.type === 'withdrawal') {
            const currentBalance = AppDataSelectors.getFundBalance();
            if (transaction.amount > currentBalance) {
                errors.push(`الرصيد غير كافٍ. الرصيد الحالي: ${currentBalance} درهم`);
            }
        }

        // التحقق من الارتباط
        if (transaction.category === 'payment' && !transaction.relatedId) {
            errors.push('معاملة الدفع يجب أن تكون مرتبطة بدفع');
        }

        if (transaction.category === 'expense' && !transaction.relatedId) {
            errors.push('معاملة المصروف يجب أن تكون مرتبطة بمصروف');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validatePayment(payment) {
        const errors = [];

        // التحقق من المالك
        if (!payment.ownerId) {
            errors.push('معرف المالك مطلوب');
        }

        // التحقق من المبلغ
        if (!payment.amount || payment.amount <= 0) {
            errors.push('المبلغ يجب أن يكون أكبر من صفر');
        }

        // التحقق من الشهر والسنة
        if (!payment.month || !payment.year) {
            errors.push('الشهر والسنة مطلوبان');
        }

        // التحقق من عدم وجود دفع مكرر
        const existingPayment = AppData.payments.find(p => 
            p.ownerId === payment.ownerId &&
            p.month === payment.month &&
            p.year === payment.year &&
            p.status === 'completed'
        );

        if (existingPayment) {
            errors.push('يوجد دفع مسجل لهذا الشهر والسنة');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validateExpense(expense) {
        const errors = [];

        // التحقق من العنوان
        if (!expense.title || expense.title.trim() === '') {
            errors.push('عنوان المصروف مطلوب');
        }

        // التحقق من الفئة
        if (!expense.category || expense.category.trim() === '') {
            errors.push('فئة المصروف مطلوبة');
        }

        // التحقق من المبلغ
        if (!expense.amount || expense.amount <= 0) {
            errors.push('المبلغ يجب أن يكون أكبر من صفر');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};
```

### 4.2 الحماية من التكرار

```javascript
const DuplicateChecker = {
    checkDuplicateTransaction(transaction) {
        const transactions = AppData.fundTransactions || [];

        // البحث عن معاملة مكررة بناءً على:
        // - النوع والفئة
        // - المبلغ
        // - التاريخ (نفس اليوم)
        // - المعرف المرتبط (إذا وجد)
        const duplicate = transactions.find(t => 
            t.type === transaction.type &&
            t.category === transaction.category &&
            t.amount === transaction.amount &&
            new Date(t.date).toDateString() === new Date(transaction.date).toDateString() &&
            (transaction.relatedId ? t.relatedId === transaction.relatedId : true) &&
            t.status !== 'cancelled'
        );

        return !!duplicate;
    },

    checkDuplicatePayment(payment) {
        const payments = AppData.payments || [];

        // البحث عن دفع مكرر لنفس المالك لنفس الشهر والسنة
        const duplicate = payments.find(p => 
            p.ownerId === payment.ownerId &&
            p.month === payment.month &&
            p.year === payment.year &&
            p.status === 'completed'
        );

        return !!duplicate;
    },

    generateTransactionHash(transaction) {
        // توليد تجزئة فريدة للمعاملة للكشف عن التكرار
        const data = `${transaction.type}|${transaction.category}|${transaction.amount}|${transaction.date}|${transaction.relatedId || ''}`;
        return btoa(data).substring(0, 16);
    }
};
```

## 5. نطاق التنفيذ ملفاً بملف

### 5.1 الملفات المحدثة

#### 1. `src/data/mockData.js`
- إضافة `fundTransactions` array
- إضافة `sentReminders` array
- تحديث نموذج `payments` لإضافة `transactionId` و `status`
- تحديث نموذج `expenses` لإضافة `transactionId` و `status`

#### 2. `src/utils/helpers.js`
- إضافة `TransactionValidator` object
- إضافة `DuplicateChecker` object
- إضافة ثوابت `TransactionTypes`, `TransactionCategories`, `TransactionStatus`

#### 3. `src/utils/whatsappUtils.js` (جديد)
- دالة `generateMonthlyReport()`
- دالة `generatePaymentReminder()`
- دالة `generateReceipt()`
- دالة `generateFundTransaction()`
- دالة `openWhatsApp()`
- دالة `validatePhone()`

#### 4. `src/utils/receiptUtils.js` (جديد)
- دالة `generateReceiptHTML()`
- دالة `printReceipt()`
- دالة `downloadReceiptPDF()`
- دالة `shareReceiptWhatsApp()`

#### 5. `src/utils/fundUtils.js` (جديد)
- دالة `processPayment()`
- دالة `processExpense()`
- دالة `getFundSummary()`
- دالة `getTransactionsByDateRange()`
- دالة `getTransactionsByType()`
- دالة `getPaymentTransactions()`
- دالة `getExpenseTransactions()`

#### 6. `src/utils/reminderUtils.js` (جديد)
- دالة `getOverdueOwners()`
- دالة `getOverdueMonths()`
- دالة `generateReminder()`
- دالة `sendReminder()`
- دالة `sendAllReminders()`
- دالة `generateBulkReminderSummary()`
- دالة `markReminderSent()`
- دالة `hasReminderBeenSent()`

#### 7. `src/screens/renderers.js`
- تحديث `reports()` لاستخدام `fundTransactions`
- إضافة `fund()` لعرض سجل الصندوق
- إضافة `reminders()` لعرض وإدارة التذكيرات
- تحديث `payments()` لعرض الوصولات

#### 8. `src/components/uiComponents.js`
- إضافة `fundTransactionCard()`
- إضافة `reminderCard()`
- تحديث `paymentCard()` لإضافة زر الوصل
- تحديث `reportCard()` لعرض بيانات الصندوق

#### 9. `script.js`
- تحديث `handlePaymentSubmit()` لاستخدام `FundUtils.processPayment()`
- تحديث `handleExpenseSubmit()` لاستخدام `FundUtils.processExpense()`
- إضافة `handleFundTransactionSubmit()`
- إضافة `sendReminders()`
- تحديث `openWhatsApp()` لاستخدام `WhatsAppUtils`

#### 10. `index.html`
- إضافة قسم الصندوق في القائمة السفلية
- إضافة أزرار التذكيرات
- تحديث أزرار الإشعارات

## 6. ترتيب التنفيذ

### المرحلة 1: التحضير
1. تحديث `mockData.js` بنموذج البيانات الجديد
2. إضافة `TransactionValidator` و `DuplicateChecker` إلى `helpers.js`

### المرحلة 2: أدوات الصندوق
1. إنشاء `fundUtils.js`
2. تحديث `AppDataSelectors` بمحددات الصندوق
3. اختبار عمليات الصندوق

### المرحلة 3: أدوات WhatsApp
1. إنشاء `whatsappUtils.js`
2. اختبار رسائل WhatsApp المختلفة

### المرحلة 4: أدوات الوصولات
1. إنشاء `receiptUtils.js`
2. اختبار توليد وطباعة الوصولات

### المرحلة 5: أدوات التذكيرات
1. إنشاء `reminderUtils.js`
2. اختبار إرسال التذكيرات

### المرحلة 6: تحديث الواجهة
1. تحديث `renderers.js`
2. تحديث `uiComponents.js`
3. تحديث `script.js`
4. تحديث `index.html`

### المرحلة 7: الاختبار النهائي
1. اختبار جميع الميزات
2. التحقق من عدم وجود تكرار
3. التحقق من صحة البيانات
4. اختبار التكامل الكامل

## 7. معايير النجاح

1. ✅ جميع المعاملات المالية تُسجل في `fundTransactions`
2. ✅ لا توجد معاملات مكررة
3. ✅ الرصيد يُحسب بشكل صحيح دائماً
4. ✅ الوصولات تُنشأ بشكل صحيح
5. ✅ التذكيرات تُرسل بشكل صحيح
6. ✅ التقارير المالية دقيقة
7. ✅ التكامل مع WhatsApp يعمل بشكل صحيح
8. ✅ جميع التحقق من الصحة يعمل بشكل صحيح
9. ✅ الواجهة سلسة وسهلة الاستخدام
10. ✅ الأداء مقبول
