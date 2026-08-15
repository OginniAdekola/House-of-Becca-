# House of Becca Ventures Retail POS

Mobile-first PWA branded with the supplied House of Becca Ventures logo.

Features: dashboard, new sale, cart, Naira pricing, discounts, Cash/Transfer/POS, automatic receipts, print/PDF/share, products, stock, sales history, reports, backup, offline local storage.

Deploy all files to the root of a GitHub Pages/Netlify/Vercel HTTPS site. Open the URL in Android Chrome and choose Install app/Add to Home screen.

Production upgrade recommended: cloud database, authentication, multi-device sync, staff roles, automated backups, receipt numbering controls, tax settings, and secure server-side data.

- Each purchased item can capture a model number and serial number; both appear on the digital/printable receipt.

- Customer name, phone number and address are captured at checkout and printed on receipts.

- Company receipt contact: BASHORUN, IBADAN, OYO STATE · TEL: 08142152688

- v6: fixed the Add Item modal ID mismatch and added defensive checks.

- v7: improved receipt spacing; company address/phone, customer details, model number and serial number are displayed on separate lines.

- v8: print output redesigned to match the supplied reference receipt format, including 120mm print sizing, cream background, centered logo/company header, separated customer fields, item model/serial lines, dashed dividers and aligned totals.

- v9: PRINT and SAVE PDF are active through Android/Chrome print dialog. SHARE uses Android Web Share with clipboard fallback.
- v9: print output is restricted to the receipt and sized for 120mm thermal paper.

- v10: receipt print/PDF width changed to 120mm.

- v11: ADD PRODUCT modal is fully wired; products can be searched, added, and deleted from inventory.
