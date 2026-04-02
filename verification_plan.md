# Sandic Mobile - Verification Plan

## Overview
This document outlines the comprehensive verification plan for the Sandic Mobile application, covering both automated and manual testing procedures to ensure all features function correctly.

## Automated Tests (Browser Subagent)

### 1. Validation Test: Empty Payment Form
**Test Case**: Try submitting an empty payment form
**Expected Result**: Alert or error hint should appear
**Implementation Details**:
- Navigate to Payments view
- Click the FAB (Floating Action Button) to open payment form
- Leave all fields empty
- Click submit
- Verify that validation error messages appear for all required fields
- Verify that the form does not submit

**Code Reference**: `script.js` lines 86-129 (validateForm function)
```javascript
// Required check
if (!input.value.trim() && input.tagName !== 'SELECT') {
    isValid = false;
    input.classList.add('error');
}
```

### 2. Filter Test: "This Year" Filter
**Test Case**: Click 'This Year' filter and verify UI reflects changes
**Expected Result**: UI should update to show only this year's data
**Implementation Details**:
- Navigate to Reports view
- Click on "This Year" filter option
- Verify that the displayed data is filtered to show only current year's transactions
- Verify visual feedback (active state) on the selected filter

**Code Reference**: `script.js` lines 136-138 (handleFilterChange function)
```javascript
handleFilterChange(period) {
    Screens.reports(period);
}
```

### 3. Fund Test: Visual Differentiation
**Test Case**: Check that deposit (+) and withdrawal (-) are visually different
**Expected Result**: Deposits and withdrawals should have distinct visual indicators
**Implementation Details**:
- Navigate to Fund view
- Add a deposit transaction
- Add a withdrawal transaction
- Verify that deposits show with positive (+) indicator and green color
- Verify that withdrawals show with negative (-) indicator and red color
- Check that balance updates correctly after each transaction

**Code Reference**: `script.js` lines 221-233 (handleFundSubmit function)

### 4. Navigation Test: View Cycling
**Test Case**: Quick cycle through all 7+ views to ensure no breakage
**Expected Result**: All views should load correctly without errors
**Implementation Details**:
- Test all main views:
  1. Dashboard (لوحة التحكم)
  2. Owners (الملاك)
  3. Expenses (المصاريف)
  4. Payments (الأداءات)
  5. More (المزيد)
  6. Fund (الصندوق)
  7. Projects (المشاريع)
  8. Announcements (الإعلانات)
  9. Receipts (الوصولات)
  10. Reports (التقارير)

- For each view:
  - Verify the view loads without JavaScript errors
  - Verify the title is correct
  - Verify content displays properly
  - Verify navigation back button works (for sub-views)
  - Verify bottom navigation updates correctly

**Code Reference**: `script.js` lines 277-300 (updateView function)

## Manual Verification

### 1. WhatsApp Message Content
**Test Case**: Verify WhatsApp message content remains correct after updates
**Expected Result**: Messages should be properly formatted and contain correct information
**Verification Steps**:
- Test Monthly Report message:
  - Navigate to an owner's profile
  - Click on "Send Monthly Report" via WhatsApp
  - Verify message format: "السلام عليكم، تقرير ممتلكاتكم لشهر أكتوبر: الرصيد الحالي للمجمع هو [amount] درهم. لمزيد من التفاصيل يرجى مراجعة التطبيق."
  - Verify balance amount is correct

- Test Payment Reminder message:
  - Navigate to an owner's profile
  - Click on "Send Payment Reminder" via WhatsApp
  - Verify message format: "السلام عليكم، نذكركم بأداء واجب السانديك لشهر أكتوبر. شكراً لكم."

- Test phone number validation:
  - Try sending WhatsApp with invalid phone number
  - Verify error message: "رقم الهاتف غير صحيح (يجب أن يبدأ بـ 06 أو 07 ويتكون من 10 أرقام)"
  - Test with valid phone number (06xxxxxxxx or 07xxxxxxxx)

**Code Reference**: `script.js` lines 243-271 (openWhatsApp function)

### 2. Recent Activity on Dashboard
**Test Case**: Check "Recent Activity" on Dashboard immediately after a new entry
**Expected Result**: Dashboard should display the most recent transaction immediately
**Verification Steps**:
- Navigate to Dashboard
- Note current "Recent Activity" (آخر العمليات) list
- Add a new payment:
  - Navigate to Payments view
  - Click FAB to open payment form
  - Fill in all required fields
  - Submit the form
- Return to Dashboard
- Verify the new payment appears in "Recent Activity"
- Verify the transaction details are correct (amount, date, owner)
- Repeat for:
  - New expense
  - New fund transaction
  - New announcement

**Code Reference**: `script.js` lines 235-240 (finalizeAction function)
```javascript
finalizeAction() {
    this.closeModal();
    const currentView = Router.currentView || 'dashboard';
    this.updateView(currentView);
    if (currentView !== 'dashboard') Screens.dashboard();
}
```

## Additional Verification Points

### Form Validation
- **Owner Form**: Verify all fields are required and validated
- **Payment Form**: Verify amount must be greater than 0
- **Expense Form**: Verify amount must be greater than 0
- **Project Form**: Verify budget must be greater than 0
- **Fund Form**: 
  - Verify amount must be greater than 0
  - Verify withdrawal amount cannot exceed current balance

### Search Functionality
- Navigate to Owners view
- Use search input to filter owners
- Verify search works correctly with Arabic text
- Verify search is case-insensitive

### Responsive Design
- Test application on different screen sizes:
  - Mobile (375px width)
  - Tablet (768px width)
  - Desktop (1024px width)
- Verify all elements are properly displayed
- Verify touch targets are appropriate size

### Accessibility
- Verify all buttons have aria-labels
- Verify keyboard navigation works
- Verify color contrast meets WCAG standards
- Verify RTL (Right-to-Left) layout is correct for Arabic text

### Data Persistence
- Verify data is stored correctly in memory
- Verify all CRUD operations work:
  - Create: Add new records
  - Read: View records
  - Update: (if applicable) Modify records
  - Delete: (if applicable) Remove records

## Test Execution Checklist

### Pre-Test Setup
- [ ] Open application in modern browser (Chrome/Firefox/Safari)
- [ ] Open browser console to monitor for errors
- [ ] Verify initial load is successful

### Automated Tests Execution
- [ ] Validation Test: Empty Payment Form
- [ ] Filter Test: "This Year" Filter
- [ ] Fund Test: Visual Differentiation
- [ ] Navigation Test: View Cycling

### Manual Verification Execution
- [ ] WhatsApp Message Content Verification
- [ ] Recent Activity Dashboard Verification
- [ ] Form Validation Tests
- [ ] Search Functionality Test
- [ ] Responsive Design Test
- [ ] Accessibility Test
- [ ] Data Persistence Test

### Post-Test Cleanup
- [ ] Document any issues found
- [ ] Take screenshots of any visual bugs
- [ ] Record console errors if any
- [ ] Verify all test cases are documented

## Known Limitations
- Data is stored in memory (mock data) and will be lost on page refresh
- WhatsApp integration requires valid phone numbers in Moroccan format
- Application is currently in RTL (Right-to-Left) mode for Arabic language

## Sign-off
- Tester Name: _______________
- Date: _______________
- Test Environment: _______________
- Browser Version: _______________
- Overall Status: [ ] Pass [ ] Fail [ ] Partial
