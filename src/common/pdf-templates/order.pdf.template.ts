/* eslint-disable prettier/prettier */
import * as dayjs from 'dayjs';
import { calculateAfterTax, calculateTax, fCurrency } from '../helpers/format-number';
import { SERVER_FILE_HOST } from '../constants/global';

export const HtmlOrder = (order, serverHostFile = null) => {
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
    <title>Order</title>
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
        border-color: #0CBB97;
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
      .top-bar {
        width: 100%;
        height: 14px;
        background-color: #ffbd59;
        z-index: 1;
      }
      footer > svg{
        z-index: 999;
        bottom:  0;
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
      }

      footer > .bottom-bar-dark{
        bottom: 0;
        width: 40%;
        left: 0;
        height: 38px;
        background-color: #121415;
        z-index: 1;
        position: absolute;
      }
      footer > .bottom-bar-green{
        bottom: 0;
        width: 40%;
        right: 0;
        height: 38px;
        position: absolute;
        background-color: #0CBB97;
        z-index: 1;
      } 

      .top-bar {
        width: 30%;
        height: 28px;
        background-color: #0CBB97;
        z-index: 1;
      }
      .top-bar-img {
        z-index: 999;
        top: 0;
        left: 30%;
        position: absolute;
      }
      .main-background-color {
        background-color: #0CBB97;
      }
      .tr-background-color {
        background-color: #E7E7E7;
      }
      .zi-999{
        z-index: 9999;
      }
    </style>
  </head>

  <header>
    <div class="top-bar"></div>
      <svg class="top-bar-img" width="341" height="28" viewBox="0 0 341 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M316.464 28H0V0H341L316.464 28Z" fill="#0CBB97"/>
      </svg>
  </header>
    <div class="py-4">
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
                    src="${serverHostFile || SERVER_FILE_HOST}${order.application.appLogo}"
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
                            ${dayjs().format('MMMM DD, YYYY')}
                            </p>
                          </div>
                        </td>
                        <td class="pl-5">
                          <div>
                            <p
                              class="whitespace-nowrap text-slate-400 text-right"
                            >
                              Order #
                            </p>
                            <p class="whitespace-nowrap text-right">${order.ref}</p>
                            <p
                              class="whitespace-nowrap text-slate-400 text-right"
                            >
                              Status: ${order.status}
                            </p>
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
                  <p class="font-bold">${order.application?.name}</p>
                  <p>Number: ${order?.application?.phoneNumber}</p>
                  <p>Tax/Vat: ${order?.application?.taxNumber}</p>
                  <p>${order.application?.address?.city}</p>
                  <p>${order.application?.address?.state}</p>
                  <p>${order.application?.address?.country}</p>
                </div>
              </td>
              <td class="w-1/2 align-top text-right">
                <div class="text-sm text-neutral-600">
                  <p
                    class="font-bold"
                    style="text-transform: capitalize !important"
                  >
                    ${order.customer.name}
                  </p>
                  <p>Number: ${order.customer.phoneNumber}</p>
                  <p>Tax/Vat: ${order.customer.taxNumber}</p>
                  <p>${order.customer?.address?.street}</p>
                  <p>${order.customer?.address?.country}</p>
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
            ${order.productToOrder?.map(
              (product, idx) => `
            <tr ${idx % 2 === 0 && 'class="tr-background-color"'}>
              <td class="border-b py-3 pl-3">${idx}.</td>
              <td class="border-b py-3 pl-2">${product.product.name}</td>
              <td class="border-b py-3 pl-2 text-right">
                ${fCurrency(product.snapshotProductPrice || product.product.price, order.application.currencySymbol)}
              </td>
              <td class="border-b py-3 pl-2 text-center">
                ${product?.quantity}
              </td>
              <td class="border-b py-3 pl-2 text-center">
                ${fCurrency(product.snapshotProductPrice * product.quantity, order.application.currencySymbol)}
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
                                <div class="whitespace-nowrap font-bold">
                                  Subtotal:
                                </div>
                              </td>
                              <td class="border-b p-3 text-right">
                                <div class="whitespace-nowrap text-slate-400">
                                  ${fCurrency(order?.totalOrderAmount, order.application.currencySymbol)}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap font-bold">
                                  Discount:
                                </div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap">
                                  ${order?.discount}%
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap font-bold">
                                  Tax (${order?.snapshotTaxPercentage || '0'}%):
                                </div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap text-slate-400">
                                  ${
                                    order?.snapshotTaxPercentage
                                      ? fCurrency(
                                          calculateTax(
                                            order?.totalOrderAmount - order?.totalOrderAmount * (order?.discount / 100),
                                            order?.snapshotTaxPercentage,
                                          ),
                                          order.application.currencySymbol,
                                        )
                                      : '-'
                                  }
                                </div>
                              </td>
                            </tr>
                            <tr class="tr-background-color">
                              <td class="p-3">
                                <div
                                  class="whitespace-nowrap font-bold"
                                >
                                  Total:
                                </div>
                              </td>
                              <td class="p-3 text-right">
                                <div
                                  class="whitespace-nowrap text-slate-400"
                                >
                                  ${
                                    fCurrency(
                                      calculateAfterTax(
                                        order?.totalOrderAmount - order?.totalOrderAmount * (order?.discount / 100),
                                        order?.snapshotTaxPercentage,
                                      ),
                                      order.application.currencySymbol,
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
    


    <div style="position: absolute; bottom: 50px;">
      <div class=" py-6 text-sm">
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
              <td  class="px-14 py-5 text-sm text-neutral-700" style="display: flex; justify-content: right;">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="fixed zi-999 bottom-0 left-0 w-full text-white text-neutral-600 text-xs pl-5 py-3">
      ${order?.application?.name}
      <span class="text-main px-2">|</span>
      ${order?.application?.email}
      <span class="text-main px-2">|</span>
      ${order?.application?.phoneNumber}
    </div>
    <footer>
      <div class="bottom-bar-dark">
      </div>
      <div class="bottom-bar-green">
      </div>
        <svg width="595" height="38" viewBox="0 0 595 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M316.464 38H0V0H341L316.464 38Z" fill="#121415"/>
        <path d="M349 0L325 38H336.766H595V0H349Z" fill="#0CBB97"/>
        </svg>
    </footer>
  </div>
  </body>
</html>
`;
};
