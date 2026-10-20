import { useEffect, useState } from 'react';
import './styles.css';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://marjonsealza-paymongo.emeritabuilder.workers.dev').replace(/\/$/, '');

type Product = { id:string; name:string; description:string; category:string; price:number; available:boolean };
type Order = { reference_number:string; status:string; total_amount:number; currency:string; created_at:string; paid_at:string|null; fulfillment_status:string };

async function call<T>(path:string, token:string, init?:RequestInit):Promise<T>{
  const response=await fetch(`${API_BASE}${path}`,{...init,headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`,...(init?.headers||{})}});
  const body=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(body.error||'Request failed');
  return body as T;
}

const money=(n:number)=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP'}).format(n);

export default function Admin(){
  const [token,setToken]=useState('');
  const [authenticated,setAuthenticated]=useState(false);
  const [tab,setTab]=useState<'orders'|'products'>('orders');
  const [orders,setOrders]=useState<Order[]>([]);
  const [products,setProducts]=useState<Product[]>([]);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [busy,setBusy]=useState(false);
  const [draft,setDraft]=useState({id:'',name:'',description:'',category:'General',price:'',available:true});

  async function load(){
    setError('');setBusy(true);
    try{
      const [o,p]=await Promise.all([call<{orders:Order[]}>('/api/admin/orders',token),call<{products:Product[]}>('/api/admin/products',token)]);
      setOrders(Array.isArray(o?.orders) ? o.orders : []);
      setProducts(Array.isArray(p?.products) ? p.products : []);
      setAuthenticated(true);
    }catch(e){setAuthenticated(false);setError(e instanceof Error?e.message:'Could not load admin data');}
    finally{setBusy(false);}
  }

  useEffect(()=>{ if(authenticated) void load(); /* manual refresh only */ },[tab]); // intentionally no token persistence

  async function addProduct(e:React.FormEvent){
    e.preventDefault();setError('');setNotice('');
    try{
      await call('/api/admin/products',token,{method:'POST',body:JSON.stringify({...draft,price:Number(draft.price)})});
      setNotice('Product created.');setDraft({id:'',name:'',description:'',category:'General',price:'',available:true});await load();
    }catch(err){setError(err instanceof Error?err.message:'Unable to create product');}
  }

  async function updateProduct(product:Product){
    const priceText=window.prompt(`Price in PHP for ${product.name}`,String(product.price));
    if(priceText===null)return;
    const price=Number(priceText);if(!Number.isFinite(price)||price<=0){setError('Enter a valid positive price.');return;}
    try{await call(`/api/admin/products/${encodeURIComponent(product.id)}`,token,{method:'PATCH',body:JSON.stringify({...product,price})});setNotice('Product updated.');await load();}
    catch(e){setError(e instanceof Error?e.message:'Unable to update product');}
  }

  async function fulfillment(order:Order){
    const value=window.prompt('Set fulfillment: unfulfilled, processing, shipped, completed, cancelled',order.fulfillment_status);
    if(!value)return;
    try{await call('/api/admin/orders/fulfillment',token,{method:'POST',body:JSON.stringify({referenceNumber:order.reference_number,fulfillmentStatus:value})});setNotice('Fulfillment status updated.');await load();}
    catch(e){setError(e instanceof Error?e.message:'Unable to update fulfillment');}
  }

  return <div className="site-shell admin-shell">
    <header className="topbar"><a className="brand" href="/"><span className="brand-mark">MS</span><span>MARJON SEALZA<small>STORE ADMINISTRATION</small></span></a><a href="/">← Back to website</a></header>
    <main className="content-section">
      <p className="eyebrow">RESTRICTED AREA</p><h1>Store administration</h1>
      {!authenticated?<section className="checkout-form admin-login"><h2>Admin sign-in</h2><p className="muted">Enter the configured admin API token. It is held in memory for this page only and is not saved in browser storage.</p>
        <form onSubmit={e=>{e.preventDefault();void load();}}><label>Admin API token<input type="password" required autoComplete="current-password" value={token} onChange={e=>setToken(e.target.value)}/></label><button className="button button-wide" disabled={busy}>{busy?'Checking access…':'Sign in'}</button></form>
      </section>:<>
        {error&&<p className="error">{error}</p>}
        {notice&&<p role="status">{notice}</p>}
        <div className="admin-toolbar"><button className={`button ${tab==='orders'?'':'button-ghost'}`} onClick={()=>setTab('orders')}>Orders</button><button className={`button ${tab==='products'?'':'button-ghost'}`} onClick={()=>setTab('products')}>Products</button><button className="button button-ghost" onClick={()=>void load()}>Refresh</button><button className="button button-ghost" onClick={()=>{setAuthenticated(false);setToken('');setOrders([]);setProducts([]);}}>Sign out</button></div>
        {tab==='orders'?<div className="admin-table-wrap"><h2>Recent orders</h2><table className="admin-table"><thead><tr><th>Reference</th><th>Payment</th><th>Total</th><th>Created</th><th>Fulfillment</th><th>Action</th></tr></thead><tbody>{(orders||[]).map(o=><tr key={o.reference_number}><td>{o.reference_number}</td><td>{o.status}</td><td>{money(o.total_amount)}</td><td>{new Date(o.created_at+'Z').toLocaleString()}</td><td>{o.fulfillment_status}</td><td><button className="button button-small" disabled={o.status!=='paid'} onClick={()=>void fulfillment(o)}>Update</button></td></tr>)}</tbody></table>{!(orders||[]).length&&<p className="muted">No orders found.</p>}</div>:
        <div className="admin-products"><section className="checkout-form"><h2>Add product</h2><form onSubmit={addProduct}><label>Product ID (unique)<input required pattern="[a-zA-Z0-9-]+" value={draft.id} onChange={e=>setDraft({...draft,id:e.target.value})}/></label><label>Name<input required maxLength={120} value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label><label>Description<textarea maxLength={2000} value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})}/></label><label>Category<input maxLength={80} value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}/></label><label>Price (PHP)<input required type="number" min="0.01" step="0.01" value={draft.price} onChange={e=>setDraft({...draft,price:e.target.value})}/></label><label className="check-label"><input type="checkbox" checked={draft.available} onChange={e=>setDraft({...draft,available:e.target.checked})}/> Available for sale</label><button className="button button-wide">Create product</button></form></section><section className="admin-table-wrap"><h2>Catalog</h2><table className="admin-table"><thead><tr><th>Product</th><th>Price</th><th>Availability</th><th>Action</th></tr></thead><tbody>{(products||[]).map(p=><tr key={p.id}><td><strong>{p.name}</strong><small>{p.id}</small></td><td>{money(p.price)}</td><td>{p.available?'Available':'Hidden'}</td><td><button className="button button-small" onClick={()=>void updateProduct(p)}>Edit price</button></td></tr>)}</tbody></table></section></div>}
      </>}
    </main>
  </div>;
}
