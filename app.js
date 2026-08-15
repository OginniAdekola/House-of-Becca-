const K='hbpos';const seed={products:[['Samsung 55" Smart TV','Electronics',420000,350000,12],['Electric Fan 16"','Electronics',28000,22000,25],['Binatone Blender BLG-450','Kitchen',45000,36000,8],['Rice Cooker 2.8L','Kitchen',35000,27000,15],['Steam Iron','Household',12500,9000,20],['LED Bulb 9W','Electrical',1200,700,100],['Extension Box 4 Way','Electrical',4000,2600,30],['Electric Kettle 2.0L','Kitchen',18000,13000,18],['Midea Microwave 20L','Electronics',65000,53000,7]].map((x,i)=>({id:'P'+i,name:x[0],cat:x[1],price:x[2],cost:x[3],stock:x[4]})),sales:[]};let db=JSON.parse(localStorage.getItem(K)||'null')||seed,cart=[],pay='Cash';const ng=n=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n||0);const save=()=>localStorage.setItem(K,JSON.stringify(db));
function go(id){document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');if(id==='home')home();if(id==='sale'){renderSale();renderCart()}if(id==='payment')renderPay();if(id==='products')renderProducts();if(id==='history')renderHistory();if(id==='reports')reports();scrollTo(0,0)}
function home(){date.textContent=new Date().toLocaleDateString('en-NG',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});let t=new Date().toDateString(),s=db.sales.filter(x=>new Date(x.date).toDateString()===t),v=s.reduce((a,x)=>a+x.total,0),p=s.reduce((a,x)=>a+x.profit,0);sales.textContent=ng(v);tx.textContent=s.length;profit.textContent=ng(p);low.textContent=db.products.filter(x=>x.stock<=5).length;bars.innerHTML=[12,30,48,40,65,52,72,88].map(x=>`<i class="bar" style="height:${x}%"></i>`).join('');recent.innerHTML=db.sales.slice(-5).reverse().map(x=>`<div class="item"><span><b>${x.receipt}</b><small>${new Date(x.date).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</small></span><b>${ng(x.total)}</b></div>`).join('')||'<small>No sales yet.</small>'}
function renderSale(){
 const search=document.getElementById('saleSearch');
 const box=document.getElementById('saleProducts');
 const q=(search?.value||'').toLowerCase();
 const list=db.products.filter(prod=>prod.stock>0 && prod.name.toLowerCase().includes(q));
 box.innerHTML=list.map(prod=>`<div class="saleItem"><div><b>${prod.name}</b><small>${prod.cat} · ${prod.stock} in stock · ${ng(prod.price)}</small></div><button class="add" onclick="addItem('${prod.id}')">ADD</button></div>`).join('')||'<small>No products available. Add a product first.</small>';
}
let pendingId=null;
function addItem(id){
 const prod=db.products.find(x=>x.id===id);
 if(!prod)return alert('Product not found.');
 const productLabel=document.getElementById('itemModalProduct');
 const modal=document.getElementById('itemModal');
 if(!productLabel || !modal){
   return alert('Item details form is missing. Please refresh the app.');
 }
 pendingId=id;
 productLabel.textContent=prod.name+' · '+ng(prod.price);
 document.getElementById('itemModel').value='';
 document.getElementById('itemSerial').value='';
 modal.classList.add('show');
 setTimeout(()=>document.getElementById('itemSerial').focus(),50);
}
function closeItemModal(){
 document.getElementById('itemModal').classList.remove('show');
 pendingId=null;
}
function saveItemToCart(){
 const prod=db.products.find(x=>x.id===pendingId);
 if(!prod)return alert('Product not found.');
 const model=document.getElementById('itemModel').value.trim();
 const serial=document.getElementById('itemSerial').value.trim();
 const existing=cart.find(x=>x.id===prod.id && x.model===model && x.serial===serial);
 if(existing){
   if(existing.qty>=prod.stock)return alert('Not enough stock.');
   existing.qty++;
 }else{
   cart.push({id:prod.id,name:prod.name,price:prod.price,cost:prod.cost,qty:1,model,serial});
 }
 closeItemModal();
 renderCart();
}
function qty(i,d){
 if(!cart[i])return;
 const prod=db.products.find(x=>x.id===cart[i].id);
 cart[i].qty+=d;
 if(cart[i].qty<=0)cart.splice(i,1);
 else if(cart[i].qty>prod.stock)cart[i].qty=prod.stock;
 renderCart();
}
function renderCart(){let sub=cart.reduce((a,x)=>a+x.qty*x.price,0),d=Math.min(sub,+discount.value||0),tot=sub-d;document.getElementById('cart').innerHTML=cart.map((x,i)=>`<div class="cartline"><span><b>${x.name}</b><br><small>${ng(x.price)} × ${x.qty}</small>${x.model?`<small>Model No: ${x.model}</small>`:''}${x.serial?`<small>Serial No: ${x.serial}</small>`:''}</span><span class="qty"><button onclick="qty(${i},-1)">−</button> ${x.qty} <button onclick="qty(${i},1)">+</button></span></div>`).join('')||'<small>Cart is empty.</small>';subtotal.textContent=ng(sub);discountOut.textContent=ng(d);total.textContent=ng(tot)}
function renderPay(){let sub=cart.reduce((a,x)=>a+x.qty*x.price,0),d=Math.min(sub,+discount.value||0),t=sub-d;payTotal.textContent=ng(t);change.textContent=ng(Math.max(0,(+paid.value||0)-t))}function pick(b){document.querySelectorAll('#methods button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')}
function finish(){let sub=cart.reduce((a,x)=>a+x.qty*x.price,0),d=Math.min(sub,+discount.value||0),t=sub-d,pd=+paid.value||0;if(!cart.length)return alert('Cart is empty');if(pd<t)return alert('Amount paid is less than total');let profit=cart.reduce((a,x)=>a+x.qty*(x.price-x.cost),0)-d,r='REC-'+Date.now();let customerName=document.getElementById('customerName').value.trim()||'Walk-in',customerPhone=document.getElementById('customerPhone').value.trim(),customerAddress=document.getElementById('customerAddress').value.trim();cart.forEach(x=>db.products.find(p=>p.id===x.id).stock-=x.qty);let s={receipt:r,date:new Date().toISOString(),customerName,customerPhone,customerAddress,items:cart.map(x=>({...x})),subtotal:sub,discount:d,total:t,paid:pd,change:pd-t,payment:pay,profit};db.sales.push(s);save();receipt(s);cart=[];paid.value='';discount.value=0;document.getElementById('customerName').value='';document.getElementById('customerPhone').value='';document.getElementById('customerAddress').value='';go('receipt')}
function receipt(s){
  receiptPaper.innerHTML=`
  <div class="receipt-header">
    <img src="logo.jpg" class="receipt-logo">
    <div class="company-contact">
      <b>HOUSE OF BECCA VENTURES</b>
      <div>BASHORUN, IBADAN, OYO STATE</div>
      <div>TEL: 08142152688</div>
    </div>
    <div class="tagline">ELEGANCE. QUALITY. THOUGHTFULNESS.</div>
    <div class="receipt-title"><b>RECEIPT</b><span>${s.receipt}</span></div>
  </div>
  <div class="receipt-date row-line"><span>Date</span><span>${new Date(s.date).toLocaleString('en-NG')}</span></div>
  <div class="customer-section">
    <div class="section-heading">CUSTOMER</div>
    <div class="customer-line"><span>Name</span><span>${s.customerName || 'Walk-in'}</span></div>
    ${s.customerPhone?`<div class="customer-line"><span>Phone</span><span>${s.customerPhone}</span></div>`:''}
    ${s.customerAddress?`<div class="customer-line"><span>Address</span><span>${s.customerAddress}</span></div>`:''}
  </div>
  <div class="items-section">
    ${s.items.map(x=>`<div class="receipt-item">
      <div class="item-main"><b>${x.name} × ${x.qty}</b><b>${ng(x.price*x.qty)}</b></div>
      ${x.model?`<div class="item-detail">Model No <span>${x.model}</span></div>`:''}
      ${x.serial?`<div class="item-detail">Serial No <span>${x.serial}</span></div>`:''}
    </div>`).join('')}
  </div>
  <div class="totals-section">
    <div class="total-line"><span>Subtotal</span><b>${ng(s.subtotal)}</b></div>
    <div class="total-line"><span>Discount</span><b>${ng(s.discount)}</b></div>
    <div class="total-line grand"><b>Total</b><b>${ng(s.total)}</b></div>
    <div class="total-line"><span>Paid (${s.payment})</span><b>${ng(s.paid)}</b></div>
    <div class="total-line"><span>Change</span><b>${ng(s.change)}</b></div>
  </div>
  <div class="receipt-footer">Thank you for shopping with us!<br>Goods sold are non-refundable.</div>`
}

