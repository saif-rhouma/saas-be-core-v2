/* eslint-disable prettier/prettier */
import * as dayjs from 'dayjs';
import { calculateAfterTax, calculateTax, fCurrency } from '../helpers/format-number';
import { SERVER_FILE_HOST } from '../constants/global';

export const HtmlQuotation = (quotation, serverHostFile = null) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
      rel="stylesheet"
    />
    <title>Quotation</title>
    <style>
      *,
      ::before,
      ::after {
        box-sizing: border-box;
        /* 1 */
        border-width: 0;
        /* 2 */
        border-style: solid;
        /* 2 */
        border-color: #e5e7eb;
        /* 2 */
      }

      ::before,
      ::after {
        --tw-content: '';
      }

      html {
        line-height: 1.5;
        /* 1 */
        -webkit-text-size-adjust: 100%;
        /* 2 */
        -moz-tab-size: 4;
        /* 3 */
        tab-size: 4;
        /* 3 */
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
          'Noto Color Emoji';
        /* 4 */
        font-feature-settings: normal;
        /* 5 */
        font-variation-settings: normal;
        /* 6 */
      }

      body {
        margin: 0;
        /* 1 */
        line-height: inherit;
        /* 2 */
      }

      /*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

      hr {
        height: 0;
        /* 1 */
        color: inherit;
        /* 2 */
        border-top-width: 1px;
        /* 3 */
      }

      /*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

      abbr:where([title]) {
        -webkit-text-decoration: underline dotted;
        text-decoration: underline dotted;
      }

      /*
Remove the default font size and weight for headings.
*/

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-size: inherit;
        font-weight: inherit;
      }

      /*
Reset links to optimize for opt-in styling instead of opt-out.
*/

      a {
        color: inherit;
        text-decoration: inherit;
      }

      /*
Add the correct font weight in Edge and Safari.
*/

      b,
      strong {
        font-weight: bolder;
      }

      code,
      kbd,
      samp,
      pre {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        /* 1 */
        font-size: 1em;
        /* 2 */
      }

      /*
Add the correct font size in all browsers.
*/

      small {
        font-size: 80%;
      }

      sub,
      sup {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline;
      }

      sub {
        bottom: -0.25em;
      }

      sup {
        top: -0.5em;
      }

      /*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

      table {
        text-indent: 0;
        /* 1 */
        border-color: inherit;
        /* 2 */
        border-collapse: collapse;
        /* 3 */
      }

      /*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

      button,
      input,
      optgroup,
      select,
      textarea {
        font-family: inherit;
        /* 1 */
        font-feature-settings: inherit;
        /* 1 */
        font-variation-settings: inherit;
        /* 1 */
        font-size: 100%;
        /* 1 */
        font-weight: inherit;
        /* 1 */
        line-height: inherit;
        /* 1 */
        color: inherit;
        /* 1 */
        margin: 0;
        /* 2 */
        padding: 0;
        /* 3 */
      }

      /*
Remove the inheritance of text transform in Edge and Firefox.
*/

      button,
      select {
        text-transform: none;
      }

      /*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

      button,
      [type='button'],
      [type='reset'],
      [type='submit'] {
        -webkit-appearance: button;
        /* 1 */
        background-color: transparent;
        /* 2 */
        background-image: none;
        /* 2 */
      }

      /*
Use the modern Firefox focus style for all focusable elements.
*/

      :-moz-focusring {
        outline: auto;
      }

      :-moz-ui-invalid {
        box-shadow: none;
      }

      /*
Add the correct vertical alignment in Chrome and Firefox.
*/

      progress {
        vertical-align: baseline;
      }

      /*
Correct the cursor style of increment and decrement buttons in Safari.
*/

      ::-webkit-inner-spin-button,
      ::-webkit-outer-spin-button {
        height: auto;
      }

      /*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

      [type='search'] {
        -webkit-appearance: textfield;
        /* 1 */
        outline-offset: -2px;
        /* 2 */
      }

      /*
Remove the inner padding in Chrome and Safari on macOS.
*/

      ::-webkit-search-decoration {
        -webkit-appearance: none;
      }

      ::-webkit-file-upload-button {
        -webkit-appearance: button;
        /* 1 */
        font: inherit;
        /* 2 */
      }

      /*
Add the correct display in Chrome and Safari.
*/

      summary {
        display: list-item;
      }

      /*
Removes the default spacing and border for appropriate elements.
*/

      blockquote,
      dl,
      dd,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      hr,
      figure,
      p,
      pre {
        margin: 0;
      }

      fieldset {
        margin: 0;
        padding: 0;
      }

      legend {
        padding: 0;
      }

      ol,
      ul,
      menu {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      /*
Reset default styling for dialogs.
*/

      dialog {
        padding: 0;
      }

      /*
Prevent resizing textareas horizontally by default.
*/

      textarea {
        resize: vertical;
      }

      /*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

      input::placeholder,
      textarea::placeholder {
        opacity: 1;
        /* 1 */
        color: #9ca3af;
        /* 2 */
      }

      /*
Set the default cursor for buttons.
*/

      button,
      [role='button'] {
        cursor: pointer;
      }

      /*
Make sure disabled buttons don't get the pointer cursor.
*/

      :disabled {
        cursor: default;
      }

      img,
      svg,
      video,
      canvas,
      audio,
      iframe,
      embed,
      object {
        display: block;
        /* 1 */
        vertical-align: middle;
        /* 2 */
      }

      img,
      video {
        max-width: 100%;
        height: auto;
      }

      /* Make elements with the HTML hidden attribute stay hidden by default */

      [hidden] {
        display: none;
      }

      *,
      ::before,
      ::after {
        --tw-border-spacing-x: 0;
        --tw-border-spacing-y: 0;
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
        --tw-pan-x: ;
        --tw-pan-y: ;
        --tw-pinch-zoom: ;
        --tw-scroll-snap-strictness: proximity;
        --tw-gradient-from-position: ;
        --tw-gradient-via-position: ;
        --tw-gradient-to-position: ;
        --tw-ordinal: ;
        --tw-slashed-zero: ;
        --tw-numeric-figure: ;
        --tw-numeric-spacing: ;
        --tw-numeric-fraction: ;
        --tw-ring-inset: ;
        --tw-ring-offset-width: 0px;
        --tw-ring-offset-color: #fff;
        --tw-ring-color: rgb(59 130 246 / 0.5);
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-colored: 0 0 #0000;
        --tw-blur: ;
        --tw-brightness: ;
        --tw-contrast: ;
        --tw-grayscale: ;
        --tw-hue-rotate: ;
        --tw-invert: ;
        --tw-saturate: ;
        --tw-sepia: ;
        --tw-drop-shadow: ;
        --tw-backdrop-blur: ;
        --tw-backdrop-brightness: ;
        --tw-backdrop-contrast: ;
        --tw-backdrop-grayscale: ;
        --tw-backdrop-hue-rotate: ;
        --tw-backdrop-invert: ;
        --tw-backdrop-opacity: ;
        --tw-backdrop-saturate: ;
        --tw-backdrop-sepia: ;
      }

      ::backdrop {
        --tw-border-spacing-x: 0;
        --tw-border-spacing-y: 0;
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
        --tw-pan-x: ;
        --tw-pan-y: ;
        --tw-pinch-zoom: ;
        --tw-scroll-snap-strictness: proximity;
        --tw-gradient-from-position: ;
        --tw-gradient-via-position: ;
        --tw-gradient-to-position: ;
        --tw-ordinal: ;
        --tw-slashed-zero: ;
        --tw-numeric-figure: ;
        --tw-numeric-spacing: ;
        --tw-numeric-fraction: ;
        --tw-ring-inset: ;
        --tw-ring-offset-width: 0px;
        --tw-ring-offset-color: #fff;
        --tw-ring-color: rgb(59 130 246 / 0.5);
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-colored: 0 0 #0000;
        --tw-blur: ;
        --tw-brightness: ;
        --tw-contrast: ;
        --tw-grayscale: ;
        --tw-hue-rotate: ;
        --tw-invert: ;
        --tw-saturate: ;
        --tw-sepia: ;
        --tw-drop-shadow: ;
        --tw-backdrop-blur: ;
        --tw-backdrop-brightness: ;
        --tw-backdrop-contrast: ;
        --tw-backdrop-grayscale: ;
        --tw-backdrop-hue-rotate: ;
        --tw-backdrop-invert: ;
        --tw-backdrop-opacity: ;
        --tw-backdrop-saturate: ;
        --tw-backdrop-sepia: ;
      }

      .fixed {
        position: fixed;
      }

      .bottom-0 {
        bottom: 0px;
      }

      .left-0 {
        left: 0px;
      }

      .table {
        display: table;
      }

      .h-12 {
        height: 3rem;
      }

      .w-1\/2 {
        width: 50%;
      }

      .w-full {
        width: 100%;
      }

      .border-collapse {
        border-collapse: collapse;
      }

      .border-spacing-0 {
        --tw-border-spacing-x: 0px;
        --tw-border-spacing-y: 0px;
        border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
      }

      .whitespace-nowrap {
        white-space: nowrap;
      }

      .border-b {
        border-bottom-width: 1px;
      }

      .border-b-2 {
        border-bottom-width: 2px;
      }

      .border-r {
        border-right-width: 1px;
        border-right-color: #222222;
      }

      .border-main {
        border-color: #ffbd59;
      }

      .bg-main {
        background-color: #00ab55;
      }

      .bg-slate-100 {
        background-color: #f1f5f9;
      }

      .p-3 {
        padding: 0.75rem;
      }

      .px-14 {
        padding-left: 3.5rem;
        padding-right: 3.5rem;
      }

      .px-2 {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      }

      .py-10 {
        padding-top: 2.5rem;
        padding-bottom: 2.5rem;
      }

      .py-3 {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
      }

      .py-4 {
        padding-top: 1rem;
        padding-bottom: 1rem;
      }

      .py-6 {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
      }

      .pb-3 {
        padding-bottom: 0.75rem;
      }

      .pt-3 {
        padding-top: 0.75rem;
      }

      .pl-2 {
        padding-left: 0.5rem;
      }

      .pl-3 {
        padding-left: 0.75rem;
      }

      .pl-4 {
        padding-left: 1rem;
      }

      .pl-5 {
        padding-left: 2rem;
      }

      .pr-3 {
        padding-right: 0.75rem;
      }

      .pr-4 {
        padding-right: 1rem;
      }

      .pr-5 {
        padding-right: 2rem;
      }

      .text-center {
        text-align: center;
      }

      .text-right {
        text-align: right;
      }

      .align-top {
        vertical-align: top;
      }

      .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
      }

      .font-bold {
        font-weight: 700;
      }

      .italic {
        font-style: italic;
      }

      .text-main {
        color: #00ab55;
      }

      .text-neutral-600 {
        color: #525252;
      }

      .text-neutral-700 {
        color: #404040;
      }

      .text-slate-300 {
        color: #cbd5e1;
      }

      .text-slate-400 {
        color: #94a3b8;
      }

      .text-white {
        color: #fff;
      }

      @page {
        margin: 0;
      }

      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
      header{
        z-index: 999;
        position: fixed;
        background-color: #ffbd59;
        width: 100%;
        height: 14px;
        top:  0;
      }
      footer svg{
        z-index: 999;
        position: fixed;
        bottom:  0;
        left: 0;
      }
      .top-bar-img {
        z-index: 999;
        position: fixed;
        top: 0;
        right: 0;
      }
      .main-background-color {
        background-color: #ffbd59;
      }
      .tr-background-color {
        background-color: #E7E7E7;
      }
      .conditional-section {
        page-break-before: always;
        margin-top: 50px;
      }
    </style>
  </head>

  <body>
    <header>
      <svg class="top-bar-img" width="340" height="51" viewBox="0 0 340 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0L340 -1V25H20.5282L0 0Z" fill="#222222"/>
        <path d="M244.5 25H282L263.5 51H226L244.5 25Z" fill="#B87C21"/>
        <path d="M110 25H244L263.5 51H129.5L110 25Z" fill="#FFBD59"/>
        <path d="M91 0H225L244.5 26H110.5L91 0Z" fill="#FFBD59"/>
        </svg>
    </header>
    <div class="py-4" style="margin-top:20px">
      <div class="px-14 py-6">
        <table class="w-full border-collapse border-spacing-0">
          <tbody>
            <tr>
              <td class="w-full align-top" style="position: relative">
                <div
                  style="
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    object-fit: contain;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                  "
                >
                  <img
                    src="${serverHostFile || SERVER_FILE_HOST}${quotation.application.appLogo}"
                    class="h-12"
                    style="height: 100%; object-fit: contain"
                  />
                </div>
              </td>

              <td class="align-top">
                <div class="text-sm">
                  <table class="border-collapse border-spacing-0">
                    <tbody>
                      <tr>
                        <td class="border-r pr-5">
                          <div>
                            <p
                              class="whitespace-nowrap text-slate-400 text-right"
                            >
                              Date
                            </p>
                           
                            <p class="whitespace-nowrap text-right">
                            ${dayjs(quotation.quotationDate).format('MMMM DD, YYYY')}
                            </p>
                          </div>
                        </td>
                        <td class="pl-5">
                          <div>
                            <p
                              class="whitespace-nowrap text-slate-400 text-right"
                            >
                              Quotation #
                            </p>
                            <p class="whitespace-nowrap text-right">${quotation.ref}</p>
                            <p class="whitespace-nowrap text-slate-400 text-right">Status: ${quotation.status}</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-14 py-6 text-sm">
        <table class="w-full border-collapse border-spacing-0">
          <tbody>
            <tr>
              <td class="w-1/2 align-top">
                <div class="text-sm text-neutral-600">
                  <p class="font-bold">${quotation.application?.name}</p>
                  <p>Number: ${quotation?.application?.phoneNumber}</p>
                  <p>Tax/Vat: ${quotation?.application?.taxNumber}</p>
                  <p>${quotation.application?.address?.city}</p>
                  <p>${quotation.application?.address?.state}</p>
                  <p>${quotation.application?.address?.country}</p>
                </div>
              </td>
              <td class="w-1/2 align-top text-right">
                <div class="text-sm text-neutral-600">
                  <p
                    class="font-bold"
                    style="text-transform: capitalize !important"
                  >
                    ${quotation.customer.name}
                  </p>
                  <p>Number: ${quotation.customer.phoneNumber}</p>
                  <p>Tax/Vat: ${quotation.customer.taxNumber}</p>
                  <p>${quotation.customer?.address?.street}</p>
                  <p>${quotation.customer?.address?.country}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-14 py-10 text-sm text-neutral-700">
        <table class="w-full border-collapse border-spacing-0">
          <thead>
            <tr class="main-background-color">
              <td
                class="border-b-2 border-main pb-3 pt-3 pl-3 font-bold text-white"
              >
                #
              </td>
              <td
                class="border-b-2 border-main pb-3 pt-3 pl-2 font-bold text-white"
              >
                Product Name
              </td>
              <td
                class="border-b-2 border-main pb-3 pt-3 pl-2 text-right font-bold text-white"
              >
                Rate
              </td>
              <td
                class="border-b-2 border-main pb-3 pt-3 pl-2 text-center font-bold text-white"
              >
                Quantity
              </td>
              <td
                class="border-b-2 border-main pb-3 pt-3 pl-2 text-center font-bold text-white"
              >
                Total
              </td>
            </tr>
          </thead>
          <tbody>
            ${quotation.productToQuotation?.map(
              (product, idx) => `
            <tr ${idx % 2 !== 0 && 'class="tr-background-color"'}>
              <td class="border-b py-3 pl-3">${idx}.</td>
              <td class="border-b py-3 pl-2">${product.product.name}</td>
              <td class="border-b py-3 pl-2 text-right">
                ${fCurrency(product.snapshotProductPrice || product.product.price, quotation.application.currencySymbol)}
              </td>
              <td class="border-b py-3 pl-2 text-center">
                ${product?.quantity}
              </td>
              <td class="border-b py-3 pl-2 text-center">
                ${fCurrency(product.snapshotProductPrice * product.quantity, quotation.application.currencySymbol)}
              </td>
            </tr>
            `,
            )}
            <tr>
              <td colspan="7">
                <table class="w-full border-collapse border-spacing-0">
                  <tbody>
                    <tr>
                      <td class="w-full"></td>
                      <td>
                        <table class="w-full border-collapse border-spacing-0">
                          <tbody>
                            <tr>
                              <td class="border-b p-3">
                                <div class="whitespace-nowrap text-slate-400">
                                  Subtotal:
                                </div>
                              </td>
                              <td class="border-b p-3 text-right">
                                <div class="whitespace-nowrap font-bold">
                                ${fCurrency(quotation?.totalAmount, quotation.application.currencySymbol)}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-400">
                                  Discount:
                                </div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold">
                                  ${quotation?.discount}%
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-400">
                                  Tax (${quotation?.snapshotTaxPercentage || '0'}%):
                                </div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold">
                                ${
                                  quotation?.snapshotTaxPercentage
                                    ? fCurrency(
                                        calculateTax(
                                          quotation?.totalAmount - quotation?.totalAmount * (quotation?.discount / 100),
                                          quotation?.snapshotTaxPercentage,
                                        ),
                                        quotation.application.currencySymbol,
                                      )
                                    : '-'
                                }
                                </div>
                              </td>
                            </tr>
                            <tr class="tr-background-color">
                              <td class="p-3">
                                <div
                                  class="whitespace-nowrap text-slate-400"
                                >
                                  Total:
                                </div>
                              </td>
                              <td class="p-3 text-right">
                                <div
                                  class="whitespace-nowrap font-bold"
                                >
                                ${
                                  fCurrency(
                                    calculateAfterTax(
                                      quotation?.totalAmount - quotation?.totalAmount * (quotation?.discount / 100),
                                      quotation?.snapshotTaxPercentage,
                                    ),
                                    quotation.application.currencySymbol,
                                  ) || '-'
                                }
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    <div>
      <div class="${quotation.productToQuotation?.length > 8 && 'conditional-section'} py-6 text-sm">

            ${
              quotation.productToQuotation?.length > 8
                ? ` <div class="px-14 py-6 text-sm">
        <table class="w-full border-collapse border-spacing-0">
          <tbody>
            <tr>
              <td class="w-1/2 align-top">
                <div class="text-sm text-neutral-600">
                  <p class="font-bold">${quotation.application?.name}</p>
                  <p>Number: ${quotation?.application?.phoneNumber}</p>
                  <p>Tax/Vat: ${quotation?.application?.taxNumber}</p>
                  <p>${quotation.application?.address?.city}</p>
                  <p>${quotation.application?.address?.state}</p>
                  <p>${quotation.application?.address?.country}</p>
                </div>
              </td>
              <td class="w-1/2 align-top text-right">
                <div class="text-sm text-neutral-600">
                  <p
                    class="font-bold"
                    style="text-transform: capitalize !important"
                  >
                    ${quotation.customer.name}
                  </p>
                  <p>Number: ${quotation.customer.phoneNumber}</p>
                  <p>Tax/Vat: ${quotation.customer.taxNumber}</p>
                  <p>${quotation.customer?.address?.street}</p>
                  <p>${quotation.customer?.address?.country}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>`
                : ''
            }

        <table class="w-full border-collapse border-spacing-0">
          <tbody>
            <tr>
              <td class="w-1/2 align-top">
                <div class="px-14 py-5 text-sm text-neutral-700">
                  <p class="font-bold">Terms & Conditions:</p>
                  <p class="italic">Delivery within 1/2 days from P.O. and advance payment.</p>
                  <p class="italic">Payment 100% advance and before delivery.</p>
                  <p class="italic">Delivery: Ex-factory.</p>
                  <p class="italic">Warranty: One year "Against Manufacturing defects".the warranty does not include preventive maintenance consumables, Warranty is limited to using original parts.</p>
                </div>
              </td>
              <td  class="px-14" style="display: flex; justify-content: right;">
                <div class="text-sm text-neutral-600" >
                  <div class="pt-3" style="display: flex; align-items: center; gap: 10px;">
                    <span><svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.8589 0H2.13672C1.44608 0 0.886719 0.562833 0.886719 1.25V8.75C0.886719 9.44125 1.45019 10 2.13672 10H13.8589C14.5438 10 15.1089 9.44361 15.1089 8.75V1.25C15.1089 0.564056 14.5518 0 13.8589 0ZM13.6839 0.833333C13.4285 1.08736 9.03347 5.45925 8.88172 5.61019C8.64561 5.84631 8.33172 5.97631 7.99783 5.97631C7.66394 5.97631 7.35005 5.84628 7.11316 5.60942C7.01111 5.50789 2.66458 1.18428 2.31177 0.833333H13.6839ZM1.72005 8.58039V1.42014L5.32111 5.00222L1.72005 8.58039ZM2.3123 9.16667L5.91194 5.58992L6.52469 6.19944C6.91819 6.59294 7.44136 6.80964 7.99783 6.80964C8.5543 6.80964 9.07747 6.59294 9.47019 6.20022L10.0837 5.58992L13.6834 9.16667H2.3123ZM14.2756 8.58039L10.6746 5.00222L14.2756 1.42014V8.58039Z" fill="#222222"/>
                      </svg>
                      </span>
                    <p class="font-bold">${quotation?.application?.email}</p>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.066 8.67247C10.7793 8.37403 10.4336 8.21448 10.0672 8.21448C9.70379 8.21448 9.35513 8.37108 9.05669 8.66951L8.12298 9.60028C8.04615 9.55891 7.96933 9.5205 7.89546 9.48208C7.78909 9.4289 7.68862 9.37866 7.60293 9.32548C6.72831 8.76998 5.93347 8.04605 5.17113 7.10938C4.80178 6.64252 4.55358 6.24953 4.37334 5.85064C4.61563 5.62903 4.8402 5.39855 5.05885 5.17694C5.14159 5.09421 5.22432 5.00852 5.30705 4.92579C5.92756 4.30528 5.92756 3.50157 5.30705 2.88107L4.5004 2.07441C4.4088 1.98281 4.31424 1.88825 4.2256 1.7937C4.04831 1.6105 3.86216 1.4214 3.6701 1.24411C3.38348 0.960448 3.04073 0.809753 2.68024 0.809753C2.31975 0.809753 1.97109 0.960448 1.67561 1.24411C1.67265 1.24706 1.67265 1.24706 1.6697 1.25002L0.665068 2.26351C0.286854 2.64173 0.0711541 3.10268 0.0238773 3.63749C-0.0470378 4.5003 0.207075 5.304 0.402091 5.82995C0.880769 7.1212 1.59583 8.31789 2.66251 9.60028C3.95671 11.1456 5.51389 12.366 7.29268 13.2258C7.97228 13.5479 8.87941 13.9291 9.8929 13.9941C9.95495 13.997 10.02 14 10.0791 14C10.7616 14 11.3348 13.7547 11.784 13.2672C11.7869 13.2613 11.7928 13.2583 11.7958 13.2524C11.9494 13.0663 12.1267 12.8978 12.3129 12.7176C12.4399 12.5964 12.5699 12.4694 12.697 12.3364C12.9895 12.0321 13.1432 11.6775 13.1432 11.3141C13.1432 10.9477 12.9866 10.596 12.6881 10.3006L11.066 8.67247ZM12.1238 11.7839C12.1208 11.7839 12.1208 11.7868 12.1238 11.7839C12.0085 11.908 11.8903 12.0203 11.7633 12.1444C11.5712 12.3276 11.3762 12.5196 11.193 12.7353C10.8946 13.0544 10.543 13.2051 10.082 13.2051C10.0377 13.2051 9.99041 13.2051 9.94609 13.2022C9.06851 13.146 8.25299 12.8033 7.64135 12.5107C5.96893 11.7011 4.5004 10.5517 3.28006 9.095C2.27248 7.88058 1.59878 6.75776 1.15261 5.5522C0.877814 4.81646 0.777351 4.24323 0.821673 3.7025C0.851221 3.35679 0.984187 3.07017 1.22943 2.82493L2.23702 1.81734C2.38181 1.68142 2.53546 1.60755 2.68615 1.60755C2.8723 1.60755 3.023 1.71983 3.11755 1.81438C3.12051 1.81734 3.12346 1.82029 3.12641 1.82325C3.30666 1.99167 3.47804 2.16601 3.65828 2.35216C3.74988 2.44671 3.84443 2.54126 3.93898 2.63877L4.74564 3.44543C5.05885 3.75864 5.05885 4.04821 4.74564 4.36142C4.65995 4.44711 4.57722 4.5328 4.49153 4.61553C4.24333 4.86964 4.00694 5.10603 3.74988 5.3365C3.74397 5.34241 3.73806 5.34537 3.7351 5.35128C3.48099 5.60539 3.52827 5.85359 3.58145 6.02202C3.58441 6.03088 3.58736 6.03974 3.59032 6.04861C3.80011 6.55683 4.09559 7.03551 4.54472 7.60579L4.54767 7.60874C5.3632 8.61337 6.22304 9.39639 7.17153 9.99622C7.29268 10.073 7.41678 10.1351 7.53497 10.1942C7.64135 10.2474 7.74181 10.2976 7.8275 10.3508C7.83932 10.3567 7.85114 10.3656 7.86296 10.3715C7.96342 10.4217 8.05797 10.4453 8.15548 10.4453C8.40073 10.4453 8.55438 10.2917 8.60461 10.2415L9.61515 9.23092C9.71561 9.13046 9.87517 9.00932 10.0613 9.00932C10.2445 9.00932 10.3952 9.12455 10.4868 9.22501C10.4898 9.22797 10.4898 9.22797 10.4927 9.23092L12.1208 10.859C12.4252 11.1604 12.4252 11.4707 12.1238 11.7839Z" fill="#222222"/>
                      <path d="M7.56662 3.33024C8.34078 3.46025 9.04402 3.82665 9.60543 4.38806C10.1668 4.94947 10.5303 5.65271 10.6633 6.42687C10.6958 6.62189 10.8642 6.75781 11.0562 6.75781C11.0799 6.75781 11.1006 6.75485 11.1242 6.7519C11.3429 6.71644 11.4876 6.5096 11.4522 6.29095C11.2926 5.35428 10.8494 4.50034 10.1728 3.82369C9.49611 3.14704 8.64217 2.70382 7.7055 2.54427C7.48685 2.50881 7.28296 2.65359 7.24455 2.86929C7.20614 3.08499 7.34797 3.29478 7.56662 3.33024Z" fill="#222222"/>
                      <path d="M13.9845 6.17568C13.7215 4.63328 12.9947 3.22975 11.8777 2.11284C10.7608 0.995923 9.3573 0.269043 7.81489 0.00606615C7.59919 -0.0323462 7.39531 0.115394 7.3569 0.331094C7.32144 0.549749 7.46623 0.75363 7.68488 0.792042C9.06182 1.02547 10.3176 1.67848 11.3163 2.67425C12.315 3.67297 12.9651 4.92876 13.1985 6.30569C13.231 6.50071 13.3995 6.63663 13.5915 6.63663C13.6152 6.63663 13.6358 6.63368 13.6595 6.63072C13.8752 6.59822 14.0229 6.39138 13.9845 6.17568Z" fill="#222222"/>
                      </svg>
                      </span>
                      <p class="font-bold"><span></span> ${quotation?.application?.phoneNumber}</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
        <footer>
          <svg width="338" height="40" viewBox="0 0 296 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M289.5 27H0V35H296L289.5 27Z" fill="#222222"/>
            <path d="M195 34.5H65L37 0H171.5L195 34.5Z" fill="#FFBD59"/>
            <path d="M37 0L19 27H59L37 0Z" fill="#B87C21"/>
            </svg>
        </footer>
     </div>
  </div>
  </body>
</html>
`;
};
