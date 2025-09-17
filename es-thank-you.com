<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Gracias — Edunancial</title>
  <style>
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111;background:#fff}
    main{max-width:720px;margin:28px auto;padding:0 16px}
    .card{border:1px solid #e6e6ea;border-radius:12px;padding:18px;background:#fff}
    h1{margin:0 0 12px}
    .muted{color:#555}
    .row{display:flex;gap:10px;margin:8px 0}
    .row b{width:140px}
    a.btn{display:inline-block;margin-top:14px;padding:10px 14px;border-radius:8px;background:#0b2e4f;color:#fff;text-decoration:none}
  </style>
</head>
<body>
  <header class="site-banner"></header>
  <main>
    <div class="card">
      <h1>¡Gracias por tu compra!</h1>
      <p class="muted">Tu pago se procesó correctamente.</p>
      <div class="row"><b>ID de Pedido:</b> <span id="orderId">—</span></div>
      <div class="row"><b>Monto Pagado:</b> <span id="paid">—</span></div>
      <div class="row"><b>Cliente:</b> <span id="payer">—</span></div>
      <a class="btn" href="/index.html">Volver al Inicio</a>
    </div>
  </main>
  <script>
    const q=new URLSearchParams(location.search);
    document.getElementById('orderId').textContent=q.get('orderId')||'N/A';
    document.getElementById('paid').textContent=q.get('paid')?('$'+q.get('paid')):'N/A';
    document.getElementById('payer').textContent=q.get('payer')||'Cliente';
  </script>
</body>
</html>