function openModal(){
 const modal=document.getElementById('modal');
 if(!modal)return;
 document.getElementById('n').value='';
 document.getElementById('c').value='';
 document.getElementById('p').value='';
 document.getElementById('s').value='';
 modal.classList.add('show');
 setTimeout(()=>document.getElementById('n').focus(),50);
}
function closeModal(){
 const modal=document.getElementById('modal');
 if(modal)modal.classList.remove('show');
}
function renderProducts(){
 const box=document.getElementById('productsList');
 if(!box)return;
 const input=document.getElementById('productSearch');
 const q=(input?.value||'').trim().toLowerCase();
 const list=db.products.filter(p=>
   !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
 );
 box.innerHTML=list.map(p=>{
   const id=String(p.id).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
   return `<div class="product-row">
     <div class="product-info">
       <b>${escapeHtml(p.name)}</b>
       <small>${escapeHtml(p.cat)} · ${p.stock} in stock · ${ng(p.price)}</small>
     </div>
     <button class="delete-product" onclick="deleteProduct('${id}')">DELETE</button>
   </div>`;
 }).join('') || '<small>No products found.</small>';
}
function escapeHtml(value){
 return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function deleteProduct(id){
 const product=db.products.find(p=>String(p.id)===String(id));
 if(!product)return alert('Product not found.');
 if(!confirm(`Delete "${product.name}" from the product list?`))return;
 db.products=db.products.filter(p=>String(p.id)!==String(id));
 // Remove only the product from an unsaved cart; sales history remains intact.
 cart=cart.filter(x=>String(x.id)!==String(id));
 save();
 renderProducts();
 renderSale();
 renderCart();
 alert(`${product.name} deleted successfully.`);
}
function addProduct(){
 const name=document.getElementById('n').value.trim();
 const cat=document.getElementById('c').value.trim()||'Household';
 const price=Number(document.getElementById('p').value);
 const stock=Number(document.getElementById('s').value);
 if(!name)return alert('Enter product name.');
 if(!Number.isFinite(price)||price<=0)return alert('Enter a valid selling price.');
 if(!Number.isFinite(stock)||stock<0)return alert('Enter a valid stock quantity.');
 db.products.push({id:'P'+Date.now(),name,cat,price,cost:price*.8,stock});
 save(); closeModal(); renderProducts(); renderSale();
 alert(name+' added successfully.');
}
function backup(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(db,null,2)],{type:'application/json'}));a.download='house-of-becca-backup.json';a.click()}function resetData(){if(confirm('Reset all demo data?')){localStorage.removeItem(K);location.reload()}}
window.onload=()=>{home();renderProducts();renderSale();renderCart();setTimeout(()=>document.getElementById('splash').remove(),3000)};

function getReceiptElement(){return document.getElementById('receiptPaper');}
function getReceiptText(){const e=getReceiptElement();return e?e.innerText:'HOUSE OF BECCA VENTURES\nBASHORUN, IBADAN, OYO STATE\nTEL: 08142152688';}
function printReceipt(){const e=getReceiptElement();if(!e||!e.innerText.trim()){alert('Complete a sale first to create a receipt.');return;}document.body.classList.add('printing-receipt');setTimeout(()=>window.print(),50);}
function saveReceiptPDF(){const e=getReceiptElement();if(!e||!e.innerText.trim()){alert('Complete a sale first to create a receipt.');return;}document.body.classList.add('printing-receipt');setTimeout(()=>window.print(),50);}
async function shareReceipt(){const text=getReceiptText();try{if(navigator.share){await navigator.share({title:'House of Becca Ventures Receipt',text:text});return;}}catch(err){if(err&&err.name==='AbortError')return;}try{if(navigator.clipboard){await navigator.clipboard.writeText(text);alert('Receipt copied. You can paste it into WhatsApp, Email or another app.');}else{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();alert('Receipt copied.');}}catch(err){alert('Sharing is not available. Please open the app in Chrome on Android.');}}
window.addEventListener('afterprint',()=>document.body.classList.remove('printing-receipt'));
